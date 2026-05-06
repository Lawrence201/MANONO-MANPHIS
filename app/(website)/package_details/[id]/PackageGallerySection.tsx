'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface PackageGallerySectionProps {
    packageName: string;
    galleryImages: { id: number; imagePath: string }[];
}

export default function PackageGallerySection({ packageName, galleryImages }: PackageGallerySectionProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
        document.body.style.overflow = 'auto';
    };

    const goToPrevious = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    };

    // Handle keyboard navigation
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightboxOpen) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxOpen]);

    return (
        <>
            <section style={{
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                padding: '60px 20px',
                backgroundColor: '#f8fafc'
            }}>
                <div style={{
                    width: '100%',
                    padding: '0 20px',
                    maxWidth: '100%'
                }}>
                    <h2 style={{
                        fontSize: 'clamp(28px, 5vw, 40px)',
                        fontWeight: '700',
                        color: '#1a1a2e',
                        marginBottom: '12px',
                        textAlign: 'center'
                    }}>
                        {packageName} Gallery
                    </h2>
                    <p style={{
                        fontSize: 'clamp(14px, 3vw, 16px)',
                        color: '#6b7280',
                        textAlign: 'center',
                        marginBottom: '40px'
                    }}>
                        Explore more photos of this amazing package
                    </p>

                    {/* Irregular Masonry Grid */}
                    <div className="package-masonry-grid">
                        {galleryImages.map((img, index) => {
                            const heightVariants = [280, 350, 420, 300, 380, 320, 400, 360];
                            const height = heightVariants[index % heightVariants.length];

                            return (
                                <div
                                    key={img.id}
                                    className="package-gallery-item"
                                    onClick={() => openLightbox(index)}
                                >
                                    <Image
                                        src={img.imagePath}
                                        alt={`${packageName} Gallery ${index + 1}`}
                                        width={400}
                                        height={height}
                                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            display: 'block'
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Inline Styles */}
                <style jsx>{`
                    .package-masonry-grid {
                        column-count: 4;
                        column-gap: 12px;
                        width: 100%;
                    }
                    .package-gallery-item {
                        display: inline-block;
                        width: 100%;
                        break-inside: avoid;
                        margin-bottom: 12px;
                        border-radius: 2px;
                        overflow: hidden;
                        position: relative;
                        background-color: #e5e7eb;
                        cursor: pointer;
                    }
                    .package-gallery-item img {
                        transition: transform 0.4s ease;
                    }
                    .package-gallery-item:hover img {
                        transform: scale(1.06);
                    }
                    
                    @media (max-width: 1200px) {
                        .package-masonry-grid { 
                            column-count: 3;
                        }
                    }
                    @media (max-width: 768px) {
                        .package-masonry-grid { 
                            column-count: 2;
                            column-gap: 10px;
                        }
                        .package-gallery-item {
                            margin-bottom: 10px;
                        }
                    }
                    @media (max-width: 480px) {
                        .package-masonry-grid { 
                            column-count: 2;
                            column-gap: 8px;
                        }
                        .package-gallery-item {
                            margin-bottom: 8px;
                            border-radius: 1px;
                        }
                    }
                `}</style>
            </section>

            {/* Lightbox Modal */}
            {lightboxOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px'
                    }}
                    onClick={closeLightbox}
                >
                    {/* Close Button */}
                    <button
                        onClick={closeLightbox}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s ease',
                            zIndex: 10001
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    >
                        <FaTimes />
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToPrevious();
                        }}
                        style={{
                            position: 'absolute',
                            left: '20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s ease',
                            zIndex: 10001
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    >
                        <FaChevronLeft />
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            goToNext();
                        }}
                        style={{
                            position: 'absolute',
                            right: '20px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: 'none',
                            color: 'white',
                            fontSize: '24px',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'background 0.3s ease',
                            zIndex: 10001
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    >
                        <FaChevronRight />
                    </button>

                    {/* Image Container */}
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            width: '85vw',
                            height: '80vh',
                            maxWidth: '1400px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src={galleryImages[currentImageIndex].imagePath}
                            alt={`${packageName} Gallery ${currentImageIndex + 1}`}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                width: 'auto',
                                height: 'auto',
                                objectFit: 'contain',
                                borderRadius: '4px'
                            }}
                        />

                        {/* Image Counter */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-40px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            color: 'white',
                            fontSize: '14px',
                            background: 'rgba(0, 0, 0, 0.5)',
                            padding: '8px 16px',
                            borderRadius: '20px'
                        }}>
                            {currentImageIndex + 1} / {galleryImages.length}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
