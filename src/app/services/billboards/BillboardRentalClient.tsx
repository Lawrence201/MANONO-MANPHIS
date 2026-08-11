"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Monitor, MapPin, Heart, Trophy, Building, Briefcase, GraduationCap, PlusCircle, Share2, Layers, Clock, Tag } from "lucide-react";
import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { ProductsGrid } from "@/components/website/products-grid";

const billboardFeatures = [
  { 
    id: "exposure", 
    title: "EXPOSURE EXPRESS", 
    image: "/billboards/bill_boards1.webp",
    desc: "Get your brand seen instantly with our fast-track exposure solutions designed for high-impact urban environments."
  },
  { 
    id: "advantage", 
    title: "BILLBOARD ADVANTAGE", 
    image: "/service_bill.webp",
    desc: "Billboard advertising is a powerful marketing tool that helps businesses gain visibility and reach their target audience effectively."
  },
  { 
    id: "prime", 
    title: "PRIME BILLBOARD SERVICES", 
    image: "/billboards/bill_boards_2.webp",
    desc: "Premium locations with cutting-edge digital technology to ensure your message stands out with crystal clear quality."
  },
  { 
    id: "hoarding", 
    title: "HOARDING BOARD", 
    image: "/billboards/bill_boards 3.webp",
    desc: "Strategic placement on high-traffic hoarding boards for maximum long-term visibility and brand recall."
  }
];

