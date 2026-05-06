import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/hostels/availability
 * 
 * Calculate real-time room availability for a hostel on specific dates.
 * 
 * Query Parameters:
 * - hostelId: ID of the hostel (required)
 * - checkInDate: Check-in date in ISO format (required)
 * - numberOfDays: Number of days for the stay (default: 1)
 * 
 * Returns:
 * - totalRooms: Total rooms in the hostel
 * - bookedRooms: Rooms booked for the date range
 * - availableRooms: Rooms available for booking
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const hostelId = searchParams.get('hostelId');
        const checkInDateStr = searchParams.get('checkInDate');
        const numberOfDays = parseInt(searchParams.get('numberOfDays') || '1') || 1;

        // Validation
        if (!hostelId) {
            return NextResponse.json(
                { error: 'hostelId is required' },
                { status: 400 }
            );
        }

        if (!checkInDateStr) {
            return NextResponse.json(
                { error: 'checkInDate is required' },
                { status: 400 }
            );
        }

        // Parse dates
        const requestedCheckIn = new Date(checkInDateStr);
        requestedCheckIn.setHours(0, 0, 0, 0);

        // Calculate checkout date (checkIn + numberOfDays)
        const requestedCheckOut = new Date(requestedCheckIn);
        requestedCheckOut.setDate(requestedCheckOut.getDate() + numberOfDays);

        // Fetch hostel to get total rooms
        const hostel = await prisma.hostel.findUnique({
            where: { id: Number(hostelId) },
            select: {
                id: true,
                name: true,
                roomQuantity: true
            }
        });

        if (!hostel) {
            return NextResponse.json(
                { error: 'Hostel not found' },
                { status: 404 }
            );
        }

        const totalRooms = hostel.roomQuantity || 0;

        // Find overlapping bookings
        // A booking overlaps if:
        // - Its check-in is before our checkout AND
        // - Its checkout (checkIn + numberOfDays) is after our check-in
        // 
        // We need to get all bookings and calculate the overlap manually
        // since numberOfDays is now stored in the database
        const allBookings = await prisma.hostelBooking.findMany({
            where: {
                hostelId: Number(hostelId),
                paymentStatus: { not: 'cancelled' }
            },
            select: {
                id: true,
                checkInDate: true,
                numberOfDays: true,
                numberOfRooms: true,
                duration: true
            }
        });

        // Calculate overlapping rooms
        let bookedRooms = 0;

        for (const booking of allBookings) {
            const bookingCheckIn = new Date(booking.checkInDate);
            bookingCheckIn.setHours(0, 0, 0, 0);

            // Get numberOfDays from database field, or parse from duration string as fallback
            let bookingDays = booking.numberOfDays || 1;
            if (!booking.numberOfDays && booking.duration) {
                // Fallback: parse from duration string like "3 Days"
                const match = booking.duration.match(/(\d+)/);
                if (match) {
                    bookingDays = parseInt(match[1]) || 1;
                }
            }

            const bookingCheckOut = new Date(bookingCheckIn);
            bookingCheckOut.setDate(bookingCheckOut.getDate() + bookingDays);

            // Check for overlap:
            // Booking overlaps if: bookingCheckIn < requestedCheckOut AND bookingCheckOut > requestedCheckIn
            const overlaps = bookingCheckIn < requestedCheckOut && bookingCheckOut > requestedCheckIn;

            if (overlaps) {
                bookedRooms += booking.numberOfRooms;
            }
        }

        const availableRooms = Math.max(0, totalRooms - bookedRooms);

        return NextResponse.json({
            hostelId: hostel.id,
            hostelName: hostel.name,
            totalRooms,
            bookedRooms,
            availableRooms,
            dateRange: {
                checkIn: requestedCheckIn.toISOString().split('T')[0],
                checkOut: requestedCheckOut.toISOString().split('T')[0],
                numberOfDays
            }
        });

    } catch (error) {
        console.error('Error calculating hostel availability:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
