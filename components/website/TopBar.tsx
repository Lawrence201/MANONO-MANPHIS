'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaTiktok, FaUserCircle } from 'react-icons/fa';
import styles from './TopBar.module.css';

export default function TopBar() {
  const { data: session } = useSession();

  return (
    <div className={styles.topBar}>
      <ul className={styles.login}>
        <li className={styles.authLinks} id="auth-links-desktop">
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <FaUserCircle size={32} color="#fff" />
              )}

              <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                Welcome, {session.user?.name?.split(' ')[0]}
              </span>
              <span className={styles.divider}>|</span>
              <button
                onClick={() => signOut()}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '15px', fontFamily: 'inherit' }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login?mode=login" id="login-link-desktop">
                <img src="/user-profile.svg" alt="User Profile" />
                Login
              </Link>

              <span className={styles.divider} id="divider-desktop">|</span>

              <Link href="/login?mode=signup" id="register-link-desktop">
                Register
              </Link>
            </>
          )}
        </li>
      </ul>

      <a href="javascript:void(0)" className={styles.notificationLink}>
        <img src="/bell.svg" alt="Bell" className={styles.vibrateBell} />
        Camp Elim Africa - A Place Of Rest
      </a>

      <div className={styles.socials}>
        <FaFacebookF className={styles.socialIcon} />
        <div className={styles.separator} style={{ height: '15px' }}></div>
        <FaInstagram className={styles.socialIcon} />
        <div className={styles.separator} style={{ height: '15px' }}></div>
        <FaTiktok className={styles.socialIcon} />
      </div>
    </div>
  );
}
