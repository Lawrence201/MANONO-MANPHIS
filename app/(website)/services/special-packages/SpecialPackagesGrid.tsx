
"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { LuSearch, LuFilter } from "react-icons/lu";
import { FaStar, FaGift } from "react-icons/fa6";
import styles from './SpecialPackages.module.css';

interface Feature {
    id: number;
    featureName: string;
}

interface Package {
    id: number;
    name: string;
    description: string | null;
    capacity: string;
    price: string;
    duration: string;
    mainImagePath: string | null;
    features: Feature[];
}

interface SpecialPackagesGridProps {
    initialPackages: Package[];
}

export default function SpecialPackagesGrid({ initialPackages }: SpecialPackagesGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Filter Packages based on Search Query and Filter Tab
    const filteredPackages = initialPackages.filter(pkg => {
        const matchesSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (pkg.description && pkg.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter = activeFilter === 'All';

        return matchesSearch && matchesFilter;
    });

    return (
        <>
            {/* Search & Filter Section */}
            <div className={styles.searchSection}>
                <div className={styles.searchWrapper}>
                    <LuSearch className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Search special packages..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className={styles.filterWrapper}>
                    <LuFilter className={styles.filterIcon} />
                    <div className={styles.filterTabs}>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'All' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('All')}
                        >
                            All
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'Discount' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Discount')}
                        >
                            <FaGift size={14} /> Discounts
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'Featured' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Featured')}
                        >
                            <FaStar size={14} /> Featured
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Display */}
            <div className={styles.grid}>
                {filteredPackages.map((pkg) => {
                    const displayFeatures = pkg.features ? pkg.features.map(f => f.featureName) : [];
                    const visibleFeatures = displayFeatures.slice(0, 3);
                    const moreFeaturesCount = Math.max(0, displayFeatures.length - 3);

                    const priceString = pkg.price || '0';
                    const currencyPrice = `₵${priceString}`;

                    return (
                        <div key={pkg.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <span className={styles.tag}>Special Package</span>
                                <Image
                                    src={pkg.mainImagePath || '/placeholder-package.jpg'}
                                    alt={pkg.name}
                                    fill
                                    className={styles.image}
                                />
                            </div>

                            <div className={styles.content}>
                                <h3 className={styles.title}>{pkg.name}</h3>
                                <p className={styles.description}>
                                    {pkg.description && pkg.description.length > 100
                                        ? `${pkg.description.substring(0, 100)}...`
                                        : pkg.description}
                                </p>

                                <div className={styles.tags}>
                                    {visibleFeatures.map((feature, index) => (
                                        <span key={index} className={styles.amenityTag}>{feature}</span>
                                    ))}
                                    {moreFeaturesCount > 0 && (
                                        <span className={styles.moreTag}>+{moreFeaturesCount} more</span>
                                    )}
                                </div>

                                <div className={styles.infoRow}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                        </div>
                                        <div className={styles.infoText}>
                                            <span className={styles.infoLabel}>Capacity</span>
                                            <span className={styles.infoValue}>{pkg.capacity}</span>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <polyline points="12 6 12 12 16 14"></polyline>
                                            </svg>
                                        </div>
                                        <div className={styles.infoText}>
                                            <span className={styles.infoLabel}>Duration</span>
                                            <span className={styles.infoValue}>{pkg.duration}</span>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                            <img src="/cedis.svg" alt="Cedis" width={16} height={16} style={{ filter: 'invert(61%) sepia(89%) saturate(461%) hue-rotate(360deg) brightness(99%) contrast(96%)' }} />
                                        </div>
                                        <div className={styles.infoText}>
                                            <span className={styles.infoLabel}>Amount</span>
                                            <span className={styles.infoValue} style={{ color: '#F59E0B', fontWeight: '700' }}>{currencyPrice}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <Link href={`/package-booking?packageId=${pkg.id}`} className={styles.bookButton}>
                                        Book Now <FaArrowRight size={14} />
                                    </Link>
                                    <Link href={`/package_details/${pkg.id}`} className={styles.viewDetailButton}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredPackages.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#666' }}>
                        <p>No special packages found matching your search.</p>
                    </div>
                )}
            </div>
        </>
    );
}
