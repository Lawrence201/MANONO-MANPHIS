import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendReceiptToClient } from '@/lib/sendEmail';
import { jsPDF } from 'jspdf';
import path from 'path';
import fs from 'fs';

interface ReceiptRequest {
    bookingId: number;
    reference: string;
    customerName: string;
    email: string;
    phone: string;
    organization?: string;
    eventType: string;
    eventName?: string;
    eventDate: string;
    startTime: string;
    duration: string;
    facilities: Array<{ name: string; price: number }>;
    addOns?: Array<{ name: string; price: number }>;
    subtotal: number;
    totalAmount: number;
    paymentMethod: string;
    paymentDate: string;
    transactionId?: string;
    facilityType?: 'Hall' | 'Hostel' | 'Package';
    penalty?: number;
}

// Helper to load image as base64 - works in both local and Vercel environments
async function loadImageAsBase64(imagePath: string): Promise<string | null> {
    try {
        // Try to load from file system first (works locally)
        const absolutePath = path.join(process.cwd(), 'public', imagePath);
        if (fs.existsSync(absolutePath)) {
            const imageBuffer = fs.readFileSync(absolutePath);
            const base64 = imageBuffer.toString('base64');
            const ext = path.extname(imagePath).toLowerCase().replace('.', '');
            return `data:image/${ext === 'png' ? 'png' : ext};base64,${base64}`;
        }

        // If file not found locally, try to fetch from public URL (for Vercel)
        let baseUrl = 'http://localhost:3000';
        if (process.env.NEXTAUTH_URL) {
            baseUrl = process.env.NEXTAUTH_URL;
        } else if (process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`;
        }

        // Try the original path first, then try uppercase PNG
        const pathsToTry = [imagePath];
        if (imagePath.toLowerCase().endsWith('.png')) {
            pathsToTry.push(imagePath.replace(/\.png$/i, '.png'));
        }

        for (const tryPath of pathsToTry) {
            console.log('Trying to load image from:', `${baseUrl}${tryPath}`);
            const response = await fetch(`${baseUrl}${tryPath}`);
            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                const base64 = Buffer.from(arrayBuffer).toString('base64');
                const ext = path.extname(tryPath).toLowerCase().replace('.', '');
                console.log('Successfully loaded image:', tryPath);
                return `data:image/${ext === 'png' ? 'png' : ext};base64,${base64}`;
            } else {
                console.log('Failed to fetch:', tryPath, response.status);
            }
        }
        console.error('All image paths failed');
    } catch (error) {
        console.error('Failed to load image:', imagePath, error);
    }
    return null;
}

async function generateReceiptPDF(data: ReceiptRequest): Promise<Buffer> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - (margin * 2);
    let y = 15;

    // Colors
    const primaryBlue: [number, number, number] = [59, 130, 246];
    const darkText: [number, number, number] = [31, 41, 55];
    const grayText: [number, number, number] = [107, 114, 128];
    const lightGray: [number, number, number] = [245, 247, 250];
    const greenText: [number, number, number] = [16, 185, 129];
    const borderGray: [number, number, number] = [229, 231, 235];

    // ============ HEADER ============
    const logoBase64 = await loadImageAsBase64('/logo.png');
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, y, 40, 16, undefined, 'FAST');
        } catch (e) {
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text('Monophis', margin, y + 10);
        }
    } else {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Monophis', margin, y + 10);
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    // Use accommodation-specific wording for hostels
    const receiptTitle = data.facilityType === 'Hostel' ? 'ACCOMMODATION RECEIPT' : 'PAYMENT RECEIPT';
    doc.text(receiptTitle, pageWidth - margin, y + 3, { align: 'right' });

    y += 18;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text('Monophis, Ghana', margin, y);
    doc.text(`Receipt #: ${data.reference}`, pageWidth - margin, y, { align: 'right' });

    y += 4;
    doc.text('emily@Monophis.org     +233 539770722', margin, y);
    doc.text(`Date: ${data.paymentDate}`, pageWidth - margin, y, { align: 'right' });

    y += 8;

    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);

    y += 12;

    // ============ PAYMENT CONFIRMED ============
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('P A Y M E N T   C O N F I R M E D', pageWidth / 2, y, { align: 'center' });

    y += 12;

    // ============ BILLED TO ============
    doc.setFillColor(...lightGray);
    const billedHeight = data.organization ? 36 : 32;
    doc.roundedRect(margin, y, contentWidth, billedHeight, 2, 2, 'F');

    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('BILLED TO', margin + 6, y);

    y += 5;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text(data.customerName, margin + 6, y);

    y += 5;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text('Email:', margin + 6, y);
    doc.setTextColor(...darkText);
    doc.text(data.email, margin + 20, y);

    y += 4;
    doc.setTextColor(...grayText);
    doc.text('Phone:', margin + 6, y);
    doc.setTextColor(...darkText);
    doc.text(data.phone, margin + 20, y);

    if (data.organization) {
        y += 4;
        doc.setTextColor(...grayText);
        doc.text('Group:', margin + 6, y);
        doc.setTextColor(...darkText);
        doc.text(data.organization, margin + 20, y);
    }

    y += 12;

    // ============ BOOKING DETAILS ============
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    // Use accommodation-specific wording for hostels
    const sectionTitle = data.facilityType === 'Hostel' ? 'ACCOMMODATION DETAILS' : 'BOOKING DETAILS';
    doc.text(sectionTitle, margin, y);

    y += 8;

    const col1 = margin;
    const col2 = margin + 55;
    const col3 = margin + 115;

    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');

    // Use accommodation-specific column headers for hostels
    if (data.facilityType === 'Hostel') {
        doc.text('CHECK-IN DATE', col1, y);
        doc.text('CHECK-IN TIME', col2, y);
        doc.text('DURATION', col3, y);
    } else {
        doc.text('EVENT TYPE', col1, y);
        doc.text('EVENT DATE', col2, y);
        doc.text('TIME & DURATION', col3, y);
    }

    y += 4;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);

    // Format values based on facility type
    let displayDuration = data.duration;
    // If duration is strictly numeric (or numeric string), append the unit
    if (data.duration && /^\d+(\.\d+)?$/.test(data.duration.toString().trim())) {
        const num = parseFloat(data.duration.toString().trim());
        const unit = data.facilityType === 'Hostel' ? 'Day' : 'Hour';
        displayDuration = `${num} ${unit}${num !== 1 ? 's' : ''}`;
    }

    if (data.facilityType === 'Hostel') {
        doc.text(data.eventDate, col1, y);  // Check-in date
        doc.text(data.startTime, col2, y);   // Check-in time
        doc.text(displayDuration, col3, y);    // Duration
    } else {
        doc.text(data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1), col1, y);
        doc.text(data.eventDate, col2, y);
        doc.text(`${data.startTime} • ${displayDuration}`, col3, y);
    }

    if (data.eventName) {
        y += 7;
        doc.setFontSize(7);
        doc.setTextColor(...grayText);
        doc.text('EVENT NAME', col1, y);
        y += 4;
        doc.setFontSize(9);
        doc.setTextColor(...darkText);
        doc.text(data.eventName, col1, y);
    }

    y += 12;

    // ============ ITEMS TABLE ============
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('ITEMS', margin, y);

    y += 6;

    doc.setFillColor(...lightGray);
    doc.rect(margin, y, contentWidth, 7, 'F');

    y += 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('DESCRIPTION', margin + 4, y);
    doc.text('AMOUNT', pageWidth - margin - 4, y, { align: 'right' });

    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.setFontSize(9);

    data.facilities.forEach((facility) => {
        doc.text(facility.name, margin + 4, y);
        doc.text(`GHS ${facility.price.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, y, { align: 'right' });
        y += 6;
    });

    if (data.addOns && data.addOns.length > 0) {
        doc.setTextColor(...grayText);
        doc.setFontSize(8);
        data.addOns.forEach((addon) => {
            doc.text(`  + ${addon.name}`, margin + 4, y);
            doc.text(`GHS ${addon.price.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, y, { align: 'right' });
            y += 5;
        });
    }

    if (data.penalty && data.penalty > 0) {
        doc.setTextColor(220, 38, 38);
        doc.setFontSize(8);
        doc.text(`  + Late Booking Penalty`, margin + 4, y);
        doc.text(`GHS ${data.penalty.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, y, { align: 'right' });
        y += 5;
        doc.setTextColor(...darkText);
    }

    y += 4;

    // ============ STAMP ============
    const stampBase64 = await loadImageAsBase64('/stamp.png');
    console.log('Stamp loaded:', stampBase64 ? 'SUCCESS' : 'FAILED');
    if (stampBase64) {
        try {
            doc.addImage(stampBase64, 'PNG', pageWidth / 2 - 20, y - 30, 40, 40, undefined, 'FAST');
            console.log('Stamp added to PDF successfully');
        } catch (e) {
            console.error('Failed to add stamp image:', e);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(16, 185, 129);
            doc.text('PAID ✓', pageWidth / 2, y - 10, { align: 'center' });
        }
    } else {
        console.log('Stamp image not loaded, adding fallback text');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(16, 185, 129);
        doc.text('PAID ✓', pageWidth / 2, y - 10, { align: 'center' });
    }

    // ============ TOTAL ============
    const totalsX = pageWidth - margin - 65;

    y += 6;

    doc.setFillColor(...primaryBlue);
    doc.roundedRect(totalsX - 3, y - 4, 68, 12, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('TOTAL PAID', totalsX, y + 3);
    doc.text(`GHS ${data.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, y + 3, { align: 'right' });

    y += 20;

    // ============ PAYMENT INFORMATION ============
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('PAYMENT INFORMATION', margin, y);

    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    doc.setTextColor(...grayText);
    doc.text('Payment Method:', margin, y);
    doc.setTextColor(...darkText);
    doc.text(data.paymentMethod, margin + 35, y);

    y += 5;
    doc.setTextColor(...grayText);
    doc.text('Status:', margin, y);
    doc.setTextColor(...greenText);
    doc.setFont('helvetica', 'bold');
    doc.text('Paid', margin + 35, y);

    if (data.transactionId) {
        y += 5;
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...grayText);
        doc.text('Transaction ID:', margin, y);
        doc.setTextColor(...darkText);
        doc.text(data.transactionId, margin + 35, y);
    }

    // ============ FOOTER ============
    const footerY = pageHeight - 18;

    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');

    const centerX = pageWidth / 2;
    doc.text('Thank you for choosing Monophis!', centerX, footerY, { align: 'center' });
    doc.text('This is an electronically generated receipt and does not require a signature.', centerX, footerY + 4, { align: 'center' });

    const now = new Date();
    const generatedText = `Generated on ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    doc.setFontSize(7);
    doc.text(generatedText, centerX, footerY + 8, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
}

export async function POST(request: Request) {
    try {
        const data: ReceiptRequest = await request.json();

        console.log('Generating receipt for booking:', data.bookingId, data.reference);

        // Generate PDF
        const pdfBuffer = await generateReceiptPDF(data);

        // Optional storage steps (Cloudinary and DB update)
        // We wrap this so a failure here doesn't prevent the email from being sent
        let receiptPath = '';
        try {
            // Upload to Cloudinary
            const cloudinary = await import('cloudinary');

            cloudinary.v2.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            // Convert buffer to base64 data URI for Cloudinary upload
            const base64PDF = pdfBuffer.toString('base64');
            const dataURI = `data:application/pdf;base64,${base64PDF}`;

            const uploadResult = await cloudinary.v2.uploader.upload(dataURI, {
                folder: 'receipts',
                public_id: `receipt-${data.reference}`,
                resource_type: 'raw',
                format: 'pdf',
                access_mode: 'public',
                type: 'upload'
            });

            console.log('Receipt uploaded to Cloudinary:', uploadResult.secure_url);
            receiptPath = uploadResult.secure_url;

            // Update booking with Cloudinary URL based on facility type
            const facilityType = data.facilityType || 'Hall';

            try {
                if (facilityType === 'Hostel') {
                    await prisma.hostelBooking.update({
                        where: { id: data.bookingId },
                        data: { receiptPath }
                    });
                } else if (facilityType === 'Package') {
                    await prisma.packageBooking.update({
                        where: { id: data.bookingId },
                        data: { receiptPath }
                    });
                } else {
                    // Default to Hall
                    await prisma.hallBooking.update({
                        where: { id: data.bookingId },
                        data: { receiptPath }
                    });
                }
                console.log(`Database updated (${facilityType}) with receipt URL:`, receiptPath);
            } catch (dbError: any) {
                console.error(`Failed to update ${facilityType} booking with receipt URL:`, dbError.message);
            }
        } catch (storageError: any) {
            console.error('Storage/Cloudinary Error (Non-blocking):', storageError.message);
        }

        // Send receipt to client's email (async, non-blocking)
        // Pass the PDF buffer directly so it's always attached
        sendReceiptToClient({
            reference: data.reference,
            customerName: data.customerName,
            email: data.email,
            facilityType: data.facilityType || 'Hall',
            facilityNames: data.facilities.map(f => f.name),
            eventDate: data.eventDate,
            totalAmount: data.totalAmount,
            pdfBuffer: pdfBuffer
        }).then(result => {
            if (result.success) {
                console.log('Receipt email sent to client:', data.email, 'PDF attached:', result.pdfAttached);
            } else {
                console.error('Failed to send receipt email:', result);
            }
        }).catch(err => console.error('Receipt email error:', err));

        return NextResponse.json({
            success: true,
            receiptPath,
            message: 'Receipt generated and uploaded successfully'
        });

    } catch (error: any) {
        console.error('Receipt generation error:', error);
        return NextResponse.json(
            { message: 'Failed to generate receipt', error: error.message },
            { status: 500 }
        );
    }
}
