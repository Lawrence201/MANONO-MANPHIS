'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaCircleCheck, FaCircleXmark, FaSpinner, FaClock } from 'react-icons/fa6';
import styles from '../hall-booking/HallBooking.module.css';

interface PaymentStatus {
    success: boolean;
    merchantRef: string;
    status: string;
    statusMessage: string;
    isSuccessful: boolean;
    bankRef?: string;
    timeCompleted?: string;
    paymentOption?: string;
}

const PaymentConfirmContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const merchantRef = searchParams.get('ref');
    const checkoutId = searchParams.get('id') || localStorage.getItem('gcb_checkout_id');
    const bookingType = searchParams.get('type') || 'hall';

    const [loading, setLoading] = useState(true);
    const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            if (!checkoutId) {
                setError('No checkout ID found. Please try booking again.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/gcb/status/${checkoutId}`);
                const data = await response.json();

                if (data.success) {
                    setPaymentStatus(data);

                    // If successful, create the booking
                    if (data.isSuccessful) {
                        // Get stored booking data
                        const storedBookingData = localStorage.getItem('pending_gcb_booking');
                        if (storedBookingData) {
                            const bookingData = JSON.parse(storedBookingData);

                            // Submit booking
                            const bookingResponse = await fetch('/api/bookings', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    ...bookingData,
                                    paymentMethod: 'gcb',
                                    paymentIntentId: data.bankRef || checkoutId,
                                    paymentStatus: 'paid',
                                }),
                            });

                            if (bookingResponse.ok) {
                                const result = await bookingResponse.json();
                                // Store booking reference
                                localStorage.setItem('gcb_booking_reference', result.reference);
                                // Clear pending data
                                localStorage.removeItem('pending_gcb_booking');
                                localStorage.removeItem('gcb_checkout_id');
                            }
                        }
                    } else if (data.status === '01') {
                        // Payment still pending, retry after 3 seconds
                        if (retryCount < 10) {
                            setTimeout(() => {
                                setRetryCount(prev => prev + 1);
                            }, 3000);
                        }
                    }
                } else {
                    setError(data.error || 'Failed to verify payment');
                }
            } catch (err: any) {
                console.error('Payment verification error:', err);
                setError('Failed to verify payment. Please contact support.');
            } finally {
                setLoading(false);
            }
        };

        checkPaymentStatus();
    }, [checkoutId, retryCount]);

    const getBookingReference = () => {
        return localStorage.getItem('gcb_booking_reference') || merchantRef || 'Pending';
    };

    if (loading || (paymentStatus?.status === '01' && retryCount < 10)) {
        return (
            <div className={styles.pageContainer} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={`${styles.card}`} style={{ maxWidth: '500px', textAlign: 'center', padding: '60px 40px' }}>
                    <FaSpinner style={{ fontSize: '48px', color: '#3B82F6', animation: 'spin 1s linear infinite', marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>
                        Verifying Payment
                    </h2>
                    <p style={{ color: '#6B7280', fontSize: '16px' }}>
                        Please wait while we confirm your payment...
                    </p>
                    {retryCount > 0 && (
                        <p style={{ color: '#9CA3AF', fontSize: '14px', marginTop: '10px' }}>
                            Checking... ({retryCount}/10)
                        </p>
                    )}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={`${styles.card}`} style={{ maxWidth: '500px', textAlign: 'center', padding: '60px 40px' }}>
                    <FaCircleXmark style={{ fontSize: '64px', color: '#EF4444', marginBottom: '20px' }} />
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>
                        Payment Verification Failed
                    </h2>
                    <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '24px' }}>
                        {error}
                    </p>
                    <Link href="/hall-booking" style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '500'
                    }}>
                        Try Again
                    </Link>
                </div>
            </div>
        );
    }

    if (paymentStatus?.isSuccessful) {
        return (
            <div className={styles.pageContainer} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className={`${styles.card}`} style={{ maxWidth: '550px', textAlign: 'center', padding: '60px 40px' }}>
                    <FaCircleCheck style={{ fontSize: '72px', color: '#10B981', marginBottom: '24px' }} />
                    <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#1F2937', marginBottom: '12px' }}>
                        Payment Successful!
                    </h2>
                    <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '32px' }}>
                        Your booking has been confirmed. We've sent a confirmation email to your registered address.
                    </p>

                    <div style={{
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #86EFAC',
                        borderRadius: '12px',
                        padding: '20px',
                        marginBottom: '32px'
                    }}>
                        <p style={{ color: '#166534', fontSize: '14px', marginBottom: '8px' }}>Booking Reference</p>
                        <p style={{ color: '#166534', fontSize: '24px', fontWeight: '700', letterSpacing: '1px' }}>
                            {getBookingReference()}
                        </p>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                        textAlign: 'left',
                        backgroundColor: '#F9FAFB',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '32px'
                    }}>
                        <div>
                            <p style={{ color: '#9CA3AF', fontSize: '12px' }}>Payment Method</p>
                            <p style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                                {paymentStatus.paymentOption === 'card' ? 'Card Payment' :
                                    paymentStatus.paymentOption === 'momo' ? 'Mobile Money' :
                                        paymentStatus.paymentOption === 'gcb' ? 'GCB Bank Account' :
                                            paymentStatus.paymentOption || 'GCB EPAY'}
                            </p>
                        </div>
                        <div>
                            <p style={{ color: '#9CA3AF', fontSize: '12px' }}>Bank Reference</p>
                            <p style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                                {paymentStatus.bankRef || '-'}
                            </p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                            <p style={{ color: '#9CA3AF', fontSize: '12px' }}>Completed At</p>
                            <p style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                                {paymentStatus.timeCompleted || new Date().toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <Link href="/" style={{
                        display: 'inline-block',
                        padding: '14px 32px',
                        backgroundColor: '#10B981',
                        color: 'white',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px'
                    }}>
                        Return to Home
                    </Link>
                </div>
            </div>
        );
    }

    // Payment failed or expired
    return (
        <div className={styles.pageContainer} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={`${styles.card}`} style={{ maxWidth: '500px', textAlign: 'center', padding: '60px 40px' }}>
                {paymentStatus?.status === '03' ? (
                    <>
                        <FaClock style={{ fontSize: '64px', color: '#F59E0B', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>
                            Payment Session Expired
                        </h2>
                        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '24px' }}>
                            Your payment session has expired. Please try again.
                        </p>
                    </>
                ) : (
                    <>
                        <FaCircleXmark style={{ fontSize: '64px', color: '#EF4444', marginBottom: '20px' }} />
                        <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1F2937', marginBottom: '12px' }}>
                            Payment {paymentStatus?.status === '02' ? 'Failed' : 'Unsuccessful'}
                        </h2>
                        <p style={{ color: '#6B7280', fontSize: '16px', marginBottom: '24px' }}>
                            {paymentStatus?.statusMessage || 'Your payment could not be completed. Please try again.'}
                        </p>
                    </>
                )}
                <Link href="/hall-booking" style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '500'
                }}>
                    Try Again
                </Link>
            </div>
        </div>
    );
};

const PaymentConfirmPage = () => {
    return (
        <Suspense fallback={
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <FaSpinner style={{ fontSize: '32px', color: '#3B82F6', animation: 'spin 1s linear infinite' }} />
            </div>
        }>
            <style jsx global>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
            <PaymentConfirmContent />
        </Suspense>
    );
};

export default PaymentConfirmPage;
