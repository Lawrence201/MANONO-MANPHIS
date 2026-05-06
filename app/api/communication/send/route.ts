import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface SendEmailRequest {
    recipients: Array<{ name: string; email: string }>;
    subject: string;
    message: string;
    template?: string;
}

// Email templates
const templates: Record<string, { subject: string; body: string }> = {
    welcome: {
        subject: 'Welcome to Camp Elim Africa!',
        body: `
            <p>Dear {{name}},</p>
            <p>Welcome to Camp Elim Africa! We are thrilled to have you as part of our community.</p>
            <p>Whether you're planning a retreat, conference, wedding, or any special event, we're here to make your experience unforgettable.</p>
            <p>Feel free to explore our facilities and book your next event with us.</p>
            <p>Warm regards,<br>Camp Elim Africa Team</p>
        `
    },
    reminder: {
        subject: 'Reminder: Your Upcoming Event at Camp Elim Africa',
        body: `
            <p>Dear {{name}},</p>
            <p>This is a friendly reminder about your upcoming event at Camp Elim Africa.</p>
            <p>We're looking forward to hosting you and ensuring your event is a success!</p>
            <p>If you have any questions or need to make changes, please don't hesitate to contact us.</p>
            <p>See you soon!<br>Camp Elim Africa Team</p>
        `
    },
    promotion: {
        subject: 'Special Offer Just for You - Camp Elim Africa',
        body: `
            <p>Dear {{name}},</p>
            <p>We have an exciting offer just for you!</p>
            <p>Book your next event at Camp Elim Africa and enjoy special discounts on our premium facilities.</p>
            <p>Don't miss out on this limited-time opportunity!</p>
            <p>Book now at <a href="https://campelim.africa">campelim.africa</a></p>
            <p>Best regards,<br>Camp Elim Africa Team</p>
        `
    },
    thankyou: {
        subject: 'Thank You for Choosing Camp Elim Africa!',
        body: `
            <p>Dear {{name}},</p>
            <p>Thank you for choosing Camp Elim Africa for your event!</p>
            <p>We hope you had a wonderful experience with us. Your satisfaction is our top priority.</p>
            <p>We would love to host you again in the future. Feel free to share your experience with friends and family!</p>
            <p>With gratitude,<br>Camp Elim Africa Team</p>
        `
    }
};

// Wrap HTML email content
function wrapEmailHtml(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; }
        .header { background: linear-gradient(135deg, #1F2937 0%, #374151 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
        .content { padding: 30px; }
        .content p { margin: 16px 0; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }
        .footer p { margin: 8px 0; color: #6b7280; font-size: 12px; }
        .footer a { color: #F59E0B; text-decoration: none; }
        a { color: #3B82F6; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Camp Elim Africa</h1>
            <p>Your Premier Event & Retreat Destination</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>Camp Elim Africa | Ghana</p>
            <p style="display: flex; align-items: center; justify-content: center; gap: 20px;">
                <span style="display: flex; align-items: center; gap: 5px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    +233 27 993 1941
                </span>
                <span style="display: flex; align-items: center; gap: 5px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    info@campelim.africa
                </span>
            </p>
            <p><a href="https://campelim.africa">www.campelim.africa</a></p>
        </div>
    </div>
</body>
</html>
    `;
}

export async function POST(request: Request) {
    try {
        const body: SendEmailRequest = await request.json();
        const { recipients, subject, message, template } = body;

        if (!recipients || recipients.length === 0) {
            return NextResponse.json(
                { error: 'No recipients specified' },
                { status: 400 }
            );
        }

        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return NextResponse.json(
                { error: 'SMTP not configured' },
                { status: 500 }
            );
        }

        let emailSubject = subject;
        let emailBody = message;

        // Use template if specified
        if (template && templates[template]) {
            emailSubject = templates[template].subject;
            emailBody = templates[template].body;
        }

        const results = {
            sent: 0,
            failed: 0,
            errors: [] as string[]
        };

        // Send emails to each recipient
        for (const recipient of recipients) {
            try {
                // Replace placeholders
                const personalizedBody = emailBody
                    .replace(/\{\{name\}\}/g, recipient.name)
                    .replace(/\{\{email\}\}/g, recipient.email);

                const personalizedSubject = emailSubject
                    .replace(/\{\{name\}\}/g, recipient.name);

                await transporter.sendMail({
                    from: `"Camp Elim Africa" <${process.env.SMTP_USER}>`,
                    to: recipient.email,
                    subject: personalizedSubject,
                    html: wrapEmailHtml(personalizedBody),
                });

                results.sent++;
            } catch (error: any) {
                results.failed++;
                results.errors.push(`${recipient.email}: ${error.message}`);
            }
        }

        console.log(`[Communication] Sent ${results.sent} emails, ${results.failed} failed`);

        return NextResponse.json({
            success: true,
            message: `Sent ${results.sent} emails successfully${results.failed > 0 ? `, ${results.failed} failed` : ''}`,
            results
        });

    } catch (error: any) {
        console.error('Send email error:', error);
        return NextResponse.json(
            { error: 'Failed to send emails', details: error.message },
            { status: 500 }
        );
    }
}
