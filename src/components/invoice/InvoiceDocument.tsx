import React from 'react';

export function InvoiceDocument({ vat, invoiceNo }: { vat: string; invoiceNo: string }) {
  return (
    <div 
      id="invoice-container" 
      className="max-w-[210mm] min-h-[297mm] mx-auto p-10 font-sans shadow-lg print:shadow-none print:p-0 print:m-0"
      style={{ backgroundColor: '#ffffff', color: '#000000' }}
    >
      
      {/* Header Section */}
      <div className="relative flex items-center justify-center mb-4 min-h-[112px]">
        {/* Logo */}
        <div className="absolute left-0 top-0 w-28 h-28 shrink-0 flex items-center justify-center">
          <img src="/logo.PNG" alt="Manono Manphis Logo" className="w-full h-full object-contain" />
        </div>
        
        {/* Company Details */}
        <div className="text-center">
          <h1 
            className="text-[28px] font-black tracking-tighter leading-none mb-1 uppercase font-sans"
            style={{ color: '#111827' }}
          >
            MANONO MANPHIS INC
          </h1>
          <p className="font-bold text-sm">Dansoman, Accra - Ghana</p>
          <p className="font-bold text-sm mt-0.5">Phone: +233 54 288 34 96 / +232 75 126 123</p>
          <p className="font-bold text-sm mt-0.5">Email: manono@manonomanphis.com</p>
        </div>
      </div>

      {/* Invoice Title */}
      <div className="relative flex justify-center items-center mt-6 mb-8">
        <h2 className="text-xl font-bold underline underline-offset-4 decoration-2 uppercase">SERVICE INVOICE</h2>
        <div className="absolute right-0 flex items-center font-bold text-lg">
          <span>Nº</span>
          <span className="ml-2" style={{ color: '#dc2626' }}>{invoiceNo || '0031'}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-4 mb-6 font-bold text-[15px]">
        <div className="flex items-end">
          <span className="whitespace-nowrap mr-2">Name:</span>
          <div className="flex-1 border-b-2 border-dotted" style={{ borderColor: '#000000' }}></div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-end flex-[2]">
            <span className="whitespace-nowrap mr-2">Address:</span>
            <div className="flex-1 border-b-2 border-dotted" style={{ borderColor: '#000000' }}></div>
          </div>
          <div className="flex items-end flex-1">
            <span className="whitespace-nowrap mr-2">Date:</span>
            <div className="flex-1 border-b-2 border-dotted" style={{ borderColor: '#000000' }}></div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="mb-6">
        <table className="w-full border-collapse border-2 text-center text-sm font-bold" style={{ borderColor: '#000000' }}>
          <thead>
            <tr className="border-b-2" style={{ borderColor: '#000000' }}>
              <th className="border-r-2 py-2 w-[10%]" style={{ borderColor: '#000000' }}>QTY</th>
              <th className="border-r-2 py-2 w-[50%]" style={{ borderColor: '#000000' }}>DESCRIPTION</th>
              <th className="border-r-2 py-2 w-[20%]" style={{ borderColor: '#000000' }}>UNIT PRICE</th>
              <th className="py-2 w-[20%]">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {/* Empty Rows for filling */}
            {Array.from({ length: 15 }).map((_, i) => (
              <tr key={i} className="border-b h-7" style={{ borderColor: '#000000' }}>
                <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
                <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
                <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
                <td></td>
              </tr>
            ))}
            
            {/* Sub Total Row */}
            <tr className="border-b h-8" style={{ borderColor: '#000000' }}>
              <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
              <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
              <td className="border-r-2 text-left pl-2 font-bold" style={{ borderColor: '#000000' }}>Sub Total GH₵</td>
              <td></td>
            </tr>
            
            {/* GST Row */}
            <tr className="border-b-2 h-8" style={{ borderColor: '#000000' }}>
              <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
              <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
              <td className="border-r-2 text-left pl-2 font-bold" style={{ borderColor: '#000000' }}>{vat || '15'}% VAT</td>
              <td></td>
            </tr>
            
            {/* Total Row */}
            <tr className="h-10">
              <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
              <td className="border-r-2" style={{ borderColor: '#000000' }}></td>
              <td className="border-r-2 text-center font-extrabold text-lg uppercase tracking-wider" style={{ borderColor: '#000000' }}>TOTAL GH₵</td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="mt-8 space-y-8 font-bold text-[15px]">
        <div className="flex items-end">
          <span className="whitespace-nowrap mr-2">Amount in words</span>
          <div className="flex-1 border-b-2 border-dotted" style={{ borderColor: '#000000' }}></div>
        </div>
        <div className="border-b-2 border-dotted w-full h-4" style={{ borderColor: '#000000' }}></div>

        <div className="flex justify-between items-end pt-16">
          <div className="text-center w-64">
            <div className="border-b-2 border-dotted w-full mb-1" style={{ borderColor: '#000000' }}></div>
            <span className="italic">Customer's Signature</span>
          </div>
          <div className="text-center w-64">
            <div className="border-b-2 border-dotted w-full mb-1" style={{ borderColor: '#000000' }}></div>
            <span className="italic">Manager's Signature</span>
          </div>
        </div>
      </div>

    </div>
  );
}
