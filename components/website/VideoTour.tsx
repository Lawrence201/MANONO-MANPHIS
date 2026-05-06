import React from 'react';
import Image from 'next/image';
import styles from './VideoTour.module.css';

const VideoTour = () => {
    return (
        <section className={styles.section}>
           <div className={styles.header}>
                <h2 className={styles.title}>A Tour Around Camp Elim Africa</h2>
                <p className={styles.subTitle}>
                   Explore the beauty, comfort, and versatile event spaces of Camp Elim Africa before you arrive.
                  See the professional halls, cozy accommodations, and inspiring surroundings that make every event unforgettable.
                </p>
            </div>


            <div className={styles.videoContainer}>
                <Image
                    src="/images/halls/tour.avif"
                    alt="Tour of Camp Elim Africa"
                    fill
                    className={styles.thumbnail}
                    priority
                />
                <div className={styles.overlay}>
                    <button className={styles.playButton} aria-label="Play Video">
                        <svg
                            className={styles.playIcon}
                            xmlns="http://www.w3.org/2000/svg"
                            width="64"
                            height="72"
                            viewBox="0 0 64 72"
                        >
                            <path
                                stroke="#FFF"
                                strokeWidth="2"
                                fill="none"
                                d="m3.121 1.446 58.545 35.412L1.708 69.853 3.121 1.446Z"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default VideoTour;
