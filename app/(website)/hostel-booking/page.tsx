import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import HostelBookingPage from "./HostelBookingClient";

export const metadata: Metadata = {
    title: 'Lodge Booking | Camp Elim Africa',
    description: 'Book accommodation at Camp Elim Africa.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const session = await getServerSession(authOptions);
    const params = await searchParams;

    if (!session) {
        // Build callback URL with query params
        const queryString = new URLSearchParams(params as Record<string, string>).toString();
        const callbackUrl = `/hostel-booking${queryString ? `?${queryString}` : ''}`;
        redirect(`/login?mode=login&callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    return <HostelBookingPage />;
}

