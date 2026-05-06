const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load .env.local explicitly
const envLocalPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envLocalPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
    console.log('Loaded .env.local settings');
}

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'lawrenceantwi63@gmail.com';
    const password = 'elder@100';
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log(`Using Database URL: ${process.env.DATABASE_URL}`);
    console.log(`Seeding admin user: ${email}`);

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {
            password: hashedPassword,
        },
        create: {
            email,
            name: 'Lawrence Antwi',
            password: hashedPassword,
        },
    });

    console.log('Admin user seeded successfully:', admin);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
