"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Check, ArrowUpRight } from "lucide-react";

export function ConstructionAboutSection() {
  const [activeTab, setActiveTab] = useState("mission");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = ["/construction/former.png", "/construction/former_2.png"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 bg-white relative z-10">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px]">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column - Large Image */}
          <div className="w-full lg:w-1/2 relative">
            <div className="relative aspect-[3/4] w-full max-w-[600px] mx-auto overflow-hidden rounded-md shadow-lg">
              {images.map((src, idx) => (
                <Image 
                  key={src}
                  src={src} 
                  alt={`Construction Workers ${idx + 1}`} 
                  fill 
                  className={`object-cover transition-opacity duration-1000 ${
                    idx === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              {/* Yellow Logo Badge */}
              <div className="absolute bottom-0 right-0 w-28 h-28 bg-[#FFD100] flex items-center justify-center rounded-tl-md p-2">
                <div className="relative w-full h-full">
                  <Image 
                    src="/logo.PNG" 
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
                ABOUT MANONO MANPHIS
              </h4>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-[46px] max-[480px]:text-3xl max-[480px]:leading-[1.15] font-black text-[#1a1a1a] leading-[1.15] mb-6 tracking-tight">
              Modern Construction &<br />
              Multi-Service Solutions
            </h2>
            
            <p className="text-gray-500 text-[16px] max-[480px]:text-[14px] leading-relaxed mb-10 max-[480px]:mb-6 max-w-[600px] font-medium">
              Manono Manphis delivers reliable construction services, digital advertising solutions, and global trade support. We combine innovation, skilled workmanship, and modern technology to build, promote, and connect businesses across industries.
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
                        To provide high-quality construction, advertising, and trade solutions that help businesses and individuals grow locally and globally.
                      </p>
                    </div>
                  )}
                  {activeTab === 'vision' && (
                    <div className="animate-in fade-in duration-300">
                      <p className="text-gray-500 text-[15px] max-[480px]:text-[14px] leading-relaxed mb-6 font-medium max-w-[400px]">
                        To become a leading multi-service company known for excellence in construction, digital advertising, and international trade across Africa and beyond.
                      </p>
                    </div>
                  )}
                  {activeTab === 'core' && (
                    <div className="animate-in fade-in duration-300">
                      <ul className="space-y-3.5 max-[480px]:space-y-2.5">
                        {["Integrity", "Quality", "Innovation", "Reliability", "Customer Satisfaction"].map(val => (
                          <li key={val} className="flex items-center gap-3 max-[480px]:gap-2 text-gray-500 font-medium text-[15px] max-[480px]:text-[14px]">
                            <Check className="w-5 h-5 max-[480px]:w-4 max-[480px]:h-4 text-[#FFD100]" /> {val}
                          </li>
                        ))}
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
                    src="/construction/cons/small.jpeg" 
                    alt="Construction Planning" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="text-gray-500 text-[14px] leading-relaxed font-medium">
                  <h5 className="text-[#1a1a1a] font-bold mb-1">What We Do:</h5>
                  <ul className="space-y-1">
                    <li>• Residential & commercial construction</li>
                    <li>• Digital billboard advertising</li>
                    <li>• Import & export solutions</li>
                  </ul>
                </div>
              </div>
              
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
