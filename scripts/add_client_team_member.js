
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addClientTeamMember() {
  const name = "Lawrence";
  const email = "lawrenceantwi63@gmail.com";

  console.log(`Adding ${name} (${email}) to ClientTeam...`);

  try {
    const newMember = await prisma.clientTeam.upsert({
      where: { email },
      update: { name },
      create: { name, email },
    });
    console.log('SUCCESS: Member added/updated:', newMember);
  } catch (error) {
    console.error('FAILED to add member:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

addClientTeamMember();
