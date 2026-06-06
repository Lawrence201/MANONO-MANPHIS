"use server";

import { prisma } from "@/lib/prisma";
import { BillboardSchema, type BillboardInput } from "@/lib/schemas/billboard";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function createBillboard(data: BillboardInput) {
  try {
    // 1. Validate data
    const validatedData = BillboardSchema.parse(data);

    // 2. Create Billboard in database
    const billboard = await prisma.billboard.create({
      data: {
        name: validatedData.name,
        assetCode: validatedData.assetCode,
        category: validatedData.category,
        description: validatedData.description,
        city: validatedData.city,
        address: validatedData.address,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        screenType: validatedData.screenType,
        resolution: validatedData.resolution,
        dimensions: validatedData.dimensions,
        brightness: validatedData.brightness,
        aspectRatio: validatedData.aspectRatio,
        wakeTime: validatedData.wakeTime,
        sleepTime: validatedData.sleepTime,
        maxSlots: validatedData.maxSlots,
        slotDuration: validatedData.slotDuration,
        weeklyRate: validatedData.weeklyRate,
        taxRate: validatedData.taxRate,
        minDuration: validatedData.minDuration,
        trafficVolume: validatedData.trafficVolume,
        audienceTags: validatedData.audienceTags,
        featureImage: validatedData.featureImage,
        videoShowcase: validatedData.videoShowcase,
        galleryImages: {
          create: validatedData.galleryImages?.map((path) => ({
            imagePath: path,
          })),
        },
      },
    });

    // 3. Serialize data for Client Component (Decimal -> Number)
    const serializedBillboard = {
      ...billboard,
      latitude: billboard.latitude ? Number(billboard.latitude) : null,
      longitude: billboard.longitude ? Number(billboard.longitude) : null,
      weeklyRate: Number(billboard.weeklyRate),
      taxRate: Number(billboard.taxRate),
      createdAt: billboard.createdAt.toISOString(),
      updatedAt: billboard.updatedAt.toISOString(),
    };

    revalidatePath("/inventory/billboards");
    
    return { success: true, data: serializedBillboard };
  } catch (error: any) {
    console.error("Failed to create billboard:", error);
    if (error?.code === 'P2002') {
      return { 
        success: false, 
        error: "A billboard with this Asset Code already exists. Please generate a new unique code and try again." 
      };
    }
    return { 
      success: false, 
      error: error.message || "Failed to create billboard. Please try again." 
    };
  }
}

