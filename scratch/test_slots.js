const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const billboard = await prisma.billboard.findUnique({
    where: { id: 7 },
    include: { bookings: true }
  });

  const bookedSlots = billboard.bookings?.reduce((sum, bk) => {
    if (bk.status === 'cancelled') return sum;
    return sum + bk.slotsRequested;
  }, 0) || 0;

  const remainingSlots = Math.max(0, (billboard.maxSlots || 12) - bookedSlots);

  console.log('Slots Check:', {
    name: billboard.name,
    maxSlots: billboard.maxSlots,
    bookedSlots: bookedSlots,
    remainingSlots: remainingSlots
  });
}

run().catch(console.error).finally(() => prisma.$disconnect());
