import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'lawrenceantwi@gmail.com'
    const passwordRaw = 'elder100'
    const hashedPassword = await bcrypt.hash(passwordRaw, 10)

    console.log(`Seeding admin user: ${email}...`)

    const admin = await prisma.admin.upsert({
        where: { email },
        update: {
            password: hashedPassword,
        },
        create: {
            name: 'Admin',
            email,
            password: hashedPassword,
        },
    })

    console.log('Admin user created/updated:', admin.email)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