export default function BillboardRentalClient({ dynamicBillboards }: { dynamicBillboards: any[] }) {
  const [expandedId, setExpandedId] = useState("advantage");
  const [activeImageIndices, setActiveImageIndices] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil((dynamicBillboards?.length || 0) / ITEMS_PER_PAGE);
  const currentBillboards = (dynamicBillboards || []).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <WebsiteHeader />
      
      <main className="pt-8 min-[1029px]:pt-12 pb-32">
        <div className="container mx-auto px-4 max-w-[1500px]">
          
          {/* Main Title Section */}
          <div className="text-center mb-6 min-[451px]:mb-10">
            <h1 
              className="text-[48px] max-[450px]:text-[36px] min-[1029px]:text-[110px] font-bold text-[#1a1a1a] tracking-[-0.04em] uppercase leading-[1.0] min-[1029px]:scale-x-[0.85] transform origin-center max-[1028px]:px-4"
              style={{ fontFamily: "var(--font-antonio)" }}
            >
              BILLBOARD ADVERTISING
            </h1>
            <p 
              className="mt-6 min-[451px]:mt-10 text-gray-400 text-[10px] min-[451px]:text-[12px] tracking-[0.1em] uppercase font-bold max-[450px]:px-4"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Search from over 1999+ Active Ads in 30+ Categories for Free
            </p>
          </div>

          {/* Search Bar Section */}
          <div className="max-w-[1028px] mx-auto mb-12 max-[450px]:mb-6">
            <div className="bg-white rounded-full shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-1.5 min-[451px]:p-2 flex flex-row items-center border border-gray-100 overflow-x-auto no-scrollbar">
              <div className="flex-1 flex items-center px-3 min-[451px]:px-4 min-[1029px]:px-6 py-2 min-[451px]:py-3 border-r border-gray-100 min-w-[100px] min-[451px]:min-w-[140px]">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  suppressHydrationWarning
                  className="w-full bg-transparent outline-none text-[10px] min-[451px]:text-sm text-gray-600 font-medium placeholder:text-[10px] min-[451px]:placeholder:text-sm"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                />
                <Search className="w-3.5 h-3.5 min-[451px]:w-4 min-[451px]:h-4 text-gray-400 shrink-0" />
              </div>
              <div className="flex-1 flex items-center px-3 min-[451px]:px-4 min-[1029px]:px-6 py-2 min-[451px]:py-3 border-r border-gray-100 cursor-pointer group min-w-[80px] min-[451px]:min-w-[110px]">
                <span className="flex-1 text-[10px] min-[451px]:text-sm text-gray-400 font-medium" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>Location</span>
                <ChevronDown className="w-3.5 h-3.5 min-[451px]:w-4 min-[451px]:h-4 text-gray-400 group-hover:text-[#1a1a1a] transition-colors shrink-0" />
              </div>
              <div className="flex-1 flex items-center px-3 min-[451px]:px-4 min-[1029px]:px-6 py-2 min-[451px]:py-3 cursor-pointer group min-w-[80px] min-[451px]:min-w-[110px]">
                <span className="flex-1 text-[10px] min-[451px]:text-sm text-gray-400 font-medium" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>Category</span>
                <ChevronDown className="w-3.5 h-3.5 min-[451px]:w-4 min-[451px]:h-4 text-gray-400 group-hover:text-[#1a1a1a] transition-colors shrink-0" />
              </div>
              <button className="bg-[#d0cdca] hover:bg-[#c0bdb9] w-8 h-8 min-[451px]:w-10 min-[451px]:h-10 min-[1029px]:w-14 min-[1029px]:h-14 shrink-0 rounded-full flex items-center justify-center text-[#1a1a1a] transition-all shadow-lg hover:scale-105 ml-1.5 min-[451px]:ml-2">
                <Search className="w-3 h-3 min-[451px]:w-4 min-[451px]:h-4 min-[1029px]:w-6 min-[1029px]:h-6" />
              </button>
            </div>
          </div>

          {/* Billboard Showcase Accordion (Click-to-Expand) */}
          <div className="flex h-[350px] min-[1029px]:h-[500px] w-full gap-2 items-stretch">
            {billboardFeatures.map((item) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <div 
                  key={item.id}
                  onClick={() => setExpandedId(item.id)}
                  className={`relative overflow-hidden transition-all duration-700 ease-in-out border border-[#dadada] bg-white cursor-pointer
                    ${isExpanded ? 'flex-[12]' : 'w-10 min-[1029px]:w-14 flex-[0] min-w-[40px] min-[1029px]:min-w-[56px]'}
                  `}
                >
                  {/* Collapsed State: Vertical Title */}
                  <div className={`absolute inset-0 z-20 flex flex-col items-center justify-between pt-32 min-[1029px]:pt-60 pb-8 min-[1029px]:pb-12 transition-all duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <span 
                      className="rotate-[-90deg] whitespace-nowrap text-[20px] min-[1029px]:text-[28px] font-bold tracking-[-0.04em] text-[#1a1a1a] uppercase origin-center transform"
                      style={{ fontFamily: "var(--font-antonio)" }}
                    >
                      {item.title}
                    </span>
                    <div className="relative w-6 h-6 min-[1029px]:w-8 min-[1029px]:h-8 flex items-center justify-center">
                      <Image src="/tv.svg" alt="tv" width={28} height={28} className="object-contain w-full h-full" />
                    </div>
                  </div>

                  {/* Expanded State: Full Content */}
                  <div className={`absolute inset-0 z-10 transition-opacity duration-700 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute inset-0 bg-black/50 z-10" />
                    <Image 
                      src={item.image} 
                      alt={item.title} 
                      fill
                      className="object-cover"
                      priority={isExpanded}
                    />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 z-20 p-6 min-[1029px]:p-12 flex flex-col justify-between">
                      <div className={isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' + ' transition-all duration-700 delay-300'}>
                        <div className="mb-4 min-[1029px]:mb-6 invert brightness-0 w-8 h-8 min-[1029px]:w-10 min-[1029px]:h-10">
                          <Image src="/tv.svg" alt="tv" width={40} height={40} className="w-full h-full object-contain" />
                        </div>
                        <h3 
                          className="text-[32px] min-[1029px]:text-[52px] font-bold text-white uppercase tracking-[-0.02em] leading-none origin-left min-[1029px]:-mt-4"
                          style={{ fontFamily: "var(--font-antonio)" }}
                        >
                          {item.title}
                        </h3>
                      </div>
                      
                      <div className={`max-w-md ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-500`}>
                        <p 
                          className="text-white text-[11px] min-[1029px]:text-[13px] leading-relaxed font-normal opacity-90"
                          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Billboard Categories Section */}
          {false && (
          <div className="mt-12 min-[451px]:mt-20 min-[1029px]:mt-32">
            <div className="text-center mb-10 min-[1029px]:mb-16">
              <span 
                className="text-[#eea000] text-[10px] min-[451px]:text-[12px] font-bold tracking-[0.2em] uppercase mb-3 min-[1029px]:mb-4 block"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Together, We Transform
              </span>
              <h2 
                className="text-[28px] min-[451px]:text-[36px] min-[1029px]:text-[75px] font-bold text-[#1a1a1a] uppercase leading-[1.05] tracking-[-0.04em] transform origin-center max-[1028px]:px-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Explore Our Most Popular<br />
                Billboard Categories
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-[451px]:gap-4">
              {[
                { title: "Property For Sale", ads: 2, icon: Building },
                { title: "Home Services", ads: 7, icon: MapPin },
                { title: "Electronics & Gadgets", ads: 11, icon: Monitor },
                { title: "Business Services", ads: 0, icon: Briefcase },
                { title: "Education & Training", ads: 2, icon: GraduationCap },
                { title: "Sports & Entertainment", ads: 5, icon: Trophy },
                { title: "Health & Beauty", ads: 0, icon: Heart },
                { title: "Others", ads: 19, icon: PlusCircle }
              ].map((category, i) => (
                <div 
                  key={i} 
                  className="bg-[#f9f9f9] border border-gray-100 p-5 min-[451px]:p-8 min-[1029px]:p-10 flex flex-col items-center text-center transition-all duration-300 rounded-xl min-[451px]:rounded-none"
                >
                  <div className="w-10 h-10 min-[451px]:w-14 min-[451px]:h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 min-[451px]:mb-6 transition-colors duration-300">
                    <category.icon className="w-4 h-4 min-[451px]:w-6 min-[451px]:h-6" />
                  </div>
                  <h3 
                    className="text-[14px] min-[451px]:text-[20px] min-[1029px]:text-[24px] font-bold text-[#1a1a1a] uppercase mb-1 min-[451px]:mb-2 tracking-[-0.02em] transform origin-center"
                    style={{ fontFamily: "var(--font-antonio)" }}
                  >
                    {category.title}
                  </h3>
                  <span 
                    className="text-gray-400 text-[10px] min-[451px]:text-[13px] font-bold uppercase tracking-[0.15em]"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {category.ads} Ads
                  </span>
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Detailed Billboard Slots Grid */}
          <div className="mt-8">
            <ProductsGrid 
              type="billboards" 
              showViewMore={false} 
              items={dynamicBillboards}
            />
          </div>

          {/* Available Bill Boards Section */}
          <div className="mt-12 min-[1029px]:mt-20">
            <div className="text-center mb-10 min-[1029px]:mb-16">
              <span 
                className="text-[#eea000] text-[12px] font-bold tracking-[0.2em] uppercase mb-4 block"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Book Your Slot
              </span>
              <h2 
                className="text-[36px] min-[1029px]:text-[75px] font-bold text-[#1a1a1a] uppercase leading-[1.05] tracking-[-0.04em] transform origin-center max-[1028px]:px-4"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Available Bill Boards
              </h2>
            </div>

            <div className="space-y-16 min-[1029px]:space-y-20">
              {currentBillboards.map((ad, i) => (
                <div key={ad.id || i} className="group cursor-pointer">
                  <div className="relative aspect-[21/9] max-[450px]:aspect-[4/3] min-[1029px]:aspect-[21/7] w-full overflow-hidden mb-5 min-[1029px]:mb-10 group/img border border-gray-100 rounded-[8px]">
                    <Link href={`/products/${ad.id}`}>
                      <Image 
                        src={ad.images?.[activeImageIndices[ad.id] || 0] || ad.image} 
                        alt={ad.name} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                      />
                    </Link>
                    
                    {/* Navigation Dots Overlay */}
                    {ad.images && ad.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 min-[451px]:gap-2 bg-black/40 backdrop-blur-[6px] px-2 min-[451px]:px-3.5 py-1 min-[451px]:py-2 rounded-full z-20">
                        {ad.images.map((imgUrl: any, idx: number) => {
                          const isActive = (activeImageIndices[ad.id] || 0) === idx;
                          return (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                setActiveImageIndices(prev => ({
                                  ...prev,
                                  [ad.id]: idx
                                }));
                              }}
                              className={`rounded-full transition-all duration-300 w-1.5 h-1.5 min-[451px]:w-2.5 min-[451px]:h-2.5 ${
                                isActive 
                                  ? "bg-[#eea000] scale-125 w-3 min-[451px]:w-5" 
                                  : "bg-white/60 hover:bg-white"
                              }`}
                              title={`View Image ${idx + 1}`}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-[1029px]:gap-6 mb-4">
                    <h3 
                      className="text-[24px] min-[1029px]:text-[44px] font-bold text-[#1a1a1a] uppercase tracking-[-0.02em] transform origin-left"
                      style={{ fontFamily: "var(--font-antonio)" }}
                    >
                      {ad.name}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/billboard-booking?hallId=${ad.id}`}>
                        <span 
                          className="px-6 py-2.5 bg-[#d8b4fe] text-[12px] font-black text-black uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity inline-block"
                          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                        >
                          Book Now
                        </span>
                      </Link>
                      <Link href={`/products/${ad.id}`}>
                        <span 
                          className="px-6 py-2.5 bg-[#ffccb4] text-[12px] font-black text-black uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity inline-block"
                          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                        >
                          View Details
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col min-[451px]:flex-row min-[451px]:flex-wrap items-start min-[451px]:items-center gap-3 min-[451px]:gap-4 min-[1029px]:gap-10">
                    <div className="flex items-center gap-2.5 text-[#1a1a1a]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#99a1af" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M12 2v8" />
                        <path d="M5 10h14" />
                        <path d="M19 10v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3" />
                        <path d="M12 17v5" />
                      </svg>
                      <span className="text-[14px] min-[1029px]:text-[15px] font-medium" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
                        {ad.maxSlots || 12} Available Slots
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#1a1a1a]">
                      <MapPin className="w-4 h-4 min-[1029px]:w-5 min-[1029px]:h-5 text-gray-400 shrink-0" />
                      <span className="text-[14px] min-[1029px]:text-[15px] font-bold" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>Location:</span>
                      <span className="text-[14px] min-[1029px]:text-[15px] font-medium" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{ad.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-[#1a1a1a]">
                      <Tag className="w-4 h-4 min-[1029px]:w-5 min-[1029px]:h-5 text-gray-400 shrink-0" />
                      <span className="text-[14px] min-[1029px]:text-[15px] font-bold" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>Amount:</span>
                      <span className="text-[14px] min-[1029px]:text-[15px] font-black text-red-600" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{ad.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 min-[1029px]:mt-20">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                </button>
                
                <div className="flex gap-1 flex-wrap justify-center">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const pageNumber = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            setCurrentPage(pageNumber);
                            window.scrollTo({ top: 800, behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold transition-colors ${
                            currentPage === pageNumber 
                              ? "bg-[#1a1a1a] text-white border border-[#1a1a1a]" 
                              : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                          }`}
                          style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return <span key={i} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
