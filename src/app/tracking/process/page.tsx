"use client";

import { useState } from "react";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { TopBar } from "@/components/website/top-bar";
import { ShoppingCart, TrendingUp, UserCheck, Truck, CheckCircle2, ChevronRight } from "lucide-react";

const freightTypes = [
  { id: "air", label: "AIR FREIGHT TRACKING" },
  { id: "ocean", label: "OCEAN FREIGHT TRACKING" },
  { id: "road", label: "ROAD & RAIL FREIGHT TRACKING" },
];

const trackingSteps = [
  { id: 1, label: "Confirmed Order", icon: ShoppingCart, completed: true },
  { id: 2, label: "Processing Order", icon: TrendingUp, completed: true },
  { id: 3, label: "Quality Check", icon: UserCheck, completed: false },
  { id: 4, label: "Dispatched Item", icon: Truck, completed: false },
  { id: 5, label: "Product Delivered", icon: CheckCircle2, completed: false },
];

export default function ShipmentProcessPage() {
  const [activeFreight, setActiveFreight] = useState("air");

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <TopBar />
      <WebsiteHeader />

      <main className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight uppercase">Shipment Track Result</h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Main Result Area */}
            <div className="flex-1">
              {/* Red Header Card */}
              <div className="bg-[#ff4444] p-5 rounded-t-sm">
                <h2 className="text-white font-black text-sm uppercase tracking-widest text-center">Order Tracking: Order No</h2>
              </div>

              {/* Pink Info Bar */}
              <div className="bg-[#fff0f0] border-x border-gray-100 p-6 flex flex-col md:flex-row justify-around items-center gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-[#ff4444] text-[13px] font-black">Shipping Via: <span className="text-gray-600 font-bold">Ipsum Dolor</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#ff4444] text-[13px] font-black">Status: <span className="text-gray-600 font-bold">Processing Order</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[#ff4444] text-[13px] font-black">Expected Date: <span className="text-gray-600 font-bold">12-DEC-2017</span></p>
                </div>
              </div>

              {/* Timeline Container */}
              <div className="bg-white border border-gray-100 p-12 py-20 shadow-xl shadow-gray-200/50 rounded-b-sm">
                <div className="relative flex justify-between items-start max-w-4xl mx-auto">
                  {/* Background Line */}
                  <div className="absolute top-[35px] left-8 right-8 h-[3px] bg-gray-100 z-0" />
                  
                  {/* Progress Line */}
                  {/* Logic: Line is green between completed steps, red otherwise */}
                  <div className="absolute top-[35px] left-8 right-8 h-[3px] z-0 flex">
                    <div className="h-full bg-[#8bc34a]" style={{ width: "25%" }} /> {/* 1 to 2 */}
                    <div className="h-full bg-[#8bc34a]" style={{ width: "25%" }} /> {/* 2 to 3 */}
                    <div className="h-full bg-[#ff4444]" style={{ width: "25%" }} /> {/* 3 to 4 */}
                    <div className="h-full bg-[#ff4444]" style={{ width: "25%" }} /> {/* 4 to 5 */}
                  </div>

                  {trackingSteps.map((step, index) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center group">
                      <div className={`w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-500 shadow-lg ${
                        step.completed ? "bg-[#8bc34a] shadow-green-100" : "bg-[#ff4444] shadow-red-100"
                      }`}>
                        <step.icon className="w-8 h-8 text-white" />
                      </div>
                      <span className={`mt-6 text-[11px] font-black uppercase tracking-tight text-center max-w-[80px] leading-tight ${
                        step.completed ? "text-[#8bc34a]" : "text-gray-400"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-[350px] space-y-4">
              <div className="space-y-1">
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

              {/* Order List Button */}
              <button className="w-full bg-[#ff4444] text-white py-5 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-red-100">
                Your Order List
              </button>
            </div>
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
