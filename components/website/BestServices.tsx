'use client';

import { FaInfoCircle } from 'react-icons/fa';
import styles from './BestServices.module.css';

const services = [
    {
        title: "Versatile Event Spaces",
        description: "Our modern halls and lecture rooms are designed to host conferences, seminars, workshops, weddings, meetings, and social events of all kinds."
    },
    {
        title: "Comfortable Accommodation",
        description: "On-site lodges provide clean, secure, and comfortable lodging for guests attending multi-day events, retreats, and conferences."
    },
    {
        title: "Professional Event Support",
        description: "Our experienced team supports you with planning, coordination, and logistics to ensure your event runs smoothly from start to finish."
    },
    {
        title: "Serene & Accessible Location",
        description: "Set in a peaceful environment, Camp Elim Africa offers the ideal balance of calm surroundings and functional event facilities."
    },
    {
        title: "Trusted by Diverse Clients",
        description: "We host events for corporate organizations, schools, community groups, and individuals, offering flexibility for every occasion."
    },
    {
        title: "All-in-One Event Center",
        description: "From venues and accommodation to support services, everything you need for a successful event is available in one location."
    }
];


export default function BestServices() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <h2 className={styles.heading}>
                    <span className={styles.scriptText}>Best</span> Services
                </h2>

                <div className={styles.grid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                <FaInfoCircle className={styles.icon} />
                            </div>
                            <p className={styles.cardDescription}>
                                {index < 4 ? (
                                    <>
                                        {service.title}: {service.description}
                                    </>
                                ) : (
                                    <>
                                        {service.title} {service.description}
                                    </>
                                )}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
