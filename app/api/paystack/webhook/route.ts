import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('x-paystack-signature');
        const secret = process.env.PAYSTACK_SECRET_KEY;

        if (!secret) {
            console.error('[Paystack Webhook] Secret key not configured');
            return new Response('Webhook secret not configured', { status: 500 });
        }

        // Verify signature
        const hash = crypto
            .createHmac('sha512', secret)
            .update(body)
            .digest('hex');

        if (hash !== signature) {
            console.error('[Paystack Webhook] Invalid signature');
            return new Response('Invalid signature', { status: 401 });
        }

        const event = JSON.parse(body);

        // Handle successful payment
        if (event.event === 'charge.success') {
            const data = event.data;
            const reference = data.reference;
            const metadata = data.metadata;

            console.log('✅ Paystack Payment Succeeded:', reference);

            // If the metadata contains booking information, we could theoretically 
            // create the booking here if it doesn't already exist.
            // For now, we'll log it as confirmed.

            // Note: In this specific implementation, the booking is created by the frontend 
            // AFTER verification. A more robust way would be to create a 'pending' booking 
            // and update it here, but since the current system creates it in one go, 
            // this webhook acts as a verification log.
        }

        return new Response('Webhook received', { status: 200 });

    } catch (error: any) {
        console.error('[Paystack Webhook] Error:', error);
        return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }
}
