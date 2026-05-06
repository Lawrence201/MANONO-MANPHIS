import React from 'react';
import Image from 'next/image';
import styles from './Essentials.module.css';

const services = [
    {
        icon: (
            <svg fill="#0fb6eeff" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">

                <path d="M0 16c0-8.8 7.2-16 16-16h480c8.8 0 16 7.2 16 16v80c0 8.8-7.2 16-16 16h-16v32h16c8.8 0 16 7.2 16 16v192c0 8.8-7.2 16-16 16H16c-8.8 0-16-7.2-16-16V160c0-8.8 7.2-16 16-16h16v-32H16c-8.8 0-16-7.2-16-16V16zm32 80h32v48H32v-48zm416 0h32v48h-32v-48zM64 32v48c26.5 0 48-21.5 48-48H64zM160 32c0 26.5 21.5 48 48 48V32h-48zm96 0v48c26.5 0 48-21.5 48-48h-48zm96 0c0 26.5 21.5 48 48 48V32h-48zm96 0v48c26.5 0 48-21.5 48-48h-48zM32 336h448v-160H32v160z" />


                <path d="M112 144c-8.8 0-16 7.2-16 16v144c0 8.8 7.2 16 16 16h32v-32h-16V176h256v112h-16v32h32c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H112z" />


                <circle cx="256" cy="208" r="32" fill="" stroke="#0fb6eeff" strokeWidth="16" />
                <path d="M192 240c-8.8 0-16 7.2-16 16v16c0 8.8 7.2 16 16 16h16v16c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16v-16h16c8.8 0 16-7.2 16-16v-16c0-8.8-7.2-16-16-16h-16v-8h-80v8h-16zm32 32v-16h64v16h-64z" />


                <rect x="0" y="384" width="160" height="16" rx="8" />
                <rect x="0" y="416" width="144" height="16" rx="8" />
                <rect x="0" y="448" width="128" height="16" rx="8" />
                <rect x="0" y="480" width="96" height="16" rx="8" />


                <rect x="352" y="384" width="160" height="16" rx="8" />
                <rect x="368" y="416" width="144" height="16" rx="8" />
                <rect x="384" y="448" width="128" height="16" rx="8" />
                <rect x="416" y="480" width="96" height="16" rx="8" />


                <path d="M120 336L176 512h16L128 336h-8zM392 336L336 512h-16l64-176h8z" stroke="#0fb6eeff" strokeWidth="8" fill="none" />
            </svg>
        ),
        title: 'Conference and Event Halls',
        description: 'Modern, spacious halls designed for conferences, seminars, workshops, corporate meetings, lectures, weddings, and special events. Each space is equipped with professional audio-visual facilities to support presentations and large audiences.',
    },
    {
        icon: (
            <svg fill="#0fb6eeff" height="1.5em" width="1.5em" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 290.625 290.625" xmlSpace="preserve">
                <g>
                    <g>
                        <path d="M281.25,278.906L281.25,278.906V2.344h-9.375v70.313h-5.55c0.525-1.472,0.862-3.038,0.862-4.688
			c0-7.753-6.309-14.063-14.063-14.063H79.688c-7.753,0-14.063,6.309-14.063,14.063c0,1.65,0.338,3.216,0.863,4.688H60.07
			c0.53-1.472,0.867-3.038,0.867-4.688c0-7.753-6.309-14.063-14.063-14.063H37.5c-7.753,0-14.063,6.309-14.063,14.063
			c0,1.65,0.337,3.216,0.862,4.688h-5.55V2.344H9.375v276.563H0v9.375h290.625v-9.375H281.25z M79.688,63.281h173.438
			c2.587,0,4.688,2.105,4.688,4.688s-2.1,4.688-4.688,4.688H79.688C77.1,72.656,75,70.552,75,67.969S77.1,63.281,79.688,63.281z
			 M192.187,91.406v-9.375h51.563v9.375H192.187z M243.75,100.781v9.375h-51.563v-9.375H243.75z M243.75,232.031v9.375h-51.563
			v-9.375H243.75z M37.501,63.281h9.375c2.588,0,4.688,2.105,4.688,4.688s-2.1,4.688-4.688,4.688H37.5
			c-2.588-0.001-4.687-2.105-4.687-4.688S34.913,63.281,37.501,63.281z M18.75,82.031H37.5h9.375h32.813h103.125v9.375H18.75V82.031
			z M159.375,203.906v-7.584l-3.581-1.791h27.019v9.375H159.375z M182.813,213.281v9.375h-23.438v-9.375H182.813z M18.749,100.781
			h164.063v84.375h-28.124v-17.33c0-8.33-4.139-16.064-11.067-20.681c-4.092-2.733-8.864-4.177-13.791-4.177h-7.936
			c10.332-0.011,18.731-8.416,18.731-18.749c0-10.341-8.409-18.75-18.75-18.75s-18.75,8.409-18.75,18.75
			c0,10.334,8.399,18.738,18.731,18.749h-7.936c-4.927,0-9.694,1.444-13.786,4.177c-6.933,4.617-11.072,12.347-11.072,20.681v17.33
			h-9.375c-7.753,0-14.063,6.309-14.063,14.063c0,1.65,0.338,3.216,0.863,4.688H60.07c0.53-1.472,0.867-3.037,0.867-4.688
			c0-7.753-6.309-14.063-14.063-14.063H37.5c-7.753,0-14.063,6.309-14.063,14.063c0,1.65,0.337,3.216,0.862,4.688h-5.55V100.781z
			 M121.875,199.073l-23.438,5.859v48.192c0,1.289-1.055,2.344-2.344,2.344s-2.344-1.055-2.344-2.344v-51.009l18.75-9.375v-26.334
			h-9.375v20.541l-4.688,2.344v-21.464c0-5.189,2.578-10.008,6.895-12.881c2.55-1.706,5.517-2.602,8.587-2.602h15.914
			c3.066,0,6.037,0.895,8.587,2.602c4.313,2.873,6.891,7.688,6.891,12.881v21.464l-4.688-2.344v-20.541h-9.375v26.334l18.75,9.375
			v51.009c0,1.289-1.055,2.344-2.344,2.344s-2.344-1.055-2.344-2.344v-48.192L121.875,199.073z M135.939,212.253v10.402h-0.001
			h-28.125v-10.402l14.063-3.516L135.939,212.253z M112.5,124.219c0-5.17,4.205-9.375,9.375-9.375s9.375,4.205,9.375,9.375
			s-4.205,9.375-9.375,9.375S112.5,129.388,112.5,124.219z M37.5,213.281h9.375h32.813h4.688v9.375h-0.001H18.75v-9.375H37.5z
			 M32.813,199.219c0-2.587,2.1-4.688,4.688-4.688h9.375c2.588,0,4.688,2.1,4.688,4.688s-2.1,4.688-4.688,4.688H37.5
			C34.912,203.906,32.813,201.805,32.813,199.219z M84.375,196.322v7.584h-4.688c-2.588,0-4.688-2.1-4.688-4.688
			c0-2.588,2.1-4.688,4.688-4.688h8.269L84.375,196.322z M182.814,278.906H18.75v-46.875h65.625v21.094
			c0,6.464,5.255,11.719,11.719,11.719s11.719-5.255,11.719-11.719v-21.094h28.125v21.094c0,6.464,5.255,11.719,11.719,11.719
			c6.464,0,11.719-5.255,11.719-11.719v-21.094h23.438V278.906z M192.187,250.781h51.563v9.375h-51.563V250.781z M243.751,278.906
			h-51.563v-9.375h51.563V278.906z M243.751,222.656h-51.563v-9.375h51.563V222.656z M243.751,203.906h-51.563v-9.375h51.563
			V203.906z M243.751,185.156h-51.563v-9.375h51.563V185.156z M243.751,166.406h-51.563v-9.375h51.563V166.406z M243.751,147.656
			h-51.563v-9.375h51.563V147.656z M243.751,128.906h-51.563v-9.375h51.563V128.906z M271.875,278.906h-18.75v-46.875h18.75V278.906
			z M271.875,222.656h-18.75v-9.375h18.75V222.656z M271.875,203.906h-18.75V100.781h18.75V203.906z M271.875,91.406h-18.75v-9.375
			h18.75V91.406z"/>
                    </g>
                </g>
            </svg>
        ),
        title: 'Lodges & Accommodation',
        description: 'Clean, comfortable, and secure lodging for event guests, students, corporate teams, and group bookings. Ideal for both short stays and multi-day conferences or retreats.',
    },
    {
        icon: (
            <svg fill="#de8825" width="1.5em" height="1.5em" viewBox="0 0 64 64" version="1.1" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">

                <g id="Layer_2" />

                <g id="Layer_3" />

                <g id="Layer_4">

                    <g>

                        <path d="M63.9,40.7c-0.6-1.1-16-27.4-29.3-27.4c0,0,0,0,0,0c0,0,0,0,0,0C21.2,13.2,1,45,0.2,46.3C0,46.6-0.1,47,0.1,47.4    C0.3,47.7,0.6,48,1,48l9.4,0.7c0,0,0,0,0,0l6.1,0.4l22.7,1.6c0,0,0.1,0,0.1,0c0,0,0,0,0,0c0,0,0,0,0,0c0,0,0,0,0,0    c0,0,0,0,0,0c0,0,0.1,0,0.1,0c0.1,0,0.2,0,0.2,0l23.4-8.4c0.3-0.1,0.6-0.4,0.7-0.7C64,41.3,64,41,63.9,40.7z M59.1,37.2l-18.8,6.4    c-1-15.8-3.2-24.6-4.2-28C44.6,17.1,54.4,30.1,59.1,37.2z M33.7,15.5c0.9,2.7,3.7,13,4.6,33l-10-0.7c0.4-2.9,0.9-9.9-1.8-13    c-0.9-1.1-2.1-1.6-3.5-1.6c-6.3,0-11.7,10.3-13.2,13.3l-6.8-0.5C7.2,39.7,23.2,16.6,33.7,15.5z M12.3,46.6    c2.1-4.1,6.7-11.3,10.8-11.3c0.7,0,1.3,0.3,1.8,0.8c1.9,2.3,1.6,8.3,1.2,11.4l-10.8-0.8L12.3,46.6z M40.5,48.1    c0-0.7-0.1-1.5-0.1-2.2l19.9-6.8c0.4,0.6,0.7,1.1,0.9,1.5L40.5,48.1z" />

                    </g>

                </g>

                <g id="Layer_5" />

                <g id="Layer_6" />

                <g id="Layer_7" />

                <g id="Layer_8" />

                <g id="Layer_9" />

                <g id="Layer_10" />

                <g id="Layer_11" />

                <g id="Layer_12" />

                <g id="Layer_13" />

                <g id="Layer_15" />

                <g id="Layer_16" />

                <g id="Layer_17" />

                <g id="Layer_18" />

                <g id="Layer_19" />

                <g id="Layer_20" />

                <g id="Layer_21" />

                <g id="Layer_22" />

                <g id="Layer_23" />

                <g id="Layer_24" />

                <g id="Layer_25" />

                <g id="Layer_26" />

                <g id="Layer_27" />

            </svg>
        ),
        title: 'Group Retreat Hosting',
        description: 'Comprehensive hosting support for conferences, trainings, workshops, retreats, and large group programs. Our team ensures proper space coordination and smooth event flow.',
    },
    {
        icon: (
            <svg fill="#de8825" height="1.5em" width="1.5em" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512" xmlSpace="preserve">
                <g>
                    <polygon fill="#de8825" points="186.769,413.08 174.944,387.9 166.961,387.9 166.961,432.31 175.29,432.31 175.29,407.01 
            183.798,424.604 189.756,424.604 198.023,407.108 198.023,432.31 206.352,432.31 206.352,387.9 198.369,387.9 	"/>
                    <polygon fill="#de8825" points="219.062,432.31 248.115,432.31 248.115,424.642 227.376,424.642 227.376,413.725 245.068,413.725 
            245.068,406.117 227.376,406.117 227.376,395.56 248.115,395.56 248.115,387.9 219.062,387.9 	"/>
                    <polygon fill="#de8825" points="284.249,415.578 266.031,387.9 258.679,387.9 258.679,432.31 267.007,432.31 267.007,404.572 
            285.224,432.31 292.562,432.31 292.562,387.9 284.249,387.9 	"/>
                    <path fill="#de8825" d="M328.757,416.734c0,2.634-0.705,4.629-2.146,6.093c-1.441,1.455-3.317,2.168-5.762,2.168
            c-2.431,0-4.292-0.705-5.718-2.161c-1.41-1.441-2.116-3.496-2.116-6.1V387.9h-8.328v29.134c0,2.311,0.42,4.457,1.23,6.378
            c0.825,1.928,1.981,3.579,3.422,4.937c1.426,1.358,3.166,2.423,5.147,3.188c1.966,0.751,4.112,1.134,6.363,1.134
            c2.25,0,4.412-0.383,6.377-1.134c1.982-0.765,3.707-1.823,5.178-3.181c1.455-1.358,2.611-3.016,3.452-4.945
            c0.81-1.921,1.245-4.066,1.245-6.378V387.9h-8.343V416.734z"/>
                    <path fill="#de8825" d="M167.621,238.116c16.762,19.996,25.436,21.556,37.786,21.774c9.949,0.18,17.242-1.08,27.732,11.352l5.807,6.85
            l14.706-17.422l-3.316-3.939c-10.504-12.433-8.028-19.425-6.542-29.262c1.846-12.2,1.77-21.009-15.126-40.892
            c0,0-13.416-15.891-24.385-28.886c-9.154-10.827-23.74,0.833-14.376,11.922l25.825,30.575c2.026,2.416,1.906,5.845-0.255,7.668
            l-1.05,0.885c-2.146,1.823-5.567,1.365-7.593-1.043l-25.96-30.74c-5.237-6.19-10.564-4.87-14.151-1.823
            c-3.616,3.039-5.807,8.066-0.57,14.263l25.946,30.74c2.04,2.408,1.921,5.838-0.241,7.668l-1.05,0.886
            c-2.162,1.823-5.553,1.365-7.594-1.05l-25.81-30.568c-9.379-11.104-23.319,1.336-14.166,12.17
            C154.206,222.233,167.621,238.116,167.621,238.116z"/>
                    <polygon fill="#de8825" points="323.79,343.722 280.437,292.378 265.731,309.808 306.608,358.24 	" />
                    <path fill="#de8825" d="M195.383,343.962l0.285-0.173l17.107,14.451l63.94-75.736c22.81-26.193,23.185,5.222,50.826-29.457
            c11.9-14.091,22.524-40.561,28.451-54.99c9.229-22.449-10.144-32.278-21.834-18.435c-5.687,6.73-32.728,38.761-65.111,77.101
            c-32.728,38.768-70.769,83.809-73.47,86.998C195.473,343.864,195.383,343.962,195.383,343.962z"/>
                    <path fill="#de8825" d="M101.085,73.064c-6.168,0-11.616-2.453-15.667-6.49c-4.037-4.067-6.483-9.514-6.498-15.682
		c0.014-6.175,2.461-11.622,6.498-15.681c4.051-4.03,9.499-6.483,15.667-6.498l346.34,0.007V0.007L101.085,0
		C72.993,0.014,50.214,22.786,50.214,50.893v410.214c0,28.106,22.779,50.878,50.871,50.893h360.701V73.064H101.085z
		 M433.064,483.286H101.085c-12.23-0.022-22.134-9.927-22.164-22.179V96.639c6.707,3.256,14.211,5.147,22.164,5.147h331.979V483.286
		z"/>
                </g>
            </svg>
        ),
        title: 'Catering & Hospitality Services',
        description: 'Our in-house hospitality team delivers timely, well-organized meal service for events of all sizes. Menus are planned to suit your audience and schedule, ensuring guests remain refreshed and focused throughout your event.',
    },
    {
        icon: (
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                {/* WiFi Icon - Electric Blue */}
                <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                <circle cx="12" cy="20" r="1" fill="#2563EB" />
            </svg>
        ),
        title: 'Technology-Ready Environment',
        description: 'Our facility is equipped to support modern events with dependable internet access, making it easy to run digital presentations, hybrid meetings, and tech-enabled sessions without disruption',
    },
    {
        icon: (
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                {/* Event Planning/Calendar Icon - Golden Yellow */}
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4" />
                <path d="M3 10h18" />
                <path d="M8 14h.01M12 14h.01M16 14h.01" />
                <path d="M8 18h.01M12 18h.01M16 18h.01" />
            </svg>
        ),
        title: 'End-to-End Event Support',
        description: 'From pre-event preparation to on-the-day coordination, our team provides hands-on support to keep everything running smoothly. We handle the details so you can focus on your guests and your program.',
    },
];

