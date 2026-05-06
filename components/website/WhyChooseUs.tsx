import React from 'react';
import styles from './WhyChooseUs.module.css';

const features = [
{
    title: 'Versatile Event Spaces',
    description: 'From conference halls and lecture rooms to comfortable lodges, we offer all the facilities you need for corporate, social, and educational events.',
    icon: (
        <svg className={styles.icon} fill="#ffffff" viewBox="0 0 256 256">
            <path d="M171.6,153.2c0-8.5,6.9-15.4,15.4-15.4s15.4,6.9,15.4,15.4s-6.9,15.4-15.4,15.4S171.6,161.7,171.6,153.2z M183.4,191.5 c0-8.5-6.9-15.4-15.4-15.4s-15.4,6.9-15.4,15.4c0,8.5,6.9,15.4,15.4,15.4S183.4,200,183.4,191.5z M143.5,209.7h-17.3H109 c-10.5,0-17.1,8.7-17.1,19.6v26.8h11.8v-23.7c0-1.1,0.9-1.8,1.8-1.8c1.1,0,1.8,0.7,1.8,1.8V256h38v-23.6c0-1.1,0.9-1.8,1.8-1.8 c1.1,0,1.8,0.9,1.8,1.8V256h11.8v-26.6C160.9,218.4,154.3,209.7,143.5,209.7z M163.2,153.2c0-8.5-6.9-15.4-15.4-15.4 c-8.5,0-15.4,6.9-15.4,15.4s6.9,15.4,15.4,15.4C156.3,168.6,163.2,161.7,163.2,153.2z M193,191.5c0,8.5,6.9,15.4,15.4,15.4 s15.4-6.9,15.4-15.4s-6.9-15.4-15.4-15.4S193,183,193,191.5z M226.2,209.6h-17.3h-17.4v0.1c-10.5,0-17.1,8.7-17.1,19.6v26.8h11.8 v-23.7c0-1.1,0.9-1.8,1.8-1.8c1.1,0,1.8,0.7,1.8,1.8V256h38v-23.6c0-1.1,0.9-1.8,1.8-1.8c1.1,0,1.8,0.9,1.8,1.8V256h11.8v-26.6 C243.4,218.3,236.8,209.6,226.2,209.6z M47.3,206.9c8.5,0,15.4-6.9,15.4-15.4c0-8.5-6.9-15.4-15.4-15.4s-15.4,6.9-15.4,15.4 C31.9,200,38.8,206.9,47.3,206.9z M64.4,209.6H47.1H29.8c-10.5,0-17.1,8.7-17.1,19.6V256h11.7v0v-23.6c0-1.1,0.9-1.8,1.8-1.8 c1.1,0,1.8,0.7,1.8,1.8V256h38v-23.6c0-1.1,0.9-1.8,1.8-1.8c1.1,0,1.8,0.9,1.8,1.8V256h11.8v-26.6C81.7,218.3,75,209.6,64.4,209.6z M126.3,206.9c8.5,0,15.4-6.9,15.4-15.4s-6.9-15.4-15.4-15.4s-15.4,6.9-15.4,15.4S117.8,206.9,126.3,206.9z M67,168.6 c8.5,0,15.4-6.9,15.4-15.4s-6.9-15.4-15.4-15.4s-15.4,6.9-15.4,15.4S58.5,168.6,67,168.6z M93.1,153.2c0,8.5,6.9,15.4,15.4,15.4 s15.4-6.9,15.4-15.4s-6.9-15.4-15.4-15.4S93.1,144.8,93.1,153.2z M103.2,191.5c0-8.5-6.9-15.4-15.4-15.4s-15.4,6.9-15.4,15.4 c0,8.5,6.9,15.4,15.4,15.4S103.2,200,103.2,191.5z M121.3,92.7h11.3l-1.1-5.9h-9.1L121.3,92.7z M124.2,76.7l-0.7,4h7.1l-0.7-4H124.2 z M91.3,46.7c0-20.1,16.5-36.4,36.7-36.4s36.7,16.2,36.7,36.4v46.9h10.4V46.7C175.1,20.9,154,0,128,0S80.9,20.9,80.9,46.7v46.9h10.4 V46.7z M118.7,108.5h16.7l-1.4-7.9h-14L118.7,108.5z M140.9,54c0-7.6-6.3-13.8-13.9-13.8c-7.6,0-13.9,6.2-13.9,13.8v18.8h27.8V54z" />
        </svg>
    )
},
{
    title: 'All-in-One Facility',
    description: 'Everything you need under one roof — professional event spaces, accommodations, and scenic surroundings for a seamless experience.',
    icon: (
        <svg className={styles.icon} version="1.0" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
             width="800px" height="800px" viewBox="0 0 64 64" enableBackground="new 0 0 64 64" xmlSpace="preserve">
            <g>
                <path fill="#FFFFFF" d="M18,10v54h9V53c0-0.553,0.447-1,1-1h8c0.553,0,1,0.447,1,1v11h9V20V4c0-2.211-1.789-4-4-4H22
                    c-2.211,0-4,1.789-4,4V10z M34,9c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1v4c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1V9z
                    M34,19c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1v4c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1V19z M34,29c0-0.553,0.447-1,1-1
                    h4c0.553,0,1,0.447,1,1v4c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1V29z M34,39c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1v4
                    c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1V39z M24,9c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1v4c0,0.553-0.447,1-1,1h-4
                    c-0.553,0-1-0.447-1-1V9z M24,19c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1v4c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1V19z
                    M24,29c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1v4c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1V29z M24,39c0-0.553,0.447-1,1-1
                    h4c0.553,0,1,0.447,1,1v4c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1V39z"/>
                <rect x="26" y="30" fill="#FFFFFF" width="2" height="2"/>
                <rect x="26" y="40" fill="#FFFFFF" width="2" height="2"/>
                <rect x="29" y="54" fill="#FFFFFF" width="6" height="10"/>
                <rect x="8" y="50" fill="#FFFFFF" width="2" height="2"/>
                <rect x="26" y="10" fill="#FFFFFF" width="2" height="2"/>
                <rect x="26" y="20" fill="#FFFFFF" width="2" height="2"/>
                <rect x="36" y="20" fill="#FFFFFF" width="2" height="2"/>
                <rect x="36" y="10" fill="#FFFFFF" width="2" height="2"/>
                <rect x="36" y="30" fill="#FFFFFF" width="2" height="2"/>
                <rect x="36" y="40" fill="#FFFFFF" width="2" height="2"/>
                <rect x="8" y="40" fill="#FFFFFF" width="2" height="2"/>
                <path fill="#FFFFFF" d="M16,10H4c-2.211,0-4,1.789-4,4v46c0,2.211,1.789,4,4,4h12V10z M12,53c0,0.553-0.447,1-1,1H7
                    c-0.553,0-1-0.447-1-1v-4c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1V53z M12,43c0,0.553-0.447,1-1,1H7c-0.553,0-1-0.447-1-1v-4
                    c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1V43z M12,33c0,0.553-0.447,1-1,1H7c-0.553,0-1-0.447-1-1v-4c0-0.553,0.447-1,1-1h4
                    c0.553,0,1,0.447,1,1V33z M11,24H7c-0.553,0-1-0.447-1-1v-4c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1v4
                    C12,23.553,11.553,24,11,24z"/>
                <rect x="54" y="50" fill="#FFFFFF" width="2" height="2"/>
                <rect x="54" y="40" fill="#FFFFFF" width="2" height="2"/>
                <rect x="54" y="30" fill="#FFFFFF" width="2" height="2"/>
                <path fill="#FFFFFF" d="M60,20H48v44h12c2.211,0,4-1.789,4-4V24C64,21.789,62.211,20,60,20z M58,53c0,0.553-0.447,1-1,1h-4
                    c-0.553,0-1-0.447-1-1v-4c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1V53z M58,43c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1v-4
                    c0-0.553,0.447-1,1-1h4c0.553,0,1,0.447,1,1V43z M58,33c0,0.553-0.447,1-1,1h-4c-0.553,0-1-0.447-1-1v-4c0-0.553,0.447-1,1-1h4
                    c0.553,0,1,0.447,1,1V33z"/>
                <rect x="8" y="30" fill="#FFFFFF" width="2" height="2"/>
                <rect x="8" y="20" fill="#FFFFFF" width="2" height="2"/>
            </g>
        </svg>
    )
},
{
    title: 'Professional Support',
    description: 'Our experienced team ensures every event, from corporate meetings to weddings and workshops, runs smoothly and successfully.',
    icon: (
        <svg className={styles.icon} version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
             viewBox="0 0 502.648 502.648" xmlSpace="preserve">
            <g>
                <g>
                    <g>
                        <circle style={{ fill: '#ffffff' }} cx="250.399" cy="91.549" r="58.694"/>
                        <path style={{ fill: '#ffffff' }} d="M455.861,253.028l-54.703-11.411c-18.637-3.904-37.037,4.638-46.765,19.824
                            c-9.448-4.853-19.608-9.038-30.415-12.511v-32.529c0.022-24.612-20.126-44.738-44.651-44.738h-55.933
                            c-24.655,0-44.716,20.126-44.716,44.738v32.701c-10.699,3.408-20.751,7.593-30.264,12.468
                            c-9.728-15.251-28.15-23.857-46.809-19.953l-54.747,11.411c-24.03,5.026-39.626,28.862-34.6,52.978l13.741,65.64
                            c4.983,24.051,28.84,39.647,52.892,34.621l17.321-3.624c8.671,12.813,20.665,24.569,36.023,34.621
                            c31.989,20.967,74.247,32.529,119.092,32.529c68.617,0,127.721-27.589,154.943-67.215l17.602,3.689
                            c24.03,5.004,47.887-10.57,52.87-34.621l13.762-65.64C495.508,281.89,479.912,258.054,455.861,253.028z M251.305,447.381
                            c-40.51,0-78.475-10.203-106.797-28.862c-9.707-6.342-17.753-13.395-24.202-20.945l13.266-2.783
                            c24.073-5.004,39.669-28.84,34.643-52.913l-12.317-59.018c7.183-3.861,14.733-7.248,22.757-10.138v10.764
                            c0,24.569,20.104,44.695,44.716,44.695h55.933c24.548,0,44.652-20.147,44.652-44.695v-11.325
                            c8.175,2.912,15.854,6.256,22.973,10.052L334.439,341.9c-4.983,24.073,10.591,47.909,34.664,52.913l13.395,2.804
                            C357.52,427.191,308.101,447.381,251.305,447.381z"/>
                        <circle style={{ fill: '#ffffff' }} cx="443.954" cy="168.708" r="58.694"/>
                        <path style={{ fill: '#ffffff' }} d="M70.736,226.172c31.752-6.644,52.029-37.77,45.471-69.501
                            c-6.687-31.709-37.749-52.072-69.523-45.428c-31.709,6.622-52.072,37.727-45.428,69.458
                            C7.879,212.453,38.984,232.795,70.736,226.172z"/>
                    </g>
                </g>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
                <g/>
            </g>
        </svg>
    )
},
    {
        title: 'Open to All',
        description: 'Welcoming businesses, schools, social groups, and individuals',
        icon: (
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2.05 12h19.9" />
            </svg>
        )
    }
];

const WhyChooseUs = () => {
    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}>Why Choose Camp Elim Africa</h2>
                <p className={styles.subTitle}>
                    We are more than a venue — we are your trusted partner for unforgettable events in Ghana.
                </p>
            </div>

            <div className={styles.grid}>
                {features.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                        <div className={styles.iconWrapper}>
                            {feature.icon}
                        </div>
                        <div className={styles.content}>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyChooseUs;
