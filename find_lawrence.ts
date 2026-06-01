import { prisma } from "./src/lib/prisma";

async function main() {
  const orders = await prisma.exportOrder.findMany({
    where: {
      OR: [
        { companyName: { contains: 'Lawrence', mode: 'insensitive' } },
        { buyerType: { contains: 'Lawrence', mode: 'insensitive' } },
        { email: { contains: 'Lawrence', mode: 'insensitive' } }
      ]
    },
    include: { product: true }
  });

  if (orders.length > 0) {
    console.log("Found orders for Lawrence:");
    orders.forEach(o => {
      console.log(`- Product: ${o.product?.name}`);
      console.log(`- Tracking ID (Reference): ${o.referenceNumber}`);
      console.log(`- Status: ${o.status}`);
      console.log('---');
    });
  } else {
    console.log("Couldn't find Lawrence by company name. Listing last 5 orders:");
    const recent = await prisma.exportOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    recent.forEach(o => {
      console.log(`- Company: ${o.companyName}`);
      console.log(`- Tracking ID: ${o.referenceNumber}`);
      console.log(`- Status: ${o.status}`);
      console.log('---');
    });
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
