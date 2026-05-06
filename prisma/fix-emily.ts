import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function fixEmilyAdmin() {
    try {
        console.log('Fixing Emily admin credentials...');

        // Delete existing Emily if any
        await prisma.admin.deleteMany({
            where: {
                OR: [
                    { email: 'Emily@campelimafrica.org' },
                    { email: 'emily@campelimafrica.org' }
                ]
            }
        });
        console.log('Deleted any existing Emily records');

        // Create Emily with lowercase email (standard practice)
        const emily = await prisma.admin.create({
            data: {
                name: 'Emily',
                email: 'emily@campelimafrica.org',
                password: await bcrypt.hash('0duraa@DM!N_(cea2026)*', 10),
            },
        });
        console.log('✅ Created Emily:', emily.email);
        console.log('Password: 0duraa@DM!N_(cea2026)*');

        console.log('\n✨ Emily admin fixed successfully!');
    } catch (error) {
        console.error('❌ Error fixing Emily admin:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

fixEmilyAdmin()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
