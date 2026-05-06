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
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Consider admin "online" if lastActiveAt is within last 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

        // Fetch all admins with their activity status
        const admins = await prisma.admin.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                lastLoginAt: true,
                lastActiveAt: true
            },
            orderBy: {
                lastActiveAt: 'desc'
            }
        });

        // Map to include online status
        const adminsWithStatus = admins.map(admin => ({
            ...admin,
            isOnline: admin.lastActiveAt && admin.lastActiveAt > fiveMinutesAgo
        }));

        // Sort: online first, then by lastActiveAt
        adminsWithStatus.sort((a, b) => {
            if (a.isOnline && !b.isOnline) return -1;
            if (!a.isOnline && b.isOnline) return 1;
            const aTime = a.lastActiveAt?.getTime() || 0;
            const bTime = b.lastActiveAt?.getTime() || 0;
            return bTime - aTime;
        });

        return NextResponse.json(adminsWithStatus.slice(0, 5));
    } catch (error) {
        console.error('Error fetching recent admin logins:', error);
        return NextResponse.json(
            { error: 'Failed to fetch recent logins' },
            { status: 500 }
        );
    }
}
