
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';

// PATCH: Update Package
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const packageId = parseInt(id);
        const formData = await req.formData();

        // New Data
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const capacity = formData.get('capacity') as string;
        const price = formData.get('price') as string;
        const duration = formData.get('duration') as string;
        const features = JSON.parse(formData.get('features') as string || '[]');
        const suitability = JSON.parse(formData.get('suitability') as string || '[]');
        const addOns = JSON.parse(formData.get('addOns') as string || '[]');

        const contactName = formData.get('contactName') as string;
        const contactEmail = formData.get('contactEmail') as string;
        const contactPhone = formData.get('contactPhone') as string;

        const mainImage = formData.get('mainImage') as File | null;
        const contactImage = formData.get('contactImage') as File | null;

        const deletedGalleryIds = JSON.parse(formData.get('deletedGalleryIds') as string || '[]');
        const deletedVideoIds = JSON.parse(formData.get('deletedVideoIds') as string || '[]');

        const galleryFiles = formData.getAll('gallery') as File[];
        const videoFiles = formData.getAll('videos') as File[];

        // Fetch current package for cleanup
        const currentPackages = await prisma.$queryRaw`SELECT main_image_path, contact_image_path FROM packages WHERE id = ${packageId}` as any[];
        const currentPackage = currentPackages[0];

        // 1. Update Basic Fields
        await prisma.$executeRaw`
            UPDATE packages SET 
                name = ${name}, 
                description = ${description}, 
                capacity = ${capacity}, 
                price = ${price}, 
                duration = ${duration},
                contact_name = ${contactName},
                contact_email = ${contactEmail},
                contact_phone = ${contactPhone},
                updated_at = NOW()
            WHERE id = ${packageId}
        `;

        // 2. Handle Main Image Update with Cloudinary
        if (mainImage && mainImage.size > 0) {
            // Cleanup old image
            if (currentPackage?.main_image_path && currentPackage.main_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(currentPackage.main_image_path);
            }
            const mainImagePath = await uploadToCloudinary(mainImage, 'packages');
            await prisma.$executeRaw`UPDATE packages SET main_image_path = ${mainImagePath} WHERE id = ${packageId}`;
        }

        // 3. Handle Contact Image Update with Cloudinary
        if (contactImage && contactImage.size > 0) {
            // Cleanup old image
            if (currentPackage?.contact_image_path && currentPackage.contact_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(currentPackage.contact_image_path);
            }
            const contactImagePath = await uploadToCloudinary(contactImage, 'packages');
            await prisma.$executeRaw`UPDATE packages SET contact_image_path = ${contactImagePath} WHERE id = ${packageId}`;
        }

        // 4. Update Features
        await prisma.$executeRaw`DELETE FROM package_features WHERE package_id = ${packageId}`;
        for (const feature of features) {
            await prisma.$executeRaw`INSERT INTO package_features (package_id, feature_name) VALUES (${packageId}, ${feature})`;
        }

        // 5. Update Suitability
        await prisma.$executeRaw`DELETE FROM package_suitability WHERE package_id = ${packageId}`;
        for (const type of suitability) {
            await prisma.$executeRaw`INSERT INTO package_suitability (package_id, event_type) VALUES (${packageId}, ${type})`;
        }

        // 5.1 Update Add-ons
        await prisma.$executeRaw`DELETE FROM package_addons WHERE package_id = ${packageId}`;
        for (const addon of addOns) {
            await prisma.$executeRaw`
                INSERT INTO package_addons (package_id, name, price, unit, created_at) 
                VALUES (${packageId}, ${addon.name}, ${addon.price}, ${addon.unit}, NOW())
            `;
        }

        // 6. Handle Deleted Gallery Images with Cloudinary cleanup
        if (deletedGalleryIds.length > 0) {
            for (const dId of deletedGalleryIds) {
                // Get URL for cleanup
                const imgs = await prisma.$queryRaw`SELECT image_path FROM package_gallery_images WHERE id = ${dId}` as any[];
                if (imgs[0]?.image_path && imgs[0].image_path.includes('cloudinary')) {
                    await deleteFromCloudinary(imgs[0].image_path);
                }
                await prisma.$executeRaw`DELETE FROM package_gallery_images WHERE id = ${dId} AND package_id = ${packageId}`;
            }
        }

        // 7. Handle Deleted Videos with Cloudinary cleanup
        if (deletedVideoIds.length > 0) {
            for (const dId of deletedVideoIds) {
                // Get URL for cleanup
                const vids = await prisma.$queryRaw`SELECT video_path FROM package_gallery_videos WHERE id = ${dId}` as any[];
                if (vids[0]?.video_path && vids[0].video_path.includes('cloudinary')) {
                    await deleteFromCloudinary(vids[0].video_path);
                }
                await prisma.$executeRaw`DELETE FROM package_gallery_videos WHERE id = ${dId} AND package_id = ${packageId}`;
            }
        }

        // 8. Add New Gallery Images with Cloudinary
        for (const file of galleryFiles) {
            if (file.size > 0) {
                const imageUrl = await uploadToCloudinary(file, 'packages');
                await prisma.$executeRaw`INSERT INTO package_gallery_images (package_id, image_path, created_at) VALUES (${packageId}, ${imageUrl}, NOW())`;
            }
        }

        // 9. Add New Videos with Cloudinary (with video_type)
        for (const file of videoFiles) {
            if (file.size > 0) {
                const videoUrl = await uploadToCloudinary(file, 'packages');
                await prisma.$executeRaw`INSERT INTO package_gallery_videos (package_id, video_path, video_type, created_at) VALUES (${packageId}, ${videoUrl}, 'file', NOW())`;
            }
        }

        // 10. Handle YouTube Links
        const youtubeLinksRaw = formData.get('youtubeLinks') as string;
        if (youtubeLinksRaw) {
            try {
                const youtubeLinks = JSON.parse(youtubeLinksRaw);
                if (Array.isArray(youtubeLinks)) {
                    for (const link of youtubeLinks) {
                        if (link && link.trim()) {
                            await prisma.$executeRaw`
                                INSERT INTO package_gallery_videos (package_id, video_path, video_type, created_at) 
                                VALUES (${packageId}, ${link.trim()}, 'youtube', NOW())
                            `;
                        }
                    }
                }
            } catch (e) {
                console.warn("Failed to parse youtubeLinks in PATCH");
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error updating package:", error);
        return NextResponse.json({ error: "Failed to update package" }, { status: 500 });
    }
}

