import Image from "next/image";
import Link from "next/link";
import { Phone, Clock, Star, ArrowRight, MapPin, Monitor, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { BillboardCatalogCard } from "./billboard-card";
import { ProductCard } from "./product-card";
import { getHoneyProducts } from "@/lib/actions/product-actions";
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
    price: "GH₵ 10.00",
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
    price: "GH₵ 15.00",
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
    price: "GH₵ 20.00",
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
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12 md:mb-20 max-w-3xl mx-auto">
          <p className="text-[#eea000] font-bold tracking-[0.3em] text-[11px] md:text-[12px] uppercase mb-4 md:mb-6">
            {type === "products" ? "Catalog" : "Billboard Catalog"}
          </p>
          <h2 
            className="text-[36px] min-[480px]:text-[42px] md:text-[56px] font-bold text-[#1a1a1a] mb-6 md:mb-8 leading-[1.05] tracking-[-0.04em] uppercase transform origin-center max-[1028px]:text-[40px] max-[1028px]:px-4"
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
          {items.slice(0, 6).map((item) => (
            type === "billboards" ? (
              <BillboardCatalogCard key={item.id} item={item} />
            ) : (
              <ProductCard key={item.id} product={item} />
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
    take: 6,
    include: { galleryImages: true, bookings: true },
    orderBy: { createdAt: 'desc' }
  });
  
  const items: ProductItem[] = billboards.map(b => {
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

export async function HoneyCatalog() {
  const CATEGORY_LABELS: Record<string, string> = {
    raw: "Raw Honey",
    processed: "Processed Honey",
    organic: "Organic Certified",
    wild: "Wild Honey",
  };

  const PACKAGING_LABELS: Record<string, string> = {
    bottle: "Glass Bottles",
    jerrycan: "Plastic Jerrycans",
    bucket: "Food-grade Buckets",
    drum: "Steel Drums",
    container: "IBC Totes",
  };

  const WAREHOUSE_LABELS: Record<string, string> = {
    accra_warehouse: "Accra",
    kumasi_hub: "Kumasi",
    tema_cold: "Tema",
  };

  const STOCK_LABELS: Record<string, string> = {
    in_stock: "In Stock",
    low_stock: "Low Stock",
    out_of_stock: "Out of Stock",
  };

  const res = await getHoneyProducts();
  let honeyProducts: any[] = [];
  
  if (res.success && res.data) {
    honeyProducts = (res.data as any[]).map((db) => {
      const galleryPaths: string[] = (db.galleryImages || []).map((g: any) => g.imagePath || g);
      const allImages = [
        ...(db.featureImage ? [db.featureImage] : []),
        ...galleryPaths,
      ].filter(Boolean);
      return {
        id: db.id,
        image: db.featureImage || "/product_honey_card.png",
        images: allImages.length > 0 ? allImages : [db.featureImage || "/product_honey_card.png"],
        name: db.name,
        category: CATEGORY_LABELS[db.category] || db.category,
        description: db.description || "",
        warehouse: WAREHOUSE_LABELS[db.warehouse] || db.warehouse || "—",
        packagingType: PACKAGING_LABELS[db.packagingType] || db.packagingType || "—",
        moq: `${db.moqValue} ${db.moqUnit}`,
        stockStatus: STOCK_LABELS[db.stockStatus] || db.stockStatus || "—",
        price: (function() {
          const p = Number(db.pricePerUnit) || 0;
          let multiplier = 1;
          let pkgName = "Unit";
          
          if (db.packagingType === "drum" || db.packagingType?.toLowerCase().startsWith("dru")) pkgName = "Drum";
          else if (db.packagingType === "bucket") pkgName = "Bucket";
          else if (db.packagingType === "container") pkgName = "IBC Tote";
          else if (db.packagingType === "bottle") pkgName = "Bottle";
          else if (db.packagingType) pkgName = db.packagingType.charAt(0).toUpperCase() + db.packagingType.slice(1);
          
          if (db.priceUnitType === 'per_kg' && db.packagingSize) {
            const matchKg = db.packagingSize.match(/(\d+(?:\.\d+)?)kg/i);
            if (matchKg) multiplier = Number(matchKg[1]);
          } else if (db.priceUnitType === 'per_liter' && db.packagingSize) {
            const matchL = db.packagingSize.match(/(\d+(?:\.\d+)?)L/i);
            if (matchL) multiplier = Number(matchL[1]);
          }
          
          const finalPrice = p * multiplier;
          return `GH₵ ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / ${pkgName}`;
        })(),
      };
    });
  }

  return (
    <ProductsGrid 
      type="products" 
      items={honeyProducts as any} 
    />
  );
}
