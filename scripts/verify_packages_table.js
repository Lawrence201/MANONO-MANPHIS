
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Checking if 'packages' table exists...");
        // Just try to select 1 to see if table exists
        await prisma.$queryRaw`SELECT 1 FROM packages LIMIT 1`;
        console.log("Success: 'packages' table exists.");
    } catch (e) {
        console.error("Error: 'packages' table check failed.");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