interface EssentialsProps {
    image1?: string;
    image2?: string;
}

const Essentials = ({ image1 = '/images/halls/Agape.avif', image2 = '/images/halls/Bethele.jpg' }: EssentialsProps) => {
    return (
        <section className={styles.section}>
            <div className={styles.leftColumn}>
                <div className={styles.verticalImageContainer}>
                    <Image
                        src={image1}
                        alt="Camp Elim Africa event hall view"
                        fill
                        className={styles.verticalImage}
                    />
                </div>

                <p className={styles.quote}>
                    “Set within a calm and scenic environment, Camp Elim Africa offers the ideal setting for focused events, productive gatherings, and memorable experiences for everyone     .”
                </p>
            </div>

            <div className={styles.rightColumn}>
                <p className={styles.subtitle}>OUR FACILITIES & SERVICES</p>
                <h2 className={styles.title}>Everything You Need for a Successful Event or Stay</h2>

                <div className={styles.servicesGrid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.serviceItem}>
                            <div className={styles.iconWrapper}>{service.icon}</div>
                            <div className={styles.serviceContent}>
                                <h3 className={styles.serviceTitle}>{service.title}</h3>
                                <p className={styles.serviceDescription}>{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.bottomImageContainer}>
                    <Image
                        src={image2}
                        alt="Camp Elim Africa event facility view"
                        fill
                        className={styles.bottomImage}
                    />
                </div>
            </div>
        </section>
    );
};


export default Essentials;
