
import React from 'react';
import Header from '@/components/admin/Header';
import HallForm from '@/components/admin/HallForm';
import { prisma } from '@/lib/prisma'; // Ensure correct import path

interface EditHallPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditHallPage({ params }: EditHallPageProps) {
    const { id } = await params;
    const hallId = parseInt(id);

    // Fetch hall using raw SQL to ensure we get new columns even if Prisma client is out of sync
    const halls = await prisma.$queryRaw`SELECT * FROM halls WHERE id = ${hallId}` as any[];
    const rawHall = halls[0];

    if (!rawHall) {
        return <div>Hall not found</div>;
    }

    // Map DB column names to CamelCase for the form component
    const hall = {
        ...rawHall,
        mainImagePath: rawHall.main_image_path,
        contactName: rawHall['contact_name'],
        contactEmail: rawHall['contact_email'],
        contactPhone: rawHall['contact_phone'],
        contactImage: rawHall['contact_image_path'],
        amenities: await prisma.hallAmenity.findMany({ where: { hallId } }),
        galleryImages: await prisma.hallGalleryImage.findMany({ where: { hallId } }),
        suitability: await prisma.hallSuitability.findMany({ where: { hallId } }),
        videos: await prisma.$queryRaw`SELECT id, video_path as "videoPath", video_type as "videoType" FROM hall_gallery_videos WHERE hall_id = ${hallId}` as { id: number, videoPath: string, videoType: string }[],
        addOns: await prisma.hallAddOn.findMany({ where: { hallId } }),
        // Fetch plans using raw SQL since Prisma client might not be synced
        plans: await (async () => {
            const rawPlans = await prisma.$queryRaw<any[]>`
                SELECT id, name, description, price, validity 
                FROM hall_plans 
                WHERE hall_id = ${hallId}
                ORDER BY id ASC
            `;
            // Fetch features for each plan
            return Promise.all(rawPlans.map(async (plan) => {
                const rawFeatures = await prisma.$queryRaw<any[]>`
                    SELECT id, feature_text
                    FROM hall_plan_features 
                    WHERE plan_id = ${plan.id}
                    ORDER BY id ASC
                `;

                // Map features to ensure consistent property access
                const features = rawFeatures.map(f => ({
                    id: f.id,
                    featureText: f.feature_text || f.featureText || f.featuretext
                }));

                return { ...plan, features };
            }));
        })(),
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Header />
            <div style={{ padding: '0 32px' }}>
                <div style={{ marginTop: '32px' }}>
                    <HallForm initialData={hall} />
                </div>
            </div>
        </div>
    );
}

