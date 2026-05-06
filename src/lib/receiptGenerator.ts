import { jsPDF } from 'jspdf';
// Dynamic imports for Node.js modules to avoid bundle errors in browser
const getFs = () => {
    try {
        return eval('require("fs")');
    } catch (e) {
        return null;
    }
};
const getPath = () => {
    try {
        return eval('require("path")');
    } catch (e) {
        return null;
    }
};

interface BookingReceiptData {
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
    facilityType?: 'Hall' | 'Lodge' | 'Package';
    penalty?: number;
}

export interface PendingRequestData {
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
    facilities: Array<{ name: string; price?: number }>;
    addOns?: Array<{ name: string; price?: number }>;
    requestDate: string;
    facilityType?: 'Hall' | 'Lodge' | 'Package';
    penalty?: number;
    totalAmount: number;
}

// Helper to load image and convert to base64
async function loadImageAsBase64(imagePath: string): Promise<string | null> {
    try {
        // Server-side loading
        if (typeof window === 'undefined') {
            const fs = getFs();
            const path = getPath();

            if (fs && path) {
                const absolutePath = path.join(process.cwd(), 'public', imagePath.startsWith('/') ? imagePath.slice(1) : imagePath);
                if (fs.existsSync(absolutePath)) {
                    const buffer = fs.readFileSync(absolutePath);
                    const extension = path.extname(absolutePath).slice(1).toLowerCase();
                    const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg';
                    return `data:${mimeType};base64,${buffer.toString('base64')}`;
                }
                console.error('File not found on server:', absolutePath);
            } else {
                console.error('fs or path module not available on server.');
            }
            return null;
        }

        // Client-side loading
        const response = await fetch(imagePath);
        if (!response.ok) return null;
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Failed to load image:', imagePath, error);
        return null;
    }
}

export async function generateBookingReceipt(data: BookingReceiptData): Promise<void> {
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

    // Load images
    const [logoBase64, stampBase64] = await Promise.all([
        loadImageAsBase64('/logo.png'),
        loadImageAsBase64('/stamp.png')
    ]);

    // ============ HEADER ============
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, y, 40, 16);
        } catch (e) {
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text('Monophis', margin, y + 10);
        }
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    // Use accommodation-specific wording for lodges
    const receiptTitle = data.facilityType === 'Lodge' ? 'ACCOMMODATION RECEIPT' : 'PAYMENT RECEIPT';
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
    // Use accommodation-specific wording for lodges
    const sectionTitle = data.facilityType === 'Lodge' ? 'ACCOMMODATION DETAILS' : 'BOOKING DETAILS';
    doc.text(sectionTitle, margin, y);

    y += 8;

    const col1 = margin;
    const col2 = margin + 55;
    const col3 = margin + 115;

    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');

    // Use accommodation-specific column headers for lodges
    if (data.facilityType === 'Lodge') {
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
        const unit = data.facilityType === 'Lodge' ? 'Day' : 'Hour';
        displayDuration = `${num} ${unit}${num !== 1 ? 's' : ''}`;
    }

    if (data.facilityType === 'Lodge') {
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
    if (stampBase64) {
        try {
            doc.addImage(stampBase64, 'PNG', pageWidth / 2 - 20, y - 30, 40, 40);
        } catch (e) {
            console.error('Failed to add stamp:', e);
        }
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

    if (typeof window !== 'undefined') {
        doc.save(`CampElim-Receipt-${data.reference}.pdf`);
    }
}

export async function generatePendingRequestPDF(data: PendingRequestData): Promise<void> {
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
    const borderGray: [number, number, number] = [229, 231, 235];

    // Load logo
    const logoBase64 = await loadImageAsBase64('/logo.png');

    // ============ HEADER ============
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, y, 40, 16);
        } catch (e) {
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text('Monophis', margin, y + 10);
        }
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('BOOKING REQUEST', pageWidth - margin, y + 3, { align: 'right' });

    y += 18;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text('Monophis, Ghana', margin, y);
    doc.text(`Request #: ${data.reference}`, pageWidth - margin, y, { align: 'right' });

    y += 4;
    doc.text('emily@Monophis.org     +233 539770722', margin, y);
    doc.text(`Date: ${data.requestDate}`, pageWidth - margin, y, { align: 'right' });

    y += 8;

    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);

    y += 12;

    // ============ REQUEST SUBMITTED ============
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('B O O K I N G   R E Q U E S T   S U B M I T T E D', pageWidth / 2, y, { align: 'center' });

    y += 12;

    // ============ CLIENT DETAILS ============
    doc.setFillColor(...lightGray);
    const detailsHeight = data.organization ? 36 : 32;
    doc.roundedRect(margin, y, contentWidth, detailsHeight, 2, 2, 'F');

    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('CLIENT DETAILS', margin + 6, y);

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
    doc.text(data.facilityType === 'Lodge' ? 'ACCOMMODATION REQUEST' : 'BOOKING DETAILS', margin, y);

    y += 8;

    const col1 = margin;
    const col2 = margin + 55;
    const col3 = margin + 115;

    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');

    if (data.facilityType === 'Lodge') {
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

    let displayDuration = data.duration;
    if (data.duration && /^\d+(\.\d+)?$/.test(data.duration.toString().trim())) {
        const num = parseFloat(data.duration.toString().trim());
        const unit = data.facilityType === 'Lodge' ? 'Day' : 'Hour';
        displayDuration = `${num} ${unit}${num !== 1 ? 's' : ''}`;
    }

    if (data.facilityType === 'Lodge') {
        doc.text(data.eventDate, col1, y);
        doc.text(data.startTime, col2, y);
        doc.text(displayDuration, col3, y);
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

    // ============ REQUESTED ITEMS ============
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('REQUESTED FACILITIES', margin, y);

    y += 6;

    doc.setFillColor(...lightGray);
    doc.rect(margin, y, contentWidth, 7, 'F');

    y += 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('DESCRIPTION', margin + 4, y);

    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.setFontSize(9);

    data.facilities.forEach((facility) => {
        doc.text(facility.name, margin + 4, y);
        y += 6;
    });

    if (data.penalty && data.penalty > 0) {
        doc.setTextColor(220, 38, 38); // red-600
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(`+ Late Booking Penalty (Request made within 72h window)`, margin + 4, y);
        y += 7;
        doc.setTextColor(...darkText);
        doc.setFont('helvetica', 'normal');
    }

    if (data.addOns && data.addOns.length > 0) {
        y += 2;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...darkText);
        doc.text('REQUESTED ADD-ONS', margin, y);
        
        y += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        data.addOns.forEach((addon) => {
            doc.text(`- ${addon.name}`, margin + 4, y);
            y += 5;
        });
    }

    y += 12;

    // ============ NEXT STEPS ============
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    doc.text('WHAT HAPPENS NEXT?', margin, y);

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    const steps = [
        "1. Our team will review your booking request and verify availability.",
        "2. An initial invoice will be drafted and processed by our team.",
        "3. Our team will prepare the final invoice including taxes and send it to you.",
        "4. Your booking will be confirmed once payment is received."
    ];
    steps.forEach(step => {
        doc.text(step, margin + 4, y);
        y += 5;
    });

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
    doc.text('This is a formal request document and NOT a payment receipt or invoice.', centerX, footerY + 4, { align: 'center' });

    const generatedText = `Generated on ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-US')}`;
    doc.setFontSize(7);
    doc.text(generatedText, centerX, footerY + 8, { align: 'center' });

    if (typeof window !== 'undefined') {
        doc.save(`CampElim-Request-${data.reference}.pdf`);
    }
}

