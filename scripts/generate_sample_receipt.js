const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

// Helper to load image as base64
function loadImageAsBase64(imagePath) {
    try {
        const absolutePath = path.join(process.cwd(), 'public', imagePath);
        if (fs.existsSync(absolutePath)) {
            const imageBuffer = fs.readFileSync(absolutePath);
            const base64 = imageBuffer.toString('base64');
            const ext = path.extname(imagePath).toLowerCase().replace('.', '');
            return `data:image/${ext};base64,${base64}`;
        }
    } catch (error) {
        console.error('Failed to load image:', imagePath, error);
    }
    return null;
}

// Sample receipt data
const data = {
    reference: 'REF-2026-55623',
    customerName: 'Lawrence Antwi',
    email: 'lawrenceantwi@gmail.com',
    phone: '+233 54 123 4567',
    organization: 'A+ Softeck',
    eventType: 'Conference',
    eventName: 'Annual Leadership Summit',
    eventDate: '3 January 2026',
    startTime: '8:00 am',
    duration: '4',
    facilities: [
        { name: 'Eccelsia Hall', price: 8000 }
    ],
    addOns: [],
    subtotal: 8000,
    totalAmount: 8000,
    paymentMethod: 'Stripe',
    paymentDate: '3 January 2026',
    transactionId: 'pi_3Slcns2aaUUF7osH1Nv2BMBP'
};

function generateReceiptPDF(data) {
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
    const primaryBlue = [59, 130, 246];
    const darkText = [31, 41, 55];
    const grayText = [107, 114, 128];
    const lightGray = [245, 247, 250];
    const greenText = [16, 185, 129];
    const borderGray = [229, 231, 235];

    // ============ HEADER ============
    const logoBase64 = loadImageAsBase64('/camp_logo.png');
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, y, 40, 16);
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

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...grayText);
    doc.text('PAYMENT RECEIPT', pageWidth - margin, y + 3, { align: 'right' });

    y += 18;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text('Elim Camp Road, Ghana', margin, y);
    doc.text(`Receipt #: ${data.reference}`, pageWidth - margin, y, { align: 'right' });

    y += 4;
    doc.text('info@campelimafrica.com | +233 27 993 1941', margin, y);
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

    const col1 = margin;
    const col2 = margin + 55;
    const col3 = margin + 115;

    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.setFont('helvetica', 'normal');
    doc.text('EVENT TYPE', col1, y);
    doc.text('EVENT DATE', col2, y);
    doc.text('TIME & DURATION', col3, y);

    y += 4;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkText);
    doc.text(data.eventType, col1, y);
    doc.text(data.eventDate, col2, y);
    doc.text(`${data.startTime} • ${data.duration}hour`, col3, y);

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

    y += 4;

    // ============ STAMP ============
    const stampBase64 = loadImageAsBase64('/camp_stamp.png');
    if (stampBase64) {
        try {
            doc.addImage(stampBase64, 'PNG', pageWidth / 2 - 20, y - 30, 40, 40);
        } catch (e) {
            console.error('Failed to add stamp:', e);
        }
    }

    // ============ TOTALS ============
    const totalsX = pageWidth - margin - 65;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayText);
    doc.text('Subtotal', totalsX, y);
    doc.setTextColor(...darkText);
    doc.text(`GHS ${data.subtotal.toLocaleString('en-GH', { minimumFractionDigits: 2 })}`, pageWidth - margin - 4, y, { align: 'right' });

    y += 10;

    doc.setFillColor(...primaryBlue);
    doc.roundedRect(totalsX - 3, y - 4, 68, 12, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
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
    doc.text('Thank you for choosing Camp Elim Africa!', centerX, footerY, { align: 'center' });
    doc.text('This is an electronically generated receipt and does not require a signature.', centerX, footerY + 4, { align: 'center' });

    const now = new Date();
    const generatedText = `Generated on ${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} at ${now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
    doc.setFontSize(7);
    doc.text(generatedText, centerX, footerY + 8, { align: 'center' });

    return doc.output('arraybuffer');
}

// Generate the receipt
console.log('Generating sample receipt...');
const pdfBuffer = generateReceiptPDF(data);

// Save to public folder
const outputPath = path.join(process.cwd(), 'public', 'sample-receipt.pdf');
fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
console.log('Sample receipt saved to:', outputPath);
console.log('Open http://localhost:3000/sample-receipt.pdf to view it');
