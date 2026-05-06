const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Connecting to database...");
        const hostels = await prisma.hostel.findMany();
        console.log(`Successfully connected. Found ${hostels.length} hostels.`);
        if (hostels.length > 0) {
            console.log("Hostel Names:");
            hostels.forEach(h => console.log(`- ${h.name} (ID: ${h.id})`));
        }
    } catch (e) {
        console.error("Error querying database:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
