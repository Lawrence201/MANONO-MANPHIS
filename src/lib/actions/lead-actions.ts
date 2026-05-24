"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitLead(data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  serviceType: string;
  product?: string;
  quantity?: string;
}) {
  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        subject: data.subject,
        message: data.message,
        serviceType: data.serviceType,
        product: data.product,
        quantity: data.quantity,
        stage: "new",
        value: 0,
        assignedTo: "Unassigned",
        country: "Unknown"
      }
    });

    revalidatePath("/leads");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to submit lead:", error);
    return { success: false, error: "Failed to submit lead" };
  }
}

export async function getLeads() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    const serialized = leads.map((l) => ({
      ...l,
      value: Number(l.value),
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch leads:", error);
    return { success: false, error: "Failed to fetch leads" };
  }
}

export async function updateLeadStage(id: number, stage: string) {
  try {
    await prisma.lead.update({
      where: { id },
      data: { stage }
    });
    revalidatePath("/leads");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update lead stage:", error);
    return { success: false, error: "Failed to update lead stage" };
  }
}
