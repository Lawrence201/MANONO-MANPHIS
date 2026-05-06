import Header from '@/components/admin/Header';
import HostelGrid, { Facility } from '@/components/admin/HostelGrid';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getFacilities(): Promise<Facility[]> {
    try {
        // Fetch Hostels via Raw SQL due to Prisma Client sync issues
        // We use any[] casting because the raw result types aren't known
        const hostels = await prisma.$queryRaw`SELECT * FROM hostels ORDER BY created_at DESC` as any[];

        // We need to fetch amenities etc for each hostel to populate the grid properly.
        // N+1 query but acceptable for admin panel with limited items.
        const populatedHostels = await Promise.all(hostels.map(async (hostel) => {
            const amenities = await prisma.$queryRaw`SELECT * FROM hostel_amenities WHERE hostel_id = ${hostel.id}` as any[];
            const suitability = await prisma.$queryRaw`SELECT * FROM hostel_suitability WHERE hostel_id = ${hostel.id}` as any[];
            const images = await prisma.$queryRaw`SELECT * FROM hostel_gallery_images WHERE hostel_id = ${hostel.id}` as any[];
            const videos = await prisma.$queryRaw`SELECT * FROM hostel_gallery_videos WHERE hostel_id = ${hostel.id}` as any[];
            const addOns = await prisma.$queryRaw`SELECT * FROM hostel_addons WHERE hostel_id = ${hostel.id}` as any[];

            return {
                ...hostel,
                amenities: amenities,
                suitability: suitability,
                suiteability: suitability,
                galleryImages: images,
                videos: videos,
                addOns: addOns
            };
        }));

        return populatedHostels.map((hostel: any) => {
            const mapIcon = (name: string) => {
                const lower = name.toLowerCase();
                if (lower.includes('bed')) return 'bed';
                if (lower.includes('lock')) return 'locker';
                if (lower.includes('kitchen')) return 'kitchen';
                if (lower.includes('shower')) return 'shower';
                if (lower.includes('laundry')) return 'laundry';
                if (lower.includes('security')) return 'security';
                if (lower.includes('study')) return 'study';

                if (lower.includes('wifi') || lower.includes('internet')) return 'wifi';
                if (lower.includes('ac') || lower.includes('condition')) return 'wind';

                return 'building';
            };

            return {
                id: hostel.id.toString(),
                name: hostel.name,
                description: hostel.description,
                status: 'Available',
                capacity: hostel.capacity,
                price: hostel.price,
                duration: hostel.duration,
                mainImagePath: hostel.main_image_path, // Note snake_case from raw query
                amenities: hostel.amenities.map((a: any) => ({
                    icon: mapIcon(a.amenity_name), // snake_case
                    label: a.amenity_name
                })),
                suitability: hostel.suitability.map((s: any) => s.event_type), // snake_case
                galleryImages: hostel.galleryImages.map((img: any) => img.image_path), // snake_case
                videos: hostel.videos.map((vid: any) => vid.video_path), // snake_case
                addOns: hostel.addOns.map((addon: any) => ({
                    name: addon.name,
                    price: addon.price,
                    unit: addon.unit
                }))
            };
        });
    } catch (error) {
        console.error("Failed to fetch hostels:", error);
        return [];
    }
}

export default async function LodgesPage() {
    const facilities = await getFacilities();

    return (
        <>
            <Header />
            <div style={{ padding: '32px' }}>
                <HostelGrid facilities={facilities} />
            </div>
        </>
    );
}
