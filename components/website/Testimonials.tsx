"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Testimonials.module.css';

const testimonials = [
    {
        id: 1,
        text: "Camp Elim Africa provided the perfect environment for focus and productivity. The calm surroundings and comfortable facilities made it easy to concentrate throughout our multi-day program.",
        name: "James Mensah",
        role: "University Student",
        image: "/profile.jpg"
    },
    {
        id: 2,
        text: "The event spaces are well-organized and professionally managed. Our conference ran smoothly from start to finish, and the support from the staff was excellent. We will definitely return for future events.",
        name: "Sarah Osei",
        role: "Program Coordinator",
        image: "/profile.jpg"
    },
    {
        id: 3,
        text: "The accommodation was clean, secure, and comfortable, and the overall environment was ideal for group stays. Camp Elim Africa delivered exactly what we needed for a successful gathering.",
        name: "David K. Boateng",
        role: "Event Participant",
        image: "/profile.jpg"
    }
];


const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 10000); // 10 seconds

        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <div className={styles.labelWrapper}>
                    <span className={styles.line}></span>
                    <span className={styles.label}>TESTIMONIALS</span>
                    <span className={styles.line}></span>
                </div>
                <h2 className={styles.mainTitle}>What Our Clients Say</h2>
            </div>

            <div key={currentTestimonial.id} className={`${styles.testimonialCard} ${styles.slideIn}`}>
                <div className={styles.quoteIconWrapper}>
                    {/* SVG for the large orange double quote */}
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" className={styles.quoteIcon}>
                        <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                    </svg>
                </div>

                <div className={styles.imageWrapper}>
                    <Image
                        src={currentTestimonial.image}
                        alt={currentTestimonial.name}
                        fill
                        className={styles.profileImage}
                    />
                </div>

                <p className={styles.quoteText}>
                    "{currentTestimonial.text}"
                </p>

                <div className={styles.authorInfo}>
                    <h3 className={styles.authorName}>{currentTestimonial.name}</h3>
                    <p className={styles.authorRole}>{currentTestimonial.role}</p>
                </div>
            </div>

            <div className={styles.dotsWrapper}>
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
                        aria-label={`Go to testimonial ${index + 1}`}
                        onClick={() => handleDotClick(index)}
                    ></button>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;
