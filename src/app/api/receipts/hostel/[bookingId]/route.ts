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
    checkInDate: string;
    checkInTime: string;
    duration: string;
    facilityName: string;
    numberOfRooms: number;
    guests: number;
    facilities: Array<{ name: string; price: number }>;
    addOns?: Array<{ name: string; price: number }>;
    subtotal: number;
    totalAmount: number;
    paymentMethod: string;
    paymentDate: string;
    transactionId?: string;
    penalty?: number;
}

async function generateHostelReceiptPDF(data: ReceiptData): Promise<Buffer> {
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
    const logoBase64 = await loadImageAsBase64('/logo.PNG');
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, y, 40, 16, undefined, 'FAST');
        } catch (e) {
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
    doc.text('ACCOMMODATION RECEIPT', pageWidth - margin, y + 3, { align: 'right' });

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
    doc.text('ACCOMMODATION DETAILS', margin, y);

    y += 8;

    // Three columns
    const col1 = margin;
    const col2 = margin + 55;
    const col3 = margin + 115;

    // Labels row
    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');
    doc.text('CHECK-IN DATE', col1, y);
    doc.text('CHECK-IN TIME', col2, y);
    doc.text('DURATION', col3, y);

    y += 4;

    // Values row
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(data.checkInDate, col1, y);
    doc.text(data.checkInTime, col2, y);
    doc.text(data.duration, col3, y);

    y += 10;

    // Second row - Rooms & Guests
    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.text('HOSTEL/ROOM TYPE', col1, y);
    doc.text('NUMBER OF ROOMS', col2, y);
    doc.text('GUESTS', col3, y);

    y += 4;
    doc.setFontSize(9);
    doc.setTextColor(...darkText);
    doc.text(data.facilityName, col1, y);
    doc.text(`${data.numberOfRooms} Room${data.numberOfRooms > 1 ? 's' : ''}`, col2, y);
    doc.text(`${data.guests} Guest${data.guests > 1 ? 's' : ''}`, col3, y);

    y += 14;

    // ============ STAMP (centered) ============
    const stampBase64 = await loadImageAsBase64('/stamp.PNG');
    if (stampBase64) {
        try {
            doc.addImage(stampBase64, 'PNG', pageWidth / 2 - 20, y - 10, 40, 40, undefined, 'FAST');
        } catch (e) {
            console.error('Failed to add stamp:', e);
        }
    }

    const totalsX = pageWidth - margin - 65;
    y += 10;

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

export async function GET(
    request: Request,
    { params }: { params: Promise<{ bookingId: string }> }
) {
    try {
        const { bookingId } = await params;
        const id = parseInt(bookingId, 10);

        if (isNaN(id)) {
            return NextResponse.json({ error: 'Invalid booking ID' }, { status: 400 });
        }

        // Fetch hostel booking from database
        const booking = await prisma.hostelBooking.findUnique({
            where: { id },
            include: {
                hostel: true,
                addOns: true
            }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Hostel booking not found' }, { status: 404 });
        }

        // Calculate prices
        const basePrice = parseFloat(booking.hostel?.price.replace(/[^0-9.]/g, '') || '0');
        const numberOfRooms = booking.numberOfRooms || 1;
        const numberOfDays = booking.numberOfDays || 1;
        const facilityPrice = basePrice * numberOfRooms * numberOfDays;

        const addOns = booking.addOns.map(a => ({
            name: a.name,
            price: Number(a.price)
        }));
        const addOnsTotal = addOns.reduce((sum, a) => sum + a.price, 0);

        const subtotal = facilityPrice + addOnsTotal;
        const totalAmount = parseFloat(String(booking.totalAmount));
        const penalty = totalAmount - subtotal;

        const receiptData: ReceiptData = {
            reference: booking.reference,
            customerName: `${booking.firstName} ${booking.lastName}`,
            email: booking.email,
            phone: booking.phone,
            organization: booking.institution || undefined,
            eventType: 'Accommodation',
            checkInDate: new Date(booking.checkInDate).toLocaleDateString('en-GB', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            checkInTime: booking.checkInTime || '3:00 PM',
            duration: `${numberOfDays} Night${numberOfDays > 1 ? 's' : ''}`,
            facilityName: booking.hostel?.name || 'Hostel',
            numberOfRooms: numberOfRooms,
            guests: booking.guests || 1,
            facilities: [{
                name: `${booking.hostel?.name} (${numberOfRooms} Room${numberOfRooms > 1 ? 's' : ''} x ${numberOfDays} Night${numberOfDays > 1 ? 's' : ''})`,
                price: facilityPrice
            }],
            addOns: addOns.length > 0 ? addOns : undefined,
            subtotal,
            totalAmount,
            penalty: penalty > 0 ? penalty : undefined,
            paymentMethod: booking.paymentMethod || 'Online Payment',
            paymentDate: new Date(booking.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        };

        // Generate PDF
        const pdfBuffer = await generateHostelReceiptPDF(receiptData);

        // Return PDF with download headers
        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="hostel-receipt-${booking.reference}.pdf"`,
                'Content-Length': pdfBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error('Error generating hostel receipt:', error);
        return NextResponse.json(
            { error: 'Failed to generate receipt' },
            { status: 500 }
        );
    }
}
