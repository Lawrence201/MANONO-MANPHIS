"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getExportOrders() {
  try {
    const orders = await prisma.exportOrder.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        product: true
      }
    });

    // Serialize Decimal and DateTime for Client Components
    const serialized = orders.map((o) => ({
      ...o,
      quantityRequested: Number(o.quantityRequested),
      customsValue: o.customsValue ? Number(o.customsValue) : null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      product: {
        ...o.product,
        pricePerUnit: Number(o.product.pricePerUnit),
        moqValue: Number(o.product.moqValue),
        stockQuantity: Number(o.product.stockQuantity),
        moistureContent: o.product.moistureContent ? Number(o.product.moistureContent) : null,
        defectRate: o.product.defectRate ? Number(o.product.defectRate) : null,
        sheaFatContent: o.product.sheaFatContent ? Number(o.product.sheaFatContent) : null,
        createdAt: o.product.createdAt.toISOString(),
        updatedAt: o.product.updatedAt.toISOString(),
      }
    }));

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch export orders:", error);
    return { success: false, error: "Failed to fetch export orders" };
  }
}

export async function getExportOrderById(id: number) {
  try {
    const order = await prisma.exportOrder.findUnique({
      where: { id },
      include: { product: true }
    });
    
    if (!order) return { success: false, error: "Order not found" };

    const serialized = {
      ...order,
      quantityRequested: Number(order.quantityRequested),
      customsValue: order.customsValue ? Number(order.customsValue) : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      product: {
        ...order.product,
        pricePerUnit: Number(order.product.pricePerUnit),
        moqValue: Number(order.product.moqValue),
        stockQuantity: Number(order.product.stockQuantity),
        moistureContent: order.product.moistureContent ? Number(order.product.moistureContent) : null,
        defectRate: order.product.defectRate ? Number(order.product.defectRate) : null,
        sheaFatContent: order.product.sheaFatContent ? Number(order.product.sheaFatContent) : null,
        createdAt: order.product.createdAt.toISOString(),
        updatedAt: order.product.updatedAt.toISOString(),
      }
    };

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch export order:", error);
    return { success: false, error: "Failed to fetch export order" };
  }
}

export async function updateExportOrderStatus(id: number, status: string) {
  try {
    const order = await prisma.exportOrder.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath("/orders");
    revalidatePath("/dashboard");
    return { success: true, data: {
      ...order,
      quantityRequested: Number(order.quantityRequested),
      customsValue: order.customsValue ? Number(order.customsValue) : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }};
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function updateExportOrderDetails(id: number, data: { quantityRequested?: number; customsValue?: number; paymentMethod?: string }) {
  try {
    const order = await prisma.exportOrder.update({
      where: { id },
      data: {
        quantityRequested: data.quantityRequested,
        customsValue: data.customsValue,
        paymentMethod: data.paymentMethod
      }
    });

    revalidatePath("/orders");
    revalidatePath("/dashboard");
    return { success: true, data: {
      ...order,
      quantityRequested: Number(order.quantityRequested),
      customsValue: order.customsValue ? Number(order.customsValue) : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }};
  } catch (error: any) {
    console.error("Failed to update order details:", error);
    return { success: false, error: "Failed to update order details" };
  }
}
