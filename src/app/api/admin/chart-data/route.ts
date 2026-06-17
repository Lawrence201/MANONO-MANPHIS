import { NextResponse } from 'next/server';
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

        // Return empty mock data for the dashboard until new models are integrated
        const bookingTrends = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const now = new Date();
        
        for (let i = 11; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            bookingTrends.push({
                name: monthNames[date.getMonth()],
                total: 0,
                confirmed: 0,
                halls: 0,
                hostels: 0,
                packages: 0
            });
        }

        const facilityDistribution = [
            { name: 'Products', value: 34, color: '#0EA5E9' },
            { name: 'Billboards', value: 33, color: '#A855F7' },
            { name: 'Services', value: 33, color: '#D97706' }
        ];

        return NextResponse.json({
            bookingTrends,
            facilityDistribution,
            summary: {
                totalBookings: 0,
                hallBookings: 0,
                hostelBookings: 0,
                packageBookings: 0
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