export async function generateInternalInvoiceData(data: BookingReceiptData): Promise<string> {
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
    const borderGray: [number, number, number] = [229, 231, 235];

    // Load images
    const logoBase64 = await loadImageAsBase64('/logo.png');

    // ============ HEADER ============
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, y, 40, 16);
        } catch (e) {
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text('Monophis', margin, y + 10);
        }
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('BOOKING INVOICE', pageWidth - margin, y + 3, { align: 'right' });

    y += 18;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text('Monophis, Ghana', margin, y);
    doc.text(`Reference #: ${data.reference}`, pageWidth - margin, y, { align: 'right' });

    y += 4;
    doc.text('emily@Monophis.org     +233 539770722', margin, y);
    doc.text(`Generated: ${data.paymentDate}`, pageWidth - margin, y, { align: 'right' });

    y += 8;

    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);

    y += 12;

    // ============ INVOICE TITLE ============
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    const invoiceTitle = `${(data.facilityType || 'Hall').toUpperCase()} BOOKING INVOICE`;
    doc.text(invoiceTitle.split('').join(' '), pageWidth / 2, y, { align: 'center' });

    y += 12;

    // ============ CUSTOMER DETAILS ============
    doc.setFillColor(...lightGray);
    const billedHeight = data.organization ? 36 : 32;
    doc.roundedRect(margin, y, contentWidth, billedHeight, 2, 2, 'F');

    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('CUSTOMER DETAILS', margin + 6, y);

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
    doc.text(data.facilityType === 'Lodge' ? 'ACCOMMODATION DETAILS' : 'BOOKING DETAILS', margin, y);

    y += 8;

    const col1 = margin;
    const col2 = margin + 55;
    const col3 = margin + 115;

    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');

    if (data.facilityType === 'Lodge') {
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

    let displayDuration = data.duration;
    if (data.duration && /^\d+(\.\d+)?$/.test(data.duration.toString().trim())) {
        const num = parseFloat(data.duration.toString().trim());
        const unit = data.facilityType === 'Lodge' ? 'Day' : 'Hour';
        displayDuration = `${num} ${unit}${num !== 1 ? 's' : ''}`;
    }

    if (data.facilityType === 'Lodge') {
        doc.text(data.eventDate, col1, y);
        doc.text(data.startTime, col2, y);
        doc.text(displayDuration, col3, y);
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
    doc.text('COST BREAKDOWN', margin, y);

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

    y += 10;

    // ============ TOTAL ============
    const totalsX = pageWidth - margin - 65;

    doc.setFillColor(...primaryBlue);
    doc.roundedRect(totalsX - 3, y - 4, 68, 12, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('ESTIMATED TOTAL', totalsX, y + 3);
    doc.text(`GHS ${data.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, y + 3, { align: 'right' });

    y += 25;

    // ============ FOOTER ============
    const footerY = pageHeight - 18;
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');
    const centerX = pageWidth / 2;
    doc.text(`Monophis - Internal ${data.facilityType || 'Hall'} Invoice`, centerX, footerY, { align: 'center' });
    doc.setFontSize(7);
    doc.text('Internal Copy', centerX, footerY + 4, { align: 'center' });

    // Return as base64
    return doc.output('datauristring').split(',')[1];
}

// Browser-side version of generateInternalInvoiceData that triggers a download
export const generateInternalInvoicePDF = async (data: BookingReceiptData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let y = margin;

    const primaryBlue: [number, number, number] = [37, 99, 235];
    const darkText: [number, number, number] = [31, 41, 55];
    const grayText: [number, number, number] = [107, 114, 128];
    const lightGray: [number, number, number] = [245, 247, 250];
    const borderGray: [number, number, number] = [229, 231, 235];

    // Load images
    const logoBase64 = await loadImageAsBase64('/logo.png');

    // ============ HEADER ============
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, y, 40, 16);
        } catch (e) {
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(37, 99, 235);
            doc.text('Monophis', margin, y + 10);
        }
    }

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('BOOKING INVOICE', pageWidth - margin, y + 3, { align: 'right' });

    y += 18;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text('Monophis, Ghana', margin, y);
    doc.text(`Reference #: ${data.reference}`, pageWidth - margin, y, { align: 'right' });

    y += 4;
    doc.text('emily@Monophis.org     +233 539770722', margin, y);
    doc.text(`Generated: ${data.paymentDate || formatReceiptDate(new Date())}`, pageWidth - margin, y, { align: 'right' });

    y += 8;

    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);

    y += 12;

    // ============ INVOICE TITLE ============
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkText);
    const invoiceTitle = `${(data.facilityType || 'Hall').toUpperCase()} BOOKING INVOICE`;
    doc.text(invoiceTitle.split('').join(' '), pageWidth / 2, y, { align: 'center' });

    y += 12;

    // ============ CUSTOMER DETAILS ============
    doc.setFillColor(...lightGray);
    const billedHeight = data.organization ? 36 : 32;
    doc.roundedRect(margin, y, contentWidth, billedHeight, 2, 2, 'F');

    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('CUSTOMER DETAILS', margin + 6, y);

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
    doc.text(data.facilityType === 'Lodge' ? 'ACCOMMODATION DETAILS' : 'BOOKING DETAILS', margin, y);

    y += 8;

    const col1 = margin;
    const col2 = margin + 55;
    const col3 = margin + 115;

    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');

    if (data.facilityType === 'Lodge') {
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

    let displayDuration = data.duration;
    if (data.duration && /^\d+(\.\d+)?$/.test(data.duration.toString().trim())) {
        const num = parseFloat(data.duration.toString().trim());
        const unit = data.facilityType === 'Lodge' ? 'Day' : 'Hour';
        displayDuration = `${num} ${unit}${num !== 1 ? 's' : ''}`;
    }

    if (data.facilityType === 'Lodge') {
        doc.text(data.eventDate, col1, y);
        doc.text(data.startTime, col2, y);
        doc.text(displayDuration, col3, y);
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
    doc.text('COST BREAKDOWN', margin, y);

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

    y += 10;

    // ============ TOTAL ============
    const totalsX = pageWidth - margin - 65;

    doc.setFillColor(...primaryBlue);
    doc.roundedRect(totalsX - 3, y - 4, 68, 12, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('ESTIMATED TOTAL', totalsX, y + 3);
    doc.text(`GHS ${data.totalAmount.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, y + 3, { align: 'right' });

    y += 25;

    // ============ FOOTER ============
    const footerY = pageHeight - 18;
    doc.setDrawColor(...borderGray);
    doc.setLineWidth(0.2);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

    doc.setFontSize(8);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');
    const centerX = pageWidth / 2;
    doc.text(`Monophis - Internal ${data.facilityType || 'Hall'} Invoice`, centerX, footerY, { align: 'center' });
    doc.setFontSize(7);
    doc.text('Internal Copy', centerX, footerY + 4, { align: 'center' });

    doc.save(`${(data.facilityType || 'Hall')}-Invoice-${data.reference}.pdf`);
};

export function formatReceiptDate(date: Date | string): string {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}
