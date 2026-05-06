import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all unique clients from all booking types
export async function GET() {
    try {
        // Fetch from hall bookings
        const hallBookings = await prisma.hallBooking.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                paymentStatus: true,
                createdAt: true
            },
            distinct: ['email']
        });

        // Fetch from hostel bookings
        const hostelBookings = await prisma.hostelBooking.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                paymentStatus: true,
                createdAt: true
            },
            distinct: ['email']
        });

        // Fetch from package bookings
        const packageBookings = await prisma.packageBooking.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                paymentStatus: true,
                createdAt: true
            },
            distinct: ['email']
        });

        // Create email sets for source detection
        const hallEmails = new Set(hallBookings.map(b => b.email));
        const hostelEmails = new Set(hostelBookings.map(b => b.email));
        const packageEmails = new Set(packageBookings.map(b => b.email));

        // Combine and deduplicate by email
        const allClients = new Map();

        [...hallBookings, ...hostelBookings, ...packageBookings].forEach(booking => {
            if (booking.email && !allClients.has(booking.email)) {
                // Determine source based on which booking type this email belongs to
                let source = 'Package'; // Default
                if (hallEmails.has(booking.email)) {
                    source = 'Hall';
                } else if (hostelEmails.has(booking.email)) {
                    source = 'Hostel';
                }

                allClients.set(booking.email, {
                    id: booking.id,
                    name: `${booking.firstName} ${booking.lastName}`,
                    email: booking.email,
                    phone: booking.phone || '',
                    source,
                    lastBooking: booking.createdAt
                });
            }
        });

        const clients = Array.from(allClients.values()).sort((a, b) =>
            new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime()
        );

        return NextResponse.json({
            clients,
            total: clients.length
        });
    } catch (error) {
        console.error('Fetch clients error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}
