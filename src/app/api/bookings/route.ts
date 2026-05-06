import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { verifyTransaction as verifyPaystack } from '@/lib/paystack';
import { sendBookingNotification } from '@/lib/sendEmail';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateInternalInvoiceData, formatReceiptDate } from '@/lib/receiptGenerator';

// Generate unique booking reference
const generateRef = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `REF-${year}-${randomNum}`;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            hallIds, // Array of hall IDs
            eventType,
            eventName,
            eventDate,
            startTime,
            duration,
            firstName,
            lastName,
            email,
            phone,
            organization,
            message,
            addOns, // Array of ALL selected add-on IDs (across all halls)
            paymentMethod,
            paymentIntentId, // Stripe payment intent ID for verification
            paymentStatus: clientPaymentStatus, // Payment status from client
            staffMember,
            invoice, // Base64 encoded invoice PDF
            penalty: bodyPenalty
        } = body;

        // Validation
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

        // Calculate totals and prepare booked halls data
        const penaltyValue = Number(bodyPenalty) || 0;
        let grandTotal = penaltyValue;
        const bookedHallsData = halls.map(hall => {
            const basePrice = parseFloat(hall.price.replace(/[^\d.]/g, '')) || 0;
            const baseDuration = parseInt(hall.duration) || 4; // Base duration from database
            const requestedDuration = parseFloat(duration) || baseDuration; // Duration client selected

            // Calculate hourly rate and duration-adjusted price
            const hourlyRate = basePrice / baseDuration;
            const durationAdjustedPrice = Math.round(hourlyRate * requestedDuration);

            // Filter add-ons that belong to THIS hall
            const hallAddOnsData: { name: string; price: number; unit: string | null }[] = [];
            let addOnsTotal = 0;

            if (Array.isArray(addOns) && addOns.length > 0) {
                for (const addOnId of addOns) {
                    const hallAddOn = hall.addOns.find(a => a.id === addOnId);
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

            // Hall amount = duration-adjusted hall price + add-ons
            const hallAmount = durationAdjustedPrice + addOnsTotal;
            grandTotal += hallAmount;

            return {
                hallId: hall.id,
                amount: hallAmount,
                addOns: {
                    create: hallAddOnsData
                }
            };
        });

        // Payment verification skipped in request-only flow
        console.log(`[Booking] Received booking request with method: ${paymentMethod}`);

        const reference = generateRef();

        // Create the booking with nested bookedHalls
        const booking = await prisma.hallBooking.create({
            data: {
                reference,
                eventType,
                eventName: eventName || null,
                eventDate: new Date(eventDate),
                startTime,
                duration,
                firstName,
                lastName,
                email,
                phone,
                organization,
                message,
                totalAmount: grandTotal,
                paymentMethod,
                paymentStatus: 'pending', // Default to pending for request flow
                staffMember: staffMember || 'Any staff member',
                bookedHalls: {
                    create: bookedHallsData
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

        // 4. Generate Internal Invoice PDF on Server
        const invoiceData = {
            reference: booking.reference,
            customerName: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            organization: organization || undefined,
            eventType: eventType,
            eventName: eventName || undefined,
            eventDate: formatReceiptDate(new Date(eventDate)),
            startTime: startTime || '',
            duration: duration || 'Standard',
            facilities: booking.bookedHalls.map((bh: any) => ({
                name: bh.hall.name,
                price: Number(bh.amount) - (bh.addOns?.reduce((sum: number, a: any) => sum + Number(a.price), 0) || 0)
            })),
            addOns: booking.bookedHalls.flatMap((bh: any) => 
                bh.addOns.map((a: any) => ({
                    name: a.name,
                    price: Number(a.price)
                }))
            ),
            subtotal: Number(grandTotal),
            totalAmount: Number(grandTotal),
            paymentMethod: 'Internal Invoice',
            paymentDate: formatReceiptDate(new Date()),
            facilityType: 'Hall' as const,
            penalty: penaltyValue
        };

        console.log(`[PDF] Generating invoice for ${booking.reference}...`);
        const invoiceBase64 = await generateInternalInvoiceData(invoiceData);
        console.log(`[PDF] Invoice generated for ${booking.reference}.`);

        // Send email notification to admins (Awaited to ensure delivery on serverless)
        const hallNames = booking.bookedHalls.map((bh: any) => bh.hall.name).join(', ');
        
        try {
            console.log(`[Email] Sending notification for ${booking.reference}...`);
            const emailResult = await sendBookingNotification({
                reference: booking.reference,
                customerName: `${firstName} ${lastName}`,
                email,
                phone,
                facilityType: 'Hall',
                facilityName: hallNames,
                eventDate: new Date(eventDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }),
                startTime,
                duration,
                totalAmount: grandTotal,
                paymentMethod,
                attachments: invoiceBase64 ? [{
                    filename: `Hall-Invoice-${booking.reference}.pdf`,
                    content: Buffer.from(invoiceBase64, 'base64'),
                    contentType: 'application/pdf'
                }] : undefined
            });
            console.log(`[Email] Notification result for ${booking.reference}:`, emailResult.success ? 'SUCCESS' : 'FAILED (' + emailResult.reason + ')');
        } catch (emailErr) {
            console.error(`[Email] CRITICAL error sending notification for ${booking.reference}:`, emailErr);
        }

        return NextResponse.json({
            message: 'Booking created successfully',
            id: booking.id,
            reference: booking.reference,
            totalAmount: booking.totalAmount,
            hallCount: booking.bookedHalls.length,
            bookedHalls: booking.bookedHalls.map((bh: any) => ({
                hallName: bh.hall.name,
                amount: bh.amount
            }))
        }, { status: 201 });

    } catch (error) {
        console.error('Booking Creation Error:', error);
        return NextResponse.json(
            { message: 'Failed to create booking', error: String(error) },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const hallId = searchParams.get('hallId');

        // If hallId is provided, filter bookings that include that hall
        // IMPORTANT: Exclude cancelled bookings so those time slots become available again
        let bookings;
        if (hallId) {
            bookings = await prisma.hallBooking.findMany({
                where: {
                    bookedHalls: {
                        some: { hallId: Number(hallId) }
                    },
                    // Exclude cancelled bookings from availability check
                    paymentStatus: { not: 'cancelled' }
                },
                include: {
                    bookedHalls: {
                        include: {
                            hall: true,
                            addOns: true
                        }
                    }
                },
                orderBy: { eventDate: 'desc' }
            });
        } else {
            bookings = await prisma.hallBooking.findMany({
                include: {
                    bookedHalls: {
                        include: {
                            hall: true,
                            addOns: true
                        }
                    }
                },
                orderBy: { eventDate: 'desc' }
            });
        }

        // Fetch client profile pictures for all unique emails
        const emails = [...new Set(bookings.map(b => b.email))];
        const clients = await prisma.client.findMany({
            where: { email: { in: emails } },
            select: { email: true, profilePicture: true }
        });

        // Create email -> profilePicture map
        const profileMap = new Map(clients.map(c => [c.email, c.profilePicture]));

        // Add profile picture to each booking
        const bookingsWithProfile = bookings.map(booking => ({
            ...booking,
            profilePicture: profileMap.get(booking.email) || null
        }));

        return NextResponse.json(bookingsWithProfile);
    } catch (error) {
        console.error('Fetch Bookings Error:', error);
        return NextResponse.json(
            { message: 'Failed to fetch bookings', error: String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        // Verify admin session
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

        // First, get the booking to check for receipt file
        const booking = await prisma.hallBooking.findUnique({
            where: { id: Number(id) },
            select: { receiptPath: true }
        });

        // Delete the receipt file if it exists
        if (booking?.receiptPath) {
            const fs = await import('fs');
            const path = await import('path');
            const filepath = path.join(process.cwd(), 'public', booking.receiptPath);
            try {
                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath);
                    console.log('Deleted receipt file:', filepath);
                }
            } catch (fileError) {
                console.error('Failed to delete receipt file:', fileError);
                // Continue with booking deletion even if file deletion fails
            }
        }

        // Delete the booking (cascade will remove bookedHalls and addOns)
        await prisma.hallBooking.delete({
            where: { id: Number(id) }
        });

        return NextResponse.json({
            message: 'Booking deleted successfully'
        });
    } catch (error: any) {
        console.error('Delete Booking Error:', error);
        const errorMessage = error?.message || error?.code || String(error);
        return NextResponse.json(
            { message: 'Failed to delete booking', error: errorMessage },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
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
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json(
                { message: 'Booking ID is required' },
                { status: 400 }
            );
        }

        // Update the booking (only top-level fields like paymentStatus)
        const updatedBooking = await prisma.hallBooking.update({
            where: { id: Number(id) },
            data: updateData,
            include: {
                bookedHalls: {
                    include: {
                        hall: true,
                        addOns: true
                    }
                }
            }
        });

        return NextResponse.json({
            message: 'Booking updated successfully',
            booking: updatedBooking
        });
    } catch (error) {
        console.error('Update Booking Error:', error);
        return NextResponse.json(
            { message: 'Failed to update booking', error: String(error) },
            { status: 500 }
        );
    }
}
