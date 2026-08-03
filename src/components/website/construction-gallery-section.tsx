"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export function ConstructionGallerySection() {
  const [selectedItem, setSelectedItem] = useState<{ type: string, src: string } | null>(null);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedItem]);

  const galleryItems = [
    { type: "image", src: "/construction/gallery/gall_8.jpeg" },
    { type: "image", src: "/construction/gallery/gall_9.jpeg" },
    { type: "image", src: "/construction/gallery/gall_10.jpeg" },
    { type: "image", src: "/construction/gallery/gall_11.jpeg" },
    { type: "image", src: "/construction/gallery/gall_1.jpeg" },
    { type: "image", src: "/construction/gallery/gall_2.jpeg" },
    { type: "image", src: "/construction/gallery/gall_3.jpeg" },
    { type: "video", src: "/construction/gallery/vid_1.mp4" },
    { type: "image", src: "/construction/gallery/gall_4.jpeg" },
    { type: "image", src: "/construction/gallery/gall_5.jpeg" },
    { type: "video", src: "/construction/gallery/vid_2.mp4" },
    { type: "image", src: "/construction/gallery/gall_6.jpeg" },
    { type: "image", src: "/construction/gallery/gall_7.jpeg" },
  ];

  return (
    <section className="bg-white py-24 relative" id="gallery">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1700px]">
        {/* Header */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD100]"></div>
            <span className="text-[12px] font-bold text-gray-500 tracking-[0.2em] uppercase">
              BEHIND THE SCENES
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#FFD100]"></div>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            Work In Progress
          </h2>
        </div>

        {/* Uniform Grid Gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {galleryItems.map((item, index) => {
            return (
              <div 
                key={index} 
                onClick={() => setSelectedItem(item)}
                className="relative overflow-hidden shadow-sm group aspect-square bg-gray-100 cursor-pointer"
              >
                {item.type === "image" ? (
                  <Image 
                    src={item.src} 
                    alt={`Construction Work in progress ${index + 1}`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <video 
                    src={item.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white font-bold tracking-wider uppercase text-sm border-2 border-white px-6 py-2">
                    {item.type === "video" ? "Watch" : "View"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4 md:p-12">
          <button 
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-white hover:text-[#FFD100] transition-colors z-[99999] bg-black/50 rounded-full p-2"
          >
            <X className="w-8 h-8 md:w-10 md:h-10" />
          </button>
          
          <div className="relative w-full max-w-6xl h-full max-h-[85vh] flex items-center justify-center bg-black rounded-lg overflow-hidden">
            {selectedItem.type === "image" ? (
              <Image 
                src={selectedItem.src} 
                alt="Enlarged view" 
                fill 
                className="object-contain" 
              />
            ) : (
              <video 
                src={selectedItem.src}
                controls
                autoPlay
                className="w-full h-full max-h-full object-contain"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
