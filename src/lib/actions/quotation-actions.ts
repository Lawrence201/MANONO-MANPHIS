"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getQuotations() {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Serialize Decimal and DateTime for Client Components
    const serialized = quotations.map((q) => ({
      ...q,
      amount: Number(q.amount),
      validUntil: q.validUntil.toISOString(),
      createdAt: q.createdAt.toISOString(),
      updatedAt: q.updatedAt.toISOString(),
    }));

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch quotations:", error);
    return { success: false, error: "Failed to fetch quotations" };
  }
}

export async function seedQuotations() {
  try {
    const count = await prisma.quotation.count();
    if (count > 0) {
      return { success: true, message: "Database already seeded" };
    }

    const dummyData = [
      { quoteNumber: "QT-1185", customer: "MTN Ghana", country: "Ghana", product: "Accra Mall LED Billboard", qty: "3 Slots (6 Mo)", amount: 85000, currency: "GHS", status: "sent", validUntil: new Date("2025-01-19T00:00:00Z"), createdAt: new Date("2024-12-19T00:00:00Z") },
      { quoteNumber: "QT-1184", customer: "Bremen Trading GmbH", country: "Germany", product: "Premium Raw Honey", qty: "5,000 kg", amount: 47500, currency: "USD", status: "viewed", validUntil: new Date("2025-01-14T00:00:00Z"), createdAt: new Date("2024-12-14T00:00:00Z") },
      { quoteNumber: "QT-1183", customer: "Osaka Imports Co.", country: "Japan", product: "W320 Premium Cashew", qty: "20,000 kg", amount: 240000, currency: "USD", status: "negotiating", validUntil: new Date("2025-01-12T00:00:00Z"), createdAt: new Date("2024-12-12T00:00:00Z") },
      { quoteNumber: "QT-1182", customer: "Guinness Ghana", country: "Ghana", product: "Kumasi Central Board", qty: "1 Slot (1 Mo)", amount: 15000, currency: "GHS", status: "accepted", validUntil: new Date("2025-01-08T00:00:00Z"), createdAt: new Date("2024-12-08T00:00:00Z") },
      { quoteNumber: "QT-1181", customer: "Atlantic Foods Inc.", country: "USA", product: "W240 Jumbo Cashew", qty: "15,000 kg", amount: 210000, currency: "USD", status: "sent", validUntil: new Date("2025-01-06T00:00:00Z"), createdAt: new Date("2024-12-06T00:00:00Z") },
      { quoteNumber: "QT-1180", customer: "Absa Bank PLC", country: "Ghana", product: "Tema Highway Board", qty: "2 Slots (3 Mo)", amount: 42000, currency: "GHS", status: "draft", validUntil: new Date("2025-01-18T00:00:00Z"), createdAt: new Date("2024-12-18T00:00:00Z") },
      { quoteNumber: "QT-1179", customer: "London Spice Co.", country: "UK", product: "Processed Honey", qty: "4,500 kg", amount: 32000, currency: "GBP", status: "rejected", validUntil: new Date("2025-01-01T00:00:00Z"), createdAt: new Date("2024-12-01T00:00:00Z") },
    ];

    await prisma.quotation.createMany({
      data: dummyData
    });

    revalidatePath("/quotations");
    return { success: true, message: "Quotations seeded successfully" };
  } catch (error: any) {
    console.error("Failed to seed quotations:", error);
    return { success: false, error: "Failed to seed quotations" };
  }
}

export async function createQuotation(data: { customer: string; product: string; amount: number }) {
  try {
    // Generate a random quote number
    const quoteNumber = `QT-${Math.floor(1000 + Math.random() * 9000)}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); // Valid for 30 days

    await prisma.quotation.create({
      data: {
        quoteNumber,
        customer: data.customer || "Unknown Client",
        country: "Ghana", // Default for now
        product: data.product || "Custom Service",
        qty: "1 Unit", // Default
        amount: data.amount || 0,
        currency: "GHS",
        status: "draft",
        validUntil,
      }
    });

    revalidatePath("/quotations");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create quotation:", error);
    return { success: false, error: "Failed to create quotation" };
  }
}
