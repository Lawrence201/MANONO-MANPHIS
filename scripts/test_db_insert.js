
// Removed undici require
// Actually in Node 18+ FormData is available globally or via headers construction.
// To avoid complex deps, let's just use Prisma to emulate what the API does for the DB part, 
// OR simpler: just try to INSERT with a script.
// If the DB insert works here, then the issue is in the API handling (files/forms).
// Let's try to replicate the exact SQL command first.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Attempting raw SQL insert...");
    try {
        const name = "Test Package";
        const description = "Test Desc";
        const capacity = "100";
        const price = "5000";
        const duration = "1 Day";
        // image paths can be null or string
        const mainImagePath = null;
        const contactName = "Test Contact";
        const contactEmail = "test@test.com";
        const contactPhone = "1234567890";
        const contactImagePath = null;

        await prisma.$executeRaw`
            INSERT INTO packages (
                name, description, capacity, price, duration, main_image_path, 
                contact_name, contact_email, contact_phone, contact_image_path,
                created_at, updated_at
            ) VALUES (
                ${name}, ${description}, ${capacity}, ${price}, ${duration}, ${mainImagePath},
                ${contactName}, ${contactEmail}, ${contactPhone}, ${contactImagePath},
                NOW(), NOW()
            )
        `;
        console.log("Insert successful!");

        // Clean up
        // await prisma.$executeRaw`DELETE FROM packages WHERE name = ${name}`;
    } catch (e) {
        console.error("Insert failed:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
