import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Dynamic route to serve uploaded files
// This ensures uploaded files work in production builds
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathSegments } = await params;
        const filePath = pathSegments.join('/');

        // Security: Prevent directory traversal
        if (filePath.includes('..')) {
            return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
        }

        const absolutePath = path.join(process.cwd(), 'public', 'uploads', filePath);

        // Check if file exists
        if (!fs.existsSync(absolutePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        // Read the file
        const file = fs.readFileSync(absolutePath);

        // Determine content type based on extension
        const ext = path.extname(filePath).toLowerCase();
        const contentTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.avif': 'image/avif',
            '.svg': 'image/svg+xml',
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.pdf': 'application/pdf',
        };

        const contentType = contentTypes[ext] || 'application/octet-stream';

        return new NextResponse(file, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch (error) {
        console.error('Error serving uploaded file:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
