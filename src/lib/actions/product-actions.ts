"use server";

import { prisma } from "@/lib/prisma";
import { ProductSchema, type ProductInput } from "@/lib/schemas/product";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary";

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(data: ProductInput) {
  try {
    // 1. Validate data
    const validatedData = ProductSchema.parse(data);

    // 2. Generate unique slug
    let slug = generateSlug(validatedData.name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
    }

    // 3. Create Product in database
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug,
        category: validatedData.category,
        description: validatedData.description,
        packagingType: validatedData.packagingType,
        packagingSize: validatedData.packagingSize,
        moqValue: validatedData.moqValue,
        moqUnit: validatedData.moqUnit,
        stockQuantity: validatedData.stockQuantity,
        stockUnit: validatedData.stockUnit,
        stockStatus: validatedData.stockStatus,
        pricePerUnit: validatedData.pricePerUnit,
        priceUnitType: validatedData.priceUnitType,
        isExportReady: validatedData.isExportReady,
        exportCountries: validatedData.exportCountries,
        shippingMethods: validatedData.shippingMethods,
        isOrganic: validatedData.isOrganic,
        cashewGrade: validatedData.cashewGrade,
        moistureContent: validatedData.moistureContent,
        kernelCount: validatedData.kernelCount,
        defectRate: validatedData.defectRate,
        seasonality: validatedData.seasonality,
        sheaGrade: validatedData.sheaGrade,
        sheaFatContent: validatedData.sheaFatContent,
        purityLevel: validatedData.purityLevel,
        usageType: validatedData.usageType,
        certificates: validatedData.certificates,
        featureImage: validatedData.featureImage,
        videoShowcase: validatedData.videoShowcase,
        processingTime: validatedData.processingTime,
        warehouse: validatedData.warehouse,
        status: validatedData.status,
        galleryImages: {
          create: validatedData.galleryImages?.map((path) => ({
            imagePath: path,
          })),
        },
      },
    });

    // 4. Serialize Decimal fields to Numbers for Client Component parsing
    const serializedProduct = {
      ...product,
      moqValue: Number(product.moqValue),
      stockQuantity: Number(product.stockQuantity),
      pricePerUnit: Number(product.pricePerUnit),
      moistureContent: product.moistureContent ? Number(product.moistureContent) : null,
      defectRate: product.defectRate ? Number(product.defectRate) : null,
      sheaFatContent: product.sheaFatContent ? Number(product.sheaFatContent) : null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
    };

    revalidatePath("/inventory/honey");
    revalidatePath("/inventory/cashew");
    revalidatePath("/inventory/sheabutter");
    revalidatePath("/inventory");
    
    return { success: true, data: serializedProduct };
  } catch (error: any) {
    console.error("Failed to create product:", error);
    return { 
      success: false, 
      error: error.message || "Failed to create product. Please try again." 
    };
  }
}

export async function getHoneyPackagingSizes() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category: { in: ["raw", "processed", "wild"] } },
          { category: "organic", cashewGrade: null, sheaGrade: null },
        ],
        status: "published",
      },
      select: { packagingSize: true },
    });

    const seen = new Set<string>();
    const sizes: string[] = [];
    products.forEach((p) => {
      if (p.packagingSize && !seen.has(p.packagingSize)) {
        seen.add(p.packagingSize);
        sizes.push(p.packagingSize);
      }
    });

    return { success: true, data: sizes };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch packaging sizes" };
  }
}

export async function getHoneyPackagingTypes() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category: { in: ["raw", "processed", "wild"] } },
          { category: "organic", cashewGrade: null, sheaGrade: null },
        ],
        status: "published",
      },
      select: { packagingType: true },
    });

    const seen = new Set<string>();
    const types: string[] = [];
    products.forEach((p) => {
      if (!seen.has(p.packagingType)) {
        seen.add(p.packagingType);
        types.push(p.packagingType);
      }
    });

    return { success: true, data: types };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch packaging types" };
  }
}

export async function getHoneyCategories() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category: { in: ["raw", "processed", "wild"] } },
          { category: "organic", cashewGrade: null, sheaGrade: null },
        ],
        status: "published",
      },
      select: { category: true },
    });

    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return { success: true, data: { counts, total: products.length } };
  } catch (error: any) {
    return { success: false, error: "Failed to fetch categories" };
  }
}

