import { NextRequest, NextResponse } from 'next/server';
import { checkTransactionStatus, isPaymentSuccessful, getStatusMessage } from '@/lib/gcb';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ checkoutId: string }> }
) {
    try {
        const { checkoutId } = await params;

        if (!checkoutId) {
            return NextResponse.json(
                { error: 'Checkout ID is required' },
                { status: 400 }
            );
        }

        const status = await checkTransactionStatus(checkoutId);

        return NextResponse.json({
            success: true,
            merchantRef: status.merchantRef,
            status: status.status,
            statusMessage: getStatusMessage(status.status),
            isSuccessful: isPaymentSuccessful(status.status),
            bankRef: status.bankRef,
            timeCompleted: status.timeCompleted,
            paymentOption: status.paymentOption,
        });

    } catch (error: any) {
        console.error('[GCB] Status check error:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to check payment status' },
            { status: 500 }
        );
    }
}
