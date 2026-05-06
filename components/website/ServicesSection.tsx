'use client';

import Link from 'next/link';
import styles from './ServicesSection.module.css';

const services = [
    {
        title: "Event Halls",
        description: "Custom event hall packages tailored for conferences, seminars, weddings, meetings, and social celebrations. Each package includes venue access, seating arrangements, and essential event support to ensure a smooth and memorable experience.",
        imageSrc: "/images/event_halls.jpeg",
        cta: "View Event Halls",
        link: "/services/halls"
    },

    {
        title: "Accommodation",
        description: "Comfortable and affordable lodging designed for professionals, leaders, and retreat guests seeking a peaceful and relaxing stay.",
        imageSrc: "/images/lodge.jpeg",
        cta: "View Rooms",
        link: "/services/hostels"
    },

    {
        title: "Event Packages",
        description: "All-inclusive event and stay packages crafted for church retreats, personal getaways, and group stays. These packages combine serene lodging, peaceful environments, and coordinated services for rest, reflection, and connection.",
        imageSrc: "/images/pack.jpeg",
        cta: "View Packages",
        link: "/services/packages"
    },
];


export default function ServicesSection() {
    return (
        <section className={styles.section}>
            <div className={styles.overlay}></div>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Services</h2>
                    <p className={styles.subtitle}>
                        All-inclusive services crafted to deliver meaningful and memorable experiences.
                    </p>
                </div>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <Link key={index} href={service.link} className={styles.card}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={service.imageSrc}
                                    alt={service.title}
                                    className={styles.imagePlaceholder}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/4a5545/FFF?text=' + encodeURIComponent(service.title);
                                    }}
                                />
                            </div>

                            <div className={styles.content}>
                                <h3 className={styles.cardTitle}>{service.title}</h3>
                                <p className={styles.cardDescription}>{service.description}</p>

                                <span className={styles.ctaButton}>
                                    {service.cta}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
