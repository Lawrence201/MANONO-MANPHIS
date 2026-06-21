"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { submitConstructionRequest } from "@/lib/actions/construction-request-actions";
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  X, 
  CheckCircle, 
  Briefcase, 
  MapPin, 
  Calendar, 
  FileText,
  User,
  Mail,
  Phone,
  MessageCircle
} from "lucide-react";

export default function ConstructionRequestClient() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  // Step 1: Overview
  const [serviceRequired, setServiceRequired] = useState("");
  const [otherService, setOtherService] = useState("");
  const [projectType, setProjectType] = useState("Residential");
  const [estimatedBudget, setEstimatedBudget] = useState("");

  const [projectDescription, setProjectDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [filePreviewUrls, setFilePreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 3: Location
  const [propertyAddress, setPropertyAddress] = useState("");
  const [cityRegion, setCityRegion] = useState("");
  const [preferredStartDate, setPreferredStartDate] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");

  // Step 4: Contact
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contactMethod, setContactMethod] = useState("Email");
  const [agreedTerms, setAgreedTerms] = useState(false);

  const handleNext = () => {
    // Basic validation before moving to next step
    if (currentStep === 1) {
      if (!serviceRequired || (serviceRequired === "Other" && !otherService.trim()) || !estimatedBudget) {
        alert("Please complete the required service and budget fields.");
        return;
      }
    } else if (currentStep === 2) {
      if (!projectDescription.trim()) {
        alert("Please provide a project description.");
        return;
      }
    } else if (currentStep === 3) {
      if (!propertyAddress.trim() || !cityRegion.trim() || !preferredStartDate) {
        alert("Please fill in the required location and date fields.");
        return;
      }
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files);
    const validFiles: File[] = [];
    const validUrls: string[] = [];

    let hasLargeFile = false;

    newFiles.forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        hasLargeFile = true;
      } else {
        validFiles.push(file);
        validUrls.push(URL.createObjectURL(file));
      }
    });

    if (hasLargeFile) {
      alert("Some files are too large. Maximum allowed size per file is 20MB.");
    }

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    setFilePreviewUrls((prev) => [...prev, ...validUrls]);

    if (e.target) {
      e.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setFilePreviewUrls((prev) => {
      const newUrls = [...prev];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      return newUrls;
    });
  };

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill in your contact details.");
      return;
    }
    if (!agreedTerms) {
      alert("You must agree to the Terms & Privacy policy.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("serviceRequired", serviceRequired);
      if (otherService) formData.append("otherService", otherService);
      formData.append("projectType", projectType);
      formData.append("estimatedBudget", estimatedBudget);
      formData.append("projectDescription", projectDescription);
      formData.append("propertyAddress", propertyAddress);
      formData.append("cityRegion", cityRegion);
      if (preferredStartDate) formData.append("preferredStartDate", preferredStartDate);
      if (projectDeadline) formData.append("projectDeadline", projectDeadline);
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("agreedTerms", agreedTerms.toString());

      selectedFiles.forEach((file) => {
        formData.append("media", file);
      });

      const result = await submitConstructionRequest(formData);

      if (result.success) {
        setReferenceId(result.referenceId || "");
        setCurrentStep(5);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert(result.error || "Failed to submit request.");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 lg:px-8 max-w-[1400px]">

      {/* Stepper Header (Moved to Top) */}
      {currentStep < 5 && (
        <div className="flex justify-between items-center mb-12 relative px-4 sm:px-20 max-w-[1000px] mx-auto mt-4">
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-gray-200 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-[10%] h-[2px] bg-[#FFD100] -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${((currentStep - 1) / 3) * 80}%` }}
          ></div>
          
          {[
            { step: 1, label: "Overview", icon: Briefcase },
            { step: 2, label: "Details", icon: FileText },
            { step: 3, label: "Location", icon: MapPin },
            { step: 4, label: "Contact", icon: User }
          ].map((s) => (
            <div key={s.step} className="relative z-10 flex flex-col items-center gap-2">
              <div 
                className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-[14px] md:text-[16px] transition-all duration-300 ${
                  currentStep >= s.step 
                    ? "bg-[#FFD100] text-[#1a1a1a] shadow-md border-2 border-[#1a1a1a]" 
                    : "bg-white text-gray-400 border-2 border-gray-200"
                }`}
              >
                <s.icon className={`w-4 h-4 md:w-5 md:h-5 ${currentStep >= s.step ? "text-[#1a1a1a]" : "text-gray-400"}`} />
              </div>
              <span className={`text-[11px] md:text-[13px] font-bold uppercase tracking-wider ${
                currentStep >= s.step ? "text-[#1a1a1a]" : "text-gray-400"
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col min-[1029px]:flex-row gap-12 min-[1029px]:gap-16 items-start">
        {/* LEFT COLUMN: FORM */}
        <div className="w-full min-[1029px]:w-[65%] xl:w-[70%] bg-transparent sm:bg-[#f6f6f6] p-0 sm:p-8 md:p-10 rounded-sm">
          {/* Header from Design */}
          <div className="mb-10">
            <h4 className="text-[11px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">Start Your Journey Today</h4>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1a1a1a] tracking-tight">Let's Talk Together</h2>
          </div>

      {/* Form Content */}
      <div className="bg-white border border-gray-200 rounded-sm p-5 sm:p-6 md:p-10 min-h-[550px]">
        
        {/* Loading Overlay */}
        {isSubmitting && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-[#FFD100] rounded-full animate-spin mb-6"></div>
            <h3 className="text-2xl font-black text-[#1a1a1a] uppercase tracking-tight">Processing Request</h3>
            <p className="text-gray-500 font-medium mt-2">Please wait while we securely submit your project details...</p>
          </div>
        )}

        {/* STEP 1 */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#1a1a1a] mb-8 -ml-2 md:-ml-4 uppercase tracking-tight">Project Overview</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Service Required *</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={serviceRequired}
                  onChange={(e) => setServiceRequired(e.target.value)}
                >
                  <option value="">Select a service...</option>
                  <option value="New Construction">New Construction</option>
                  <option value="Renovation & Remodeling">Renovation & Remodeling</option>
                  <option value="Roofing Services">Roofing Services</option>
                  <option value="Plumbing & Maintenance">Plumbing & Maintenance</option>
                  <option value="Painting & Finishing">Painting & Finishing</option>
                  <option value="Electrical Installations">Electrical Installations</option>
                  <option value="Landscaping">Landscaping</option>
                  <option value="Other">Other (Specify below)</option>
                </select>
                
                {serviceRequired === "Other" && (
                  <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <input 
                      type="text"
                      className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                      placeholder="Please specify the service you need..."
                      value={otherService}
                      onChange={(e) => setOtherService(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Project Type *</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["Residential", "Commercial", "Industrial"].map((type) => (
                    <div 
                      key={type}
                      onClick={() => setProjectType(type)}
                      className={`cursor-pointer border rounded-md p-4 flex items-center justify-center text-[15px] font-bold transition-all ${
                        projectType === type 
                          ? "bg-[#1a1a1a] text-white border-[#1a1a1a]" 
                          : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Estimated Budget *</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  value={estimatedBudget}
                  onChange={(e) => setEstimatedBudget(e.target.value)}
                >
                  <option value="">Select budget range...</option>
                  <option value="Under GH₵5,000">Under GH₵5,000</option>
                  <option value="GH₵5,000 - GH₵20,000">GH₵5,000 - GH₵20,000</option>
                  <option value="GH₵20,000 - GH₵50,000">GH₵20,000 - GH₵50,000</option>
                  <option value="GH₵50,000 - GH₵100,000">GH₵50,000 - GH₵100,000</option>
                  <option value="GH₵100,000+">GH₵100,000+</option>
                  <option value="To be discussed">To be discussed</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#1a1a1a] mb-8 -ml-2 md:-ml-4 uppercase tracking-tight">Project Details</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Project Description *</label>
                <p className="text-[13px] text-gray-500 mb-2">Please explain what needs to be done in detail.</p>
                <textarea 
                  className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all min-h-[150px] resize-y"
                  placeholder="E.g., We need a full kitchen remodel including new cabinets, plumbing repositioning, and floor tiling..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Upload Photos or Plans (Optional)</label>
                <p className="text-[13px] text-gray-500 mb-3">Attach architectural drawings, inspiration pictures, or photos of the current space.</p>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*,application/pdf"
                  multiple
                />

                <div className="space-y-4">
                  {selectedFiles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50 flex flex-col md:flex-row gap-4 relative">
                          <button 
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors z-10 shadow-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          
                          <div className="w-full md:w-24 aspect-video md:aspect-square shrink-0 bg-gray-200 rounded-md overflow-hidden relative border border-gray-200 flex items-center justify-center">
                            {file.type.startsWith('image/') && filePreviewUrls[index] ? (
                              <Image src={filePreviewUrls[index]} alt="Preview" fill className="object-cover" />
                            ) : (
                              <FileText className="w-8 h-8 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-center min-w-0">
                            <h4 className="text-[14px] font-bold text-[#1a1a1a] truncate pr-6">{file.name}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${selectedFiles.length > 0 ? "p-6" : "p-10"}`}
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5 text-[#1a1a1a]" />
                    </div>
                    <span className="text-[14px] font-bold text-[#1a1a1a]">
                      {selectedFiles.length > 0 ? "Add more files" : "Click to browse files"}
                    </span>
                    <span className="text-[12px] text-gray-500 mt-1">Supported: JPG, PNG, PDF (Max 20MB)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#1a1a1a] mb-8 -ml-2 md:-ml-4 uppercase tracking-tight">Location & Timing</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Property Address *</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  placeholder="Street address or plot location"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">City / Region *</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  placeholder="E.g., Accra, Greater Accra Region"
                  value={cityRegion}
                  onChange={(e) => setCityRegion(e.target.value)}
                />
              </div>

              <div className="min-w-0">
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Preferred Start Date *</label>
                <div className="relative min-w-0">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="date"
                    className="w-full min-w-0 appearance-none border border-gray-300 rounded-md py-4 pl-12 pr-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={preferredStartDate}
                    onChange={(e) => setPreferredStartDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Project Deadline (Optional)</label>
                <div className="relative min-w-0">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="date"
                    className="w-full min-w-0 appearance-none border border-gray-300 rounded-md py-4 pl-12 pr-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                    value={projectDeadline}
                    onChange={(e) => setProjectDeadline(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4 */}
        {currentStep === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#1a1a1a] mb-8 -ml-2 md:-ml-4 uppercase tracking-tight">Contact & Review</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Full Name *</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Email Address *</label>
                <input 
                  type="email"
                  className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Phone Number *</label>
                <PhoneInput
                  country={'gh'}
                  value={phone}
                  onChange={(phone: string) => setPhone(phone)}
                  inputStyle={{ width: '100%', height: '54px', fontSize: '16px', borderRadius: '0.375rem', borderColor: '#d1d5db' }}
                  buttonStyle={{ borderColor: '#d1d5db', borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem', backgroundColor: '#f9fafb' }}
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-2">Company Name (Optional)</label>
                <input 
                  type="text"
                  className="w-full border border-gray-300 rounded-md p-4 text-[16px] text-gray-700 bg-white focus:outline-none focus:border-[#1a1a1a] focus:ring-1 focus:ring-[#1a1a1a] transition-all"
                  placeholder="Your Company LLC"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[13px] font-bold text-[#1a1a1a] uppercase tracking-wider mb-3">Preferred Contact Method *</label>
              <div className="flex gap-6">
                {["Email", "Phone Call", "WhatsApp"].map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="contactMethod" 
                      value={method} 
                      checked={contactMethod === method}
                      onChange={(e) => setContactMethod(e.target.value)}
                      className="w-4 h-4 text-[#1a1a1a] focus:ring-[#1a1a1a] border-gray-300"
                    />
                    <span className="text-[16px] text-gray-700">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-6 mb-8">
              <h4 className="font-bold text-[#1a1a1a] mb-4 text-[15px]">Request Summary</h4>
              <div className="grid grid-cols-2 gap-y-3 text-[14px]">
                <span className="text-gray-500">Service:</span>
                <span className="font-bold text-[#1a1a1a]">{serviceRequired === "Other" ? otherService : serviceRequired}</span>
                <span className="text-gray-500">Project Type:</span>
                <span className="font-bold text-[#1a1a1a]">{projectType}</span>
                <span className="text-gray-500">Location:</span>
                <span className="font-bold text-[#1a1a1a]">{cityRegion}</span>
              </div>
            </div>

            <div className="flex items-start gap-3 mb-4">
              <input 
                type="checkbox" 
                id="terms"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 text-[#1a1a1a] focus:ring-[#1a1a1a] border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-[13px] text-gray-500 leading-relaxed cursor-pointer">
                I agree to the <Link href="/terms" className="text-[#1a1a1a] underline hover:text-[#FFD100]">Terms & Conditions</Link> and <Link href="/privacy" className="text-[#1a1a1a] underline hover:text-[#FFD100]">Privacy Policy</Link>. I understand that submitting this form does not bind me to a contract, but serves as a request for a quote or consultation.
              </label>
            </div>
          </div>
        )}

        {/* STEP 5: Success */}
        {currentStep === 5 && (
          <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-[#FFD100]/10 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-12 h-12 text-[#FFD100]" />
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black text-[#1a1a1a] mb-4 tracking-tight uppercase">Request Received!</h2>
            
            <p className="text-gray-500 text-[16px] max-w-[500px] leading-relaxed mb-8">
              Thank you for requesting a service quote. Our construction team will review your project details and get back to you within 24-48 business hours.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 w-full max-w-[400px] mb-10">
              <span className="block text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Tracking Reference</span>
              <span className="block text-2xl font-black text-[#1a1a1a] tracking-wider">{referenceId}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/services/construction"
                className="bg-[#FFD100] hover:bg-[#FFD100]/90 text-[#1a1a1a] px-8 py-4 font-bold text-[14px] uppercase tracking-wider rounded-sm transition-colors text-center"
              >
                Return to Services
              </Link>
              <Link 
                href="/"
                className="bg-white border-2 border-gray-200 hover:border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 font-bold text-[14px] uppercase tracking-wider rounded-sm transition-colors text-center"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        )}

      </div>

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mt-8">
              <button 
                onClick={handleBack}
                disabled={currentStep === 1 || isSubmitting}
                className={`flex items-center gap-2 px-6 py-3.5 font-bold text-[14px] uppercase tracking-wider rounded-sm transition-colors ${
                  currentStep === 1 || isSubmitting
                    ? "text-gray-300 cursor-not-allowed" 
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <ChevronLeft className="w-5 h-5" /> Back
              </button>

              {currentStep < 4 ? (
                <button 
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#FFD100] hover:bg-[#FFD100]/90 text-[#1a1a1a] px-8 py-3.5 font-bold text-[14px] uppercase tracking-wider rounded-sm transition-colors"
                >
                  Continue <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-[#2c2c2c] hover:bg-[#1a1a1a] text-white px-8 py-3.5 font-bold text-[14px] uppercase tracking-wider rounded-sm transition-colors"
                >
                  Submit Request <CheckCircle className="w-5 h-5 ml-1" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: CONTACT INFO */}
        <div className="w-full min-[1029px]:w-[35%] xl:w-[30%] bg-transparent sm:bg-[#f6f6f6] p-0 sm:p-8 md:p-10 rounded-sm grid grid-cols-1 sm:grid-cols-2 min-[1029px]:flex min-[1029px]:flex-col gap-6 sm:gap-10 mt-8 min-[1029px]:mt-0">
          
          <div className="flex items-center gap-4 sm:gap-5 border-0 pb-0 min-[1029px]:border-b min-[1029px]:border-gray-200 min-[1029px]:pb-8">
            <div className="w-12 h-12 min-[480px]:w-16 min-[480px]:h-16 bg-[#222222] rounded-md flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 min-[480px]:w-6 min-[480px]:h-6 text-[#FFD100]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[16px] min-[480px]:text-[18px] font-black text-[#1a1a1a] mb-1">Email Support</h3>
              <p className="text-[13px] min-[480px]:text-[14px] text-gray-500 font-medium">manonomanphis@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 border-0 pb-0 min-[1029px]:border-b min-[1029px]:border-gray-200 min-[1029px]:pb-8">
            <div className="w-12 h-12 min-[480px]:w-16 min-[480px]:h-16 bg-[#222222] rounded-md flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 min-[480px]:w-6 min-[480px]:h-6 text-[#FFD100]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[16px] min-[480px]:text-[18px] font-black text-[#1a1a1a] mb-1">Call Our Office</h3>
              <p className="text-[13px] min-[480px]:text-[14px] text-gray-500 font-medium">+233 542883496</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-5 border-0 pb-0 min-[1029px]:border-b min-[1029px]:border-gray-200 min-[1029px]:pb-8">
            <div className="w-12 h-12 min-[480px]:w-16 min-[480px]:h-16 bg-[#222222] rounded-md flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 min-[480px]:w-6 min-[480px]:h-6 text-[#FFD100]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[16px] min-[480px]:text-[18px] font-black text-[#1a1a1a] mb-1">Visit Our Office</h3>
              <p className="text-[13px] min-[480px]:text-[14px] text-gray-500 font-medium">Dansoman accra</p>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-12 h-12 min-[480px]:w-16 min-[480px]:h-16 bg-[#222222] rounded-md flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 min-[480px]:w-6 min-[480px]:h-6 text-[#FFD100]" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-[16px] min-[480px]:text-[18px] font-black text-[#1a1a1a] mb-1">WhatsApp Support</h3>
              <p className="text-[13px] min-[480px]:text-[14px] text-gray-500 font-medium">+233 542883496</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
