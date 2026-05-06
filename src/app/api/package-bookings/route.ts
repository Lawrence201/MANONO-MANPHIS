import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBookingNotification } from '@/lib/sendEmail';
import { verifyTransaction as verifyPaystack } from '@/lib/paystack';
import { stripe } from '@/lib/stripe';
import { generateInternalInvoiceData, formatReceiptDate } from '@/lib/receiptGenerator';

// Helper function to generate unique reference
function generateReference(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `PKG-${timestamp}-${random}`;
}

// GET - Fetch bookings for a specific package (for availability checking) or all bookings
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const packageId = searchParams.get('packageId');
        const fetchAll = searchParams.get('all');

        let bookings: any[] = [];

        if (fetchAll === 'true') {
            // Fetch all package bookings with client profile pictures
            bookings = await prisma.$queryRaw`
                SELECT pb.*, p.name as package_name, c.profile_picture
                FROM package_bookings pb
                LEFT JOIN packages p ON pb.package_id = p.id
                LEFT JOIN clients c ON pb.email = c.email
                ORDER BY pb.event_date DESC
            ` as any[];
        } else if (packageId) {
            // Fetch bookings for specific package (for availability checking)
            // IMPORTANT: Exclude cancelled bookings so those time slots become available again
            bookings = await prisma.$queryRaw`
                SELECT pb.*, p.name as package_name, c.profile_picture
                FROM package_bookings pb
                LEFT JOIN packages p ON pb.package_id = p.id
                LEFT JOIN clients c ON pb.email = c.email
                WHERE pb.package_id = ${parseInt(packageId)}
                AND pb.payment_status != 'cancelled'
                ORDER BY pb.event_date DESC
            ` as any[];
        } else {
            return NextResponse.json({ error: 'Package ID or all=true is required' }, { status: 400 });
        }

        const formattedBookings = bookings.map((booking: any) => ({
            id: booking.id,
            reference: booking.reference,
            packageId: booking.package_id,
            packageName: booking.package_name || 'Event Package',
            eventType: booking.event_type,
            eventDate: booking.event_date,
            startTime: booking.start_time,
            duration: booking.duration,
            guests: booking.guests,
            firstName: booking.first_name,
            lastName: booking.last_name,
            email: booking.email,
            phone: booking.phone,
            organization: booking.organization,
            totalAmount: booking.total_amount,
            paymentMethod: booking.payment_method,
            paymentStatus: booking.payment_status,
            staffMember: booking.staff_member,
            createdAt: booking.created_at,
            profilePicture: booking.profile_picture || null,
            message: booking.message || null
        }));

        return NextResponse.json(formattedBookings);
    } catch (error: any) {
        console.error("Error fetching package bookings:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}

// POST - Create a new package booking
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            packageId,
            eventType,
            eventDate,
            startTime,
            duration,
            guests,
            firstName,
            lastName,
            email,
            phone,
            organization,
            message,
            addOns,
            paymentMethod,
            paymentIntentId,
            staffMember,
            totalPrice,  // Client-calculated price with duration adjustment
            invoice, // Base64 encoded invoice PDF
            penalty: bodyPenalty
        } = body;

        // Validate required fields
        if (!packageId || !eventType || !eventDate || !startTime) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Fetch the package to get its price
        const packageData = await prisma.$queryRaw`
            SELECT * FROM packages WHERE id = ${parseInt(packageId)}
        ` as any[];

        if (packageData.length === 0) {
            return NextResponse.json(
                { message: 'Package not found' },
                { status: 404 }
            );
        }

        const pkg = packageData[0];
        const packagePrice = parseFloat(pkg.price.replace(/[^\d.]/g, '')) || 0;

        // Fetch selected add-ons and calculate total
        let addOnsTotal = 0;
        const selectedAddOns: any[] = [];

        if (addOns && addOns.length > 0) {
            for (const addonId of addOns) {
                const addonData = await prisma.$queryRaw`
                    SELECT * FROM package_addons WHERE id = ${addonId}
                ` as any[];

                if (addonData.length > 0) {
                    const addon = addonData[0];
                    const addonPrice = parseFloat(addon.price.replace(/[^\d.]/g, '')) || 0;
                    addOnsTotal += addonPrice;
                    selectedAddOns.push({
                        name: addon.name,
                        price: addonPrice,
                        unit: addon.unit
                    });
                }
            }
        }

        // Calculate totals server-side for security and accuracy
        const baseDuration = parseInt(pkg.duration) || 4;
        const hourlyRate = packagePrice / baseDuration;
        const enteredDuration = parseFloat(duration) || baseDuration;
        const calculatedPackagePrice = Math.round(hourlyRate * enteredDuration);

        const penaltyValue = Number(bodyPenalty) || 0;
        const subtotal = calculatedPackagePrice + addOnsTotal;
        const totalAmount = subtotal + penaltyValue;

        // Verify payment based on method (only if not 'invoice')
        if (paymentMethod === 'stripe') {
            if (!paymentIntentId) {
                return NextResponse.json(
                    { message: 'Stripe Payment Intent ID is required.' },
                    { status: 400 }
                );
            }
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            if (paymentIntent.status !== 'succeeded') {
                return NextResponse.json(
                    { message: `Stripe payment not completed. Status: ${paymentIntent.status}` },
                    { status: 400 }
                );
            }
        } else if (paymentMethod === 'paystack') {
            if (!paymentIntentId) {
                return NextResponse.json(
                    { message: 'Paystack Reference is required.' },
                    { status: 400 }
                );
            }
            const paystackResult = await verifyPaystack(paymentIntentId);
            if (!paystackResult.status || paystackResult.data.status !== 'success') {
                return NextResponse.json(
                    { message: `Paystack payment not verified. Result: ${paystackResult.message}` },
                    { status: 400 }
                );
            }

            // Security: Verify amount (Paystack amount is in pesewas)
            const expectedPesewas = Math.round(totalAmount * 100);
            const actualPesewas = paystackResult.data.amount;

            if (Math.abs(actualPesewas - expectedPesewas) > 1) {
                return NextResponse.json(
                    { message: `Payment amount mismatch. Expected GHS ${totalAmount} (${expectedPesewas} pesewas), but Paystack verifies ${actualPesewas} pesewas.` },
                    { status: 400 }
                );
            }
        } else if (paymentMethod === 'invoice' || paymentMethod === 'bank_transfer') {
            // No verification needed for manual invoice/request flow
            console.log(`[Package Booking] ${paymentMethod} selected - skipping verification, status will be pending.`);
        }

        const reference = generateReference();

        // Insert the booking
        const result = await prisma.$queryRaw`
            INSERT INTO package_bookings (
                reference, package_id, event_type, event_date, start_time,
                duration, guests, first_name, last_name, email, phone,
                organization, message, total_amount, payment_method, 
                payment_status, staff_member, created_at, updated_at
            ) VALUES (
                ${reference}, ${parseInt(packageId)}, ${eventType}, 
                ${new Date(eventDate)}, ${startTime}, ${duration || pkg.duration},
                ${guests || 1}, ${firstName}, ${lastName}, ${email}, ${phone},
                ${organization || null}, ${message || null}, ${totalAmount},
                ${paymentMethod || 'invoice'}, ${paymentMethod === 'invoice' ? 'pending' : 'paid'}, ${staffMember || null}, NOW(), NOW()
            ) RETURNING id
        ` as any[];
        const bookingId = Number(result[0].id);

        // Insert add-ons for this booking
        for (const addon of selectedAddOns) {
            await prisma.$executeRaw`
                INSERT INTO package_booking_addons (booking_id, name, price, unit)
                VALUES (${bookingId}, ${addon.name}, ${addon.price}, ${addon.unit})
            `;
        }

        // 4. Generate Internal Invoice PDF on Server
        const invoiceData = {
            reference: reference,
            customerName: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            organization: organization || undefined,
            eventType: eventType,
            eventDate: formatReceiptDate(new Date(eventDate)),
            startTime: startTime || '',
            duration: duration || pkg.duration,
            facilities: [{
                name: pkg.name || 'Event Package',
                price: calculatedPackagePrice
            }],
            addOns: selectedAddOns.map((a: any) => ({
                name: a.name,
                price: a.price
            })),
            subtotal: subtotal,
            totalAmount: totalAmount,
            paymentMethod: 'Internal Invoice',
            paymentDate: formatReceiptDate(new Date()),
            facilityType: 'Package' as const,
            penalty: Number(bodyPenalty) || 0
        };

        console.log(`[PDF] Generating invoice for ${reference}...`);
        const invoiceBase64 = await generateInternalInvoiceData(invoiceData);
        console.log(`[PDF] Invoice generated for ${reference}.`);

        // Send email notification to admins (Awaited to ensure delivery on serverless)
        try {
            console.log(`[Email] Sending notification for ${reference}...`);
            const emailResult = await sendBookingNotification({
                reference: reference,
                customerName: `${firstName} ${lastName}`,
                email,
                phone,
                facilityType: 'Package',
                facilityName: pkg.name || 'Event Package',
                eventDate: new Date(eventDate).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                }),
                startTime,
                duration: duration || pkg.duration,
                totalAmount: totalAmount,
                paymentMethod,
                attachments: invoiceBase64 ? [{
                    filename: `Package-Invoice-${reference}.pdf`,
                    content: Buffer.from(invoiceBase64, 'base64'),
                    contentType: 'application/pdf'
                }] : undefined
            });
            console.log(`[Email] Notification result for ${reference}:`, emailResult.success ? 'SUCCESS' : 'FAILED (' + emailResult.reason + ')');
        } catch (emailErr) {
            console.error(`[Email] CRITICAL error sending notification for ${reference}:`, emailErr);
        }

        return NextResponse.json({
            success: true,
            reference: reference,
            bookingId: bookingId,
            totalAmount: totalAmount
        });

    } catch (error: any) {
        console.error("Error creating package booking:", error);
        return NextResponse.json(
            { message: 'Failed to create booking: ' + (error.message || String(error)) },
            { status: 500 }
        );
    }
}

