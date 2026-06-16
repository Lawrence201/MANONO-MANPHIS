"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ArrowUpRight } from "lucide-react";

export function ConstructionAboutSection() {
  const [activeTab, setActiveTab] = useState("mission");

  return (
    <section className="py-24 bg-white relative z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column - Large Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-[3/4] w-full max-w-[600px] mx-auto overflow-hidden rounded-md shadow-lg">
              <Image 
                src="/construction/img_1.png" 
                alt="Construction Workers" 
                fill 
                className="object-cover"
              />
              {/* Yellow Logo Badge */}
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-[#FFD100] flex items-center justify-center rounded-tl-md p-2">
                <div className="relative w-full h-full">
                  <Image 
                    src="/logo.png" 
                    alt="Logo" 
                    fill 
                    className="object-contain scale-110"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#FFD100]"></div>
              <h4 className="text-gray-500 text-[13px] max-[480px]:text-[11px] font-bold tracking-[0.1em] uppercase">
                ABOUT BRICKZ CONSTRUCTION
              </h4>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[46px] max-[480px]:text-3xl max-[480px]:leading-[1.15] font-black text-[#1a1a1a] leading-[1.15] mb-6 tracking-tight">
              Experts Modern Construction<br />
              Service & Solutions
            </h2>
            
            <p className="text-gray-500 text-[16px] max-[480px]:text-[14px] leading-relaxed mb-10 max-[480px]:mb-6 max-w-[600px] font-medium">
              Our data analysis tools and techniques help you turn complex data into clear, strategic insights that improve performance and guide growth.
            </p>

            {/* Tabs & Bottom Content */}
            <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
              
              {/* Tabs Content */}
              <div className="flex-1">
                {/* Tab Headers */}
                <div className="flex items-center gap-10 max-[480px]:gap-5 border-b border-gray-200 mb-8 max-[480px]:mb-6">
                  <button 
                    onClick={() => setActiveTab("mission")}
                    className={`pb-4 max-[480px]:pb-3 font-bold text-[16px] max-[480px]:text-[14px] transition-colors relative ${activeTab === 'mission' ? 'text-[#FFD100]' : 'text-[#1a1a1a] hover:text-[#FFD100]'}`}
                  >
                    Mision
                    {activeTab === 'mission' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FFD100]"></div>}
                  </button>
                  <button 
                    onClick={() => setActiveTab("vision")}
                    className={`pb-4 max-[480px]:pb-3 font-bold text-[16px] max-[480px]:text-[14px] transition-colors relative ${activeTab === 'vision' ? 'text-[#FFD100]' : 'text-[#1a1a1a] hover:text-[#FFD100]'}`}
                  >
                    Vision
                    {activeTab === 'vision' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FFD100]"></div>}
                  </button>
                  <button 
                    onClick={() => setActiveTab("core")}
                    className={`pb-4 max-[480px]:pb-3 font-bold text-[16px] max-[480px]:text-[14px] transition-colors relative ${activeTab === 'core' ? 'text-[#FFD100]' : 'text-[#1a1a1a] hover:text-[#FFD100]'}`}
                  >
                    Core Value
                    {activeTab === 'core' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FFD100]"></div>}
                  </button>
                </div>

                {/* Tab Body */}
                <div className="mb-10 max-[480px]:mb-6 min-h-[110px]">
                  {activeTab === 'mission' && (
                    <div className="animate-in fade-in duration-300">
                      <p className="text-gray-500 text-[15px] max-[480px]:text-[14px] leading-relaxed mb-6 font-medium max-w-[400px]">
                        Our vision is to be the most trusted impactful business consulting firm globally, known for trans forming companies.
                      </p>
                      <ul className="space-y-3.5 max-[480px]:space-y-2.5">
                        <li className="flex items-center gap-3 max-[480px]:gap-2 text-gray-500 font-medium text-[15px] max-[480px]:text-[14px]">
                          <Check className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4 text-[#FFD100]" /> Regulatory Investigations
                        </li>
                        <li className="flex items-center gap-3 max-[480px]:gap-2 text-gray-500 font-medium text-[15px] max-[480px]:text-[14px]">
                          <Check className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4 text-[#FFD100]" /> Anit- Competitive Conduct
                        </li>
                      </ul>
                    </div>
                  )}
                  {activeTab === 'vision' && (
                    <div className="animate-in fade-in duration-300">
                      <p className="text-gray-500 text-[15px] max-[480px]:text-[14px] leading-relaxed mb-6 font-medium max-w-[400px]">
                        Our vision focuses on building sustainable infrastructure that stands the test of time, innovating for a better tomorrow.
                      </p>
                      <ul className="space-y-3.5 max-[480px]:space-y-2.5">
                        <li className="flex items-center gap-3 max-[480px]:gap-2 text-gray-500 font-medium text-[15px] max-[480px]:text-[14px]">
                          <Check className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4 text-[#FFD100]" /> Sustainable Materials
                        </li>
                        <li className="flex items-center gap-3 max-[480px]:gap-2 text-gray-500 font-medium text-[15px] max-[480px]:text-[14px]">
                          <Check className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4 text-[#FFD100]" /> Future-Proof Engineering
                        </li>
                      </ul>
                    </div>
                  )}
                  {activeTab === 'core' && (
                    <div className="animate-in fade-in duration-300">
                      <p className="text-gray-500 text-[15px] max-[480px]:text-[14px] leading-relaxed mb-6 font-medium max-w-[400px]">
                        Our core values revolve around integrity, excellence, and a commitment to delivering beyond expectations on every project.
                      </p>
                      <ul className="space-y-3.5 max-[480px]:space-y-2.5">
                        <li className="flex items-center gap-3 max-[480px]:gap-2 text-gray-500 font-medium text-[15px] max-[480px]:text-[14px]">
                          <Check className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4 text-[#FFD100]" /> Uncompromised Safety
                        </li>
                        <li className="flex items-center gap-3 max-[480px]:gap-2 text-gray-500 font-medium text-[15px] max-[480px]:text-[14px]">
                          <Check className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4 text-[#FFD100]" /> Transparent Practices
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <Link href="/contact" className="inline-flex items-center gap-2 bg-[#FFD100] text-black px-8 max-[480px]:px-6 py-3.5 max-[480px]:py-2.5 font-bold text-[15px] max-[480px]:text-[14px] hover:bg-[#FFD100]/90 transition-colors rounded-[4px] shadow-sm">
                  Discover More <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Smaller Image & Text Right Side */}
              <div className="w-full xl:w-[280px] flex flex-col gap-6 pt-2 xl:pt-0 shrink-0">
                <div className="w-full h-[150px] relative rounded-md overflow-hidden shadow-md">
                  <Image 
                    src="/construction/img_2.jpg" 
                    alt="Construction Planning" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <p className="text-gray-500 text-[14px] leading-relaxed font-medium">
                  Our data analysis tools and techniques help you turn complex data.
                </p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-6xl font-black text-[#1a1a1a] tracking-tighter">25</span>
                  <span className="text-[#1a1a1a] font-extrabold text-[15px] leading-[1.2]">
                    Years Of<br />Experience
                  </span>
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
