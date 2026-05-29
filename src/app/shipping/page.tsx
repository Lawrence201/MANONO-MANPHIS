"use client";

import { useState, useEffect } from "react";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { TopBar } from "@/components/website/top-bar";
import { ProductsHero } from "@/components/website/products-hero";
import { getProduct } from "@/lib/actions/product-actions";
import { submitExportOrder } from "@/lib/actions/export-actions";
import { mapCountries } from "@/lib/countries";
import { ChevronRight, ChevronLeft, MapPin, Package, Truck, CreditCard, CheckCircle2, Search, FileText } from "lucide-react";
import Image from "next/image";

const steps = [
  { id: 1, label: "SENDER", icon: MapPin },
  { id: 2, label: "BUYER", icon: MapPin },
  { id: 3, label: "PRODUCT", icon: Package },
  { id: 4, label: "SHIPPING", icon: Truck },
  { id: 5, label: "DOCUMENTS", icon: FileText },
  { id: 6, label: "PAYMENT", icon: CreditCard },
  { id: 7, label: "REVIEW", icon: CheckCircle2 },
];

export default function CreateShippingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [pickupOption, setPickupOption] = useState("warehouse");
  const [productName, setProductName] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);
  const [productLocation, setProductLocation] = useState<string | null>(null);
  const [productDetails, setProductDetails] = useState<any>(null);

  const [formData, setFormData] = useState({
    buyerType: "Individual Buyer",
    companyName: "",
    destinationCountry: "US",
    city: "",
    deliveryAddress: "",
    stateRegion: "",
    postalCode: "",
    email: "",
    phone: "",
    taxId: "",
    
    quantityRequested: "",
    
    shippingType: "Sea Freight (Tema Port – Bulk Orders)",
    deliveryType: "Door to Port",
    pickupOption: "warehouse",
    preferredDate: "",
    deliveryPriority: "Standard (2–4 weeks)",

    requiresFda: true,
    requiresPhyto: true,
    requiresOrganic: false,
    requiresOrigin: false,
    customsValue: "",
    importRequirements: "",

    paymentMethod: "Bank Transfer",
    depositRequired: "70% Advance / 30% on Shipment",
    billingAddress: "",
    
    agreedToTerms1: false,
    agreedToTerms2: false,
    agreedToTerms3: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [productIdStr, setProductIdStr] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setProductName(params.get("productName"));
      setProductImage(params.get("productImage"));
      setProductLocation(params.get("productLocation"));
      
      const pid = params.get("productId");
      if (pid) {
        setProductIdStr(pid);
        getProduct(Number(pid)).then(res => {
          if (res.success && res.data) {
            setProductDetails(res.data);
          }
        });
      }
    }
  }, []);

  const pkgInfo = (() => {
    if (!productDetails) return { name: "Unit", multiplier: 1, price: 0 };
    let pkgName = "Unit";
    if (productDetails.packagingType === "drum") pkgName = "Drum";
    else if (productDetails.packagingType === "bucket") pkgName = "Bucket";
    else if (productDetails.packagingType === "container") pkgName = "IBC Tote";
    else if (productDetails.packagingType === "bottle") pkgName = "Bottle";
    else if (productDetails.packagingType) pkgName = productDetails.packagingType.charAt(0).toUpperCase() + productDetails.packagingType.slice(1);

    let multiplier = 1;
    if (productDetails.priceUnitType === 'per_kg' && productDetails.packagingSize) {
      const matchKg = productDetails.packagingSize.match(/(\d+(?:\.\d+)?)kg/i);
      if (matchKg) multiplier = Number(matchKg[1]);
    } else if (productDetails.priceUnitType === 'per_liter' && productDetails.packagingSize) {
      const matchL = productDetails.packagingSize.match(/(\d+(?:\.\d+)?)L/i);
      if (matchL) multiplier = Number(matchL[1]);
    }
    
    return {
      name: pkgName,
      multiplier,
      price: (Number(productDetails.pricePerUnit) || 0) * multiplier
    };
  })();

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    try {
      const res = await submitExportOrder({
        ...formData,
        productId: productIdStr,
        unitMeasurement: pkgInfo.name,
        totalEstimatedCost: pkgInfo.price * Number(formData.quantityRequested || 0)
      });
      if (res.success) {
        setReferenceNumber(res.reference || "");
        setSubmitSuccess(true);
      } else {
        alert(res.message);
      }
    } catch (e) {
      alert("Failed to submit order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (step: number) => {
    if (step === 2) {
      if (!formData.buyerType || !formData.companyName || !formData.destinationCountry || !formData.city || !formData.deliveryAddress || !formData.stateRegion || !formData.postalCode || !formData.email || !formData.phone) {
        return false;
      }
    }
    if (step === 3) {
      if (!formData.quantityRequested) return false;
      if (productDetails && Number(formData.quantityRequested) < Number(productDetails.moqValue)) return false;
      if (productDetails && Number(formData.quantityRequested) > Number(productDetails.stockQuantity)) return false;
    }
    if (step === 4) {
      if (!formData.shippingType || !formData.deliveryType || !formData.pickupOption || !formData.preferredDate || !formData.deliveryPriority) {
        return false;
      }
    }
    if (step === 5) {
      // Paperwork handled internally, no validation required
      return true;
    }
    if (step === 6) {
      if (!formData.paymentMethod || !formData.depositRequired) return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) {
      alert("Please fill in all required fields correctly before proceeding.");
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  return (
    <div className="min-h-screen bg-[#ffffff]">
      <TopBar />
      <WebsiteHeader />

      {submitSuccess ? (
        <main className="py-32 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-6 p-8 border border-gray-100 rounded-sm shadow-xl shadow-gray-200/50 bg-white max-w-xl w-full mx-4">
            <CheckCircle2 className="w-20 h-20 text-[#535353] mx-auto" />
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Order Submitted!</h1>
            <p className="text-gray-500">Your export request has been successfully received and is now processing.</p>
            <div className="p-4 bg-gray-50 border border-gray-100 rounded-sm inline-block mx-auto mt-4">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Reference Number</p>
              <p className="font-black text-xl text-[#535353]">{referenceNumber}</p>
            </div>
          </div>
        </main>
      ) : (
      <main className={productName && productImage ? "pb-24" : "py-16"}>
        {productName && productImage ? (
          <ProductsHero
            title={productName.split(' ').slice(0, 3).join(' ').toUpperCase()}
            highlightTitle={productName.split(' ').slice(3).join(' ').toUpperCase()}
            backgroundImage={productImage}
            breadcrumbTitle="Shipping"
            highlightColor="#eea000"
          />
        ) : null}

        <div className={`container mx-auto px-4 max-w-6xl ${productName && productImage ? "mt-16" : ""}`}>
          {!productName || !productImage ? (
            <div className="text-center mb-20">
              <h1 
                className="text-[80px] md:text-[110px] font-bold text-[#1a1a1a] tracking-[-0.04em] uppercase leading-[1.0] md:scale-x-[0.85] transform origin-center"
                style={{ fontFamily: "var(--font-antonio)" }}
              >
                Create New Shipping
              </h1>
              <p 
                className="mt-10 text-gray-400 text-[12px] tracking-[0.1em] uppercase font-bold"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                Search from over 1999+ Active Ads in 30+ Categories for Free
              </p>
            </div>
          ) : null}

          {/* Stepper */}
          <div className="mb-16 relative px-4">
            {/* The Background Line */}
            <div className="absolute top-[20px] left-8 right-8 h-[2px] bg-gray-200 z-0" />
            {/* The Active/Progress Line */}
            <div 
              className="absolute top-[20px] left-8 h-[2px] bg-[#535353] z-0 transition-all duration-500" 
              style={{ width: `${Math.max(0, (currentStep - 1) / (steps.length - 1) * 100)}%` }}
            />
            
            <div className="flex justify-between relative z-10">
              {steps.map((step) => (
                <div key={step.id} className="flex flex-col items-center bg-transparent">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 z-10 ${
                      currentStep >= step.id 
                        ? "bg-[#535353] text-white shadow-lg shadow-gray-200" 
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
                  <h2 className="text-2xl font-black text-gray-900 mb-1 uppercase tracking-tight">
                    {currentStep === 1 ? "Exporting Company Information" : 
                     currentStep === 2 ? "BUYER (RECEIVER DETAILS)" :
                     currentStep === 3 ? "PRODUCT DETAILS (HONEY ORDER)" :
                     currentStep === 4 ? "SHIPPING METHOD (EXPORT LOGISTICS)" :
                     currentStep === 5 ? "DOCUMENTS & CERTIFICATION" :
                     "PAYMENT & INVOICE"}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {currentStep === 1 
                      ? (productName ? "System-Managed" : "Log in to continue") 
                      : "* Indicates required field"}
                  </p>
                </div>
              </div>
            )}

            <div className="p-8 flex-1 flex flex-col">
              {/* Step 1 Rendering */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Exporter Company Name</label>
                      <input type="text" value={productName ? "Manono Manphis Export Materials Co., Ltd" : ""} readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Contact Person Name</label>
                      <input type="text" value={productName ? "+233 542 288 3496" : ""} readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Country</label>
                      <input type="text" value={productName ? "Ghana" : ""} readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Region / City</label>
                      <input type="text" value={productName ? "Accra" : ""} readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700">Warehouse Facility</label>
                      <input type="text" value={productName ? (productLocation || "") : ""} readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Email Address</label>
                      <input type="email" value={productName ? "manonomanphis@gmail.com" : ""} readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Phone / WhatsApp</label>
                      <input type="tel" value={productName ? "+233 542 288 3496" : ""} readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700">Export License Number (FDA / GSA if available)</label>
                      <input type="text" value="" readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-500 outline-none cursor-not-allowed font-bold" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-100 opacity-50 pointer-events-none">
                    <div className="space-y-3">
                      <p className="text-[11px] font-black uppercase text-gray-400">Save as default exporter</p>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-[#535353] cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all translate-x-6" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-[11px] font-black uppercase text-gray-400">Add secondary warehouse location</p>
                      <div className="relative inline-block w-12 h-6 rounded-full bg-gray-200 cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2 Rendering */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Buyer Type<span className="text-red-500">*</span></label>
                      <select 
                        value={formData.buyerType}
                        onChange={(e) => setFormData({...formData, buyerType: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"
                      >
                        <option>Individual Buyer</option>
                        <option>Import Company</option>
                        <option>Distributor / Supermarket</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Company / Buyer Name<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.companyName}
                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Country of Destination<span className="text-red-500">*</span></label>
                      <select 
                        value={mapCountries.some(c => `${c.name} (${c.code})` === formData.destinationCountry) ? formData.destinationCountry : (formData.destinationCountry ? "Others" : "")}
                        onChange={(e) => setFormData({...formData, destinationCountry: e.target.value === "Others" ? "" : e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"
                      >
                        <option value="" disabled>Select a destination country...</option>
                        {mapCountries.map(country => (
                          <option key={country.code} value={`${country.name} (${country.code})`}>
                            {country.name} ({country.code})
                          </option>
                        ))}
                        <option value="Others">Others (Please Specify)</option>
                      </select>
                    </div>
                    {(!mapCountries.some(c => `${c.name} (${c.code})` === formData.destinationCountry) && formData.destinationCountry !== "") || formData.destinationCountry === "Others" ? (
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Specify Country<span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          placeholder="Enter country name" 
                          value={formData.destinationCountry === "Others" ? "" : formData.destinationCountry}
                          onChange={(e) => setFormData({...formData, destinationCountry: e.target.value})}
                          className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                        />
                      </div>
                    ) : null}
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">City<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700">Full Delivery Address<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.deliveryAddress}
                        onChange={(e) => setFormData({...formData, deliveryAddress: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">State / Region<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.stateRegion}
                        onChange={(e) => setFormData({...formData, stateRegion: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Postal / ZIP Code<span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Email<span className="text-red-500">*</span></label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Phone / WhatsApp<span className="text-red-500">*</span></label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700">Tax / Import ID (for customs clearance) <span className="text-gray-400 font-normal">(Optional)</span></label>
                      <input 
                        type="text" 
                        value={formData.taxId}
                        onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 Rendering */}
              {currentStep === 3 && (
                <div className="space-y-8 max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Product Type</label>
                      <input 
                        type="text" 
                        value={productDetails ? (
                          productDetails.category === "raw" ? "Raw Forest Honey" :
                          productDetails.category === "processed" ? "Processed Honey" :
                          productDetails.category === "organic" ? "Organic Certified Honey" :
                          productDetails.category === "wild" ? "Wild Honey" :
                          productDetails.category
                        ) : ""} 
                        readOnly 
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-700 font-bold outline-none cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Packaging Type</label>
                      <input 
                        type="text" 
                        value={productDetails ? (
                          productDetails.packagingType === "bottle" ? "Glass Bottles" :
                          productDetails.packagingType === "jerrycan" ? "Plastic Jerrycans" :
                          productDetails.packagingType === "bucket" ? "Food-grade Buckets" :
                          productDetails.packagingType === "drum" ? "Steel Drums" :
                          productDetails.packagingType === "container" ? "IBC Totes" :
                          productDetails.packagingType
                        ) : ""} 
                        readOnly 
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-700 font-bold outline-none cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Unit Measurement</label>
                      <input 
                        type="text" 
                        value={productDetails ? pkgInfo.name : ""}
                        readOnly 
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-700 font-bold outline-none cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Quantity Requested ({pkgInfo.name}s)<span className="text-red-500">*</span></label>
                      <input 
                        type="number" 
                        value={formData.quantityRequested}
                        onChange={(e) => setFormData({...formData, quantityRequested: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                        placeholder={`e.g. ${productDetails?.moqValue || 100}`}
                      />
                      {productDetails && formData.quantityRequested !== "" && (
                        Number(formData.quantityRequested) < Number(productDetails.moqValue) ? (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            Minimum order of {productDetails.moqValue} and above
                          </p>
                        ) : Number(formData.quantityRequested) > Number(productDetails.stockQuantity) ? (
                          <p className="text-red-500 text-xs font-bold mt-1">
                            Maximum available stock is {productDetails.stockQuantity}
                          </p>
                        ) : null
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Total Amount to Pay</label>
                      <div className="relative">
                        <input type="text" value={productDetails ? `GH₵ ${(pkgInfo.price * (Number(formData.quantityRequested) || 1)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""} readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-900 font-black outline-none cursor-not-allowed text-lg" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs">
                          {productDetails ? `(GH₵ ${pkgInfo.price.toLocaleString()} / ${pkgInfo.name})` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4 Rendering */}
              {currentStep === 4 && (
                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Shipping Type<span className="text-red-500">*</span></label>
                      <select 
                        value={formData.shippingType}
                        onChange={(e) => setFormData({...formData, shippingType: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"
                      >
                        <option>Sea Freight (Tema Port – Bulk Orders)</option>
                        <option>Air Cargo (Accra – Fast Delivery)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Delivery Type<span className="text-red-500">*</span></label>
                      <select 
                        value={formData.deliveryType}
                        onChange={(e) => setFormData({...formData, deliveryType: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"
                      >
                        <option>Door to Port</option>
                        <option>Door to Door</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-700">Pickup Option<span className="text-red-500">*</span></h3>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <button onClick={() => setFormData({...formData, pickupOption: "warehouse"})} className={`px-8 py-4 font-black text-xs uppercase tracking-widest rounded-sm transition-all flex-1 ${formData.pickupOption === "warehouse" ? "bg-[#535353] text-white" : "bg-white border border-gray-200 text-gray-700"}`}>Pick up from Warehouse (Ghana)</button>
                      <span className="text-gray-400 font-bold hidden sm:block">--or--</span>
                      <button onClick={() => setFormData({...formData, pickupOption: "terminal"})} className={`px-8 py-4 font-black text-xs uppercase tracking-widest rounded-sm transition-all flex-1 ${formData.pickupOption === "terminal" ? "bg-[#535353] text-white" : "bg-white border border-gray-200 text-gray-700"}`}>Drop off at Export Terminal</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Preferred Shipping Date<span className="text-red-500">*</span></label>
                      <input 
                        type="date" 
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Estimated Delivery Priority<span className="text-red-500">*</span></label>
                      <select 
                        value={formData.deliveryPriority}
                        onChange={(e) => setFormData({...formData, deliveryPriority: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"
                      >
                        <option>Standard (2–4 weeks)</option>
                        <option>Express (5–10 days)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 Rendering */}
              {currentStep === 5 && (
                <div className="space-y-8 max-w-4xl">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-700">Required Export Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 border border-green-200 bg-green-50 rounded-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.requiresFda}
                          onChange={(e) => setFormData({...formData, requiresFda: e.target.checked})}
                          className="w-5 h-5 text-[#535353] rounded" 
                        />
                        <span className="text-sm font-bold text-gray-700">FDA Certificate ✔</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-green-200 bg-green-50 rounded-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.requiresPhyto}
                          onChange={(e) => setFormData({...formData, requiresPhyto: e.target.checked})}
                          className="w-5 h-5 text-[#535353] rounded" 
                        />
                        <span className="text-sm font-bold text-gray-700">Phytosanitary Certificate ✔</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-200 bg-white hover:bg-gray-50 rounded-sm cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.requiresOrganic}
                          onChange={(e) => setFormData({...formData, requiresOrganic: e.target.checked})}
                          className="w-5 h-5 text-[#535353] rounded" 
                        />
                        <span className="text-sm font-bold text-gray-700">Organic Certification (if applicable)</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-200 bg-white hover:bg-gray-50 rounded-sm cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.requiresOrigin}
                          onChange={(e) => setFormData({...formData, requiresOrigin: e.target.checked})}
                          className="w-5 h-5 text-[#535353] rounded" 
                        />
                        <span className="text-sm font-bold text-gray-700">Certificate of Origin</span>
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Customs Declaration Value</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">GH₵</span>
                        <input 
                          type="text" 
                          value="Determined internally by Logistics" 
                          readOnly
                          className="w-full h-12 pl-12 pr-4 border border-gray-200 rounded-sm outline-none bg-gray-50 text-gray-500 cursor-not-allowed font-bold text-sm" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Import Country Requirements</label>
                      <textarea 
                        value="Handled by our internal export administration team."
                        readOnly
                        className="w-full h-24 p-4 border border-gray-200 rounded-sm outline-none resize-none bg-gray-50 text-gray-500 cursor-not-allowed font-bold text-sm pt-4" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6 Rendering */}
              {currentStep === 6 && (
                <div className="space-y-8 max-w-4xl">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Payment Method<span className="text-red-500">*</span></label>
                      <select 
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"
                      >
                        <option>Bank Transfer</option>
                        <option>International Wire (SWIFT)</option>
                        <option>Letter of Credit (LC)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Invoice Currency</label>
                      <input type="text" value="GH₵ (Ghana Cedi)" readOnly className="w-full h-12 px-4 border border-gray-200 rounded-sm bg-gray-50 text-gray-700 font-bold outline-none cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Deposit Required<span className="text-red-500">*</span></label>
                      <select 
                        value={formData.depositRequired}
                        onChange={(e) => setFormData({...formData, depositRequired: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none bg-[#f9f9f9]"
                      >
                        <option>70% Advance / 30% on Shipment</option>
                        <option>Full Payment</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">Billing Address <span className="text-gray-400 font-normal">(if different from buyer)</span></label>
                      <input 
                        type="text" 
                        value={formData.billingAddress}
                        onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
                        className="w-full h-12 px-4 border border-gray-200 rounded-sm focus:border-[#eea000] outline-none" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7 Rendering */}
              {currentStep === 7 && (
                <div className="space-y-12">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <h3 className="text-2xl font-black text-gray-900 uppercase">Final Review & Confirmation</h3>
                    <button onClick={() => setCurrentStep(1)} className="text-[11px] font-bold text-[#eea000] hover:underline uppercase tracking-widest">Edit Details</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc] rounded-sm shadow-sm">
                      <h4 className="text-[13px] font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 uppercase tracking-wide">Exporter Details (Ghana)</h4>
                      <div className="space-y-2 text-[13px] text-gray-600">
                        <p><span className="font-bold">Company:</span> Manono Manphis Export Materials Co., Ltd</p>
                        <p><span className="font-bold">Country:</span> Ghana</p>
                        <p><span className="font-bold">City:</span> {productLocation || "Accra"}</p>
                      </div>
                    </div>
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc] rounded-sm shadow-sm">
                      <h4 className="text-[13px] font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 uppercase tracking-wide">Buyer Details</h4>
                      <div className="space-y-2 text-[13px] text-gray-600">
                        <p><span className="font-bold">Company:</span> {formData.companyName || "[Auto Filled]"}</p>
                        <p><span className="font-bold">Destination:</span> {mapCountries.find(c => c.code === formData.destinationCountry)?.name || formData.destinationCountry} ({formData.destinationCountry})</p>
                      </div>
                    </div>
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc] rounded-sm shadow-sm">
                      <h4 className="text-[13px] font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 uppercase tracking-wide">Honey Product & Quantity</h4>
                      <div className="space-y-2 text-[13px] text-gray-600">
                        <p><span className="font-bold">Type:</span> {productDetails?.category === "raw" ? "Raw Forest Honey" : productDetails?.category || "Raw Forest Honey"}</p>
                        <p><span className="font-bold">Quantity:</span> {formData.quantityRequested} {pkgInfo.name}(s)</p>
                        <p><span className="font-bold">Price:</span> GH₵ {pkgInfo.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / {pkgInfo.name}</p>
                      </div>
                    </div>
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc] rounded-sm shadow-sm">
                      <h4 className="text-[13px] font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 uppercase tracking-wide">Packaging & Shipping</h4>
                      <div className="space-y-2 text-[13px] text-gray-600">
                        <p><span className="font-bold">Packaging:</span> {productDetails?.packagingType || "Plastic Drums"}</p>
                        <p><span className="font-bold">Method:</span> {formData.shippingType}</p>
                      </div>
                    </div>
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc] rounded-sm shadow-sm">
                      <h4 className="text-[13px] font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 uppercase tracking-wide">Total Estimated Cost</h4>
                      <div className="space-y-2 text-[13px] text-gray-600">
                        <p className="text-2xl font-black text-[#535353]">GH₵ {(pkgInfo.price * Number(formData.quantityRequested || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wider">Excluding Freight Charges</p>
                      </div>
                    </div>
                    <div className="border border-gray-100 p-6 bg-[#fcfcfc] rounded-sm shadow-sm">
                      <h4 className="text-[13px] font-black text-gray-900 mb-4 pb-2 border-b border-gray-100 uppercase tracking-wide">Documents Included</h4>
                      <div className="space-y-1 text-[13px] text-gray-600 font-bold">
                        {formData.requiresFda && <p className="text-[#535353]">✔ FDA Certificate</p>}
                        {formData.requiresPhyto && <p className="text-[#535353]">✔ Phytosanitary</p>}
                        {formData.requiresOrigin && <p className="text-[#535353]">✔ Certificate of Origin</p>}
                        {formData.requiresOrganic && <p className="text-[#535353]">✔ Organic Certification</p>}
                        {!formData.requiresFda && !formData.requiresPhyto && !formData.requiresOrigin && !formData.requiresOrganic && <p className="text-gray-400">None selected</p>}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-gray-100 space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.agreedToTerms1} onChange={(e) => setFormData({...formData, agreedToTerms1: e.target.checked})} className="w-5 h-5 text-[#535353] rounded mt-0.5" />
                      <span className="text-[13px] font-bold text-gray-700">I confirm this is an export order request</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.agreedToTerms2} onChange={(e) => setFormData({...formData, agreedToTerms2: e.target.checked})} className="w-5 h-5 text-[#535353] rounded mt-0.5" />
                      <span className="text-[13px] font-bold text-gray-700">I agree to customs and international shipping terms</span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={formData.agreedToTerms3} onChange={(e) => setFormData({...formData, agreedToTerms3: e.target.checked})} className="w-5 h-5 text-[#535353] rounded mt-0.5" />
                      <span className="text-[13px] font-bold text-gray-700">I understand final cost may vary based on freight charges</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-12 flex flex-wrap gap-4 pt-8 border-t border-gray-100 items-center">
                {currentStep > 1 && (
                  <button 
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="bg-[#535353] text-white px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-all shadow-lg shadow-gray-200"
                  >
                    Previous
                  </button>
                )}
                {currentStep < 7 ? (
                  <button 
                    onClick={handleContinue}
                    disabled={!productName || !validateStep(currentStep)}
                    className={`ml-auto px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg ${
                      (productName && validateStep(currentStep)) ? "bg-[#535353] text-white hover:opacity-90 shadow-gray-200" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmitOrder}
                    disabled={!productName || !formData.agreedToTerms1 || !formData.agreedToTerms2 || !formData.agreedToTerms3 || isSubmitting}
                    className={`ml-auto px-10 py-4 font-black text-sm uppercase tracking-widest rounded-sm transition-all shadow-lg ${
                      (productName && formData.agreedToTerms1 && formData.agreedToTerms2 && formData.agreedToTerms3 && !isSubmitting) ? "bg-[#1a1a1a] text-white hover:opacity-90 shadow-gray-200" : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Confirm & Submit Order"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      )}

      <WebsiteFooter />
    </div>
  );
}
