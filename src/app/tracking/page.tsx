"use client";

import { useState } from "react";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { TopBar } from "@/components/website/top-bar";
import { Search, ChevronRight, HelpCircle, List } from "lucide-react";

const freightTypes = [
  { id: "air", label: "AIR FREIGHT TRACKING" },
  { id: "ocean", label: "OCEAN FREIGHT TRACKING" },
  { id: "road", label: "ROAD & RAIL FREIGHT TRACKING" },
];

export default function TrackingPage() {
  const [activeTab, setActiveTab] = useState("number");
  const [activeFreight, setActiveFreight] = useState("air");

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <TopBar />
      <WebsiteHeader />

      <main className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl font-black text-[#1a1a1a] tracking-tight uppercase">Track a Shipment</h1>
            <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed text-sm">
              Track your LTL, truckload, or intermodal shipment by entering your <span className="font-bold text-gray-900">Track number</span> below 
              to get instant freight tracking information.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Tracking Box */}
            <div className="flex-1">
              {/* Tabs */}
              <div className="flex">
                <button 
                  onClick={() => setActiveTab("number")}
                  className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-t-sm border-t border-l border-r ${
                    activeTab === "number" 
                      ? "bg-white border-gray-100 text-gray-900" 
                      : "bg-transparent border-transparent text-[#0066cc] hover:text-[#004499]"
                  }`}
                >
                  Track by Number
                </button>
                <button 
                  onClick={() => setActiveTab("reference")}
                  className={`px-8 py-4 text-xs font-black uppercase tracking-widest transition-all rounded-t-sm border-t border-l border-r ml-1 ${
                    activeTab === "reference" 
                      ? "bg-white border-gray-100 text-gray-900" 
                      : "bg-transparent border-transparent text-[#0066cc] hover:text-[#004499]"
                  }`}
                >
                  Track by Reference
                </button>
              </div>

              {/* Content Card */}
              <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-xl shadow-gray-200/50 rounded-b-sm rounded-tr-sm">
                <h2 className="text-xl md:text-2xl font-black text-[#1a1a1a] mb-10 uppercase tracking-tight">
                  {freightTypes.find(f => f.id === activeFreight)?.label}
                </h2>

                {activeTab === "number" ? (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <input 
                        type="text" 
                        placeholder="Track ID"
                        className="w-full h-14 px-6 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none text-gray-600 transition-all shadow-sm"
                      />
                    </div>
                    <button className="bg-[#ff4444] text-white px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-red-100">
                      Track
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700">Shipment Reference (BOL or PO):</label>
                        <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700">Shipment Date Start:</label>
                        <input type="date" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none text-sm" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700">Shipment Date End:</label>
                        <input type="date" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700">Origin Country:</label>
                        <select className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9] text-sm">
                          <option>United State</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700">Origin ZIP/Postal Code:</label>
                        <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none text-sm" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700">Destination Country:</label>
                        <select className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9] text-sm">
                          <option>United State</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-gray-700">Destination ZIP/Postal Code:</label>
                        <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none text-sm" />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button className="bg-[#ff4444] text-white px-8 py-3 font-black text-xs uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-red-100">
                        Track
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-8 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#0066cc]">
                  <button className="hover:underline flex items-center gap-1">
                    Need Help?
                  </button>
                  <span className="text-gray-300 font-normal">|</span>
                  <button className="hover:underline flex items-center gap-1">
                    Your Order List
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-[350px] space-y-1">
              <div className="bg-[#ff4444] p-5 rounded-t-sm">
                <h3 className="text-white font-black text-sm uppercase tracking-widest">Select Your Freight</h3>
              </div>
              <div className="bg-white border border-gray-100 shadow-lg shadow-gray-200/20 rounded-b-sm overflow-hidden">
                {freightTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setActiveFreight(type.id)}
                    className={`w-full flex items-center justify-between p-5 text-left transition-all border-b border-gray-50 last:border-0 ${
                      activeFreight === type.id 
                        ? "bg-gray-500 text-white" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-widest">{type.label}</span>
                    <ChevronRight className={`w-4 h-4 ${activeFreight === type.id ? "text-white" : "text-gray-400"}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
