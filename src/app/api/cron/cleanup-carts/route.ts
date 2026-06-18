import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts publicId and resourceType from a Cloudinary URL
 */
function parseCloudinaryUrl(url: string) {
  if (!url || !url.includes('cloudinary.com')) return null;

  let resourceType: 'image' | 'video' | 'raw' = 'image';
  if (url.includes('/video/upload/')) {
    resourceType = 'video';
  } else if (url.includes('/raw/upload/')) {
    resourceType = 'raw';
  }

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return null;
  
  const pathAfterUpload = url.substring(uploadIndex + 8);
  const parts = pathAfterUpload.split('/');
  
  let pathWithoutVersion = parts;
  if (/^v\d+$/.test(parts[0])) {
    pathWithoutVersion = parts.slice(1);
  }
  
  const publicIdWithExt = pathWithoutVersion.join('/');
  // Remove extension to get public_id
  const lastDot = publicIdWithExt.lastIndexOf('.');
  const publicId = lastDot !== -1 ? publicIdWithExt.substring(0, lastDot) : publicIdWithExt;

  return { publicId, resourceType };
}

// Vercel Cron endpoints must be GET requests
export async function GET(request: Request) {
  try {
    // 1. Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 2. Find all cart items older than 30 days
    const expiredCarts = await prisma.cartItem.findMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    let deletedCloudinaryFiles = 0;

    // 3. Loop through expired carts to find Cloudinary media to delete
    for (const item of expiredCarts) {
      if (item.imagePath) {
        const cloudinaryData = parseCloudinaryUrl(item.imagePath);
        
        // If it's a campaign media file, we delete it from Cloudinary
        if (cloudinaryData && cloudinaryData.publicId.includes('campaign-media')) {
          try {
            await cloudinary.uploader.destroy(cloudinaryData.publicId, {
              resource_type: cloudinaryData.resourceType,
            });
            deletedCloudinaryFiles++;
          } catch (cloudinaryError) {
            console.error(`Failed to delete Cloudinary asset ${cloudinaryData.publicId}:`, cloudinaryError);
          }
        }
      }
    }

    // 4. Delete the expired cart items from the database
    const dbDeleteResult = await prisma.cartItem.deleteMany({
      where: {
        createdAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Cleaned up ${dbDeleteResult.count} expired cart items and deleted ${deletedCloudinaryFiles} media files from Cloudinary.`,
    });

  } catch (error) {
    console.error('Error during cron cleanup:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
