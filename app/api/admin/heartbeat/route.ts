import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST - Update admin's lastActiveAt (heartbeat)
export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const email = session.user?.email;
        if (!email) {
            return NextResponse.json({ error: 'No email in session' }, { status: 400 });
        }

        // Update lastActiveAt timestamp
        await prisma.admin.update({
            where: { email },
            data: { lastActiveAt: new Date() }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating admin activity:', error);
        return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 });
    }
}
