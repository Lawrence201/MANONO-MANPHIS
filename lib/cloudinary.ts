import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Save file to local storage (public/uploads)
 */
async function saveToLocal(file: File, folder: string): Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${file.name.split('.')[0]}-${uniqueSuffix}.${file.name.split('.').pop()}`;

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Write file
    const filePath = path.join(uploadDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    // Return public URL
    return `/uploads/${folder}/${filename}`;
}

/**
 * Upload a file to Cloudinary or Local Storage based on environment
 * @param file - The file to upload (File object from FormData)
 * @param folder - The folder to store the file (e.g., 'halls', 'hostels', 'packages')
 * @returns The secure URL of the uploaded file
 */
export async function uploadToCloudinary(file: File, folder: string): Promise<string> {
    // Use local storage in development
    if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] Uploading ${file.name} to local storage...`);
        return saveToLocal(file, folder);
    }

    try {
        // Convert File to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const mimeType = file.type;
        const dataUri = `data:${mimeType};base64,${base64}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataUri, {
            folder: `camp-elim-africa/${folder}`,
            resource_type: 'auto', // Automatically detect file type (image/video)
        });

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload file to Cloudinary');
    }
}

/**
 * Delete a file from Cloudinary or Local Storage
 * @param url - The URL of the file to delete
 */
export async function deleteFromCloudinary(url: string): Promise<void> {
    // Handle local file deletion
    if (url.startsWith('/uploads/')) {
        try {
            const filePath = path.join(process.cwd(), 'public', url);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
                console.log(`[DEV] Deleted local file: ${filePath}`);
            }
        } catch (error) {
            console.error('Local delete error:', error);
        }
        return;
    }

    try {
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
        const urlParts = url.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex === -1) return;

        // Get everything after 'upload/v{version}/'
        const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
        const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, ''); // Remove file extension

        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        // Don't throw - deletion failure shouldn't break the main flow
    }
}

export default cloudinary;
