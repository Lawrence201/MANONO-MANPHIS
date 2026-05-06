/**
 * Paystack Payment Gateway Utility
 */

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

if (!PAYSTACK_SECRET_KEY) {
    console.error('PAYSTACK_SECRET_KEY is missing from environment variables');
}

/**
 * Validate email format - simple but effective check
 * Using a more robust regex that handles most valid email formats
 */
export function isValidEmail(email: string): boolean {
    if (!email || typeof email !== 'string') return false;
    const trimmed = email.trim();
    if (trimmed.length === 0) return false;

    // Improved regex: allows common characters, subdomains, and + tags
    // format: local-part@domain.extension
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    const isValid = emailRegex.test(trimmed);
    console.log(`[Paystack Validation] Email: "${trimmed}" - Valid: ${isValid}`);
    return isValid;
}

export interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

export interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data: {
        id: number;
        domain: string;
        status: 'success' | 'abandoned' | 'failed';
        reference: string;
        amount: number;
        message: string | null;
        gateway_response: string;
        paid_at: string;
        created_at: string;
        channel: string;
        currency: string;
        ip_address: string;
        metadata: any;
        customer: {
            id: number;
            first_name: string;
            last_name: string;
            email: string;
            customer_code: string;
            phone: string;
            metadata: any;
            risk_action: string;
        };
    };
}

/**
 * Initialize a transaction with Paystack
 */
export async function initializeTransaction(data: {
    email: string;
    amount: number; // in standard currency (GHS)
    reference?: string;
    callback_url?: string;
    metadata?: any;
    currency?: string;
}): Promise<PaystackInitializeResponse> {
    if (!PAYSTACK_SECRET_KEY) {
        throw new Error('Paystack secret key is not configured');
    }

    const payload = {
        // Aggressively sanitize email: lowercase, trim, remove invisible characters
        email: data.email.trim().toLowerCase().replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, ''),
        amount: Math.max(100, Math.round(data.amount * 100)), // Ensure minimum 100 pesewas
        reference: data.reference,
        callback_url: data.callback_url,
        metadata: data.metadata,
        currency: 'GHS', // Enforce GHS for Ghana accounts
        // Let Paystack dashboard manage channels
    };

    console.log('[Paystack] Sanitized email:', payload.email);

    console.log('[Paystack] Initializing transaction with payload:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const result = await response.json();

    // Add file logging for persistent debugging
    try {
        const fs = require('fs');
        const path = require('path');
        const logDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
        const logFile = path.join(logDir, 'paystack_debug.log');
        const logEntry = `[${new Date().toISOString()}] REQUEST: ${JSON.stringify(payload, null, 2)}\n[${new Date().toISOString()}] RESPONSE: ${JSON.stringify(result, null, 2)}\n\n`;
        fs.appendFileSync(logFile, logEntry);
    } catch (logErr) {
        console.error('Failed to write paystack log:', logErr);
    }

    console.log('[Paystack] Response received:', JSON.stringify(result, null, 2));

    if (!response.ok || !result.status) {
        console.error('[Paystack] Initialization failed:', result);
        throw new Error(result.message || 'Failed to initialize Paystack transaction');
    }

    return result;
}

/**
 * Verify a transaction with Paystack
 */
export async function verifyTransaction(reference: string): Promise<PaystackVerifyResponse> {
    if (!PAYSTACK_SECRET_KEY) {
        throw new Error('Paystack secret key is not configured');
    }

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    const result = await response.json();
    if (!response.ok || !result.status) {
        console.error('[Paystack] Verification failed:', result);
        throw new Error(result.message || 'Failed to verify Paystack transaction');
    }

    return result;
}
