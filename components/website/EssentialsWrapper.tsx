import { prisma } from '@/lib/prisma';
import Essentials from './Essentials';

// Force dynamic rendering to get fresh random halls on each request
export const dynamic = 'force-dynamic';

export default async function EssentialsWrapper() {
    // Fetch all halls with their main image path, then randomly pick 2 distinct ones
    const halls = await prisma.hall.findMany({
        select: {
            id: true,
            name: true,
            mainImagePath: true,
            galleryImages: {
                select: {
                    imagePath: true
                },
                take: 1 // Get at least one gallery image as fallback
            }
        }
    });

    // Shuffle the halls array to get random order
    const shuffled = halls.sort(() => Math.random() - 0.5);

    // Pick the first two distinct halls
    const hall1 = shuffled[0];
    const hall2 = shuffled[1] || shuffled[0]; // Fallback to first if only one hall exists

    // Determine the image to use (mainImagePath or first gallery image)
    const getImage = (hall: typeof hall1) => {
        if (hall?.mainImagePath) return hall.mainImagePath;
        if (hall?.galleryImages?.[0]?.imagePath) return hall.galleryImages[0].imagePath;
        return '/images/halls/Agape.avif'; // Ultimate fallback
    };

    const image1 = getImage(hall1);
    const image2 = getImage(hall2);

    return <Essentials image1={image1} image2={image2} />;
}
