import Header from '@/components/admin/Header';
import HallGrid, { Facility } from '@/components/admin/HallGrid';
import { prisma } from '@/lib/prisma'; // Ensure this path is correct based on your project structure

export const dynamic = 'force-dynamic'; // Ensure we always fetch fresh data

async function getFacilities(): Promise<Facility[]> {
    try {
        const halls = await prisma.hall.findMany({
            include: {
                amenities: true,
                suitability: true,
                galleryImages: true,
                videos: true,
                addOns: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return halls.map(hall => {
            // Parse Capacity (remove non-numeric chars)
            const capacityNum = parseInt(hall.capacity.replace(/\D/g, '')) || 0;

            // Parse Price (remove commas and currency)
            const priceNum = parseFloat(hall.price.replace(/[^\d.]/g, '')) || 0;

            // Map amenities to icon/label structure
            // We use a simple keyword matching for icons since DB just has names
            const mapIcon = (name: string) => {
                const lower = name.toLowerCase();
                if (lower.includes('wifi') || lower.includes('internet')) return 'wifi';
                if (lower.includes('sound') || lower.includes('speaker')) return 'speaker';
                if (lower.includes('ac') || lower.includes('condition')) return 'wind';
                if (lower.includes('projector')) return 'projector';
                if (lower.includes('mic')) return 'mic';
                if (lower.includes('tv') || lower.includes('screen')) return 'tv';
                if (lower.includes('light')) return 'lightbulb';
                return 'mic'; // default
            };

            return {
                id: hall.id.toString(),
                name: hall.name,
                description: hall.description, // Added description
                status: 'Available', // Default status as DB doesn't have this field yet
                capacity: capacityNum > 0 ? capacityNum : hall.capacity, // Fallback to string if parse fails
                dailyRate: priceNum,
                duration: hall.duration,
                hourlyRate: 0, // DB doesn't store this effectively yet
                mainImage: hall.mainImagePath,
                amenities: hall.amenities.map(a => ({
                    icon: mapIcon(a.amenityName),
                    label: a.amenityName
                })),
                suitability: hall.suitability.map(s => s.eventType),
                galleryImages: hall.galleryImages.map(img => img.imagePath),
                videos: hall.videos.map(vid => vid.videoPath),
                addOns: hall.addOns.map(addon => ({
                    name: addon.name,
                    price: String(addon.price),
                    unit: addon.unit ?? undefined
                }))
            };
        });
    } catch (error) {
        console.error("Failed to fetch facilities:", error);
        return [];
    }
}

export default async function HallsPage() {
    const facilities = await getFacilities();
    console.log(`[HallsPage] Fetched ${facilities.length} halls`);

    return (
        <>
            <Header />
            <div style={{ padding: '32px' }}>
                <HallGrid facilities={facilities} />
            </div>
        </>
    );
}
