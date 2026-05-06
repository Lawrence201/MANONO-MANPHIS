import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET single event
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) }
        });

        if (!event) {
            return NextResponse.json(
                { error: 'Event not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(event);
    } catch (error) {
        console.error('Fetch event error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch event' },
            { status: 500 }
        );
    }
}

// PATCH update event (Admin only)
export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin session
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await request.json();
        const eventId = parseInt(id);

        const updateData: any = {};

        if (body.name !== undefined) updateData.name = body.name;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.eventType !== undefined) updateData.eventType = body.eventType;
        if (body.status !== undefined) updateData.status = body.status;
        if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
        if (body.endDate !== undefined) updateData.endDate = new Date(body.endDate);
        if (body.venue !== undefined) updateData.venue = body.venue;
        if (body.capacity !== undefined) updateData.capacity = body.capacity ? parseInt(body.capacity) : null;
        if (body.registrations !== undefined) updateData.registrations = body.registrations;
        if (body.price !== undefined) updateData.price = body.price ? parseFloat(body.price) : null;
        if (body.mainImagePath !== undefined) updateData.mainImagePath = body.mainImagePath;
        if (body.organizer !== undefined) updateData.organizer = body.organizer;
        if (body.contactEmail !== undefined) updateData.contactEmail = body.contactEmail;
        if (body.contactPhone !== undefined) updateData.contactPhone = body.contactPhone;
        if (body.isPublic !== undefined) updateData.isPublic = body.isPublic;

        const event = await prisma.event.update({
            where: { id: eventId },
            data: updateData
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error('Update event error:', error);
        return NextResponse.json(
            { error: 'Failed to update event' },
            { status: 500 }
        );
    }
}

// DELETE event (Admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Verify admin session
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { id } = await params;
        const eventId = parseInt(id);

        await prisma.event.delete({
            where: { id: eventId }
        });

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Delete event error:', error);
        return NextResponse.json(
            { error: 'Failed to delete event' },
            { status: 500 }
        );
    }
}
