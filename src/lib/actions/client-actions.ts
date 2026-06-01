"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClients() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { carts: true, reviews: true }
        }
      }
    });
    return { success: true, data: clients };
  } catch (error) {
    console.error("Failed to fetch clients:", error);
    return { success: false, error: "Failed to fetch clients" };
  }
}

export async function updateClient(id: number, data: { name?: string; email?: string; phoneNumber?: string }) {
  try {
    const updated = await prisma.client.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      }
    });
    revalidatePath("/clients");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to update client:", error);
    return { success: false, error: "Failed to update client" };
  }
}

export async function deleteClient(id: number) {
  try {
    await prisma.client.delete({ where: { id } });
    revalidatePath("/clients");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete client:", error);
    return { success: false, error: "Failed to delete client" };
  }
}

export async function createClient(data: { name: string; email: string; phoneNumber?: string }) {
  try {
    // Check if email exists
    const existing = await prisma.client.findUnique({ where: { email: data.email } });
    if (existing) {
      return { success: false, error: "A client with this email already exists" };
    }

    const newClient = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      }
    });
    revalidatePath("/clients");
    return { success: true, data: newClient };
  } catch (error) {
    console.error("Failed to create client:", error);
    return { success: false, error: "Failed to create client" };
  }
}
