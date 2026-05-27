"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Repeat, Eye, MapPin, Package, Hash, Activity } from "lucide-react";

export function ProductCard({ product }: { product: any }) {
  const images: string[] = product.images || [product.image];
  const [imgIndex, setImgIndex] = useState(0);

  const cycleImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="group border border-gray-100 rounded-sm hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden flex flex-col h-full">

      {/* Image Area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f6f6f6] shrink-0">
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
          className="absolute -bottom-px left-0 right-0 z-10 h-[41px] bg-white"
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

            <Link href={`/products/${product.id}`} className="block w-full">
              <button className="w-full bg-[#ffcc00] hover:bg-black hover:text-white text-black py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center">
                View Details
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
