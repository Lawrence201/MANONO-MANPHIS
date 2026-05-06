import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmins() {
    try {
        console.log('Starting admin seed...');

        // Admin 1: Lawrence
        const lawrence = await prisma.admin.upsert({
            where: { email: 'lawrenceantwi63@gmail.com' },
            update: {},
            create: {
                name: 'Lawrence',
                email: 'lawrenceantwi63@gmail.com',
                password: await bcrypt.hash('elder@100', 10),
            },
        });
        console.log('✅ Created/Updated Lawrence:', lawrence.email);

        // Admin 2: Emily
        const emily = await prisma.admin.upsert({
            where: { email: 'Emily@campelimafrica.org' },
            update: {},
            create: {
                name: 'Emily',
                email: 'Emily@campelimafrica.org',
                password: await bcrypt.hash('0duraa@DM!N_(cea2026)*', 10),
            },
        });
        console.log('✅ Created/Updated Emily:', emily.email);

        console.log('\\n✨ Admin seed completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding admins:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmins()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
