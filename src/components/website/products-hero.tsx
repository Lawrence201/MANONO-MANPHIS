"use client";

import Image from "next/image";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface ProductsHeroProps {
  title?: string;
  highlightTitle?: string;
  backgroundImage?: string;
  breadcrumbTitle?: string;
  highlightColor?: string;
}

export function ProductsHero({
  title = "HONEY &",
  highlightTitle = "CASHEW",
  backgroundImage = "/hero_img.webp",
  breadcrumbTitle = "Products",
  highlightColor = "#eea000"
}: ProductsHeroProps) {
  return (
    <section className="relative px-4">
      <div className="relative w-full h-[450px] flex flex-col items-center justify-center overflow-hidden rounded-b-[60px] shadow-2xl">
        {/* Background Image */}
        <Image
          src={backgroundImage}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        
        {/* Heavy Dark Overlay */}
        <div className="absolute inset-0 bg-black/75 z-10" />

        {/* Content */}
        <div className="relative z-20 text-center px-4">
          <h1
            className="text-white uppercase font-black mb-4"
            style={{ 
              fontSize: "clamp(60px, 10vw, 110px)", 
              fontFamily: "var(--font-bebas-neue), sans-serif",
              letterSpacing: "0.02em"
            }}
          >
            {title} <span style={{ color: highlightColor }}>{highlightTitle}</span>
          </h1>
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-3 text-white/90 font-mono text-sm tracking-widest uppercase">
            <Link href="/" className="hover:text-[#eea000] transition-colors">Home</Link>
            <span className="opacity-40">-</span>
            <span style={{ color: highlightColor }}>{breadcrumbTitle}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
