const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBillboard() {
  try {
    const billboard = await prisma.billboard.findFirst({
      where: {
        name: {
          contains: 'Accra - Legon Campus (Screen inside Volta Hall)'
        }
      }
    });
    console.log(JSON.stringify(billboard, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBillboard();
