"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Star, LayoutGrid, List, Filter, Heart, Repeat, Eye, ShoppingCart } from "lucide-react";
import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { ProductsHero } from "@/components/website/products-hero";

const products = [
  {
    id: 1,
    name: "24 Mantra Organic 100% Pure & RAW Honey | Zero Added Sugar",
    price: "$18 - $20",
    rating: 5,
    image: "/product_honey_card.png",
    category: "Organic Honey",
    onSale: false,
    discount: "",
    hasVariants: true
  },
  {
    id: 2,
    name: "A Glass Jar Of Honey With Dipper Resting On Top Surrounded",
    price: "$29",
    rating: 4,
    image: "/product_honey_card.png",
    category: "Organic Honey",
    onSale: false,
    discount: "",
    hasVariants: false
  },
  {
    id: 3,
    name: "ANP BEE ,Raw Unpasteurized 100% Pure Natural Honey",
    price: "$18",
    originalPrice: "$20",
    rating: 4,
    image: "/product_honey_card.png",
    category: "Raw Honey",
    onSale: true,
    discount: "-10%",
    hasVariants: false,
    countdown: "299d : 13h : 55m : 52s"
  },
  {
    id: 4,
    name: "ANP BEE Raw Unpasteurized NMR Tested Natural Honey 100% Pure",
    price: "$24",
    rating: 5,
    image: "/product_honey_card.png",
    category: "Raw Honey",
    onSale: false,
    discount: "",
    hasVariants: false
  },
  {
    id: 5,
    name: "Avadata Organics 100% Pure Raw Honey Raw, Unprocessed..",
    price: "$32",
    originalPrice: "$34",
    rating: 5,
    image: "/product_honey_card.png",
    category: "Raw Honey",
    onSale: true,
    discount: "-6%",
    hasVariants: false,
    countdown: "225d : 13h : 55m : 52s"
  },
  {
    id: 6,
    name: "Buy 1Kg Lion Kashmir Honey & Get Kashmir Honey 500 Gm",
    price: "$28",
    originalPrice: "$30",
    rating: 5,
    image: "/product_honey_card.png",
    category: "Kashmiri Honey",
    onSale: true,
    discount: "-7%",
    hasVariants: false,
    countdown: "238d : 13h : 55m : 52s"
  }
];

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
          products={products}
          categories={["Our Store (20)", "Clover Honey (16)", "Raw Honey (14)", "Burst Honey (15)", "Organic Honey (15)", "Manuka Honey (15)", "Tupelo Honey (13)"]}
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

function ShopSection({ title, subtitle, products, categories }: { title: string, subtitle: string, products: any[], categories: string[] }) {
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

          {/* Highlights */}
          <div className="bg-[#f9f9f9] p-6 rounded-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-wider">Highlight</h3>
              <div className="w-4 h-0.5 bg-[#ffcc00]" />
            </div>
            <ul className="space-y-4">
              {["All Products", "Best Seller", "New Arrivals", "Sale", "Hot Items"].map((item, idx) => (
                <li key={item} className={`text-[13px] font-black uppercase tracking-widest cursor-pointer transition-colors ${idx === 0 ? "text-[#ffcc00]" : "text-gray-500 hover:text-[#ffcc00]"}`}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Filter By Weight */}
          <div className="bg-[#f9f9f9] p-6 rounded-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-[15px] font-black text-[#1a1a1a] uppercase tracking-wider">Filter By Weight</h3>
              <div className="w-4 h-0.5 bg-[#ffcc00]" />
            </div>
            <div className="flex flex-wrap gap-2">
              {["250g", "500g", "750g", "1kg", "2kg"].map((w) => (
                <button key={w} className="px-3 py-1.5 border border-gray-200 bg-white text-[11px] font-black uppercase tracking-widest text-gray-500 hover:border-[#ffcc00] hover:bg-[#ffcc00] hover:text-black transition-all">
                  {w}
                </button>
              ))}
            </div>
          </div>
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
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


function ProductCard({ product }: { product: any }) {
  return (
    <div className="group border border-gray-100 rounded-sm hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden flex flex-col">
      {/* Image Area */}
      <div className="relative aspect-square overflow-hidden bg-[#f6f6f6] flex items-center justify-center p-8">
        <Link href={`/products/${product.id}`} className="block relative w-full h-full flex items-center justify-center">
          <Image 
            src={product.image} 
            alt={product.name} 
            width={200}
            height={200}
            className="object-contain group-hover:scale-110 transition-transform duration-700"
          />
        </Link>
        
        {product.onSale && (
          <div className="absolute top-4 left-4 bg-[#ffcc00] text-black text-[11px] font-black px-3 py-1 rounded-sm shadow-lg z-10">
            {product.discount}
          </div>
        )}

        {product.countdown && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm py-2 px-3 rounded-sm flex items-center justify-center gap-2 shadow-sm translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <Clock className="w-3.5 h-3.5 text-[#ffcc00]" />
            <span className="text-[10px] font-black text-[#1a1a1a] tracking-wider">{product.countdown}</span>
          </div>
        )}

        <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
          {[Heart, Repeat, Eye].map((Icon, i) => (
            <button key={i} className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-[#ffcc00] transition-colors">
              <Icon className="w-4 h-4 text-black" />
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col">
        <p className="text-[#ffcc00] font-black text-[10px] uppercase tracking-[0.2em] mb-2">{product.category}</p>
        <Link href={`/products/${product.id}`}>
          <h2 className="text-[15px] font-black text-[#1a1a1a] mb-3 leading-tight line-clamp-2 min-h-[40px] hover:text-[#ffcc00] cursor-pointer transition-colors">
            {product.name}
          </h2>
        </Link>
        
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < product.rating ? "text-[#ffcc00] fill-[#ffcc00]" : "text-gray-200"}`} />
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[20px] font-black text-[#1a1a1a]">{product.price}</span>
            {product.oldPrice && <span className="text-[14px] text-gray-300 line-through font-bold">{product.oldPrice}</span>}
            {product.originalPrice && <span className="text-[14px] text-gray-300 line-through font-bold">{product.originalPrice}</span>}
          </div>

          <button className="w-full bg-black hover:bg-[#ffcc00] hover:text-black text-white py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2">
            {product.hasVariants ? <Repeat className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
            {product.hasVariants ? "Select Options" : "Add to Cart"}
          </button>
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
