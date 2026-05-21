const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.billboardBooking.findMany();
  console.log("Found billboard bookings:", bookings.length);
  if (bookings.length > 0) {
    console.log(JSON.stringify(bookings, null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
