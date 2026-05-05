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

const serviceBillboardSlots = [
  {
    id: 1,
    name: "Main City Center LED",
    subtitle: "High Visibility Screen",
    image: "/billboards/bill_boards1.webp",
    price: "From $1,200",
    specs: [
      { label: "Location", value: "Accra Central" },
      { label: "Duration", value: "1 Week Slot" },
      { label: "Traffic", value: "50k+ Daily" },
      { label: "Type", value: "Digital LED" }
    ],
    location: "Accra Central, Ghana",
    supplier: "Media Division",
    years: "Premium",
    rating: 5.0
  },
  {
    id: 2,
    name: "Airport Arrival Digital",
    subtitle: "Elite Audience Reach",
    image: "/billboards/bill_boards_2.webp",
    price: "From $2,500",
    specs: [
      { label: "Location", value: "KIA Terminal 3" },
      { label: "Duration", value: "2 Weeks Slot" },
      { label: "Traffic", value: "International" },
      { label: "Type", value: "4K Display" }
    ],
    location: "Airport, Accra",
    supplier: "Media Division",
    years: "Exclusive",
    rating: 4.9
  },
  {
    id: 3,
    name: "Motorway Giant Board",
    subtitle: "Mass Market Exposure",
    image: "/billboards/bill_boards 3.webp",
    price: "From $3,000",
    specs: [
      { label: "Location", value: "Tema Motorway" },
      { label: "Duration", value: "1 Month Slot" },
      { label: "Traffic", value: "100k+ Daily" },
      { label: "Type", value: "Portrait LED" }
    ],
    location: "Tema Highway, Ghana",
    supplier: "Media Division",
    years: "Strategic",
    rating: 4.8
  }
];

