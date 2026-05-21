"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Star, LayoutGrid, List, Filter, Heart, Repeat, Eye, ShoppingCart, MapPin, Package, Hash, Activity } from "lucide-react";
import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { ProductsHero } from "@/components/website/products-hero";
import { getHoneyCategories, getHoneyPackagingTypes, getHoneyPackagingSizes, getHoneyProducts } from "@/lib/actions/product-actions";

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


const cashewProducts = [
  {
    id: 7,
    name: "Premium Raw Cashew Nuts | Grade W320 Export Quality",
    price: "$20",
    oldPrice: "$24",
    discount: "-16%",
    rating: 5,
    image: "/product_cashew_card.png",
    category: "Raw Cashews",
    onSale: true,
    countdown: "299d : 13h : 55m : 52s"
  },
  {
    id: 8,
    name: "Roasted Jumbo Cashews | Sea Salted & Crunchy",
    price: "$25",
    oldPrice: "$30",
    discount: "-15%",
    rating: 4,
    image: "/product_cashew_card.png",
    category: "Roasted Cashews",
    onSale: true,
    countdown: "238d : 13h : 55m : 52s"
  },
  {
    id: 9,
    name: "Organic Cashew Butter | 100% Pure & Unprocessed",
    price: "$32",
    oldPrice: "$34",
    discount: "-6%",
    rating: 5,
    image: "/product_cashew_card.png",
    category: "Cashew Butter",
    onSale: true,
    countdown: "225d : 13h : 55m : 52s"
  },
  {
    id: 10,
    name: "Salted Caramel Cashews | Sweet & Salty Premium Snack",
    price: "$22",
    oldPrice: "$26",
    discount: "-15%",
    rating: 5,
    image: "/product_cashew_card.png",
    category: "Roasted Cashews",
    onSale: true,
    countdown: "185d : 10h : 20m : 15s"
  },
  {
    id: 11,
    name: "Broken Cashew Kernels | Perfect for Baking & Cooking",
    price: "$15",
    oldPrice: "$18",
    discount: "-16%",
    rating: 4,
    image: "/product_cashew_card.png",
    category: "Raw Cashews",
    onSale: true,
    countdown: "120d : 08h : 45m : 30s"
  },
  {
    id: 12,
    name: "Honey Glazed Cashews | Premium Crunchy & Sweet Treat",
    price: "$24",
    oldPrice: "$28",
    discount: "-14%",
    rating: 5,
    image: "/product_cashew_card.png",
    category: "Roasted Cashews",
    onSale: true,
    countdown: "310d : 15h : 10m : 05s"
  }
];

