import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixIcon() {
  const service = await prisma.constructionService.findUnique({
    where: { slug: 'commercial-construction' }
  });

  if (service && service.iconSvg) {
    const fixedSvg = service.iconSvg.replace('className=', 'class=');
    await prisma.constructionService.update({
      where: { slug: 'commercial-construction' },
      data: { iconSvg: fixedSvg }
    });
    console.log("Fixed SVG for commercial-construction.");
  } else {
    console.log("Service not found or no icon SVG.");
  }
}

fixIcon()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
