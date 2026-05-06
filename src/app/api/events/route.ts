import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET all events
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const eventType = searchParams.get('type');

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }
        if (eventType && eventType !== 'all') {
            where.eventType = eventType;
        }

        const events = await prisma.event.findMany({
            where,
            orderBy: { startDate: 'desc' }
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error('Fetch events error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch events' },
            { status: 500 }
        );
    }
}

// POST create new event (Admin only)
export async function POST(request: Request) {
    try {
        // Verify admin session
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const body = await request.json();

        const event = await prisma.event.create({
            data: {
                name: body.name,
                description: body.description || null,
                eventType: body.eventType,
                status: body.status || 'upcoming',
                startDate: new Date(body.startDate),
                endDate: new Date(body.endDate),
                venue: body.venue || null,
                capacity: body.capacity ? parseInt(body.capacity) : null,
                registrations: body.registrations || 0,
                price: body.price ? parseFloat(body.price) : null,
                mainImagePath: body.mainImagePath || null,
                organizer: body.organizer || null,
                contactEmail: body.contactEmail || null,
                contactPhone: body.contactPhone || null,
                isPublic: body.isPublic ?? true
            }
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error('Create event error:', error);
        return NextResponse.json(
            { error: 'Failed to create event' },
            { status: 500 }
        );
    }
}
