"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

import { Playfair_Display, Inter } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['600', '700', '800', '900'] });
const Inter = Inter({ subsets: ['latin'], weight: '800' });

export default function LogosTemplate() {
  const searchParams = useSearchParams();
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    // Generate the dynamic QR code URL for production/local
    setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=095b9e&data=${encodeURIComponent(window.location.origin + '/adonis')}`);
    
    // Update document title for printing
    document.title = "Logos Template";

    if (searchParams.get('autoPrint') === 'true') {
      setTimeout(() => {
        window.print();
      }, 500); // Give a brief moment for assets (logo) to load
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white font-sans flex flex-col items-center print:block">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}} />
      <div id="logos-container" className="w-[210mm] h-[297mm] overflow-hidden bg-white px-10 pt-4 pb-16 shadow-lg print:shadow-none print:px-8 print:pt-2 print:pb-14 print:m-0 flex flex-col justify-start">
        
        <div className="grid grid-cols-2 grid-rows-4 gap-x-8 gap-y-8 h-full min-h-[230mm] place-items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`flex flex-col items-center justify-center p-4 w-full h-[160px] text-center print:border-[0.5px] print:border-dashed print:border-gray-400 ${i >= 6 ? 'relative -top-3' : ''}`}>
              <img 
                src="/billboards/White_Logo.png" 
                alt={`Whitecap Logo ${i + 1}`} 
                className="w-[95px] h-[95px] object-contain mb-1" 
              />
              <div className="flex flex-col items-center">
                <span 
                  className={`text-3xl font-semibold ${playfair.className}`} 
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, #095b9e, #37b3db, #099aca, #82d6e7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: '1.1' 
                  }}
                >
                  Whitecap
                </span>
                <span 
                  className={`text-[11px] tracking-[0.25em] mt-1 ${Inter.className}`}
                  style={{ 
                    backgroundImage: 'linear-gradient(to right, #095b9e, #37b3db, #099aca, #82d6e7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}
                >
                  INTERNATIONAL
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Page 2: Business Cards */}
      <div id="cards-container" className="w-[210mm] h-[297mm] overflow-hidden bg-white p-10 shadow-lg print:shadow-none print:p-8 print:m-0 mt-8 print:mt-0 flex flex-col justify-between" style={{ pageBreakBefore: 'always' }}>
        <div className="grid grid-cols-2 grid-rows-4 gap-x-8 gap-y-8 h-full min-h-[230mm] place-items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="relative flex flex-col w-full h-[160px] p-5 overflow-hidden bg-white print:border-[0.5px] print:border-dashed print:border-gray-400">
              
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <img src="/billboards/White_Logo.png" alt="" className="w-36 h-36 object-contain" />
              </div>

              {/* Header Section */}
              <div className="w-full mb-4 z-10">
                <h2 className={`text-[19px] font-extrabold tracking-widest text-[#0a192f] ${playfair.className}`}>
                  ADONIS L. MACAULEY
                </h2>
                <div className="w-full h-[2px] min-h-[2px] bg-gradient-to-r from-[#095b9e] via-[#37b3db] to-transparent my-1.5" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}></div>
                <p className={`text-[9px] font-bold tracking-[0.2em] text-[#095b9e] uppercase ${Inter.className}`}>
                  CHIEF EXECUTIVE OFFICER
                </p>
              </div>

              {/* Body Section */}
              <div className="flex justify-between items-end mt-auto z-10">
                
                {/* Contact Info */}
                <div className={`flex flex-col space-y-1 text-[10px] text-gray-700 font-medium tracking-wide ${Inter.className}`}>
                  <p>
                    <span className="font-bold text-[#095b9e]">T: </span>
                    +232-75-126-123 / +232-31-126-123
                  </p>
                  <p>adonismacauley@gmail.com</p>
                  <p>50 Siaka Stevens Street, Freetown</p>
                </div>

                {/* QR Code */}
                <div className="shrink-0 ml-4 p-1 border border-gray-100 rounded-md bg-white shadow-sm">
                  {qrUrl ? (
                    <img 
                      src={qrUrl} 
                      alt="Digital Business Card Link" 
                      className="w-[45px] h-[45px] object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "/social-qrcode.png"; // Fallback to local
                      }}
                    />
                  ) : (
                    <div className="w-[45px] h-[45px] bg-gray-50" />
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Print Button (Hidden when printing) */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print Document
        </button>
      </div>
    </div>
  );
}


