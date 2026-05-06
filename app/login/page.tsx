'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './Login.module.css';

type LoginStep = 'credentials' | 'mfa';

function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mode = searchParams.get('mode');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<LoginStep>('credentials');
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [mode]);

  const handleGoogleLogin = () => {
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    signIn('google', { callbackUrl });
  };

  /**
   * Step 1: Validate credentials only (no session created).
   * If MFA is enabled, show the code input screen.
   * If MFA is not enabled, sign in normally.
   */
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/mfa/verify-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid credentials.');
        setLoading(false);
        return;
      }

      if (data.mfaEnabled) {
        // Show MFA step
        setStep('mfa');
        setLoading(false);
      } else {
        // No MFA — sign in directly
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });
        if (result?.error) {
          setError('Invalid credentials.');
          setLoading(false);
        } else {
          window.location.href = '/admin';
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  /**
   * Step 2: Verify the TOTP code, then sign in normally.
   */
  const handleMfaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: totpToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid code. Please try again.');
        setLoading(false);
        return;
      }

      // Code is valid — now sign in to create the session
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Authentication failed. Please start over.');
        setStep('credentials');
        setLoading(false);
      } else {
        window.location.href = '/admin';
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleBackToCredentials = () => {
    setStep('credentials');
    setTotpToken('');
    setError('');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <button className={styles.close} onClick={() => router.push('/')}>×</button>

        {step === 'credentials' ? (
          <>
            <h1 className={styles.title}>
              {isLogin ? 'Log in' : 'Create an Account'}
            </h1>
            <p className={styles.subtitle}>
              {isLogin
                ? 'Welcome back! Log in and start booking.'
                : 'Join us today! Create an account to start booking.'}
            </p>

            <button className={styles.googleBtn} onClick={handleGoogleLogin}>
              <svg viewBox="0 0 24 24" className={styles.googleIcon}>
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 2.46 2.18 5.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {isLogin ? 'Log in with Google' : 'Sign up with Google'}
            </button>

            {isLogin && (
              <>
                <div className={styles.divider}>
                  <span>OR</span>
                </div>

                {error && (
                  <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', margin: '0 0 12px' }}>
                    {error}
                  </p>
                )}

                <form onSubmit={handleCredentialsSubmit} className={styles.form}>
                  <input
                    type="email"
                    placeholder="Admin email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <button type="submit" className={styles.continueBtn} disabled={loading}>
                    {loading ? 'Verifying...' : 'Log in'}
                  </button>
                </form>
              </>
            )}

            <p className={styles.legal}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={toggleMode} style={{ color: '#fff', textDecoration: 'underline', cursor: 'pointer' }}>
                {isLogin ? 'Sign up' : 'Log in'}
              </span>
            </p>

            <p className={styles.legal} style={{ marginTop: '1rem' }}>
              By continuing, you agree to our <span>Terms</span> and have read our{' '}
              <span>Privacy Policy</span>.
            </p>
          </>
        ) : (
          /* ── Step 2: MFA Code Entry ── */
          <>
            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '28px',
              }}>
                🔐
              </div>
              <h1 className={styles.title} style={{ marginBottom: '8px' }}>
                Two-Factor Authentication
              </h1>
              <p className={styles.subtitle}>
                Open <strong>Google Authenticator</strong> on your phone and enter the 6-digit code for <em>CampElimAfrica Admin</em>.
              </p>
            </div>

            {error && (
              <p style={{ color: '#ff6b6b', fontSize: '14px', textAlign: 'center', margin: '0 0 12px' }}>
                {error}
              </p>
            )}

            <form onSubmit={handleMfaSubmit} className={styles.form}>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9 ]*"
                maxLength={7}
                placeholder="6-digit code"
                value={totpToken}
                onChange={(e) => setTotpToken(e.target.value.replace(/[^0-9]/g, ''))}
                required
                disabled={loading}
                autoFocus
                style={{ letterSpacing: '0.3em', textAlign: 'center', fontSize: '20px' }}
              />

              <button type="submit" className={styles.continueBtn} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Log in'}
              </button>
            </form>

            <p
              onClick={handleBackToCredentials}
              style={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '13px',
                marginTop: '16px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              ← Back to login
            </p>

            <p className={styles.legal} style={{ marginTop: '12px' }}>
              The code refreshes every 30 seconds. If it&apos;s not working, wait for the next code.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
