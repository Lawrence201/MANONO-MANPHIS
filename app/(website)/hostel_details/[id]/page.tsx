
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import {
    FaUsers,
    FaClock,
    FaCircleCheck,
    FaPhone,
    FaEnvelope,
    FaArrowRight,
    FaPlus,
    FaMicrophone,
    FaWind,
    FaTv,
    FaLightbulb,
    FaCouch,
    FaWifi,
    FaUtensils,
    FaShower,
    FaBed,
    FaMoneyBillWave,
    FaDoorOpen
} from 'react-icons/fa6';
import styles from './HostelDetail.module.css';
import GalleryGrid from './GalleryGrid';
import HostelGallerySection from './HostelGallerySection';

export const dynamic = 'force-dynamic';

const HostelDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const hostelId = parseInt(id);

    if (isNaN(hostelId)) {
        notFound();
    }

    // Fetch hostel using Prisma Client for robustness and type safety
    const hostel = await prisma.hostel.findUnique({
        where: { id: hostelId },
        include: {
            amenities: true,
            suitability: true,
            galleryImages: true,
            videos: true,
            addOns: true,
        }
    });

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

    // No need to manually map properties, Prisma handles it.
    // Ensure numeric values are properly handled if stored as strings


    // Format currency
    const priceNumber = parseFloat(hostel.price.replace(/[^0-9.]/g, '')) || 0;
    const formattedPrice = priceNumber.toLocaleString('en-US');
    const currencyPrice = `₵${formattedPrice}`;

    // Helper to get icon based on amenity name
    const getAmenityIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('bunk') || lowerName.includes('bed')) return <FaBed />;
        if (lowerName.includes('locker') || lowerName.includes('safe')) return <FaCircleCheck />;
        if (lowerName.includes('kitchen') || lowerName.includes('cook')) return <FaUtensils />;
        if (lowerName.includes('shower') || lowerName.includes('bath')) return <FaShower />;
        if (lowerName.includes('power') || lowerName.includes('backup')) return <FaLightbulb />;
        if (lowerName.includes('security')) return <FaCircleCheck />;
        if (lowerName.includes('tv')) return <FaTv />;
        if (lowerName.includes('sound') || lowerName.includes('audio')) return <FaMicrophone />;
        if (lowerName.includes('air') || lowerName.includes('condition') || lowerName.includes('fan')) return <FaWind />;
        if (lowerName.includes('wifi') || lowerName.includes('internet')) return <FaWifi />;
        return <FaCircleCheck />;
    };

    // Shuffle function for randomizing arrays
    const shuffleArray = <T,>(array: T[]): T[] => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Define gallery image type
    type GalleryImage = { id?: number; imagePath: string };

    // Randomize gallery images for display
    let displayGallery: string[] = [];
    let randomizedFullGallery: GalleryImage[] = [];

    if (hostel.galleryImages && hostel.galleryImages.length > 0) {
        // Cast to proper type and shuffle for bottom section
        const galleryArray: GalleryImage[] = hostel.galleryImages.map((img: any, idx: number) => ({
            id: idx + 1,
            imagePath: img.imagePath
        }));
        randomizedFullGallery = shuffleArray<GalleryImage>([...galleryArray]);

        // For the top "Venue Gallery" section - pick 3 random unique images
        const shuffledForTop: GalleryImage[] = shuffleArray<GalleryImage>([...galleryArray]);
        displayGallery = shuffledForTop.slice(0, Math.min(3, shuffledForTop.length)).map((img: GalleryImage) => img.imagePath);

        // Fill with main image if we don't have 3 gallery images
        while (displayGallery.length < 3) {
            displayGallery.push(hostel.mainImagePath || '/placeholder-lodge.jpg');
        }
    } else {
        // No gallery images, use main image
        displayGallery = [
            hostel.mainImagePath || '/placeholder-lodge.jpg',
            hostel.mainImagePath || '/placeholder-lodge.jpg',
            hostel.mainImagePath || '/placeholder-lodge.jpg'
        ];
    }

    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <Image
                    src={hostel.mainImagePath || '/placeholder-lodge.jpg'}
                    alt={hostel.name}
                    fill
                    sizes="100vw"
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
                        <div className={styles.metaIcon}>
                            <FaUsers size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Capacity</span>
                            <span className={styles.metaValue}>{hostel.capacity}</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaClock size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Time Frame</span>
                            <span className={styles.metaValue}>{hostel.duration}</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaCircleCheck size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Availability</span>
                            <span className={styles.metaValue}>Open for Booking</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaMoneyBillWave size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaValue}>{currencyPrice}</span>
                        </div>
                    </div>

                    {hostel.roomQuantity && (
                        <div className={styles.metaItem}>
                            <div className={styles.metaIcon}>
                                <FaDoorOpen size={22} />
                            </div>
                            <div className={styles.metaText}>
                                <span className={styles.metaLabel}>Rooms Available</span>
                                <span className={styles.metaValue}>{hostel.roomQuantity} Rooms</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Banner Image with Overlay Strip */}
                <div className={styles.bannerImageWrapper}>
                    <Image
                        src={hostel.mainImagePath || '/placeholder-lodge.jpg'}
                        alt={hostel.name}
                        fill
                        sizes="100vw"
                        className={styles.bannerImage}
                        priority
                    />

                    {/* Booking Strip Overlay */}
                    <div className={styles.bookingStrip}>
                        <div className={styles.overlayContactInfo}>
                            <div className={styles.avatarWrapper}>
                                <Image
                                    src={hostel.contactImage || "/placeholder-avatar.jpg"}
                                    alt="Contact"
                                    width={60}
                                    height={60}
                                    sizes="60px"
                                    className={styles.avatar}
                                />
                            </div>
                            <div className={styles.contactText}>
                                <h4 className={styles.contactName}>{hostel.contactName || 'Lodge Coordinator'}</h4>
                                <p className={styles.contactRole}>Accommodation Manager</p>
                                <p className={styles.contactDetails}>
                                    {hostel.contactEmail || 'lodges@campelimafrica.com'}
                                    {hostel.contactPhone ? ` / ${hostel.contactPhone}` : ' / +233 24 555 0101'}
                                </p>
                            </div>
                        </div>
                        <Link href="/hostel-booking" className={styles.stripButton}>
                            BOOK NOW
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.main}>

                {/* Left Column: Details */}
                <div className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>Lodge Overview</h2>
                    <p className={styles.description}>{hostel.description}</p>

                    <h2 className={styles.sectionTitle}>Suitable For</h2>
                    <div className={styles.suitableForGrid}>
                        {hostel.suitability && hostel.suitability.length > 0 ? (
                            hostel.suitability.map((item: any, index: number) => (
                                <div key={index} className={styles.suitableItem}>
                                    <FaCircleCheck className={styles.checkIcon} />
                                    <span>{item.eventType}</span>
                                </div>
                            ))
                        ) : (
                            <p>Suitable for students, groups, and campers.</p>
                        )}
                    </div>

                    <h2 className={styles.sectionTitle}>Facilities & Amenities</h2>
                    <div className={styles.amenitiesGrid}>
                        {hostel.amenities && hostel.amenities.length > 0 ? (
                            hostel.amenities.map((item: any, index: number) => (
                                <div key={index} className={styles.amenityItem}>
                                    <div className={styles.iconWrapper}>
                                        {getAmenityIcon(item.amenityName)}
                                    </div>
                                    <span className={styles.amenityText}>{item.amenityName}</span>
                                </div>
                            ))
                        ) : (
                            <p>Standard amenities included.</p>
                        )}
                    </div>

                    <div className={styles.gallerySection}>
                        <h2 className={styles.sectionTitle}>Lodge Gallery</h2>
                        <GalleryGrid images={displayGallery} />
                    </div>

                </div>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <div className={styles.priceTitle}>Accommodation Fee</div>
                        <div className={styles.priceLarge}>
                            {currencyPrice}
                        </div>

                        <Link href="/hostel-booking" style={{ textDecoration: 'none' }}>
                            <button className={styles.bookButton}>
                                Book Accommodation <FaArrowRight />
                            </button>
                        </Link>

                        <div className={styles.contactBox}>
                            <span className={styles.contactTitle}>Contact for Enquiries</span>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <FaPhone color="#0fb6ee" />
                                    <span>{hostel.contactPhone || '+233 24 555 0101'}</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <FaEnvelope color="#0fb6ee" />
                                    <span>{hostel.contactEmail || 'lodges@campelimafrica.com'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.policySidebarCard}>
                        <h3 className={styles.policySidebarTitle}>Terms and Conditions</h3>
                        <div className={styles.policySidebarContent}>
                            <ol className={styles.policyList}>
                                <li>Confirmations for booking are subjected to 100 percent payment unless alternative agreements have been reached with Camp Elim Africa.</li>
                                <li>Dates booked cannot be changed three (3) days to the program.</li>
                                <li>All refunds for bookings made attract 30% administrative charges if made 72 hours before program. Any cancellation after 72 hours before program attracts 100% of the program cost.</li>
                                <li>All Packages with the exception of outdoor events come with chairs and one microphone in each hall. Other items may be requested for use at a fee.</li>
                                <li>All clients must appoint a coordinator who will liaise with the Camp Elim Africa team.</li>
                                <li>The representative of the Group/Organization assumes full responsibility for damages and related costs of any kind incurred while using the facilities under this booking.</li>
                                <li>Your program ends exactly when your duration elapses. You will be prompted intermittently towards the end of your time.</li>
                                <li>Kindly indicate if you will bring in any item or equipment. Camp Elim reserves the right to reject foreign equipment over non-disclosure. Some items and electrical gadgets may attract extra charges.</li>
                                <li>The hall/forecourt is accessible to you at exactly the time selected. There is always a general setup for programs. However, any additional setup will be on your time.</li>
                                <li>For the success of your program, we will interact with you 24 hours to your program to ensure everything is excellently organized.</li>
                                <li>The Camp is operated strictly on Christian principles and as such there is zero tolerance for alcoholic drinks, secular music and any substance that is against the laws of the state.</li>
                                <li>The Audio-visuals system supports laptops of minimum core i5 with HMDI or type C only.</li>
                                <li>When making payment via mobile money kindly reference it as the name of group and send a screenshot of the transaction.</li>
                                <li>Proceeding with payment means you have read and agreed to the Terms and Conditions stated.</li>
                            </ol>
                            <p className={styles.policySidebarTagline}>
                                <strong>Camp Elim Africa</strong>—Excellence in every detail.
                            </p>
                        </div>
                    </div>

                    {hostel.videos && hostel.videos.length > 0 && (
                        <div className={styles.videoSidebarCard}>
                            <h3 className={styles.policySidebarTitle}>Video Tour</h3>
                            <div className={styles.videoWrapper}>
                                {(() => {
                                    const video = hostel.videos[0];
                                    const isYouTube = video.videoType === 'youtube';

                                    if (isYouTube) {
                                        const videoPath = video.videoPath;
                                        const videoId = videoPath.includes('youtu.be')
                                            ? videoPath.split('youtu.be/')[1]?.split('?')[0]
                                            : videoPath.split('v=')[1]?.split('&')[0];

                                        return (
                                            <iframe
                                                className={styles.sidebarVideo}
                                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                                title={`${hostel.name} Video Tour`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                style={{ width: '100%', aspectRatio: '16/9', border: 'none', borderRadius: '12px' }}
                                            />
                                        );
                                    } else {
                                        return (
                                            <video controls className={styles.sidebarVideo} poster={hostel.mainImagePath || "/placeholder-lodge.jpg"}>
                                                <source src={video.videoPath} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    }
                                })()}
                            </div>

                            {/* Additional Videos Grid */}
                            {hostel.videos.length > 1 && (
                                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                    {hostel.videos.slice(1, 5).map((vid: any, idx: number) => {
                                        const isYouTube = vid.videoType === 'youtube';
                                        const videoId = isYouTube
                                            ? (vid.videoPath.includes('youtu.be')
                                                ? vid.videoPath.split('youtu.be/')[1]?.split('?')[0]
                                                : vid.videoPath.split('v=')[1]?.split('&')[0])
                                            : null;

                                        return (
                                            <div key={vid.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '16/9', backgroundColor: '#000' }}>
                                                {isYouTube ? (
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                                        title={`Video ${idx + 2}`}
                                                        style={{ width: '100%', height: '100%', border: 'none' }}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    />
                                                ) : (
                                                    <video src={vid.videoPath} style={{ width: '100%', height: '100%', objectFit: 'cover' }} controls muted />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </aside>
            </div>

            {/* Add-ons Section (if available) */}
            {hostel.addOns && hostel.addOns.length > 0 && (
                <section style={{
                    maxWidth: '1200px',
                    margin: '0 auto 40px',
                    padding: '0 20px'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#1a1a2e',
                        marginBottom: '20px'
                    }}>
                        Available Add-ons
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '16px'
                    }}>
                        {hostel.addOns.map((addon: any, idx: number) => (
                            <div key={idx} style={{
                                background: '#f8fafc',
                                border: '1px solid #e5e7eb',
                                borderRadius: '12px',
                                padding: '20px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <span style={{ fontWeight: '600', color: '#374151' }}>{addon.name}</span>
                                    {addon.unit && (
                                        <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '8px' }}>({addon.unit})</span>
                                    )}
                                </div>
                                <span style={{ fontWeight: '700', color: '#0fb6ee' }}>₵{addon.price}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* More Hostel Gallery Section - Interactive with Lightbox */}
            {randomizedFullGallery && randomizedFullGallery.length > 0 && (
                <HostelGallerySection
                    hostelName={hostel.name}
                    galleryImages={randomizedFullGallery.map((img, idx) => ({
                        id: img.id ?? idx + 1,
                        imagePath: img.imagePath
                    }))}
                />
            )}
        </div>
    );
};

export default HostelDetailPage;
