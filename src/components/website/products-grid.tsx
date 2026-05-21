import Image from "next/image";
import Link from "next/link";
import { Phone, Clock, Star, ArrowRight, MapPin, Monitor, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BillboardCatalogCard } from "./billboard-card";

interface ProductSpec {
  label: string;
  value: string;
}

interface ProductItem {
  id: number | string;
  name: string;
  subtitle: string;
  image: string;
  images?: string[];
  price: string;
  specs: ProductSpec[];
  location: string;
  supplier: string;
  years: string;
  rating: number;
  latitude?: string;
  longitude?: string;
  maxSlots?: number;
}

interface ProductsGridProps {
  type?: "products" | "billboards";
  title?: string;
  subtitle?: string;
  showViewMore?: boolean;
  items?: ProductItem[];
}

const agriculturalProducts = [
  {
    id: 1,
    name: "HEATHER HONEY",
    subtitle: "HEATHER HONEY",
    image: "/product_honey_card.png",
    price: "$10.00",
    specs: [
      { label: "Type", value: "Premium Raw" },
      { label: "Origin", value: "Ghana" },
      { label: "Grade", value: "Organic" },
      { label: "Brand", value: "Manono" }
    ],
    description: "Premium natural honeycomb harvested from the finest fields, rich in flavor and nutrients.",
    location: "Accra, Ghana",
    supplier: "Manono Manphis",
    years: "NEW",
    rating: 5.0
  },
  {
    id: 2,
    name: "JARRAH HONEY",
    subtitle: "JARRAH HONEY",
    image: "/product_honey_card.png",
    price: "$15.00",
    specs: [
      { label: "Type", value: "Rare Medicinal" },
      { label: "Origin", value: "Ghana" },
      { label: "Color", value: "Dark Amber" },
      { label: "Brand", value: "Manono" }
    ],
    description: "Rare and potent honey with a unique dark amber color and high medicinal properties.",
    location: "Accra, Ghana",
    supplier: "Manono Manphis",
    years: "10 yrs",
    rating: 4.9
  },
  {
    id: 3,
    name: "LINDEN HONEY",
    subtitle: "LINDEN HONEY",
    image: "/product_honey_card.png",
    price: "$20.00",
    specs: [
      { label: "Type", value: "Aromatic Light" },
      { label: "Origin", value: "Ghana" },
      { label: "Texture", value: "Creamy" },
      { label: "Brand", value: "Manono" }
    ],
    description: "Delicate and aromatic light honey with a subtle floral taste and creamy texture.",
    location: "Accra, Ghana",
    supplier: "Manono Manphis",
    years: "15 yrs",
    rating: 4.8
  }
];

