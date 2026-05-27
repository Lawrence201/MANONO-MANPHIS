import BillboardBookingPage from "./BillboardBookingClient";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
    title: 'Billboard Booking | Monophis',
    description: 'Book a billboard advertising slot.',
};

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | undefined }> }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    let userProfile = {
        name: session.user?.name || '',
        email: session.user?.email || '',
        phoneNumber: '',
    };

    if (session.user?.email) {
        const client = await prisma.client.findUnique({
            where: { email: session.user.email },
            select: { phoneNumber: true }
        });
        if (client?.phoneNumber) {
            userProfile.phoneNumber = client.phoneNumber;
        }
    }

    return <BillboardBookingPage userProfile={userProfile} />;
}
