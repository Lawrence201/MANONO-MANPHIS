"use client";

import Image from "next/image";
import { Mail } from "lucide-react";

interface ConstructionCTASectionProps {
  videoSrc?: string;
}

export function ConstructionCTASection({ videoSrc = "/construction/vid_1.mp4" }: ConstructionCTASectionProps) {
  return (
    <section className="relative w-full bg-white">
      {/* Large Background Video */}
      <div className="relative w-full h-[500px] md:h-[600px]">
        <video 
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>

      {/* Overlapping CTA Box */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1500px] relative -mt-[140px] pb-24 max-[480px]:pb-8 z-10">
        <div className="bg-[#323232] rounded-md shadow-2xl overflow-hidden relative border border-gray-800">
          
          {/* Faint abstract watermark background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="diagonal-stripes" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="20" height="40" fill="#ffffff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#diagonal-stripes)" />
            </svg>
          </div>
          
          <div className="p-10 md:p-14 lg:py-16 max-[480px]:p-5 max-[480px]:py-6 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8 max-[480px]:gap-5 relative z-10">
            
            {/* Left Side: Form */}
            <div className="w-full lg:w-[55%]">
              <h2 className="text-white text-3xl md:text-[32px] max-[480px]:text-[22px] font-bold tracking-tight mb-8 max-[480px]:mb-4">
                Ready to Start Your Construction Project?
              </h2>
              
              <div className="relative flex max-[480px]:flex-col items-center max-[480px]:items-stretch bg-[#1A1A1A] max-[480px]:bg-transparent rounded-[4px] p-2 max-[480px]:p-0 max-[480px]:gap-3 w-full max-w-[550px]">
                <div className="flex items-center w-full max-[480px]:bg-[#1A1A1A] max-[480px]:rounded-[4px] max-[480px]:py-2">
                  <div className="pl-4 pr-3 text-gray-400">
                    <Mail className="w-[18px] h-[18px]" strokeWidth={2.5} />
                  </div>
                  <input 
                    type="email" 
                    placeholder="Your email address.." 
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500 text-[14px] font-medium"
                  />
                </div>
                <button className="bg-[#FFD100] text-[#1a1a1a] px-6 py-3.5 max-[480px]:py-3 max-[480px]:w-full max-[480px]:justify-center rounded-[4px] font-bold text-[14px] flex items-center gap-2 hover:bg-white transition-colors shrink-0 group">
                  Get Quote
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 17" className="w-3.5 h-3.5 fill-[#1a1a1a] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <path d="M13.338 5.04405L1.88204 16.5L0 14.618L11.4546 3.16201H1.35896V0.5H16V15.141H13.338V5.04405Z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Right Side: Experts */}
            <div className="w-full lg:w-[45%] lg:pl-16 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-gray-700/50 pt-8 max-[480px]:pt-5 lg:pt-0">
              <div className="flex items-center max-[480px]:flex-col max-[480px]:items-start gap-5 max-[480px]:gap-3 mb-5 max-[480px]:mb-3">
                {/* Avatar Cluster */}
                <div className="flex items-center">
                  <div className="w-[52px] h-[52px] max-[480px]:w-[42px] max-[480px]:h-[42px] rounded-full border-[3px] border-[#323232] bg-gray-300 relative overflow-hidden z-30">
                    <Image src="/construction/img_2.jpg" alt="Expert 1" fill className="object-cover" />
                  </div>
                  <div className="w-[52px] h-[52px] max-[480px]:w-[42px] max-[480px]:h-[42px] rounded-full border-[3px] border-[#323232] bg-gray-400 relative overflow-hidden -ml-4 z-20">
                    <Image src="/construction/img_1.png" alt="Expert 2" fill className="object-cover" />
                  </div>
                  <div className="w-[52px] h-[52px] max-[480px]:w-[42px] max-[480px]:h-[42px] rounded-full border-[3px] border-[#323232] bg-gray-500 relative overflow-hidden -ml-4 z-10">
                    <Image src="/construction/slider_1.jpg" alt="Expert 3" fill className="object-cover" />
                  </div>
                </div>
                <h3 className="text-white text-[20px] max-[480px]:text-[18px] font-bold tracking-tight">Speak With Our Engineers</h3>
              </div>
              
              <p className="text-gray-400 text-[15px] max-[480px]:text-[14px] leading-[1.8] max-w-[420px] font-medium">
                Our team of experienced professionals is ready to bring your vision to life with precision, durability, and quality craftsmanship.
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
