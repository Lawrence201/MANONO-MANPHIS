"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import { LuSearch, LuFilter } from "react-icons/lu";
import { FaBuilding, FaBed } from "react-icons/fa6";
import styles from './Halls.module.css';

interface Amenity {
    id: number;
    amenityName: string;
}

interface Hall {
    id: number;
    name: string;
    description: string | null;
    capacity: number;
    price: string;
    duration: number;
    mainImagePath: string | null;
    amenities: Amenity[];
    // Add other fields if necessary
}

interface HallsGridProps {
    initialHalls: Hall[];
}

export default function HallsGrid({ initialHalls }: HallsGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Filter Halls based on Search Query and Filter Tab
    const filteredHalls = initialHalls.filter(hall => {
        const matchesSearch = hall.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (hall.description && hall.description.toLowerCase().includes(searchQuery.toLowerCase()));

        // Currently we only have Halls, but simulating filter behavior for design
        // If we had a type field, we would filter by it here.
        // For now, "All" and "Halls" show everything, "Rooms" shows nothing (or fake it).
        const matchesFilter = activeFilter === 'All' || activeFilter === 'Halls';

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
                        placeholder="Search facilities..."
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
                            className={`${styles.filterTab} ${activeFilter === 'Halls' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Halls')}
                        >
                            <FaBuilding size={14} /> Halls
                        </button>
                        <button
                            className={`${styles.filterTab} ${activeFilter === 'Rooms' ? styles.active : ''}`}
                            onClick={() => setActiveFilter('Rooms')}
                        >
                            <FaBed size={14} /> Rooms
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Display */}
            <div className={styles.grid}>
                {filteredHalls.map((hall) => {
                    const displayAmenities = hall.amenities ? hall.amenities.map(a => a.amenityName) : [];
                    const visibleAmenities = displayAmenities.slice(0, 3);
                    const moreAmenitiesCount = Math.max(0, displayAmenities.length - 3);

                    const priceString = hall.price || '0';
                    const priceNumber = parseFloat(priceString.replace(/[^0-9.]/g, '')) || 0;
                    const formattedPrice = priceNumber.toLocaleString('en-US');
                    const currencyPrice = `₵${formattedPrice}`;

                    return (
                        <div key={hall.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <span className={styles.tag}>Event Hall</span>
                                <Image
                                    src={hall.mainImagePath || '/placeholder-hall.jpg'}
                                    alt={hall.name}
                                    fill
                                    className={styles.image}
                                />
                            </div>

                            <div className={styles.content}>
                                <h3 className={styles.title}>{hall.name}</h3>
                                <p className={styles.description}>
                                    {hall.description && hall.description.length > 100
                                        ? `${hall.description.substring(0, 100)}...`
                                        : hall.description}
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
                                            <span className={styles.infoValue}>{hall.capacity}</span>
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
                                            <span className={styles.infoValue}>{hall.duration} Hours</span>
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
                                    <Link href={`/hall-booking?hallId=${hall.id}`} className={styles.bookButton}>
                                        Book Now <FaArrowRight size={14} />
                                    </Link>
                                    <Link href={`/hall_details/${hall.id}`} className={styles.viewDetailButton}>
                                        View Detail
                                    </Link>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {filteredHalls.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', color: '#666' }}>
                        <p>{activeFilter === 'Rooms' ? 'No rooms available at the moment.' : 'No halls found matching your search.'}</p>
                    </div>
                )}
            </div>
        </>
    );
}
