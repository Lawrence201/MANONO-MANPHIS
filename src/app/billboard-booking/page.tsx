import BillboardBookingPage from "./BillboardBookingClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Billboard Booking | Monophis',
    description: 'Book a billboard advertising slot.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    return <BillboardBookingPage />;
}
