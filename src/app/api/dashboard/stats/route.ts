import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Calculate Total Revenue from Billboards
        const billboardRevenueAgg = await prisma.billboardBooking.aggregate({
            _sum: {
                totalPrice: true
            },
            where: {
                status: { not: 'cancelled' }
            }
        });
        const billboardRevenue = Number(billboardRevenueAgg._sum.totalPrice || 0);

        // 2. Count Active Billboards (billboards with at least one booking)
        const totalBillboards = await prisma.billboard.count();
        const activeBillboardsGroup = await prisma.billboardBooking.groupBy({
            by: ['billboardId'],
            where: {
                status: { not: 'cancelled' }
            }
        });
        const activeBillboardsCount = activeBillboardsGroup.length;

        // 3. Count Pending Approvals (bookings with status 'pending')
        const pendingApprovalsCount = await prisma.billboardBooking.count({
            where: {
                status: 'pending'
            }
        });

        // 4. Count Total Clients
        const totalClientsCount = await prisma.client.count();

        // 5. Total bookings count
        const totalBookingsCount = await prisma.billboardBooking.count();

        // 6. Calculate monthly billboard revenue trends
        const allBookings = await prisma.billboardBooking.findMany({
            where: {
                status: { not: 'cancelled' }
            },
            select: {
                totalPrice: true,
                createdAt: true
            }
        });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = monthNames.map(month => ({ month, Billboards: 0 }));

        allBookings.forEach(booking => {
            const date = new Date(booking.createdAt);
            const monthIndex = date.getMonth();
            if (monthIndex >= 0 && monthIndex < 12) {
                monthlyData[monthIndex].Billboards += Number(booking.totalPrice || 0);
            }
        });

        // 7. Fetch recent bookings and format them for the dashboard table
        const recentBookings = await prisma.billboardBooking.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,
            include: {
                billboard: true
            }
        });

        const formattedBookings = recentBookings.map(b => {
            const orderId = `BKG-${String(b.id).padStart(4, '0')}`;
            return {
                id: orderId,
                customer: b.fullName,
                company: b.companyName || "Personal Booking",
                country: b.billboard.city || "Ghana",
                product: b.billboard.name,
                quantity: `${b.slotsRequested} Slot${b.slotsRequested > 1 ? 's' : ''}`,
                amount: Number(b.totalPrice),
                currency: "GH₵",
                payment: "paid",
                status: b.status === "confirmed" ? "processing" : "pending",
                progress: b.status === "confirmed" ? 100 : 25
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                totalRevenue: billboardRevenue,
                activeBillboardsCount,
                totalBillboards,
                pendingApprovalsCount,
                totalClientsCount,
                totalBookingsCount,
                monthlyData,
                recentBookings: formattedBookings
            }
        });
    } catch (error: any) {
        console.error('Stats Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
