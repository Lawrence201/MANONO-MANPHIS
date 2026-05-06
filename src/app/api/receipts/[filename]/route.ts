import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const { filename } = await params;

        // Security: Only allow .pdf files and sanitize filename
        if (!filename.endsWith('.pdf') || filename.includes('..') || filename.includes('/')) {
            return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
        }

        const receiptsDir = path.join(process.cwd(), 'public', 'receipts');
        const filepath = path.join(receiptsDir, filename);

        // Check if file exists
        if (!fs.existsSync(filepath)) {
            console.log('Receipt not found:', filepath);
            return NextResponse.json({ error: 'Receipt not found' }, { status: 404 });
        }

        // Read the file
        const fileBuffer = fs.readFileSync(filepath);

        // Return the PDF with proper headers
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="${filename}"`,
                'Content-Length': fileBuffer.length.toString(),
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });

    } catch (error: any) {
        console.error('Error serving receipt:', error);
        return NextResponse.json(
            { error: 'Failed to serve receipt', message: error.message },
            { status: 500 }
        );
    }
}