export default function ShopPage() {
  const [honeyProducts, setHoneyProducts] = useState<any[]>([]);
  const [honeyLoading, setHoneyLoading] = useState(true);
  const [honeyCategories, setHoneyCategories] = useState<string[]>([]);
  const [honeyPackaging, setHoneyPackaging] = useState<string[]>([]);
  const [honeySizes, setHoneySizes] = useState<string[]>([]);

  useEffect(() => {
    getHoneyProducts().then((res) => {
      if (res.success && res.data) {
        setHoneyProducts(
          (res.data as any[]).map((db) => {
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
              price: `$${Number(db.pricePerUnit).toFixed(2)}${db.priceUnitType === "per_liter" ? "/Liter" : db.priceUnitType === "per_kg" ? "/kg" : db.priceUnitType === "per_ton" ? "/ton" : db.priceUnitType === "per_unit" ? "/unit" : `/${db.priceUnitType}`}`,
            };
          })
        );
      }
      setHoneyLoading(false);
    });

    getHoneyCategories().then((res) => {
      if (res.success && res.data) {
        const { counts, total } = res.data;
        const formatted = [
          `Our Store (${total})`,
          ...Object.entries(counts).map(
            ([cat, count]) => `${CATEGORY_LABELS[cat] || cat} (${count})`
          ),
        ];
        setHoneyCategories(formatted);
      }
    });

    getHoneyPackagingTypes().then((res) => {
      if (res.success && res.data) {
        setHoneyPackaging(res.data.map((t) => PACKAGING_LABELS[t] || t));
      }
    });

    getHoneyPackagingSizes().then((res) => {
      if (res.success && res.data) {
        setHoneySizes(res.data);
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <WebsiteHeader />

      <main className="pt-0 pb-32">
        <ProductsHero />

        {/* Section 1: Honey */}
        <ShopSection
          title="Honey"
          subtitle="Premium Grade Export Quality"
          products={honeyProducts}
          loading={honeyLoading}
          categories={honeyCategories}
          highlights={honeyPackaging}
          sizes={honeySizes}
        />

        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="border-t border-gray-100 my-8" />
        </div>

        {/* Section 2: Cashews */}
        <ShopSection
          title="Cashew"
          subtitle="Premium Export Quality"
          products={cashewProducts}
          categories={["Our Store (20)", "Raw Cashews (16)", "Roasted Cashews (14)", "Cashew Butter (15)"]}
        />
      </main>

      <WebsiteFooter />
    </div>
  );
}

function ShopSection({ title, subtitle, products, loading = false, categories, highlights = [], sizes = [] }: { title: string, subtitle: string, products: any[], loading?: boolean, categories: string[], highlights?: string[], sizes?: string[] }) {
  return (
    <div className="container mx-auto px-4 max-w-[1400px] mt-20">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
          {/* Categories */}
          <div className="bg-[#f9f9f9] p-6 rounded-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-wider">Shop By Categories</h3>
              <div className="w-4 h-0.5 bg-[#ffcc00]" />
            </div>
            <ul className="space-y-4">
              {categories.map((cat) => (
                <li key={cat} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-4 h-4 border border-gray-200 bg-white group-hover:border-[#ffcc00] transition-colors" />
                  <span className="text-[13px] text-gray-500 font-bold group-hover:text-[#ffcc00] transition-colors uppercase tracking-wide">{cat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Highlights — Packaging Types from DB */}
          {highlights.length > 0 && (
            <div className="bg-[#f9f9f9] p-6 rounded-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-wider">Packaging Type</h3>
                <div className="w-4 h-0.5 bg-[#ffcc00]" />
              </div>
              <ul className="space-y-4">
                {highlights.map((item, idx) => (
                  <li key={item} className={`text-[13px] font-black uppercase tracking-widest cursor-pointer transition-colors ${idx === 0 ? "text-[#ffcc00]" : "text-gray-500 hover:text-[#ffcc00]"}`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Filter By Weight — from DB */}
          {sizes.length > 0 && (
            <div className="bg-[#f9f9f9] p-6 rounded-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                <h3 className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-wider">Filter By Weight</h3>
                <div className="w-4 h-0.5 bg-[#ffcc00]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((w) => (
                  <button key={w} className="px-3 py-1.5 border border-gray-200 bg-white text-[11px] font-black uppercase tracking-widest text-gray-500 hover:border-[#ffcc00] hover:bg-[#ffcc00] hover:text-black transition-all">
                    {w}
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
            <h2 className="text-[24px] font-black text-[#1a1a1a] uppercase tracking-tight">{title} <span className="text-[#ffcc00]">Catalog</span></h2>
            <div className="flex items-center gap-6">
              <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">{subtitle}</p>
              <div className="flex items-center gap-1">
                <div className="p-2 text-[#ffcc00]"><LayoutGrid className="w-5 h-5" /></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="border border-gray-100 rounded-sm overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-100" />
                  <div className="px-6 pt-4 pb-6 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-24 bg-gray-50 rounded mt-4" />
                  </div>
                </div>
              ))
            ) : products.length === 0 ? (
              <div className="col-span-3 py-24 flex flex-col items-center text-center text-gray-400">
                <Package className="w-10 h-10 mb-4 opacity-30" />
                <p className="text-[13px] font-black uppercase tracking-widest">No products available yet</p>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


function ProductCard({ product }: { product: any }) {
  const images: string[] = product.images || [product.image];
  const [imgIndex, setImgIndex] = useState(0);

  const cycleImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="group border border-gray-100 rounded-sm hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden flex flex-col">

      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f6f6f6]">
        <Link href={`/products/${product.id}`} className="absolute inset-0">
          <Image
            key={images[imgIndex]}
            src={images[imgIndex]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </Link>

        {/* Polygon divider at the bottom of the image */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10 h-10 bg-white"
          style={{ clipPath: "polygon(0px 100%, 0px 45%, 15% 45%, 20% 0px, 80% 0px, 85% 45%, 100% 45%, 100% 100%)" }}
        />

        {/* Hover action icons */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 z-10">
          <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#ffcc00] transition-colors">
            <Heart className="w-4 h-4 text-black" />
          </button>
          <button
            onClick={cycleImage}
            title={images.length > 1 ? `View next image (${images.length} total)` : "No extra images"}
            className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#ffcc00] transition-colors"
          >
            <Repeat className="w-4 h-4 text-black" />
          </button>
          <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#ffcc00] transition-colors">
            <Eye className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Image counter dot indicators (only if multiple images) */}
        {images.length > 1 && (
          <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-20 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIndex ? "bg-[#ffcc00] scale-125" : "bg-white/70"}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="px-6 pt-2 pb-6 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`}>
          <h2 className="text-[15px] font-bold text-[#1a1a1a] mb-1 leading-tight line-clamp-2 hover:text-[#ffcc00] cursor-pointer transition-colors">
            {product.name}
          </h2>
        </Link>
        {product.price && (
          <p className="text-[#ffcc00] font-black text-[17px] mb-2">{product.price}</p>
        )}
        {product.description && (
          <p className="text-[12px] text-gray-400 leading-relaxed line-clamp-2 mb-2">
            {product.description}
          </p>
        )}

        {product.warehouse && (
          <div className="mt-auto">
            <div className="rounded-[10px] overflow-hidden border border-gray-100 mb-4">
              {[
                { icon: MapPin,   label: "Origin",     value: product.warehouse    },
                { icon: Package,  label: "Packaging", value: product.packagingType },
                { icon: Hash,     label: "MOQ",       value: product.moq           },
                { icon: Activity, label: "Stock",     value: product.stockStatus   },
              ].map(({ icon: Icon, label, value }, i) => (
                <div key={label} className={`flex items-center justify-between px-4 py-2.5 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}>
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-[#ffcc00]" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">{label}</span>
                  </div>
                  <span className="text-[12px] font-bold text-[#1a1a1a]">{value}</span>
                </div>
              ))}
            </div>

            <button className="w-full bg-[#ffcc00] hover:bg-black hover:text-white text-black py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2">
              <Eye className="w-3.5 h-3.5" /> View Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const Clock = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
