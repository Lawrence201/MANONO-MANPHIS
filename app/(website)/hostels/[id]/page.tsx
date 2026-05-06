'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    FaBed,
    FaShower,
    FaWifi,
    FaBookOpen,
    FaUtensils,
    FaLock,
    FaCircleCheck,
    FaPhone,
    FaEnvelope,
    FaArrowRight,
    FaArrowLeft,
    FaUsers
} from 'react-icons/fa6';
import styles from './HostelDetail.module.css';

const hostelsData = {
    '1': {
        id: 1,
        name: 'Student Dormitory A',
        description: 'Student Dormitory A provides affordable, comfortable shared accommodation designed specifically for students attending conferences, seminars, or long-term study programs at Camp Elim. The environment fosters community and study, with shared facilities that encourage interaction while providing personal space for rest. Located near the main lecture halls, it offers convenience and a peaceful atmosphere conducive to learning and spiritual growth.',
        image: '/images/hostels/dorm-a.png',
        capacity: '8 Beds / Room',
        duration: 'Weekly / Monthly',
        price: '₵350',
        amenities: [
            { icon: <FaBed />, text: 'Bunk Beds' },
            { icon: <FaShower />, text: 'Shared Bathroom' },
            { icon: <FaBookOpen />, text: 'Study Desks' },
            { icon: <FaWifi />, text: 'Wi-Fi Access' },
            { icon: <FaLock />, text: 'Secure Lockers' },
            { icon: <FaUsers />, text: 'Common Room' }
        ],
        suitableFor: [
            'Student Groups',
            'Youth Camps',
            'Budget Travelers',
            'Seminar Attendees',
            'Long-term Students'
        ],
        gallery: [
            '/images/hostels/dorm-b.png',
            '/images/hostels/group-hostel.png'
        ]
    },
    '2': {
        id: 2,
        name: 'Student Dormitory B',
        description: 'Student Dormitory B offers an upgraded student living experience with enhanced privacy and amenities. Ideal for those who need a bit more quiet for intensive study, it features fewer beds per room and modernized facilities. The dormitory maintains the faith-centered community spirit of Camp Elim while ensuring a higher level of comfort and security for all residents.',
        image: '/images/hostels/dorm-b.png',
        capacity: '6 Beds / Room',
        duration: 'Weekly / Monthly',
        price: '₵400',
        amenities: [
            { icon: <FaBed />, text: 'Single/Bunk Beds' },
            { icon: <FaShower />, text: 'Private Bathroom' },
            { icon: <FaBookOpen />, text: 'Individual Study Areas' },
            { icon: <FaWifi />, text: 'High-speed Wi-Fi' },
            { icon: <FaLock />, text: 'Key Card Access' },
            { icon: <FaUtensils />, text: 'Kitchenette Access' }
        ],
        suitableFor: [
            'Research Students',
            'Small Groups',
            'Retreat Participants',
            'Visiting Scholars',
            'Exam Candidates'
        ],
        gallery: [
            '/images/hostels/dorm-a.png',
            '/images/hostels/group-hostel.png'
        ]
    },
    '3': {
        id: 3,
        name: 'Group Hostel',
        description: 'The Group Hostel is the perfect solution for large delegations, church choirs, or youth ministries. Designed to keep groups together, it features spacious dormitory-style rooms with communal worship and meeting spaces. This facility encourages team bonding and shared spiritual experiences, making it the preferred choice for group retreats and camps.',
        image: '/images/hostels/group-hostel.png',
        capacity: '20 Beds / Wing',
        duration: 'Daily / Weekly',
        price: '₵2,500',
        amenities: [
            { icon: <FaUsers />, text: 'Large Bunk Rooms' },
            { icon: <FaShower />, text: 'Multiple Shower Stalls' },
            { icon: <FaUtensils />, text: 'Shared Kitchen' },
            { icon: <FaBookOpen />, text: 'Prayer Room' },
            { icon: <FaWifi />, text: 'Wi-Fi in Common Areas' },
            { icon: <FaCouch />, text: 'Lounge Area' } // Assuming FaCouch is valid or import it
        ],
        suitableFor: [
            'Church Choirs',
            'Youth Ministries',
            'Sports Teams',
            'Large Retreat Groups',
            'School Excursions'
        ],
        gallery: [
            '/images/hostels/dorm-a.png',
            '/images/hostels/dorm-b.png'
        ]
    }
};

// Import FaCouch as well since used in Group Hostel
import { FaCouch } from 'react-icons/fa6';

