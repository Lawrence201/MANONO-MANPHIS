import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

async function buffer(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
    const chunks: Uint8Array[] = [];
    const reader = readable.getReader();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) chunks.push(value);
    }

    return Buffer.concat(chunks);
}

export async function POST(request: Request) {
    const body = await buffer(request.body!);
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
        return NextResponse.json(
            { message: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return NextResponse.json(
            { message: `Webhook Error: ${error.message}` },
            { status: 400 }
        );
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('✅ Payment succeeded:', paymentIntent.id);

            // The actual booking creation happens in the frontend after confirmCardPayment
            // This webhook is for backup/reconciliation purposes
            // You could also create bookings here for extra reliability

            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object as Stripe.PaymentIntent;
            console.log('❌ Payment failed:', failedPayment.id);
            // Log failed payment for monitoring
            break;

        case 'charge.refunded':
            const refund = event.data.object as Stripe.Charge;
            console.log('↩️ Payment refunded:', refund.id);

            // Update booking payment status to 'refunded' if needed
            // This would require storing paymentIntentId in the booking
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
