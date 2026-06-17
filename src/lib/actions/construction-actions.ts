"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createConstructionService(data: any) {
  try {
    const { galleryImages, ...serviceData } = data;

    // Default values for nested JSON if not provided
    const subServices = serviceData.subServices || [
      { title: "Quality Workmanship", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Award" },
      { title: "Project Management", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Briefcase" },
      { title: "Certified Professionals", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "UserCheck" }
    ];

    const service = await db.constructionService.create({
      data: {
        ...serviceData,
        subServices: subServices,
        galleryImages: {
          create: galleryImages?.map((path: string) => ({
            imagePath: path
          })) || []
        }
      }
    });

    revalidatePath("/services/construction");
    revalidatePath("/services/construction/services");
    revalidatePath(`/services/construction/service-details`);
    
    return { success: true, service };
  } catch (error: any) {
    console.error("Error creating construction service:", error);
    return { success: false, error: error.message || "Failed to create service." };
  }
}

export async function getConstructionServices() {
  try {
    const services = await db.constructionService.findMany({
      orderBy: { createdAt: "desc" }
    });
    return { success: true, services };
  } catch (error: any) {
    console.error("Error fetching construction services:", error);
    return { success: false, error: "Failed to fetch services." };
  }
}

export async function getConstructionServiceBySlug(slug: string) {
  try {
    const service = await db.constructionService.findUnique({
      where: { slug },
      include: {
        galleryImages: true
      }
    });
    
    if (!service) {
      return { success: false, error: "Service not found." };
    }
    
    return { success: true, service };
  } catch (error: any) {
    console.error("Error fetching construction service:", error);
    return { success: false, error: "Failed to fetch service." };
  }
}

export async function getConstructionServiceById(id: number) {
  try {
    const service = await db.constructionService.findUnique({
      where: { id },
      include: {
        galleryImages: true
      }
    });
    
    if (!service) {
      return { success: false, error: "Service not found." };
    }
    
    return { success: true, service };
  } catch (error: any) {
    console.error("Error fetching construction service by id:", error);
    return { success: false, error: "Failed to fetch service." };
  }
}

export async function updateConstructionService(id: number, data: any) {
  try {
    const { galleryImages, ...serviceData } = data;

    // Delete existing gallery images first (since we will recreate the new set)
    await db.constructionGalleryImage.deleteMany({
      where: { serviceId: id }
    });

    const service = await db.constructionService.update({
      where: { id },
      data: {
        ...serviceData,
        galleryImages: {
          create: galleryImages?.map((path: string) => ({
            imagePath: path
          })) || []
        }
      }
    });

    revalidatePath("/services/construction");
    revalidatePath("/services/construction/services");
    revalidatePath(`/services/construction/service-details`);
    revalidatePath("/inventory/construction");
    
    return { success: true, service };
  } catch (error: any) {
    console.error("Error updating construction service:", error);
    return { success: false, error: error.message || "Failed to update service." };
  }
}

export async function deleteConstructionService(id: number) {
  try {
    await db.constructionService.delete({
      where: { id }
    });

    revalidatePath("/services/construction");
    revalidatePath("/services/construction/services");
    revalidatePath(`/services/construction/service-details`);
    revalidatePath("/inventory/construction");
    
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting construction service:", error);
    return { success: false, error: "Failed to delete service." };
  }
}

