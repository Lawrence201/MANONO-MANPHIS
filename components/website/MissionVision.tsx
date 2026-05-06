"use client";
import React from 'react';
import styles from './MissionVision.module.css';

export default function MissionVision() {
    return (
        <section className={styles.section}>
            <h2 className={styles.heading}>
                Our Divine Mission, Transformational Vision, and Core Values
            </h2>


            <div className={styles.grid}>
                {/* Mission */}
                <div className={styles.card}>
                    <div className={styles.iconContainer}>
                        <img src="/mission.png" alt="Mission Icon" className={styles.iconImage} />
                    </div>
                    <h3 className={styles.cardTitle}>Our Mission</h3>
                    <p className={styles.cardText}>
                        Our mission is to create a Christian center dedicated to recreation, rejuvenation, relaxation, and recovery.
                    </p>
                </div>

                {/* Vision */}
                <div className={styles.card}>
                    <div className={styles.iconContainer}>
                        <img src="/vision.png" alt="Vision Icon" className={styles.iconImage} />
                    </div>
                    <h3 className={styles.cardTitle}>Our Vision</h3>
                    <p className={styles.cardText}>
                        We aspire to become a world-class hospitality center, rooted in Christian principles, that serves as a beacon of hope and renewal worldwide.
                    </p>
                </div>

                {/* Greetings/Culture */}
                <div className={styles.card}>
                    <div className={styles.iconContainer}>
                        <img src="/value.png" alt="Greetings Icon" className={styles.iconImage} />
                    </div>
                    <h3 className={styles.cardTitle}>Core Values</h3>
                    <p className={styles.cardText}>
                        Rooted in Christian values, we foster integrity and compassion in a peaceful sanctuary dedicated to prayer, renewal, and fellowship.
                    </p>
                </div>
            </div>
        </section>
    );
}
