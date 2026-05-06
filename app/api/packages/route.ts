
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET - Fetch all packages with add-ons
export async function GET() {
    try {
        const packages = await prisma.$queryRaw`
            SELECT * FROM packages ORDER BY created_at DESC
        ` as any[];

        // Fetch add-ons for each package
        const formattedPackages = await Promise.all(packages.map(async (p: any) => {
            const addOns = await prisma.$queryRaw`
                SELECT id, name, price, unit FROM package_addons WHERE package_id = ${p.id}
            ` as any[];

            return {
                id: p.id,
                name: p.name,
                description: p.description,
                packageType: p.package_type, // Add package type
                capacity: p.capacity,
                price: p.price,
                duration: p.duration,
                mainImagePath: p.main_image_path,
                addOns: addOns.map((addon: any) => ({
                    id: addon.id,
                    name: addon.name,
                    price: addon.price,
                    unit: addon.unit
                }))
            };
        }));

        return NextResponse.json({ packages: formattedPackages });
    } catch (error: any) {
        console.error("Error fetching packages:", error);
        return NextResponse.json({ error: "Failed to fetch packages" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const capacity = formData.get('capacity') as string;
        const price = formData.get('price') as string;
        const duration = formData.get('duration') as string;
        const packageType = (formData.get('packageType') as string) || 'event'; // Default to 'event'

        // Robust parsing for features and suitability
        let features = [];
        try {
            const parsed = JSON.parse(formData.get('features') as string || '[]');
            if (Array.isArray(parsed)) features = parsed;
        } catch (e) {
            console.warn("Failed to parse features, defaulting to empty array");
        }

        let suitability = [];
        try {
            const parsed = JSON.parse(formData.get('suitability') as string || '[]');
            if (Array.isArray(parsed)) suitability = parsed;
        } catch (e) {
            console.warn("Failed to parse suitability, defaulting to empty array");
        }

        let addOns = [];
        try {
            const parsed = JSON.parse(formData.get('addOns') as string || '[]');
            if (Array.isArray(parsed)) addOns = parsed;
        } catch (e) {
            console.warn("Failed to parse addOns, defaulting to empty array");
        }

        // Parse YouTube Links
        let youtubeLinks: string[] = [];
        try {
            const parsed = JSON.parse(formData.get('youtubeLinks') as string || '[]');
            if (Array.isArray(parsed)) youtubeLinks = parsed;
        } catch (e) {
            console.warn("Failed to parse youtubeLinks, defaulting to empty array");
        }

        const contactName = formData.get('contactName') as string;
        const contactEmail = formData.get('contactEmail') as string;
        const contactPhone = formData.get('contactPhone') as string;

        // --- File Handling with Cloudinary ---
        const mainImage = formData.get('mainImage') as File | null;
        const contactImage = formData.get('contactImage') as File | null;
        const galleryFiles = formData.getAll('gallery') as File[];
        const videoFiles = formData.getAll('videos') as File[];

        // 1. Save Main Image to Cloudinary
        let mainImagePath = null;
        if (mainImage && mainImage.size > 0) {
            mainImagePath = await uploadToCloudinary(mainImage, 'packages');
        }

        // 2. Save Contact Image to Cloudinary
        let contactImagePath = null;
        if (contactImage && contactImage.size > 0) {
            contactImagePath = await uploadToCloudinary(contactImage, 'packages');
        }

        // 3. Create Package Record (Raw SQL)
        const result = await prisma.$queryRaw`
            INSERT INTO packages (
                name, description, package_type, capacity, price, duration, main_image_path, 
                contact_name, contact_email, contact_phone, contact_image_path,
                created_at, updated_at
            ) VALUES (
                ${name}, ${description}, ${packageType}, ${capacity}, ${price}, ${duration}, ${mainImagePath},
                ${contactName}, ${contactEmail}, ${contactPhone}, ${contactImagePath},
                NOW(), NOW()
            ) RETURNING id
        ` as any[];
        const newPackageId = Number(result[0].id);

        if (!newPackageId) {
            throw new Error("Failed to retrieve new package ID");
        }

        // 4. Insert Features
        for (const feature of features) {
            await prisma.$executeRaw`
                INSERT INTO package_features (package_id, feature_name) 
                VALUES (${newPackageId}, ${feature})
            `;
        }

        // 5. Insert Suitability
        for (const type of suitability) {
            await prisma.$executeRaw`
                INSERT INTO package_suitability (package_id, event_type) 
                VALUES (${newPackageId}, ${type})
            `;
        }

        // 5.5 Insert AddOns
        for (const addon of addOns) {
            await prisma.$executeRaw`
                INSERT INTO package_addons (package_id, name, price, unit, created_at) 
                VALUES (${newPackageId}, ${addon.name}, ${addon.price}, ${addon.unit}, NOW())
            `;
        }

        // 6. Save & Insert Gallery to Cloudinary
        for (const file of galleryFiles) {
            if (file.size > 0) {
                const imageUrl = await uploadToCloudinary(file, 'packages');
                await prisma.$executeRaw`
                    INSERT INTO package_gallery_images (package_id, image_path, created_at) 
                    VALUES (${newPackageId}, ${imageUrl}, NOW())
                `;
            }
        }

        // 7. Save & Insert Videos to Cloudinary (with video_type)
        for (const file of videoFiles) {
            if (file.size > 0) {
                const videoUrl = await uploadToCloudinary(file, 'packages');
                await prisma.$executeRaw`
                    INSERT INTO package_gallery_videos (package_id, video_path, video_type, created_at) 
                    VALUES (${newPackageId}, ${videoUrl}, 'file', NOW())
                `;
            }
        }

        // 8. Insert YouTube Links
        for (const link of youtubeLinks) {
            if (link.trim()) {
                await prisma.$executeRaw`
                    INSERT INTO package_gallery_videos (package_id, video_path, video_type, created_at) 
                    VALUES (${newPackageId}, ${link.trim()}, 'youtube', NOW())
                `;
            }
        }

        return NextResponse.json({ success: true, packageId: newPackageId });

    } catch (error: any) {
        console.error("Error creating package:", error);
        return NextResponse.json({ error: "Failed to create package: " + (error.message || String(error)) }, { status: 500 });
    }
}
