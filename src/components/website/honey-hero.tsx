"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "/bill_board.png",
    subtitle: "Premium Outdoor Advertising",
    title: "DIGITAL BILLBOARD & BRANDING SOLUTIONS",
    description: "Reach thousands of potential customers daily through our strategically located digital billboards. Book your exclusive slot today."
  },
  {
    image: "/hero_img.webp",
    subtitle: "Global Trade Starts Here",
    title: "BULK HONEY, CASHEW & SHEA EXPORTS",
    description: "We connect international buyers with premium Ghanaian products through structured sourcing, quality assurance, and efficient logistics."
  },
  {
    image: "/hero_img_2.png",
    subtitle: "Reliable Supply Chain",
    title: "PREMIUM COMMODITIES & LOGISTICS",
    description: "Providing sustainable agricultural solutions and seamless export services across the globe with guaranteed quality."
  },
  {
    image: "/sheabutta.png",
    subtitle: "Pure Shea Butter Exports",
    title: "TRADITIONALLY PROCESSED SHEA",
    description: "Supplying the cosmetic and food industries with high-grade, ethically sourced shea butter from our organic networks."
  }
];

export function HoneyHero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      duration: 50, // Slower, smoother transition
      skipSnaps: false
    }, 
    [Autoplay({ delay: 8000, stopOnInteraction: false })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: "90vh" }}>
      {/* ── Embla Viewport ── */}
      <div className="overflow-hidden h-full" ref={emblaRef} style={{ minHeight: "90vh" }}>
        <div className="flex h-full" style={{ minHeight: "90vh" }}>
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full flex items-center" style={{ minHeight: "90vh" }}>
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
              {/* Dark Overlay (Conditional for slide 3) */}
              <div className={`absolute inset-0 z-10 ${index === 2 ? "bg-black/65" : "bg-black/45"}`} />

              {/* Main Content (within the slide) */}
              <div className="relative z-20 container mx-auto px-8 py-24">
                <div className="max-w-[750px] animate-in fade-in slide-in-from-left-8 duration-1000">
                  <p className="text-[#eea000] text-[12px] font-bold tracking-[0.4em] uppercase mb-5 drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                  
                  <h1
                    className="font-black text-white leading-[1.1] mb-8 uppercase"
                    style={{ 
                      fontSize: "clamp(44px, 6.5vw, 88px)", 
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      textShadow: "0 2px 10px rgba(0,0,0,0.2)"
                    }}
                  >
                    {slide.title.split('&').map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && <><br />&</>}
                      </span>
                    ))}
                  </h1>
                  
                  <p className="text-gray-100 text-lg leading-relaxed mb-12 max-w-xl opacity-90">
                    {slide.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-5">
                    <button className="bg-[#eea000] text-[#1a1a1a] text-[11px] font-black tracking-[0.25em] uppercase px-12 py-5 hover:bg-white transition-all shadow-2xl">
                      REQUEST A QUOTE
                    </button>
                    <button className="bg-transparent border-2 border-white text-white text-[11px] font-black tracking-[0.25em] uppercase px-12 py-5 hover:bg-white hover:text-[#1a1a1a] transition-all">
                      OUR SERVICES
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* ── Navigation Arrows (Fixed Position relative to section) ── */}
      <button 
        onClick={scrollPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all hidden md:block"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-8 h-8" />
      </button>
      
      <button 
        onClick={scrollNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full border border-white/30 text-white hover:bg-white hover:text-black transition-all hidden md:block"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* ── Slide Indicators ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 transition-all duration-500 ${index === selectedIndex ? "w-12 bg-[#eea000]" : "w-6 bg-white/40"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ── Decorative subtle bottom gradient ── */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
