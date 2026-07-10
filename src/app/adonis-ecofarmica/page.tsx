"use client";

import React, { useEffect, useRef } from 'react';
import domtoimage from 'dom-to-image';
import { Playfair_Display, Montserrat } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['600', '700', '800', '900'] });
const montserrat = Montserrat({ subsets: ['latin'], weight: ['500', '600', '700', '800'] });

export default function AdonisEcofarmicaCard() {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadImage = async () => {
    if (cardRef.current) {
      try {
        const node = cardRef.current;
        const scale = 3;
        const dataUrl = await domtoimage.toJpeg(node, { 
          quality: 0.95, 
          bgcolor: '#ffffff',
          height: node.offsetHeight * scale,
          width: node.offsetWidth * scale,
          style: {
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: node.offsetWidth + 'px',
            height: node.offsetHeight + 'px'
          }
        });
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'Adonis_Ecofarmica_Card.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err) {
        console.error("Error capturing card:", err);
      }
    }
  };

  useEffect(() => {
    // Auto-trigger the download after 1.5s to ensure fonts/images loaded
    const timer = setTimeout(() => {
      downloadImage();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen flex justify-center items-center p-4 sm:p-8 relative"
      style={{
        backgroundImage: 'linear-gradient(rgba(25, 25, 28, 0.88), rgba(25, 25, 28, 0.88)), url("/construction/hero.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      {/* Business Card Container */}
      <div ref={cardRef} className="relative flex flex-row w-full max-w-[550px] bg-white p-6 sm:p-10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden">
        
        {/* Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
          <img src="/ecofarm.png" alt="" className="w-64 h-64 object-contain scale-125" />
        </div>

        {/* Left Side: Content */}
        <div className="flex-1 z-10">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className={`text-[22px] sm:text-[32px] whitespace-nowrap font-black tracking-wide text-[#0d4f13] ${playfair.className}`} style={{ textShadow: '0.5px 0.5px 0px rgba(0,0,0,0.1)' }}>
              ADONIS L. MACAULEY
            </h1>
            
            <div className="w-full h-[2px] bg-gradient-to-r from-[#137A20] via-[#44B623] to-transparent my-2 rounded-full"></div>
            
            <p className={`text-[10px] sm:text-[11px] font-extrabold tracking-[0.25em] text-[#137A20] uppercase ${montserrat.className}`}>
              CHIEF EXECUTIVE OFFICER
            </p>
          </div>

          {/* Contact Section */}
          <div className={`flex flex-col space-y-2 text-[12px] sm:text-[13px] text-[#0d4f13] font-semibold tracking-wide ${montserrat.className}`}>
            <p>
              <span className="font-extrabold text-[#137A20]">T: </span>
              +232-75-126-123 / +232-31-126-123
            </p>
            <p>adonismacauley@gmail.com</p>
            <p>50 Siaka Stevens Street, Freetown</p>
          </div>
        </div>

        {/* Right Side: QR Code */}
        <div className="shrink-0 ml-4 flex items-end justify-end z-10">
          <div className="p-1.5 border-[1.5px] border-gray-100 rounded-lg bg-white shadow-sm transition-transform hover:scale-105 cursor-pointer">
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=137A20&data=VCARD:N:Macauley;Adonis;L.;;%0AORG:Ecofarmica%0ATITLE:Chief%20Executive%20Officer%0ATEL:+23275126123%0AEMAIL:adonismacauley@gmail.com%0AADR:;;50%20Siaka%20Stevens%20Street;Freetown;;;%0A" 
              alt="Save to Contacts QR Code" 
              className="w-[48px] h-[48px] sm:w-[90px] sm:h-[90px] object-contain opacity-90"
              onError={(e) => {
                e.currentTarget.src = "/social-qrcode.png"; // Fallback
              }}
            />
          </div>
        </div>

      </div>

      {/* Manual Download Fallback Button */}
      <button 
        onClick={downloadImage}
        className="absolute bottom-6 sm:bottom-10 bg-[#137A20] hover:bg-[#0c5916] text-white px-6 py-2.5 rounded-full font-semibold shadow-[0_4px_14px_rgba(19,122,32,0.39)] transition-all flex items-center gap-2 text-sm sm:text-base z-20"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Save Card to Gallery
      </button>

    </div>
  );
}
