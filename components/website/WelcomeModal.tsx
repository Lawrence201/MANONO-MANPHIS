'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaUser, FaTimes } from 'react-icons/fa';

export default function WelcomeModal() {
    const { data: session, status } = useSession();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [status]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(4px)'
            }}
        >
            <div
                className="relative w-full max-w-[480px]"
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '48px 40px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center'
                }}
            >

                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute transition-opacity hover:opacity-70"
                    style={{
                        top: '24px',
                        right: '24px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        fontSize: '18px'
                    }}
                >
                    <FaTimes />
                </button>

                {/* Icon Circle */}
                <div
                    className="mx-auto mb-6 flex items-center justify-center"
                    style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#f3e8ff'
                    }}
                >
                    <FaUser size={36} style={{ color: '#a855f7' }} />
                </div>

                {/* Title */}
                <h2
                    className="mb-4"
                    style={{
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#1f2937',
                        lineHeight: '1.3',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    Welcome to Camp Elim Africa<br />Website
                </h2>

                {/* Description */}
                <p
                    className="mb-8"
                    style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        lineHeight: '1.6',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    Sign up to access exclusive content,<br />
                    book facilities, and stay connected with us.
                </p>

                {/* Create Profile Button */}
                <Link
                    href="/login?mode=signup"
                    className="block w-full mb-4 transition-transform hover:scale-[1.02] active:scale-95"
                    style={{
                        backgroundColor: '#000000',
                        color: '#ffffff',
                        padding: '14px 24px',
                        borderRadius: '9999px',
                        fontSize: '15px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    Create profile
                </Link>

                {/* Dismiss Button */}
                <button
                    onClick={handleDismiss}
                    className="w-full transition-colors hover:bg-gray-50"
                    style={{
                        backgroundColor: 'transparent',
                        border: '1px solid #e5e7eb',
                        color: '#374151',
                        padding: '14px 24px',
                        borderRadius: '9999px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    Dismiss
                </button>

                {/* Footer Login Link */}
                <p
                    className="mt-8"
                    style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    Already have an account?{' '}
                    <Link
                        href="/login?mode=login"
                        className="hover:underline"
                        style={{
                            color: '#3b82f6',
                            fontWeight: '600',
                            textDecoration: 'none'
                        }}
                    >
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
