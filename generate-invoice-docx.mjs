import * as fs from 'fs';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, ImageRun, VerticalAlign } from 'docx';
import path from 'path';

// Define destination path
const destDir = "C:\\Users\\HP\\Desktop\\Add\\New folder\\pic";
const destFile = path.join(destDir, "invoice_4.docx");

// Ensure directory exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

async function createInvoice() {
    let logoImage;
    try {
        logoImage = fs.readFileSync(path.join(process.cwd(), "public", "billboards", "White_Logo.png"));
    } catch (e) {
        console.warn("Could not load logo image. Using text placeholder.", e.message);
    }

    const doc = new Document({
        creator: "Antigravity",
        title: "Proforma Invoice",
        styles: {
            default: {
                document: {
                    run: {
                        font: "Arial",
                        size: 24, // 12pt
                        color: "000000",
                    },
                },
            },
        },
        sections: [{
            properties: {
                page: {
                    margin: { top: 720, right: 720, bottom: 720, left: 720 }, // 0.5 inch margins
                },
            },
            children: [
                // Header Table (Logo on left, Company details on right)
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 25, type: WidthType.PERCENTAGE },
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: logoImage ? [
                                                new ImageRun({
                                                    data: logoImage,
                                                    transformation: { width: 100, height: 100 },
                                                    type: "png"
                                                })
                                            ] : [new TextRun("[LOGO]")],
                                        }),
                                    ],
                                }),
                                new TableCell({
                                    width: { size: 75, type: WidthType.PERCENTAGE },
                                    verticalAlign: VerticalAlign.CENTER,
                                    children: [
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new TextRun({
                                                    text: "WHITECAP INTERNATIONAL LIMITED",
                                                    font: "Impact",
                                                    size: 56, // 28pt
                                                })
                                            ],
                                        }),
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new TextRun({ text: "91 Campbell Street Freetown, Sierra Leone", bold: true, size: 26 })
                                            ],
                                        }),
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new TextRun({ text: "Phone: +232 75 126 123 / +232 31 126 123 / +232 31 837 455", bold: true, size: 26 })
                                            ],
                                        }),
                                        new Paragraph({
                                            alignment: AlignmentType.CENTER,
                                            children: [
                                                new TextRun({ text: "Email: whitecapinternationallimited@gmail.com", bold: true, size: 26 })
                                            ],
                                        }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
                
                new Paragraph({ text: "" }), // spacer

                // Invoice Title and Number
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    tabStops: [
                        { type: "right", position: 9500 }
                    ],
                    children: [
                        new TextRun({ text: "\t" }), // Push the title to center roughly, and number to right
                        new TextRun({ text: "PROFORMA INVOICE", bold: true, size: 44, underline: {} }),
                        new TextRun({ text: "\tNº ", bold: true, size: 40 }),
                        new TextRun({ text: "0031", bold: true, size: 40, color: "FF0000" }),
                    ],
                }),

                new Paragraph({ text: "" }),

                // Customer Info (Name, Address, Date)
                new Paragraph({
                    children: [
                        new TextRun({ text: "Name: ", bold: true, size: 30 }),
                        new TextRun({ text: "..................................................................................................................................", bold: true, size: 30 })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: "Address: ", bold: true, size: 30 }),
                        new TextRun({ text: "......................................................................", bold: true, size: 30 }),
                        new TextRun({ text: " Date: ", bold: true, size: 30 }),
                        new TextRun({ text: "...........................................", bold: true, size: 30 })
                    ]
                }),

                new Paragraph({ text: "" }),

                // Items Table
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 6, color: "000000" },
                        insideVertical: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "QTY", alignment: AlignmentType.CENTER, bold: true })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                                new TableCell({ children: [new Paragraph({ text: "DESCRIPTION", alignment: AlignmentType.CENTER, bold: true })], width: { size: 50, type: WidthType.PERCENTAGE } }),
                                new TableCell({ children: [new Paragraph({ text: "UNIT PRICE", alignment: AlignmentType.CENTER, bold: true })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                                new TableCell({ children: [new Paragraph({ text: "AMOUNT", alignment: AlignmentType.CENTER, bold: true })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                            ],
                        }),
                        // 14 Empty Rows
                        ...Array.from({ length: 14 }).map(() => new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: " " })] }),
                                new TableCell({ children: [new Paragraph({ text: " " })] }),
                                new TableCell({ children: [new Paragraph({ text: " " })] }),
                                new TableCell({ children: [new Paragraph({ text: " " })] }),
                            ],
                        })),
                        // Sub Total Row
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "" })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] }),
                                new TableCell({ children: [new Paragraph({ text: " Sub Total Le", bold: true })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] }),
                            ],
                        }),
                        // Total Row
                        new TableRow({
                            children: [
                                new TableCell({ children: [new Paragraph({ text: "" })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] }),
                                new TableCell({ children: [new Paragraph({ text: " TOTAL LE", bold: true, alignment: AlignmentType.CENTER })] }),
                                new TableCell({ children: [new Paragraph({ text: "" })] }),
                            ],
                        }),
                    ],
                }),

                new Paragraph({ text: "" }),

                // Footer Section
                new Paragraph({
                    children: [
                        new TextRun({ text: "Amount in words ", bold: true, size: 30 }),
                        new TextRun({ text: ".....................................................................................................", bold: true, size: 30 })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({ text: ".................................................................................................................................................", bold: true, size: 30 })
                    ]
                }),

                new Paragraph({ text: "" }),
                new Paragraph({ text: "" }),

                // Signatures (Table without borders to position them)
                new Table({
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: {
                        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                        insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "................................................", bold: true })] }),
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Customer's Signature", italics: true, bold: true, size: 30 })] }),
                                    ],
                                }),
                                new TableCell({
                                    width: { size: 50, type: WidthType.PERCENTAGE },
                                    children: [
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "................................................", bold: true })] }),
                                        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "Manager's Signature", italics: true, bold: true, size: 30 })] }),
                                    ],
                                }),
                            ],
                        }),
                    ],
                }),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(destFile, buffer);
    console.log(`Document created successfully at ${destFile}`);
}

createInvoice().catch(console.error);
