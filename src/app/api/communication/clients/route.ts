import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const dbClients = await prisma.client.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        const clients = dbClients.map(c => ({
            id: c.id,
            name: c.name || 'Unknown',
            email: c.email,
            phone: c.phoneNumber || '',
            source: 'Manono',
            lastBooking: c.createdAt
        }));

        return NextResponse.json({
            clients,
            total: clients.length
        });
    } catch (error) {
        console.error('Fetch clients error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}
