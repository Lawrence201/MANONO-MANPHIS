const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBillboard() {
  try {
    const billboards = await prisma.billboard.findMany({
      where: {
        name: {
          contains: 'Accra - Legon Campus (Screen inside Volta Hall)'
        }
      },
      select: {
        name: true,
        category: true,
        aspectRatio: true,
        dimensions: true
      }
    });
    console.log(JSON.stringify(billboards, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBillboard();
