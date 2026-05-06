"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { LuSearch, LuFilter } from "react-icons/lu";
import { FaBuilding, FaBed, FaBoxOpen, FaGift, FaUsers } from "react-icons/fa6"; // Icons for filters
import styles from './Booking.module.css';

export type BookingItemType = 'Hall' | 'Hostel' | 'Package' | 'SpecialPackage' | 'GroupRetreat';

export interface BookingItem {
    id: number;
    type: BookingItemType;
    name: string;
    description: string | null;
    capacity: string;
    price: string;
    mainImagePath: string | null;
    detailLink: string;
    bookingLink: string;
    amenities?: string[];
    duration?: string;
}

interface UnifiedBookingGridProps {
    initialItems: BookingItem[];
}

export default function UnifiedBookingGrid({ initialItems }: UnifiedBookingGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<'All' | BookingItemType>('All');

    // Filter Items based on Search Query and Filter Tab
    const filteredItems = initialItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter = activeFilter === 'All' || item.type === activeFilter;

        return matchesSearch && matchesFilter;
    });

    const getTagClass = (type: BookingItemType) => {
        switch (type) {
            case 'Hall': return styles.tagHall;
            case 'Hostel': return styles.tagHostel;
            case 'Package': return styles.tagPackage;
            case 'SpecialPackage': return styles.tagSpecial;
            case 'GroupRetreat': return styles.tagRetreat;
            default: return styles.tag;
        }
    };

    const getDisplayLabel = (type: BookingItemType) => {
        switch (type) {
            case 'SpecialPackage': return 'Special Package';
            case 'GroupRetreat': return 'Group Retreat';
            case 'Hostel': return 'Lodge';
            default: return type;
        }
    };

    return (
        <>
            {/* Search & Filter Section */}
            <div className={styles.searchSection}>
                <div className={styles.searchWrapper}>
                    <LuSearch className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Search all services..."
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
                            className={`${styles.filterTab} ${activeFilter === 'Hall' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Hall')}
                        >
                            <FaBuilding size={14} /> Halls
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'Hostel' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Hostel')}
                        >
                            <FaBed size={14} /> Lodges
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'Package' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Package')}
                        >
                            <FaBoxOpen size={14} /> Event Packages
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'SpecialPackage' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('SpecialPackage')}
                        >
                            <FaGift size={14} /> Special
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'GroupRetreat' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('GroupRetreat')}
                        >
                            <FaUsers size={14} /> Retreats
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Display */}
            <div className={styles.grid}>
                {filteredItems.map((item) => {
                    // Normalize price display
                    const priceString = item.price || '0';
                    const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
                    const formattedPrice = priceNumber.toLocaleString('en-US');
                    const currencyPrice = `₵${formattedPrice}`;

                    // Amenities logic
                    const displayAmenities = item.amenities || [];
                    const visibleAmenities = displayAmenities.slice(0, 3);
                    const moreAmenitiesCount = Math.max(0, displayAmenities.length - 3);

                    return (
                        <div key={`${item.type}-${item.id}`} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <span className={`${styles.tag} ${getTagClass(item.type)}`}>{getDisplayLabel(item.type)}</span>
                                <Image
                                    src={item.mainImagePath || '/placeholder.jpg'}
                                    alt={item.name}
                                    fill
                                    className={styles.image}
                                />
                            </div>

                            <div className={styles.content}>
                                <h3 className={styles.title}>{item.name}</h3>
                                <p className={styles.description}>
                                    {item.description && item.description.length > 100
                                        ? `${item.description.substring(0, 100)}...`
                                        : item.description}
                                </p>

                                <div className={styles.tags}>
                                    {visibleAmenities.map((amenity, index) => (
                                        <span key={index} className={styles.amenityTag}>{amenity}</span>
                                    ))}
                                    {moreAmenitiesCount > 0 && (
                                        <span className={styles.moreTag}>+{moreAmenitiesCount} more</span>
                                    )}
                                </div>

                                <div className={styles.infoRow}>
                                    <div className={styles.infoItem}>
                                        <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                                <circle cx="9" cy="7" r="4"></circle>
                                                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                            </svg>
                                        </div>
                                        <div className={styles.infoText}>
                                            <span className={styles.infoLabel}>Capacity</span>
                                            <span className={styles.infoValue}>{item.capacity}</span>
                                        </div>
                                    </div>

                                    {item.duration && (
                                        <div className={styles.infoItem}>
                                            <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <circle cx="12" cy="12" r="10"></circle>
                                                    <polyline points="12 6 12 12 16 14"></polyline>
                                                </svg>
                                            </div>
                                            <div className={styles.infoText}>
                                                <span className={styles.infoLabel}>Duration</span>
                                                <span className={styles.infoValue}>{item.duration}</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.infoItem}>
                                        <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                            <img src="/cedis.svg" alt="Cedis" width={16} height={16} style={{ filter: 'invert(61%) sepia(89%) saturate(461%) hue-rotate(360deg) brightness(99%) contrast(96%)' }} />
                                        </div>
                                        <div className={styles.infoText}>
                                            <span className={styles.infoLabel}>Amount</span>
                                            <span className={styles.infoValue} style={{ color: '#F59E0B' }}>{currencyPrice}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <Link href={item.bookingLink} className={styles.bookButton}>
                                        Book Now <FaArrowRight size={14} />
                                    </Link>
                                    <Link href={item.detailLink} className={styles.viewDetailButton}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredItems.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#666' }}>
                        <p>No services found matching your criteria.</p>
                    </div>
                )}
            </div>
        </>
    );
}
