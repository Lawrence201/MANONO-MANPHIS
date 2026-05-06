
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight } from 'react-icons/fa6';
import styles from './Contact.module.css';
import MapSection from '@/components/website/MapSection';

export default function ContactPage() {
    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <Image
                    src="/images/contact_us.jpg"
                    alt="Contact Us"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                />
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Contact Us</h1>
                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <FaChevronRight size={10} style={{ margin: '0 8px' }} />
                        <span>Contact</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.main}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.mainHeading}>
                        If You Have any Questions<br />
                        Feel Free to Contact Us
                    </h2>
                </div>

                <div className={styles.contentGrid}>
                    {/* Left Column: Contact Info */}
                    <div className={styles.infoColumn}>

                        {/* Info Block 1 */}
                        <div className={styles.infoBlock}>
                            <div className={styles.locationTitle}>Ghana - Accra</div>
                            <div className={styles.locationDetails}>
                                <span className={styles.ministryName}>Camp Elim Africa <br />North Legon</span>

                                <div className={styles.contactDetailRow}>
                                    <span className={styles.detailLabel}>Telephone:</span>
                                    <a href="tel:+233243918126" className={styles.detailValue}>+233 539770722</a>
                                </div>

                                <div className={styles.contactDetailRow}>
                                    <span className={styles.detailLabel}>Telephone:</span>
                                    <a href="tel:+233544106812" className={styles.detailValue}>+233 539770722</a>
                                </div>

                                <div className={styles.contactDetailRow}>
                                    <span className={styles.detailLabel}>Email:</span>
                                    <a href="mailto:info@campelimafrica.com" className={styles.detailValue}>emily@campelimafrica.org</a>
                                </div>
                            </div>
                        </div>

                        {/* Info Block 2 - Duplicated structure as per image request (Accra-Ghana inverse?) */}
                        {/* The reference had "Accra-Ghana" as a second block. I will interpret this as a second location or just visual balance. */}
                        <div className={styles.infoBlock}>
                            <div className={styles.locationTitle}>Accra-Ghana</div>
                            <div className={styles.locationDetails}>
                                <span className={styles.ministryName}>Camp Elim Africa <br />North legon</span>

                                <div className={styles.contactDetailRow}>
                                    <span className={styles.detailLabel}>Telephone:</span>
                                    <a href="tel:+233243918126" className={styles.detailValue}>+233 539770722</a>
                                </div>

                                <div className={styles.contactDetailRow}>
                                    <span className={styles.detailLabel}>Telephone:</span>
                                    <a href="tel:+233544106812" className={styles.detailValue}>+233 539770722</a>
                                </div>

                                <div className={styles.contactDetailRow}>
                                    <span className={styles.detailLabel}>Email:</span>
                                    <a href="mailto:info@campelimafrica.com" className={styles.detailValue}>emily@campelimafrica.org</a>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Contact Form */}
                    <div className={styles.formCard}>
                        <form>
                            <div className={styles.formGrid}>
                                {/* Row 1 */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Full Name <span className={styles.required}>*</span></label>
                                    <input type="text" placeholder="Eg. Lawrence Antwi" className={styles.input} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Email Address <span className={styles.required}>*</span></label>
                                    <input type="email" placeholder="Eg. lawrenceantwi63@gmail.com" className={styles.input} required />
                                </div>

                                {/* Row 2 */}
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Phone Number</label>
                                    <input type="tel" placeholder="+233 534829203" className={styles.input} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Inquiry Type <span className={styles.required}>*</span></label>
                                    <select className={styles.select} required defaultValue="">
                                        <option value="" disabled>Select Inquiry Type</option>
                                        <option value="booking">General Booking</option>
                                        <option value="support">Support</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Subject */}
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Subject <span className={styles.required}>*</span></label>
                                    <input type="text" placeholder="How can we help you?" className={styles.input} required />
                                </div>

                                {/* Message */}
                                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                                    <label className={styles.label}>Message <span className={styles.required}>*</span></label>
                                    <textarea placeholder="Write your message here..." className={styles.textarea} required></textarea>
                                </div>
                            </div>

                            {/* Checkbox */}
                            <div className={styles.checkboxGroup}>
                                <input type="checkbox" id="agree" className={styles.checkbox} required />
                                <label htmlFor="agree" className={styles.checkboxLabel}>I agree to send this message</label>
                            </div>

                            {/* Submit Button */}
                            <button type="submit" className={styles.submitButton}>SEND MESSAGE</button>
                        </form>
                    </div>
                </div>
            </div>
            {/* Map Section */}
            <MapSection />
        </div>
    );
}
