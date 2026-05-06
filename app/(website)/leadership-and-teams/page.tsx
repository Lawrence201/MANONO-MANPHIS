import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaChevronRight, FaPhone, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaArrowRightLong, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa6';
import styles from './Leadership.module.css';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Leadership & Teams | Camp Elim Africa',
    description: 'Meet Anthony Seddoh, an expert in Health Policy, Financing and Systems development and consultant to the International Finance Corporation.',
};

export default function LeadershipTeamsPage() {
    return (
        <div className={styles.pageContainer}>
            {/* Hero Section */}
            <div className={styles.hero}>
                <Image
                    src="/images/eccle_1.jpeg"
                    alt="Camp Elim Africa"
                    fill
                    className={styles.heroImage}
                    priority
                    sizes="100vw"
                />
                <div className={styles.heroOverlay} />

                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>Leadership & Teams</h1>
                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <FaChevronRight size={10} style={{ margin: '0 8px' }} />
                        <span>Leadership & Teams</span>
                    </div>
                </div>
            </div>



            {/* Pastor Detail Start */}
            <section className={styles.pastorDetailSection}>
                <div className={styles.container}>
                    <div className={styles.pastorMeta}>
                        {/* Featured Image - Cover */}
                        <div className={styles.featuredImgWrapper}>
                            <Image
                                className={styles.featuredImg}
                                src="/images/camp.jpeg"
                                alt="Pastor Featured Image"
                                fill
                                priority
                            />
                        </div>

                        <div className={styles.pastorInfoWrapper}>
                            {/* Overlapping Pastor Portrait */}
                            <div className={styles.pastorImgWrapper}>
                                <Image
                                    className={styles.pastorImg}
                                    src="/images/eccle_1.jpeg"
                                    alt="Pastor"
                                    fill
                                />
                            </div>

                            <div className={styles.nameSection}>
                                <h3 className={styles.pastorName}>
                                    <span className={styles.prefix}>Doctor</span>
                                    <span className={styles.mainName}>Anthony Seddoh</span>
                                </h3>

                                <div className={styles.infoGrid}>
                                    <div className="left-side">
                                        <p className={styles.designation}>
                                            Director - CampElim Africa
                                        </p>
                                        <div className="social mt-3">
                                            <ul className={styles.socialList}>
                                                <li>
                                                    <Link href="#" className={styles.socialLink}>
                                                        <FaFacebookF />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="#" className={styles.socialLink}>
                                                        <FaTwitter />
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link href="#" className={styles.socialLink}>
                                                        <FaInstagram />
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="right-side">
                                        <ul className={styles.contactList}>
                                            <li className={styles.contactItem}>
                                                <div className={styles.contactIcon}><FaPhone size={20} /></div>
                                                <p className={styles.contactText}>123 456 789 09</p>
                                            </li>
                                            <li className={styles.contactItem}>
                                                <div className={styles.contactIcon}><FaEnvelope size={20} /></div>
                                                <p className={styles.contactText}>username@domain.org</p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.contentSection}>
                        <h3 className={styles.sectionTitle}>Information</h3>
                        <p className={styles.infoText}>
                            Anthony Seddoh is an experienced Health Policy, Financing and Systems development expert with interests in the effect of political, social and economic policies and investments on health development. He has particular interest in issues of neglected tropical diseases.
                        </p>
                        <p className={styles.infoText}>
                            Anthony is currently a consultant to the International Finance Corporation on investments in health in Africa. He has held several previous positions including Senior Director at the Centre for Health and Social Services, responsible for Health Systems and Corporate Operations; served as a Manager/Advisor at the Global Fund to Fight AIDS, TB and Malaria based in Geneva where he advised on building instrumental and perceptive value of the Fund’s work in recipient countries. He also worked with the World Health Organization Africa Region based in Brazzaville and Harare as Technical Officer/Advisor for Strategy, Social Policy and Health with responsibilities for health policy development, planning, social and financing policy analysis and coordination of private sector participation.
                        </p>
                        <p className={styles.infoText}>
                            Anthony holds various qualifications including a doctorate degree (PhD specializing in health policy and investments effectiveness; Master of Business Administration (MBA, strategy) Master of Law (LLM, Health care law).
                        </p>

                    </div>
                </div>
            </section>

            {/* Leadership Introduction Section */}
            <section className={styles.leadershipIntroSection}>
                <div className={styles.introContainer}>
                    <div className={styles.introTextContent}>
                        <div className={styles.quoteIcon}>
                            <FaQuoteLeft />
                        </div>
                        <h2 className={styles.introHeadline}>
                            There really is no better <br /> time to join Camp Elim.
                        </h2>
                        <p className={styles.introBodyText}>
                            Leadership at Camp Elim Africa is about having the skills and confidence to lead teams through achieving huge goals.
                            And most of our opportunities as leaders are about scaling the output of teams, delivering impact through ambiguity
                            and helping teams to move from chaos to clarity. We&apos;re looking for leaders who want to lead in service of
                            their teams and the problems we&apos;re trying to solve.
                        </p>
                        <div className={styles.signature}>
                            <span className={styles.signatureName}>— Anthony Seddoh</span>
                            <span className={styles.signatureTitle}>Executive Director & Founder, Accra</span>
                        </div>
                    </div>

                    <div className={styles.introImageContent}>
                        <div className={styles.imageOuterFrame}>
                            <Image
                                src="/images/eccle_1.jpeg"
                                alt="Anthony Seddoh"
                                fill
                                className={styles.introPortrait}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial Grid Section (2x2) */}
            <section className={styles.reviewGridSection}>
                <h3 className={styles.reviewHeadline}>
                    The trusted go-to source for our clients, leaders and partners.
                </h3>
                <div className={styles.reviewGrid}>
                    {/* Review 1 */}
                    <div className={styles.reviewCard}>
                        <div className={styles.authorCircleLarge}>
                            <Image src="/images/staffs/staff1.jpg" alt="Michael Aagaard" fill className={styles.authorImg} />
                        </div>
                        <div className={styles.reviewQuoteBox}>
                            <FaQuoteLeft className={`${styles.quoteIconLarge} ${styles.topQuote}`} />
                            <p className={styles.reviewQuoteText}>
                                Joanna is the best copywriter I&apos;ve ever met, hands down. One of the things that makes her so freakin&apos; good is her unique ability to combine finely-tuned intuition from years of experience with solid research.
                            </p>
                            <FaQuoteRight className={`${styles.quoteIconLarge} ${styles.bottomQuote}`} />
                            <div className={styles.authorDetails}>
                                <span className={styles.authorName}>Michael Aagaard</span>
                                <span className={styles.authorRole}>CRO Expert (formerly @ Unbounce)</span>
                            </div>
                        </div>
                    </div>

                    {/* Review 2 */}
                    <div className={styles.reviewCard}>
                        <div className={styles.authorCircleLarge}>
                            <Image src="/images/staffs/staff2.jpg" alt="Marie Forleo" fill className={styles.authorImg} />
                        </div>
                        <div className={styles.reviewQuoteBox}>
                            <FaQuoteLeft className={`${styles.quoteIconLarge} ${styles.topQuote}`} />
                            <p className={styles.reviewQuoteText}>
                                Joanna&apos;s trainings are incredible. Her techniques are genius in their simplicity. Her over-the-shoulder tutorials make absorbing the material both easy and fun. Even if you&apos;re not a copywriter, you&apos;ll be able to write with confidence and know it&apos;s damn good.
                            </p>
                            <FaQuoteRight className={`${styles.quoteIconLarge} ${styles.bottomQuote}`} />
                            <div className={styles.authorDetails}>
                                <span className={styles.authorName}>Marie Forleo</span>
                                <span className={styles.authorRole}>Author and Founder of MarieTV</span>
                            </div>
                        </div>
                    </div>

                    {/* Review 3 */}
                    <div className={styles.reviewCard}>
                        <div className={styles.authorCircleLarge}>
                            <Image src="/images/staffs/staff4.jpg" alt="Brian Dean" fill className={styles.authorImg} />
                        </div>
                        <div className={styles.reviewQuoteBox}>
                            <FaQuoteLeft className={`${styles.quoteIconLarge} ${styles.topQuote}`} />
                            <p className={styles.reviewQuoteText}>
                                Because it&apos;s so critical, I cannot impress this upon you enough: learn to write emails from Joanna. Do what she says. You&apos;ll 10x your confidence. And as for business results? The sky&apos;s the limit.
                            </p>
                            <FaQuoteRight className={`${styles.quoteIconLarge} ${styles.bottomQuote}`} />
                            <div className={styles.authorDetails}>
                                <span className={styles.authorName}>Brian Dean</span>
                                <span className={styles.authorRole}>Founder, Backlinko</span>
                            </div>
                        </div>
                    </div>

                    {/* Review 4 */}
                    <div className={styles.reviewCard}>
                        <div className={styles.authorCircleLarge}>
                            <Image src="/images/staffs/staff3.jpg" alt="Tarzan Kay" fill className={styles.authorImg} />
                        </div>
                        <div className={styles.reviewQuoteBox}>
                            <FaQuoteLeft className={`${styles.quoteIconLarge} ${styles.topQuote}`} />
                            <p className={styles.reviewQuoteText}>
                                Just wrapped up my very first campaign for a super competitive affiliate launch. Using the strategies and templates from both 10x Emails and 10x Landing Pages, I was able to hit over $15K in revenue! These programs are making money for me over and over again
                            </p>
                            <FaQuoteRight className={`${styles.quoteIconLarge} ${styles.bottomQuote}`} />
                            <div className={styles.authorDetails}>
                                <span className={styles.authorName}>Tarzan Kay</span>
                                <span className={styles.authorRole}>Copywriter @ Tarzan Kay</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className={styles.testimonialsSection}>
                <div className={styles.testimonialContent}>
                    <div className={styles.badge}>Leadership & Staff</div>
                    <h2 className={styles.mainHeadline}>
                        Trusted by leaders <br />
                        <span className={styles.headlineGray}>Serving with vision and purpose</span>
                    </h2>
                    <p className={styles.subText}>
                        A dedicated team of professionals committed to excellence,
                        <br /> innovation, and delivering outstanding results.
                    </p>

                </div>

                <div className={styles.floatingGrid}>
                    <div className={`${styles.portraitPlaceholder} ${styles.p1}`}>
                        <Image src="/images/staffs/staff1.jpg" alt="Staff 1" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p2}`}>
                        <Image src="/images/staffs/staff2.jpg" alt="Staff 2" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p3}`}>
                        <Image src="/images/staffs/staff3.jpg" alt="Lead Staff" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p4}`}>
                        <Image src="/images/staffs/staff4.jpg" alt="Staff 4" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p5}`}>
                        <Image src="/images/staffs/emili.jpeg" alt="Staff 5" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p6}`}>
                        <Image src="/images/staffs/magda.jpeg" alt="Staff 6" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p7}`}>
                        <Image src="/images/staffs/milli.jpeg" alt="Staff 7" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p8}`}>
                        <Image src="/images/staffs/Alber.jpeg" alt="Staff 8" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p9}`}>
                        <Image src="/images/staffs/staff9.jpg" alt="Staff 9" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p10}`}>
                        <Image src="/images/staffs/staff10.jpg" alt="Staff 10" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p11}`}>
                        <Image src="/images/staffs/staff11.jpg" alt="Staff 11" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p12}`}>
                        <Image src="/images/staffs/staff12.jpg" alt="Staff 12" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p13}`}>
                        <Image src="/images/staffs/staff13.jpg" alt="Staff 13" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p14}`}>
                        <Image src="/images/staffs/staff14.jpg" alt="Staff 14" fill style={{ objectFit: 'cover' }} />
                    </div>
                    <div className={`${styles.portraitPlaceholder} ${styles.p15}`}>
                        <Image src="/images/staffs/staff15.jpg" alt="Staff 15" fill style={{ objectFit: 'cover' }} />
                    </div>
                </div>
            </section>
        </div>
    );
}
