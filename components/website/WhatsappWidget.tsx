"use client";
import { FaWhatsapp, FaCommentDots } from 'react-icons/fa';
import styles from './WhatsappWidget.module.css';

export default function WhatsappWidget() {
    return (
        <div className={styles.widget}>
            <div className={styles.label}>
                <FaCommentDots />
                <span>Let's Chat</span>
            </div>
            <div className={styles.iconContainer}>
                <FaWhatsapp />
                <div className={styles.badge}></div>
            </div>
        </div>
    );
}
