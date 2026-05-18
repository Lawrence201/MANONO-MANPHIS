const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBillboardFormat() {
  try {
    const billboards = await prisma.billboard.findMany({
      where: {
        name: {
          contains: 'Tetteh Quarshie'
        }
      },
      select: {
        id: true,
        name: true,
        assetCode: true,
        aspectRatio: true,
        screenType: true,
        resolution: true,
        dimensions: true,
        brightness: true
      }
    });
    console.log('--- DATABASE QUERY RESULT ---');
    console.log(JSON.stringify(billboards, null, 2));
    console.log('-----------------------------');
  } catch (error) {
    console.error('Error fetching billboard:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBillboardFormat();
