import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa6';
import styles from './AvailableHalls.module.css';
import { prisma } from '@/lib/prisma'; // Import prisma instance

// Helper function to shuffle array (Fisher-Yates algorithm)
function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

const AvailableHalls = async () => { // Async component
    // Fetch ALL halls from database
    const allHalls = await prisma.hall.findMany({
        include: {
            amenities: true
        }
    });

    // Randomly shuffle and pick 3 unique halls
    const dbHalls = shuffleArray(allHalls).slice(0, 3);

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.mainTitle}>Available Halls</h2>
                <p className={styles.subTitle}>Discover the perfect venue for your conferences, weddings, and special events</p>
            </div>
            <div className={styles.grid}>
                {dbHalls.map((hall) => {
                    // Map DB amenities to string array for display
                    const displayAmenities = hall.amenities.map(a => a.amenityName);
                    // Determine "more" count (show first 3, count rest)
                    const visibleAmenities = displayAmenities.slice(0, 3);
                    const moreAmenitiesCount = Math.max(0, displayAmenities.length - 3);

                    // Ensure price has currency symbol and comma formatting
                    const priceNumber = parseFloat(hall.price.replace(/[^0-9.]/g, '')) || 0;
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
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#3B82F6"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
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
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="#10B981"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
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
                                            <img
                                                src="/cedis.svg"
                                                alt="Cedis"
                                                width={16}
                                                height={16}
                                                style={{ filter: 'invert(61%) sepia(89%) saturate(461%) hue-rotate(360deg) brightness(99%) contrast(96%)' }}
                                            />
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
            </div>

            <div className={styles.viewMoreContainer}>
                <Link href="/services/halls">
                    <button className={styles.viewMoreButton}>
                        View All Halls <FaArrowRight size={14} />
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default AvailableHalls;
