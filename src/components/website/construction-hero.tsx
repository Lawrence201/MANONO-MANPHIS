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
    title: "DIGITAL BILLBOARD & ADVERTISING SOLUTIONS",
    description: "Promote your brand, business, event, or campaign through our strategically positioned digital billboards. Reach targeted audiences with high-visibility advertising placements and flexible booking options."
  },
  {
    image: "/construction/hero.jpg",
    subtitle: "Delivering Quality Construction",
    title: "BUILT WITH STRENGTH & PRECISION",
    description: "We believe that every business is uniquids our approach is never one size fits all We tailor our strategies to fit your goals hub."
  },
  {
    image: "/hero_img_2.png",
    subtitle: "Reliable Cashew Supply",
    title: "PREMIUM CASHEW & EXPORT SERVICES",
    description: "Supplying high-quality export-grade cashew nuts to international buyers through reliable sourcing, careful processing, and efficient logistics coordination."
  },
  {
    image: "/sheabutta.png",
    subtitle: "Premium Shea Butter Supply",
    title: "EXPORT-GRADE SHEA & BUTTER SOLUTIONS",
    description: "Providing high-quality Ghanaian shea butter for cosmetic, pharmaceutical, and industrial markets through reliable sourcing and professional export services."
  }
];

export function ConstructionHero() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      duration: 50, 
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
    <section className="relative w-full overflow-hidden min-h-[100vh]">
      {/* ── Embla Viewport ── */}
      <div className="overflow-hidden h-full min-h-[102vh]" ref={emblaRef}>
        <div className="flex h-full min-h-[102vh]">
          {slides.map((slide, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0 h-full flex items-center max-[1028px]:items-start max-[1028px]:pt-[140px] max-[480px]:pt-[110px] min-h-[102vh]">
              {/* Background Image */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                className="object-cover"
              />
              {/* Dark Overlay */}
              <div className={`absolute inset-0 z-10 ${index === 2 ? "bg-black/65" : "bg-black/45"}`} />

              {/* Main Content */}
              <div className="relative z-20 container mx-auto px-8 max-[1028px]:px-12 max-[480px]:px-6 mt-16 md:mt-0 max-[1028px]:mt-0">
                <div className="max-w-[800px] max-[1028px]:max-w-[650px] animate-in fade-in slide-in-from-left-8 duration-1000 min-[1029px]:ml-16">
                  <p className="text-[#FFD100] text-[13px] max-[1028px]:text-[12px] max-[480px]:text-[11px] font-bold tracking-[0.4em] uppercase mb-5 max-[480px]:mb-4 drop-shadow-sm">
                    {slide.subtitle}
                  </p>
                  
                  <h1
                    className="font-black text-white leading-[1.05] max-[1028px]:leading-[1.1] mb-8 max-[480px]:mb-6 uppercase"
                    style={{ 
                      fontSize: "clamp(34px, 7vw, 85px)", 
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
                  
                  <div className="w-[120px] max-[480px]:w-[80px] h-[2px] bg-white/30 mb-8 max-[480px]:mb-6"></div>
                  
                  <p className="text-gray-100 text-[17px] max-[1028px]:text-[16px] max-[480px]:text-[15px] leading-[1.8] mb-12 max-[1028px]:mb-10 max-[480px]:mb-8 max-w-[580px] max-[1028px]:max-w-[500px] opacity-90">
                    {slide.description}
                  </p>
                  
                  <div className="flex flex-row max-[480px]:flex-col items-start min-[481px]:items-center gap-4 max-[1028px]:gap-3 max-[480px]:gap-3 max-[480px]:w-full">
                    <button className="bg-[#FFD100] text-[#1a1a1a] text-[15px] max-[1028px]:text-[14px] font-bold tracking-wide px-8 max-[1028px]:px-6 py-4 max-[1028px]:py-3.5 max-[480px]:w-full hover:bg-white transition-all shadow-2xl">
                      Service Request
                    </button>
                    <button className="bg-transparent border-2 border-white text-white text-[15px] max-[1028px]:text-[14px] font-bold tracking-wide px-8 max-[1028px]:px-6 py-4 max-[1028px]:py-3.5 max-[480px]:w-full hover:bg-white hover:text-[#1a1a1a] transition-all">
                      Explore Services
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* ── Navigation Arrows ── */}
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
      <div className="absolute bottom-10 max-[480px]:bottom-20 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-1.5 transition-all duration-500 ${index === selectedIndex ? "w-12 bg-[#FFD100]" : "w-6 bg-white/40"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* ── Decorative subtle bottom gradient ── */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none" />
    </section>
  );
}
