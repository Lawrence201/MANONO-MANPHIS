const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    console.log('Today (UTC):', today.toISOString());

    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'PRESENT (Masked)' : 'MISSING');

    const halls = await prisma.hall.findMany({
        where: { id: 8 },

        include: {
            bookedHalls: {
                include: {
                    booking: true
                }
            }
        }
    });

    console.log('--- TARGET HALL DATA (ID 1) ---');
    for (const hall of halls) {
        console.log(`Hall: ${hall.name} (ID: ${hall.id})`);
        console.log(`  Total BookedHalls: ${hall.bookedHalls.length}`);
        for (const bh of hall.bookedHalls) {
            console.log(`    Booking Ref: ${bh.booking.reference}`);
            console.log(`    Status: "${bh.booking.paymentStatus}"`);
            console.log(`    EventDate: ${bh.booking.eventDate.toISOString()}`);
            console.log(`    Is >= Today: ${bh.booking.eventDate >= today}`);
        }
    }
}



main().catch(console.error).finally(() => prisma.$disconnect());
