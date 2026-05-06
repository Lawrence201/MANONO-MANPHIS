'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import React from 'react';

// Load Stripe outside of component to avoid recreating on every render
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
    if (!stripePromise) {
        const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
            console.error('Stripe publishable key not found');
            return Promise.resolve(null);
        }
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
};

interface StripeProviderProps {
    children: React.ReactNode;
    clientSecret?: string;
}

export default function StripeProvider({ children, clientSecret }: StripeProviderProps) {
    const options = clientSecret ? {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#2563eb',
                colorBackground: '#ffffff',
                colorText: '#1f2937',
                colorDanger: '#dc2626',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                spacingUnit: '4px',
                borderRadius: '8px',
            },
        },
    } : undefined;

    return (
        <Elements stripe={getStripe()} options={options}>
            {children}
        </Elements>
    );
}
