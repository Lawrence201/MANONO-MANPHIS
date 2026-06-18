"use server";

import { prisma } from "@/lib/prisma";
import { BookingSchema, type BookingInput } from "@/lib/schemas/booking";
import { revalidatePath } from "next/cache";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { sendBillboardBookingEmail, sendAdminNotificationEmail } from "@/lib/mailer";

export async function getBillboardBookings() {
  try {
    const bookings = await prisma.billboardBooking.findMany({
      include: { billboard: true },
      orderBy: { createdAt: "desc" },
    });

    const emails = bookings.map(b => b.email);
    const clients = await prisma.client.findMany({
      where: { email: { in: emails } },
      select: { email: true, profilePicture: true }
    });
    const clientMap = new Map(clients.map(c => [c.email.toLowerCase(), c.profilePicture]));

    const now = new Date();
    
    const serialized = bookings.map((b) => {
      let displayStatus = b.status;
      if (now > b.endDate && b.status !== 'rejected' && b.status !== 'cancelled') {
        displayStatus = 'completed';
      }

      return {
        ...b,
        status: displayStatus,
        totalPrice: Number(b.totalPrice),
        taxRate: b.taxRate ? Number(b.taxRate) : null,
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt.toISOString(),
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        clientProfilePicture: clientMap.get(b.email.toLowerCase()) || null,
        billboard: {
          ...b.billboard,
          weeklyRate: Number(b.billboard.weeklyRate),
          taxRate: Number(b.billboard.taxRate),
          createdAt: b.billboard.createdAt.toISOString(),
          updatedAt: b.billboard.updatedAt.toISOString(),
        },
      };
    });

    return { success: true, data: serialized };
  } catch (error: any) {
    console.error("Failed to fetch billboard bookings:", error);
    return { success: false, error: "Failed to fetch bookings" };
  }
}

export async function updateBillboardBookingStatus(id: number, status: string) {
  try {
    const dataToUpdate: any = { status };
    if (status === "approved" || status === "active") {
      dataToUpdate.paymentStatus = "paid";
    }

    await prisma.billboardBooking.update({
      where: { id },
      data: dataToUpdate,
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

export async function updateBillboardBookingDates(id: number, newStartDate: string, newEndDate: string) {
  try {
    await prisma.billboardBooking.update({
      where: { id },
      data: { startDate: new Date(newStartDate), endDate: new Date(newEndDate) },
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
    // Delete the old media file first if it exists
    const existingBooking = await prisma.billboardBooking.findUnique({ where: { id } });
    if (existingBooking?.advertFile) {
      try {
        await deleteFromCloudinary(existingBooking.advertFile);
      } catch (err) {
        console.error("Failed to delete old media file:", err);
      }
    }

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

    // 2. Check slot availability for the selected dates
    const billboard = await prisma.billboard.findUnique({ where: { id: validatedData.billboardId } });
    if (!billboard) return { success: false, error: "Billboard not found" };
    const maxSlots = billboard.maxSlots || 12;

    const reqStart = new Date(validatedData.startDate).getTime();
    const reqEnd = new Date(validatedData.endDate).getTime();

    const overlappingBookings = await prisma.billboardBooking.findMany({
      where: {
        billboardId: validatedData.billboardId,
        status: { notIn: ['cancelled', 'rejected', 'completed'] },
        startDate: { lte: new Date(validatedData.endDate) },
        endDate: { gte: new Date(validatedData.startDate) }
      }
    });

    let baseSlots = 0;
    const events: { time: number, delta: number }[] = [];

    overlappingBookings.forEach(b => {
      const bStart = b.startDate.getTime();
      const bEnd = b.endDate.getTime();
      
      // If it's already active at the exact start of the requested period
      if (bStart <= reqStart && bEnd >= reqStart) {
        baseSlots += b.slotsRequested;
      }
      
      // If it starts during the requested period
      if (bStart > reqStart && bStart <= reqEnd) {
        events.push({ time: bStart, delta: b.slotsRequested });
      }
      
      // If it ends during the requested period (frees up slots)
      if (bEnd >= reqStart && bEnd < reqEnd) {
        events.push({ time: bEnd, delta: -b.slotsRequested });
      }
    });

    // Sort chronologically. If times match, process freeing slots (negative delta) first.
    events.sort((a, b) => {
      if (a.time !== b.time) return a.time - b.time;
      return a.delta - b.delta;
    });

    let currentSlots = baseSlots;
    let maxConsumed = baseSlots;

    for (const e of events) {
      currentSlots += e.delta;
      if (currentSlots > maxConsumed) {
        maxConsumed = currentSlots;
      }
    }

    if (maxConsumed + validatedData.slotsRequested > maxSlots) {
      const available = maxSlots - maxConsumed;
      return { 
        success: false, 
        error: available <= 0 
          ? "This billboard is fully booked during these dates."
          : `Only ${available} slot(s) available during this period.` 
      };
    }

    // 3. Create Booking in database
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

    // Send confirmation email asynchronously (do not await so it doesn't block UI)
    sendBillboardBookingEmail({
      clientEmail: booking.email,
      clientName: booking.fullName,
      phone: booking.phone || "Not provided",
      campaignTitle: booking.campaignTitle,
      billboardName: billboard.name,
      startDate: booking.startDate.toISOString(),
      endDate: booking.endDate.toISOString(),
      duration: String(booking.campaignDuration || 1),
      totalPrice: Number(booking.totalPrice),
    }).catch(console.error);

    // Notify all admins asynchronously
    sendAdminNotificationEmail({
      type: 'Billboard Booking',
      reference: `#${booking.id}`,
      clientName: booking.fullName,
      clientEmail: booking.email,
      phone: booking.phone || "Not provided",
      details: `Billboard: ${billboard.name} | Campaign: ${booking.campaignTitle} | Type: ${booking.campaignType} | Dates: ${booking.startDate.toLocaleDateString()} - ${booking.endDate.toLocaleDateString()} | Duration: ${booking.campaignDuration}`,
      totalPrice: Number(booking.totalPrice),
    }).catch(console.error);

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
