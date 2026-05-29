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
import { ProductCard } from "@/components/website/product-card";

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
    price: "GH₵ 20",
    oldPrice: "GH₵ 24",
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
    price: "GH₵ 25",
    oldPrice: "GH₵ 30",
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
    price: "GH₵ 32",
    oldPrice: "GH₵ 34",
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
    price: "GH₵ 22",
    oldPrice: "GH₵ 26",
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
    price: "GH₵ 15",
    oldPrice: "GH₵ 18",
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
    price: "GH₵ 24",
    oldPrice: "GH₵ 28",
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
              price: (function() {
                const p = Number(db.pricePerUnit) || 0;
                let multiplier = 1;
                let pkgName = "Unit";
                
                if (db.packagingType === "drum") pkgName = "Drum";
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


const Clock = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
