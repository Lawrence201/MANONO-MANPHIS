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
        const hallId = parseInt(id);

        if (!hallId) {
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

        // Parse JSON arrays
        const amenities: string[] = amenitiesJson ? JSON.parse(amenitiesJson) : [];
        const suitableFor: string[] = suitableForJson ? JSON.parse(suitableForJson) : [];
        const addOns: any[] = addOnsJson ? JSON.parse(addOnsJson) : [];
        const deletedGalleryIds: number[] = deletedGalleryIdsJson ? JSON.parse(deletedGalleryIdsJson) : [];
        const deletedVideoIds: number[] = deletedVideoIdsJson ? JSON.parse(deletedVideoIdsJson) : [];

        // Parse Plans
        const plansJson = formData.get('plans') as string;
        const plans: any[] = plansJson ? JSON.parse(plansJson) : [];

        // Handle File Uploads with Cloudinary
        let mainImagePath: string | null = null;
        const mainImageFile = formData.get('mainImage') as File;
        if (mainImageFile && mainImageFile.size > 0) {
            mainImagePath = await uploadToCloudinary(mainImageFile, 'halls');
        }

        let contactImagePath: string | null = null;
        const contactImageFile = formData.get('contactImage') as File;
        if (contactImageFile && contactImageFile.size > 0) {
            contactImagePath = await uploadToCloudinary(contactImageFile, 'halls');
        }

        const newGalleryImages: string[] = [];
        const galleryFiles = formData.getAll('gallery') as File[];
        for (const file of galleryFiles) {
            if (file.size > 0) {
                newGalleryImages.push(await uploadToCloudinary(file, 'halls'));
            }
        }

        const newVideos: { path: string, type: string }[] = [];
        const videoFiles = formData.getAll('videos') as File[];
        for (const file of videoFiles) {
            if (file.size > 0) {
                newVideos.push({ path: await uploadToCloudinary(file, 'halls'), type: 'file' });
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

        // --- Database Transaction ---
        await prisma.$transaction(async (tx) => {
            // Fetch current hall data for cleanup
            const currentHall = await tx.hall.findUnique({
                where: { id: hallId },
                select: { mainImagePath: true }
            });

            // Get current contact image using parameterized query (SQL injection safe)
            const rawContact: any[] = await tx.$queryRaw`SELECT contact_image_path FROM halls WHERE id = ${hallId}`;
            const currentContactImage = rawContact[0]?.contact_image_path;

            // 1. Update Basic Info
            const updateData: any = {
                name,
                description,
                capacity,
                price,
                duration,
                updatedAt: new Date()
            };

            if (mainImagePath) {
                updateData.mainImagePath = mainImagePath;
                // Cleanup: Delete old main image from Cloudinary
                if (currentHall?.mainImagePath && currentHall.mainImagePath.includes('cloudinary')) {
                    await deleteFromCloudinary(currentHall.mainImagePath);
                }
            }

            await tx.hall.update({
                where: { id: hallId },
                data: updateData
            });

            // 1.1 Update Contact Info using Raw SQL
            if (contactImagePath) {
                // Cleanup: Delete old contact image from Cloudinary
                if (currentContactImage && currentContactImage.includes('cloudinary')) {
                    await deleteFromCloudinary(currentContactImage);
                }
                await tx.$executeRaw`
                    UPDATE halls 
                    SET contact_name = ${contactName}, 
                        contact_email = ${contactEmail}, 
                        contact_phone = ${contactPhone}, 
                        contact_image_path = ${contactImagePath} 
                    WHERE id = ${hallId}
                `;
            } else {
                await tx.$executeRaw`
                    UPDATE halls 
                    SET contact_name = ${contactName}, 
                        contact_email = ${contactEmail}, 
                        contact_phone = ${contactPhone}
                    WHERE id = ${hallId}
                `;
            }

            // 2. Update Amenities
            await tx.hallAmenity.deleteMany({ where: { hallId } });
            if (amenities.length > 0) {
                await tx.hallAmenity.createMany({
                    data: amenities.map(a => ({ hallId, amenityName: a }))
                });
            }

            // 3. Update Suitability
            await tx.hallSuitability.deleteMany({ where: { hallId } });
            if (suitableFor.length > 0) {
                await tx.hallSuitability.createMany({
                    data: suitableFor.map(s => ({ hallId, eventType: s }))
                });
            }

            // 3.1 Update Add-ons
            await tx.hallAddOn.deleteMany({ where: { hallId } });
            if (addOns.length > 0) {
                await tx.hallAddOn.createMany({
                    data: addOns.map(a => ({
                        hallId,
                        name: a.name,
                        price: a.price,
                        unit: a.unit
                    }))
                });
            }

            // 3.2 Update Plans
            await tx.$executeRaw`DELETE FROM hall_plan_features WHERE plan_id IN (SELECT id FROM hall_plans WHERE hall_id = ${hallId})`;
            await tx.$executeRaw`DELETE FROM hall_plans WHERE hall_id = ${hallId}`;

            for (const plan of plans) {
                const result = await tx.$queryRaw<{ id: number }[]>`
                    INSERT INTO hall_plans (hall_id, name, description, price, validity, created_at)
                    VALUES (${hallId}, ${plan.name}, ${plan.description || null}, ${plan.price}, ${plan.validity || null}, NOW())
                    RETURNING id
                `;

                const planId = result[0]?.id;
                if (plan.features && plan.features.length > 0) {
                    for (const feature of plan.features) {
                        await tx.$executeRaw`
                            INSERT INTO hall_plan_features (plan_id, feature_text)
                            VALUES (${planId}, ${feature})
                        `;
                    }
                }
            }

            // 4. Handle Deletions with Cloudinary Cleanup
            if (deletedGalleryIds.length > 0) {
                // Fetch URLs for Cloudinary cleanup
                const imagesToDelete = await tx.hallGalleryImage.findMany({
                    where: { id: { in: deletedGalleryIds } },
                    select: { imagePath: true }
                });
                // Delete from Cloudinary
                for (const img of imagesToDelete) {
                    if (img.imagePath && img.imagePath.includes('cloudinary')) {
                        await deleteFromCloudinary(img.imagePath);
                    }
                }
                await tx.hallGalleryImage.deleteMany({ where: { id: { in: deletedGalleryIds } } });
            }

            if (deletedVideoIds.length > 0) {
                // Fetch URLs for Cloudinary cleanup using raw SQL (to get videoType)
                const videosToDelete: { video_path: string, video_type: string }[] = await tx.$queryRaw`
                    SELECT video_path, video_type FROM hall_gallery_videos WHERE id = ANY(${deletedVideoIds})
                `;
                // Delete from Cloudinary only for uploaded files, not YouTube links
                for (const vid of videosToDelete) {
                    if (vid.video_path && vid.video_path.includes('cloudinary') && vid.video_type !== 'youtube') {
                        await deleteFromCloudinary(vid.video_path);
                    }
                }
                await tx.hallGalleryVideo.deleteMany({ where: { id: { in: deletedVideoIds } } });
            }

            // 5. Add New Media
            if (newGalleryImages.length > 0) {
                await tx.hallGalleryImage.createMany({
                    data: newGalleryImages.map(img => ({ hallId, imagePath: img }))
                });
            }

            // Add new videos with video type
            if (newVideos.length > 0) {
                for (const video of newVideos) {
                    await tx.$executeRaw`
                        INSERT INTO hall_gallery_videos (hall_id, video_path, video_type, created_at)
                        VALUES (${hallId}, ${video.path}, ${video.type}, NOW())
                    `;
                }
            }
        });

        revalidatePath('/halls');
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error updating hall:', error);
        return NextResponse.json(
            { error: 'Failed to update hall' },
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

        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const hallId = parseInt(id);

        // Fetch hall data for Cloudinary cleanup
        const hall = await prisma.hall.findUnique({
            where: { id: hallId },
            include: {
                galleryImages: { select: { imagePath: true } },
                videos: { select: { videoPath: true } }
            }
        });

        if (hall) {
            // Delete main image from Cloudinary
            if (hall.mainImagePath && hall.mainImagePath.includes('cloudinary')) {
                await deleteFromCloudinary(hall.mainImagePath);
            }

            // Delete gallery images from Cloudinary
            for (const img of hall.galleryImages) {
                if (img.imagePath && img.imagePath.includes('cloudinary')) {
                    await deleteFromCloudinary(img.imagePath);
                }
            }

            // Delete videos from Cloudinary
            for (const vid of hall.videos) {
                if (vid.videoPath && vid.videoPath.includes('cloudinary')) {
                    await deleteFromCloudinary(vid.videoPath);
                }
            }

            // Get contact image using parameterized query (SQL injection safe)
            const rawContact: any[] = await prisma.$queryRaw`SELECT contact_image_path FROM halls WHERE id = ${hallId}`;
            if (rawContact[0]?.contact_image_path && rawContact[0].contact_image_path.includes('cloudinary')) {
                await deleteFromCloudinary(rawContact[0].contact_image_path);
            }
        }

        // Delete related records first, then hall
        await prisma.$transaction([
            prisma.hallAmenity.deleteMany({ where: { hallId } }),
            prisma.hallSuitability.deleteMany({ where: { hallId } }),
            prisma.hallGalleryImage.deleteMany({ where: { hallId } }),
            prisma.hallGalleryVideo.deleteMany({ where: { hallId } }),
            prisma.hallAddOn.deleteMany({ where: { hallId } }),
            prisma.hall.delete({ where: { id: hallId } })
        ]);

        revalidatePath('/halls');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting hall:', error);
        return NextResponse.json(
            { error: 'Failed to delete hall: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}
