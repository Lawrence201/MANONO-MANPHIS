import Header from '@/components/admin/Header';
import PackageGrid, { PackageData } from '@/components/admin/PackageGrid';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getSpecialPackages(): Promise<PackageData[]> {
    try {
        // Professional Prisma Client approach with includes (like halls page)
        const packages = await prisma.package.findMany({
            where: {
                packageType: 'special'
            },
            include: {
                features: true,
                suitability: true,
                galleryImages: true,
                videos: true,
                addOns: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Map to the PackageData interface expected by PackageGrid
        return packages.map(pkg => {
            // Helper to map feature names to icons
            const mapIcon = (name: string) => {
                const lower = name.toLowerCase();
                if (lower.includes('photo') || lower.includes('camera')) return 'camera';
                if (lower.includes('music') || lower.includes('dj') || lower.includes('sound')) return 'music';
                if (lower.includes('food') || lower.includes('buffet') || lower.includes('catering')) return 'utensils';
                if (lower.includes('security')) return 'shield';
                if (lower.includes('stream') || lower.includes('video')) return 'video';
                if (lower.includes('wifi') || lower.includes('internet')) return 'wifi';
                if (lower.includes('light')) return 'lightbulb';
                if (lower.includes('ac') || lower.includes('condition')) return 'wind';
                if (lower.includes('projector')) return 'projector';
                if (lower.includes('mic')) return 'mic';
                if (lower.includes('speaker')) return 'speaker';
                return 'package';
            };

            return {
                id: pkg.id.toString(),
                name: pkg.name,
                description: pkg.description,
                capacity: pkg.capacity,
                price: pkg.price,
                duration: pkg.duration,
                mainImagePath: pkg.mainImagePath,
                features: pkg.features.map(f => ({
                    icon: mapIcon(f.featureName),
                    label: f.featureName
                })),
                suitability: pkg.suitability.map(s => s.eventType),
                galleryImages: pkg.galleryImages.map(img => img.imagePath),
                videos: pkg.videos.map(vid => vid.videoPath),
                addOns: pkg.addOns.map(addon => ({
                    name: addon.name,
                    price: addon.price,
                    unit: addon.unit || 'Item'
                }))
            };
        });
    } catch (error) {
        console.error("Failed to fetch special packages:", error);
        return [];
    }
}

export default async function SpecialPackagesPage() {
    const packages = await getSpecialPackages();
    console.log(`[SpecialPackagesPage] Fetched ${packages.length} special packages`);

    return (
        <>
            <Header />
            <div style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>Special Packages</h1>
                        <p style={{ color: '#6B7280', marginTop: '4px' }}>Manage your special event packages.</p>
                    </div>
                    <Link
                        href="/admin/add-special-packages"
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            backgroundColor: '#2563EB', color: 'white',
                            padding: '12px 20px', borderRadius: '10px',
                            fontWeight: 600, textDecoration: 'none',
                            boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
                        }}
                    >
                        <Plus size={20} /> Add Special Package
                    </Link>
                </div>

                <PackageGrid packages={packages} />
            </div>
        </>
    );
}
