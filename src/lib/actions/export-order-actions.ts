"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function getExportOrders(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  type?: string;
}) {
  try {
    const page = params?.page || 1;
    // Default to 1000 if not specified to not break other pages, but 15 for paginated pages
    const pageSize = params?.pageSize || 1000; 
    const search = params?.search || '';
    const type = params?.type || 'all';

    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { referenceNumber: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { buyerType: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (type !== 'all') {
      whereClause.product = {
        name: { contains: type, mode: 'insensitive' }
      };
    }

    const [orders, total] = await prisma.$transaction([
      prisma.exportOrder.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: pageSize,
        skip: (page - 1) * pageSize,
        include: { product: true }
      }),
      prisma.exportOrder.count({ where: whereClause })
    ]);

    // Serialize Decimal and DateTime for Client Components
    const serialized = orders.map((o) => ({
      ...o,
      quantityRequested: Number(o.quantityRequested),
      totalEstimatedCost: o.totalEstimatedCost ? Number(o.totalEstimatedCost) : null,
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

    return { 
      success: true, 
      data: serialized,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
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
      totalEstimatedCost: order.totalEstimatedCost ? Number(order.totalEstimatedCost) : null,
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

export async function getActiveShipments(params?: {
  page?: number;
  pageSize?: number;
  filter?: string;
}) {
  try {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 15;
    const filter = params?.filter || 'all';

    const activeStatuses = ['approved', 'processing', 'shipped', 'in_transit', 'delivered'];
    const whereClause: any = {
      status: { in: activeStatuses }
    };

    if (filter === 'sea') whereClause.shippingType = { contains: 'ocean', mode: 'insensitive' };
    else if (filter === 'air') whereClause.shippingType = { contains: 'air', mode: 'insensitive' };

    const [orders, total] = await prisma.$transaction([
      prisma.exportOrder.findMany({
        where: whereClause,
        orderBy: { updatedAt: "desc" },
        take: pageSize,
        skip: (page - 1) * pageSize,
        include: { product: true }
      }),
      prisma.exportOrder.count({ where: whereClause })
    ]);
    
    const allActive = await prisma.exportOrder.findMany({
      where: { status: { in: activeStatuses } },
      select: { shippingType: true }
    });
    
    const deliveredOrders = await prisma.exportOrder.findMany({
      where: { status: 'delivered' }
    });

    let avgTransitString = "22 days";
    if (deliveredOrders.length > 0) {
      let totalTransitMs = 0;
      let validCount = 0;
      for (const ord of deliveredOrders) {
        const delivered = (ord as any).deliveredAt;
        const shipped = (ord as any).shippedAt;
        if (delivered && shipped) {
          totalTransitMs += delivered.getTime() - shipped.getTime();
          validCount++;
        }
      }
      if (validCount > 0) {
        const avgMs = totalTransitMs / validCount;
        const avgDays = Math.max(1, Math.round(avgMs / (1000 * 60 * 60 * 24)));
        avgTransitString = `${avgDays} day${avgDays > 1 ? 's' : ''}`;
      }
    }

    const stats = {
      totalActive: allActive.length,
      seaFreight: allActive.filter(o => o.shippingType?.toLowerCase().includes('ocean')).length,
      airCargo: allActive.filter(o => o.shippingType?.toLowerCase().includes('air')).length,
      avgTransit: avgTransitString
    };

    const serialized = orders.map((o) => ({
      ...o,
      quantityRequested: Number(o.quantityRequested),
      totalEstimatedCost: o.totalEstimatedCost ? Number(o.totalEstimatedCost) : null,
      customsValue: o.customsValue ? Number(o.customsValue) : null,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      product: {
        ...o.product,
        pricePerUnit: Number(o.product.pricePerUnit),
        moqValue: Number(o.product.moqValue),
        stockQuantity: Number(o.product.stockQuantity),
        createdAt: o.product.createdAt.toISOString(),
        updatedAt: o.product.updatedAt.toISOString(),
      }
    }));

    return { 
      success: true, 
      data: serialized,
      stats,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  } catch (error: any) {
    console.error("Failed to fetch active shipments:", error);
    return { success: false, error: "Failed to fetch active shipments" };
  }
}

export async function updateExportOrderStatus(id: number, status: string, timestamp?: string) {
  try {
    const updateData: any = { status };
    
    if (timestamp) {
      const dateVal = new Date(timestamp);
      if (status === 'approved') updateData.approvedAt = dateVal;
      else if (status === 'processing') updateData.processingAt = dateVal;
      else if (status === 'shipped' || status === 'in_transit') updateData.shippedAt = dateVal;
      else if (status === 'delivered') updateData.deliveredAt = dateVal;
    }

    const order = await prisma.exportOrder.update({
      where: { id },
      data: updateData
    });
    
    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath("/logistics");
    return { success: true, data: {
      ...order,
      quantityRequested: Number(order.quantityRequested),
      totalEstimatedCost: order.totalEstimatedCost ? Number(order.totalEstimatedCost) : null,
      customsValue: order.customsValue ? Number(order.customsValue) : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      approvedAt: (order as any).approvedAt ? (order as any).approvedAt.toISOString() : null,
      processingAt: (order as any).processingAt ? (order as any).processingAt.toISOString() : null,
      shippedAt: (order as any).shippedAt ? (order as any).shippedAt.toISOString() : null,
      deliveredAt: (order as any).deliveredAt ? (order as any).deliveredAt.toISOString() : null,
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
      totalEstimatedCost: order.totalEstimatedCost ? Number(order.totalEstimatedCost) : null,
      customsValue: order.customsValue ? Number(order.customsValue) : null,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    }};
  } catch (error: any) {
    console.error("Failed to update order details:", error);
    return { success: false, error: "Failed to update order details" };
  }
}

export async function saveInvoicePdf(id: number, formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const url = await uploadToCloudinary(file, "invoices");
    
    await prisma.exportOrder.update({
      where: { id },
      data: { 
        invoicePdfPath: url,
        invoiceDate: new Date()
      } as any
    });

    revalidatePath("/quotations");
    revalidatePath("/invoices");
    revalidatePath("/orders");
    
    return { success: true, url };
  } catch (error: any) {
    console.error("Failed to save invoice PDF:", error);
    return { success: false, error: error.message || error.toString() };
  }
}

export async function deleteExportOrder(id: number) {
  try {
    await prisma.exportOrder.delete({
      where: { id }
    });
    
    revalidatePath("/orders");
    revalidatePath("/dashboard");
    revalidatePath("/logistics");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete order:", error);
    return { success: false, error: "Failed to delete order" };
  }
}
