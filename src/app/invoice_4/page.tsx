"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function InvoiceContent() {
  const searchParams = useSearchParams();
  const [gst, setGst] = useState("15");
  const [invoiceNo, setInvoiceNo] = useState("0031");

  useEffect(() => {
    const v = searchParams.get('gst');
    if (v) setGst(v);
    
    const i = searchParams.get('invoiceNo');
    if (i) setInvoiceNo(i);

    // Update document title so the browser uses it as the default PDF filename
    document.title = `Proforma Invoice ${i || '0031'}`;

    if (searchParams.get('autoPrint') === 'true') {
      setTimeout(() => {
        window.print();
      }, 500); // Give a brief moment for assets (logo) to load
    }

    if (searchParams.get('autoDownload') === 'true') {
      setTimeout(() => {
        import('html2pdf.js').then((html2pdf) => {
          const element = document.getElementById('invoice-container');
          if (!element) return;
          
          const opt: any = {
            margin:       0,
            filename:     `Proforma-Invoice-${i || '0031'}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
          };
          
          const generator = html2pdf.default || html2pdf;
          generator().set(opt).from(element).save();
        });
      }, 1000); // Wait slightly longer for images
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 print:py-0 print:bg-white font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; overflow: hidden; }
        }
      `}} />
      <div id="invoice-container" className="max-w-[210mm] min-h-[297mm] mx-auto bg-white p-10 shadow-lg print:shadow-none print:px-8 print:pb-8 print:pt-12 print:m-0 print:min-h-0">
        
        {/* Header Section */}
        <div className="relative flex items-center justify-center mb-4 min-h-[112px]">
          {/* Logo */}
          <div className="absolute left-0 -top-2 w-28 h-28 shrink-0 flex items-center justify-center">
            {/* Logo */}
            <img src="/billboards/White_Logo.png" alt="Whitecap Logo" className="w-full h-full object-contain" onError={(e) => {
              // Fallback styling if logo isn't available yet
              e.currentTarget.style.display = 'none';
              if (e.currentTarget.parentElement) {
                 e.currentTarget.parentElement.innerHTML = '<div class="w-16 h-16 rounded-full border-4 border-black flex items-center justify-center"><div class="w-12 h-12 rounded-full border-2 border-black"></div></div>';
              }
            }} />
          </div>
          
          {/* Company Details */}
          <div className="text-center pl-10">
            <h1 
              className="text-[28px] md:text-[34px] font-black tracking-wide leading-none mb-1 uppercase text-black" 
              style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif', transform: 'scaleY(1.15)', display: 'inline-block' }}
            >
              WHITECAP INTERNATIONAL LIMITED
            </h1>
            <p className="font-bold text-[13px] md:text-sm mt-2">91 Campbell Street Freetown, Sierra Leone</p>
            <p className="font-bold text-[13px] md:text-sm mt-0.5">Phone: +232 75 126 123 / +232 31 126 123 / +232 31 837 455</p>
            <p className="font-bold text-[13px] md:text-sm mt-0.5">Email: whitecapinternationallimited@gmail.com</p>
          </div>
        </div>

        {/* Invoice Title */}
        <div className="relative flex justify-center items-center mt-8 mb-8">
          <h2 className="text-[22px] font-extrabold underline underline-offset-4 decoration-2 uppercase text-black">PROFORMA INVOICE</h2>
          <div className="absolute right-0 flex items-center font-bold text-xl text-black">
            <span>Nº</span>
            <span className="text-red-600 ml-2">{invoiceNo}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-4 mb-6 font-bold text-[15px] text-black">
          <div className="flex items-end">
            <span className="whitespace-nowrap mr-2">Name:</span>
            <div className="flex-1 border-b-[2px] border-dotted border-black"></div>
          </div>
          <div className="flex items-end justify-between gap-4">
            <div className="flex items-end flex-[2]">
              <span className="whitespace-nowrap mr-2">Address:</span>
              <div className="flex-1 border-b-[2px] border-dotted border-black"></div>
            </div>
            <div className="flex items-end flex-1">
              <span className="whitespace-nowrap mr-2 pl-2">Date:</span>
              <div className="flex-1 border-b-[2px] border-dotted border-black"></div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="mb-6">
          <table className="w-full border-collapse border-[2px] border-black text-center text-sm font-bold text-black">
            <thead>
              <tr className="border-b-[2px] border-black">
                <th className="border-r-[2px] border-black py-2 w-[10%]">QTY</th>
                <th className="border-r-[2px] border-black py-2 w-[50%]">DESCRIPTION</th>
                <th className="border-r-[2px] border-black py-2 w-[20%]">UNIT PRICE</th>
                <th className="py-2 w-[20%]">AMOUNT</th>
              </tr>
            </thead>
            <tbody>
              {/* Empty Rows for filling */}
              {Array.from({ length: 14 }).map((_, i) => (
                <tr key={i} className="border-b-[1px] border-black h-7">
                  <td className="border-r-[2px] border-black"></td>
                  <td className="border-r-[2px] border-black"></td>
                  <td className="border-r-[2px] border-black"></td>
                  <td></td>
                </tr>
              ))}
              
              {/* Sub Total Row */}
              <tr className="border-b-[2px] border-black h-8">
                <td className="border-r-[2px] border-black"></td>
                <td className="border-r-[2px] border-black"></td>
                <td className="border-r-[2px] border-black text-left pl-2 font-bold">Sub Total Le</td>
                <td></td>
              </tr>
              
              {/* Total Row */}
              <tr className="h-10">
                <td className="border-r-[2px] border-black"></td>
                <td className="border-r-[2px] border-black"></td>
                <td className="border-r-[2px] border-black text-center font-extrabold text-xl uppercase tracking-wider">TOTAL LE</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div className="mt-4 space-y-6 font-bold text-[15px] text-black">
          <div className="flex items-end">
            <span className="whitespace-nowrap mr-2">Amount in words</span>
            <div className="flex-1 border-b-[2px] border-dotted border-black"></div>
          </div>
          <div className="border-b-[2px] border-dotted border-black w-full h-4"></div>

          <div className="flex justify-between items-end pt-6">
            <div className="text-center w-64">
              <div className="border-b-[2px] border-dotted border-black w-full mb-1"></div>
              <span className="italic font-bold">Customer's Signature</span>
            </div>
            <div className="text-center w-64">
              <div className="border-b-[2px] border-dotted border-black w-full mb-1"></div>
              <span className="italic font-bold">Manager's Signature</span>
            </div>
          </div>
        </div>

      </div>

      {/* Print Button (Hidden when printing) */}
      <div className="fixed bottom-8 right-8 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Print Invoice
        </button>
      </div>
    </div>
  );
}

export default function Invoice4() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading Invoice...</div>}>
      <InvoiceContent />
    </Suspense>
  );
}
