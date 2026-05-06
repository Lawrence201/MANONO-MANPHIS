const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
    const hallCount = await prisma.hall.count();
    const hostelCount = await prisma.hostel.count();
    const packageCount = await prisma.package.count();

    console.log('Database content:');
    console.log('- Halls:', hallCount);
    console.log('- Hostels:', hostelCount);
    console.log('- Packages:', packageCount);

    if (hallCount > 0) {
        const halls = await prisma.hall.findMany({ select: { id: true, name: true, mainImagePath: true } });
        console.log('\nHalls:', halls);
    }

    await prisma.$disconnect();
}

checkData().catch(console.error);
