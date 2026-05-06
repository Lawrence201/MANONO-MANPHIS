import React from 'react';
import { Poppins } from 'next/font/google';
import { FaWhatsapp, FaFacebookF, FaInstagram, FaGlobe } from 'react-icons/fa';
import styles from './social.module.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function SocialHandlesPage() {
  return (
    <div className={`${styles.page} ${poppins.variable}`}>
      <div className={styles.bgContainer}>
        <div className={styles.bgImage}></div>
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.card}>

        {/* Header */}
        <div className={styles.header}>
          <p className={styles.welcome}>Welcome to</p>
          <h1 className={styles.title}>CampElimAfrica</h1>
          <p className={styles.subtitle}>Official Social Channels</p>
        </div>

        {/* Buttons */}
        <div className={styles.buttons}>
          <a href="https://wa.me/233539770722" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.whatsapp}`}>
            <FaWhatsapp />
            <span>WhatsApp</span>
          </a>

          <a href="https://www.facebook.com/share/1DsVtjRHpN/" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.facebook}`}>
            <FaFacebookF />
            <span>Facebook</span>
          </a>

          <a href="https://www.instagram.com/campelimafrica?igsh=MWNzZGIwdGlzMWF6eQ==" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.instagram}`}>
            <FaInstagram />
            <span>Instagram</span>
          </a>

          <a href="https://www.campelimafrica.com" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.website}`}>
            <FaGlobe />
            <span>Website</span>
          </a>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <a href="#">Privacy Policy</a>
          <span>•</span>
          <a href="#">Contact</a>
        </div>

      </div>
    </div>
  );
}

