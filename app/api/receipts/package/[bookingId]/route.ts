import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsPDF } from 'jspdf';
import path from 'path';
import fs from 'fs';

// Helper to load image as base64 - works in both local and Vercel environments
async function loadImageAsBase64(imagePath: string): Promise<string | null> {
    try {
        // Try to load from file system first (works locally)
        const absolutePath = path.join(process.cwd(), 'public', imagePath);
        if (fs.existsSync(absolutePath)) {
            const imageBuffer = fs.readFileSync(absolutePath);
            const base64 = imageBuffer.toString('base64');
            const ext = path.extname(imagePath).toLowerCase().replace('.', '');
            return `data:image/${ext};base64,${base64}`;
        }

        // If file not found locally, try to fetch from public URL (for Vercel)
        let baseUrl = 'http://localhost:3000';
        if (process.env.NEXTAUTH_URL) {
            baseUrl = process.env.NEXTAUTH_URL;
        } else if (process.env.VERCEL_URL) {
            baseUrl = `https://${process.env.VERCEL_URL}`;
        }

        const response = await fetch(`${baseUrl}${imagePath}`);
        if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            const ext = path.extname(imagePath).toLowerCase().replace('.', '');
            return `data:image/${ext};base64,${base64}`;
        }
    } catch (error) {
        console.error('Failed to load image:', imagePath, error);
    }
    return null;
}

interface ReceiptData {
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
    penalty?: number;
}

async function generateReceiptPDF(data: ReceiptData): Promise<Buffer> {
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

    // Colors - Matching Client Receipt (Blue Theme)
    const primaryBlue: [number, number, number] = [59, 130, 246];
    const darkText: [number, number, number] = [31, 41, 55];
    const grayText: [number, number, number] = [107, 114, 128];
    const lightGray: [number, number, number] = [245, 247, 250];
    const greenText: [number, number, number] = [16, 185, 129];
    const borderGray: [number, number, number] = [229, 231, 235];

    // ============ HEADER ============
    const logoBase64 = await loadImageAsBase64('/logo.PNG');
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, y, 40, 16, undefined, 'FAST');
        } catch {
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text('Camp Elim Africa', margin, y + 10);
        }
    } else {
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(37, 99, 235);
        doc.text('Camp Elim Africa', margin, y + 10);
    }

    // Right side header
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('PAYMENT RECEIPT', pageWidth - margin, y + 3, { align: 'right' });

    y += 18;

    // Contact and receipt info
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text('CampElimAfrica, Ghana', margin, y);
    doc.text(`Receipt #: ${data.reference}`, pageWidth - margin, y, { align: 'right' });

    y += 4;
    doc.text('emily@campelimafrica.org     +233 539770722', margin, y);
    doc.text(`Date: ${data.paymentDate}`, pageWidth - margin, y, { align: 'right' });

    y += 8;

    // Thin divider
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
    const billedHeight = data.organization ? 32 : 28;
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

    y += 4;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text(data.email, margin + 6, y);

    y += 4;
    doc.text(data.phone, margin + 6, y);

    if (data.organization) {
        y += 4;
        doc.text(data.organization, margin + 6, y);
    }

    y += 12;

    // ============ BOOKING DETAILS ============
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('BOOKING DETAILS', margin, y);

    y += 8;

    // Three columns
    const col1 = margin;
    const col2 = margin + 55;
    const col3 = margin + 115;

    // Labels row
    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');
    doc.text('EVENT TYPE', col1, y);
    doc.text('EVENT DATE', col2, y);
    doc.text('TIME & DURATION', col3, y);

    y += 4;

    // Values row
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(data.eventType.charAt(0).toUpperCase() + data.eventType.slice(1), col1, y);
    doc.text(data.eventDate, col2, y);
    doc.text(`${data.startTime} • ${data.duration}`, col3, y); // 'hours' is already in data.duration

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

    // Table header
    doc.setFillColor(...lightGray);
    doc.rect(margin, y, contentWidth, 7, 'F');

    y += 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('DESCRIPTION', margin + 4, y);
    doc.text('AMOUNT', pageWidth - margin - 4, y, { align: 'right' });

    y += 6;

    // Items list
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
        doc.setTextColor(220, 38, 38); // Red color for penalty
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text(`  + Late Booking Penalty`, margin + 4, y);
        doc.text(`GHS ${data.penalty.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, y, { align: 'right' });
        y += 5;
        doc.setFont('helvetica', 'normal');
    }

    y += 4;

    // ============ STAMP (centered) ============
    const stampBase64 = await loadImageAsBase64('/stamp.PNG');
    if (stampBase64) {
        try {
            doc.addImage(stampBase64, 'PNG', pageWidth / 2 - 20, y - 30, 40, 40, undefined, 'FAST');
        } catch (e) {
            console.error('Failed to add stamp:', e);
        }
    }

    // ============ TOTAL ============
    const totalsX = pageWidth - margin - 65;

    y += 6;

    // Total Paid Box
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

    // Payment details
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
    doc.text('Thank you for choosing Camp Elim Africa!', centerX, footerY, { align: 'center' });
    doc.text('This is an electronically generated receipt and does not require a signature.', centerX, footerY + 4, { align: 'center' });

    const now = new Date();
    const generatedText = `Generated on ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    doc.setFontSize(7);
    doc.text(generatedText, centerX, footerY + 8, { align: 'center' });

    return Buffer.from(doc.output('arraybuffer'));
}

