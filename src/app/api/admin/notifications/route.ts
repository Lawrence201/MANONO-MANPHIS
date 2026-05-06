import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Verify admin session
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        // 1. Fetch recent PENDING bookings from all 3 tables
        const [pendingHalls, pendingHostels, pendingPackages] = await Promise.all([
            prisma.hallBooking.findMany({
                where: { paymentStatus: { equals: 'pending', mode: 'insensitive' } },
                orderBy: { createdAt: 'desc' },
                take: 6,
                select: {
                    id: true,
                    reference: true,
                    firstName: true,
                    lastName: true,
                    organization: true,
                    paymentStatus: true,
                    createdAt: true,
                    totalAmount: true,
                    eventType: true
                }
            }),
            prisma.hostelBooking.findMany({
                where: { paymentStatus: { equals: 'pending', mode: 'insensitive' } },
                orderBy: { createdAt: 'desc' },
                take: 6,
                select: {
                    id: true,
                    reference: true,
                    firstName: true,
                    lastName: true,
                    paymentStatus: true,
                    createdAt: true,
                    totalAmount: true
                }
            }),
            prisma.packageBooking.findMany({
                where: { paymentStatus: { equals: 'pending', mode: 'insensitive' } },
                orderBy: { createdAt: 'desc' },
                take: 6,
                select: {
                    id: true,
                    reference: true,
                    firstName: true,
                    lastName: true,
                    organization: true,
                    paymentStatus: true,
                    createdAt: true,
                    totalAmount: true,
                    eventType: true
                }
            })
        ]);

        // 2. Fetch recent PAID bookings from all 3 tables
        const [paidHalls, paidHostels, paidPackages] = await Promise.all([
            prisma.hallBooking.findMany({
                where: { paymentStatus: { equals: 'paid', mode: 'insensitive' } },
                orderBy: { createdAt: 'desc' },
                take: 6,
                select: {
                    id: true,
                    reference: true,
                    firstName: true,
                    lastName: true,
                    organization: true,
                    paymentStatus: true,
                    createdAt: true,
                    totalAmount: true,
                    eventType: true
                }
            }),
            prisma.hostelBooking.findMany({
                where: { paymentStatus: { equals: 'paid', mode: 'insensitive' } },
                orderBy: { createdAt: 'desc' },
                take: 6,
                select: {
                    id: true,
                    reference: true,
                    firstName: true,
                    lastName: true,
                    paymentStatus: true,
                    createdAt: true,
                    totalAmount: true
                }
            }),
            prisma.packageBooking.findMany({
                where: { paymentStatus: { equals: 'paid', mode: 'insensitive' } },
                orderBy: { createdAt: 'desc' },
                take: 6,
                select: {
                    id: true,
                    reference: true,
                    firstName: true,
                    lastName: true,
                    organization: true,
                    paymentStatus: true,
                    createdAt: true,
                    totalAmount: true,
                    eventType: true
                }
            })
        ]);

        // 3. Transform and labels
        const transform = (b: any, type: string) => ({
            id: `${type}-${b.id}`,
            reference: b.reference,
            name: b.organization || `${b.firstName} ${b.lastName}`,
            type: b.paymentStatus?.toLowerCase() === 'paid' ? 'paid' : 'pending',
            category: type, // Hall, Hostel, Package
            amount: b.totalAmount,
            description: type === 'Hostel' ? 'Lodge Booking' : (b.eventType || 'Event Booking'),
            createdAt: b.createdAt
        });

        const pendingList = [
            ...pendingHalls.map(b => transform(b, 'Hall')),
            ...pendingHostels.map(b => transform(b, 'Lodge')),
            ...pendingPackages.map(b => transform(b, 'Package'))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

        const paidList = [
            ...paidHalls.map(b => transform(b, 'Hall')),
            ...paidHostels.map(b => transform(b, 'Lodge')),
            ...paidPackages.map(b => transform(b, 'Package'))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

        return NextResponse.json({
            pending: pendingList,
            paid: paidList
        });

    } catch (error) {
        console.error('Notifications Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}
