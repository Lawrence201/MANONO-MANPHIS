
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
    FaCamera,
    FaMusic,
    FaUtensils,
    FaChair,
    FaVideo,
    FaFan,
    FaPlus,
    FaMicrophone,
    FaWind,
    FaTv,
    FaLightbulb,
    FaCouch,
    FaWifi,
    FaCar,
    FaShieldHalved
} from 'react-icons/fa6';
import styles from './PackageDetail.module.css';
import GalleryGrid from './GalleryGrid';
import PackageGallerySection from './PackageGallerySection';

export const dynamic = 'force-dynamic';

const PackageDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const packageId = parseInt(id);

    if (isNaN(packageId)) {
        notFound();
    }

    // Fetch package using raw SQL to ensure robustness
    const packages = await prisma.$queryRaw`SELECT * FROM packages WHERE id = ${packageId}` as any[];
    const rawPackage = packages[0];

    if (!rawPackage) {
        return (
            <div className={styles.pageContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1>Package Not Found</h1>
                    <Link href="/" style={{ color: '#0fb6ee' }}>Go back home</Link>
                </div>
            </div>
        );
    }

    // Map relations using Raw SQL
    const features = await prisma.$queryRaw`SELECT feature_name FROM package_features WHERE package_id = ${packageId}` as any[];
    const suitability = await prisma.$queryRaw`SELECT event_type FROM package_suitability WHERE package_id = ${packageId}` as any[];
    const galleryImages = await prisma.$queryRaw`SELECT id, image_path FROM package_gallery_images WHERE package_id = ${packageId}` as any[];
    const videos = await prisma.$queryRaw`SELECT id, video_path, video_type FROM package_gallery_videos WHERE package_id = ${packageId}` as { id: number, video_path: string, video_type: string }[];
    const addOns = await prisma.$queryRaw`SELECT name, price, unit FROM package_addons WHERE package_id = ${packageId}` as any[];

    const packageData = {
        ...rawPackage,
        mainImagePath: rawPackage.main_image_path || rawPackage['main_image_path'],
        contactName: rawPackage['contact_name'],
        contactEmail: rawPackage['contact_email'],
        contactPhone: rawPackage['contact_phone'],
        contactImage: rawPackage['contact_image_path'],
        features,
        galleryImages,
        suitability,
        videos,
        addOns
    };

    // Format currency
    const priceNumber = parseFloat((packageData.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const formattedPrice = priceNumber.toLocaleString('en-US');
    const currencyPrice = `₵${formattedPrice}`;

    // Helper to get icon based on feature name
    const getFeatureIcon = (name: string) => {
        const lowerName = (name || '').toLowerCase();
        if (lowerName.includes('photo') || lowerName.includes('camera')) return <FaCamera />;
        if (lowerName.includes('music') || lowerName.includes('sound') || lowerName.includes('mc') || lowerName.includes('speaker')) return <FaMusic />;
        if (lowerName.includes('buffet') || lowerName.includes('food') || lowerName.includes('drink') || lowerName.includes('catering')) return <FaUtensils />;
        if (lowerName.includes('chair') || lowerName.includes('table') || lowerName.includes('decor') || lowerName.includes('furniture')) return <FaChair />;
        if (lowerName.includes('video') || lowerName.includes('stream') || lowerName.includes('recording')) return <FaVideo />;
        if (lowerName.includes('ac') || lowerName.includes('cool') || lowerName.includes('fan') || lowerName.includes('air')) return <FaFan />;
        if (lowerName.includes('security') || lowerName.includes('usher') || lowerName.includes('guard')) return <FaShieldHalved />;
        if (lowerName.includes('projector') || lowerName.includes('screen') || lowerName.includes('tv') || lowerName.includes('display')) return <FaTv />;
        if (lowerName.includes('mic') || lowerName.includes('pa system') || lowerName.includes('audio')) return <FaMicrophone />;
        if (lowerName.includes('wifi') || lowerName.includes('internet')) return <FaWifi />;
        if (lowerName.includes('parking') || lowerName.includes('car')) return <FaCar />;
        if (lowerName.includes('light')) return <FaLightbulb />;
        if (lowerName.includes('seat') || lowerName.includes('couch') || lowerName.includes('lounge')) return <FaCouch />;
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
    type GalleryImage = { id: number; image_path: string };

    // Prepare gallery images for display (top section takes 3 random, bottom gets all shuffled)
    let displayGallery: string[] = [];
    let randomizedFullGallery: { id: number; imagePath: string }[] = [];

    if (packageData.galleryImages && packageData.galleryImages.length > 0) {
        const galleryArray = packageData.galleryImages as GalleryImage[];
        randomizedFullGallery = shuffleArray<GalleryImage>(galleryArray).map(img => ({
            id: img.id,
            imagePath: img.image_path
        }));

        // For top "Venue Gallery" section - pick 3 random unique images
        const shuffledForTop = shuffleArray<GalleryImage>(galleryArray);
        displayGallery = shuffledForTop.slice(0, Math.min(3, shuffledForTop.length)).map(img => img.image_path);

        // Fill with main image if we don't have 3
        while (displayGallery.length < 3) {
            displayGallery.push(packageData.mainImagePath || '/placeholder-package.jpg');
        }
    } else {
        displayGallery = [
            packageData.mainImagePath || '/placeholder-package.jpg',
            packageData.mainImagePath || '/placeholder-package.jpg',
            packageData.mainImagePath || '/placeholder-package.jpg'
        ];
    }

    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <Image
                    src={packageData.mainImagePath || '/placeholder-package.jpg'}
                    alt={packageData.name}
                    fill
                    sizes="100vw"
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Package Details</h1>
                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <span>Packages</span>
                        <span>{packageData.name}</span>
                    </div>
                </div>
            </div>

            {/* Template Header Section */}
            <div className={styles.templateHeader}>
                <h1 className={styles.contentTitle}>{packageData.name}</h1>

                <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaUsers size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Capacity</span>
                            <span className={styles.metaValue}>{packageData.capacity}</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaClock size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Duration</span>
                            <span className={styles.metaValue}>{packageData.duration}</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaCircleCheck size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Status</span>
                            <span className={styles.metaValue}>Available</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaCircleCheck size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Price:</span>
                            <span className={styles.metaValue}>{currencyPrice}</span>
                        </div>
                    </div>
                </div>

                {/* Banner Image with Overlay Strip */}
                <div className={styles.bannerImageWrapper}>
                    <Image
                        src={packageData.mainImagePath || '/placeholder-package.jpg'}
                        alt={packageData.name}
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
                                    src={packageData.contactImage || "/placeholder-avatar.jpg"}
                                    alt="Contact"
                                    width={60}
                                    height={60}
                                    sizes="60px"
                                    className={styles.avatar}
                                />
                            </div>
                            <div className={styles.contactText}>
                                <h4 className={styles.contactName}>{packageData.contactName || 'Event Coordinator'}</h4>
                                <p className={styles.contactRole}>Package Manager</p>
                                <p className={styles.contactDetails}>
                                    {packageData.contactEmail || 'events@campelimafrica.com'}
                                    {packageData.contactPhone ? ` / ${packageData.contactPhone}` : ' / +233 24 555 0101'}
                                </p>
                            </div>
                        </div>
                        <Link href="/package-booking" className={styles.stripButton}>
                            BOOK THIS PACKAGE
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.main}>

                {/* Left Column: Details */}
                <div className={styles.detailsSection}>
                    <h2 className={styles.sectionTitle}>Package Overview</h2>
                    <p className={styles.description}>{packageData.description}</p>

                    <h2 className={styles.sectionTitle}>Suitable For</h2>
                    <div className={styles.suitableForGrid}>
                        {packageData.suitability && packageData.suitability.length > 0 ? (
                            packageData.suitability.map((item: any, index: number) => (
                                <div key={index} className={styles.suitableItem}>
                                    <FaCircleCheck className={styles.checkIcon} />
                                    <span>{item.event_type}</span>
                                </div>
                            ))
                        ) : (
                            <p>Suitable for various events and gatherings.</p>
                        )}
                    </div>

                    <h2 className={styles.sectionTitle}>Features & Inclusions</h2>
                    <div className={styles.amenitiesGrid}>
                        {packageData.features && packageData.features.length > 0 ? (
                            packageData.features.map((item: any, index: number) => (
                                <div key={index} className={styles.amenityItem}>
                                    <div className={styles.iconWrapper}>
                                        {getFeatureIcon(item.feature_name)}
                                    </div>
                                    <span className={styles.amenityText}>{item.feature_name}</span>
                                </div>
                            ))
                        ) : (
                            <p>Standard features included.</p>
                        )}
                    </div>

                    <div className={styles.amenitiesGrid} style={{ marginTop: '40px' }}>
                        <h2 className={styles.sectionTitle}>Available Add-ons</h2>
                        {packageData.addOns && packageData.addOns.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                                {packageData.addOns.map((addon: any, index: number) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: '#f8fafc',
                                        padding: '12px 16px',
                                        borderRadius: '8px',
                                        border: '1px solid #e2e8f0'
                                    }}>
                                        <div style={{
                                            backgroundColor: '#e0f2fe',
                                            padding: '8px',
                                            borderRadius: '50%',
                                            color: '#0284c7',
                                            marginRight: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <FaPlus size={14} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: '#334155' }}>{addon.name}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>
                                                ₵{parseFloat(addon.price).toLocaleString()} <span style={{ fontSize: '11px', opacity: 0.8 }}>/ {addon.unit || 'Item'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: '#64748b', fontStyle: 'italic' }}>No additional add-ons available.</p>
                        )}
                    </div>

                    <div className={styles.gallerySection}>
                        <h2 className={styles.sectionTitle}>Package Gallery</h2>
                        <GalleryGrid images={displayGallery} />
                    </div>

                </div>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <div className={styles.priceTitle}>Package Price</div>
                        <div className={styles.priceLarge}>
                            {currencyPrice} <span>/ event</span>
                        </div>

                        <Link href="/package-booking" style={{ textDecoration: 'none' }}>
                            <button className={styles.bookButton}>
                                Book Package <FaArrowRight />
                            </button>
                        </Link>

                        <div className={styles.contactBox}>
                            <span className={styles.contactTitle}>Contact for Enquiries</span>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <FaPhone color="#0fb6ee" />
                                    <span>{packageData.contactPhone || '+233 24 555 0101'}</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <FaEnvelope color="#0fb6ee" />
                                    <span>{packageData.contactEmail || 'events@campelimafrica.com'}</span>
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

                    {packageData.videos && packageData.videos.length > 0 && (
                        <div className={styles.videoSidebarCard}>
                            <h3 className={styles.policySidebarTitle}>Video Tour</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {packageData.videos.map((vid: { id: number; video_path: string; video_type: string }, index: number) => {
                                    // Helper to extract YouTube embed URL
                                    const getYouTubeEmbedUrl = (url: string) => {
                                        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                                        const match = url.match(regExp);
                                        return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
                                    };

                                    const isYoutube = vid.video_type === 'youtube';
                                    const embedUrl = isYoutube ? getYouTubeEmbedUrl(vid.video_path) : null;

                                    return (
                                        <div key={vid.id} style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', position: 'relative', backgroundColor: '#000' }}>
                                            {isYoutube && embedUrl ? (
                                                <iframe
                                                    src={embedUrl}
                                                    style={{ width: '100%', height: '100%', border: 'none' }}
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            ) : (
                                                <video
                                                    src={vid.video_path}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    controls
                                                    muted
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* More Package Gallery Section - Interactive with Lightbox */}
            {randomizedFullGallery && randomizedFullGallery.length > 0 && (
                <PackageGallerySection
                    packageName={packageData.name}
                    galleryImages={randomizedFullGallery}
                />
            )}
        </div>
    );
};

export default PackageDetailPage;

