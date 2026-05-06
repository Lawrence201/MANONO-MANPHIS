import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

// Verify that a payment was successful
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentIntentId = searchParams.get('paymentIntentId');

        if (!paymentIntentId) {
            return NextResponse.json(
                { message: 'Payment Intent ID is required' },
                { status: 400 }
            );
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        return NextResponse.json({
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100, // Convert back from smallest unit
            currency: paymentIntent.currency,
            metadata: paymentIntent.metadata,
            succeeded: paymentIntent.status === 'succeeded',
        });

    } catch (error: any) {
        console.error('Verify Payment Error:', error);
        return NextResponse.json(
            {
                message: 'Failed to verify payment',
                error: error.message || String(error)
            },
            { status: 500 }
        );
    }
}
