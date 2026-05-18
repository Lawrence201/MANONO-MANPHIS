import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Fetch latest bookings from each model
        const [billboardBookings, hallBookings, hostelBookings] = await Promise.all([
            prisma.billboardBooking.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { billboard: true }
            }),
            prisma.hallBooking.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.hostelBooking.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        // 2. Map them into consistent Activity items
        const activities = [
            ...billboardBookings.map(b => ({
                id: `bb-${b.id}`,
                type: 'order',
                icon: 'order',
                text: `New Billboard booking "${b.campaignTitle}" confirmed for ${b.fullName} (${b.companyName || 'Individual'}) — GH₵${Number(b.totalPrice).toLocaleString()}`,
                createdAt: b.createdAt.toISOString()
            })),
            ...hallBookings.map(h => ({
                id: `hall-${h.id}`,
                type: 'order',
                icon: 'order',
                text: `New Event Hall booking "${h.eventName || 'Hall Rental'}" by ${h.firstName} ${h.lastName} — GH₵${Number(h.totalAmount).toLocaleString()}`,
                createdAt: h.createdAt.toISOString()
            })),
            ...hostelBookings.map(hostel => ({
                id: `hostel-${hostel.id}`,
                type: 'order',
                icon: 'order',
                text: `New Hostel Accommodation booking by ${hostel.firstName} ${hostel.lastName} — GH₵${Number(hostel.totalAmount).toLocaleString()}`,
                createdAt: hostel.createdAt.toISOString()
            }))
        ];

        // 3. Sort by createdAt descending
        activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ success: true, data: activities.slice(0, 10) });

    } catch (error: any) {
        console.error('Activities Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch platform activities' },
            { status: 500 }
        );
    }
}
