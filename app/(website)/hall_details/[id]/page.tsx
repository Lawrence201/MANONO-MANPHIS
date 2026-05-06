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
    FaArrowLeft,
    FaMicrophone,
    FaWind,
    FaTv,
    FaLightbulb,
    FaCouch,
    FaWifi,
    FaCar,
    FaRestroom,
    FaWheelchair,
    FaMusic,
    FaUtensils,
    FaMugHot,
    FaVideo,
    FaShieldHalved,
    FaFireExtinguisher,
    FaPlug,
    FaTree,
    FaBottleWater,
    FaFaucet,
    FaHandsBubbles,
    FaTrash,
    FaBroom,
    FaMoneyBillWave
} from 'react-icons/fa6';
import styles from './HallDetail.module.css';
import GalleryGrid from './GalleryGrid';
import HallGallerySection from './HallGallerySection';

export const dynamic = 'force-dynamic';

const HallDetailPage = async ({ params }: { params: Promise<{ id: string }> }) => {
    // Parse the ID to an integer
    const { id } = await params;
    const hallId = parseInt(id);

    // Validate ID
    if (isNaN(hallId)) {
        notFound();
    }

    // Fetch hall using raw SQL to ensure we get new columns even if Prisma client is out of sync
    const halls = await prisma.$queryRaw`SELECT * FROM halls WHERE id = ${hallId}` as any[];
    const rawHall = halls[0];

    if (!rawHall) {
        return (
            <div className={styles.pageContainer} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1>Hall Not Found</h1>
                    <Link href="/" style={{ color: '#0fb6ee' }}>Go back home</Link>
                </div>
            </div>
        );
    }

    // Map DB column names to CamelCase for the component
    // Manually fetch relations since we're using raw SQL for the main record
    const hall = {
        ...rawHall,
        mainImagePath: rawHall.main_image_path || rawHall['main_image_path'],
        contactName: rawHall['contact_name'],
        contactEmail: rawHall['contact_email'],
        contactPhone: rawHall['contact_phone'],
        contactImage: rawHall['contact_image_path'],
        amenities: await prisma.hallAmenity.findMany({ where: { hallId } }),
        galleryImages: await prisma.hallGalleryImage.findMany({ where: { hallId } }),
        suitability: await prisma.hallSuitability.findMany({ where: { hallId } }),
        videos: await prisma.$queryRaw`SELECT id, video_path, video_type FROM hall_gallery_videos WHERE hall_id = ${hallId}` as { id: number, video_path: string, video_type: string }[],
    };

    // Format currency
    const priceNumber = parseFloat(hall.price.replace(/[^0-9.]/g, '')) || 0;
    const formattedPrice = priceNumber.toLocaleString('en-US');
    const currencyPrice = `₵${formattedPrice}`;

    // Helper to get icon based on amenity name
    const getAmenityIcon = (name: string) => {
        const lowerName = name.toLowerCase();

        // Visual/Audio
        if (lowerName.includes('projector') || lowerName.includes('screen') || lowerName.includes('tv') || lowerName.includes('display')) return <FaTv />;
        if (lowerName.includes('sound') || lowerName.includes('audio') || lowerName.includes('mic') || lowerName.includes('speaker') || lowerName.includes('pa system')) return <FaMicrophone />;
        if (lowerName.includes('music') || lowerName.includes('piano') || lowerName.includes('drum') || lowerName.includes('band')) return <FaMusic />;

        // Comfort/Climate
        if (lowerName.includes('air') || lowerName.includes('condition') || lowerName.includes('cool') || lowerName.includes('ac') || lowerName.includes('fan')) return <FaWind />;
        if (lowerName.includes('light') || lowerName.includes('illumination')) return <FaLightbulb />;
        if (lowerName.includes('seat') || lowerName.includes('chair') || lowerName.includes('couch') || lowerName.includes('furniture') || lowerName.includes('table')) return <FaCouch />;

        // Connectivity/Power
        if (lowerName.includes('wifi') || lowerName.includes('internet') || lowerName.includes('network')) return <FaWifi />;
        if (lowerName.includes('power') || lowerName.includes('generator') || lowerName.includes('electric') || lowerName.includes('plug') || lowerName.includes('plant')) return <FaPlug />;

        // Facilities
        if (lowerName.includes('toilet') || lowerName.includes('restroom') || lowerName.includes('bathroom') || lowerName.includes('washroom') || lowerName.includes('loo')) return <FaRestroom />;
        if (lowerName.includes('water') || lowerName.includes('sink') || lowerName.includes('tap')) return <FaFaucet />;
        if (lowerName.includes('drink') || lowerName.includes('bottle')) return <FaBottleWater />;
        if (lowerName.includes('sanitizer') || lowerName.includes('soap') || lowerName.includes('hygiene')) return <FaHandsBubbles />;
        if (lowerName.includes('rubbish') || lowerName.includes('trash') || lowerName.includes('bin') || lowerName.includes('waste')) return <FaTrash />;
        if (lowerName.includes('clean') || lowerName.includes('janitor')) return <FaBroom />;

        // Food/Dining
        if (lowerName.includes('food') || lowerName.includes('kitchen') || lowerName.includes('cater') || lowerName.includes('buffet') || lowerName.includes('dining')) return <FaUtensils />;
        if (lowerName.includes('coffee') || lowerName.includes('tea') || lowerName.includes('break')) return <FaMugHot />;

        // Accessibility/Parking
        if (lowerName.includes('wheelchair') || lowerName.includes('ramp') || lowerName.includes('access') || lowerName.includes('disability') || lowerName.includes('disabled')) return <FaWheelchair />;
        if (lowerName.includes('car') || lowerName.includes('park') || lowerName.includes('garage') || lowerName.includes('vehicle')) return <FaCar />;

        // Safety/Security
        if (lowerName.includes('cctv') || lowerName.includes('camera') || lowerName.includes('surveillance')) return <FaVideo />;
        if (lowerName.includes('security') || lowerName.includes('guard') || lowerName.includes('safe') || lowerName.includes('protection')) return <FaShieldHalved />;
        if (lowerName.includes('fire') || lowerName.includes('extinguisher')) return <FaFireExtinguisher />;

        // Outdoor
        if (lowerName.includes('garden') || lowerName.includes('lawn') || lowerName.includes('outdoor') || lowerName.includes('park') || lowerName.includes('scenery')) return <FaTree />;

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
    type GalleryImage = { id: number; imagePath: string };

    // Randomize gallery images for display
    let displayGallery: string[] = [];
    let randomizedFullGallery: GalleryImage[] = [];

    if (hall.galleryImages && hall.galleryImages.length > 0) {
        // Cast to proper type and shuffle for bottom section
        const galleryArray: GalleryImage[] = (hall.galleryImages as GalleryImage[]);
        randomizedFullGallery = shuffleArray<GalleryImage>([...galleryArray]);

        // For the top "Venue Gallery" section - pick 3 random unique images
        const shuffledForTop: GalleryImage[] = shuffleArray<GalleryImage>([...galleryArray]);
        displayGallery = shuffledForTop.slice(0, Math.min(3, shuffledForTop.length)).map((img: GalleryImage) => img.imagePath);

        // Fill with main image if we don't have 3 gallery images
        while (displayGallery.length < 3) {
            displayGallery.push(hall.mainImagePath || '/placeholder-hall.jpg');
        }
    } else {
        // No gallery images, use main image
        displayGallery = [
            hall.mainImagePath || '/placeholder-hall.jpg',
            hall.mainImagePath || '/placeholder-hall.jpg',
            hall.mainImagePath || '/placeholder-hall.jpg'
        ];
    }


    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <Image
                    src={hall.mainImagePath || '/placeholder-hall.jpg'}
                    alt={hall.name}
                    fill
                    sizes="100vw"
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Hall Details</h1>
                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <span>Facilities</span>
                        <span>{hall.name}</span>
                    </div>
                </div>
            </div>

            {/* Template Header Section */}
            <div className={styles.templateHeader}>
                <h1 className={styles.contentTitle}>{hall.name}</h1>

                <div className={styles.metaRow}>
                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaUsers size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Hall Capacity</span>
                            <span className={styles.metaValue}>{hall.capacity}</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaClock size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Time Frame</span>
                            <span className={styles.metaValue}>{hall.duration} Hours</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaCircleCheck size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Venue Status</span>
                            <span className={styles.metaValue}>Available for Booking</span>
                        </div>
                    </div>

                    <div className={styles.metaItem}>
                        <div className={styles.metaIcon}>
                            <FaMoneyBillWave size={22} />
                        </div>
                        <div className={styles.metaText}>
                            <span className={styles.metaLabel}>Hall Pricing:</span>
                            <span className={styles.metaValue}>{currencyPrice} </span>
                        </div>
                    </div>
                </div>

                {/* Banner Image with Overlay Strip */}
                <div className={styles.bannerImageWrapper}>
                    <Image
                        src={hall.mainImagePath || '/placeholder-hall.jpg'}
                        alt={hall.name}
                        fill
                        sizes="100vw"
                        className={styles.bannerImage}
                        priority
                    />

                    {/* Booking Strip (Now an Overlay) */}
                    <div className={styles.bookingStrip}>
                        <div className={styles.overlayContactInfo}>
                            <div className={styles.avatarWrapper}>
                                <Image
                                    src={hall.contactImage || "/placeholder-avatar.jpg"}
                                    alt="Contact"
                                    width={60}
                                    height={60}
                                    sizes="60px"
                                    className={styles.avatar}
                                />
                            </div>
                            <div className={styles.contactText}>
                                <h4 className={styles.contactName}>{hall.contactName || 'Admin Office'}</h4>
                                <p className={styles.contactRole}>Guest Relations Executive</p>
                                <p className={styles.contactDetails}>
                                    {hall.contactEmail || 'bookings@campelimafrica.com'}
                                    {hall.contactPhone ? ` / ${hall.contactPhone}` : ' / +233 24 555 0101'}
                                </p>
                            </div>
                        </div>
                        <Link href={`/hall-booking?hallId=${hall.id}`} className={styles.stripButton}>
                            BOOK NOW
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.main}>

                {/* Left Column: Details */}
                <div className={styles.detailsSection}>
                    {/* Overview Section */}
                    <h2 className={styles.sectionTitle}>Hall Details</h2>
                    <p className={styles.description}>{hall.description}</p>

                    {/* Suitable For Section */}
                    <h2 className={styles.sectionTitle}>Ideal For</h2>
                    <div className={styles.suitableForGrid}>
                        {hall.suitability && hall.suitability.length > 0 ? (
                            hall.suitability.map((item: { eventType: string }, index: number) => (
                                <div key={index} className={styles.suitableItem}>
                                    <FaCircleCheck className={styles.checkIcon} />
                                    <span>{item.eventType}</span>
                                </div>
                            ))
                        ) : (
                            <p>Suitable for various events.</p>
                        )}
                    </div>

                    {/* Amenities Section */}
                    <h2 className={styles.sectionTitle}>Premium Amenities & Features</h2>
                    <div className={styles.amenitiesGrid}>
                        {hall.amenities && hall.amenities.length > 0 ? (
                            hall.amenities.map((item: { amenityName: string }, index: number) => (
                                <div key={index} className={styles.amenityItem}>
                                    <div className={styles.iconWrapper}>
                                        {getAmenityIcon(item.amenityName)}
                                    </div>
                                    <span className={styles.amenityText}>{item.amenityName}</span>
                                </div>
                            ))
                        ) : (
                            <p>No specific amenities listed.</p>
                        )}
                    </div>

                    {/* Gallery Section */}
                    <div className={styles.gallerySection}>
                        <h2 className={styles.sectionTitle}>Venue Gallery</h2>
                        <GalleryGrid images={displayGallery} />
                    </div>

                </div>

                {/* Right Column: Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.bookingCard}>
                        <div className={styles.priceTitle}>Basic Price</div>
                        <div className={styles.priceLarge}>
                            {currencyPrice} <span></span>
                        </div>

                        <Link href={`/explore-plans?hallId=${hall.id}&hallName=${encodeURIComponent(hall.name)}`} style={{ textDecoration: 'none', width: '100%' }}>
                            <button className={styles.bookButton}>
                                Explore Plans <FaArrowRight />
                            </button>
                        </Link>


                        <div className={styles.contactBox}>
                            <span className={styles.contactTitle}>Need Assistance?</span>
                            <div className={styles.contactInfo}>
                                <div className={styles.contactItem}>
                                    <FaPhone color="#0fb6ee" style={{ marginRight: '0.5rem' }} />
                                    <a href="tel:+233539770722">+233 539 770 722</a>
                                </div>
                                <div className={styles.contactItem}>
                                    <FaEnvelope color="#0fb6ee" style={{ marginRight: '0.5rem' }} />
                                    <a href="mailto:emily@campelimafrica.org">emily@campelimafrica.org</a>
                                </div>
                            </div>
                        </div>




                    </div>

                    {/* Cancellation Policy Card */}
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

                    {/* Video Tour Card */}
                    {hall.videos && hall.videos.length > 0 && (
                        <div className={styles.videoSidebarCard}>
                            <h3 className={styles.policySidebarTitle}>A tour round {hall.name}</h3>
                            <div className={styles.videoWrapper}>
                                {(() => {
                                    const video = hall.videos[0];
                                    const isYouTube = video.video_type === 'youtube';

                                    if (isYouTube) {
                                        // Extract YouTube video ID
                                        const videoPath = video.video_path;
                                        const videoId = videoPath.includes('youtu.be')
                                            ? videoPath.split('youtu.be/')[1]?.split('?')[0]
                                            : videoPath.split('v=')[1]?.split('&')[0];

                                        return (
                                            <iframe
                                                className={styles.sidebarVideo}
                                                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                                title={`${hall.name} Video Tour`}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: '16/9',
                                                    border: 'none',
                                                    borderRadius: '12px'
                                                }}
                                            />
                                        );
                                    } else {
                                        return (
                                            <video
                                                controls
                                                className={styles.sidebarVideo}
                                                poster={hall.mainImagePath || "/placeholder-hall.jpg"}
                                            >
                                                <source src={video.video_path} type="video/mp4" />
                                                Your browser does not support the video tag.
                                            </video>
                                        );
                                    }
                                })()}
                            </div>

                            {/* Show additional videos if available */}
                            {hall.videos.length > 1 && (
                                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                    {hall.videos.slice(1, 5).map((vid: { id: number, video_path: string, video_type: string }, idx: number) => {
                                        const isYouTube = vid.video_type === 'youtube';
                                        const videoId = isYouTube
                                            ? (vid.video_path.includes('youtu.be')
                                                ? vid.video_path.split('youtu.be/')[1]?.split('?')[0]
                                                : vid.video_path.split('v=')[1]?.split('&')[0])
                                            : null;

                                        return (
                                            <div key={vid.id} style={{
                                                position: 'relative',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                aspectRatio: '16/9',
                                                backgroundColor: '#000'
                                            }}>
                                                {isYouTube ? (
                                                    <iframe
                                                        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
                                                        title={`Video ${idx + 2}`}
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
                            )}
                        </div>
                    )}
                </aside>
            </div>

            {/* More Hall Gallery Section - Interactive with Lightbox */}
            {
                randomizedFullGallery && randomizedFullGallery.length > 0 && (
                    <HallGallerySection
                        hallName={hall.name}
                        galleryImages={randomizedFullGallery}
                    />
                )
            }
        </div >
    );
};


export default HallDetailPage;
