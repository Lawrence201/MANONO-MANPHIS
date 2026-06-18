import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

// Helper to get fresh transporter
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS?.replace(/[\s"']/g, ''),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 30000,
  });
}

// ----------------------------------------------------------------------------------
// 1. BILLBOARD BOOKING CONFIRMATION
// ----------------------------------------------------------------------------------

type BillboardBookingEmailData = {
  clientEmail: string;
  clientName: string;
  phone: string;
  campaignTitle: string;
  billboardName: string;
  startDate: string;
  endDate: string;
  duration: string;
  totalPrice: number;
};

export async function sendBillboardBookingEmail(data: BillboardBookingEmailData) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('[Email] SMTP credentials missing.');
      return { success: false, error: 'SMTP credentials missing' };
    }

    const transporter = getTransporter();
    
    const subject = `Booking Confirmed: ${data.campaignTitle}`;
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #2563eb; padding: 30px 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700;">Booking Request Received!</h2>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #bfdbfe;">Campaign: ${data.campaignTitle}</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px 20px;">
          <p style="color: #374151; font-size: 16px; margin-top: 0;">Dear <strong>${data.clientName}</strong>,</p>
          <p style="color: #4b5563; font-size: 15px; line-height: 1.5;">Your billboard booking has been successfully received and is currently being processed by our team.</p>
          
          <!-- Customer Details Card -->
          <div style="background-color: white; border-radius: 8px; padding: 25px; margin-top: 25px; margin-bottom: 20px; border: 1px solid #f3f4f6; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #374151;">Your Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; width: 35%; border-bottom: 1px solid #f3f4f6;">Name:</td>
                <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${data.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Email:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                  <a href="mailto:${data.clientEmail}" style="color: #2563eb; text-decoration: none;">${data.clientEmail}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Phone:</td>
                <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${data.phone}</td>
              </tr>
            </table>
          </div>

          <!-- Booking Details Card -->
          <div style="background-color: white; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #f3f4f6; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #374151;">Booking Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; width: 35%; border-bottom: 1px solid #f3f4f6;">Billboard:</td>
                <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${data.billboardName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Start Date:</td>
                <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${new Date(data.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; border-bottom: 1px solid #f3f4f6;">End Date:</td>
                <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${new Date(data.endDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Duration:</td>
                <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${data.duration}</td>
              </tr>
              <tr>
                <td style="padding: 20px 0 5px 0; color: #6b7280; font-weight: 500;">Amount:</td>
                <td style="padding: 20px 0 5px 0; color: #10b981; font-size: 22px; font-weight: bold;">GH₵ ${data.totalPrice.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <p style="color: #4b5563; font-size: 14px; text-align: center;">Thank you for choosing Manono Manphis. We will be in touch shortly.</p>

        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; background-color: #f8fafc; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 5px 0;">Manono Manphis System</p>
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} Manono Manphis. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Manono Manphis" <${process.env.SMTP_USER}>`,
      to: data.clientEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log('[Email] Billboard Booking Email Sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed to send billboard booking email:', error);
    return { success: false, error: String(error) };
  }
}

// ----------------------------------------------------------------------------------
// 2. ORDER RECEIPT EMAIL (SHOPPING CART)
// ----------------------------------------------------------------------------------

type OrderEmailData = {
  clientEmail: string;
  clientName: string;
  orderId: string;
  itemsCount: number;
  totalPrice: number;
  deliveryAddress: string;
};

export async function sendOrderReceiptEmail(data: OrderEmailData) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('[Email] SMTP credentials missing.');
      return { success: false, error: 'SMTP credentials missing' };
    }

    const transporter = getTransporter();
    
    const subject = `Order Confirmation: #${data.orderId}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #10b981; padding: 20px; text-align: center; color: white;">
          <h2 style="margin: 0;">Manono Manphis Logistics</h2>
        </div>
        <div style="padding: 20px; background-color: #f9fafb;">
          <p>Dear <strong>${data.clientName}</strong>,</p>
          <p>Thank you for your purchase! We've received your order and are getting it ready for shipment.</p>
          
          <div style="background-color: white; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <p style="margin: 5px 0;"><strong>Order ID:</strong> #${data.orderId}</p>
            <p style="margin: 5px 0;"><strong>Items:</strong> ${data.itemsCount}</p>
            <p style="margin: 5px 0;"><strong>Total Paid:</strong> GH₵ ${data.totalPrice.toLocaleString()}</p>
            <p style="margin: 5px 0;"><strong>Delivery Address:</strong> ${data.deliveryAddress}</p>
          </div>
          
          <p>We'll notify you once your package is on its way.</p>
        </div>
        <div style="text-align: center; padding: 15px; font-size: 12px; color: #6b7280; background-color: white;">
          <p>&copy; ${new Date().getFullYear()} Manono Manphis. All rights reserved.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Manono Manphis" <${process.env.SMTP_USER}>`,
      to: data.clientEmail,
      subject: subject,
      html: htmlContent,
    });

    console.log('[Email] Order Receipt Email Sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed to send order receipt email:', error);
    return { success: false, error: String(error) };
  }
}

