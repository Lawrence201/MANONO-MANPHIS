import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Header from '@/components/admin/Header';
import PackageForm from '@/components/admin/PackageForm';

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const packageId = parseInt(id);

    if (isNaN(packageId)) {
        notFound();
    }

    // Fetch package using Raw SQL
    const packages = await prisma.$queryRaw`SELECT * FROM packages WHERE id = ${packageId}` as any[];
    const rawPackage = packages[0];

    if (!rawPackage) {
        notFound();
    }

    // Fetch relations
    const features = await prisma.$queryRaw`SELECT * FROM package_features WHERE package_id = ${packageId}` as any[];
    const suitability = await prisma.$queryRaw`SELECT * FROM package_suitability WHERE package_id = ${packageId}` as any[];
    const galleryImages = await prisma.$queryRaw`SELECT id, image_path as "imagePath" FROM package_gallery_images WHERE package_id = ${packageId}` as any[];
    const videos = await prisma.$queryRaw`SELECT id, video_path as "videoPath", video_type as "videoType" FROM package_gallery_videos WHERE package_id = ${packageId}` as any[];
    const addOns = await prisma.$queryRaw`SELECT * FROM package_addons WHERE package_id = ${packageId}` as any[];

    const pkg = {
        ...rawPackage,
        // Map snake_case to camelCase
        mainImagePath: rawPackage.main_image_path || rawPackage.mainImagePath,
        contactName: rawPackage.contact_name,
        contactEmail: rawPackage.contact_email,
        contactPhone: rawPackage.contact_phone,
        contactImage: rawPackage.contact_image_path,

        features: features.map((f: any) => ({ featureName: f.feature_name })),
        suitability: suitability.map((s: any) => ({ eventType: s.event_type })),
        galleryImages,
        videos,
        addOns
    };

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Header />
            <div style={{ padding: '0 32px' }}>
                <div style={{ marginTop: '32px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', marginBottom: '24px' }}>
                        Edit Package: {pkg.name}
                    </h1>
                    <PackageForm initialData={pkg} />
                </div>
            </div>
        </div>
    );
}