export function ProductsGrid({ 
  type = "products", 
  title, 
  subtitle, 
  showViewMore = true, 
  items: customItems 
}: ProductsGridProps) {
  const defaultItems = type === "products" ? agriculturalProducts : [];
  const items: ProductItem[] = customItems || (defaultItems as ProductItem[]);

  return (
    <section className={`py-12 md:py-24 ${type === "products" ? "bg-[#f7f3f0]" : "bg-white"}`}>
      <div className="container mx-auto max-[450px]:px-0 min-[451px]:px-4 max-w-7xl">
        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
          <p className="text-[#eea000] font-bold tracking-[0.3em] text-[11px] md:text-[12px] uppercase mb-4 md:mb-6">
            {type === "products" ? "Catalog" : "Billboard Catalog"}
          </p>
          <h2 
            className="text-3xl md:text-[48px] font-bold text-[#1a1a1a] mb-6 md:mb-8 leading-[1.05] tracking-[-0.04em] uppercase transform origin-center max-[1028px]:text-[32px] max-[1028px]:px-4"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            {type === "products" ? "Available Product" : "Available Billboard Locations"}
          </h2>
          <p className="text-gray-500 text-[14px] md:text-[16px] leading-relaxed px-4 md:px-0">
            {type === "products" 
              ? "Check out our online shop for premium honey varieties, organic supplements, traditionally processed shea products, and more high-quality commodities."
              : "Explore our premium digital billboard spaces available for advertising campaigns, brand promotions, and business visibility."
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {items.map((item) => (
            type === "billboards" ? (
              <BillboardCatalogCard key={item.id} item={item} />
            ) : (
              <div key={item.id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100 flex flex-col h-full">
                <div className="relative h-56 min-[480px]:h-64 md:h-48 lg:h-52 overflow-hidden group">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 min-[480px]:p-6 md:p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="max-w-[70%]">
                      <h3 className="text-[19px] md:text-[20px] font-bold text-[#1a1a1a] leading-tight mb-1">{item.name}</h3>
                      <p className="text-gray-400 font-medium text-[10px] md:text-[11px] uppercase tracking-wider">{item.subtitle}</p>
                    </div>
                    <span className="text-xl md:text-2xl font-black text-[#1a1a1a]">{item.price}</span>
                  </div>

                  <button className="w-full bg-[#eea000] text-white py-3.5 font-bold text-[11px] md:text-[12px] uppercase hover:bg-[#1a1a1a] transition-all rounded-md mb-5 shadow-sm flex items-center justify-center gap-2">
                    Add to Cart
                  </button>

                  <div className="rounded-md overflow-hidden mb-6 border border-gray-100 text-[11px] md:text-[12px]">
                    {item.specs.map((spec, i) => (
                      <div key={i} className={`flex justify-between items-center px-4 py-2 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-medium">{spec.label}</span>
                        </div>
                        <span className="text-[#1a1a1a] font-bold text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 pt-2 mt-auto border-t border-gray-50">
                    <div className="flex items-center gap-2 pt-4">
                      <MapPin className="w-3.5 h-3.5 text-[#eea000] shrink-0" />
                      <span className="text-[#1a1a1a] font-bold text-[12px] md:text-[13px] truncate">{item.location}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 ml-auto">
                        <Star className="w-3.5 h-3.5 text-[#fbbf24] fill-[#fbbf24]" />
                        <span className="text-[11px] font-black text-[#1a1a1a]">{item.rating}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{item.years}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {showViewMore && (
          <div className="mt-20 text-center">
            <Link 
              href={type === "products" ? "/products" : "/services/billboards"} 
              className="inline-flex items-center gap-3 border-2 border-[#1a1a1a] text-[#1a1a1a] px-10 py-4 rounded-full font-bold text-[14px] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all group"
            >
              {type === "products" ? "Discover More Products" : "Explore More Slots"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export async function BillboardCatalog() {
  const billboards = await prisma.billboard.findMany({
    take: 3,
    include: { galleryImages: true, bookings: true },
    orderBy: { createdAt: 'desc' }
  });
  
  const items: ProductItem[] = billboards.map(b => {
    const city = b.city.charAt(0).toUpperCase() + b.city.slice(1).toLowerCase();
    const address = b.address.split(',')[0].charAt(0).toUpperCase() + b.address.split(',')[0].slice(1).toLowerCase();

    const bookedSlots = (b as any).bookings?.reduce((sum: number, bk: any) => {
      if (bk.status === 'cancelled') return sum;
      return sum + bk.slotsRequested;
    }, 0) || 0;
    const remainingSlots = Math.max(0, (b.maxSlots || 12) - bookedSlots);

    return {
      id: b.id,
      name: b.name,
      subtitle: b.assetCode,
      image: b.featureImage || "/billboards/bill_boards1.webp",
      images: [b.featureImage, ...(b.galleryImages?.map((g: any) => g.imagePath) || [])].filter(Boolean),
      price: `GH₵${Number(b.weeklyRate).toLocaleString()}`,
      specs: [
        { label: "Location", value: city },
        { label: "Duration", value: b.minDuration?.replace(/m$/, " Month").replace(/w$/, " Week") || "1 Week" },
        { label: "Dimension", value: b.dimensions || "N/A" },
        { label: "Type", value: (b.screenType?.toUpperCase()) || "DIGITAL LED" }
      ],
      location: `${city}, ${address}`,
      supplier: "Media Division",
      years: b.aspectRatio ? (b.aspectRatio.charAt(0).toUpperCase() + b.aspectRatio.slice(1)) : (b.category?.toLowerCase() === "standard" || b.category?.toLowerCase() === "landscape") ? "Landscape" : b.category?.toLowerCase() === "premium" ? "Portrait" : b.category || "Standard",
      rating: 5.0,
      latitude: b.latitude || "5.603",
      longitude: b.longitude || "-0.186",
      maxSlots: remainingSlots
    };
  });

  return (
    <ProductsGrid 
      type="billboards" 
      items={items} 
    />
  );
}
