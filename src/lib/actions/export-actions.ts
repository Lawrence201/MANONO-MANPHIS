"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitExportOrder(data: any) {
  try {
    // Generate a unique reference number
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    let prefix = "EXP";
    const product = await prisma.product.findUnique({
      where: { id: Number(data.productId) },
      select: { category: true, name: true }
    });
    
    if (product) {
      const nameLower = product.name.toLowerCase();
      const catLower = product.category.toLowerCase();
      if (nameLower.includes("cashew") || catLower === "kernels") {
        prefix = "CSH";
      } else if (nameLower.includes("honey") || catLower === "honey") {
        prefix = "HNY";
      } else if (nameLower.includes("shea") || catLower.includes("shea")) {
        prefix = "SHE";
      }
    }

    const referenceNumber = `${prefix}-${new Date().getFullYear()}-${timestamp}${randomStr}`;

    const order = await prisma.exportOrder.create({
      data: {
        referenceNumber,
        productId: Number(data.productId),
        buyerType: data.buyerType,
        companyName: data.companyName,
        destinationCountry: data.destinationCountry,
        city: data.city,
        deliveryAddress: data.deliveryAddress,
        stateRegion: data.stateRegion,
        postalCode: data.postalCode,
        email: data.email,
        phone: data.phone,
        taxId: data.taxId || null,
        
        quantityRequested: Number(data.quantityRequested),
        unitMeasurement: data.unitMeasurement || null,
        totalEstimatedCost: data.totalEstimatedCost ? Number(data.totalEstimatedCost) : null,
        
        shippingType: data.shippingType,
        deliveryType: data.deliveryType,
        pickupOption: data.pickupOption,
        preferredDate: data.preferredDate || null,
        deliveryPriority: data.deliveryPriority || null,

        requiresFda: data.requiresFda === true || data.requiresFda === "true",
        requiresPhyto: data.requiresPhyto === true || data.requiresPhyto === "true",
        requiresOrganic: data.requiresOrganic === true || data.requiresOrganic === "true",
        requiresOrigin: data.requiresOrigin === true || data.requiresOrigin === "true",
        customsValue: data.customsValue ? Number(data.customsValue) : null,
        importRequirements: data.importRequirements || null,

        paymentMethod: data.paymentMethod,
        depositRequired: data.depositRequired,
        billingAddress: data.billingAddress || null,

        status: "pending"
      }
    });

    revalidatePath("/admin/export-orders"); // assuming this route might exist later
    
    return { success: true, message: "Export Order submitted successfully!", reference: referenceNumber };
  } catch (error) {
    console.error("Failed to submit export order:", error);
    return { success: false, message: "Failed to submit export order. Please try again." };
  }
}

export async function getPendingOrdersCount() {
  try {
    const count = await prisma.exportOrder.count({
      where: {
        status: "pending"
      }
    });
    return count;
  } catch (error) {
    console.error("Failed to fetch pending orders count:", error);
    return 0;
  }
}
