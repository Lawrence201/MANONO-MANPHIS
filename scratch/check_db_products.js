const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({});
  console.log("Database Products:");
  products.forEach(p => {
    console.log(`ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: ${p.pricePerUnit}, Stock: ${p.stockQuantity}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
