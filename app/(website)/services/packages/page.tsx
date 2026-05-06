
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import styles from './Packages.module.css';
import { prisma } from '@/lib/prisma';
import PackagesGrid from './PackagesGrid';

export const dynamic = 'force-dynamic';

export default async function PackagesPage() {
    // Fetch only EVENT packages using Prisma Client with proper filtering
    const packages = await prisma.package.findMany({
        where: {
            packageType: 'event'
        },
        include: {
            features: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // Map to grid component format
    const packagesWithFeatures = packages.map(pkg => ({
        ...pkg,
        features: pkg.features.map(f => ({
            id: f.id,
            featureName: f.featureName
        })),
        mainImagePath: pkg.mainImagePath
    }));

    return (
        <div className={styles.pageContainer}>
            {/* Hero / Header Section */}
            <div className={styles.hero}>
                <Image
                    src="/images/Corporate.jpeg"
                    alt="Event Packages"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Event Packages</h1>
                    <p className={styles.heroSubtitle}>
                        Curated packages designed to make your event planning seamless and memorable.
                    </p>

                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <Link href="/#services">Services</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <span>Event Packages</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Our Packages</h2>
                    <p className={styles.sectionDescription}>
                        Choose from our selection of tailored packages that combine venue, catering, and amenities for a perfect event.
                    </p>
                </div>

                {/* Client-side Grid with Search & Filter */}
                <PackagesGrid initialPackages={packagesWithFeatures} />
            </main>
        </div>
    );
}
