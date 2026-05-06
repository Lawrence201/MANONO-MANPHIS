
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
    console.log('--- Database Schema Check ---');
    try {
        console.log('Checking Client table...');
        const clientCount = await prisma.client.count();
        console.log('SUCCESS: Client count is', clientCount);
        
        console.log('Checking Admin table...');
        const adminCount = await prisma.admin.count();
        console.log('SUCCESS: Admin count is', adminCount);

        const firstClient = await prisma.client.findFirst();
        console.log('First Client Name:', firstClient ? firstClient.name : 'NONE');
    } catch (error) {
        console.error('FAILED:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
