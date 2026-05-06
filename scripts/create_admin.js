const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'lawrenceantwi63@gmail.com';
    const password = 'elder100';

    try {
        console.log(`Hashing password for ${email}...`);
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Upserting admin user...');
        const admin = await prisma.admin.upsert({
            where: { email: email },
            update: {
                password: hashedPassword,
            },
            create: {
                email: email,
                password: hashedPassword,
            },
        });

        console.log('Admin account created/updated successfully:');
        console.log({
            id: admin.id,
            email: admin.email,
            createdAt: admin.createdAt,
        });

    } catch (error) {
        console.error('Error creating admin account:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
