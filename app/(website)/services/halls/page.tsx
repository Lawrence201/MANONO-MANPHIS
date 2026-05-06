import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight, FaArrowRight } from 'react-icons/fa6';
import styles from './Halls.module.css';
import { prisma } from '@/lib/prisma';
import HallsGrid from './HallsGrid';

export const dynamic = 'force-dynamic';

// Note: TopBar, NavBar, and Footer are automatically included via the root layout (app/(website)/layout.tsx)
// We do not import them here to avoid duplication and layout issues.

export default async function HallsPage() {
    // Fetch all halls from database without limit
    const halls = await prisma.hall.findMany({
        include: {
            amenities: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className={styles.pageContainer}>
            {/* Hero / Header Section */}
            <div className={styles.hero}>
                <Image
                    src="/images/Corporate.jpeg"
                    alt="Auditoriums & Halls"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                />
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Auditoriums & Halls</h1>
                    <p className={styles.heroSubtitle}>
                        Versatile venues for events with modern facilities in a serene environment.
                    </p>

                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <Link href="/#services">Services</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <span>Auditoriums & Halls</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Our Venues</h2>
                    <p className={styles.sectionDescription}>
                        Discover Camp Elim Africa’s venues, from small meeting rooms to large auditoriums, designed for every occasion.
                    </p>
                </div>

                {/* Client-side Grid with Search & Filter */}
                <HallsGrid initialHalls={halls.map(hall => ({
                    ...hall,
                    // Ensure price is a string if it's not already, though Prisma schema says String usually
                    price: hall.price || '0',
                    // Convert capacity to a number
                    capacity: Number(hall.capacity),
                    // Convert duration to a number
                    duration: Number(hall.duration),
                }))} />
            </main>
        </div>
    );
}