export async function getBillboards() {
  try {
    const billboards = await prisma.billboard.findMany({
      include: {
        galleryImages: true,
        bookings: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Serialize for Client Component
    const serialized = billboards.map((b) => {
      const now = new Date();
      const bookedSlots = b.bookings?.reduce((sum: number, bk: any) => {
        if (bk.status === 'completed' || bk.status === 'cancelled' || bk.status === 'rejected') return sum;
        if (now < bk.startDate || now > bk.endDate) return sum;
        return sum + bk.slotsRequested;
      }, 0) || 0;
      const remainingSlots = Math.max(0, (b.maxSlots || 12) - bookedSlots);

      return {
        ...b,
        availableSlots: remainingSlots,
        latitude: b.latitude ? Number(b.latitude) : null,
        longitude: b.longitude ? Number(b.longitude) : null,
        weeklyRate: Number(b.weeklyRate),
        taxRate: Number(b.taxRate),
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        bookings: b.bookings?.map((bk: any) => ({
          ...bk,
          totalPrice: Number(bk.totalPrice),
          taxRate: Number(bk.taxRate),
          startDate: bk.startDate.toISOString(),
          endDate: bk.endDate.toISOString(),
          createdAt: bk.createdAt.toISOString(),
          updatedAt: bk.updatedAt.toISOString(),
        })) || [],
      };
    });

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch billboards:", error);
    return { success: false, error: "Failed to fetch inventory" };
  }
}

export async function getBillboard(id: number) {
  try {
    const billboard = await prisma.billboard.findUnique({
      where: { id },
      include: {
        galleryImages: true,
        bookings: true,
      },
    });

    if (!billboard) return { success: false, error: "Billboard not found" };

    const now = new Date();
    const bookedSlots = billboard.bookings?.reduce((sum: number, bk: any) => {
      if (bk.status === 'cancelled' || bk.status === 'completed' || bk.status === 'rejected') return sum;
      if (now < bk.startDate || now > bk.endDate) return sum;
      return sum + bk.slotsRequested;
    }, 0) || 0;
    const remainingSlots = Math.max(0, (billboard.maxSlots || 12) - bookedSlots);

    // Serialize for Client Component
    const serialized = {
      ...billboard,
      availableSlots: remainingSlots,
      latitude: billboard.latitude ? Number(billboard.latitude) : null,
      longitude: billboard.longitude ? Number(billboard.longitude) : null,
      weeklyRate: Number(billboard.weeklyRate),
      taxRate: Number(billboard.taxRate),
      createdAt: billboard.createdAt.toISOString(),
      updatedAt: billboard.updatedAt.toISOString(),
      bookings: billboard.bookings?.map((bk: any) => ({
        ...bk,
        totalPrice: Number(bk.totalPrice),
        taxRate: Number(bk.taxRate),
        startDate: bk.startDate.toISOString(),
        endDate: bk.endDate.toISOString(),
        createdAt: bk.createdAt.toISOString(),
        updatedAt: bk.updatedAt.toISOString(),
      })) || [],
    };

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch billboard:", error);
    return { success: false, error: "Failed to fetch Bill Board details" };
  }
}

export async function updateBillboard(id: number, data: BillboardInput) {
  try {
    // 1. Fetch current data to check for media changes
    const current = await prisma.billboard.findUnique({
      where: { id },
      include: { galleryImages: true }
    });

    if (!current) throw new Error("Billboard not found");

    // 2. Validate new data
    const validatedData = BillboardSchema.parse(data);

    // 3. Identify files to delete
    const filesToDelete: string[] = [];

    // Check feature image
    if (current.featureImage && current.featureImage !== validatedData.featureImage) {
      filesToDelete.push(current.featureImage);
    }

    // Check video showcase
    if (current.videoShowcase && current.videoShowcase !== validatedData.videoShowcase) {
      filesToDelete.push(current.videoShowcase);
    }

    // Check gallery images
    const currentGallery = current.galleryImages.map(img => img.imagePath);
    const newGallery = validatedData.galleryImages || [];
    
    currentGallery.forEach(oldPath => {
      if (!newGallery.includes(oldPath)) {
        filesToDelete.push(oldPath);
      }
    });

    // 4. Update Billboard in database
    await prisma.$transaction([
      // Delete old gallery relations
      prisma.billboardGalleryImage.deleteMany({
        where: { billboardId: id }
      }),
      // Update the billboard and create new gallery relations
      prisma.billboard.update({
        where: { id },
        data: {
          name: validatedData.name,
          assetCode: validatedData.assetCode,
          category: validatedData.category,
          description: validatedData.description,
          city: validatedData.city,
          address: validatedData.address,
          latitude: validatedData.latitude,
          longitude: validatedData.longitude,
          screenType: validatedData.screenType,
          resolution: validatedData.resolution,
          dimensions: validatedData.dimensions,
          brightness: validatedData.brightness,
          aspectRatio: validatedData.aspectRatio,
          wakeTime: validatedData.wakeTime,
          sleepTime: validatedData.sleepTime,
          maxSlots: validatedData.maxSlots,
          slotDuration: validatedData.slotDuration,
          weeklyRate: validatedData.weeklyRate,
          taxRate: validatedData.taxRate,
          minDuration: validatedData.minDuration,
          trafficVolume: validatedData.trafficVolume,
          audienceTags: validatedData.audienceTags,
          featureImage: validatedData.featureImage,
          videoShowcase: validatedData.videoShowcase,
          galleryImages: {
            create: validatedData.galleryImages?.map((path) => ({
              imagePath: path,
            })),
          },
        },
      })
    ]);

    // 5. Clean up old files from local storage
    for (const path of filesToDelete) {
      await deleteFromCloudinary(path);
    }

    revalidatePath("/inventory/billboards");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update billboard:", error);
    return { 
      success: false, 
      error: error.message || "Failed to update billboard. Please try again." 
    };
  }
}

export async function deleteBillboard(id: number) {
  try {
    // 1. Fetch media paths before deletion
    const billboard = await prisma.billboard.findUnique({
      where: { id },
      include: { galleryImages: true },
    });

    if (!billboard) return { success: false, error: "Billboard not found" };

    // 2. Identify all files to delete
    const filesToDelete: string[] = [];
    if (billboard.featureImage) filesToDelete.push(billboard.featureImage);
    if (billboard.videoShowcase) filesToDelete.push(billboard.videoShowcase);
    billboard.galleryImages.forEach(img => filesToDelete.push(img.imagePath));

    // 3. Delete from database (Cascades will handle relations)
    await prisma.billboard.delete({
      where: { id },
    });

    // 4. Delete physical files from local storage
    for (const path of filesToDelete) {
      await deleteFromCloudinary(path);
    }

    revalidatePath("/inventory/billboards");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete billboard:", error);
    return { success: false, error: "Failed to delete billboard" };
  }
}
