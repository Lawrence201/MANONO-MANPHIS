const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkHallDetails() {
    const halls = await prisma.hall.findMany({
        include: {
            amenities: true,
            galleryImages: true
        }
    });

    console.log('=== HALLS DATA ===');
    halls.forEach(hall => {
        console.log(`ID: ${hall.id}`);
        console.log(`Name: ${hall.name}`);
        console.log(`mainImagePath: ${hall.mainImagePath}`);
        console.log(`Amenities: ${hall.amenities.length}`);
        console.log(`Gallery Images: ${hall.galleryImages.length}`);
        console.log('---');
    });

    // Also check raw data
    const rawHall = await prisma.$queryRaw`SELECT * FROM halls LIMIT 1`;
    console.log('\n=== RAW SQL DATA ===');
    console.log(rawHall);

    await prisma.$disconnect();
}

checkHallDetails().catch(console.error);
