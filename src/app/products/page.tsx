"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Star, LayoutGrid, List, Filter, Heart, Repeat, Eye, ShoppingCart, MapPin, Package, Hash, Activity } from "lucide-react";
import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { ProductsHero } from "@/components/website/products-hero";
import { getHoneyCategories, getHoneyPackagingTypes, getHoneyPackagingSizes, getHoneyProducts, getCashewProducts, getCashewCategories } from "@/lib/actions/product-actions";
import { ProductCard } from "@/components/website/product-card";

import { CashewPromoSection } from "@/components/website/cashew-promo-section";
import { CashewCard } from "@/components/website/cashew-card";

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


// Hardcoded cashew products removed, data is now fetched from database

export default function ShopPage() {
  const [honeyProducts, setHoneyProducts] = useState<any[]>([]);
  const [honeyLoading, setHoneyLoading] = useState(true);
  const [honeyCategories, setHoneyCategories] = useState<string[]>([]);
  const [honeyPackaging, setHoneyPackaging] = useState<string[]>([]);
  const [honeySizes, setHoneySizes] = useState<string[]>([]);

  const [cashewProductsList, setCashewProductsList] = useState<any[]>([]);
  const [cashewLoading, setCashewLoading] = useState(true);
  const [cashewCategories, setCashewCategories] = useState<string[]>([]);

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

    getCashewProducts().then((res) => {
      if (res.success && res.data) {
        setCashewProductsList(
          (res.data as any[]).map((db) => {
            const galleryPaths: string[] = (db.galleryImages || []).map((g: any) => g.imagePath || g);
            const allImages = [
              ...(db.featureImage ? [db.featureImage] : []),
              ...galleryPaths,
            ].filter(Boolean);
            return {
              id: db.id,
              image: db.featureImage || "/cashew.png",
              images: allImages.length > 0 ? allImages : [db.featureImage || "/cashew.png"],
              name: db.name,
              category: db.category,
              description: db.description || "",
              warehouse: WAREHOUSE_LABELS[db.warehouse] || db.warehouse || "—",
              packagingType: PACKAGING_LABELS[db.packagingType] || db.packagingType || "—",
              moq: `${db.moqValue} ${db.moqUnit || ""}`,
              stockStatus: STOCK_LABELS[db.stockStatus] || db.stockStatus || "—",
              price: (function() {
                const p = Number(db.pricePerUnit) || 0;
                let multiplier = 1;
                if (db.packagingSize) {
                  const match = String(db.packagingSize).match(/(\d+(?:\.\d+)?)/);
                  if (match) multiplier = Number(match[1]);
                }
                const finalPrice = p * multiplier;
                return finalPrice > 0 ? `GH₵ ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "Ask for Price";
              })()
            };
          })
        );
      }
      setCashewLoading(false);
    });

    getCashewCategories().then((res) => {
      if (res.success && res.data) {
        const { counts, total } = res.data;
        const formatted = [
          `Our Store (${total})`,
          ...Object.entries(counts).map(([cat, count]) => {
            const formattedCat = cat
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
            return `${formattedCat} (${count})`;
          }),
        ];
        setCashewCategories(formatted);
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

        <div className="container mx-auto px-4 max-w-[1500px]">
          <div className="border-t border-gray-100 my-8" />
        </div>

        <CashewPromoSection />

        {/* Section 2: Cashews */}
        <ShopSection
          title="Cashew"
          subtitle="Premium Export Quality"
          products={cashewProductsList}
          loading={cashewLoading}
          categories={cashewCategories.length > 0 ? cashewCategories : ["Our Store (0)"]}
          cardType="cashew"
        />
      </main>

      <WebsiteFooter />
    </div>
  );
}

function ShopSection({ title, subtitle, products, loading = false, categories, highlights = [], sizes = [], cardType = "default" }: { title: string, subtitle: string, products: any[], loading?: boolean, categories: string[], highlights?: string[], sizes?: string[], cardType?: "default" | "cashew" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  
  const totalPages = Math.ceil((products?.length || 0) / ITEMS_PER_PAGE);
  const currentProducts = (products || []).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className={`container mx-auto px-4 mt-20 ${cardType === "cashew" ? "max-w-[1750px]" : "max-w-[1500px]"}`}>
      <div className={`flex flex-col lg:flex-row ${cardType === "cashew" ? "gap-12 lg:gap-16" : "gap-8"}`}>
        
        {/* Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-4">
          {/* Categories */}
          <div className="bg-[#f9f9f9] p-6 max-[480px]:p-4 rounded-sm border border-gray-100 transition-all">
            <div className="flex items-center justify-between mb-6 max-[480px]:mb-4 border-b border-gray-100 pb-4 max-[480px]:pb-3 transition-all">
              <h3 className="text-[15px] max-[480px]:text-[13px] font-black text-[#1a1a1a] uppercase tracking-wider transition-all">Shop By Categories</h3>
              <div className="w-4 h-0.5 bg-[#ffcc00]" />
            </div>
            <ul className="space-y-4 max-[480px]:space-y-3 transition-all">
              {categories.map((cat) => (
                <li key={cat} className="flex items-center gap-3 max-[480px]:gap-2 group cursor-pointer transition-all">
                  <div className="w-4 h-4 max-[480px]:w-3 max-[480px]:h-3 border border-gray-200 bg-white group-hover:border-[#ffcc00] transition-colors" />
                  <span className="text-[13px] max-[480px]:text-[12px] text-gray-500 font-bold group-hover:text-[#ffcc00] transition-all uppercase tracking-wide">{cat}</span>
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
        <div className="flex-1 mt-4 max-[480px]:mt-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-[480px]:gap-2 mb-10 max-[480px]:mb-6 pb-6 max-[480px]:pb-4 border-b border-gray-100 transition-all">
            <h2 className="text-[24px] max-[480px]:text-[20px] font-black text-[#1a1a1a] uppercase tracking-tight text-center sm:text-left transition-all">
              {title} <span className={cardType === "cashew" ? "text-[#9c4921]" : "text-[#ffcc00]"}>Catalog</span>
            </h2>
            <div className="flex items-center gap-6 max-[480px]:gap-3 transition-all">
              <p className="text-[13px] max-[480px]:text-[11px] text-gray-400 font-bold uppercase tracking-widest text-center sm:text-left transition-all">{subtitle}</p>
              <div className="flex items-center gap-1">
                <div className={`p-2 max-[480px]:p-1 ${cardType === "cashew" ? "text-[#9c4921]" : "text-[#ffcc00]"} transition-all`}>
                  <LayoutGrid className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4" />
                </div>
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
              currentProducts.map((product) => (
                cardType === "cashew" ? (
                  <CashewCard key={product.id} product={product} />
                ) : (
                  <ProductCard key={product.id} product={product} />
                )
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              
              <div className="flex gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    Math.abs(pageNumber - currentPage) <= 1
                  ) {
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          setCurrentPage(pageNumber);
                          window.scrollTo({ top: 400, behavior: 'smooth' });
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                          currentPage === pageNumber 
                            ? "bg-[#1a1a1a] text-white border border-[#1a1a1a]" 
                            : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                        }`}
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {pageNumber}
                      </button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          )}
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
