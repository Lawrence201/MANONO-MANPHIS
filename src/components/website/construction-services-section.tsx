import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getConstructionServices } from "@/lib/actions/construction-actions";

export async function ConstructionServicesSection() {
  const result = await getConstructionServices();
  const allServices = result.success ? result.services || [] : [];
  const publishedServices = allServices.filter((s: any) => s.status === 'published').slice(0, 4);

  return (
    <section className="py-24 bg-[#FAFAFA] relative">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-[1700px] relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-[480px]:mb-10 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 max-[480px]:w-1 max-[480px]:h-1 rounded-full bg-[#FFD100]"></div>
            <h4 className="text-gray-500 text-[13px] max-[480px]:text-[11px] font-bold tracking-[0.1em] uppercase">
              OUR PROVIDING SERVICES
            </h4>
            <div className="w-1.5 h-1.5 max-[480px]:w-1 max-[480px]:h-1 rounded-full bg-[#FFD100]"></div>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-[50px] max-[480px]:text-2xl font-black text-[#1a1a1a] leading-[1.15] max-[480px]:leading-[1.2] tracking-tight max-w-[800px]">
            Modern Construction Services Built for Quality & Reliability
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 mb-12 max-[480px]:mb-8">
          {publishedServices.map((service, index) => (
            <div key={index} className="group relative bg-[#F9F9F9] border border-gray-200 hover:bg-white rounded-md p-10 lg:p-12 max-[480px]:p-6 flex flex-col h-full transition-all duration-300 overflow-hidden shadow-none">
              
              {/* Hover Image Background (Top Right) */}
              <div 
                className="absolute top-0 right-0 w-[260px] h-[260px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" 
                style={{ 
                  maskImage: 'radial-gradient(circle at top right, black 0%, transparent 75%)', 
                  WebkitMaskImage: 'radial-gradient(circle at top right, black 0%, transparent 75%)' 
                }}
              >
                <Image 
                  src={service.heroImage || "/construction/cons/img.png"} 
                  alt="Construction background" 
                  fill 
                  className="object-cover opacity-60" 
                />
              </div>

              {/* Icon Container */}
              <div className="relative w-[76px] h-[76px] mb-8 z-10">
                <div className="absolute top-0 left-0 w-16 h-16 bg-[#E8E8E8] rounded-xl transition-colors group-hover:bg-[#F0F0F0]"></div>
                <div 
                  className="absolute bottom-0 right-0 w-16 h-16 bg-[#262626] rounded-xl flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: service.iconSvg || "" }}
                />
              </div>

              {/* Text Content */}
              <h3 className="text-[22px] max-[480px]:text-[18px] font-bold text-[#1a1a1a] mb-4 max-[480px]:mb-3 tracking-tight z-10">{service.title}</h3>
              <p className="text-gray-500 text-[15px] max-[480px]:text-[14px] leading-[1.8] max-[480px]:leading-[1.6] mb-8 max-[480px]:mb-6 font-medium z-10 line-clamp-3">
                {service.shortDescription}
              </p>

              {/* Checkmarks */}
              <div className="space-y-3 mb-10 mt-auto z-10">
                {service.features?.slice(0, 3).map((feature: string, i: number) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-[20px] h-[20px] rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="9" height="7" viewBox="0 0 12 10" fill="none"><path d="M5.53798 9.63481C5.50614 9.6348 5.47466 9.62821 5.4455 9.61545C5.41633 9.60269 5.39013 9.58404 5.36852 9.56066L0.799591 4.61839C0.769134 4.58544 0.748942 4.54433 0.741488 4.50008C0.734034 4.45584 0.73964 4.41038 0.757622 4.36927C0.775603 4.32816 0.805178 4.29318 0.842729 4.26862C0.880279 4.24406 0.924175 4.23098 0.969045 4.23098H3.16828C3.2013 4.23098 3.23393 4.23807 3.26398 4.25176C3.29403 4.26545 3.32079 4.28542 3.34246 4.31034L4.86941 6.06705C5.03444 5.71429 5.35389 5.12694 5.91448 4.41123C6.74321 3.35315 8.28471 1.79705 10.922 0.392315C10.973 0.36517 11.0323 0.358125 11.0882 0.372571C11.1441 0.387016 11.1926 0.421903 11.2241 0.470342C11.2555 0.51878 11.2676 0.57725 11.2581 0.634205C11.2485 0.69116 11.218 0.742461 11.1724 0.777976C11.1624 0.785846 10.1455 1.58662 8.97521 3.05336C7.89817 4.40313 6.46643 6.61021 5.76191 9.45951C5.74954 9.50957 5.72075 9.55404 5.68015 9.58583C5.63955 9.61762 5.58947 9.6349 5.53791 9.6349L5.53798 9.63481Z" fill="#1a1a1a"></path></svg>
                    </div>
                    <span className="text-[#1a1a1a] text-[14px] font-bold tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Button */}
              <Link href={`/services/construction/service-details/${service.slug}`} className="flex items-center justify-between w-full border border-gray-200 bg-transparent px-5 py-4 rounded-sm transition-all group-hover:bg-[#FFD100] group-hover:border-[#FFD100] z-10">
                <span className="font-bold text-[14px] text-[#1a1a1a]">Explore More</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17" className="w-3.5 h-3.5 fill-[#1a1a1a] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"><path d="M13.338 5.04405L1.88204 16.5L0 14.618L11.4546 3.16201H1.35896V0.5H16V15.141H13.338V5.04405Z"></path></svg>
              </Link>

            </div>
          ))}
        </div>

        {/* Bottom Notice */}
        <div className="flex items-center justify-center gap-2 max-[480px]:gap-1.5 pt-6 max-[480px]:pt-2 text-center">
          <div className="w-5 h-5 bg-[#FFD100] flex items-center justify-center rounded-sm shrink-0">
            <ChevronRight className="w-3 h-3 text-[#1a1a1a]" strokeWidth={3} />
          </div>
          <p className="text-gray-600 text-[15px] max-[480px]:text-[12px] font-medium leading-[1.6] flex items-center gap-1.5 flex-wrap justify-center">
            <span>Facing obstacles in business growth?</span>
            <Link href="/services/construction/services" className="text-[#1a1a1a] font-bold underline decoration-2 underline-offset-4 decoration-gray-300 hover:decoration-[#FFD100] transition-colors whitespace-nowrap">View All Services</Link>
          </p>
        </div>

      </div>
    </section>
  );
}
