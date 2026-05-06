"use client";
import { useState, useEffect } from 'react';
import styles from './Hero.module.css';
import { FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import Link from 'next/link';

interface HeroProps {
    hallCount?: number;
    hostelCount?: number;
    packageCount?: number;
}

export default function Hero({ hallCount = 5, hostelCount = 50, packageCount = 1000 }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [direction, setDirection] = useState('forward');

    const slides = [
        {
            id: 1,
            image: '/hero_1.avif',
            type: 'standard', // Use standard layout
            title: "Welcome to Camp Elim Africa",
            subtitle: "The ultimate venue for Conferences, Weddings, Executive Meetings, and Comfortable Accommodation.",
            cta: "Explore Our Venues"


        },

        {
    id: 2,  
    image: '/hero_2.jpeg',
    type: 'standard', 
    title: "Ghana's Leading Event Center & Retreat Venue",
    subtitle: "Host Conferences, Seminars, Weddings, Corporate Meetings, Workshops, and Comfortable Accommodation.",
    cta: "View Our Event Spaces",
    seo: {
        metaTitle: "Camp Elim Africa – Premier Event Center in Accra, Ghana",
        metaDescription: "Camp Elim Africa offers versatile venues for conferences, weddings, corporate meetings, seminars, workshops, and retreats. Book your event today!"
    }
}
,
        {
            id: 3,
            image: '/hero_3.jpg',
            type: 'standard', // Use standard layout
            title: "Versatile Spaces & Luxury Stays",
            subtitle: "Hosting Birthday Parties, Church Retreats, Workshops, and offering Serene Lodging.",
            cta: "Book Your Stay"


        },
        {
            id: 4,
            image: '/hero_4.png',
            type: 'special', // Use new special layout
            // Content for special layout is hardcoded in the render for now, or could come from here
            // But since the structure is so different, we'll mostly use the type to switch layout

        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setDirection('forward');
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 30000); // 30s auto-play
        return () => clearInterval(interval);
    }, [slides.length]);

    const handleDotClick = (index: number) => {
        if (index === currentSlide) return;
        let newDir = 'forward';
        if (index > currentSlide) {
            newDir = (index - currentSlide > slides.length / 2) ? 'backward' : 'forward';
        } else {
            newDir = (currentSlide - index > slides.length / 2) ? 'forward' : 'backward';
        }
        setDirection(newDir);
        setCurrentSlide(index);
    };

    const getSlideClass = (index: number) => {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        const nextIndex = (currentSlide + 1) % slides.length;
        let positionClass = styles.slideWaiting;
        if (index === currentSlide) positionClass = styles.slideActive;
        else if (index === prevIndex) positionClass = styles.slidePrev;
        else if (index === nextIndex) positionClass = styles.slideNext;

        let isInstant = false;
        if (direction === 'forward' && index === nextIndex) isInstant = true;
        if (direction === 'backward' && index === prevIndex) isInstant = true;
        if (index === currentSlide) isInstant = false;

        return `${positionClass} ${isInstant ? styles.instant : ''}`;
    };

    return (
        <section className={styles.hero}>
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`${styles.slide} ${getSlideClass(index)}`}
                    style={{ backgroundImage: `url(${slide.image})` }}
                >
                    <div className={styles.overlay}></div>
                    <div className={styles.contentContainer}>

                        {slide.type === 'special' ? (
                            // --- Special Layout (Slide 2) ---
                            <>
                                <h1 className={styles.specialTitle}>
                                    Stay, Meet <br />
                                    <span className={styles.goldText}>And Celebrate</span>
                                </h1>

                                <p className={styles.specialSubtitle}>
                                    Experience professional service, comfortable accommodation, and premium spaces for your events.
                                </p>

                                <div className={styles.buttonsContainer}>
                                    <Link href="/services/hostels">
                                        <button className={styles.primaryBtn}>
                                            <FaCalendarAlt /> Book Accommodation
                                        </button>
                                    </Link>
                                    <Link href="/services/halls">
                                        <button className={styles.secondaryBtn}>
                                            <FaBuilding /> Explore Facilities
                                        </button>
                                    </Link>
                                </div>

                                <div className={styles.statsBar}>
                                    <div className={styles.statItem}>
                                        <span className={styles.statNumber}>{hallCount}+</span>
                                        <span className={styles.statLabel}>Total Lodges</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statNumber}>{hostelCount}+</span>
                                        <span className={styles.statLabel}>Lodge</span>
                                    </div>
                                    <div className={styles.statItem}>
                                        <span className={styles.statNumber}>{packageCount}+</span>
                                        <span className={styles.statLabel}>Packages</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // --- Standard Layout (Slide 1 & 3) ---
                            <>
                                <h1 className={styles.standardTitle}>{slide.title}</h1>
                                <p className={styles.standardSubtitle}>{slide.subtitle}</p>
                                <button className={styles.ctaBtn}>{slide.cta}</button>
                            </>
                        )}

                    </div>
                </div>
            ))}

            {/* Dots */}
            <div className={styles.dotsContainer}>
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
                        onClick={() => handleDotClick(index)}
                    ></div>
                ))}
            </div>
        </section>
    );
}
