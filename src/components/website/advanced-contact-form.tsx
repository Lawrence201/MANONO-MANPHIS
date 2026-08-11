"use client";

import { useState } from "react";
import { Phone, MapPin, Mail, CheckCircle2 } from "lucide-react";
import { submitLead } from "@/lib/actions/lead-actions";

export function AdvancedContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setLoading(true);
    const res = await submitLead({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      serviceType: "Contact Form Submission",
      subject: "New Message from Contact Page"
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setForm({ name: "", phone: "", email: "", message: "" });
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight uppercase">
          CONTACT US
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Left Column: Form */}
        <div className="bg-[#fcf9f6] border border-gray-100 p-8 md:p-12 rounded-[4px]">
          <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] uppercase mb-8 tracking-tight">
            GET IN TOUCH
          </h2>
          
          {success ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-[24px] font-black text-[#1a1a1a] mb-2 uppercase">
                Message Sent
              </h3>
              <p className="text-gray-500 mb-6 text-[14px]">Thank you. We will get back to you shortly.</p>
              <button onClick={() => setSuccess(false)} className="text-[#eea000] font-black text-[12px] uppercase tracking-widest hover:underline">
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] md:text-[12px] font-black text-[#1a1a1a] uppercase tracking-widest">Name</label>
                  <input required type="text" placeholder="Enter your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-white border border-gray-200/60 px-4 py-3.5 focus:outline-none focus:border-[#eea000] rounded-[4px] transition-colors placeholder:text-gray-400 text-[14px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] md:text-[12px] font-black text-[#1a1a1a] uppercase tracking-widest">Phone Number</label>
                  <input type="tel" placeholder="Enter your phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-white border border-gray-200/60 px-4 py-3.5 focus:outline-none focus:border-[#eea000] rounded-[4px] transition-colors placeholder:text-gray-400 text-[14px]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] md:text-[12px] font-black text-[#1a1a1a] uppercase tracking-widest">Email</label>
                <input required type="email" placeholder="Enter your email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-white border border-gray-200/60 px-4 py-3.5 focus:outline-none focus:border-[#eea000] rounded-[4px] transition-colors placeholder:text-gray-400 text-[14px]" />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] md:text-[12px] font-black text-[#1a1a1a] uppercase tracking-widest">Your Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full bg-white border border-gray-200/60 px-4 py-3.5 focus:outline-none focus:border-[#eea000] resize-none rounded-[4px] transition-colors text-[14px]"></textarea>
              </div>

              <button 
                disabled={loading}
                className="bg-[#eea000] disabled:opacity-70 text-white px-10 py-4 font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-[#1a1a1a] transition-colors rounded-[4px] shadow-sm w-full md:w-auto"
              >
                {loading ? "SENDING..." : "SEND MESSAGE"}
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Contact Info & Hours */}
        <div className="space-y-8 flex flex-col">
          {/* Contact Information */}
          <div className="bg-[#fcf9f6] border border-gray-100 p-8 md:p-12 rounded-[4px] flex-1">
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] uppercase mb-10 tracking-tight">
              CONTACT INFORMATION
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-4">
              <div className="flex gap-4">
                <div className="w-6 h-6 shrink-0 mt-0.5">
                  <Phone strokeWidth={1.5} className="w-6 h-6 text-[#eea000]" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest mb-2">Phone</h3>
                  <p className="text-gray-500 text-[13px] font-bold leading-relaxed">+233 54 288 3496<br/>+233 55 860 0605<br/>+233 59 450 0059</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-6 h-6 shrink-0 mt-0.5">
                  <MapPin strokeWidth={1.5} className="w-6 h-6 text-[#eea000]" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest mb-2">Address</h3>
                  <p className="text-gray-500 text-[13px] leading-relaxed">42 Adote nwenmeete road<br/>dansoman</p>
                </div>
              </div>

              <div className="flex gap-4 md:col-span-2">
                <div className="w-6 h-6 shrink-0 mt-0.5">
                  <Mail strokeWidth={1.5} className="w-6 h-6 text-[#eea000]" />
                </div>
                <div>
                  <h3 className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest mb-2">Email</h3>
                  <p className="text-gray-500 text-[13px] font-bold">manono@manonomanphis.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Business Hours */}
          <div className="bg-[#fcf9f6] border border-gray-100 p-8 md:p-12 rounded-[4px]">
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a] uppercase mb-10 tracking-tight">
              BUSINESS HOURS
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
                <h3 className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest mb-2">Monday - Friday</h3>
                <p className="text-gray-500 text-[13px]">9:00 am - 8:00 pm</p>
              </div>
              <div className="border-b sm:border-b-0 sm:border-r border-gray-200 pb-4 sm:pb-0 sm:pr-4">
                <h3 className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest mb-2">Saturday</h3>
                <p className="text-gray-500 text-[13px]">9:00 am - 6:00 pm</p>
              </div>
              <div>
                <h3 className="text-[10px] font-black text-[#1a1a1a] uppercase tracking-widest mb-2">Sunday</h3>
                <p className="text-gray-500 text-[13px]">9:00 am - 5:00 pm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
