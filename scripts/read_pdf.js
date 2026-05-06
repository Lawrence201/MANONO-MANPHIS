const fs = require('fs');
const path = require('path');
const PDFParser = require('pdf2json');

const pdfPath = path.join(process.cwd(), 'public', 'GCB EPAY API DOCUMENTATION FOR PAYMENT GATEWAY Fin_260105_135109.pdf');
const outputPath = path.join(process.cwd(), 'scripts', 'gcb_api_content.txt');

const pdfParser = new PDFParser();

pdfParser.on('pdfParser_dataError', errData => console.error(errData.parserError));

pdfParser.on('pdfParser_dataReady', pdfData => {
    let fullText = '';

    if (pdfData.Pages) {
        pdfData.Pages.forEach((page, pageIndex) => {
            fullText += `\n\n=== PAGE ${pageIndex + 1} ===\n\n`;

            if (page.Texts) {
                // Sort texts by y position then x position for proper reading order
                const sortedTexts = page.Texts.sort((a, b) => {
                    if (Math.abs(a.y - b.y) < 0.5) {
                        return a.x - b.x;
                    }
                    return a.y - b.y;
                });

                let lastY = -1;
                sortedTexts.forEach(textItem => {
                    if (textItem.R) {
                        // Add newline if y position changed significantly
                        if (lastY !== -1 && Math.abs(textItem.y - lastY) > 0.5) {
                            fullText += '\n';
                        }

                        textItem.R.forEach(r => {
                            if (r.T) {
                                fullText += decodeURIComponent(r.T) + ' ';
                            }
                        });
                        lastY = textItem.y;
                    }
                });
            }
        });
    }

    // Save to file
    fs.writeFileSync(outputPath, fullText);
    console.log('PDF content saved to:', outputPath);
    console.log('\n--- Content Preview ---\n');
    console.log(fullText.substring(0, 5000));
});

pdfParser.loadPDF(pdfPath);
