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
        AND: [
          {
            OR: [
              { category: { in: ["raw", "processed", "wild", "organic"] } },
              { name: { contains: "honey", mode: "insensitive" } },
              { category: { contains: "honey", mode: "insensitive" } },
            ]
          },
          { OR: [{ cashewGrade: null }, { cashewGrade: "" }] },
          { OR: [{ sheaGrade: null }, { sheaGrade: "" }] },
          { NOT: { name: { contains: 'cashew', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'rcn', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'shea', mode: 'insensitive' } } },
          { category: { notIn: ['rcn', 'kernels', 'roasted', 'shea', 'unrefined', 'refined'] } }
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
        AND: [
          {
            OR: [
              { category: { in: ["raw", "processed", "wild", "organic"] } },
              { name: { contains: "honey", mode: "insensitive" } },
              { category: { contains: "honey", mode: "insensitive" } },
            ]
          },
          { OR: [{ cashewGrade: null }, { cashewGrade: "" }] },
          { OR: [{ sheaGrade: null }, { sheaGrade: "" }] },
          { NOT: { name: { contains: 'cashew', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'rcn', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'shea', mode: 'insensitive' } } },
          { category: { notIn: ['rcn', 'kernels', 'roasted', 'shea', 'unrefined', 'refined'] } }
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
        AND: [
          {
            OR: [
              { category: { in: ["raw", "processed", "wild", "organic"] } },
              { name: { contains: "honey", mode: "insensitive" } },
              { category: { contains: "honey", mode: "insensitive" } },
            ]
          },
          { OR: [{ cashewGrade: null }, { cashewGrade: "" }] },
          { OR: [{ sheaGrade: null }, { sheaGrade: "" }] },
          { NOT: { name: { contains: 'cashew', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'rcn', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'shea', mode: 'insensitive' } } },
          { category: { notIn: ['rcn', 'kernels', 'roasted', 'shea', 'unrefined', 'refined'] } }
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
        AND: [
          {
            OR: [
              { category: { in: ['raw', 'processed', 'wild', 'organic'] } },
              { name: { contains: 'honey', mode: 'insensitive' } },
              { category: { contains: 'honey', mode: 'insensitive' } }
            ]
          },
          { OR: [{ cashewGrade: null }, { cashewGrade: "" }] },
          { OR: [{ sheaGrade: null }, { sheaGrade: "" }] },
          { NOT: { name: { contains: 'cashew', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'rcn', mode: 'insensitive' } } },
          { NOT: { name: { contains: 'shea', mode: 'insensitive' } } },
          { category: { notIn: ['rcn', 'kernels', 'roasted', 'shea', 'unrefined', 'refined'] } }
        ]
      },
      include: {
        galleryImages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const activeOrders = await prisma.exportOrder.findMany({
      select: { productId: true, quantityRequested: true, unitMeasurement: true },
      where: {
        status: { in: ['pending', 'processing', 'approved', 'paid', 'shipped', 'delivered', 'in_transit'] }
      }
    });

    const orderSumMap: Record<number, number> = {};
    activeOrders.forEach(o => {
      let qty = Number(o.quantityRequested || 0);
      const product = products.find(p => p.id === o.productId);
      if (product) {
        const orderUnit = (o.unitMeasurement || '').toLowerCase();
        const stockUnit = (product.stockUnit || '').toLowerCase();
        
        if (orderUnit && stockUnit && orderUnit !== stockUnit && !orderUnit.includes(stockUnit) && !stockUnit.includes(orderUnit)) {
           if (product.packagingSize) {
             const match = product.packagingSize.match(/(\d+(?:\.\d+)?)/);
             if (match) {
                qty = qty * Number(match[1]);
             }
           }
        }
      }
      orderSumMap[o.productId] = (orderSumMap[o.productId] || 0) + qty;
    });

    const serialized = products.map((p) => {
      const totalStock = Number(p.stockQuantity);
      const reserved = orderSumMap[p.id] || 0;
      const availableStock = Math.max(0, totalStock - reserved);

      return {
      ...p,
      moqValue: Number(p.moqValue),
      stockQuantity: Number(p.stockQuantity),
      pricePerUnit: Number(p.pricePerUnit),
      moistureContent: p.moistureContent ? Number(p.moistureContent) : null,
      defectRate: p.defectRate ? Number(p.defectRate) : null,
      sheaFatContent: p.sheaFatContent ? Number(p.sheaFatContent) : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      availableStock: availableStock,
    };
    });

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch honey products:", error);
    return { success: false, error: "Failed to fetch honey inventory" };
  }
}

export async function getHoneyClientsCount() {
  try {
    const orders = await prisma.exportOrder.findMany({
      where: { product: { name: { contains: 'Honey', mode: 'insensitive' } } },
      select: { email: true }
    });
    const uniqueEmails = new Set();
    orders.forEach(o => {
      if (o.email) uniqueEmails.add(o.email.toLowerCase());
    });
    return { success: true, count: uniqueEmails.size };
  } catch (error) {
    console.error("Failed to fetch honey clients count:", error);
    return { success: false, count: 0 };
  }
}

export async function deleteProduct(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { galleryImages: true }
    });

    if (!product) {
      return { success: false, error: "Product not found" };
    }

    // Delete related export orders to avoid foreign key constraint errors
    await prisma.exportOrder.deleteMany({
      where: { productId: id },
    });

    await prisma.product.delete({
      where: { id },
    });

    // Clean up media from Cloudinary
    const filesToDelete = [];
    if (product.featureImage) filesToDelete.push(product.featureImage);
    if (product.videoShowcase) filesToDelete.push(product.videoShowcase);
    product.galleryImages.forEach(img => filesToDelete.push(img.imagePath));

    for (const path of filesToDelete) {
      try {
        await deleteFromCloudinary(path);
      } catch (err) {
        console.error("Failed to delete file from Cloudinary:", path, err);
      }
    }

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

    const activeOrders = await prisma.exportOrder.findMany({
      select: { quantityRequested: true, unitMeasurement: true },
      where: {
        productId: id,
        status: { in: ['approved', 'processing', 'shipped', 'delivered', 'in_transit', 'paid'] }
      }
    });

    let reserved = 0;
    activeOrders.forEach(o => {
      let qty = Number(o.quantityRequested || 0);
      const orderUnit = (o.unitMeasurement || '').toLowerCase();
      const stockUnit = (product.stockUnit || '').toLowerCase();
      
      if (orderUnit && stockUnit && orderUnit !== stockUnit && !orderUnit.includes(stockUnit) && !stockUnit.includes(orderUnit)) {
         if (product.packagingSize) {
           const match = product.packagingSize.match(/(\d+(?:\.\d+)?)/);
           if (match) {
              qty = qty * Number(match[1]);
           }
         }
      }
      reserved += qty;
    });

    const totalStock = Number(product.stockQuantity);
    const availableStock = Math.max(0, totalStock - reserved);

    // Serialize Decimal fields to Numbers for Client Component parsing
    const serialized = {
      ...product,
      moqValue: Number(product.moqValue),
      stockQuantity: availableStock,
      originalStock: totalStock,
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

export async function getGlobalInventory() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { galleryImages: true },
    });

    const activeOrders = await prisma.exportOrder.findMany({
      select: { productId: true, quantityRequested: true, unitMeasurement: true },
      where: {
        status: { in: ['processing', 'approved', 'paid', 'shipped', 'delivered', 'in_transit'] }
      }
    });

    const orderSumMap: Record<number, number> = {};
    activeOrders.forEach(o => {
      let qty = Number(o.quantityRequested || 0);
      const product = products.find(p => p.id === o.productId);
      if (product) {
        const orderUnit = (o.unitMeasurement || '').toLowerCase();
        const stockUnit = (product.stockUnit || '').toLowerCase();
        
        if (orderUnit && stockUnit && orderUnit !== stockUnit && !orderUnit.includes(stockUnit) && !stockUnit.includes(orderUnit)) {
           if (product.packagingSize) {
             const match = product.packagingSize.match(/(\d+(?:\.\d+)?)/);
             if (match) {
                qty = qty * Number(match[1]);
             }
           }
        }
      }
      orderSumMap[o.productId] = (orderSumMap[o.productId] || 0) + qty;
    });

    const serialized = products.map((p) => {
      const totalStock = Number(p.stockQuantity);
      const reserved = orderSumMap[p.id] || 0;
      const availableStock = Math.max(0, totalStock - reserved);

      let packageMultiplier = 1;
      if (p.packagingSize) {
         const match = p.packagingSize.match(/(\d+(?:\.\d+)?)/);
         if (match) {
            packageMultiplier = Number(match[1]) || 1;
         }
      }
      
      let grade = "Standard";
      if (p.category === "organic" || p.isOrganic || p.cashewGrade?.toLowerCase().includes("w320") || p.sheaGrade === "Grade A") {
        grade = "Premium";
      } else if (p.category === "raw" || p.cashewGrade?.toLowerCase().includes("w240")) {
        grade = "Premium";
      }

      const getCategoryLabel = (cat: string) => {
         if (!cat) return 'Unknown';
         if (cat.toLowerCase() === 'others') return 'Other';
         return cat.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };

      const unitMap = (u: string) => {
         if (!u) return 'kg';
         if (u.toLowerCase().includes('kilo') || u.toLowerCase() === 'kg') return 'kg';
         if (u.toLowerCase().includes('liter') || u.toLowerCase() === 'l') return 'L';
         return u;
      };

      return {
        id: p.id,
        name: p.name,
        category: getCategoryLabel(p.category),
        grade,
        stock: totalStock,
        reserved,
        available: availableStock,
        unit: unitMap(p.stockUnit),
        packageType: p.packagingType || 'Units',
        packagesAvailable: Math.floor(availableStock / packageMultiplier),
        packagesTotal: Math.floor(totalStock / packageMultiplier),
        packagesReserved: Math.floor(reserved / packageMultiplier),
        image: p.featureImage || (p.galleryImages?.length > 0 ? p.galleryImages[0].imagePath : null)
      };
    });

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch global inventory:", error);
    return { success: false, error: "Failed to load global inventory" };
  }
}

