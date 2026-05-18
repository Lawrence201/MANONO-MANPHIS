const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkBooking() {
  try {
    const bookings = await prisma.billboardBooking.findMany({
      include: {
        billboard: true
      }
    });
    console.log(JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error('Error fetching billboard bookings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBooking();
