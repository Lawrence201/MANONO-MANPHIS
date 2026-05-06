import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
    try {
        const halls = await prisma.hall.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                description: true,
                capacity: true,
                duration: true,
                mainImagePath: true,
                addOns: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        unit: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        return NextResponse.json({ halls });
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        // Extract fields
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const capacity = formData.get('capacity') as string;
        const price = formData.get('price') as string;
        const duration = formData.get('duration') as string;

        // Extract Contact Details
        const contactName = formData.get('contactName') as string;
        const contactEmail = formData.get('contactEmail') as string;
        const contactPhone = formData.get('contactPhone') as string;

        // Extract arrays 
        const amenitiesRaw = formData.get('amenities') as string;
        const suitableForRaw = formData.get('suitableFor') as string;
        const addOnsRaw = formData.get('addOns') as string;

        const amenities = amenitiesRaw ? JSON.parse(amenitiesRaw) : [];
        const suitableFor = suitableForRaw ? JSON.parse(suitableForRaw) : [];
        const addOns = addOnsRaw ? JSON.parse(addOnsRaw) : [];

        // Extract Plans
        const plansRaw = formData.get('plans') as string;
        const plans = plansRaw ? JSON.parse(plansRaw) : [];

        // Validation
        if (!name || !capacity || !price) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 📁 File Handling with Cloudinary
        // Handle Main Image
        const mainImageFile = formData.get('mainImage') as File | null;
        let mainImagePath = null;
        if (mainImageFile && mainImageFile.size > 0) {
            mainImagePath = await uploadToCloudinary(mainImageFile, 'halls');
        }

        // Handle Contact Image
        const contactImageFile = formData.get('contactImage') as File | null;
        let contactImagePath = null;
        if (contactImageFile && contactImageFile.size > 0) {
            contactImagePath = await uploadToCloudinary(contactImageFile, 'halls');
        }

        // Handle Gallery Images 
        const galleryFiles = formData.getAll('gallery') as File[];
        const galleryPaths: string[] = [];
        for (const file of galleryFiles) {
            if (file.size > 0) {
                const url = await uploadToCloudinary(file, 'halls');
                galleryPaths.push(url);
            }
        }

        // Handle Videos (uploaded files)
        const videoFiles = formData.getAll('videos') as File[];
        const videoPaths: { path: string, type: string }[] = [];
        for (const file of videoFiles) {
            if (file.size > 0) {
                const url = await uploadToCloudinary(file, 'halls');
                videoPaths.push({ path: url, type: 'file' });
            }
        }

        // Handle YouTube Links
        const youtubeLinksRaw = formData.get('youtubeLinks') as string;
        const youtubeLinks = youtubeLinksRaw ? JSON.parse(youtubeLinksRaw) : [];
        for (const link of youtubeLinks) {
            if (link && link.trim()) {
                videoPaths.push({ path: link.trim(), type: 'youtube' });
            }
        }

        // 💾 Database Transaction
        const newHall = await prisma.$transaction(async (tx) => {
            const hall = await tx.hall.create({
                data: {
                    name,
                    description,
                    capacity: (parseInt(capacity.replace(/[^0-9]/g, '')) || 0).toString(),
                    price: (parseFloat(price.replace(/[^0-9.]/g, '')) || 0).toString(),
                    duration,
                    mainImagePath: mainImagePath,
                    // Note: Skipping contact fields in standard create due to potentially out-of-sync client

                    amenities: {
                        create: amenities.map((amenity: string) => ({
                            amenityName: amenity
                        }))
                    },

                    suitability: {
                        create: suitableFor.map((eventType: string) => ({
                            eventType: eventType
                        }))
                    },

                    addOns: {
                        create: addOns.map((addOn: any) => ({
                            name: addOn.name,
                            price: addOn.price,
                            unit: addOn.unit
                        }))
                    },

                    galleryImages: {
                        create: galleryPaths.map((path) => ({
                            imagePath: path
                        }))
                    }
                }
            });

            // Create Videos with type using Raw SQL
            for (const video of videoPaths) {
                await tx.$executeRaw`
                    INSERT INTO hall_gallery_videos (hall_id, video_path, video_type, created_at)
                    VALUES (${hall.id}, ${video.path}, ${video.type}, NOW())
                `;
            }

            // Update Contact Info using Raw SQL (to bypass out-of-sync Prisma client)
            await tx.$executeRaw`
                UPDATE halls 
                SET contact_name = ${contactName || null}, 
                    contact_email = ${contactEmail || null}, 
                    contact_phone = ${contactPhone || null}, 
                    contact_image_path = ${contactImagePath || null} 
                WHERE id = ${hall.id}
            `;

            // Create Plans using Raw SQL
            for (const plan of plans) {
                const result = await tx.$queryRaw<{ id: number }[]>`
                    INSERT INTO hall_plans (hall_id, name, description, price, validity, created_at)
                    VALUES (${hall.id}, ${plan.name}, ${plan.description || null}, ${plan.price}, ${plan.validity || null}, NOW())
                    RETURNING id
                `;

                // Get the inserted plan ID
                const planId = result[0]?.id;

                // Create plan features
                if (plan.features && plan.features.length > 0) {
                    for (const feature of plan.features) {
                        await tx.$executeRaw`
                            INSERT INTO hall_plan_features (plan_id, feature_text)
                            VALUES (${planId}, ${feature})
                        `;
                    }
                }
            }

            return await tx.hall.findUnique({
                where: { id: hall.id },
                include: {
                    amenities: true,
                    suitability: true,
                    galleryImages: true,
                    videos: true
                }
            });
        });

        return NextResponse.json({ success: true, hall: newHall }, { status: 201 });

    } catch (error) {
        console.error('SERVER ERROR Creating Hall:', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}
