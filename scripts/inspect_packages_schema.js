
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Inspecting 'packages' table schema...");
        // For MySQL
        const columns = await prisma.$queryRaw`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'packages';
    `;
        console.log(columns);
    } catch (e) {
        console.error("Error inspecting schema:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