// PATCH - Update a package booking (e.g., payment status)
export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, paymentStatus, receiptPath } = body;

        if (!id) {
            return NextResponse.json({ message: 'Booking ID required' }, { status: 400 });
        }

        // Build the update query dynamically based on what fields are provided
        if (paymentStatus && receiptPath) {
            await prisma.$executeRaw`
                UPDATE package_bookings 
                SET payment_status = ${paymentStatus}, receipt_path = ${receiptPath}, updated_at = NOW()
                WHERE id = ${id}
            `;
        } else if (paymentStatus) {
            await prisma.$executeRaw`
                UPDATE package_bookings 
                SET payment_status = ${paymentStatus}, updated_at = NOW()
                WHERE id = ${id}
            `;
        } else if (receiptPath) {
            await prisma.$executeRaw`
                UPDATE package_bookings 
                SET receipt_path = ${receiptPath}, updated_at = NOW()
                WHERE id = ${id}
            `;
        } else {
            return NextResponse.json({ message: 'No update fields provided' }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: 'Booking updated successfully' });
    } catch (error: any) {
        console.error('Error updating package booking:', error);
        return NextResponse.json(
            { message: 'Failed to update booking', error: error.message || String(error) },
            { status: 500 }
        );
    }
}

// DELETE - Delete a package booking
export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ message: 'Booking ID required' }, { status: 400 });
        }

        // Delete from package_bookings (cascade should handle add-ons if set up in DB, else manual delete)
        // Since we are using raw queries for packages (it seems), let's manually delete addons first just to be safe if no cascade
        // Actually, let's assume raw queries mean we don't have Prisma types perfectly set up or we prefer raw.
        // Let's delete addons first.

        const bookingId = parseInt(id);

        await prisma.$executeRaw`
            DELETE FROM package_booking_addons WHERE booking_id = ${bookingId}
        `;

        await prisma.$executeRaw`
            DELETE FROM package_bookings WHERE id = ${bookingId}
        `;

        return NextResponse.json({ message: 'Booking deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting package booking:', error);
        return NextResponse.json(
            { message: 'Failed to delete booking', error: error.message || String(error) },
            { status: 500 }
        );
    }
}
