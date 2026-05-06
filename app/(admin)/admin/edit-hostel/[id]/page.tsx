import Header from '@/components/admin/Header';
import HostelForm from '@/components/admin/HostelForm';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function EditHostelPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const hostelId = parseInt(id);

    if (isNaN(hostelId)) notFound();

    // Fetch hostel using raw SQL
    // We use raw SQL because the Prisma Client might not be up to date with the new Hostel model
    const hostels = await prisma.$queryRaw`SELECT * FROM hostels WHERE id = ${hostelId}` as any[];
    const rawHostel = hostels[0];

    if (!rawHostel) notFound();

    // Fetch relations via RAW SQL
    const amenities = await prisma.$queryRaw`SELECT * FROM hostel_amenities WHERE hostel_id = ${hostelId}` as any[];
    const suitability = await prisma.$queryRaw`SELECT * FROM hostel_suitability WHERE hostel_id = ${hostelId}` as any[];
    const gallery = await prisma.$queryRaw`SELECT * FROM hostel_gallery_images WHERE hostel_id = ${hostelId}` as any[];
    const videos = await prisma.$queryRaw`SELECT * FROM hostel_gallery_videos WHERE hostel_id = ${hostelId}` as any[];
    const addOns = await prisma.$queryRaw`SELECT * FROM hostel_addons WHERE hostel_id = ${hostelId}` as any[];

    // Map DB snake_case columns to camelCase for the Form
    const hostel = {
        ...rawHostel,
        mainImagePath: rawHostel.main_image_path,
        contactName: rawHostel.contact_name,
        contactEmail: rawHostel.contact_email,
        contactPhone: rawHostel.contact_phone,
        contactImage: rawHostel.contact_image_path,
        roomQuantity: rawHostel.room_quantity,
        amenities: amenities.map((a: any) => ({ ...a, amenityName: a.amenity_name })),
        suitability: suitability.map((s: any) => ({ ...s, eventType: s.event_type })),
        galleryImages: gallery.map((g: any) => ({ ...g, imagePath: g.image_path })),
        videos: videos.map((v: any) => ({ ...v, videoPath: v.video_path, videoType: v.video_type })),
        addOns: addOns
    };

    return (
        <>
            <Header />
            <div style={{ padding: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Edit Lodge: {hostel.name}</h1>
                <HostelForm initialData={hostel} />
            </div>
        </>
    );
}
