"use server";

import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function submitConstructionRequest(formData: FormData) {
  try {
    const serviceRequired = formData.get("serviceRequired") as string;
    const otherService = formData.get("otherService") as string | null;
    const projectType = formData.get("projectType") as string;
    const estimatedBudget = formData.get("estimatedBudget") as string;
    const projectDescription = formData.get("projectDescription") as string;
    const propertyAddress = formData.get("propertyAddress") as string;
    const cityRegion = formData.get("cityRegion") as string;
    const preferredStartDate = formData.get("preferredStartDate") as string | null;
    const projectDeadline = formData.get("projectDeadline") as string | null;
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const agreedTerms = formData.get("agreedTerms") === "true";

    if (!fullName || !email || !phone || !agreedTerms) {
      return { success: false, error: "Missing required contact fields or terms agreement." };
    }

    // Process media files
    const mediaFiles = formData.getAll("media") as File[];
    const mediaUrls: string[] = [];

    for (const file of mediaFiles) {
      if (file.size > 0) {
        try {
          const url = await uploadToCloudinary(file, "construction_requests");
          mediaUrls.push(url);
        } catch (error) {
          console.error("Failed to upload file:", file.name, error);
          return { success: false, error: `Failed to upload file: ${file.name}` };
        }
      }
    }

    const randomRef = `REQ-${Math.floor(1000 + Math.random() * 9000)}`;

    const request = await prisma.constructionRequest.create({
      data: {
        referenceId: randomRef,
        serviceRequired,
        otherService,
        projectType,
        estimatedBudget,
        projectDescription,
        mediaUrls,
        propertyAddress,
        cityRegion,
        preferredStartDate,
        projectDeadline,
        fullName,
        email,
        phone,
        agreedTerms,
        status: "pending",
      },
    });

    return { success: true, referenceId: request.referenceId };
  } catch (error: any) {
    console.error("Error submitting construction request:", error);
    return { success: false, error: error.message || "An unexpected error occurred" };
  }
}

export async function saveConstructionInvoice(requestId: number, invoiceNo: string, invoiceData: any) {
  try {
    await prisma.constructionRequest.update({
      where: { id: requestId },
      data: {
        invoiceNo,
        invoiceData,
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error saving invoice:", error);
    return { success: false, error: error.message || "Failed to save invoice" };
  }
}

export async function updateConstructionRequestStatus(requestId: number, status: string) {
  try {
    await prisma.constructionRequest.update({
      where: { id: requestId },
      data: { status },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating status:", error);
    return { success: false, error: error.message || "Failed to update status" };
  }
}
