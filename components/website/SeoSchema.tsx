'use client';

import Script from 'next/script';

const SeoSchema = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "EventVenue",
                "name": "Camp Elim Africa",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "4th Street, Ga East",
                    "addressLocality": "Accra",
                    "addressRegion": "Greater Accra",
                    "postalCode": "00233",
                    "addressCountry": "GH"
                },
                "telephone": "+233539770722",
                "url": "https://campelimafrica.com",
                "image": "https://campelimafrica.com/hero_1.avif",
                "description": "Ghana's premier event center and retreat facility. We host executive conferences, weddings, seminars, and church retreats in a serene environment.",
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    "opens": "00:00",
                    "closes": "23:59"
                },
                "sameAs": [
                    "https://www.facebook.com/CampElimAfrica",
                    "https://www.instagram.com/campelimafrica"
                ]
            },
            {
                "@type": "LodgingBusiness",
                "name": "Camp Elim Africa Lodges & Retreats",
                "description": "Affordable and comfortable accommodation for groups, individuals, and church retreats in Accra, Ghana.",
                "telephone": "+233539770722",
                "url": "https://campelimafrica.com/services/hostels",
                "checkinTime": "14:00",
                "checkoutTime": "11:00"
            },
            {
                "@type": "NGO",
                "name": "Camp Elim Africa Ministry",
                "description": "A faith-based community organization dedicated to spiritual growth, youth development, and charity.",
                "url": "https://campelimafrica.com/about"
            }
        ]
    };

    return (
        <Script
            id="camp-elim-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            strategy="afterInteractive"
        />
    );
};

export default SeoSchema;
