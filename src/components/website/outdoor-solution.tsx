import { Layers, Star, CheckCircle2, Play } from "lucide-react";
import Image from "next/image";

export function OutdoorSolution() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Top Section: Image + Title */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-24">
          {/* Left: Billboard Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-2xl">
              <Image 
                src="/work9.webp" 
                alt="Outdoor Advertising Example" 
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-start">
            <h2 
              className="text-6xl md:text-7xl font-black text-[#1a1a1a] leading-[0.9] uppercase mb-8"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              OUTDOOR<br />
              ADVERTISING<br />
              SOLUTION
            </h2>
            
            <div className="flex items-center gap-6 mb-8 w-full">
              <div className="h-[2px] w-32 bg-[#eea000]" />
              <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                We are a value-driven organization. Our core values inspire us to push our boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="text-[#eea000]">
              <Layers className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">MULTI FORMAT MEDIA</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Billboards capture repeat exposure business message more effectively than almost any other marketing channel..
            </p>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="text-[#eea000]">
              <Star className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">SMARTLY PLANNED</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Start building your brand with the strategic one. an industry that your brand with the strategic one industry expertise.
            </p>
          </div>

          {/* Column 3 */}
          <div className="space-y-4">
            <div className="text-[#eea000]">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-sm font-black text-[#1a1a1a] uppercase tracking-wider">BUILD BRANDS</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              A business is only as good as its strategic process, and that's what contributes to expectations with the one industry.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
