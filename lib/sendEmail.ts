import nodemailer from 'nodemailer';
import { prisma } from './prisma';

// Create reusable transporter
// Helper to get fresh transporter
function getTransporter() {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS?.replace(/[\s"']/g, ''),
        },
        // Port 465 is implicit with service: 'gmail' but we can be explicit
        // Adding timeouts to prevent silent socket closures
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000,
        socketTimeout: 30000
    } as any);

    const p = (transporter as any).options.auth.pass;
    if (p) {
        console.log('[Email] Transporter created. Pass len:', p.length, 'Mask:', p.substring(0, 2) + '...' + p.substring(p.length - 2));
    }
    return transporter;
}

interface BookingDetails {
    reference: string;
    customerName: string;
    email: string;
    phone: string;
    facilityType: 'Hall' | 'Hostel' | 'Package';
    facilityName: string;
    eventDate: string;
    startTime?: string;
    duration: string;
    totalAmount: string | number;
    paymentMethod: string;
    attachments?: Array<{
        filename: string;
        content: string | Buffer;
        contentType?: string;
        encoding?: string;
    }>;
}

/**
 * Formats duration with appropriate units (Hours/Days) based on facility type
 */
function formatDuration(duration: string | number, facilityType: string): string {
    const raw = String(duration).trim();
    // If it already has letters (e.g., "4 hours", "2 days"), return as is
    if (/[a-zA-Z]/.test(raw)) return raw;

    const num = parseFloat(raw);
    if (isNaN(num)) return raw;

    const unit = facilityType === 'Hostel' ? 'Day' : 'Hour';
    return `${num} ${unit}${num !== 1 ? 's' : ''}`;
}

/**
 * Send booking notification email to all admins
 */
