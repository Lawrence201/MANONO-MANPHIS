"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ChevronRight, ArrowUp } from "lucide-react";

export function ConstructionProjectsSection() {
  const [activeFilter, setActiveFilter] = useState("All Projects");
  
  const filters = [
    "All Projects",
    "Commercial (04)",
    "Construction (04)",
    "Industrial (04)",
    "Residential (04)"
  ];

  const projects = [
    {
      id: 1,
      title: "Green View Housing",
      category: "Residential",
      image: "/construction/cons/project_1.jpeg",
      desc: "This project reflects our commitment to quality construction, efficient project..."
    },
    {
      id: 2,
      title: "Modern Office Complex",
      category: "Commercial",
      image: "/construction/cons/project_2.jpeg",
      desc: "This project reflects our commitment to quality construction, efficient project..."
    },
    {
      id: 3,
      title: "Industrial Warehouse",
      category: "Industrial",
      image: "/construction/cons/project_3.jpeg",
      desc: "This project reflects our commitment to quality construction, efficient project..."
    },
    {
      id: 4,
      title: "Urban Architecture",
      category: "Construction",
      image: "/construction/cons/project_4.jpeg",
      desc: "This project reflects our commitment to quality construction, efficient project..."
    }
  ];

  return (
    <section className="bg-[#313131] pt-24 pb-0 relative" id="projects">
      {/* Header */}
      <div className="container mx-auto px-4 md:px-8 text-center mb-16 max-[480px]:mb-10">
        <div className="flex items-center justify-center gap-3 mb-4 max-[480px]:mb-3">
          <div className="w-1.5 h-1.5 max-[480px]:w-1 max-[480px]:h-1 rounded-full bg-[#FFD100]"></div>
          <span className="text-[12px] max-[480px]:text-[11px] font-bold text-white tracking-[0.2em] uppercase">
            OUR FEATURED PROJECTS
          </span>
          <div className="w-1.5 h-1.5 max-[480px]:w-1 max-[480px]:h-1 rounded-full bg-[#FFD100]"></div>
        </div>
        
        <h2 className="text-4xl md:text-5xl lg:text-[56px] max-[480px]:text-3xl font-black text-white tracking-tight mb-12 max-[480px]:mb-8 leading-none">
          Our Project Excellence
        </h2>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-[480px]:gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-7 py-3 max-[480px]:px-4 max-[480px]:py-2 text-[14px] max-[480px]:text-[13px] font-bold transition-all duration-300 ${
                activeFilter === filter 
                  ? "bg-[#FFD100] text-[#1a1a1a]" 
                  : "bg-transparent border border-white/10 text-white hover:bg-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Images (Marquee) */}
      <div className="w-full overflow-hidden h-[500px] md:h-[650px] max-[480px]:h-[400px] relative">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee-step {
            0%, 15% { transform: translateX(0%); }
            25%, 40% { transform: translateX(-12.5%); }
            50%, 65% { transform: translateX(-25%); }
            75%, 90% { transform: translateX(-37.5%); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee-step 20s ease-in-out infinite;
            width: max-content;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
        <div className="flex h-full animate-marquee">
          {[...projects, ...projects].map((project, index) => (
            <div key={`${project.id}-${index}`} className="relative w-[100vw] md:w-[50vw] lg:w-[25vw] h-full group overflow-hidden cursor-pointer shrink-0">
              <Image 
                src={project.image} 
                alt={project.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Dark Gradient Default (slight) */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
              
              {/* Hover Overlay (Glassmorphism) */}
              <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a]/40 backdrop-blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0 p-8 lg:p-10 max-[480px]:p-6">
                <h3 className="text-[#FFD100] text-[22px] max-[480px]:text-[18px] font-bold mb-4 max-[480px]:mb-3 tracking-tight">{project.title}</h3>
                <div className="w-24 max-[480px]:w-16 h-[2px] bg-white mb-6 max-[480px]:mb-4"></div>
                <p className="text-white text-[15px] max-[480px]:text-[14px] leading-relaxed max-[480px]:leading-[1.6] mb-8 max-[480px]:mb-5 font-medium">
                  {project.desc}
                </p>
                <div className="flex items-center justify-between">
                  <Link href="/services/construction/projects" className="flex items-center text-white text-[15px] font-bold hover:text-[#FFD100] transition-colors group/link">
                    More Details 
                    <ArrowUpRight className="inline-block w-5 h-5 ml-1.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                  </Link>
                  {/* Optional circle arrow kept from full layout */}
                  <div className="w-10 h-10 rounded-full border border-white/20 flex max-[480px]:hidden items-center justify-center transition-colors hover:border-[#FFD100]">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#FFD100]"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white py-6 max-[480px]:py-4 relative">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="flex items-center justify-center gap-2 max-[480px]:gap-1.5 text-[14px] max-[480px]:text-[11px] font-bold text-[#1a1a1a]">
            <div className="bg-[#FFD100] text-black w-6 h-6 max-[480px]:w-5 max-[480px]:h-5 flex items-center justify-center rounded-sm shrink-0">
              <ChevronRight className="w-4 h-4 max-[480px]:w-3 max-[480px]:h-3" strokeWidth={3} />
            </div>
            <span>Facing Obstacles in Construction Project?</span>
            <Link href="/services/construction/projects" className="underline hover:text-[#FFD100] transition-colors decoration-2 underline-offset-4 whitespace-nowrap">
              View All Projects
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
}
