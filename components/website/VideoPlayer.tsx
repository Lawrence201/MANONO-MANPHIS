'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '@/app/(website)/about/About.module.css'; // Re-use styles or inline some? 
// Actually, re-using CSS module from a different path might be tricky if not careful with paths. 
// Standard CSS modules usage is local. 
// I'll use inline styles or a new CSS module. 
// Given the simplicity, I'll use inline styles for the button/overlay and pass className for the container.

interface VideoPlayerProps {
    thumbnailSrc: string;
    videoId: string;
    className?: string;
}

export default function VideoPlayer({ thumbnailSrc, videoId, className }: VideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying) {
        return (
            <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className={className}
                style={{ border: 'none', width: '100%', height: '100%' }}
            />
        );
    }

    return (
        <div
            className={className}
            style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer', overflow: 'hidden' }}
            onClick={() => setIsPlaying(true)}
        >
            <Image
                src={thumbnailSrc}
                alt="Video Thumbnail"
                fill
                style={{ objectFit: 'cover' }}
            />
            {/* Overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.3s'
            }}
                className="group hover:bg-black/30"
            >
                {/* Play Button - Minimalist Outline */}
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transition: 'transform 0.3s' }}>
                    {/* Circle Outline */}
                    <circle cx="50" cy="50" r="48" stroke="white" strokeWidth="2" />
                    {/* Triangle Outline */}
                    <path d="M40 30L75 50L40 70V30Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
}
