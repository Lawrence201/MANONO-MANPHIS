"use client";

import React from 'react';
import Image from 'next/image';

export default function Letterhead() {
  return (
    <div className="flex flex-col items-center bg-gray-100 py-10 min-h-screen print:py-0 print:bg-white">
      <button 
        onClick={() => window.print()}
        className="print:hidden mb-6 px-6 py-2.5 bg-[#eea000] text-white font-bold rounded shadow-md hover:bg-[#d58d00] transition-colors flex items-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print Letter
      </button>

      <div 
        className="relative bg-white shadow-xl overflow-hidden text-gray-700 font-sans print:shadow-none"
        style={{ maxWidth: '100%', width: '794px', minHeight: '1122px', fontFamily: "'Inter', sans-serif" }}
      >
        {/* SVG Background for the Header */}
        <svg 
          className="absolute top-0 left-0 w-full z-10" 
          viewBox="0 0 800 250" 
          preserveAspectRatio="none"
          style={{ height: '250px' }}
        >
          <defs>
            <linearGradient id="goldGrad" x1="0" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#cca052" />
              <stop offset="35%" stopColor="#f5d688" />
              <stop offset="55%" stopColor="#fff1ba" />
              <stop offset="75%" stopColor="#cca052" />
              <stop offset="100%" stopColor="#73471c" />
            </linearGradient>
            <linearGradient id="darkBgGrad" x1="0" y1="0" x2="0" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2a101d" />
              <stop offset="100%" stopColor="#1a0912" />
            </linearGradient>
          </defs>
          {/* Dark Purple Base Shape */}
          <polygon points="0,0 800,0 800,50 500,230 0,230" fill="url(#darkBgGrad)" />
          {/* Gold Angled Band */}
          <polygon points="0,150 500,150 800,-30 800,10 500,190 0,190" fill="url(#goldGrad)" />
        </svg>

        {/* Logo Section */}
        <div className="absolute z-20 flex items-center gap-0" style={{ top: '48px', left: '90px' }}>
          <Image 
            src="/logo.PNG" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="object-contain h-16 w-auto"
            priority
          />
          <span className="text-2xl font-black text-white tracking-tight uppercase -ml-2">
            MANONO{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(to right, #cca052 0%, #f5d688 35%, #fff1ba 55%, #cca052 75%, #73471c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              MANPHIS
            </span>
          </span>
        </div>

        {/* Main Content */}
        <div className="relative z-20 px-[90px]" style={{ marginTop: '280px' }}>
          <h1 className="text-2xl font-extrabold text-black mb-8 uppercase tracking-tight leading-tight text-center underline underline-offset-4">
            REQUEST FOR THE ISSUANCE OF TWO (2) BUSINESS SIM CARDS
          </h1>
          
          <p className="text-[15px] leading-relaxed text-black mb-6">
            Dear Sir/Madam,
          </p>
          
          <p className="text-[15px] leading-relaxed text-black mb-4">
            We write to respectfully request the issuance of two (2) MTN Business SIM cards for MANONO MANPHIS INC to support our official business operations and communications.
          </p>
          
          <p className="text-[15px] leading-relaxed text-black mb-4">
            As our company continues to expand its operations, dedicated business telephone lines have become essential for effective communication with our clients, partners, and stakeholders. We therefore kindly request that these SIM cards be registered under the name of our company in accordance with your corporate registration requirements.
          </p>
          
          <p className="text-[15px] leading-relaxed text-black mb-4">
            We are prepared to provide all the necessary documentation required to facilitate this request, including our company registration documents and any additional information that may be required.
          </p>
          
          <p className="text-[15px] leading-relaxed text-black mb-4">
            We would appreciate your prompt consideration and approval of this request. Should you require any further information, please do not hesitate to contact us.
          </p>
          
          <p className="text-[15px] leading-relaxed text-black mb-6">
            Thank you for your assistance and cooperation.
          </p>

          {/* Signature Section */}
          <div className="mt-4">
            <div className="text-[15px] text-black mb-10">Yours faithfully,</div>
            <div className="flex flex-col items-start text-left w-fit ml-auto">
              <div className="border-b border-black w-[200px] mb-2"></div>
              <div className="text-[15px] font-bold text-black">Emmanuel Kusi Appiah</div>
              <div className="text-[14px] text-black">+233 54 288 3496</div>
              <div className="text-[14px] text-black mt-1">Chief Executive Officer (CEO)</div>
              <div className="text-[14px] font-semibold text-black">MANONO MANPHIS INC</div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Great+Vibes&display=swap');
        @media print {
          @page { size: A4; margin: 0; }
          body { 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact; 
            margin: 0 !important; 
            padding: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
