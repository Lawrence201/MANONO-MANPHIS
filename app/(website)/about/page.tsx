import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import styles from './About.module.css';
import MissionVision from '@/components/website/MissionVision';
import VideoPlayer from '@/components/website/VideoPlayer';
import SkillsSection from './SkillsSection';
import Testimonials from '@/components/website/Testimonials';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Camp Elim Africa',
    description: 'Camp Elim Africa - Ghana’s top-rated event center, retreat facility, and accommodation venue.',
};

export default function AboutPage() {
    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <Image
                    src="/images/eccle_1.jpeg"
                    alt="Camp Elim Africa - About Us"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>About Us</h1>
                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <FaChevronRight size={10} style={{ margin: '0 8px' }} />
                        <span>About</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.main}>

                {/* Our Story Section */}
                <section className={styles.storySection}>
                    <div className={styles.storyContent}>
                        {/* Text Content Column */}
                        <div className={styles.storyTextColumn}>
                            <div className={styles.sectionHeader}>
                                <span className={styles.subHeading}>Who We Are</span>
                                <h2 className={styles.mainHeading}>Ghana's Premier Multi-Purpose Event Center</h2>
                                <div className={styles.divider} />
                            </div>

                            <div className={styles.storyText}>
                                <p>
                                    <span className={styles.highlight}>Camp Elim Africa</span> is a leading Event Center and Retreat Venue in Ghana, offering versatile spaces for conferences, seminars, workshops, corporate meetings, weddings, retreats and more.
                                </p>
                                <p>
                                    Nestled in a serene and inspiring landscape, we have become a vibrant hub for both professional and social gatherings. Our mission is to deliver <span className={styles.highlight}>excellence in event hosting</span>, ensuring every occasion—from business meetings to family celebrations—is seamless, comfortable, and memorable.
                                </p>
                                <p>
                                    Over the years, we have welcomed thousands of guests across diverse events. Our halls, lodges, and lecture rooms are open to corporate organizations, schools, community groups, and individuals. Guided by strong values of integrity and care, we provide a professional and peaceful venue for all events.
                                </p>
                            </div>
                        </div>


                        {/* Video Content */}
                        <div className={styles.storyImageWrapper}>
                            <VideoPlayer
                                thumbnailSrc="https://img.youtube.com/vi/UHjsvTrYkww/maxresdefault.jpg"
                                videoId="UHjsvTrYkww"
                                className={styles.storyVideo}
                            />
                        </div>
                    </div>
                </section>

                {/* Mission & Vision Integration */}
                <MissionVision />

                {/* How Bookings Works Section */}
                <section className={styles.bookingSection}>
                    <h2 className={styles.bookingHeader}>How Bookings Works</h2>
                    <div className={styles.bookingImageWrapper}>
                        <Image
                            src="/images/book.png"
                            alt="How Bookings Works"
                            width={1920} // Assuming high res, width will be controlled by CSS
                            height={1080} // Aspect ratio placeholder
                            className={styles.bookingImage}
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                            }}
                        />
                    </div>
                </section>

                {/* Impact/Stats Section */}
                {/* Feature Cards Section (New Design) */}
                <section className={styles.cardsSection}>
                    {/* Section Header */}
                    <div className={styles.cardsHeader}>
                        <span className={styles.subHeading} style={{ textAlign: 'center' }}>Our Approach</span>
                        <h2 className={styles.mainHeading} style={{ textAlign: 'center', marginBottom: '10px' }}>Built on Purpose, Excellence, and Impacts</h2>
                    </div>

                    {/* Connector Tree (Desktop/Large Screens) */}
                    <div className={styles.connectorGrid}>
                        <div className={styles.connectorNodeLeft}>
                            <div className={styles.connectorLineH}></div>
                            <div className={styles.connectorLineV}></div>
                        </div>
                        <div className={styles.connectorNodeCenter}>
                            <div className={styles.connectorLineUp}></div>
                            <div className={styles.connectorLineH}></div>
                            <div className={styles.connectorLineV}></div>
                        </div>
                        <div className={styles.connectorNodeRight}>
                            <div className={styles.connectorLineH}></div>
                            <div className={styles.connectorLineV}></div>
                        </div>
                    </div>

                    <div className={styles.cardsContainer}>
                        {/* Decorative Red Brackets */}
                        <div className={styles.bracketTopLeft} />
                        <div className={styles.bracketBottomRight} />

                        {/* Card 1 */}
                        <div className={styles.featureCard}>
                            <h3 className={styles.cardTitle}>Retreats & Focused Getaways</h3>
                            <p className={styles.cardDesc}>
                                A calm and distraction-free environment designed for retreats, strategy sessions, workshops, team-building programs, and focused group gatherings.
                            </p>
                            <div className={styles.cardImageWrapper}>
                                <Image
                                    src="/images/retreat.jpg" // Reusing available images
                                    alt="Spiritual Retreats"
                                    fill
                                    className={styles.cardImage}
                                />
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className={styles.featureCard}>
                            <h3 className={styles.cardTitle}>Community Engagement</h3>
                            <p className={styles.cardDesc}>
                                We support positive community outcomes by hosting educational programs, training sessions, and initiatives that contribute to personal and collective development.
                            </p>
                            <div className={styles.cardImageWrapper}>
                                <Image
                                    src="/images/conference.jpg" // Reusing available images
                                    alt="Community Impact"
                                    fill
                                    className={styles.cardImage}
                                />
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className={styles.featureCard}>
                            <h3 className={styles.cardTitle}>Youth & Leadership Development</h3>
                            <p className={styles.cardDesc}>
                                Our facilities provide a safe and structured setting for youth programs, leadership camps, trainings, and development-focused gatherings that prepare the next generation for growth and responsibility.
                            </p>
                            <div className={styles.cardImageWrapper}>
                                <Image
                                    src="/images/event.jpg" // Reusing available images
                                    alt="Youth Development"
                                    fill
                                    className={styles.cardImage}
                                />
                            </div>
                        </div>
                    </div>



                    {/* Skills Section (Company Skills) */}
                    <SkillsSection />
                </section>

                {/* Testimonials Section */}
                <Testimonials />




            </div>
        </div>
    );
}
