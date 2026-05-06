'use client';

import React, { useState } from 'react';
import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onError: (error: string) => void;
    isProcessing: boolean;
    setIsProcessing: (processing: boolean) => void;
}

export default function PaymentForm({
    amount,
    onSuccess,
    onError,
    isProcessing,
    setIsProcessing,
}: PaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage('Payment system not loaded. Please refresh the page.');
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: window.location.href, // Not used with redirect: 'if_required'
                },
                redirect: 'if_required',
            });

            if (error) {
                // Show error to customer
                setErrorMessage(error.message || 'Payment failed. Please try again.');
                onError(error.message || 'Payment failed');
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Payment successful!
                onSuccess(paymentIntent.id);
            } else if (paymentIntent && paymentIntent.status === 'requires_action') {
                // Handle 3D Secure or other authentication
                setErrorMessage('Additional authentication required. Please complete the verification.');
            } else {
                setErrorMessage('Payment status unknown. Please contact support.');
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            setErrorMessage(err.message || 'An unexpected error occurred.');
            onError(err.message || 'An unexpected error occurred');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{
                padding: '24px',
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                marginBottom: '20px',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #e5e7eb',
                }}>
                    <span style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#6b7280',
                    }}>
                        Amount to Pay
                    </span>
                    <span style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#111827',
                    }}>
                        GH₵ {amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                    </span>
                </div>

                <PaymentElement
                    options={{
                        layout: 'tabs',
                        paymentMethodOrder: ['card'],
                    }}
                />
            </div>

            {errorMessage && (
                <div style={{
                    padding: '12px 16px',
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                }}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 6v4m0 4h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ color: '#dc2626', fontSize: '14px' }}>
                        {errorMessage}
                    </span>
                </div>
            )}

            <button
                type="submit"
                disabled={!stripe || isProcessing}
                style={{
                    width: '100%',
                    padding: '16px 24px',
                    backgroundColor: isProcessing ? '#9ca3af' : '#2563eb',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'all 0.2s ease',
                    boxShadow: isProcessing ? 'none' : '0 4px 14px rgba(37, 99, 235, 0.25)',
                }}
            >
                {isProcessing ? (
                    <>
                        <svg
                            style={{ animation: 'spin 1s linear infinite' }}
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                            <path d="M12 2a10 10 0 019.95 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <rect x="1" y="4" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                            <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Pay GH₵ {amount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                    </>
                )}
            </button>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '16px',
                color: '#6b7280',
                fontSize: '12px',
            }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" />
                </svg>
                Secured by Stripe. Your payment information is encrypted.
            </div>

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </form>
    );
}
