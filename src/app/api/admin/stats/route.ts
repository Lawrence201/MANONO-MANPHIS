import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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

        // 1. Total Halls Count & Occupancy
        const totalHalls = await prisma.hall.count();
        const totalHostels = await prisma.hostel.count(); // Added Hostel Count

        // Count active hall bookings for today (Occupancy Approximation)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const activeHallBookings = await prisma.hallBooking.count({
            where: {
                eventDate: {
                    gte: today,
                    lt: tomorrow
                },
                paymentStatus: { equals: 'paid', mode: 'insensitive' }
            }
        });

        // Occupancy Rate = (Active Bookings Today / Total Halls) * 100
        // Cap at 100% just in case (though one hall could have multiple events, but occupancy implies utilization)
        const occupancyRate = totalHalls > 0 ? Math.min(Math.round((activeHallBookings / totalHalls) * 100), 100) : 0;


        // 2. Hostel Revenue (Total paid hostel bookings)
        const hostelRevenueAgg = await prisma.hostelBooking.aggregate({
            _sum: {
                totalAmount: true
            },
            where: {
                paymentStatus: { equals: 'paid', mode: 'insensitive' }
            }
        });
        const hostelRevenue = hostelRevenueAgg._sum.totalAmount || 0;


        // 3. Total Packages (Corrected per request)
        const totalPackages = await prisma.package.count();

        // 3b. Special Packages Count (packages with packageType 'special')
        const specialPackagesCount = await prisma.package.count({
            where: {
                packageType: 'special'
            }
        });


        // 4. Special Packages (Interpretation: Total Revenue across all systems?)
        // User snippet: "GHc 45,230". This matches a revenue figure.
        // Let's sum Hall Revenue + Hostel Revenue.
        const hallRevenueAgg = await prisma.hallBooking.aggregate({
            _sum: {
                totalAmount: true
            },
            where: {
                paymentStatus: { equals: 'paid', mode: 'insensitive' }
            }
        });
        const hallRevenue = hallRevenueAgg._sum.totalAmount || 0;
        const totalRevenue = Number(hallRevenue) + Number(hostelRevenue);

        // Or if "Special Packages" means "Packages" model count/revenue.
        // Given "Special Packages", let's assume it refers to the "Packages" model revenue/bookings? 
        // But we don't have Booking -> Package relation.
        // So I will stick to "Total Revenue" mapped to this card title for now, or clarify. 
        // User snippet subtext: "Available for booking".
        // Actually, maybe User wants "Total Potential Value"?
        // Let's Stick to Total Revenue for "Special Packages" value, but maybe rename title? 
        // User provided specific Titles. 
        // I will return the raw data, and the Component maps it.

        return NextResponse.json({
            occupancyRate,
            activeHallBookings,
            totalHalls,
            totalHostels, // Added
            hostelRevenue: Number(hostelRevenue),
            totalPackages, // Changed from totalEventBookings
            specialPackagesCount, // Count of special packages
            totalRevenue // Map this to Special Packages value
        });

    } catch (error) {
        console.error('Stats Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
