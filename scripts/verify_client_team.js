
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyClientTeam() {
  console.log('Verifying ClientTeam table...');
  try {
    const members = await prisma.clientTeam.findMany();
    console.log('Current ClientTeam members:');
    members.forEach(m => console.log(`- ${m.name} (${m.email})`));
  } catch (error) {
    console.error('FAILED to verify:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyClientTeam();
