import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/admin/Sidebar";
import "./admin-globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Camp Elim Admin",
    description: "Camp Elim Management System Dashboard",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || (session.user as any).role !== 'admin') {
        redirect('/login');
    }

    return (
        <div
            className={`${geistSans.variable} ${geistMono.variable}`}
            style={{ backgroundColor: '#F3F4F6', minHeight: '100vh' }}
        >
            {/* Sidebar stays fixed */}
            <Sidebar />

            {/* Page content */}
            <main style={{ marginLeft: "260px", minHeight: "100vh" }}>
                {children}
            </main>
        </div>
    );
}
