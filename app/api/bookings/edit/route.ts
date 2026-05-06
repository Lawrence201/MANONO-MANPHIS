import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * PUT /api/bookings/edit
 * Comprehensive edit booking endpoint for admin use.
 * Allows changing hall, date, time, duration, add-ons.
 * Enforces: new total >= original total (no refunds)
 */
export async function PUT(request: Request) {
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
        const {
            bookingId,
            hallIds,          // Array of new hall IDs
            eventType,
            eventName,
            eventDate,
            startTime,
            duration,
            addOns,           // Array of add-on IDs
            staffMember,
            organization,
            message
        } = body;

        if (!bookingId) {
            return NextResponse.json(
                { message: 'Booking ID is required' },
                { status: 400 }
            );
        }

        // Fetch the original booking
        const originalBooking = await prisma.hallBooking.findUnique({
            where: { id: Number(bookingId) },
            include: {
                bookedHalls: {
                    include: {
                        hall: true,
                        addOns: true
                    }
                }
            }
        });

        if (!originalBooking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        const originalTotal = Number(originalBooking.totalAmount);

        // Validation: at least one hall required
        if (!hallIds || !Array.isArray(hallIds) || hallIds.length === 0) {
            return NextResponse.json(
                { message: 'At least one hall must be selected' },
                { status: 400 }
            );
        }

        const validHallIds = hallIds.map((id: string | number) => Number(id));

        // Fetch all selected halls with their add-ons
        const halls = await prisma.hall.findMany({
            where: { id: { in: validHallIds } },
            include: { addOns: true }
        });

        if (halls.length !== validHallIds.length) {
            return NextResponse.json(
                { message: 'One or more selected halls not found' },
                { status: 400 }
            );
        }

        // Check time slot availability (exclude current booking and cancelled bookings)
        const requestedDate = new Date(eventDate);
        const conflictingBookings = await prisma.hallBooking.findMany({
            where: {
                id: { not: Number(bookingId) }, // Exclude current booking
                eventDate: requestedDate,
                bookedHalls: {
                    some: { hallId: { in: validHallIds } }
                },
                // Exclude cancelled bookings - they don't block time slots
                paymentStatus: { not: 'cancelled' }
            },
            select: {
                id: true,
                startTime: true,
                duration: true,
                bookedHalls: {
                    select: { hallId: true }
                }
            }
        });

        // Helper: convert time string to minutes from midnight
        const timeToMinutes = (timeStr: string): number => {
            const [time, period] = timeStr.split(' ');
            let [hours, minutes] = time.split(':').map(Number);
            if (period?.toLowerCase() === 'pm' && hours !== 12) hours += 12;
            if (period?.toLowerCase() === 'am' && hours === 12) hours = 0;
            return hours * 60 + (minutes || 0);
        };

        const requestedStartMins = timeToMinutes(startTime);
        const requestedDuration = parseFloat(duration) || 4;
        const requestedEndMins = requestedStartMins + (requestedDuration * 60) + 60; // +1hr prep

        for (const conflict of conflictingBookings) {
            const conflictStart = timeToMinutes(conflict.startTime);
            const conflictDuration = parseFloat(conflict.duration) || 4;
            const conflictEnd = conflictStart + (conflictDuration * 60) + 60;

            // Check for overlap
            if (requestedStartMins < conflictEnd && requestedEndMins > conflictStart) {
                return NextResponse.json({
                    message: 'Selected time slot conflicts with another booking',
                    conflict: {
                        bookingId: conflict.id,
                        startTime: conflict.startTime,
                        duration: conflict.duration
                    }
                }, { status: 409 });
            }
        }

        // Calculate new totals
        let newGrandTotal = 0;
        const newBookedHallsData = halls.map(hall => {
            const basePrice = parseFloat(hall.price.replace(/[^\d.]/g, '')) || 0;
            const baseDuration = parseInt(hall.duration) || 4;
            const reqDuration = parseFloat(duration) || baseDuration;

            // Hourly rate and duration-adjusted price
            const hourlyRate = basePrice / baseDuration;
            const durationAdjustedPrice = Math.round(hourlyRate * reqDuration);

            // Filter add-ons for this hall
            const hallAddOnsData: { name: string; price: number; unit: string | null }[] = [];
            let addOnsTotal = 0;

            if (Array.isArray(addOns) && addOns.length > 0) {
                for (const addOnId of addOns) {
                    const hallAddOn = hall.addOns.find(a => a.id === Number(addOnId));
                    if (hallAddOn) {
                        const price = parseFloat(hallAddOn.price.replace(/[^\d.]/g, '')) || 0;
                        addOnsTotal += price;
                        hallAddOnsData.push({
                            name: hallAddOn.name,
                            price: price,
                            unit: hallAddOn.unit
                        });
                    }
                }
            }

            const hallAmount = durationAdjustedPrice + addOnsTotal;
            newGrandTotal += hallAmount;

            return {
                hallId: hall.id,
                amount: hallAmount,
                addOns: {
                    create: hallAddOnsData
                }
            };
        });

        // CRITICAL: Enforce no-refund policy
        if (newGrandTotal < originalTotal) {
            return NextResponse.json({
                message: 'New booking total cannot be less than the original paid amount',
                originalTotal,
                newTotal: newGrandTotal,
                difference: originalTotal - newGrandTotal
            }, { status: 400 });
        }

        const balanceDue = newGrandTotal - originalTotal;

        // Perform update in transaction
        const updatedBooking = await prisma.$transaction(async (tx) => {
            // Delete existing booked halls (cascade deletes add-ons)
            await tx.bookedHall.deleteMany({
                where: { bookingId: Number(bookingId) }
            });

            // Update booking and create new booked halls
            return tx.hallBooking.update({
                where: { id: Number(bookingId) },
                data: {
                    eventType,
                    eventName: eventName || null,
                    eventDate: new Date(eventDate),
                    startTime,
                    duration,
                    organization: organization || originalBooking.organization,
                    message: message !== undefined ? message : originalBooking.message,
                    staffMember: staffMember || originalBooking.staffMember,
                    totalAmount: newGrandTotal,
                    // Update payment status to pending if there's a balance due
                    paymentStatus: balanceDue > 0 ? 'pending_balance' : originalBooking.paymentStatus,
                    bookedHalls: {
                        create: newBookedHallsData
                    }
                },
                include: {
                    bookedHalls: {
                        include: {
                            hall: true,
                            addOns: true
                        }
                    }
                }
            });
        });

        return NextResponse.json({
            message: 'Booking updated successfully',
            booking: updatedBooking,
            originalTotal,
            newTotal: newGrandTotal,
            balanceDue,
            requiresPayment: balanceDue > 0
        });

    } catch (error) {
        console.error('Edit Booking Error:', error);
        return NextResponse.json(
            { message: 'Failed to update booking', error: String(error) },
            { status: 500 }
        );
    }
}

/**
 * GET /api/bookings/edit?id=X
 * Get full booking details for editing (including hall prices for recalculation)
 */
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any)?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Unauthorized - Admin access required' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'Booking ID is required' },
                { status: 400 }
            );
        }

        const booking = await prisma.hallBooking.findUnique({
            where: { id: Number(id) },
            include: {
                bookedHalls: {
                    include: {
                        hall: {
                            include: {
                                addOns: true
                            }
                        },
                        addOns: true
                    }
                }
            }
        });

        if (!booking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(booking);

    } catch (error) {
        console.error('Get Booking for Edit Error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch booking', error: String(error) },
            { status: 500 }
        );
    }
}
