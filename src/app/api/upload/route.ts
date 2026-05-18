import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "billboards";

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    const url = await uploadToCloudinary(file, folder);
    return NextResponse.json({ success: true, url });
  } catch (error: any) {
    console.error("API Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
