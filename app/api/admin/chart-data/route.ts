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

        // Get the current date and 12 months ago
        const now = new Date();
        const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

        // Fetch all bookings from the last 12 months
        const [hallBookings, hostelBookings, packageBookings] = await Promise.all([
            prisma.hallBooking.findMany({
                where: {
                    createdAt: { gte: twelveMonthsAgo }
                },
                select: {
                    createdAt: true,
                    paymentStatus: true
                }
            }),
            prisma.hostelBooking.findMany({
                where: {
                    createdAt: { gte: twelveMonthsAgo }
                },
                select: {
                    createdAt: true,
                    paymentStatus: true
                }
            }),
            prisma.packageBooking.findMany({
                where: {
                    createdAt: { gte: twelveMonthsAgo }
                },
                select: {
                    createdAt: true,
                    paymentStatus: true
                }
            })
        ]);

        // Combine all bookings
        const allBookings = [
            ...hallBookings.map(b => ({ ...b, type: 'hall' })),
            ...hostelBookings.map(b => ({ ...b, type: 'hostel' })),
            ...packageBookings.map(b => ({ ...b, type: 'package' }))
        ];

        // Generate monthly data for the last 12 months
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const bookingTrends = [];

        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
            const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

            const monthBookings = allBookings.filter(b => {
                const bookingDate = new Date(b.createdAt);
                return bookingDate >= monthStart && bookingDate <= monthEnd;
            });

            const paidMonthBookings = monthBookings.filter(b => b.paymentStatus?.toLowerCase() === 'paid');

            const totalBookings = paidMonthBookings.length;
            const confirmedBookings = paidMonthBookings.length; // They are the same now

            // Separate counts by facility type
            const hallsInMonth = paidMonthBookings.filter(b => b.type === 'hall').length;
            const hostelsInMonth = paidMonthBookings.filter(b => b.type === 'hostel').length;
            const packagesInMonth = paidMonthBookings.filter(b => b.type === 'package').length;

            bookingTrends.push({
                name: monthNames[date.getMonth()],
                total: totalBookings,
                confirmed: confirmedBookings,
                halls: hallsInMonth,
                hostels: hostelsInMonth,
                packages: packagesInMonth
            });
        }

        // Filter for ONLY confirmed (paid) bookings for summary and distribution
        const confirmedOnlyBookings = allBookings.filter(b => b.paymentStatus?.toLowerCase() === 'paid');

        // Calculate facility distribution (using confirmed only)
        const totalAll = confirmedOnlyBookings.length;
        const hallCount = confirmedOnlyBookings.filter(b => b.type === 'hall').length;
        const hostelCount = confirmedOnlyBookings.filter(b => b.type === 'hostel').length;
        const packageCount = confirmedOnlyBookings.filter(b => b.type === 'package').length;

        // Calculate percentages (avoid division by zero)
        const facilityDistribution = totalAll > 0 ? [
            { name: 'Halls', value: Math.round((hallCount / totalAll) * 100), color: '#0EA5E9' },      // Sky Blue
            { name: 'Hostels', value: Math.round((hostelCount / totalAll) * 100), color: '#A855F7' }, // Purple
            { name: 'Packages', value: Math.round((packageCount / totalAll) * 100), color: '#D97706' } // Amber
        ] : [
            { name: 'Halls', value: 34, color: '#0EA5E9' },
            { name: 'Hostels', value: 33, color: '#A855F7' },
            { name: 'Packages', value: 33, color: '#D97706' }
        ];

        // Ensure percentages add up to 100
        if (totalAll > 0) {
            const sum = facilityDistribution.reduce((acc, curr) => acc + curr.value, 0);
            if (sum !== 100 && facilityDistribution.length > 0) {
                facilityDistribution[0].value += (100 - sum);
            }
        }

        return NextResponse.json({
            bookingTrends,
            facilityDistribution,
            summary: {
                totalBookings: totalAll,
                hallBookings: hallCount,
                hostelBookings: hostelCount,
                packageBookings: packageCount
            }
        });

    } catch (error) {
        console.error('Chart Data Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chart data' },
            { status: 500 }
        );
    }
}
