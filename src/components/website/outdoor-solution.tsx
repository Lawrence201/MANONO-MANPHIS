import { Layers, Star, CheckCircle2, Play } from "lucide-react";
import Image from "next/image";

export function OutdoorSolution() {
  return (
    <section className="py-24 bg-white overflow-hidden mt-[-40px] md:mt-[-80px] relative z-10">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Top Section: Image + Title */}
        <div className="flex flex-col lg:flex-row items-center gap-8 md:gap-12 mb-12 md:mb-24">
          {/* Left: Billboard Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl">
              <Image 
                src="/work9.webp" 
                alt="Outdoor Advertising Solutions" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <h2 
              className="text-[64px] md:text-[88px] font-bold text-[#1a1a1a] leading-[1.05] tracking-[-0.04em] uppercase mb-8 md:scale-x-[0.85] transform origin-left"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              OUTDOOR<br />
              ADVERTISING<br />
              SOLUTIONS
            </h2>
            
            <div className="flex items-center gap-6 mb-8 w-full">
              <div className="h-[2px] w-32 bg-[#eea000]" />
              <p 
                className="text-[#94a3b8] text-sm max-w-sm leading-relaxed"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                We provide modern digital billboard advertising services designed to help businesses increase visibility, strengthen brand awareness, and reach wider audiences through strategic outdoor media placements.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mt-[-10px] md:mt-[-40px]">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="text-[#eea000]">
              <Layers className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">HIGH-VISIBILITY DISPLAY</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Our digital billboards deliver impactful advertising exposure across strategic locations with consistent audience engagement.
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="text-[#eea000]">
              <Star className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">STRATEGIC CAMPAIGNS</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Promote your business through carefully planned advertising schedules tailored to maximize reach and effectiveness.
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div className="text-[#eea000]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">BRAND PROMOTION</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Build stronger brand recognition through premium outdoor advertising solutions designed for businesses, events, and campaigns.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
