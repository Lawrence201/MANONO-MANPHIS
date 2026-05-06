'use client';

import React, { useState, useEffect } from 'react';
import StripeProvider from './StripeProvider';
import PaymentForm from './PaymentForm';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    amount: number;
    bookingType: 'hall' | 'hostel' | 'package';
    bookingData: Record<string, any>;
    onPaymentSuccess: (paymentIntentId: string) => void;
}

export default function PaymentModal({
    isOpen,
    onClose,
    amount,
    bookingType,
    bookingData,
    onPaymentSuccess,
}: PaymentModalProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen && amount > 0) {
            createPaymentIntent();
        }
    }, [isOpen, amount]);

    const createPaymentIntent = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/payments/create-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount,
                    bookingType,
                    metadata: {
                        customerEmail: bookingData.email || '',
                        customerName: `${bookingData.firstName || ''} ${bookingData.lastName || ''}`.trim(),
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to initialize payment');
            }

            setClientSecret(data.clientSecret);
        } catch (err: any) {
            console.error('Payment initialization error:', err);
            setError(err.message || 'Failed to initialize payment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentSuccess = (paymentIntentId: string) => {
        onPaymentSuccess(paymentIntentId);
    };

    const handlePaymentError = (errorMessage: string) => {
        setError(errorMessage);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                maxWidth: '480px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <div>
                        <h2 style={{
                            fontSize: '20px',
                            fontWeight: '700',
                            color: '#111827',
                            margin: 0,
                        }}>
                            Complete Payment
                        </h2>
                        <p style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            margin: '4px 0 0 0',
                        }}>
                            {bookingType.charAt(0).toUpperCase() + bookingType.slice(1)} Booking
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: isProcessing ? 'not-allowed' : 'pointer',
                            padding: '8px',
                            borderRadius: '8px',
                            color: '#6b7280',
                            opacity: isProcessing ? 0.5 : 1,
                        }}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px' }}>
                    {isLoading ? (
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px',
                            color: '#6b7280',
                        }}>
                            <svg
                                style={{ animation: 'spin 1s linear infinite' }}
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                fill="none"
                            >
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                                <path d="M12 2a10 10 0 019.95 9" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                            <p style={{ marginTop: '16px', fontSize: '14px' }}>
                                Initializing secure payment...
                            </p>
                        </div>
                    ) : error && !clientSecret ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                        }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                backgroundColor: '#fef2f2',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                            }}>
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="#dc2626" strokeWidth="2" />
                                    <path d="M12 8v4m0 4h.01" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 style={{ color: '#dc2626', marginBottom: '8px' }}>
                                Payment Initialization Failed
                            </h3>
                            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '20px' }}>
                                {error}
                            </p>
                            <button
                                onClick={createPaymentIntent}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#2563eb',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                }}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : clientSecret ? (
                        <StripeProvider clientSecret={clientSecret}>
                            <PaymentForm
                                amount={amount}
                                onSuccess={handlePaymentSuccess}
                                onError={handlePaymentError}
                                isProcessing={isProcessing}
                                setIsProcessing={setIsProcessing}
                            />
                        </StripeProvider>
                    ) : null}
                </div>

                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}
