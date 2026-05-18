const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkData() {
  const billboard = await prisma.billboard.findUnique({
    where: { id: 6 }
  });
  console.log('BILLBOARD DATA:', JSON.stringify(billboard, null, 2));
  process.exit(0);
}

checkData();