export async function sendBookingNotification(booking: BookingDetails) {
    console.log(`[Email] Starting notification for ${booking.reference} (${booking.facilityType})`);
    console.log(`[Email] Facility: ${booking.facilityName}, Date: ${booking.eventDate}`);

    try {
        // Standardize duration formatting
        const formattedDuration = formatDuration(booking.duration, booking.facilityType);

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('[Email] SMTP not configured. SMTP_USER:', !!process.env.SMTP_USER, 'SMTP_PASS:', !!process.env.SMTP_PASS);
            return { success: false, reason: 'SMTP not configured' };
        }

        console.log('[Email] SMTP configured with user:', process.env.SMTP_USER);

        // Fetch client team emails
        let allRecipients: string[] = [];
        try {
            const clientTeam = await prisma.clientTeam.findMany({ 
                select: { email: true } 
            });
            
            allRecipients = clientTeam.map((t: { email: string }) => t.email);
            
            console.log(`[Email] Found ${clientTeam.length} client team member(s).`);
            console.log('[Email] Recipients:', allRecipients);
        } catch (dbError) {
            console.error('[Email] Database error fetching recipients:', dbError);
            return { success: false, reason: 'Database error: ' + String(dbError) };
        }

        if (allRecipients.length === 0) {
            console.log('[Email] No recipients found in database. Skipping email notification.');
            return { success: false, reason: 'No recipients found' };
        }

        // Create email content
        const subject = `New ${booking.facilityType} Booking Request: ${booking.reference}`;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1F2937 0%, #374151 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .booking-info { background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
        .info-label { font-weight: 600; color: #6b7280; width: 140px; }
        .info-value { color: #111827; }
        .amount { font-size: 24px; font-weight: 700; color: #10B981; }
        .cta { background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px; font-weight: 600; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New ${booking.facilityType} Booking Request!</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Reference: ${booking.reference}</p>
        </div>
        <div class="content">
            <div class="booking-info">
                <h3 style="margin-top: 0; color: #1f2937;">Customer Details</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value">${booking.customerName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${booking.email}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value">${booking.phone}</span>
                </div>
            </div>
            
            <div class="booking-info">
                <h3 style="margin-top: 0; color: #1f2937;">Booking Details</h3>
                <div class="info-row">
                    <span class="info-label">${booking.facilityType}:</span>
                    <span class="info-value">${booking.facilityName}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Date:</span>
                    <span class="info-value">${booking.eventDate}</span>
                </div>
                ${booking.startTime ? `
                <div class="info-row">
                    <span class="info-label">Time:</span>
                    <span class="info-value">${booking.startTime}</span>
                </div>
                ` : ''}
                <div class="info-row">
                    <span class="info-label">Duration:</span>
                    <span class="info-value">${formattedDuration}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Payment:</span>
                    <span class="info-value">${booking.paymentMethod}</span>
                </div>
                <div class="info-row" style="border-bottom: none;">
                    <span class="info-label">Amount:</span>
                    <span class="amount">GH₵ ${typeof booking.totalAmount === 'number' ? booking.totalAmount.toLocaleString() : booking.totalAmount}</span>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin" class="cta">
                    View Dashboard →
                </a>
            </div>
        </div>
        <div class="footer">
            <p>Camp Elim Africa Booking System</p>
            <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
        `;

        // Send email
        console.log(`[Email] Sending to ${allRecipients.length} recipients: ${allRecipients.join(', ')}`);
        if (booking.attachments && booking.attachments.length > 0) {
            console.log(`[Email] Attaching ${booking.attachments.length} file(s) to notification.`);
        }
        const transporter = getTransporter();
        const info = await transporter.sendMail({
            from: `"Camp Elim Africa" <${process.env.SMTP_USER}>`,
            to: allRecipients.join(', '),
            subject: subject,
            html: htmlContent,
            attachments: booking.attachments
        });
        
        if (info.accepted && info.accepted.length > 0) {
            console.log(`[Email] Success: ${booking.reference} sent to ${info.accepted.join(', ')}`);
            console.log(`[Email] MessageId: ${info.messageId}`);
            return { success: true, messageId: info.messageId };
        } else {
            console.warn(`[Email] Warning: ${booking.reference} was not accepted by any recipient. Info:`, info);
            return { success: false, reason: 'No recipients accepted the email' };
        }

    } catch (mailError: any) {
        console.error('[Email] SEVERE failure sending notification:', {
            message: mailError.message,
            code: mailError.code,
            command: mailError.command,
            responseCode: mailError.responseCode,
            response: mailError.response,
            stack: mailError.stack
        });
        return { success: false, error: String(mailError) };
    }
}

interface ClientReceiptDetails {
    reference: string;
    customerName: string;
    email: string;
    facilityType: 'Hall' | 'Hostel' | 'Package';
    facilityNames: string[];
    eventDate: string;
    totalAmount: string | number;
    pdfBuffer: Buffer; // Direct PDF buffer - always attached
}

/**
 * Send receipt PDF to client via email attachment
 * PDF buffer is passed directly to ensure it's always attached
 */
export async function sendReceiptToClient(details: ClientReceiptDetails) {
    console.log('[Email] Sending receipt to client:', details.email, 'Reference:', details.reference);

    try {
        // Check if SMTP is configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('[Email] SMTP not configured for client receipt');
            return { success: false, reason: 'SMTP not configured' };
        }

        // PDF buffer is passed directly - no need to download
        const pdfBuffer = details.pdfBuffer;
        console.log('[Email] Using provided PDF buffer, size:', pdfBuffer.length, 'bytes');

        const subject = `Your Camp Elim Africa Booking Receipt - ${details.reference}`;
        const facilityList = details.facilityNames.join(', ');

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1F2937 0%, #374151 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; }
        .header p { margin: 10px 0 0; opacity: 0.9; font-size: 16px; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; color: #1f2937; margin-bottom: 20px; }
        .booking-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin: 24px 0; }
        .booking-card h3 { margin: 0 0 16px; color: #1f2937; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
        .info-row { padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-of-type { border-bottom: none; }
        .info-label { display: block; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .info-value { display: block; color: #1f2937; font-weight: 600; font-size: 16px; }
        .amount-row { background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 16px 20px; border-radius: 8px; margin-top: 20px; }
        .amount-label { display: block; font-size: 12px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .amount-value { display: block; font-size: 28px; font-weight: 700; }
        .notice { background: #FEF3C7; border: 1px solid #F59E0B; border-radius: 8px; padding: 16px; margin: 24px 0; }
        .notice-title { color: #92400E; font-weight: 600; margin: 0 0 8px; font-size: 14px; }
        .notice-text { color: #92400E; margin: 0; font-size: 13px; }
        .download-btn { display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 20px; }
        .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 5px 0; color: #6b7280; font-size: 13px; }
        .footer .contact { margin-top: 15px; }
        .footer .contact a { color: #3B82F6; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed!</h1>
            <p>Thank you for choosing Camp Elim Africa</p>
        </div>
        <div class="content">
            <p class="greeting">Dear ${details.customerName},</p>
            <p>We are pleased to confirm your ${details.facilityType.toLowerCase()} booking. Your payment has been received successfully, and your receipt is attached to this email.</p>
            
            <div class="booking-card">
                <h3>Booking Summary</h3>
                <div class="info-row">
                    <span class="info-label">Reference Number</span>
                    <span class="info-value">${details.reference}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">${details.facilityType}</span>
                    <span class="info-value">${facilityList}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Event Date</span>
                    <span class="info-value">${details.eventDate}</span>
                </div>
                <div class="amount-row">
                    <span class="amount-label">Total Paid</span>
                    <span class="amount-value">GHS ${typeof details.totalAmount === 'number' ? details.totalAmount.toLocaleString() : details.totalAmount}</span>
                </div>
            </div>

            <div class="notice">
                <p class="notice-title">Important Information</p>
                <p class="notice-text">Please keep this email and the attached receipt for your records. Present your booking reference on the day of your event.</p>
            </div>
        </div>
        <div class="footer">
            <p><strong>Camp Elim Africa</strong></p>
            <p>Your Premier Conference & Retreat Destination</p>
            <div class="contact">
                <p><a href="mailto:emily@campelimafrica.org">emily@campelimafrica.org</a> | +233 539 770 722</p>
            </div>
        </div>
    </div>
</body>
</html>
        `;

        // Build email options with PDF always attached
        const mailOptions: any = {
            from: `"Camp Elim Africa" <${process.env.SMTP_USER}>`,
            to: details.email,
            subject: subject,
            html: htmlContent,
            attachments: [
                {
                    filename: `CampElim-Receipt-${details.reference}.pdf`,
                    content: pdfBuffer,
                    contentType: 'application/pdf'
                }
            ]
        };
        console.log('[Email] PDF attached to email');

        // Send email
        const transporter = getTransporter();
        const info = await transporter.sendMail(mailOptions);

        console.log('[Email] Receipt sent to client:', info.messageId);
        return { success: true, messageId: info.messageId, pdfAttached: !!pdfBuffer };

    } catch (error) {
        console.error('[Email] Failed to send receipt to client:', error);
        return { success: false, error: String(error) };
    }
}