// DELETE: Delete Package
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const packageId = parseInt(id);

        // Fetch package data for Cloudinary cleanup
        const packages = await prisma.$queryRaw`SELECT main_image_path, contact_image_path FROM packages WHERE id = ${packageId}` as any[];
        const pkg = packages[0];

        if (pkg) {
            // Delete main image from Cloudinary
            if (pkg.main_image_path && pkg.main_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(pkg.main_image_path);
            }
            // Delete contact image from Cloudinary
            if (pkg.contact_image_path && pkg.contact_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(pkg.contact_image_path);
            }

            // Get and delete gallery images
            const galleryImages = await prisma.$queryRaw`SELECT image_path FROM package_gallery_images WHERE package_id = ${packageId}` as any[];
            for (const img of galleryImages) {
                if (img.image_path && img.image_path.includes('cloudinary')) {
                    await deleteFromCloudinary(img.image_path);
                }
            }

            // Get and delete videos
            const videos = await prisma.$queryRaw`SELECT video_path FROM package_gallery_videos WHERE package_id = ${packageId}` as any[];
            for (const vid of videos) {
                if (vid.video_path && vid.video_path.includes('cloudinary')) {
                    await deleteFromCloudinary(vid.video_path);
                }
            }
        }

        // Delete database records
        await prisma.$executeRaw`DELETE FROM package_features WHERE package_id = ${packageId}`;
        await prisma.$executeRaw`DELETE FROM package_suitability WHERE package_id = ${packageId}`;
        await prisma.$executeRaw`DELETE FROM package_addons WHERE package_id = ${packageId}`;
        await prisma.$executeRaw`DELETE FROM package_gallery_images WHERE package_id = ${packageId}`;
        await prisma.$executeRaw`DELETE FROM package_gallery_videos WHERE package_id = ${packageId}`;
        await prisma.$executeRaw`DELETE FROM packages WHERE id = ${packageId}`;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting package:", error);
        return NextResponse.json({ error: "Failed to delete package" }, { status: 500 });
    }
}
