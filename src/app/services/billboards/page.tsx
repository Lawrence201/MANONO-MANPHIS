import { prisma } from "@/lib/prisma";
import BillboardRentalClient from "./BillboardRentalClient";

export default async function BillboardRentalPage() {
  const billboards = await prisma.billboard.findMany({
    include: { galleryImages: true, bookings: true },
    orderBy: { createdAt: 'desc' }
  });
  
  const dynamicBillboards = billboards.map(b => {
    const city = b.city.charAt(0).toUpperCase() + b.city.slice(1).toLowerCase();
    const address = b.address.split(',')[0].charAt(0).toUpperCase() + b.address.split(',')[0].slice(1).toLowerCase();

    const now = new Date();
    const bookedSlots = (b as any).bookings?.reduce((sum: number, bk: any) => {
      if (bk.status === 'cancelled' || bk.status === 'completed' || bk.status === 'rejected') return sum;
      if (now < bk.startDate || now > bk.endDate) return sum;
      return sum + bk.slotsRequested;
    }, 0) || 0;
    const remainingSlots = Math.max(0, (b.maxSlots || 12) - bookedSlots);

    return {
      id: b.id,
      name: b.name,
      subtitle: b.assetCode,
      image: b.featureImage || "/billboards/bill_boards1.webp",
      images: [b.featureImage, ...(b.galleryImages?.map((g: any) => g.imagePath) || [])].filter(Boolean),
      price: `GH₵ ${Number(b.weeklyRate).toLocaleString()}`,
      specs: [
        { label: "Location", value: city },
        { label: "Duration", value: b.minDuration?.replace(/m$/, " Month").replace(/w$/, " Week") || "1 Week" },
        { label: "Dimension", value: b.dimensions || "N/A" },
        { label: "Type", value: (b.screenType?.toUpperCase()) || "DIGITAL LED" }
      ],
      location: `${city}, ${address}`,
      supplier: "Media Division",
      years: b.category,
      rating: 5.0,
      latitude: b.latitude || "5.603",
      longitude: b.longitude || "-0.186",
      maxSlots: remainingSlots
    };
  });

  return <BillboardRentalClient dynamicBillboards={dynamicBillboards} />;
}