export default function BillboardRentalPage() {
  const [expandedId, setExpandedId] = useState("advantage");

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <WebsiteHeader />
      
      <main className="pt-20 pb-32">
        <div className="container mx-auto px-4 max-w-[1500px]">
          
          {/* Main Title Section */}
          <div className="text-center mb-12">
            <h1 
              className="text-7xl md:text-9xl font-black text-[#1a1a1a] tracking-tight uppercase leading-[0.8]"
              style={{ fontFamily: "var(--font-bebas-neue)" }}
            >
              BILLBOARD ADVERTISING
            </h1>
            <p 
              className="mt-8 text-gray-500 text-[13px] tracking-wide"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Search from over 1999+ Active Ads in 30+ Categories for Free
            </p>
          </div>

          {/* Search Bar Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white rounded-full shadow-[0_10px_50px_rgba(0,0,0,0.08)] p-2 flex flex-col md:flex-row items-center border border-gray-100">
              <div className="flex-1 flex items-center px-6 py-3 border-r border-gray-100">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-transparent outline-none text-sm text-gray-600 font-medium"
                  style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                />
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 flex items-center px-6 py-3 border-r border-gray-100 cursor-pointer group">
                <span className="flex-1 text-sm text-gray-400 font-medium" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>Location</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#1a1a1a] transition-colors" />
              </div>
              <div className="flex-1 flex items-center px-6 py-3 cursor-pointer group">
                <span className="flex-1 text-sm text-gray-400 font-medium" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>Category</span>
                <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#1a1a1a] transition-colors" />
              </div>
              <button className="bg-[#d0cdca] hover:bg-[#c0bdb9] w-14 h-14 rounded-full flex items-center justify-center text-[#1a1a1a] transition-all shadow-lg hover:scale-105">
                <Search className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Billboard Showcase Accordion (Click-to-Expand) */}
          <div className="flex h-[500px] w-full gap-2 items-stretch">
            {billboardFeatures.map((item) => {
              const isExpanded = expandedId === item.id;
              
              return (
                <div 
                  key={item.id}
                  onClick={() => setExpandedId(item.id)}
                  className={`relative overflow-hidden transition-all duration-700 ease-in-out border border-[#dadada] bg-white cursor-pointer
                    ${isExpanded ? 'flex-[12]' : 'w-14 flex-[0] min-w-[56px]'}
                  `}
                >
                  {/* Collapsed State: Vertical Title */}
                  <div className={`absolute inset-0 z-20 flex flex-col items-center justify-end pb-8 gap-14 transition-all duration-500 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <span 
                      className="rotate-[-90deg] whitespace-nowrap text-[21px] font-black tracking-[0.1em] text-[#1a1a1a] uppercase origin-center transform translate-y-[-50px]"
                      style={{ fontFamily: "var(--font-bebas-neue)" }}
                    >
                      {item.title}
                    </span>
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <Image src="/tv.svg" alt="tv" width={24} height={24} className="object-contain" />
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
                    <div className="absolute inset-0 z-20 p-12 flex flex-col justify-between">
                      <div className={isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4' + ' transition-all duration-700 delay-300'}>
                        <div className="mb-6 invert brightness-0">
                          <Image src="/tv.svg" alt="tv" width={40} height={40} />
                        </div>
                        <h3 
                          className="text-3xl font-black text-white uppercase tracking-[0.05em] leading-none"
                          style={{ fontFamily: "var(--font-bebas-neue)" }}
                        >
                          {item.title}
                        </h3>
                      </div>
                      
                      <div className={`max-w-md ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 delay-500`}>
                        <p 
                          className="text-white text-[13px] leading-relaxed font-normal opacity-90"
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
          <div className="mt-32">
            <div className="text-center mb-16">
              <span 
                className="text-[#eea000] text-[12px] font-bold tracking-[0.2em] uppercase mb-4 block"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Together, We Transform
              </span>
              <h2 
                className="text-5xl md:text-7xl font-black text-[#1a1a1a] uppercase leading-none"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                Explore Our Most Popular<br />
                Billboard Categories
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  className="bg-[#f9f9f9] border border-gray-100 p-10 flex flex-col items-center text-center transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 transition-colors duration-300">
                    <category.icon className="w-6 h-6" />
                  </div>
                  <h3 
                    className="text-3xl font-semibold text-[#1a1a1a] uppercase mb-2 tracking-[0.05em]"
                    style={{ fontFamily: "var(--font-bebas-neue)" }}
                  >
                    {category.title}
                  </h3>
                  <span 
                    className="text-gray-400 text-[13px] font-bold uppercase tracking-[0.2em]"
                    style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                  >
                    {category.ads} Ads
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Billboard Slots Grid */}
          <div className="mt-8">
            <ProductsGrid 
              type="billboards" 
              showViewMore={false} 
              items={serviceBillboardSlots}
            />
          </div>

          {/* Available Bill Boards Section */}
          <div className="mt-20">
            <div className="text-center mb-16">
              <span 
                className="text-[#eea000] text-[12px] font-bold tracking-[0.2em] uppercase mb-4 block"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Book Your Slot
              </span>
              <h2 
                className="text-5xl md:text-7xl font-black text-[#1a1a1a] uppercase leading-none"
                style={{ fontFamily: "var(--font-bebas-neue)" }}
              >
                Available Bill Boards
              </h2>
            </div>

            <div className="space-y-20">
              {[
                {
                  title: "Outdoor The Most Advertising",
                  tags: [
                    { name: "Advertising", color: "bg-[#ffd300]" },
                    { name: "Billboard", color: "bg-[#d8b4fe]" },
                    { name: "Marketing", color: "bg-[#ffccb4]" }
                  ],
                  time: "3 days ago",
                  location: "Accra, Greater Accra",
                  price: "$2,500 - $5,000",
                  image: "/billboards/bill_boards1.webp"
                },
                {
                  title: "Creative Billboard Campaign",
                  tags: [
                    { name: "Billboard", color: "bg-[#d8b4fe]" },
                    { name: "Campaign", color: "bg-[#ffd300]" },
                    { name: "Creative", color: "bg-[#ffccb4]" }
                  ],
                  time: "15 days ago",
                  location: "Kumasi, Ashanti Region",
                  price: "$90 - $199",
                  image: "/billboards/bill_boards_2.webp"
                },
                {
                  title: "Innovative Billboard Solutions",
                  tags: [
                    { name: "Solutions", color: "bg-[#ffd300]" },
                    { name: "Billboard", color: "bg-[#d8b4fe]" },
                    { name: "Innovative", color: "bg-[#ffccb4]" }
                  ],
                  time: "1 month ago",
                  location: "Takoradi, Western Region",
                  price: "$1,500 - $1,999",
                  image: "/billboards/bill_boards 3.webp"
                },
                {
                  title: "Modern Billboard Innovations",
                  tags: [
                    { name: "Digital", color: "bg-[#ffd300]" },
                    { name: "Creative", color: "bg-[#d8b4fe]" },
                    { name: "Agency", color: "bg-[#ffccb4]" }
                  ],
                  time: "3 months ago",
                  location: "Tamale, Northern Region",
                  price: "$500 - $900",
                  image: "/billboards/bill_boards1.webp"
                }
              ].map((ad, i) => (
                <div key={i} className="group cursor-pointer">
                  <Link href="/products/13">
                    <div className="relative aspect-[21/7] w-full overflow-hidden mb-10">
                      <Image 
                        src={ad.image} 
                        alt={ad.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  </Link>
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-4">
                    <h3 
                      className="text-4xl font-black text-[#1a1a1a] uppercase tracking-tight"
                      style={{ fontFamily: "var(--font-bebas-neue)" }}
                    >
                      {ad.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {ad.tags.map((tag) => {
                        const isAdvertising = tag.name === "Advertising";
                        const tagName = isAdvertising ? "Advertising this request slot" : tag.name;
                        const content = (
                          <span 
                            key={tag.name} 
                            className={`px-4 py-1.5 ${tag.color} text-[10px] font-black text-black uppercase tracking-widest cursor-pointer hover:opacity-80 transition-opacity inline-block`}
                            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
                          >
                            {tagName}
                          </span>
                        );
                        
                        return isAdvertising ? (
                          <Link key={tag.name} href="/products/13">{content}</Link>
                        ) : content;
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-2 text-[#1a1a1a]">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] font-medium" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{ad.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#1a1a1a]">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-[12px] font-medium" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{ad.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600">
                      <Tag className="w-4 h-4 text-red-600" />
                      <span className="text-[12px] font-black" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{ad.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
