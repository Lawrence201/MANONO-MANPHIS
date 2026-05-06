const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const halls = await prisma.hall.findMany()
  const hostels = await prisma.hostel.findMany()
  const packages = await prisma.package.findMany()
  const hallSuitability = await prisma.hallSuitability.findMany()

  console.log("Checking Halls...")
  halls.forEach(h => {
    if (h.description && h.description.toLowerCase().includes('funeral')) console.log(`Found in Hall: ${h.name}`)
  })

  console.log("Checking Hostels...")
  hostels.forEach(h => {
    if (h.description && h.description.toLowerCase().includes('funeral')) console.log(`Found in Hostel: ${h.name}`)
  })

  console.log("Checking Packages...")
  packages.forEach(p => {
    if (p.description && p.description.toLowerCase().includes('funeral')) console.log(`Found in Package: ${p.name}`)
  })

  console.log("Checking Hall Suitability...")
  hallSuitability.forEach(s => {
    if (s.eventType && s.eventType.toLowerCase().includes('funeral')) console.log(`Found in Hall Suitability: ${s.eventType}`)
  })
  
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
