const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const halls = await prisma.hall.findMany({
        select: { id: true, name: true, mainImagePath: true }
    });
    console.log('=== Hall Main Images ===');
    console.log(JSON.stringify(halls, null, 2));

    const galleryImages = await prisma.hallGalleryImage.findMany({
        take: 20,
        select: { id: true, hallId: true, imagePath: true }
    });
    console.log('\n=== Gallery Images ===');
    console.log(JSON.stringify(galleryImages, null, 2));
}

main()
    .then(() => prisma.$disconnect())
    .catch(e => { console.error(e); prisma.$disconnect(); });
