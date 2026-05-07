"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export function FeaturesBanner() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bannerRef.current && !bannerRef.current.contains(event.target as Node)) {
        setActiveIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const features = [
    {
      icon: "/svg_1.svg",
      title: "Reliable Supply",
      subtitle: "Consistent bulk delivery",
    },
    {
      icon: "/svg_2.svg",
      title: "Global Export",
      subtitle: "International shipping ready",
    },
    {
      icon: "/svg_3.svg",
      title: "Certified Quality",
      subtitle: "Export-standard products",
    },
    {
      icon: "/svg_4.svg",
      title: "Flexible Orders",
      subtitle: "Custom quantities & pricing",
    },
  ];

  return (
    <div ref={bannerRef} className="w-full bg-[#ecf3f2] py-10 border-b border-gray-200 max-[768px]:hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 lg:px-8 max-[1028px]:flex-row max-[1028px]:gap-0 w-full">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-center max-[1028px]:px-2 transition-all duration-500 ease-in-out select-none ${
                activeIndex === index ? "max-[1028px]:flex-[2.5]" : "max-[1028px]:flex-1"
              }`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveIndex(activeIndex === index ? null : index);
              }}
            >
              <div className={`flex items-center gap-4 ${activeIndex === index ? "w-full justify-start" : "justify-center"}`}>
                <div className="flex-shrink-0">
                  <Image 
                    src={feature.icon} 
                    alt="" 
                    aria-hidden="true" 
                    width={32} 
                    height={32} 
                    className={`object-contain transition-transform duration-300 ${activeIndex === index ? "scale-110" : "scale-100"} max-[1028px]:w-10 max-[1028px]:h-10`} 
                  />
                </div>
                <div className={`flex flex-col text-left transition-all duration-500 overflow-hidden ${
                  activeIndex === index 
                    ? "max-[1028px]:w-auto max-[1028px]:opacity-100 max-[1028px]:ml-2" 
                    : "max-[1028px]:w-0 max-[1028px]:opacity-0 max-[1028px]:ml-0"
                }`}>
                  <span 
                    className="text-[19px] font-bold text-[#1a1a1a] leading-tight uppercase tracking-[-0.04em] scale-x-95 transform origin-left whitespace-nowrap"
                    style={{ fontFamily: "var(--font-antonio)" }}
                  >
                    {feature.title}
                  </span>
                  <span 
                    className="text-[12px] font-bold text-gray-500 leading-tight uppercase tracking-[0.1em] whitespace-nowrap"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {feature.subtitle}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
