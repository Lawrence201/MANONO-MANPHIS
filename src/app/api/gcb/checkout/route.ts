import { NextRequest, NextResponse } from 'next/server';
import { initiateCheckout, generateMerchantRef, GCBPaymentOption } from '@/lib/gcb';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            amount,
            description,
            paymentOption,
            bookingType, // 'hall', 'hostel', 'package'
            bookingData, // Booking details to store temporarily
        } = body;

        // Check if API key is configured
        if (!process.env.GCB_API_KEY || process.env.GCB_API_KEY === 'your_gcb_api_key_here') {
            console.error('[GCB] API key not configured');
            return NextResponse.json(
                { error: 'GCB payment is not yet configured. Please contact the administrator or use Stripe payment instead.' },
                { status: 503 }
            );
        }

        // Validation
        if (!amount || amount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        if (!description) {
            return NextResponse.json(
                { error: 'Description is required' },
                { status: 400 }
            );
        }

        // Generate unique merchant reference
        const merchantRef = generateMerchantRef();

        // Build callback URL
        const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const callbackUrl = `${baseUrl}/payment-confirm?ref=${merchantRef}&type=${bookingType || 'hall'}`;

        // Initiate GCB checkout
        const checkoutResult = await initiateCheckout({
            merchantRef,
            amount: Number(amount),
            description,
            paymentOption: paymentOption as GCBPaymentOption,
            callbackUrl,
        });

        // Store pending transaction in session/temp storage
        // For production, you'd want to use Redis or a database table
        // For now, we'll pass checkoutId back and verify on return

        console.log('[GCB] Checkout initiated:', {
            merchantRef,
            checkoutId: checkoutResult.checkOutId,
            amount,
        });

        return NextResponse.json({
            success: true,
            checkoutUrl: checkoutResult.checkOutUrl,
            checkoutId: checkoutResult.checkOutId,
            merchantRef,
        });

    } catch (error: any) {
        console.error('[GCB] Checkout error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to initiate GCB checkout' },
            { status: 500 }
        );
    }
}
