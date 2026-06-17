import { NextResponse } from 'next/server';
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

        return NextResponse.json({
            occupancyRate: 0,
            activeHallBookings: 0,
            totalHalls: 0,
            totalHostels: 0,
            hostelRevenue: 0,
            totalPackages: 0,
            specialPackagesCount: 0,
            totalRevenue: 0
        });

    } catch (error) {
        console.error('Stats Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
