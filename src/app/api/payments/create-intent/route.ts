import { NextResponse } from 'next/server';
import { stripe, toSmallestUnit, CURRENCY } from '@/lib/stripe';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            amount,
            bookingType,
            metadata
        } = body;

        console.log('Create Payment Intent Request:', { amount, bookingType, metadata });

        // Validate amount
        if (!amount || amount <= 0) {
            console.error('Invalid amount:', amount);
            return NextResponse.json(
                { message: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Validate booking type
        if (!['hall', 'hostel', 'package'].includes(bookingType)) {
            console.error('Invalid booking type:', bookingType);
            return NextResponse.json(
                { message: 'Invalid booking type' },
                { status: 400 }
            );
        }

        const amountInSmallestUnit = toSmallestUnit(amount);
        console.log('Amount in smallest unit (pesewas):', amountInSmallestUnit);

        // Create Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInSmallestUnit,
            currency: CURRENCY,
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                bookingType,
                ...(metadata || {})
            },
        });

        console.log('Payment Intent created:', paymentIntent.id);

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
            amount: amount,
        });

    } catch (error: any) {
        console.error('Create Payment Intent Error:', error);
        console.error('Error type:', error.type);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);

        return NextResponse.json(
            {
                message: 'Failed to create payment intent',
                error: error.message || String(error),
                type: error.type,
                code: error.code
            },
            { status: 500 }
        );
    }
}
