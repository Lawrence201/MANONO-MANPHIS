"use server";

import { prisma } from "@/lib/prisma";
import { BookingSchema, type BookingInput } from "@/lib/schemas/booking";
import { revalidatePath } from "next/cache";

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
