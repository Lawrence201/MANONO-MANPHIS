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
      category: "MARKETING",
      title: "PREMIUM EXPORT BRANDING",
      description: "We help agricultural businesses build world-class brands that stand out in international markets through strategic positioning and design.",
      image: "/product_honey_cashew.png",
      badgeColor: "bg-[#fbb99b]",
    },
    {
      category: "MARKETING",
      title: "END-TO-END GLOBAL SOLUTIONS",
      description: "Managing complex supply chains with precision. From Ghana to the rest of the world, we ensure your products arrive safely and on time.",
      image: "/service_export_logistics.png",
      badgeColor: "bg-[#f5e050]",
    },
    {
      category: "MARKETING",
      title: "DIGITAL BILLBOARD SERVICES",
      description: "Reach thousands of potential customers daily through our strategically located digital billboards. Book your exclusive slot today.",
      image: "/bill_board.png",
      badgeColor: "bg-[#d4b9f9]",
    }
  ];

  return (
    <section className="pt-32 pb-64 bg-white">
      <div className="container mx-auto px-4 max-w-[1600px]">
        {/* Header Section */}
        <div className="lg:sticky lg:top-28 z-40 mb-24">
          <p 
            className="text-[12px] font-medium text-gray-500 mb-4 tracking-tight"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          >
            Our Services
          </p>
          <h2 
            className="text-6xl md:text-8xl font-normal text-[#1a1a1a] leading-[0.85] tracking-tight uppercase max-w-xl"
            style={{ fontFamily: "var(--font-bebas-neue)" }}
          >
            EMPOWERING BRANDS THROUGH CREATIVITY.
          </h2>
        </div>

        {/* Services List */}
        <div className="space-y-48 mt-[-80px] relative z-10">
          {services.map((item, index) => (
            <div key={index} className="relative flex flex-col md:flex-row items-start justify-center">
              
              {/* Image Container */}
              <div className="relative w-full md:w-[480px] aspect-[4/5] z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Arrow Decoration (Hidden on mobile) */}
              <div className="hidden md:block absolute right-[15%] top-[160px] rotate-[15deg]">
                <LoopyArrow />
              </div>

              {/* Index Indicator - Placed above the card area */}
              <div 
                className="hidden md:block absolute right-[10%] top-[280px] text-4xl font-normal text-[#1a1a1a] tracking-tight"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                {index + 1}/{services.length}
              </div>

              {/* Content Card - Overlapping significantly */}
              <div className="relative mt-[-100px] md:mt-0 md:absolute md:left-[55%] md:top-[60%] w-full md:w-[520px] bg-[#f5f5f5] p-12 md:p-16 z-10">
                <div className="flex flex-col gap-10">
                  <div className="relative inline-block">
                    <h3 
                      className="text-5xl md:text-7xl font-normal text-[#1a1a1a] leading-[0.9] tracking-tight uppercase"
                      style={{ fontFamily: "var(--font-bebas-neue)" }}
                    >
                      {item.title}
                    </h3>
                    
                    {/* Tilted Badge - Overlapping bottom right of title */}
                    <div className={`absolute -right-6 -bottom-2 ${item.badgeColor} px-5 py-1.5 rotate-[-8deg] shadow-sm`}>
                      <span 
                        className="text-[9px] font-bold tracking-[0.2em] text-[#1a1a1a] uppercase whitespace-nowrap"
                        style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                      >
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <p 
                    className="text-[#333] text-[13px] md:text-[14px] leading-[1.6] max-w-[340px] opacity-90"
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
