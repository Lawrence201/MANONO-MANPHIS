import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const hostelId = parseInt(id);

        if (!hostelId) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const formData = await request.formData();

        // Extract fields
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const capacity = formData.get('capacity') as string;
        const price = formData.get('price') as string;
        const duration = formData.get('duration') as string;
        const amenitiesJson = formData.get('amenities') as string;
        const suitableForJson = formData.get('suitableFor') as string;
        const addOnsJson = formData.get('addOns') as string;
        const deletedGalleryIdsJson = formData.get('deletedGalleryIds') as string;
        const deletedVideoIdsJson = formData.get('deletedVideoIds') as string;

        // Contact Details
        const contactName = formData.get('contactName') as string;
        const contactEmail = formData.get('contactEmail') as string;
        const contactPhone = formData.get('contactPhone') as string;
        const roomQuantityRaw = formData.get('roomQuantity') as string;
        const parsedQty = parseInt(roomQuantityRaw, 10);
        const roomQuantity = !isNaN(parsedQty) ? parsedQty : null;

        // Parse JSON arrays
        const amenities: string[] = amenitiesJson ? JSON.parse(amenitiesJson) : [];
        const suitableFor: string[] = suitableForJson ? JSON.parse(suitableForJson) : [];
        const addOns: any[] = addOnsJson ? JSON.parse(addOnsJson) : [];
        const deletedGalleryIds: number[] = deletedGalleryIdsJson ? JSON.parse(deletedGalleryIdsJson) : [];
        const deletedVideoIds: number[] = deletedVideoIdsJson ? JSON.parse(deletedVideoIdsJson) : [];

        // Handle File Uploads with Cloudinary
        let mainImagePath: string | null = null;
        const mainImageFile = formData.get('mainImage') as File;
        if (mainImageFile && mainImageFile.size > 0) {
            mainImagePath = await uploadToCloudinary(mainImageFile, 'hostels');
        }

        let contactImagePath: string | null = null;
        const contactImageFile = formData.get('contactImage') as File;
        if (contactImageFile && contactImageFile.size > 0) {
            contactImagePath = await uploadToCloudinary(contactImageFile, 'hostels');
        }

        const newGalleryImages: string[] = [];
        const galleryFiles = formData.getAll('gallery') as File[];
        for (const file of galleryFiles) {
            if (file.size > 0) {
                newGalleryImages.push(await uploadToCloudinary(file, 'hostels'));
            }
        }

        const newVideos: { path: string, type: string }[] = [];
        const videoFiles = formData.getAll('videos') as File[];
        for (const file of videoFiles) {
            if (file.size > 0) {
                newVideos.push({ path: await uploadToCloudinary(file, 'hostels'), type: 'file' });
            }
        }

        // Handle YouTube Links
        const youtubeLinksRaw = formData.get('youtubeLinks') as string;
        const youtubeLinks = youtubeLinksRaw ? JSON.parse(youtubeLinksRaw) : [];
        for (const link of youtubeLinks) {
            if (link && link.trim()) {
                newVideos.push({ path: link.trim(), type: 'youtube' });
            }
        }

        // --- Database Transaction using RAW SQL ---
        await prisma.$transaction(async (tx) => {
            // Fetch current hostel for cleanup
            const currentHostels = await tx.$queryRaw`SELECT main_image_path, contact_image_path FROM hostels WHERE id = ${hostelId}` as any[];
            const currentHostel = currentHostels[0];

            if (!currentHostel) throw new Error('Hostel not found');

            // 1. Update Basic Info
            const updatedMainImage = mainImagePath || currentHostel.main_image_path;
            const updatedContactImage = contactImagePath || currentHostel.contact_image_path;

            // Cleanup old images if being replaced
            if (mainImagePath && currentHostel.main_image_path && currentHostel.main_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(currentHostel.main_image_path);
            }
            if (contactImagePath && currentHostel.contact_image_path && currentHostel.contact_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(currentHostel.contact_image_path);
            }

            await tx.$executeRaw`
                UPDATE hostels 
                SET name = ${name}, 
                    description = ${description}, 
                    capacity = ${capacity}, 
                    price = ${price}, 
                    duration = ${duration}, 
                    contact_name = ${contactName}, 
                    contact_email = ${contactEmail}, 
                    contact_phone = ${contactPhone}, 
                    room_quantity = ${roomQuantity},
                    main_image_path = ${updatedMainImage},
                    contact_image_path = ${updatedContactImage},
                    updated_at = NOW()
                WHERE id = ${hostelId}
            `;

            // 2. Update Amenities
            await tx.$executeRaw`DELETE FROM hostel_amenities WHERE hostel_id = ${hostelId}`;
            for (const amenity of amenities) {
                await tx.$executeRaw`INSERT INTO hostel_amenities (hostel_id, amenity_name) VALUES (${hostelId}, ${amenity})`;
            }

            // 3. Update Suitability
            await tx.$executeRaw`DELETE FROM hostel_suitability WHERE hostel_id = ${hostelId}`;
            for (const item of suitableFor) {
                await tx.$executeRaw`INSERT INTO hostel_suitability (hostel_id, event_type) VALUES (${hostelId}, ${item})`;
            }

            // 3.1 Update Add-ons
            await tx.$executeRaw`DELETE FROM hostel_addons WHERE hostel_id = ${hostelId}`;
            for (const addon of addOns) {
                await tx.$executeRaw`
                    INSERT INTO hostel_addons (hostel_id, name, price, unit, created_at) 
                    VALUES (${hostelId}, ${addon.name}, ${addon.price}, ${addon.unit}, NOW())
                `;
            }

            // 4. Handle Deletions with Cloudinary cleanup
            for (const dId of deletedGalleryIds) {
                // Get URL for cleanup
                const imgs = await tx.$queryRaw`SELECT image_path FROM hostel_gallery_images WHERE id = ${dId}` as any[];
                if (imgs[0]?.image_path && imgs[0].image_path.includes('cloudinary')) {
                    await deleteFromCloudinary(imgs[0].image_path);
                }
                await tx.$executeRaw`DELETE FROM hostel_gallery_images WHERE id = ${dId}`;
            }

            for (const dId of deletedVideoIds) {
                // Get URL for cleanup (only delete from Cloudinary if it's a file, not YouTube)
                const vids = await tx.$queryRaw`SELECT video_path, video_type FROM hostel_gallery_videos WHERE id = ${dId}` as any[];
                if (vids[0]?.video_path && vids[0].video_path.includes('cloudinary') && vids[0].video_type !== 'youtube') {
                    await deleteFromCloudinary(vids[0].video_path);
                }
                await tx.$executeRaw`DELETE FROM hostel_gallery_videos WHERE id = ${dId}`;
            }

            // 5. Add New Media
            for (const imgPath of newGalleryImages) {
                await tx.$executeRaw`INSERT INTO hostel_gallery_images (hostel_id, image_path, created_at) VALUES (${hostelId}, ${imgPath}, NOW())`;
            }

            for (const video of newVideos) {
                await tx.$executeRaw`INSERT INTO hostel_gallery_videos (hostel_id, video_path, video_type, created_at) VALUES (${hostelId}, ${video.path}, ${video.type}, NOW())`;
            }
        });

        revalidatePath('/admin/hostels');
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating hostel:', error);
        return NextResponse.json(
            { error: 'Failed to update hostel. ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const hostelId = parseInt(id);

        if (!hostelId) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Fetch hostel data for Cloudinary cleanup
        const hostels = await prisma.$queryRaw`SELECT main_image_path, contact_image_path FROM hostels WHERE id = ${hostelId}` as any[];
        const hostel = hostels[0];

        if (hostel) {
            // Delete main image from Cloudinary
            if (hostel.main_image_path && hostel.main_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(hostel.main_image_path);
            }
            // Delete contact image from Cloudinary
            if (hostel.contact_image_path && hostel.contact_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(hostel.contact_image_path);
            }

            // Get and delete gallery images
            const galleryImages = await prisma.$queryRaw`SELECT image_path FROM hostel_gallery_images WHERE hostel_id = ${hostelId}` as any[];
            for (const img of galleryImages) {
                if (img.image_path && img.image_path.includes('cloudinary')) {
                    await deleteFromCloudinary(img.image_path);
                }
            }

            // Get and delete videos
            const videos = await prisma.$queryRaw`SELECT video_path FROM hostel_gallery_videos WHERE hostel_id = ${hostelId}` as any[];
            for (const vid of videos) {
                if (vid.video_path && vid.video_path.includes('cloudinary')) {
                    await deleteFromCloudinary(vid.video_path);
                }
            }
        }

        // Delete DB Records
        await prisma.$transaction(async (tx) => {
            await tx.$executeRaw`DELETE FROM hostel_amenities WHERE hostel_id = ${hostelId}`;
            await tx.$executeRaw`DELETE FROM hostel_suitability WHERE hostel_id = ${hostelId}`;
            await tx.$executeRaw`DELETE FROM hostel_addons WHERE hostel_id = ${hostelId}`;
            await tx.$executeRaw`DELETE FROM hostel_gallery_images WHERE hostel_id = ${hostelId}`;
            await tx.$executeRaw`DELETE FROM hostel_gallery_videos WHERE hostel_id = ${hostelId}`;
            await tx.$executeRaw`DELETE FROM hostels WHERE id = ${hostelId}`;
        });

        revalidatePath('/admin/hostels');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting hostel:', error);
        return NextResponse.json(
            { error: 'Failed to delete hostel: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}
