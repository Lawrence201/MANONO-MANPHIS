"use client";

import { useState } from "react";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { TopBar } from "@/components/website/top-bar";
import { ChevronRight, ChevronLeft, MapPin, Package, Truck, CreditCard, CheckCircle2, Search } from "lucide-react";
import Image from "next/image";

const steps = [
  { id: 1, label: "WHERE FROM", icon: MapPin },
  { id: 2, label: "WHERE GOING", icon: MapPin },
  { id: 3, label: "WHAT", icon: Package },
  { id: 4, label: "HOW", icon: Truck },
  { id: 5, label: "PAYMENT", icon: CreditCard },
  { id: 6, label: "REVIEW", icon: Search },
  { id: 7, label: "COMPLETE", icon: CheckCircle2 },
];

export default function CreateShippingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [pickupOption, setPickupOption] = useState("dropoff");

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <TopBar />
      <WebsiteHeader />

      <main className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-black text-[#1a1a1a] mb-2 tracking-tight">Create New Shipping</h1>
            <div className="w-24 h-1 bg-[#ff4444]" />
          </div>

          {/* Stepper */}
          <div className="mb-16 relative px-4">
            {/* The Background Line */}
            <div className="absolute top-[20px] left-8 right-8 h-[2px] bg-gray-200 z-0" />
            {/* The Active/Progress Line */}
            <div 
              className="absolute top-[20px] left-8 h-[2px] bg-[#28a745] z-0 transition-all duration-500" 
              style={{ width: `${Math.max(0, (currentStep - 1) / (steps.length - 1) * 100)}%` }}
            />
            
            <div className="flex justify-between relative z-10">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center bg-transparent">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${
                      currentStep >= step.id 
                        ? "bg-[#28a745] text-white shadow-lg shadow-green-100" 
                        : "bg-white border-2 border-gray-200 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id || (currentStep === 7 && step.id === 7) ? <CheckCircle2 className="w-5 h-5" /> : step.id}
                  </div>
                  <span className={`mt-3 text-[10px] font-black tracking-widest uppercase text-center max-w-[80px] ${
                    currentStep === step.id ? "text-gray-900" : "text-gray-400"
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-sm overflow-hidden min-h-[500px] flex flex-col">
            {currentStep < 7 && (
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-1">
                    {currentStep === 1 ? "Hello. Where are you shipping from?" : 
                     currentStep === 2 ? "Where is your shipping going?" :
                     currentStep === 3 ? "What kind of packaging are you using?" :
                     currentStep === 4 ? "How would you like to ship?" :
                     currentStep === 5 ? "How would like to pay?" :
                     "Let's make sure everything is in order"}
                  </h2>
                  <p className="text-gray-400 text-sm">* Indicates required field</p>
                </div>
                <button className="text-[#eea000] font-black text-sm hover:underline">Login</button>
              </div>
            )}

            <div className="p-8 flex-1 flex flex-col">
              {/* Step 1 & 2 Rendering */}
              {(currentStep === 1 || currentStep === 2) && (
                <div className="space-y-8">
                  {currentStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                      <div className="border border-gray-100 p-6 bg-[#fcfcfc] relative">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-black text-gray-900">Ship from</h3>
                          <button className="text-[11px] font-bold text-gray-900 hover:underline">Edit</button>
                        </div>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry
                        </p>
                      </div>
                      <div className="border border-gray-100 p-6 bg-[#fcfcfc] relative">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-sm font-black text-gray-900">Return to</h3>
                          <button className="text-[11px] font-bold text-gray-900 hover:underline">Edit</button>
                        </div>
                        <p className="text-[13px] text-gray-500 leading-relaxed">
                          Lorem Ipsum is simply dummy text of the printing and typesetting industry
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Country<span className="text-red-500">*</span></label>
                      <select className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]">
                        <option>United States</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Company or Name<span className="text-red-500">*</span></label>
                      <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Contact<span className="text-red-500">*</span></label>
                      <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-sm font-bold text-gray-700">Address<span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Street Address" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="md:col-span-1 space-y-2 flex flex-col justify-end">
                      <input type="text" placeholder="Apartment, suite, unit, floor, etc." className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="md:col-span-1 space-y-2 flex flex-col justify-end">
                      <input type="text" placeholder="Department, c/o, etc." className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">{currentStep === 2 ? "Zip Code" : "Postal Code"}<span className="text-red-500">*</span></label>
                      <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">City<span className="text-red-500">*</span></label>
                      <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">{currentStep === 2 ? "State" : "Other Address Info"}<span className="text-red-500">*</span></label>
                      <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">E-mail<span className="text-red-500">*</span></label>
                      <input type="email" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Telephone<span className="text-red-500">*</span></label>
                      <input type="tel" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Ext.</label>
                      <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                  </div>

                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-100">
                      <div className="space-y-3">
                        <p className="text-[11px] font-black uppercase text-gray-400">Save as new entry</p>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-[#28a745]">
                          <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all translate-x-6" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[11px] font-black uppercase text-gray-400">Use this as my default address</p>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-[#28a745]">
                          <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all translate-x-6" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-[11px] font-black uppercase text-gray-400">Add a Different Return Address</p>
                        <div className="relative inline-block w-12 h-6 rounded-full bg-[#28a745]">
                          <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all translate-x-6" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 Rendering */}
              {currentStep === 3 && (
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Packaging Type<span className="text-red-500">*</span></label>
                      <select className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]">
                        <option>Customer packaging</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Weight<span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">lbs</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Length</label>
                      <div className="relative">
                        <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">in</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Width</label>
                      <div className="relative">
                        <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">in</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Height</label>
                      <div className="relative">
                        <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">in</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Declared value</label>
                      <div className="relative">
                        <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">USD</span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-[300px] flex items-center justify-center p-8 border border-gray-100 bg-[#fcfcfc] rounded-sm">
                    {/* Box Diagram */}
                    <div className="relative w-40 h-40">
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-16 border-2 border-gray-800 rotate-45 transform skew-x-[30deg]" />
                      <div className="absolute top-16 left-4 w-32 h-32 border-2 border-gray-800 bg-white" />
                      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-6 h-32 bg-black" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 Rendering */}
              {currentStep === 4 && (
                <div className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-700 pb-4 border-b border-gray-100">Whould you like us to pick up your shipment?</h3>
                    <div className="flex items-center gap-6">
                      <button onClick={() => setPickupOption("dropoff")} className={`px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm transition-all ${pickupOption === "dropoff" ? "bg-[#28a745] text-white" : "bg-white border border-gray-200 text-gray-700"}`}>No I'll drop it off</button>
                      <span className="text-gray-400 font-bold">--or--</span>
                      <button onClick={() => setPickupOption("pickup")} className={`px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm transition-all ${pickupOption === "pickup" ? "bg-[#28a745] text-white" : "bg-white border border-gray-200 text-gray-700"}`}>Yes pick up my shipment</button>
                    </div>
                  </div>
                  <div className="space-y-4 max-w-md">
                    <label className="text-sm font-bold text-gray-700">Dropoff date:</label>
                    <input type="date" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                  </div>
                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700">When would like it delivered?</h3>
                    <div className="space-y-4 max-w-md">
                      <label className="text-sm font-bold text-gray-700">Date and short details:</label>
                      <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 Rendering */}
              {currentStep === 5 && (
                <div className="space-y-8 max-w-4xl">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700">Card Type<span className="text-red-500">*</span></label>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <select className="w-full md:w-64 h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"><option>Select One</option></select>
                      <div className="flex gap-2 bg-gray-100 p-2 rounded-sm grayscale opacity-70">
                        <div className="w-10 h-6 bg-gray-400 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                        <div className="w-10 h-6 bg-gray-400 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 max-w-md">
                    <label className="text-sm font-bold text-gray-700">Card Number<span className="text-red-500">*</span></label>
                    <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700">Exparation<span className="text-red-500">*</span></label>
                      <div className="grid grid-cols-2 gap-4">
                        <select className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"><option>Select Month</option></select>
                        <select className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"><option>Select Year</option></select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">CVV<span className="text-red-500">*</span></label>
                      <input type="text" className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" />
                    </div>
                  </div>
                  <div className="pt-8 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700">Duties and Taxes</h3>
                    <p className="text-[13px] text-gray-500 italic max-w-3xl leading-relaxed">Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
                  </div>
                </div>
              )}

              {/* Step 6 Rendering */}
              {currentStep === 6 && (
                <div className="space-y-12">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="text-lg font-bold text-gray-700">Where</h3>
                    <button className="text-[11px] font-bold text-gray-900 hover:underline">Edit</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc]"><h4 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">Ship from</h4><p className="text-[12px] text-gray-500">Lorem Ipsum...</p></div>
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc]"><h4 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">Ship to</h4><p className="text-[12px] text-gray-500">Lorem Ipsum...</p></div>
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc]"><h4 className="text-sm font-black text-gray-900 mb-4 pb-2 border-b border-gray-100">Return to</h4><p className="text-[12px] text-gray-500">Lorem Ipsum...</p></div>
                  </div>
                  <div className="pt-8 border-t border-gray-100 flex gap-4">
                    <div className="w-5 h-5 border-2 border-red-500 rounded-sm flex-shrink-0" />
                    <p className="text-[11px] text-gray-500 italic">Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
                  </div>
                </div>
              )}

              {/* Step 7 Rendering */}
              {currentStep === 7 && (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <h2 className="text-4xl md:text-5xl font-black text-[#28a745] text-center tracking-tight">
                    Thank You For Create Shipping
                  </h2>
                  <div className="mt-auto w-full flex justify-start">
                    <button className="bg-[#28a745] text-white px-10 py-3 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-green-100">
                      Submit
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {currentStep < 7 && (
                <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-gray-100">
                  {currentStep > 1 && (
                    <button 
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="bg-[#28a745] text-white px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-green-100"
                    >
                      Previous
                    </button>
                  )}
                  <button 
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="bg-[#28a745] text-white px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-green-100"
                  >
                    {currentStep === 6 ? "Ship Now" : "Continue"}
                  </button>
                  <button className="bg-[#ff4444] text-white px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-red-100">
                    Cancel Shipment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <WebsiteFooter />
    </div>
  );
}
