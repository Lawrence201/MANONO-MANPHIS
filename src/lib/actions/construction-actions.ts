"use server";

import { prisma as db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary";

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

export async function getConstructionProjects() {
  try {
    const projects = await db.constructionProject.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        galleryImages: true,
      },
    });
    return { success: true, projects };
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return { success: false, error: error.message || "Failed to fetch projects" };
  }
}

export async function createConstructionProject(data: any) {
  try {
    const { galleryImages, ...projectData } = data;
    
    // Check if slug is unique
    const existing = await db.constructionProject.findUnique({
      where: { slug: projectData.slug }
    });
    if (existing) {
      return { success: false, error: "A project with this slug already exists. Please choose a different title or slug." };
    }

    const project = await db.constructionProject.create({
      data: {
        ...projectData,
        galleryImages: {
          create: galleryImages?.map((url: string) => ({
            imagePath: url
          })) || []
        }
      }
    });
    
    return { success: true, project };
  } catch (error: any) {
    console.error("Error creating project:", error);
    return { success: false, error: error.message || "Failed to create project" };
  }
}

export async function deleteConstructionProject(id: number) {
  try {
    await db.constructionProject.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting project:", error);
    return { success: false, error: error.message || "Failed to delete project" };
  }
}

export async function getConstructionProjectBySlug(slug: string) {
  try {
    const project = await db.constructionProject.findUnique({
      where: { slug },
      include: {
        galleryImages: true,
      },
    });
    return { success: true, project };
  } catch (error: any) {
    console.error("Error fetching project:", error);
    return { success: false, error: error.message || "Failed to fetch project" };
  }
}

export async function getConstructionProjectById(id: number) {
  try {
    const project = await db.constructionProject.findUnique({
      where: { id },
      include: {
        galleryImages: true,
      },
    });
    if (!project) return { success: false, error: "Project not found" };
    return { success: true, project };
  } catch (error: any) {
    console.error("Error fetching project by id:", error);
    return { success: false, error: error.message || "Failed to fetch project" };
  }
}

export async function updateConstructionProject(id: number, data: any) {
  try {
    const { galleryImages, ...projectData } = data;

    // Check if slug is unique to another project
    const existing = await db.constructionProject.findUnique({
      where: { slug: projectData.slug }
    });
    if (existing && existing.id !== id) {
      return { success: false, error: "A project with this slug already exists. Please choose a different title or slug." };
    }

    // Fetch the existing project to compare images
    const oldProject = await db.constructionProject.findUnique({
      where: { id },
      include: { galleryImages: true }
    });

    if (oldProject) {
      const urlsToDelete: string[] = [];
      if (oldProject.heroImage && projectData.heroImage && oldProject.heroImage !== projectData.heroImage) {
        urlsToDelete.push(oldProject.heroImage);
      }
      if (oldProject.mainImage && projectData.mainImage && oldProject.mainImage !== projectData.mainImage) {
        urlsToDelete.push(oldProject.mainImage);
      }
      const newGalleryPaths = galleryImages || [];
      oldProject.galleryImages.forEach((img: any) => {
        if (img.imagePath && !newGalleryPaths.includes(img.imagePath)) {
          urlsToDelete.push(img.imagePath);
        }
      });
      for (const url of urlsToDelete) {
        try {
          await deleteFromCloudinary(url);
        } catch (e) {
          console.error("Failed to delete old image:", url, e);
        }
      }
    }

    await db.constructionProjectGalleryImage.deleteMany({
      where: { projectId: id }
    });

    const project = await db.constructionProject.update({
      where: { id },
      data: {
        ...projectData,
        galleryImages: {
          create: galleryImages?.map((url: string) => ({
            imagePath: url
          })) || []
        }
      }
    });

    revalidatePath("/services/construction/projects");
    revalidatePath(`/services/construction/project-details/${project.slug}`);
    
    return { success: true, project };
  } catch (error: any) {
    console.error("Error updating project:", error);
    return { success: false, error: error.message || "Failed to update project" };
  }
}

export async function updateConstructionProjectStatus(id: number, status: string) {
  try {
    await db.constructionProject.update({
      where: { id },
      data: { status }
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating project status:", error);
    return { success: false, error: error.message || "Failed to update project status" };
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

    // Fetch the existing service to compare images
    const oldService = await db.constructionService.findUnique({
      where: { id },
      include: { galleryImages: true }
    });

    if (oldService) {
      const urlsToDelete: string[] = [];

      // Check if heroImage changed
      if (oldService.heroImage && serviceData.heroImage && oldService.heroImage !== serviceData.heroImage) {
        urlsToDelete.push(oldService.heroImage);
      }

      // Check if mainImage changed
      if (oldService.mainImage && serviceData.mainImage && oldService.mainImage !== serviceData.mainImage) {
        urlsToDelete.push(oldService.mainImage);
      }

      // Check gallery images: if old image is NOT in the new galleryImages array, it was deleted
      const newGalleryPaths = galleryImages || [];
      oldService.galleryImages.forEach(img => {
        if (img.imagePath && !newGalleryPaths.includes(img.imagePath)) {
          urlsToDelete.push(img.imagePath);
        }
      });

      // Delete obsolete images from storage
      for (const url of urlsToDelete) {
        try {
          await deleteFromCloudinary(url);
        } catch (e) {
          console.error("Failed to delete old image:", url, e);
        }
      }
    }

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
    // Fetch the service first to get all image URLs
    const service = await db.constructionService.findUnique({
      where: { id },
      include: { galleryImages: true }
    });

    if (service) {
      const urlsToDelete: string[] = [];
      if (service.heroImage) urlsToDelete.push(service.heroImage);
      if (service.mainImage) urlsToDelete.push(service.mainImage);
      service.galleryImages.forEach(img => {
        if (img.imagePath) urlsToDelete.push(img.imagePath);
      });

      // Delete all media from Cloudinary/Local storage
      for (const url of urlsToDelete) {
        try {
          await deleteFromCloudinary(url);
        } catch (e) {
          console.error("Failed to delete image during service deletion:", url, e);
        }
      }
    }

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

