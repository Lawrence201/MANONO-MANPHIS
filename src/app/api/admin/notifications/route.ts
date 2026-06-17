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

        return NextResponse.json({
            pending: [],
            paid: []
        });

    } catch (error) {
        console.error('Notifications Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}
