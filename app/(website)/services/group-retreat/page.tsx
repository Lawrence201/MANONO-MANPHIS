
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import styles from './GroupRetreats.module.css';
import { prisma } from '@/lib/prisma';
import GroupRetreatsGrid from './GroupRetreatsGrid';

export const dynamic = 'force-dynamic';

export default async function GroupRetreatsPage() {
    // Fetch packages with packageType = 'group_retreat' using Prisma Client
    const packages = await prisma.package.findMany({
        where: {
            packageType: 'group_retreat'
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
                    src="/images/hostile.jpeg"
                    alt="Group Retreat Packages"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Group Retreat Packages</h1>
                    <p className={styles.heroSubtitle}>
                        Plan your perfect group getaway with our curated retreat packages, ideal for churches, schools, and corporate teams.
                    </p>

                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <Link href="/#services">Services</Link>
                        <FaChevronRight size={12} color="rgba(255,255,255,0.5)" />
                        <span>Group Retreats</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Retreat Packages</h2>
                    <p className={styles.sectionDescription}>
                        Discover our range of group retreat packages designed for team building, spiritual renewal, and memorable group experiences.
                    </p>
                </div>

                {/* Client-side Grid with Search & Filter */}
                <GroupRetreatsGrid initialPackages={packagesWithFeatures} />
            </main>
        </div>
    );
}
