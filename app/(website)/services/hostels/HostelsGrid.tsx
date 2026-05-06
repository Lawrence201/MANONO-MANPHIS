"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { LuSearch, LuFilter } from "react-icons/lu";
import { FaBuilding, FaBed } from "react-icons/fa6";
import styles from './Hostels.module.css';

interface Amenity {
    id: number;
    amenityName: string;
}

interface Hostel {
    id: number;
    name: string;
    description: string | null;
    capacity: number;
    price: string;
    duration: string;
    mainImagePath: string | null;
    amenities: Amenity[];
}

interface HostelsGridProps {
    initialHostels: Hostel[];
}

export default function HostelsGrid({ initialHostels }: HostelsGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Filter Hostels based on Search Query and Filter Tab
    const filteredHostels = initialHostels.filter(hostel => {
        const matchesSearch = hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (hostel.description && hostel.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Simple filtering simulation
        const matchesFilter = activeFilter === 'All' || activeFilter === 'Lodges';

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
                        placeholder="Search lodges..."
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
                            className={`${styles.filterTab} ${activeFilter === 'Lodges' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Lodges')}
                        >
                            <FaBuilding size={14} /> Lodges
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'Rooms' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Rooms')}
                        >
                            <FaBed size={14} /> Only Rooms
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Display */}
            <div className={styles.grid}>
                {filteredHostels.map((hostel: any) => {
                    const displayAmenities = hostel.amenities ? hostel.amenities.map((a: any) => a.amenityName) : [];
                    const visibleAmenities = displayAmenities.slice(0, 3);
                    const moreAmenitiesCount = Math.max(0, displayAmenities.length - 3);

                    const priceString = hostel.price || '0';
                    const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
                    const formattedPrice = priceNumber.toLocaleString('en-US');
                    const currencyPrice = `₵${formattedPrice}`;

                    return (
                        <div key={hostel.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <span className={styles.tag}>Lodge</span>
                                <Image
                                    src={hostel.mainImagePath || '/placeholder-lodge.jpg'}
                                    alt={hostel.name}
                                    fill
                                    className={styles.image}
                                />
                            </div>

                            <div className={styles.content}>
                                <h3 className={styles.title}>{hostel.name}</h3>
                                <p className={styles.description}>
                                    {hostel.description && hostel.description.length > 100
                                        ? `${hostel.description.substring(0, 100)}...`
                                        : hostel.description}
                                </p>

                                <div className={styles.tags}>
                                    {visibleAmenities.map((amenity: any, index: number) => (
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
                                            <span className={styles.infoValue}>{hostel.capacity}</span>
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
                                            <span className={styles.infoValue}>{hostel.duration}</span>
                                        </div>
                                    </div>
                                    <div className={styles.infoItem}>
                                        <div className={styles.iconWrapper} style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                                            <img src="/cedis.svg" alt="Cedis" width={16} height={16} style={{ filter: 'invert(61%) sepia(89%) saturate(461%) hue-rotate(360deg) brightness(99%) contrast(96%)' }} />
                                        </div>
                                        <div className={styles.infoText}>
                                            <span className={styles.infoLabel}>Price</span>
                                            <span className={styles.infoValue} style={{ color: '#F59E0B', fontWeight: '700' }}>{currencyPrice}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.buttonGroup}>
                                    <Link href={`/hostel-booking?hostelId=${hostel.id}`} className={styles.bookButton}>
                                        Book Now <FaArrowRight size={14} />
                                    </Link>
                                    <Link href={`/hostel_details/${hostel.id}`} className={styles.viewDetailButton}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredHostels.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#666' }}>
                        <p>{activeFilter === 'Rooms' ? 'No rooms available at the moment.' : 'No lodges found matching your search.'}</p>
                    </div>
                )}
            </div>
        </>
    );
}
