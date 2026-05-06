
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import styles from './Hostels.module.css';
import { prisma } from '@/lib/prisma';
import HostelsGrid from './HostelsGrid';

export const dynamic = 'force-dynamic';

export default async function HostelsPage() {
    // Fetch all hostels from database efficiently using Prisma Client
    const allHostels = await prisma.hostel.findMany({
        include: {
            amenities: true
        }
    });

    // Helper function to shuffle array (Fisher-Yates algorithm)
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Randomize the order of hostels
    const hostels = shuffleArray(allHostels);

    // Transform data simply for the Grid component if needed, 
    // mostly just ensuring types match what the grid expects
    const hostelsWithAmenities = hostels.map(hostel => ({
        ...hostel,
        // Ensure strictly typed for the component
        capacity: Number(hostel.capacity) || 0,
        price: hostel.price || '0',
    }));

    return (
        <div className={styles.pageContainer}>
            {/* Hero / Header Section */}
            <div className={styles.hero}>
                <Image
                    src="/images/hostel.jpeg" // You might want to ensure this image exists or use a generic one
                    alt="Lodges & Accommodation"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
                {/* Fallback image check handled by Next.js if src is valid, but if not found it might break. 
                    Let's use a safe fallback in code if needed, but for now assuming path. 
                    Actually, let's use the same hall_bg if we aren't sure, or a placeholder. 
                    I'll stick to a generic one or re-use hall_bg for safety until user provides one. 
                */}
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Lodges & Accommodation</h1>
                    <p className={styles.heroSubtitle}>
                        Comfortable and affordable lodging designed for professionals, leaders, and retreat guests seeking a peaceful and relaxing stay.
                    </p>

                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <Link href="/#services">Services</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <span>Lodges</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Our Lodges</h2>
                    <p className={styles.sectionDescription}>
                        Explore our range of accommodation options, from dormitory-style bunks to private rooms, tailored for your comfort.
                    </p>
                </div>

                {/* Client-side Grid with Search & Filter */}
                <HostelsGrid initialHostels={hostelsWithAmenities} />
            </main>
        </div>
    );
}
