import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import nodemailer from 'nodemailer';

/**
 * POST /api/bookings/invoice
 * Send balance invoice email to client after booking edit
 */
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
        const { bookingId, originalAmount, newAmount, balanceDue } = body;

        if (!bookingId) {
            return NextResponse.json(
                { message: 'Booking ID is required' },
                { status: 400 }
            );
        }

        // Fetch booking details with add-ons
        const booking = await prisma.hallBooking.findUnique({
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

        if (!booking) {
            return NextResponse.json(
                { message: 'Booking not found' },
                { status: 404 }
            );
        }

        const hallNames = booking.bookedHalls.map(bh => bh.hall.name).join(', ');
        const eventDate = new Date(booking.eventDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Build add-ons list for email
        const allAddOns: { name: string; price: number }[] = [];
        booking.bookedHalls.forEach(bh => {
            bh.addOns.forEach(addon => {
                allAddOns.push({ name: addon.name, price: Number(addon.price) });
            });
        });

        const addOnsHtml = allAddOns.length > 0
            ? allAddOns.map(a => `<li style="color: #374151; padding: 4px 0;">${a.name} - GH₵ ${a.price.toLocaleString()}</li>`).join('')
            : '<li style="color: #9ca3af; padding: 4px 0;">No add-ons selected</li>';

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        // Professional invoice email HTML
        const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 0; 
            padding: 0; 
            background: #f5f5f5; 
            line-height: 1.6;
        }
        .container { 
            max-width: 600px; 
            margin: 20px auto; 
            background: white; 
            border-radius: 12px; 
            box-shadow: 0 4px 20px rgba(0,0,0,0.1); 
            overflow: hidden; 
        }
        .header { 
            background: linear-gradient(135deg, #1f2937 0%, #374151 100%); 
            color: white; 
            padding: 32px; 
            text-align: center; 
        }
        .header h1 { 
            margin: 0; 
            font-size: 26px; 
            font-weight: 600; 
            letter-spacing: 0.5px;
        }
        .header p { 
            margin: 12px 0 0; 
            opacity: 0.9; 
            font-size: 15px; 
        }
        .content { 
            padding: 32px; 
        }
        .greeting { 
            font-size: 16px; 
            color: #374151; 
            margin-bottom: 20px; 
        }
        .invoice-box { 
            background: #f8fafc; 
            border: 1px solid #e5e7eb; 
            border-radius: 10px; 
            padding: 20px; 
            margin: 24px 0; 
        }
        .invoice-row { 
            padding: 14px 0; 
            border-bottom: 1px solid #e5e7eb; 
        }
        .invoice-row:last-child { 
            border-bottom: none; 
        }
        .invoice-label { 
            display: block;
            color: #6b7280; 
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .invoice-value { 
            display: block;
            color: #111827; 
            font-weight: 600; 
            font-size: 16px; 
        }
        .balance-box { 
            background: #fef3c7; 
            border: 2px solid #f59e0b; 
            border-radius: 10px; 
            padding: 24px; 
            text-align: center; 
            margin: 24px 0; 
        }
        .balance-label { 
            color: #92400e; 
            font-size: 14px; 
            font-weight: 500; 
            margin: 0;
        }
        .balance-amount { 
            color: #d97706; 
            font-size: 36px; 
            font-weight: 700; 
            margin: 8px 0 0 0; 
        }
        .pay-btn { 
            display: inline-block; 
            background: #10b981; 
            color: white; 
            text-decoration: none; 
            padding: 16px 48px; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px; 
            margin: 24px 0; 
        }
        .details-section { 
            margin: 28px 0; 
        }
        .details-title { 
            font-size: 14px; 
            color: #6b7280; 
            text-transform: uppercase; 
            font-weight: 600; 
            margin-bottom: 16px; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 10px;
            letter-spacing: 0.5px; 
        }
        .details-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
        }
        .detail-item p { 
            margin: 0; 
        }
        .detail-label { 
            font-size: 12px; 
            color: #9ca3af; 
            margin-bottom: 4px;
        }
        .detail-value { 
            font-size: 14px; 
            color: #111827; 
            font-weight: 500; 
        }
        .addons-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .footer { 
            background: #f8fafc; 
            border-top: 1px solid #e5e7eb; 
            padding: 24px; 
            text-align: center; 
            font-size: 13px; 
            color: #6b7280; 
        }
        .footer p {
            margin: 8px 0;
        }
        .footer a { 
            color: #2563eb; 
            text-decoration: none; 
        }
        .payment-methods {
            background: #f0fdf4; 
            border: 1px solid #bbf7d0; 
            border-radius: 8px; 
            padding: 16px; 
            margin-top: 24px;
        }
        .payment-methods p {
            margin: 0; 
            color: #166534; 
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Monophis</h1>
            <p>Booking Amendment Invoice</p>
        </div>
        
        <div class="content">
            <p class="greeting">Dear ${booking.firstName} ${booking.lastName},</p>
            <p style="color: #4b5563; margin-bottom: 24px;">
                Your booking has been successfully amended as requested. Please find below the updated invoice details with the outstanding balance.
            </p>
            
            <div class="invoice-box">
                <div class="invoice-row">
                    <span class="invoice-label">Booking Reference</span>
                    <span class="invoice-value">${booking.reference}</span>
                </div>
                <div class="invoice-row">
                    <span class="invoice-label">Original Amount Paid</span>
                    <span class="invoice-value">GH₵ ${Number(originalAmount).toLocaleString()}</span>
                </div>
                <div class="invoice-row">
                    <span class="invoice-label">New Total Amount</span>
                    <span class="invoice-value">GH₵ ${Number(newAmount).toLocaleString()}</span>
                </div>
            </div>
            
            <div class="balance-box">
                <p class="balance-label">Balance Due</p>
                <p class="balance-amount">GH₵ ${Number(balanceDue).toLocaleString()}</p>
            </div>
            
            <div style="text-align: center;">
                <p style="color: #4b5563; font-size: 14px; margin-bottom: 16px;">
                    Please complete the payment to confirm your amended booking.
                </p>
                <a href="${process.env.NEXTAUTH_URL || 'https://monophis.com'}/hall-booking?ref=${booking.reference}" class="pay-btn">
                    Pay Now
                </a>
            </div>
            
            <div class="details-section">
                <h3 class="details-title">Updated Booking Details</h3>
                <div class="details-grid">
                    <div class="detail-item">
                        <p class="detail-label">Facility</p>
                        <p class="detail-value">${hallNames}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Event Type</p>
                        <p class="detail-value">${booking.eventType}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Event Date</p>
                        <p class="detail-value">${eventDate}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Start Time</p>
                        <p class="detail-value">${booking.startTime}</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Duration</p>
                        <p class="detail-value">${booking.duration} hours</p>
                    </div>
                    <div class="detail-item">
                        <p class="detail-label">Add-Ons</p>
                        <ul class="addons-list">${addOnsHtml}</ul>
                    </div>
                </div>
            </div>
            
            <div class="payment-methods">
                <p>
                    <strong>Payment Methods:</strong> Mobile Money (MTN, Vodafone, AirtelTigo), Bank Transfer, or Card Payment via our secure checkout.
                </p>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>Monophis</strong></p>
            <p>Accra, Ghana</p>
            <p>
                <a href="tel:+233539770722">+233 539 770 722</a> &nbsp;|&nbsp; 
                <a href="mailto:lawrenceantwi63@gmail.com">lawrenceantwi63@gmail.com</a>
            </p>
            <p style="margin-top: 16px; font-size: 11px; color: #9ca3af;">
                This is an automated invoice. Please do not reply directly to this email.
            </p>
        </div>
    </div>
</body>
</html>
        `;

        // Send invoice email
        await transporter.sendMail({
            from: `"Monophis" <${process.env.SMTP_USER}>`,
            to: booking.email,
            subject: `Invoice for Amended Booking - ${booking.reference}`,
            html: invoiceHtml
        });

        return NextResponse.json({
            message: 'Invoice sent successfully',
            sentTo: booking.email,
            bookingReference: booking.reference,
            balanceDue
        });

    } catch (error) {
        console.error('Send Invoice Error:', error);
        return NextResponse.json(
            { message: 'Failed to send invoice', error: String(error) },
            { status: 500 }
        );
    }
}
