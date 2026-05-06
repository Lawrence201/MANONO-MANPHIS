import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
    if (process.env.NODE_ENV === 'production') {
        console.warn('STRIPE_SECRET_KEY is missing from environment variables. Stripe functionality will be disabled.');
    } else {
        console.error('STRIPE_SECRET_KEY is missing from environment variables');
    }
}

// Initialize Stripe with a placeholder if the key is missing to prevent build errors
export const stripe = new Stripe(secretKey || 'sk_test_placeholder', {
    apiVersion: '2025-12-15.clover' as any, // Cast to any if version string is unconventional
    typescript: true,
});

// Currency configuration
// NOTE: Change to 'ghs' once you add a GHS bank account in Stripe Dashboard
export const CURRENCY = 'usd'; // Using USD until GHS is enabled
export const CURRENCY_SYMBOL = '$';

// Convert amount to smallest currency unit (pesewas for GHS)
export function toSmallestUnit(amount: number): number {
    return Math.round(amount * 100);
}

// Convert from smallest unit back to standard
export function fromSmallestUnit(amount: number): number {
    return amount / 100;
}
