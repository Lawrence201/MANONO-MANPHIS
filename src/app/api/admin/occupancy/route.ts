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
            items: [],
            counts: {
                available: 0,
                occupied: 0,
                cleaning: 0,
                maintenance: 0
            }
        });

    } catch (error) {
        console.error('Occupancy Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch occupancy', details: String(error) },
            { status: 500 }
        );
    }
}
