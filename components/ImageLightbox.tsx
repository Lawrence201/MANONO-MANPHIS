'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { FaXmark, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import styles from './ImageLightbox.module.css';

interface ImageLightboxProps {
    images: string[];
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrev: () => void;
}

export default function ImageLightbox({ images, currentIndex, onClose, onNext, onPrev }: ImageLightboxProps) {
    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') onNext();
            if (e.key === 'ArrowLeft') onPrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose, onNext, onPrev]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className={styles.lightboxOverlay} onClick={onClose}>
            <button className={styles.closeButton} onClick={onClose} aria-label="Close">
                <FaXmark size={24} />
            </button>

            <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.imageWrapper}>
                    <Image
                        src={images[currentIndex]}
                        alt={`Gallery image ${currentIndex + 1}`}
                        fill
                        sizes="90vw"
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                </div>

                {images.length > 1 && (
                    <>
                        <button
                            className={`${styles.navButton} ${styles.prevButton}`}
                            onClick={onPrev}
                            aria-label="Previous image"
                        >
                            <FaChevronLeft size={30} />
                        </button>
                        <button
                            className={`${styles.navButton} ${styles.nextButton}`}
                            onClick={onNext}
                            aria-label="Next image"
                        >
                            <FaChevronRight size={30} />
                        </button>
                    </>
                )}

                <div className={styles.imageCounter}>
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </div>
    );
}
