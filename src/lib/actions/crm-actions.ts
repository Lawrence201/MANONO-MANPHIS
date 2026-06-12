"use server";

import { prisma } from "@/lib/prisma";

export async function getAggregatedCustomers() {
  try {
    const exportOrders = await prisma.exportOrder.findMany({
      where: {
        // Fetch all statuses so we can determine if they are pending or approved
      },
      select: { 
        id: true,
        referenceNumber: true,
        buyerType: true,
        email: true, 
        companyName: true, 
        phone: true, 
        taxId: true,
        destinationCountry: true, 
        city: true,
        deliveryAddress: true,
        stateRegion: true,
        postalCode: true,
        customsValue: true, 
        totalEstimatedCost: true, 
        quantityRequested: true, 
        unitMeasurement: true,
        shippingType: true,
        deliveryType: true,
        pickupOption: true,
        preferredDate: true,
        requiresFda: true,
        requiresPhyto: true,
        requiresOrganic: true,
        requiresOrigin: true,
        importRequirements: true,
        paymentMethod: true,
        depositRequired: true,
        product: { select: { name: true, pricePerUnit: true, priceUnitType: true, featureImage: true, moqUnit: true } }, 
        status: true,
        createdAt: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    const billboardBookings = await prisma.billboardBooking.findMany({
      where: {
        status: { in: ['approved', 'active', 'paused', 'completed'] }
      },
      select: { 
        id: true,
        email: true, 
        companyName: true, 
        fullName: true, 
        phone: true, 
        totalPrice: true, 
        slotsRequested: true,
        billboard: { select: { city: true, featureImage: true } }, 
        createdAt: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    const customerMap = new Map<string, any>();

    // Helper to format ISO countries
    const toIso = (raw: string): string => {
      if (!raw) return "GH";
      const m = raw.match(/\(([A-Z]{2})\)\s*$/);
      return m ? m[1] : raw;
    };

    const getFlag = (countryString: string) => {
        const lower = countryString.toLowerCase();
        if (lower.includes('russia') || lower.includes('ru')) return '🇷🇺';
        if (lower.includes('german') || lower.includes('de')) return '🇩🇪';
        if (lower.includes('usa') || lower.includes('us')) return '🇺🇸';
        if (lower.includes('france') || lower.includes('fr')) return '🇫🇷';
        if (lower.includes('uk') || lower.includes('kingdom')) return '🇬🇧';
        if (lower.includes('netherland')) return '🇳🇱';
        if (lower.includes('uae') || lower.includes('emirates')) return '🇦🇪';
        if (lower.includes('japan')) return '🇯🇵';
        if (lower.includes('spain')) return '🇪🇸';
        if (lower.includes('ghana')) return '🇬🇭';
        return '🌍';
    };

    const getCleanCountry = (raw: string) => {
        if (!raw) return "Unknown";
        return raw.split(" (")[0]; // "Russia (RU)" -> "Russia"
    }

    // Aggregate exports
    for (const o of exportOrders) {
      if (!o.email) continue;
      const key = o.email.toLowerCase();
      const rev = Number(o.totalEstimatedCost) || Number(o.customsValue) || (Number(o.quantityRequested) * Number(o.product?.pricePerUnit || 0));
      const cleanCountry = getCleanCountry(o.destinationCountry);
      
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: `C-${key}`,
          latestOrderId: o.referenceNumber ? `#${o.referenceNumber}` : `#CUST-${key.substring(0, 5).toUpperCase()}`,
          latestProductImage: o.product?.featureImage || "/map_thumbnail.png",
          latestQuantity: `${Number(o.quantityRequested)} ${o.unitMeasurement || o.product?.moqUnit || 'Units'}`.trim(),
          latestOrder: o,
          name: o.companyName || "Unknown Company",
          contact: o.email,
          phone: o.phone,
          country: cleanCountry,
          flag: getFlag(cleanCountry),
          revenue: 0,
          orders: 0,
          hasDeliveredOrder: false,
          type: "New",
          since: new Date(o.createdAt).getFullYear().toString()
        });
      }
      const c = customerMap.get(key);
      c.revenue += rev;
      c.orders += 1;
      if (o.status === "delivered") {
        c.hasDeliveredOrder = true;
      }
      const year = new Date(o.createdAt).getFullYear().toString();
      if (year < c.since) c.since = year;
    }

    // Aggregate billboards
    for (const b of billboardBookings) {
      if (!b.email) continue;
      const key = b.email.toLowerCase();
      const rev = Number(b.totalPrice || 0);

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: `C-${key}`,
          latestOrderId: `#BB-${b.id}`,
          latestProductImage: b.billboard?.featureImage || "/map_thumbnail.png",
          latestQuantity: `${b.slotsRequested || 1} Slot(s)`,
          name: b.companyName || b.fullName || "Unknown Company",
          contact: b.email,
          phone: b.phone,
          country: "Ghana",
          flag: "🇬🇭",
          revenue: 0,
          orders: 0,
          type: "New",
          since: new Date(b.createdAt).getFullYear().toString()
        });
      }
      const c = customerMap.get(key);
      c.revenue += rev;
      c.orders += 1;
      const year = new Date(b.createdAt).getFullYear().toString();
      if (year < c.since) c.since = year;
    }

    // Determine tiers
    const customers = Array.from(customerMap.values()).map(c => {
      const s = c.latestOrder?.status;
      if (!s || s === 'pending' || s === 'rejected') {
        c.type = "Pending";
      } else {
        c.type = "Approved";
      }
      return c;
    });

    const safeData = JSON.parse(JSON.stringify(customers.sort((a, b) => b.revenue - a.revenue)));
    return { success: true, data: safeData };
  } catch (error: any) {
    console.error("Failed to fetch CRM customers:", error);
    return { success: false, error: "Failed to load customers" };
  }
}
