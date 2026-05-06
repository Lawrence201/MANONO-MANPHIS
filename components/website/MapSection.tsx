'use client';

import React, { useEffect, useState } from 'react';
import styles from './MapSection.module.css';

const MapSection = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section className={styles.section} aria-label="Camp Elim Africa Location Map">
            <div className={styles.mapContainer}>
                {isMounted && (
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4885.276072072679!2d-0.19263062418531246!3d5.6760687324289485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9d3cde80e5b9%3A0x2e1b3e3a228e5984!2sCAMP%20ELIM%20AFRICA!5e1!3m2!1sen!2sgh!4v1767723798261!5m2!1sen!2sgh"
                        className={styles.iframe}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Camp Elim Africa Google Map Location"
                    ></iframe>
                )}
            </div>
        </section>
    );
};

export default MapSection;
