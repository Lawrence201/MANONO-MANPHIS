const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteBillboard8() {
  try {
    // 1. Delete associated gallery images first
    await prisma.billboardGalleryImage.deleteMany({
      where: { billboardId: 8 }
    });
    
    // 2. Delete the billboard
    const deleted = await prisma.billboard.delete({
      where: { id: 8 }
    });
    
    console.log('Successfully deleted Billboard:', deleted.name);
  } catch (error) {
    console.error('Error deleting billboard:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

deleteBillboard8();
