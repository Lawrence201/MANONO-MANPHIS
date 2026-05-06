'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ImageLightbox from '@/components/ImageLightbox';
import styles from './HallDetail.module.css';

interface GalleryGridProps {
    images: string[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openLightbox = (index: number) => {
        setCurrentImageIndex(index);
        setLightboxOpen(true);
    };

    const closeLightbox = () => {
        setLightboxOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <div className={styles.galleryGrid}>
                <div
                    className={`${styles.galleryImageWrapper} ${styles.galleryLarge}`}
                    onClick={() => openLightbox(0)}
                    style={{ cursor: 'pointer' }}
                >
                    <Image
                        src={images[0] || '/placeholder-hall.jpg'}
                        alt="Gallery 1"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className={styles.galleryItem}
                        style={{ objectFit: 'cover' }}
                    />
                    <div className={styles.galleryOverlay}>
                        <span>Click to view</span>
                    </div>
                </div>
                <div
                    className={styles.galleryImageWrapper}
                    onClick={() => openLightbox(1)}
                    style={{ cursor: 'pointer' }}
                >
                    <Image
                        src={images[1] || '/placeholder-hall.jpg'}
                        alt="Gallery 2"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={styles.galleryItem}
                        style={{ objectFit: 'cover' }}
                    />
                    <div className={styles.galleryOverlay}>
                        <span>Click to view</span>
                    </div>
                </div>
                <div
                    className={styles.galleryImageWrapper}
                    onClick={() => openLightbox(2)}
                    style={{ cursor: 'pointer' }}
                >
                    <Image
                        src={images[2] || '/placeholder-hall.jpg'}
                        alt="Gallery 3"
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={styles.galleryItem}
                        style={{ objectFit: 'cover' }}
                    />
                    <div className={styles.galleryOverlay}>
                        <span>Click to view</span>
                    </div>
                </div>
            </div>

            {lightboxOpen && (
                <ImageLightbox
                    images={images}
                    currentIndex={currentImageIndex}
                    onClose={closeLightbox}
                    onNext={nextImage}
                    onPrev={prevImage}
                />
            )}
        </>
    );
}
