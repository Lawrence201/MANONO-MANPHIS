import { NextRequest, NextResponse } from 'next/server';
import { isPaymentSuccessful, GCB_STATUS } from '@/lib/gcb';

/**
 * GCB Callback Endpoint
 * GCB sends payment notifications here after transaction completion
 * 
 * Expected payload:
 * {
 *   "merchantRef": "A0000000000001",
 *   "statusCode": "00",
 *   "timeCompleted": "2025-03-01 13:05:00",
 *   "bankRef": "139EPAY0000025",
 *   "paymentOption": "card"
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { merchantRef, statusCode, timeCompleted, bankRef, paymentOption } = body;

        console.log('[GCB Callback] Received:', {
            merchantRef,
            statusCode,
            timeCompleted,
            bankRef,
            paymentOption,
        });

        // Validate the callback
        if (!merchantRef || !statusCode) {
            console.error('[GCB Callback] Invalid payload');
            return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
        }

        // Check if payment was successful
        if (isPaymentSuccessful(statusCode)) {
            console.log(`[GCB Callback] Payment successful for ${merchantRef}`);

            // TODO: Update booking status in database
            // This would require storing the merchantRef -> bookingId mapping
            // For now, we'll rely on the frontend status check flow

            // You can implement:
            // 1. Find pending booking by merchantRef
            // 2. Update payment status to 'paid'
            // 3. Send confirmation email
        } else {
            console.log(`[GCB Callback] Payment not successful for ${merchantRef}: ${statusCode}`);
        }

        // Must return 200 OK to acknowledge receipt
        // GCB will retry if any other status code is returned
        return NextResponse.json({ received: true }, { status: 200 });

    } catch (error: any) {
        console.error('[GCB Callback] Error:', error);
        // Still return 200 to prevent retry loops if there's an internal error
        // Log the error for investigation
        return NextResponse.json({ received: true, error: 'Internal processing error' }, { status: 200 });
    }
}
