import React from 'react';
import styles from './JoinMission.module.css';

const JoinMission = () => {
    return (
        <section className={styles.section}>
            <div className={styles.overlay}></div>
            <div className={styles.container}>
                <h2 className={styles.title}>Host Your Next Event With Us</h2>
                 <p className={styles.subTitle}>
                   From corporate conferences and workshops to weddings and social celebrations, 
                  Camp Elim Africa provides versatile, professional, and comfortable spaces to make your event a success.
                </p>
        <div className={styles.buttonGroup}>
            <button className={styles.button}>Explore Our Venues</button>
            <button className={styles.button}>Book Your Event</button>
        </div>
    </div>
</section>

    );
};

export default JoinMission;