export async function getHoneyProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category: { in: ['raw', 'processed', 'wild'] } },
          {
            category: 'organic',
            cashewGrade: null,
            sheaGrade: null,
          }
        ]
      },
      include: {
        galleryImages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serialized = products.map((p) => ({
      ...p,
      moqValue: Number(p.moqValue),
      stockQuantity: Number(p.stockQuantity),
      pricePerUnit: Number(p.pricePerUnit),
      moistureContent: p.moistureContent ? Number(p.moistureContent) : null,
      defectRate: p.defectRate ? Number(p.defectRate) : null,
      sheaFatContent: p.sheaFatContent ? Number(p.sheaFatContent) : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    }));

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch honey products:", error);
    return { success: false, error: "Failed to fetch honey inventory" };
  }
}

export async function deleteProduct(id: number) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/inventory/honey");
    revalidatePath("/inventory/cashew");
    revalidatePath("/inventory/sheabutter");
    revalidatePath("/inventory");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function getProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        galleryImages: true,
      },
    });

    if (!product) return { success: false, error: "Product not found" };

    // Serialize Decimal fields to Numbers for Client Component parsing
    const serialized = {
      ...product,
      moqValue: Number(product.moqValue),
      stockQuantity: Number(product.stockQuantity),
      pricePerUnit: Number(product.pricePerUnit),
      moistureContent: product.moistureContent ? Number(product.moistureContent) : null,
      defectRate: product.defectRate ? Number(product.defectRate) : null,
      sheaFatContent: product.sheaFatContent ? Number(product.sheaFatContent) : null,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      galleryImages: product.galleryImages?.map((img) => img.imagePath) || [],
    };

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch product:", error);
    return { success: false, error: "Failed to fetch product details" };
  }
}

export async function updateProduct(id: number, data: ProductInput) {
  try {
    // 1. Fetch current data to check for media changes
    const current = await prisma.product.findUnique({
      where: { id },
      include: { galleryImages: true }
    });

    if (!current) throw new Error("Product not found");

    // 2. Validate new data
    const validatedData = ProductSchema.parse(data);

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

    // 4. Update Product in database
    await prisma.$transaction([
      // Delete old gallery relations
      prisma.productGalleryImage.deleteMany({
        where: { productId: id }
      }),
      // Update the product and create new gallery relations
      prisma.product.update({
        where: { id },
        data: {
          name: validatedData.name,
          category: validatedData.category,
          description: validatedData.description,
          packagingType: validatedData.packagingType,
          packagingSize: validatedData.packagingSize,
          moqValue: validatedData.moqValue,
          moqUnit: validatedData.moqUnit,
          stockQuantity: validatedData.stockQuantity,
          stockUnit: validatedData.stockUnit,
          stockStatus: validatedData.stockStatus,
          pricePerUnit: validatedData.pricePerUnit,
          priceUnitType: validatedData.priceUnitType,
          isExportReady: validatedData.isExportReady,
          exportCountries: validatedData.exportCountries,
          shippingMethods: validatedData.shippingMethods,
          isOrganic: validatedData.isOrganic,
          cashewGrade: validatedData.cashewGrade,
          moistureContent: validatedData.moistureContent,
          kernelCount: validatedData.kernelCount,
          defectRate: validatedData.defectRate,
          seasonality: validatedData.seasonality,
          sheaGrade: validatedData.sheaGrade,
          sheaFatContent: validatedData.sheaFatContent,
          purityLevel: validatedData.purityLevel,
          usageType: validatedData.usageType,
          certificates: validatedData.certificates,
          featureImage: validatedData.featureImage,
          videoShowcase: validatedData.videoShowcase,
          processingTime: validatedData.processingTime,
          warehouse: validatedData.warehouse,
          status: validatedData.status,
          galleryImages: {
            create: validatedData.galleryImages?.map((path) => ({
              imagePath: path,
            })),
          },
        },
      })
    ]);

    // 5. Clean up old files from Cloudinary
    for (const path of filesToDelete) {
      try {
        await deleteFromCloudinary(path);
      } catch (err) {
        console.error("Failed to delete old file from Cloudinary:", path, err);
      }
    }

    revalidatePath("/inventory/honey");
    revalidatePath("/inventory/cashew");
    revalidatePath("/inventory/sheabutter");
    revalidatePath("/inventory");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to update product:", error);
    return { success: false, error: error.message || "Failed to update product" };
  }
}