// GET - Generate receipt PDF for package booking
export async function GET(
    request: Request,
    { params }: { params: Promise<{ bookingId: string }> }
) {
    try {
        const resolvedParams = await params;
        const id = parseInt(resolvedParams.bookingId);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
        }

        // Fetch package booking from database using Prisma Client
        const booking = await prisma.packageBooking.findUnique({
            where: { id },
            include: {
                package: true,
                addOns: true
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Calculate prices
        const totalAmount = Number(booking.totalAmount);

        // Calculate prices server-side for accuracy
        const packageBasePrice = parseFloat(booking.package.price.replace(/[^\d.]/g, '')) || 0;
        const baseDuration = parseInt(booking.package.duration) || 4;
        const hourlyRate = packageBasePrice / baseDuration;
        const enteredDuration = parseFloat(booking.duration) || baseDuration;
        const packagePrice = Math.round(hourlyRate * enteredDuration);

        const addOns = booking.addOns.map(addon => ({
            name: addon.name,
            price: Number(addon.price)
        }));

        const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);

        // Package price effectively paid (Total without penalty - Addons)
        const subtotal = (packagePrice + addOnsTotal);
        const penalty = totalAmount - subtotal;

        // Build receipt data
        const receiptData: ReceiptData = {
            reference: booking.reference,
            customerName: `${booking.firstName} ${booking.lastName}`,
            email: booking.email,
            phone: booking.phone,
            organization: booking.organization || undefined,
            eventType: booking.eventType,
            eventName: undefined, // PackageBooking doesn't have eventName in schema
            eventDate: new Date(booking.eventDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            startTime: booking.startTime,
            duration: `${booking.duration} hours`, // Added "hours" as requested
            facilities: [{
                name: `${booking.package.name} (${booking.duration} hours)`,
                price: packagePrice
            }],
            addOns: addOns.length > 0 ? addOns : undefined,
            subtotal: subtotal,
            totalAmount: totalAmount,
            penalty: penalty > 0 ? penalty : undefined,
            paymentMethod: booking.paymentMethod,
            paymentDate: new Date(booking.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            transactionId: undefined
        };

        // Generate PDF
        const pdfBuffer = await generateReceiptPDF(receiptData);

        // Return PDF with download headers
        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="receipt-${booking.reference}.pdf"`,
                'Content-Length': pdfBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('Error generating package receipt:', error);
        return NextResponse.json(
            { error: 'Failed to generate receipt' },
            { status: 500 }
        );
    }
}
