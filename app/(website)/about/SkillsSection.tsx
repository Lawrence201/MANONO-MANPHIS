import React from 'react';
import styles from './About.module.css';

interface Skill {
    label: string;
    percentage: number;
}

const skills: Skill[] = [
    { label: 'Client Satisfaction', percentage: 98 },
    { label: 'Repeat Bookings', percentage: 85 },
    { label: 'Safety & Facility Standards', percentage: 100 },
    { label: 'Overall Event Success Rating', percentage: 95 },
];

export default function SkillsSection() {
    return (
        <section className={styles.skillsSection}>
            <div className={styles.skillsContent}>
                <h2 className={styles.skillsTitle}>Our Performance Metrics</h2>
                <p className={styles.skillsDesc}>
                  Measuring Excellence Through Client Experience and Event Success
                </p>

                <div className={styles.skillsGrid}>
                    {skills.map((skill, index) => (
                        <div key={index} className={styles.skillItem}>
                            <div className={styles.circleWrapper}>
                                <svg className={styles.circleSvg} viewBox="0 0 120 120">
                                    {/* Track Circle */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        className={styles.circleTrack}
                                    />
                                    {/* Progress Circle */}
                                    <circle
                                        cx="60"
                                        cy="60"
                                        r="50"
                                        className={styles.circleProgress}
                                        style={{
                                            strokeDasharray: '314', // 2 * pi * 50
                                            strokeDashoffset: 314 - (314 * skill.percentage) / 100,
                                        }}
                                    />
                                </svg>
                                <div className={styles.percentageText}>
                                    {skill.percentage}%
                                </div>
                            </div>
                            <h3 className={styles.skillLabel}>{skill.label}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
