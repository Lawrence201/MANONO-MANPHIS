import { Poppins, Playfair_Display } from "next/font/google";
import TopBar from "@/components/website/TopBar";
import NavBar from "@/components/website/NavBar";
import Footer from "@/components/website/Footer";
import ChatbotWidget from "@/components/website/ChatbotWidget";
import SeoSchema from "@/components/website/SeoSchema";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-poppins",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    display: "swap",
    variable: "--font-playfair",
});

export const metadata = {
    title: "Camp Elim Africa | Top Event Center, Retreat & Accommodation Venue in Ghana",
    description: "Discover Camp Elim Africa - Ghana's premier destination for Conferences, Weddings, Retreats, & Accommodation. Rated top event center for executive and social gatherings.",
    keywords: [
        "Event Center Ghana",
        "Conference Venue Accra",
        "Wedding Venue Ghana",
        "Christian Retreat Center",
        "Camp Elim Africa",
        "Lodge Accommodation Accra",
        "Executive Meeting Halls",
        "Church Camp Venue",
        "Seminar Halls Ghana",
        "Affordable Event Space Accra",
        "Group Accommodation Ghana",
        "Best Retreat Center Africa"
    ],
    openGraph: {
        title: "Camp Elim Africa | Premier Event & Retreat Center",
        description: "Versatile spaces for Conferences, Weddings, and Retreats with comfortable accommodation in Accra, Ghana.",
        url: "https://campelimafrica.com",
        siteName: "Camp Elim Africa",
        images: [
            {
                url: "/hero_1.avif",
                width: 1200,
                height: 630,
                alt: "Camp Elim Africa Event Center",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    authors: [{ name: "Camp Elim Africa" }],
    category: "event venue",
};

export default function WebsiteLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`${poppins.variable} ${playfair.variable} ${poppins.className}`}>
            <SeoSchema />
            <TopBar />
            <NavBar />
            {children}
            <Footer />
            <ChatbotWidget />
        </div>
    );
}
