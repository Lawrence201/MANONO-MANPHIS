import { NextRequest, NextResponse } from 'next/server';
import { verifyTransaction } from '@/lib/paystack';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json(
                { status: false, message: 'Reference is required' },
                { status: 400 }
            );
        }

        const result = await verifyTransaction(reference);

        if (result.data && result.data.status === 'success') {
            return NextResponse.json({
                status: true,
                message: 'Payment verified successfully',
                data: result.data
            });
        } else {
            return NextResponse.json(
                { status: false, message: 'Payment verification failed', data: result.data },
                { status: 400 }
            );
        }

    } catch (error: any) {
        console.error('[Paystack API] Verify error:', error);
        return NextResponse.json(
            { status: false, message: error.message || 'Failed to verify Paystack' },
            { status: 500 }
        );
    }
}
