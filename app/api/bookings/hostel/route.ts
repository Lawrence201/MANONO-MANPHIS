import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingNotification } from '@/lib/sendEmail';
import { verifyTransaction as verifyPaystack } from '@/lib/paystack';
import { stripe } from '@/lib/stripe';
import { generateInternalInvoiceData, formatReceiptDate } from '@/lib/receiptGenerator';

function generateBookingReference() {
    const timestamp = Date.now().toString().slice(-6); // Last 6 digits
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `HST-${timestamp}-${random}`; // HST prefix for Hostels
}

// GET: Fetch all hostel bookings
export async function GET() {
    try {
        const bookings = await prisma.hostelBooking.findMany({
            include: {
                hostel: {
                    select: {
                        name: true
                    }
                },
                addOns: true
            },
            orderBy: {
                checkInDate: 'desc'
            }
        });

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
        console.error('Error fetching hostel bookings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch hostel bookings' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            hostelId,
            checkInDate,
            checkInTime,
            duration,
            numberOfDays,
            guests,
            numberOfRooms,
            firstName,
            lastName,
            email,
            phone,
            institution,
            specialRequests,
            addOns,
            paymentMethod,
            paymentStatus,
            paymentIntentId,
            staffMember,
            totalAmount: clientTotalAmount, // Accept client-calculated total
            invoice, // Base64 encoded invoice PDF
            penalty: bodyPenalty
        } = body;

        // Basic Validation
        if (!hostelId || !checkInDate || !firstName || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Fetch Hostel to get price and room quantity
        const hostel = await prisma.hostel.findUnique({
            where: { id: Number(hostelId) }
        });

        if (!hostel) {
            return NextResponse.json(
                { error: 'Hostel not found' },
                { status: 404 }
            );
        }

        // Check availability before booking
        const requestedRooms = Number(numberOfRooms) || 1;
        const days = Number(numberOfDays) || 1;
        const totalRooms = hostel.roomQuantity || 0;

        // Calculate overlapping bookings
        const checkInDateObj = new Date(checkInDate);
        checkInDateObj.setHours(0, 0, 0, 0);
        const checkOutDateObj = new Date(checkInDateObj);
        checkOutDateObj.setDate(checkOutDateObj.getDate() + days);

        const existingBookings = await prisma.hostelBooking.findMany({
            where: {
                hostelId: Number(hostelId),
                paymentStatus: { not: 'cancelled' }
            },
            select: {
                checkInDate: true,
                numberOfDays: true,
                numberOfRooms: true,
                duration: true
            }
        });

        let bookedRooms = 0;
        for (const booking of existingBookings) {
            const bookingCheckIn = new Date(booking.checkInDate);
            bookingCheckIn.setHours(0, 0, 0, 0);

            let bookingDays = booking.numberOfDays || 1;
            if (!booking.numberOfDays && booking.duration) {
                const match = booking.duration.match(/(\d+)/);
                if (match) bookingDays = parseInt(match[1]) || 1;
            }

            const bookingCheckOut = new Date(bookingCheckIn);
            bookingCheckOut.setDate(bookingCheckOut.getDate() + bookingDays);

            if (bookingCheckIn < checkOutDateObj && bookingCheckOut > checkInDateObj) {
                bookedRooms += booking.numberOfRooms;
            }
        }

        const availableRooms = Math.max(0, totalRooms - bookedRooms);
        if (requestedRooms > availableRooms) {
            return NextResponse.json(
                { error: `Only ${availableRooms} room(s) available for these dates. You requested ${requestedRooms}.` },
                { status: 400 }
            );
        }

        let basePrice = parseFloat(hostel.price.replace(/[^0-9.]/g, ''));
        if (isNaN(basePrice)) basePrice = 0;

        // Recalculate totals and prepare add-ons data securely from DB
        let totalAddons = 0;
        const bookingAddOnsData: { name: string; price: number; unit: string }[] = [];
        
        // Fetch hostel with its add-ons to verify prices
        const hostelWithAddons = await prisma.hostel.findUnique({
            where: { id: Number(hostelId) },
            include: { addOns: true }
        });

        if (hostelWithAddons && addOns && Array.isArray(addOns)) {
            for (const addonRef of addOns) {
                // Handle both ID array (client) and object array (admin)
                const addonId = typeof addonRef === 'object' ? addonRef.id : addonRef;
                const addonName = typeof addonRef === 'object' ? addonRef.name : null;
                const dbAddon = hostelWithAddons.addOns.find(a => a.id === addonId || (addonName && a.name === addonName));
                
                if (dbAddon) {
                    const price = parseFloat(dbAddon.price.toString().replace(/[^0-9.]/g, '')) || 0;
                    totalAddons += price;
                    bookingAddOnsData.push({
                        name: dbAddon.name,
                        price: price,
                        unit: dbAddon.unit || 'Fixed'
                    });
                }
            }
        }

        const penaltyValue = Number(bodyPenalty) || 0;
        const subtotal = (basePrice * days * requestedRooms) + totalAddons;
        const totalAmount = subtotal + penaltyValue;

        // Add-ons data is now prepared above

        // Verify payment based on method (only if not 'invoice')
        if (paymentMethod === 'stripe') {
            if (!paymentIntentId) {
                return NextResponse.json(
                    { error: 'Stripe Payment Intent ID is required.' },
                    { status: 400 }
                );
            }
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status !== 'succeeded') {
                return NextResponse.json(
                    { error: `Stripe payment not completed. Status: ${paymentIntent.status}` },
                    { status: 400 }
                );
            }
        } else if (paymentMethod === 'paystack') {
            if (!paymentIntentId) {
                return NextResponse.json(
                    { error: 'Paystack Reference is required.' },
                    { status: 400 }
                );
            }
            const paystackResult = await verifyPaystack(paymentIntentId);
            if (!paystackResult.status || paystackResult.data.status !== 'success') {
                return NextResponse.json(
                    { error: `Paystack payment not verified. Result: ${paystackResult.message}` },
                    { status: 400 }
                );
            }

            // Security: Verify amount (Paystack amount is in pesewas)
            const expectedPesewas = Math.round(Number(totalAmount) * 100);
            const actualPesewas = paystackResult.data.amount;

            if (Math.abs(actualPesewas - expectedPesewas) > 1) {
                return NextResponse.json(
                    { error: `Payment amount mismatch. Expected GHS ${totalAmount} (${expectedPesewas} pesewas), but Paystack verifies ${actualPesewas} pesewas.` },
                    { status: 400 }
                );
            }
        } else if (paymentMethod === 'invoice' || paymentMethod === 'bank_transfer') {
            // No verification needed for manual invoice/request flow
            console.log(`[Hostel Booking] ${paymentMethod} selected - skipping verification, status will be pending.`);
        }

        const reference = generateBookingReference();

        // Transaction to create booking and add-ons
        const booking = await prisma.hostelBooking.create({
            data: {
                reference,
                hostelId: Number(hostelId),
                checkInDate: new Date(checkInDate),
                checkInTime,
                duration: duration || `${days} Day${days > 1 ? 's' : ''}`,
                numberOfDays: days,
                guests: Number(guests) || 1,
                numberOfRooms: Number(numberOfRooms) || 1,
                firstName,
                lastName,
                email,
                phone,
                institution,
                specialRequests,
                totalAmount: totalAmount,
                paymentMethod: paymentMethod || 'invoice',
                paymentStatus: paymentMethod === 'invoice' ? 'pending' : (paymentStatus || 'pending'),
                staffMember: staffMember || 'Any staff member',
                addOns: {
                    create: bookingAddOnsData
                }
            }
        });

        // 4. Generate Internal Invoice PDF on Server
        const invoiceData = {
            reference: booking.reference,
            customerName: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            organization: institution || undefined,
            eventType: 'Accommodation',
            eventDate: formatReceiptDate(new Date(checkInDate)),
            startTime: checkInTime || '',
            duration: booking.duration,
            facilities: [{
                name: `${hostel.name}${requestedRooms > 1 || days > 1 ? ` (${requestedRooms} Room${requestedRooms > 1 ? 's' : ''} x ${days} Night${days > 1 ? 's' : ''} @ GHS ${basePrice.toLocaleString()}/night)` : ''}`,
                price: basePrice * days * requestedRooms
            }],
            addOns: bookingAddOnsData.map(a => ({
                name: a.name,
                price: a.price
            })),
            subtotal: subtotal,
            totalAmount: totalAmount,
            paymentMethod: 'Internal Invoice',
            paymentDate: formatReceiptDate(new Date()),
            facilityType: 'Lodge' as const,
            penalty: penaltyValue
        };

        console.log(`[PDF] Generating invoice for ${booking.reference}...`);
        const invoiceBase64 = await generateInternalInvoiceData(invoiceData);
        console.log(`[PDF] Invoice generated for ${booking.reference}.`);
 
        // Send email notification to admins (Awaited to ensure delivery on serverless)
        try {
            console.log(`[Email] Sending notification for ${booking.reference}...`);
            const emailResult = await sendBookingNotification({
                reference: booking.reference,
                customerName: `${firstName} ${lastName}`,
                email,
                phone,
                facilityType: 'Hostel',
                facilityName: hostel.name,
                eventDate: new Date(checkInDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }),
                startTime: checkInTime,
                duration: duration || 'Standard',
                totalAmount: totalAmount,
                paymentMethod,
                attachments: invoiceBase64 ? [{
                    filename: `Lodge-Invoice-${booking.reference}.pdf`,
                    content: Buffer.from(invoiceBase64, 'base64'),
                    contentType: 'application/pdf'
                }] : undefined
            });
            console.log(`[Email] Notification result for ${booking.reference}:`, emailResult.success ? 'SUCCESS' : 'FAILED (' + emailResult.reason + ')');
        } catch (emailErr) {
            console.error(`[Email] CRITICAL error sending notification for ${booking.reference}:`, emailErr);
        }

        return NextResponse.json({
            success: true,
            bookingId: booking.id,
            reference: booking.reference
        }, { status: 201 });

    } catch (error: any) {
        console.error('Error creating hostel booking:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message || String(error) },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Booking ID required' }, { status: 400 });
        }

        await prisma.hostelBooking.delete({
            where: { id: parseInt(id) }
        });

        return NextResponse.json({ message: 'Booking deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting hostel booking:', error);
        return NextResponse.json(
            { message: 'Failed to delete booking', error: error.message || String(error) },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, paymentStatus } = body;

        if (!id || !paymentStatus) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const booking = await prisma.hostelBooking.update({
            where: { id: Number(id) },
            data: { paymentStatus }
        });

        return NextResponse.json({ success: true, booking });
    } catch (error) {
        console.error('Error updating hostel booking:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
