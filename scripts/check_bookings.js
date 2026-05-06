const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const bookings = await prisma.hallBooking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
            bookedHalls: {
                include: { hall: true }
            }
        }
    });
    console.log(JSON.stringify(bookings, null, 2));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
