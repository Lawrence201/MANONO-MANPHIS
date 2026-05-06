"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FaUserCircle } from 'react-icons/fa';
import styles from './NavBar.module.css';

export default function NavBar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const lastScrollY = React.useRef(0);
    const scrollPositionRef = React.useRef(0);

    const toggleDropdown = (name: string) => {
        if (openDropdown === name) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(name);
        }
    };

    // Disable body scroll when mobile menu is open - SIMPLE VERSION
    useEffect(() => {
        if (mobileMenuOpen) {
            // Just prevent scrolling, don't mess with position
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';

            // Force navbar to be visible when menu opens
            setIsVisible(true);
        } else {
            // Restore scroll
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }

        // Cleanup on unmount
        return () => {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Determine if scrolled past top bar (for style change)
            if (currentScrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }

            // Smart Sticky Logic (Standard: Hide on Down, Show on Up)
            // Landing Zone: Always show when approaching top (< 150px)
            if (currentScrollY <= 150) {
                // Near top -> always show
                setIsVisible(true);
            } else {
                if (currentScrollY > lastScrollY.current) {
                    // Scrolling DOWN -> Hide
                    setIsVisible(false);
                } else if (currentScrollY < lastScrollY.current) {
                    // Scrolling UP -> Show
                    setIsVisible(true);
                }
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const toggleMenu = (e?: React.MouseEvent) => {
        e?.preventDefault();
        e?.stopPropagation();

        // Capture scroll position BEFORE any state changes
        if (!mobileMenuOpen) {
            scrollPositionRef.current = window.scrollY;
        }

        setMobileMenuOpen(!mobileMenuOpen);
    };

    const closeMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className={styles.navPlaceholder}>
            <nav className={`${styles.navBar} ${isScrolled ? styles.scrolled : ''} ${!isVisible ? styles.hidden : ''}`}>
                <Link href="/" className={styles.logoContainer} onClick={closeMenu}>
                    <img
                        src="/camp_logo.png"
                        alt="Camp Elim Africa Logo"
                        className={styles.logoImage}
                    />
                </Link>

                <button
                    className={`${styles.hamburger} ${mobileMenuOpen ? styles.open : ''}`}
                    onClick={toggleMenu}
                    aria-label="Toggle navigation"
                >
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </button>

                <div className={`${styles.links} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
                    <div className={styles.mobileMenuContent}>
                        <div className={styles.mobileLogoContainer}>
                            <img
                                src="/camp_logo.png"
                                alt="Camp Elim Africa Logo"
                                className={styles.mobileLogo}
                            />
                        </div>
                        <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`} onClick={closeMenu}>Home</Link>

                        <Link href="/about" className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`} onClick={closeMenu}>About Us</Link>


                        <div className={styles.navItem}>
                            <div
                                className={`${styles.link} ${pathname.includes('/services') ? styles.active : ''}`}
                                onClick={() => toggleDropdown('services')}
                                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: '15px' }}
                            >
                                Our Services
                                <svg
                                    width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"
                                    style={{
                                        transform: openDropdown === 'services' ? 'rotate(180deg)' : 'rotate(0deg)',
                                        transition: 'transform 0.3s ease'
                                    }}
                                >
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className={`${styles.dropdown} ${openDropdown === 'services' ? styles.open : ''}`}>
                                <Link href="/services/halls" className={styles.dropdownItem} onClick={closeMenu}>Auditoriums & Halls</Link>
                                <Link href="/services/hostels" className={styles.dropdownItem} onClick={closeMenu}>Lodges</Link>
                                <Link href="/services/packages" className={styles.dropdownItem} onClick={closeMenu}>Event Packages</Link>
                                <Link href="/services/special-packages" className={styles.dropdownItem} onClick={closeMenu}>Special Packages & Discount</Link>
                                <Link href="/services/group-retreat" className={styles.dropdownItem} onClick={closeMenu}>Group Retreat Packages</Link>
                            </div>
                        </div>

                        <Link href="/contact" className={styles.link} onClick={closeMenu}>Contact Us</Link>
                        <Link href="/book-now" className={styles.bookBtnLink} onClick={closeMenu}>
                            <button className={styles.bookBtn}>Book Now</button>
                        </Link>
                    </div>

                    {/* Mobile Auth Footer */}
                    <div className={styles.mobileAuthFooter}>
                        {session ? (
                            <div className={styles.mobileAuthUser}>
                                {session.user?.image ? (
                                    <img
                                        src={session.user.image}
                                        alt="Profile"
                                        className={styles.mobileUserImage}
                                    />
                                ) : (
                                    <FaUserCircle size={28} color="#002D5B" />
                                )}
                                <span className={styles.mobileUserName}>
                                    {session.user?.name?.split(' ')[0]}
                                </span>
                                <span className={styles.mobileAuthDivider}>|</span>
                                <button
                                    onClick={() => signOut()}
                                    className={styles.mobileLogoutBtn}
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className={styles.mobileAuthLinks}>
                                <Link href="/login?mode=login" onClick={closeMenu} className={styles.mobileAuthLink}>
                                    <div className={styles.mobileAuthIconWrapper}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 21C20 19.6044 20 18.9067 19.8278 18.3389C19.44 17.0605 18.4395 16.06 17.1611 15.6722C16.5933 15.5 15.8956 15.5 14.5 15.5H9.5C8.10444 15.5 7.40665 15.5 6.83886 15.6722C5.56045 16.06 4.56004 17.0605 4.17224 18.3389C4 18.9067 4 19.6044 4 21" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="#007bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    Login
                                </Link>
                                <span className={styles.mobileAuthDivider}>|</span>
                                <Link href="/login?mode=signup" onClick={closeMenu} className={styles.mobileAuthLink}>
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}
