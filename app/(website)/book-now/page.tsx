
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import styles from './Booking.module.css';
import { prisma } from '@/lib/prisma';
import UnifiedBookingGrid, { BookingItem } from './UnifiedBookingGrid';

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function BookNowPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?mode=login&callbackUrl=/book-now");
    }
    // 1. Fetch Halls with amenities and duration
    const halls = await prisma.hall.findMany({
        include: {
            amenities: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // 2. Fetch Hostels using Prisma client (like halls) to properly get mainImagePath
    const hostels = await prisma.hostel.findMany({
        include: {
            amenities: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // 3. Fetch Event Packages only with features
    const eventPackages = await prisma.package.findMany({
        where: { packageType: 'event' },
        include: { features: true },
        orderBy: { createdAt: 'desc' }
    });

    // 4. Fetch Special Packages with features
    const specialPackages = await prisma.package.findMany({
        where: { packageType: 'special' },
        include: { features: true },
        orderBy: { createdAt: 'desc' }
    });

    // 5. Fetch Group Retreats with features
    const groupRetreats = await prisma.package.findMany({
        where: { packageType: 'group_retreat' },
        include: { features: true },
        orderBy: { createdAt: 'desc' }
    });

    // 6. Normalize Data
    const bookingItems: BookingItem[] = [
        ...halls.map((h) => ({
            id: h.id,
            type: 'Hall' as const,
            name: h.name,
            description: h.description,
            capacity: String(h.capacity),
            price: h.price,
            mainImagePath: h.mainImagePath,
            detailLink: `/hall_details/${h.id}`,
            bookingLink: `/hall-booking?hallId=${h.id}`,
            amenities: h.amenities.map(a => a.amenityName),
            duration: h.duration ? `${h.duration} Hours` : undefined
        })),
        ...hostels.map((h) => ({
            id: h.id,
            type: 'Hostel' as const,
            name: h.name,
            description: h.description,
            capacity: String(h.capacity),
            price: h.price,
            mainImagePath: h.mainImagePath,
            detailLink: `/hostel_details/${h.id}`,
            bookingLink: '/hostel-booking',
            amenities: h.amenities.map(a => a.amenityName),
            duration: h.duration
        })),
        ...eventPackages.map((p) => ({
            id: p.id,
            type: 'Package' as const,
            name: p.name,
            description: p.description,
            capacity: String(p.capacity),
            price: p.price,
            mainImagePath: p.mainImagePath,
            detailLink: `/package_details/${p.id}`,
            bookingLink: `/package-booking?packageId=${p.id}`,
            amenities: p.features.map(f => f.featureName),
            duration: p.duration
        })),
        ...specialPackages.map((p) => ({
            id: p.id,
            type: 'SpecialPackage' as const,
            name: p.name,
            description: p.description,
            capacity: String(p.capacity),
            price: p.price,
            mainImagePath: p.mainImagePath,
            detailLink: `/package_details/${p.id}`,
            bookingLink: `/package-booking?packageId=${p.id}`,
            amenities: p.features.map(f => f.featureName),
            duration: p.duration
        })),
        ...groupRetreats.map((p) => ({
            id: p.id,
            type: 'GroupRetreat' as const,
            name: p.name,
            description: p.description,
            capacity: String(p.capacity),
            price: p.price,
            mainImagePath: p.mainImagePath,
            detailLink: `/package_details/${p.id}`,
            bookingLink: `/package-booking?packageId=${p.id}`,
            amenities: p.features.map(f => f.featureName),
            duration: p.duration
        }))
    ];

    // Optional: Shuffle or Sort combined list? 
    // For now, let's just keep them in order of fetching (Halls -> Hostels -> Packages) 
    // or maybe sort by name?
    // bookingItems.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className={styles.pageContainer}>
            {/* Hero / Header Section */}
            <div className={styles.hero}>
                <Image
                    src="/images/eccle_1.jpeg" // Using generic bg or reuse one
                    alt="Book Your Experience"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Book Your Experience</h1>
                    <p className={styles.heroSubtitle}>
                        Browse our premium halls, comfortable hostels, and curated event packages.
                        Find the perfect fit for your next event or stay.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <main className={styles.main}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>All Services</h2>
                    <p>Select a category below to filter, or search for what you need.</p>
                </div>

                {/* Client-side Grid */}
                <UnifiedBookingGrid initialItems={bookingItems} />
            </main>
        </div>
    );
}
