"use server";

import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadBillboardMedia(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const url = await uploadToCloudinary(file, "billboards");
    return { success: true, url };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}
