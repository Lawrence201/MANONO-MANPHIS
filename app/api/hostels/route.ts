import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET() {
    try {
        const hostels = await prisma.hostel.findMany({
            include: {
                amenities: true,
                suitability: true,
                galleryImages: true,
                videos: true,
                addOns: true,
                bookings: {
                    where: {
                        paymentStatus: { not: 'cancelled' }
                    }
                }
            },
        });

        const hostelsWithAvailability = hostels.map(hostel => {
            const bookedCount = hostel.bookings.length;
            const totalRooms = hostel.roomQuantity || 0;
            const availableRooms = Math.max(0, totalRooms - bookedCount);

            // Remove bookings array from response to reduce payload size if not needed on frontend
            const { bookings, ...hostelData } = hostel;

            return {
                ...hostelData,
                availableRooms
            };
        });

        return NextResponse.json(hostelsWithAvailability);
    } catch (error) {
        console.error('Error fetching hostels:', error);
        return NextResponse.json(
            { error: 'Internal Server Error: ' + (error instanceof Error ? error.message : String(error)) },
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
        const roomQuantityRaw = formData.get('roomQuantity') as string;
        const parsedQty = parseInt(roomQuantityRaw, 10);
        const roomQuantity = !isNaN(parsedQty) ? parsedQty : null;

        // Extract arrays 
        const amenitiesRaw = formData.get('amenities') as string;
        const suitableForRaw = formData.get('suitableFor') as string;
        const addOnsRaw = formData.get('addOns') as string;

        const amenities = amenitiesRaw ? JSON.parse(amenitiesRaw) : [];
        const suitableFor = suitableForRaw ? JSON.parse(suitableForRaw) : [];
        const addOns = addOnsRaw ? JSON.parse(addOnsRaw) : [];

        // Validation
        if (!name || !capacity || !price) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Handle Main Image with Cloudinary
        const mainImageFile = formData.get('mainImage') as File | null;
        let mainImagePath = null;
        if (mainImageFile && mainImageFile.size > 0) {
            mainImagePath = await uploadToCloudinary(mainImageFile, 'hostels');
        }

        // Handle Contact Image with Cloudinary
        const contactImageFile = formData.get('contactImage') as File | null;
        let contactImagePath = null;
        if (contactImageFile && contactImageFile.size > 0) {
            contactImagePath = await uploadToCloudinary(contactImageFile, 'hostels');
        }

        // Handle Gallery Images with Cloudinary
        const galleryFiles = formData.getAll('gallery') as File[];
        const galleryPaths: string[] = [];
        for (const file of galleryFiles) {
            if (file.size > 0) {
                const url = await uploadToCloudinary(file, 'hostels');
                galleryPaths.push(url);
            }
        }

        // Handle Videos (uploaded files)
        const videoFiles = formData.getAll('videos') as File[];
        const videoPaths: { path: string, type: string }[] = [];
        for (const file of videoFiles) {
            if (file.size > 0) {
                const url = await uploadToCloudinary(file, 'hostels');
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

        // Create Hostel using Prisma Client (transaction for videos with type)
        const hostel = await prisma.$transaction(async (tx) => {
            const newHostel = await tx.hostel.create({
                data: {
                    name,
                    description,
                    capacity,
                    price,
                    duration,
                    mainImagePath,
                    contactName,
                    contactEmail,
                    contactPhone,
                    contactImage: contactImagePath,
                    roomQuantity,
                    amenities: {
                        create: amenities.map((name: string) => ({ amenityName: name }))
                    },
                    suitability: {
                        create: suitableFor.map((eventType: string) => ({ eventType }))
                    },
                    galleryImages: {
                        create: galleryPaths.map((path) => ({ imagePath: path }))
                    },
                    addOns: {
                        create: addOns.map((a: any) => ({
                            name: a.name,
                            price: a.price,
                            unit: a.unit
                        }))
                    }
                }
            });

            // Insert videos with type using raw SQL
            for (const video of videoPaths) {
                await tx.$executeRaw`
                    INSERT INTO hostel_gallery_videos (hostel_id, video_path, video_type, created_at)
                    VALUES (${newHostel.id}, ${video.path}, ${video.type}, NOW())
                `;
            }

            return newHostel;
        });

        return NextResponse.json({ success: true, id: hostel.id }, { status: 201 });

    } catch (error) {
        console.error('SERVER ERROR Creating Hostel:', error);
        return NextResponse.json(
            { error: 'Internal Server Error. ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}