export async function getCashewProducts() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category: { in: ['rcn', 'kernels', 'roasted'] } },
          { cashewGrade: { not: null } },
          { name: { contains: 'cashew', mode: 'insensitive' } },
          { category: { contains: 'cashew', mode: 'insensitive' } }
        ]
      },
      include: {
        galleryImages: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const activeOrders = await prisma.exportOrder.findMany({
      select: { productId: true, quantityRequested: true, unitMeasurement: true },
      where: {
        status: { in: ['pending', 'processing', 'approved', 'paid', 'shipped', 'delivered', 'in_transit'] }
      }
    });

    const orderSumMap: Record<number, number> = {};
    activeOrders.forEach(o => {
      let qty = Number(o.quantityRequested || 0);
      const product = products.find(p => p.id === o.productId);
      if (product) {
        const orderUnit = (o.unitMeasurement || '').toLowerCase();
        const stockUnit = (product.stockUnit || '').toLowerCase();
        
        if (orderUnit && stockUnit && orderUnit !== stockUnit && !orderUnit.includes(stockUnit) && !stockUnit.includes(orderUnit)) {
           if (product.packagingSize) {
             const match = product.packagingSize.match(/(\d+(?:\.\d+)?)/);
             if (match) {
                qty = qty * Number(match[1]);
             }
           }
        }
      }
      orderSumMap[o.productId] = (orderSumMap[o.productId] || 0) + qty;
    });

    const serialized = products.map((p) => {
      const totalStock = Number(p.stockQuantity);
      const reserved = orderSumMap[p.id] || 0;
      const availableStock = Math.max(0, totalStock - reserved);

      return {
      ...p,
      moqValue: Number(p.moqValue),
      stockQuantity: Number(p.stockQuantity),
      pricePerUnit: Number(p.pricePerUnit),
      moistureContent: p.moistureContent ? Number(p.moistureContent) : null,
      defectRate: p.defectRate ? Number(p.defectRate) : null,
      sheaFatContent: p.sheaFatContent ? Number(p.sheaFatContent) : null,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      availableStock: availableStock,
    };
    });

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch cashew products:", error);
    return { success: false, error: "Failed to fetch cashew inventory" };
  }
}

export async function getCashewCategories() {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { category: { in: ['rcn', 'kernels', 'roasted'] } },
          { cashewGrade: { not: null } },
          { name: { contains: 'cashew', mode: 'insensitive' } },
          { category: { contains: 'cashew', mode: 'insensitive' } }
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
    return { success: false, error: "Failed to fetch cashew categories" };
  }
}

export async function getCashewClientsCount() {
  try {
    const orders = await prisma.exportOrder.findMany({
      where: { product: { name: { contains: 'Cashew', mode: 'insensitive' } } },
      select: { email: true }
    });
    const uniqueEmails = new Set();
    orders.forEach(o => {
      if (o.email) uniqueEmails.add(o.email.toLowerCase());
    });
    return { success: true, count: uniqueEmails.size };
  } catch (error) {
    console.error("Failed to fetch cashew clients count:", error);
    return { success: false, count: 0 };
  }
}
