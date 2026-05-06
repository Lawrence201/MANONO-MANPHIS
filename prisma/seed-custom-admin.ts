import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'admin@gmail.com'
    const passwordRaw = 'password123'
    const hashedPassword = await bcrypt.hash(passwordRaw, 10)

    console.log(`Seeding custom admin user: ${email}...`)

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {
            password: hashedPassword,
        },
        create: {
            name: 'System Admin',
            email,
            password: hashedPassword,
        },
    })

    console.log('✅ Admin user created/updated:', admin.email)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Error seeding custom admin:', e)
        await prisma.$disconnect()
        process.exit(1)
    })