const HostelDetailPage = () => {
    const params = useParams();
    const id = params.id as string;
    const hostel = hostelsData[id as keyof typeof hostelsData];

    if (!hostel) {
        return (
            <div className={styles.pageContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1>Lodge Not Found</h1>
                    <Link href="/" style={{ color: '#0fb6ee' }}>Go back home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <Image
                    src={hostel.image}
                    alt={hostel.name}
                    fill
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Lodge Details</h1>
                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <span>Lodges</span>
                        <span>{hostel.name}</span>
                    </div>
                </div>
            </div>

            {/* Template Header Section */}
            <div className={styles.templateHeader}>
                <h1 className={styles.contentTitle}>{hostel.name}</h1>

                <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}><FaUsers /></div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Capacity</span>
                            <span className={styles.metaValue}>{hostel.capacity}</span>
                        </div>
                    </div>
                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}><FaBookOpen /></div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Duration</span>
                            <span className={styles.metaValue}>{hostel.duration}</span>
                        </div>
                    </div>
                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}><FaCircleCheck /></div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Availability</span>
                            <span className={styles.metaValue}>Open Now</span>
                        </div>
                    </div>
                </div>

                <div className={styles.bannerImageWrapper}>
                    <Image
                        src={hostel.image}
                        alt="Lodge Banner"
                        fill
                        className={styles.bannerImage}
                    />

                    {/* Booking Strip Overlay */}
                    <div className={styles.bookingStrip}>
                        <div className={styles.overlayContactInfo}>
                            <div className={styles.avatarWrapper}>
                                <Image
                                    src="/images/admin-user.png"
                                    alt="Hostel Manager"
                                    width={65}
                                    height={65}
                                    className={styles.avatar}
                                />
                            </div>
                            <div className={styles.contactText}>
                                <h4 className={styles.contactName}>Lodge Manager</h4>
                                <span className={styles.contactRole}>Accommodation Services</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <Link href="/hostel-booking">
                                <button className={styles.stripButton}>
                                    Book This Room
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.main}>
                {/* Left Column: Details */}
                <div className="left-content">
                    <section className={styles.detailsSection}>
                        <h2 className={styles.sectionTitle}>About this Room</h2>
                        <p className={styles.description}>
                            {hostel.description}
                        </p>

                        <h2 className={styles.sectionTitle}>Suitable For</h2>
                        <div className={styles.suitableForGrid}>
                            {hostel.suitableFor.map((item, index) => (
                                <div key={index} className={styles.suitableItem}>
                                    <FaCircleCheck className={styles.checkIcon} />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>

                        <h2 className={styles.sectionTitle}>Room Amenities</h2>
                        <div className={styles.amenitiesGrid}>
                            {hostel.amenities.map((amenity, index) => (
                                <div key={index} className={styles.amenityItem}>
                                    <div className={styles.iconWrapper}>
                                        {amenity.icon}
                                    </div>
                                    <span className={styles.amenityText}>{amenity.text}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Gallery Section */}
                    <section className={styles.gallerySection}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: '30px' }}>Room Gallery</h2>
                        <div className={styles.galleryGrid}>
                            <div className={`${styles.galleryImageWrapper} ${styles.galleryLarge}`}>
                                <Image
                                    src={hostel.image} // Main image repeated for layout or use nice placeholders
                                    alt="Main View"
                                    fill
                                    className={styles.galleryItem}
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            {hostel.gallery.map((img, idx) => (
                                <div key={idx} className={styles.galleryImageWrapper}>
                                    <Image
                                        src={img}
                                        alt={`Gallery ${idx}`}
                                        fill
                                        className={styles.galleryItem}
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Accommodation Policy */}
                    <section className={styles.policySection}>
                        <h2 className={styles.sectionTitle}>Accommodation Rules</h2>
                        <div className={styles.policyContent}>
                            <p className={styles.policyText}>
                                <strong>Check-in/Out:</strong> Check-in is from 2:00 PM and check-out is by 10:00 AM on the day of departure. Early check-in or late check-out requests are subject to availability.
                            </p>
                            <p className={styles.policyText}>
                                <strong>Quiet Hours:</strong> To maintain a peaceful environment for study and rest, quiet hours are observed from 10:00 PM to 6:00 AM daily.
                            </p>
                            <p className={styles.policyTagline}>
                                "Peaceful rest for renewed strength." — <strong>Camp Elim Admin</strong>
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebar}>
                    {/* Booking Card */}
                    <div className={styles.bookingCard}>
                        <div className={styles.priceTitle}>Starting from</div>
                        <div className={styles.priceLarge}>
                            {hostel.price} <span>/ {hostel.duration}</span>
                        </div>

                        <Link href="/hostel-booking" className={styles.bookButton}>
                            Book Accommodation <FaArrowRight />
                        </Link>

                        <div className={styles.contactBox}>
                            <span className={styles.contactTitle}>Need Assistance?</span>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <FaPhone color="#ffffff" /> +233 24 456 7890
                                </div>
                                <div className={styles.contactItem}>
                                    <FaEnvelope color="#ffffff" /> hostels@campelim.com
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Policy Widget */}
                    <div className={styles.policySidebarCard}>
                        <h4 className={styles.policySidebarTitle}>Booking Policy</h4>
                        <div className={styles.policySidebarContent}>
                            <p className={styles.policySidebarText}>
                                <strong>Payment:</strong> Full payment is required to secure your bed space or room.
                            </p>
                            <p className={styles.policySidebarText}>
                                <strong>Cancellation:</strong> Cancellations made more than 7 days prior to arrival receive a full refund. Less than 7 days notice incurs a 50% charge.
                            </p>
                            <p className={styles.policySidebarTagline}>
                                We ensure a <strong>safe & secure</strong> stay.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default HostelDetailPage;
