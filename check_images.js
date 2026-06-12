const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const b = await prisma.billboard.findMany({
        select: {
            name: true,
            featureImage: true,
            galleryImages: true
        }
    });
    console.log(JSON.stringify(b, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
