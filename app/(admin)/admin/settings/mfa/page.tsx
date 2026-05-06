'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './MfaSetup.module.css';

type SetupState = 'idle' | 'loading_qr' | 'scan' | 'verifying' | 'enabled' | 'error';

export default function MfaSetupPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [setupState, setSetupState] = useState<SetupState>('idle');
    const [qrCode, setQrCode] = useState('');
    const [manualKey, setManualKey] = useState('');
    const [tempSecret, setTempSecret] = useState('');
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [mfaActive, setMfaActive] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    const handleGenerateQR = async () => {
        setSetupState('loading_qr');
        setMessage('');
        try {
            const res = await fetch('/api/admin/mfa/setup');
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Failed to generate QR code.');
                setSetupState('error');
                return;
            }
            setQrCode(data.qrCode);
            setManualKey(data.secret);
            setTempSecret(data.secret);
            setSetupState('scan');
        } catch {
            setMessage('Server error. Please try again.');
            setSetupState('error');
        }
    };

    const handleVerifySetup = async (e: React.FormEvent) => {
        e.preventDefault();
        setSetupState('verifying');
        setMessage('');
        try {
            const res = await fetch('/api/admin/mfa/verify-setup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secret: tempSecret, token }),
            });
            const data = await res.json();
            if (!res.ok) {
                setMessage(data.error || 'Invalid code. Please try again.');
                setSetupState('scan');
                return;
            }
            setSetupState('enabled');
            setMfaActive(true);
            setMessage('MFA enabled successfully! You will now need your 6-digit code every time you log in.');
        } catch {
            setMessage('Server error. Please try again.');
            setSetupState('scan');
        }
    };

    const handleDisableMfa = async () => {
        if (!confirm('Are you sure you want to disable MFA? This will make your account less secure.')) return;
        try {
            const res = await fetch('/api/admin/mfa/verify-setup', { method: 'DELETE' });
            const data = await res.json();
            if (res.ok) {
                setMfaActive(false);
                setSetupState('idle');
                setMessage('MFA has been disabled.');
                setQrCode('');
                setManualKey('');
                setTempSecret('');
                setToken('');
            } else {
                setMessage(data.error || 'Failed to disable MFA.');
            }
        } catch {
            setMessage('Server error. Please try again.');
        }
    };

    if (status === 'loading') {
        return (
            <div className={styles.container}>
                <p className={styles.loading}>Loading...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.iconWrap}>🔐</div>
                    <h1 className={styles.title}>Two-Factor Authentication</h1>
                    <p className={styles.subtitle}>
                        Protect your admin account with Google Authenticator. After setup, you will need your phone to log in.
                    </p>
                </div>

                {message && (
                    <div className={`${styles.message} ${setupState === 'enabled' ? styles.messageSuccess : styles.messageError}`}>
                        {message}
                    </div>
                )}

                {/* ── Idle / Not yet set up ── */}
                {(setupState === 'idle' || setupState === 'error') && !mfaActive && (
                    <div className={styles.section}>
                        <div className={styles.steps}>
                            <div className={styles.step}>
                                <span className={styles.stepNum}>1</span>
                                <p>Download <strong>Google Authenticator</strong> from the App Store or Play Store on your phone</p>
                            </div>
                            <div className={styles.step}>
                                <span className={styles.stepNum}>2</span>
                                <p>Click the button below to generate a QR code and scan it with the app</p>
                            </div>
                            <div className={styles.step}>
                                <span className={styles.stepNum}>3</span>
                                <p>Enter the 6-digit code shown in the app to confirm setup</p>
                            </div>
                        </div>
                        <button className={styles.primaryBtn} onClick={handleGenerateQR}>
                            Set Up Google Authenticator
                        </button>
                    </div>
                )}

                {/* ── Loading QR ── */}
                {setupState === 'loading_qr' && (
                    <div className={styles.section} style={{ textAlign: 'center' }}>
                        <p className={styles.loading}>Generating your secure QR code...</p>
                    </div>
                )}

                {/* ── QR Code Scan Step ── */}
                {(setupState === 'scan' || setupState === 'verifying') && (
                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>Scan this QR Code</h2>
                        <p className={styles.hint}>
                            Open <strong>Google Authenticator</strong> → tap <strong>+</strong> → <strong>Scan a QR code</strong>
                        </p>

                        {qrCode && (
                            <div className={styles.qrWrap}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={qrCode} alt="TOTP QR Code" className={styles.qrCode} />
                            </div>
                        )}

                        <details className={styles.manualDetails}>
                            <summary>Can&apos;t scan? Enter the key manually</summary>
                            <div className={styles.manualKey}>
                                <code>{manualKey.match(/.{1,4}/g)?.join(' ')}</code>
                            </div>
                        </details>

                        <div className={styles.divider}>
                            <span>After scanning, enter the 6-digit code below</span>
                        </div>

                        <form onSubmit={handleVerifySetup} className={styles.form}>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                placeholder="6-digit code"
                                value={token}
                                onChange={(e) => setToken(e.target.value.replace(/[^0-9]/g, ''))}
                                required
                                autoFocus
                                className={styles.codeInput}
                            />
                            <button
                                type="submit"
                                className={styles.primaryBtn}
                                disabled={setupState === 'verifying'}
                            >
                                {setupState === 'verifying' ? 'Verifying...' : 'Confirm & Enable MFA'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ── MFA Enabled ── */}
                {(setupState === 'enabled' || mfaActive) && (
                    <div className={styles.section}>
                        <div className={styles.enabledBadge}>
                            <span>✓</span> MFA is Active
                        </div>
                        <p className={styles.hint}>
                            Your account is protected. Every login will now require your Google Authenticator code.
                        </p>
                        <button className={styles.dangerBtn} onClick={handleDisableMfa}>
                            Disable MFA
                        </button>
                    </div>
                )}

                <div className={styles.footer}>
                    <button className={styles.backBtn} onClick={() => router.push('/admin')}>
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
