/**
 * GCB Payment Gateway Library
 * Based on GCB EPAY API Documentation
 */

// GCB Payment Options
export type GCBPaymentOption = 'momo' | 'card' | 'gcb' | 'mtn' | 'vodafone' | 'airteltigo' | null;

// GCB Status Codes
export const GCB_STATUS = {
    SUCCESS: '00',
    PENDING: '01',
    FAILED: '02',
    EXPIRED: '03',
    NOT_FOUND: '04',
    INTERNAL_ERROR: '05',
} as const;

export const GCB_STATUS_MESSAGES: Record<string, string> = {
    '00': 'Payment Successful',
    '01': 'Payment Pending',
    '02': 'Payment Failed',
    '03': 'Checkout URL Expired',
    '04': 'Checkout ID Not Found',
    '05': 'Internal Error',
};

// Configuration
const GCB_API_URL = process.env.GCB_API_URL || 'https://epayuat.gcbltd.com:98/paymentgateway';
const GCB_API_KEY = process.env.GCB_API_KEY || '';

interface CheckoutRequest {
    merchantRef: string;
    amount: number;
    currency?: string;
    description: string;
    paymentOption?: GCBPaymentOption;
    callbackUrl: string;
}

interface CheckoutResponse {
    checkOutUrl: string;
    checkOutId: string;
}

interface StatusResponse {
    merchantRef: string;
    status: string;
    bankRef: string;
    timeCompleted: string;
    paymentOption: string;
}

/**
 * Generate a unique merchant reference
 * Format: CEA-{timestamp}-{random}
 */
export function generateMerchantRef(): string {
    const timestamp = Date.now().toString(36).toUpperCase().slice(-6);
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CEA${timestamp}${random}`.slice(0, 20); // Max 20 chars
}

/**
 * Initiate a GCB checkout session
 */
export async function initiateCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
    if (!GCB_API_KEY) {
        throw new Error('GCB_API_KEY is not configured');
    }

    const response = await fetch(`${GCB_API_URL}/checkout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': GCB_API_KEY,
        },
        body: JSON.stringify({
            merchantRef: data.merchantRef,
            amount: data.amount,
            currency: data.currency || 'GHS',
            description: data.description,
            paymentOption: data.paymentOption || null,
            callbackUrl: data.callbackUrl,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[GCB] Checkout failed:', response.status, errorText);
        throw new Error(`GCB checkout failed: ${response.status}`);
    }

    const result = await response.json();
    return {
        checkOutUrl: result.checkOutUrl,
        checkOutId: result.checkOutId,
    };
}

/**
 * Check the status of a GCB transaction
 */
export async function checkTransactionStatus(checkoutId: string): Promise<StatusResponse> {
    if (!GCB_API_KEY) {
        throw new Error('GCB_API_KEY is not configured');
    }

    const response = await fetch(`${GCB_API_URL}/transactions/${checkoutId}/status`, {
        method: 'GET',
        headers: {
            'X-Api-Key': GCB_API_KEY,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('[GCB] Status check failed:', response.status, errorText);
        throw new Error(`GCB status check failed: ${response.status}`);
    }

    return await response.json();
}

/**
 * Check if a payment was successful
 */
export function isPaymentSuccessful(status: string): boolean {
    return status === GCB_STATUS.SUCCESS;
}

/**
 * Check if a payment is still pending
 */
export function isPaymentPending(status: string): boolean {
    return status === GCB_STATUS.PENDING;
}

/**
 * Get human-readable status message
 */
export function getStatusMessage(status: string): string {
    return GCB_STATUS_MESSAGES[status] || 'Unknown Status';
}
