"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export function AboutConstruction() {
  const [activeTab, setActiveTab] = useState<"mission" | "vision" | "values">("mission");

  const tabContent = {
    mission: "To provide exceptional construction services that turn our clients' visions into reality, ensuring structural integrity, safety, and precision in every single project.",
    vision: "To be the leading construction firm in the region, recognized for our quality craftsmanship, safety standards, and innovative modern building solutions.",
    values: "Quality Craftsmanship, Uncompromising Safety, Integrity in Business, and Total Customer Satisfaction."
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Images / Graphics */}
          <div className="w-full lg:w-1/2 relative min-h-[500px]">
            {/* Main Image (The Foreman / Construction Worker) */}
            <div className="absolute top-0 left-0 w-4/5 h-[400px] rounded-2xl overflow-hidden shadow-2xl z-10">
              <Image 
                src="/construction/hero.png"
                alt="Construction Worker / Foreman"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Secondary Image (Construction Planning / Blueprint) */}
            <div className="absolute bottom-0 right-0 w-3/5 h-[300px] rounded-2xl overflow-hidden shadow-xl border-8 border-white z-20">
              <Image 
                src="/construction/Project/WhatsApp Image 2026-07-25 at 1.48.00 PM.jpeg"
                alt="Construction Planning"
                fill
                className="object-cover"
              />
            </div>

            {/* Decorative Logo Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-white p-2 rounded-2xl shadow-2xl border-4 border-[#eea000]">
               <div className="w-24 h-24 relative rounded-xl overflow-hidden">
                 <Image src="/construction/former.png" alt="Project Highlight" fill className="object-cover" />
               </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <p className="text-[#eea000] font-bold tracking-[0.2em] text-[14px] uppercase mb-4">
              ABOUT MANONO MANPHIS
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-[#1a1a1a] leading-[1.1] mb-6" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
              Modern Construction & <br />
              <span className="text-[#eea000]">Structural Solutions</span>
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Manono Manphis delivers reliable, high-quality construction services for residential, commercial, and industrial projects. We combine innovative engineering, skilled workmanship, and modern technology to build safe, durable, and beautiful spaces across the region.
            </p>

            {/* Interactive Tabs */}
            <div className="mb-8 border-b border-gray-200">
              <div className="flex gap-8">
                <button 
                  onClick={() => setActiveTab("mission")}
                  className={`pb-4 font-bold tracking-wide transition-all ${activeTab === "mission" ? "text-[#eea000] border-b-2 border-[#eea000]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  MISSION
                </button>
                <button 
                  onClick={() => setActiveTab("vision")}
                  className={`pb-4 font-bold tracking-wide transition-all ${activeTab === "vision" ? "text-[#eea000] border-b-2 border-[#eea000]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  VISION
                </button>
                <button 
                  onClick={() => setActiveTab("values")}
                  className={`pb-4 font-bold tracking-wide transition-all ${activeTab === "values" ? "text-[#eea000] border-b-2 border-[#eea000]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  CORE VALUES
                </button>
              </div>
              <div className="py-6 min-h-[100px]">
                <p className="text-gray-600 leading-relaxed font-medium">
                  {tabContent[activeTab]}
                </p>
              </div>
            </div>

            {/* What We Do List */}
            <div className="mb-10">
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">What We Do:</h3>
              <ul className="space-y-3">
                {[
                  "Residential & Commercial Construction",
                  "Architectural Masonry & Plastering",
                  "Custom Building Renovations",
                  "Structural Roofing & Framing"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#eea000] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div>
              <Link 
                href="/services/construction/services"
                className="inline-block bg-[#1a1a1a] text-white px-10 py-4 font-bold tracking-[0.1em] uppercase hover:bg-[#eea000] transition-colors shadow-lg"
              >
                Discover More
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}
