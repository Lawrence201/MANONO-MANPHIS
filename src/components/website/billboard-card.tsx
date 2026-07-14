"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Calendar,
  Clock,
  Monitor,
  Phone
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export function BillboardCatalogCard({ item }: { item: ProductItem }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Use dynamic coordinates or default to Accra
  const lat = item.latitude && item.latitude !== "0" ? item.latitude : "5.603";
  const lng = item.longitude && item.longitude !== "0" ? item.longitude : "-0.186";

  // Gallery images support
  const images = item.images || [item.image];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group bg-white rounded-[16px] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-black/10 transition-all duration-500 hover:shadow-[0_40px_80px_rgba(0,0,0,0.12)] flex flex-col h-full font-inter">
      {/* Visual Header */}
      <div className="relative aspect-[1.6/1] rounded-[12px] overflow-hidden mb-4 group/image shadow-inner">
        <Image 
          src={images[activeImageIndex]} 
          alt={item.name} 
          fill 
          className="object-cover transition-all duration-1000 group-hover/image:scale-105"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={prevImage}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/image:opacity-100 transition-all hover:bg-black/40 z-20 border border-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover/image:opacity-100 transition-all hover:bg-black/40 z-20 border border-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 px-2 py-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); setActiveImageIndex(i); }}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-300",
                  activeImageIndex === i ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <div className="bg-white/20 backdrop-blur-xl px-2.5 py-1 rounded-full flex items-center border border-white/10 shadow-xl">
            <span className="text-[9px] font-bold text-white capitalize">
              {["standard", "premium"].includes(item.years?.toLowerCase() || "") ? "Available" : (item.years || "Available")}
            </span>
          </div>
        </div>

        {/* Bottom Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 inset-x-0 p-5 pb-8 flex items-end justify-between z-10">
          <div className="flex-1 pr-4">
            <h3 className="text-white text-[15px] font-bold tracking-tight leading-tight mb-1 drop-shadow-md">
              {item.name}
            </h3>
            <div className="flex items-center gap-1.5 text-white/80">
              <MapPin className="w-3 h-3 text-white/60" />
              <span className="text-[10px] font-semibold drop-shadow-sm">
                {item.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-1 flex-1 flex flex-col">
        {/* Price Tag */}
        <div className="mb-3">
          <h2 className="text-[22px] font-black text-[#1a1a1a] tracking-tight leading-tight">
            {item.price}
          </h2>
        </div>

        {/* Specs Table */}
        <div className="rounded-[10px] overflow-hidden border border-gray-100 mb-5">
          {item.specs.slice(0, 4).map((spec, i) => (
            <div 
              key={i} 
              className={`flex justify-between items-center px-4 py-1.5 ${spec.label === "Duration" || spec.label === "Type" ? 'bg-[#f6f6f6]' : (i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50')}`}
            >
              <div className="flex items-center gap-2">
                {spec.label === "Location" ? <MapPin className="w-3 h-3 text-[#eea000]" /> :
                 spec.label === "Duration" ? <Calendar className="w-3 h-3 text-[#eea000]" /> :
                 spec.label === "Dimension" ? <Monitor className="w-3 h-3 text-[#eea000]" /> :
                 <Clock className="w-3 h-3 text-[#eea000]" />}
                <span className="text-gray-400 font-bold text-[9px] uppercase tracking-wide">{spec.label}</span>
              </div>
              <span className="text-[#1a1a1a] font-bold text-[11px]">{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <Link href={`/billboard-booking?hallId=${item.id}`} className="block w-full">
            <button className="w-full bg-[#eea000] text-white rounded-[6px] h-[42px] font-bold text-[11px] uppercase flex items-center justify-center gap-2 hover:bg-[#d89000] transition-all">
              BOOK NOW <Calendar className="w-3 h-3" />
            </button>
          </Link>
          <Link href={`/products/${item.id}?type=billboard`} className="block w-full">
            <button className="w-full bg-[#e2e2e2] text-[#1a1a1a] rounded-[6px] h-[42px] font-bold text-[11px] uppercase flex items-center justify-center gap-1.5 hover:bg-[#d4d4d4] transition-all">
              DETAILS <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>

        {/* Footer Info */}
        <div className="mt-auto pt-1 flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-[#eea000] shrink-0" />
              <span className="text-[#1a1a1a] font-bold text-[12px] whitespace-nowrap">{item.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#eea000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M12 2v8" />
                <path d="M5 10h14" />
                <path d="M19 10v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3" />
                <path d="M12 17v5" />
              </svg>
              <span className="text-[#1a1a1a] font-bold text-[12px] whitespace-nowrap">{item.maxSlots || 12} Available Slots</span>
            </div>
          </div>

          {/* Interactive Map Preview */}
          <a 
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-[105px] h-[60px] bg-gray-50 rounded-[6px] overflow-hidden border border-gray-100 relative group/map shadow-inner shrink-0"
          >
            <Image 
              src={`https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=13&l=map&size=150,150`}
              alt="Google Maps Location"
              fill
              unoptimized
              className="object-cover transition-transform duration-700 group-hover/map:scale-110"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md animate-bounce">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
