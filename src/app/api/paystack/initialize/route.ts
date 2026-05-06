import { NextRequest, NextResponse } from 'next/server';
import { initializeTransaction, isValidEmail } from '@/lib/paystack';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('[Paystack API] Request Body:', JSON.stringify(body, null, 2));
        const {
            email,
            amount,
            metadata,
            callback_url,
            currency
        } = body;

        const trimmedEmail = email?.trim();
        const isValid = isValidEmail(trimmedEmail);

        console.log(`[Paystack API] Email validation for "${trimmedEmail}": ${isValid}`);

        if (!trimmedEmail || !isValid) {
            return NextResponse.json(
                { status: false, message: 'A valid email address is required' },
                { status: 400 }
            );
        }

        console.log(`[Paystack API] Amount received: ${amount} (Type: ${typeof amount})`);

        if (amount === undefined || amount === null || isNaN(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json(
                { status: false, message: 'A valid transaction amount is required' },
                { status: 400 }
            );
        }

        const numericAmount = Number(amount);

        const result = await initializeTransaction({
            email: trimmedEmail,
            amount: numericAmount,
            metadata,
            callback_url,
            currency
        });

        return NextResponse.json(result);

    } catch (error: any) {
        console.error('[Paystack API] Initialize error:', error);
        return NextResponse.json(
            { status: false, message: error.message || 'Failed to initialize Paystack' },
            { status: 500 }
        );
    }
}
