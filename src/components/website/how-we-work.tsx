import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HowWeWork() {
  return (
    <section className="bg-black py-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row items-start relative">
          
          {/* Main Content Area (Image + Description) */}
          <div className="w-full relative">
            {/* Image Container */}
            <div className="relative aspect-[21/9] w-full">
              <Image 
                src="/board.webp" 
                alt="Digital Billboard Innovation" 
                fill
                className="object-cover"
                priority
              />
              
              {/* Play Button Overlay - Positioned on the image edge */}
              <div className="absolute right-[28%] top-[50%] -translate-y-1/2 hidden lg:block z-30">
                <div className="relative group cursor-pointer">
                  {/* Gold ripple animation */}
                  <div className="absolute inset-[-2px] rounded-full border-[1.5px] border-[#f0a000] animate-ping opacity-75" />
                  <div className="absolute inset-[-2px] rounded-full border-[1.5px] border-[#f0a000]" />
                  
                  {/* Main Circle */}
                  <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center border border-white/5 shadow-2xl overflow-hidden relative">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-[#f0a000] border-b-[10px] border-b-transparent ml-2 transition-transform group-hover:scale-110" />
                  </div>
                </div>
              </div>

              {/* Overlapping Content Card - Now positioned INSIDE the image container flow on large screens */}
              <div className="hidden lg:block absolute right-0 top-[60%] w-[30%] bg-[#050505] border border-white/20 p-12 shadow-2xl z-20">
                <div className="flex flex-col gap-8 h-full justify-center items-end text-right">
                  <h2 
                    className="text-white text-[42px] md:text-[52px] font-bold leading-[0.85] tracking-[-0.08em] uppercase text-right md:scale-x-[0.85] transform origin-right"
                    style={{ fontFamily: "var(--font-antonio)" }}
                  >
                    THE DIGITAL<br />
                    CYBSECURE THE<br />
                    TRANSFOR
                  </h2>

                  <div className="pt-6">
                    <Link 
                      href="/about" 
                      className="inline-flex items-center gap-4 text-white border border-white/40 px-8 py-3.5 hover:bg-white hover:text-black transition-all group"
                    >
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:-translate-x-1 rotate-180" />
                      <span 
                        className="text-[14px] font-medium tracking-widest uppercase"
                        style={{ fontFamily: "var(--font-bebas-neue)" }}
                      >
                        About Us
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Content Card */}
            <div className="lg:hidden w-full bg-[#050505] border border-white/20 p-10 mt-8 shadow-2xl flex flex-col items-end text-right">
              <h2 
                className="text-white text-4xl font-bold leading-[0.85] tracking-[-0.08em] uppercase mb-8 scale-x-95 transform origin-right"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                THE DIGITAL<br />
                CYBSECURE THE<br />
                TRANSFOR
              </h2>
              <Link 
                href="/about" 
                className="inline-flex items-center gap-4 text-white border border-white/40 px-8 py-3.5"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span className="text-[14px] font-medium tracking-widest uppercase" style={{ fontFamily: "var(--font-bebas-neue)" }}>About Us</span>
              </Link>
            </div>

            {/* Description Text Below Image */}
            <div className="mt-12 max-w-2xl">
              <p 
                className="text-gray-400 text-[13px] md:text-[14px] leading-[1.6] tracking-tight opacity-80"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Billboard advertising is a highly effective marketing tool that helps 
                businesses boost visibility and connect with their target audience, making 
                it an essential strategy for impactful promotion. Billboard advertising is a 
                powerful marketing tool that helps businesses gain visibility and 
                effectively reach their target audience.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
