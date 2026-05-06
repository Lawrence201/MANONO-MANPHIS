
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import styles from './SpecialPackages.module.css';
import { prisma } from '@/lib/prisma';
import SpecialPackagesGrid from './SpecialPackagesGrid';

export const dynamic = 'force-dynamic';

export default async function SpecialPackagesPage() {
    // Fetch packages with packageType = 'special' using Prisma Client
    const packages = await prisma.package.findMany({
        where: {
            packageType: 'special'
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
                    src="/images/package.jpeg"
                    alt="Special Packages"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Special Packages & Discounts</h1>
                    <p className={styles.heroSubtitle}>
                        Save more with our exclusive discounted packages, perfect for early bookings and group events.
                    </p>

                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <Link href="/#services">Services</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <span>Special Packages</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Special Offers</h2>
                    <p className={styles.sectionDescription}>
                        Explore our collection of discounted packages designed for budget-conscious clients seeking quality experiences.
                    </p>
                </div>

                {/* Client-side Grid with Search & Filter */}
                <SpecialPackagesGrid initialPackages={packagesWithFeatures} />
            </main>
        </div>
    );
}
