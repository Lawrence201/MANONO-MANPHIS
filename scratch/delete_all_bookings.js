const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting booking database cleanup...");

  // 1. Delete Billboard bookings
  const deletedBillboards = await prisma.billboardBooking.deleteMany();
  console.log(`- Deleted ${deletedBillboards.count} Billboard bookings.`);

  // 2. Delete Hostel bookings
  const deletedHostels = await prisma.hostelBooking.deleteMany();
  console.log(`- Deleted ${deletedHostels.count} Hostel bookings.`);

  // 3. Delete Hall bookings
  const deletedHalls = await prisma.hallBooking.deleteMany();
  console.log(`- Deleted ${deletedHalls.count} Hall bookings.`);

  // 4. Delete Package bookings
  const deletedPackages = await prisma.packageBooking.deleteMany();
  console.log(`- Deleted ${deletedPackages.count} Package bookings.`);

  console.log("✨ All booking tables have been successfully cleared!");
}

main()
  .catch((e) => {
    console.error("❌ Error deleting bookings:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
