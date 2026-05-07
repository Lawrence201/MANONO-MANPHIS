import Image from "next/image";
import React from "react";

const LoopyArrow = () => (
  <svg 
    width="120" 
    height="60" 
    viewBox="0 0 120 60" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-80"
  >
    <path 
      d="M10 20C20 10 40 5 50 25C60 45 80 50 110 15M110 15L100 15M110 15L108 25" 
      stroke="black" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

export function ServicesSection() {
  const services = [
    {
      category: "ADVERTISING",
      title: "PREMIUM DIGITAL BILLBOARD",
      description: "We help businesses promote their products, services, and campaigns through high-visibility digital billboard advertising designed to maximize audience reach and brand exposure.",
      image: "/billboards/first.jpg",
      badgeColor: "bg-[#d4b9f9]",
    },
    {
      category: "EXPORT SERVICES",
      title: "PREMIUM HONEY & SHEA",
      description: "We supply high-quality honey and shea butter to international buyers through reliable sourcing, careful processing, and efficient export coordination.",
      image: "/billboards/second.jpg",
      badgeColor: "bg-[#fbb99b]",
    },
    {
      category: "SUPPLY SOLUTIONS",
      title: "EXPORT-GRADE CASHEW",
      description: "Providing carefully selected cashew nuts prepared to meet international quality standards for wholesalers, distributors, and global markets.",
      image: "/billboards/third.avif",
      badgeColor: "bg-[#f5e050]",
    }
  ];

  return (
    <section className="pt-24 pb-64 bg-white max-[1028px]:pt-12 max-[480px]:pb-32">
      <div className="container mx-auto px-4 max-w-[1600px]">
        {/* Header Section */}
        <div className="lg:sticky lg:top-28 z-40 mb-24 max-[480px]:mb-12">
          <p 
            className="text-[12px] md:text-[16px] font-medium text-gray-500 mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            Our Services
          </p>
          <h2 
            className="text-[52px] min-[480px]:text-[62px] md:text-[85px] font-bold text-[#1a1a1a] leading-[1.05] tracking-[-0.02em] uppercase max-w-4xl origin-left -ml-4"
            style={{ fontFamily: "var(--font-antonio)" }}
          >
            EXPORTING <br className="hidden md:block" />
            PRODUCTS<br />
            BUILDING BRANDS
          </h2>
        </div>

        {/* Services List */}
        <div className="space-y-48 max-[1028px]:space-y-32 max-[480px]:space-y-24 mt-[-80px] max-[480px]:mt-0 relative z-10">
          {services.map((item, index) => (
            <div key={index} className="relative flex flex-col md:flex-row items-start justify-center">
              
              {/* Image Container */}
              <div className="relative w-full md:w-[480px] aspect-[1/1] md:aspect-[3/4] z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Arrow Decoration (Hidden on mobile/tablet) */}
              <div className="hidden lg:block absolute right-[15%] top-[220px] rotate-[15deg]">
                <LoopyArrow />
              </div>

              {/* Index Indicator */}
              <div 
                className="absolute right-4 md:right-[10%] top-4 md:top-[280px] text-2xl md:text-4xl font-normal text-white md:text-[#1a1a1a] tracking-tight bg-black/20 md:bg-transparent px-2 py-1 md:p-0 backdrop-blur-sm md:backdrop-blur-0"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                {index + 1}/{services.length}
              </div>

              {/* Content Card - Overlapping */}
              <div className="relative mt-[-60px] md:mt-0 md:absolute md:left-[55%] md:top-[60%] w-[92%] mx-auto md:mx-0 md:w-[520px] bg-[#f5f5f5] p-8 md:p-16 z-10 shadow-xl md:shadow-none">
                <div className="flex flex-col gap-6 md:gap-10">
                  <div className="relative inline-block">
                    <h3 
                      className="text-[32px] min-[480px]:text-[38px] md:text-[64px] font-bold text-[#1a1a1a] leading-[1.05] tracking-[0.02em] uppercase origin-left transform md:scale-x-[0.85]"
                      style={{ fontFamily: "var(--font-antonio)" }}
                    >
                      {item.title}
                    </h3>
                    
                    {/* Tilted Badge */}
                    <div className={`absolute -right-2 md:-right-6 -bottom-1 md:-bottom-2 ${item.badgeColor} px-3 md:px-5 py-1 md:py-1.5 rotate-[-8deg] shadow-sm`}>
                      <span 
                        className="text-[8px] md:text-[9px] font-bold tracking-[0.2em] text-[#1a1a1a] uppercase whitespace-nowrap"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <p 
                    className="text-[#333] text-[12px] md:text-[14px] leading-[1.6] max-w-[340px] opacity-90"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
