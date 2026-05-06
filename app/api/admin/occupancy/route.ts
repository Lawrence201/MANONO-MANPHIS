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
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);


        // 1. Fetch Halls with their booked hall entries
        const halls = await prisma.hall.findMany({
            include: {
                bookedHalls: {
                    where: {
                        booking: {
                            eventDate: {
                                gte: today
                            },
                            paymentStatus: { equals: 'paid', mode: 'insensitive' }


                        }
                    },
                    include: {
                        booking: true
                    },
                    orderBy: {
                        booking: {
                            eventDate: 'asc'
                        }
                    },
                    take: 1
                }
            }
        });

        // 2. Fetch Hostels with "active" bookings
        const hostels = await prisma.hostel.findMany({
            include: {
                bookings: {
                    where: {
                        checkInDate: {
                            gte: today
                        },
                        paymentStatus: { equals: 'paid', mode: 'insensitive' }

                    },
                    orderBy: {
                        checkInDate: 'asc'
                    }
                }
            }
        });

        // 3. Fetch Packages with their bookings
        const packages = await prisma.$queryRaw<any[]>`
            SELECT p.id, p.name, p.capacity, p.main_image_path, p.package_type,
                   pb.id as booking_id, pb.first_name, pb.last_name, pb.organization,
                   pb.event_date, pb.event_type, pb.created_at
            FROM packages p
            LEFT JOIN package_bookings pb ON pb.package_id = p.id AND pb.event_date >= ${today} AND LOWER(pb.payment_status) = 'paid'
            ORDER BY p.id, pb.event_date ASC
        `;

        // Group packages by id (since LEFT JOIN can return multiple rows)
        const packageMap = new Map();
        for (const row of packages) {
            if (!packageMap.has(row.id)) {
                packageMap.set(row.id, {
                    id: row.id,
                    name: row.name,
                    capacity: row.capacity,
                    image: row.main_image_path,
                    packageType: row.package_type || 'event', // Default to 'event' if not set
                    bookings: []
                });
            }
            if (row.booking_id) {
                packageMap.get(row.id).bookings.push({
                    id: row.booking_id,
                    firstName: row.first_name,
                    lastName: row.last_name,
                    organization: row.organization,
                    eventDate: row.event_date,
                    eventType: row.event_type,
                    createdAt: row.created_at
                });
            }
        }

        // Transform to Unified Structure
        const items = [];

        // Halls - now using bookedHalls junction
        for (const hall of halls) {
            const bookedHalls = hall.bookedHalls;
            const hasBooking = bookedHalls.length > 0;
            const activeBookedHall = hasBooking ? bookedHalls[0] : null;
            const activeBooking = activeBookedHall?.booking || null;


            // Check if specifically TODAY
            let isToday = false;
            let bookingDateStr = '';

            if (activeBooking && activeBooking.eventDate) {
                const bDate = new Date(activeBooking.eventDate);
                bookingDateStr = bDate.toLocaleDateString();
                const bCheck = new Date(bDate);
                bCheck.setUTCHours(0, 0, 0, 0);
                if (bCheck.getTime() === today.getTime()) {
                    isToday = true;
                }
            }


            items.push({
                id: `hall-${hall.id}`,
                name: hall.name,
                type: 'Hall',
                capacity: hall.capacity,
                status: isToday ? 'Occupied' : (hasBooking ? 'Booked' : 'Available'),
                details: hasBooking && activeBooking ? (activeBooking.eventType || 'Event') : 'Ready',
                bookedBy: hasBooking && activeBooking ? (activeBooking.organization || `${activeBooking.firstName} ${activeBooking.lastName}`) : null,
                date: hasBooking ? bookingDateStr : null,
                image: hall.mainImagePath,
                bookedAt: activeBooking?.createdAt ? new Date(activeBooking.createdAt).toISOString() : null,
                duration: activeBooking?.duration ? `${activeBooking.duration} hours` : null
            });
        }

        // Hostels
        for (const hostel of hostels) {
            const bookings = hostel.bookings;
            const hasBooking = bookings.length > 0;
            const activeBooking = hasBooking ? bookings[0] : null;

            let isToday = false;
            let bookingDateStr = '';

            // Calculate Availability for "Live" purposes (Today's check-ins vs Total Rooms)
            let occupiedCount = 0;
            for (const b of bookings) {
                const bDate = new Date(b.checkInDate);
                const bCheck = new Date(bDate);
                bCheck.setUTCHours(0, 0, 0, 0);

                if (bCheck.getTime() === today.getTime()) {
                    occupiedCount++;
                }
            }

            const totalRooms = hostel.roomQuantity || 0;
            const availableRooms = Math.max(0, totalRooms - occupiedCount);

            if (activeBooking && activeBooking.checkInDate) {
                const bDate = new Date(activeBooking.checkInDate);
                bookingDateStr = bDate.toLocaleDateString();
                const bCheck = new Date(bDate);
                bCheck.setUTCHours(0, 0, 0, 0);

                if (bCheck.getTime() === today.getTime()) {
                    isToday = true;
                }
            }

            items.push({
                id: `hostel-${hostel.id}`,
                name: hostel.name,
                type: 'Hostel',
                capacity: hostel.capacity,
                availableRooms: availableRooms, // New field for UI
                status: isToday ? 'Occupied' : (hasBooking ? 'Booked' : 'Available'),
                details: hasBooking ? 'Booked' : 'Vacant',
                bookedBy: hasBooking && activeBooking ? `${activeBooking.firstName} ${activeBooking.lastName}` : null,
                date: hasBooking ? bookingDateStr : null,
                image: hostel.mainImagePath,
                // Enhanced fields for sorting and display
                bookedAt: activeBooking?.createdAt ? new Date(activeBooking.createdAt).toISOString() : null,
                endDate: activeBooking?.checkInDate && activeBooking.numberOfDays
                    ? new Date(new Date(activeBooking.checkInDate).getTime() + (activeBooking.numberOfDays * 24 * 60 * 60 * 1000)).toLocaleDateString()
                    : null,
                duration: activeBooking?.numberOfDays ? `${activeBooking.numberOfDays} Days` : null
            });
        }

        // Packages - now with actual booking status
        for (const [, pkg] of packageMap) {
            const hasBooking = pkg.bookings.length > 0;
            const activeBooking = hasBooking ? pkg.bookings[0] : null;

            let isToday = false;
            let bookingDateStr = '';

            if (activeBooking && activeBooking.eventDate) {
                const bDate = new Date(activeBooking.eventDate);
                bookingDateStr = bDate.toLocaleDateString();
                const bCheck = new Date(bDate);
                bCheck.setUTCHours(0, 0, 0, 0);

                if (bCheck.getTime() === today.getTime()) {
                    isToday = true;
                }
            }

            items.push({
                id: `pkg-${pkg.id}`,
                name: pkg.name,
                type: 'Package',
                packageType: pkg.packageType, // 'event', 'special', or 'group_retreat'
                capacity: pkg.capacity,
                status: isToday ? 'Occupied' : (hasBooking ? 'Booked' : 'Available'),
                details: hasBooking && activeBooking ? (activeBooking.eventType || 'Event Package') : 'Open',
                bookedBy: hasBooking && activeBooking ? (activeBooking.organization || `${activeBooking.firstName} ${activeBooking.lastName}`) : null,
                date: hasBooking ? bookingDateStr : null,
                image: pkg.image,
                bookedAt: activeBooking?.createdAt ? new Date(activeBooking.createdAt).toISOString() : null
            });
        }

        // Summary Counts: Sum of ALL paid bookings (Today's check-ins + Future)
        const counts = {
            available: items.filter(i => i.status === 'Available').length,
            occupied: items.filter(i => i.status === 'Occupied' || i.status === 'Booked').length,
            cleaning: 0,
            maintenance: 0
        };

        return NextResponse.json({ items, counts });

    } catch (error) {
        console.error('Occupancy Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch occupancy', details: String(error) },
            { status: 500 }
        );
    }
}