// ----------------------------------------------------------------------------------
// 3. ADMIN NOTIFICATION EMAIL
// ----------------------------------------------------------------------------------

type AdminNotificationData = {
  type: 'Billboard Booking' | 'Product Order';
  reference: string;
  clientName: string;
  clientEmail: string;
  phone?: string;
  details: string;
  totalPrice: number;
};

export async function sendAdminNotificationEmail(data: AdminNotificationData) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return { success: false, error: 'SMTP credentials missing' };
    }

    // Fetch all admin emails from the database
    const admins = await prisma.admin.findMany({ select: { email: true } });
    if (!admins || admins.length === 0) {
      console.warn('[Email] No admins found in database to notify.');
      return { success: false, error: 'No admins found' };
    }

    const adminEmails = admins.map(a => a.email).filter(Boolean);
    const transporter = getTransporter();
    
    const detailsList = data.details.split('|').map(d => d.trim());
    const detailsRows = detailsList.map(detail => {
      const [label, ...val] = detail.split(':');
      const value = val.join(':').trim();
      return `
        <tr>
          <td style="padding: 12px 0; color: #6b7280; font-weight: 500; width: 35%; border-bottom: 1px solid #f3f4f6;">${label ? label.trim() : ''}:</td>
          <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${value ? value : ''}</td>
        </tr>
      `;
    }).join('');

    const phoneRow = data.phone ? `
      <tr>
        <td style="padding: 12px 0; color: #6b7280; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Phone:</td>
        <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${data.phone}</td>
      </tr>
    ` : '';

    const subject = `New ${data.type} Alert: ${data.reference}`;
    const htmlContent = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <!-- Header -->
        <div style="background-color: #333d4b; padding: 30px 20px; text-align: center; color: white;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 700;">New ${data.type} Request!</h2>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #cbd5e1;">Reference: ${data.reference}</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px 20px;">
          
          <!-- Customer Details Card -->
          <div style="background-color: white; border-radius: 8px; padding: 25px; margin-bottom: 20px; border: 1px solid #f3f4f6; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #374151;">Customer Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; width: 35%; border-bottom: 1px solid #f3f4f6;">Name:</td>
                <td style="padding: 12px 0; color: #111827; border-bottom: 1px solid #f3f4f6;">${data.clientName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-weight: 500; border-bottom: 1px solid #f3f4f6;">Email:</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #f3f4f6;">
                  <a href="mailto:${data.clientEmail}" style="color: #2563eb; text-decoration: none;">${data.clientEmail}</a>
                </td>
              </tr>
              ${phoneRow}
            </table>
          </div>

          <!-- Booking/Order Details Card -->
          <div style="background-color: white; border-radius: 8px; padding: 25px; margin-bottom: 30px; border: 1px solid #f3f4f6; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
            <h3 style="margin: 0 0 15px 0; font-size: 16px; color: #374151;">Request Details</h3>
            <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
              ${detailsRows}
              <tr>
                <td style="padding: 20px 0 5px 0; color: #6b7280; font-weight: 500;">Amount:</td>
                <td style="padding: 20px 0 5px 0; color: #10b981; font-size: 22px; font-weight: bold;">GH₵ ${data.totalPrice.toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <!-- Button -->
          <div style="text-align: center;">
            <a href="https://www.manonomanphis.com/inventory" style="display: inline-block; background-color: #10b981; color: white; padding: 14px 30px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
              View Dashboard &rarr;
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #9ca3af; background-color: #f8fafc; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 5px 0;">Manono Manphis System</p>
          <p style="margin: 0;">This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Manono System" <${process.env.SMTP_USER}>`,
      to: adminEmails,
      subject: subject,
      html: htmlContent,
    });

    console.log('[Email] Admin Notification Sent to:', adminEmails.join(', '));
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed to send admin notification:', error);
    return { success: false, error: String(error) };
  }
}
