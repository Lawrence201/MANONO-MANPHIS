"use server";

import { prisma } from "@/lib/prisma";
import { BookingSchema, type BookingInput } from "@/lib/schemas/booking";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary";

export async function getBillboardBookings() {
  try {
    const bookings = await prisma.billboardBooking.findMany({
      include: { billboard: true },
      orderBy: { createdAt: "desc" },
    });

    const serialized = bookings.map((b) => ({
      ...b,
      totalPrice: Number(b.totalPrice),
      taxRate: b.taxRate ? Number(b.taxRate) : null,
      createdAt: b.createdAt.toISOString(),
      updatedAt: b.updatedAt.toISOString(),
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      billboard: {
        ...b.billboard,
        weeklyRate: Number(b.billboard.weeklyRate),
        taxRate: Number(b.billboard.taxRate),
        createdAt: b.billboard.createdAt.toISOString(),
        updatedAt: b.billboard.updatedAt.toISOString(),
      },
    }));

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch billboard bookings:", error);
    return { success: false, error: "Failed to fetch bookings" };
  }
}

export async function updateBillboardBookingStatus(id: number, status: string) {
  try {
    await prisma.billboardBooking.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/inventory/bookings");
    revalidatePath("/inventory/schedule");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update booking status:", error);
    return { success: false, error: "Failed to update booking status" };
  }
}

export async function updateBillboardBookingPaymentStatus(id: number, paymentStatus: string) {
  try {
    await prisma.billboardBooking.update({
      where: { id },
      data: { paymentStatus },
    });

    revalidatePath("/inventory/bookings");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update payment status:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}

export async function extendBillboardBooking(id: number, newEndDate: string) {
  try {
    await prisma.billboardBooking.update({
      where: { id },
      data: { endDate: new Date(newEndDate) },
    });

    revalidatePath("/inventory/bookings");
    revalidatePath("/inventory/billboard-manager");
    revalidatePath("/inventory/schedule");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to extend booking:", error);
    return { success: false, error: "Failed to update campaign dates" };
  }
}

export async function updateBillboardBookingMedia(id: number, advertFile: string) {
  try {
    await prisma.billboardBooking.update({
      where: { id },
      data: { advertFile },
    });

    revalidatePath("/inventory/bookings");
    revalidatePath("/inventory/billboard-manager");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to update campaign media:", error);
    return { success: false, error: "Failed to update media" };
  }
}

export async function deleteBillboardBooking(id: number) {
  try {
    // Fetch first to get the media file URL before deleting
    const booking = await prisma.billboardBooking.findUnique({ where: { id } });

    await prisma.billboardBooking.delete({ where: { id } });

    // Delete media file from Cloudinary / local storage
    if (booking?.advertFile) {
      try {
        await deleteFromCloudinary(booking.advertFile);
      } catch (err) {
        console.error("Failed to delete media file:", err);
      }
    }

    revalidatePath("/inventory/bookings");
    revalidatePath("/inventory/billboard-manager");
    revalidatePath("/inventory/schedule");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to delete booking:", error);
    return { success: false, error: "Failed to delete booking" };
  }
}

export async function createBillboardBooking(data: BookingInput) {
  try {
    // 1. Validate data
    const validatedData = BookingSchema.parse(data);

    // 2. Create Booking in database
    const booking = await prisma.billboardBooking.create({
      data: {
        billboardId: validatedData.billboardId,
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        companyName: validatedData.companyName,
        clientType: validatedData.clientType,
        campaignTitle: validatedData.campaignTitle,
        campaignType: validatedData.campaignType,
        campaignDuration: validatedData.campaignDuration,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
        slotsRequested: validatedData.slotsRequested,
        description: validatedData.description,
        advertFile: validatedData.advertFile,
        totalPrice: validatedData.totalPrice,
        taxRate: validatedData.taxRate,
        paymentMethod: validatedData.paymentMethod,
        status: "pending",
        paymentStatus: "pending",
      },
    });

    // 3. Revalidate paths if necessary
    revalidatePath("/admin/bookings");
    
    return { 
      success: true, 
      data: {
        ...booking,
        totalPrice: Number(booking.totalPrice), // Serialize Decimal
        taxRate: Number(booking.taxRate), // Serialize Decimal
        createdAt: booking.createdAt.toISOString(),
        updatedAt: booking.updatedAt.toISOString(),
        startDate: booking.startDate.toISOString(),
        endDate: booking.endDate.toISOString(),
      } 
    };
  } catch (error: any) {
    console.error("Failed to create booking:", error);
    return { 
      success: false, 
      error: error.message || "Failed to process booking. Please try again." 
    };
  }
}
