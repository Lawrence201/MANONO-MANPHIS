import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HallBookingPage from "./HallBookingClient";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Hall Booking | Camp Elim Africa',
    description: 'Book a hall for your event.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const session = await getServerSession(authOptions);
    const params = await searchParams;

    if (!session) {
        // Build callback URL with query params
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        const callbackUrl = `/hall-booking${queryString ? `?${queryString}` : ''}`;
        redirect(`/login?mode=login&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    return <HallBookingPage />;
}

