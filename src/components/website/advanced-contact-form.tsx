"use client";

import { useState } from "react";
import { Send, CheckCircle2, ArrowRight } from "lucide-react";
import { submitLead } from "@/lib/actions/lead-actions";
import { cn } from "@/lib/utils";

export function AdvancedContactForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [service, setService] = useState<"export" | "advertising" | "">("");

  // Form State
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    product: "",
    quantity: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    setLoading(true);
    const res = await submitLead({
      ...form,
      serviceType: service || "General Inquiry",
    });
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-12 text-center rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto my-20">
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-success" />
        </div>
        <h3 className="text-3xl font-black text-[#1a1a1a] uppercase tracking-tight mb-4">Request Received</h3>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Thank you for reaching out to Manono Manphis. Our trade specialists are reviewing your requirements and will contact you within 24 hours.
        </p>
        <button 
          onClick={() => { setSuccess(false); setService(""); setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "", product: "", quantity: "" }); }}
          className="bg-[#1a1a1a] text-white px-8 py-4 font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#eea000] transition-colors"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto my-16">
      
      {/* Service Selection */}
      <div className="mb-12">
        <label className="block text-[11px] font-black uppercase tracking-widest text-[#eea000] mb-4 text-center">Step 1: How can we help you?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => setService("export")}
            className={cn(
              "p-8 border-2 rounded-xl text-left transition-all",
              service === "export" ? "border-[#eea000] bg-[#eea000]/5 ring-4 ring-[#eea000]/10" : "border-gray-100 hover:border-gray-300"
            )}
          >
            <div className="text-xl font-black uppercase tracking-tight text-[#1a1a1a] mb-2">Agricultural Export</div>
            <p className="text-sm text-gray-500">Bulk sourcing of Honey, Cashew Nuts, Shea Butter, and other premium African commodities.</p>
          </button>
          
          <button
            type="button"
            onClick={() => setService("advertising")}
            className={cn(
              "p-8 border-2 rounded-xl text-left transition-all",
              service === "advertising" ? "border-[#eea000] bg-[#eea000]/5 ring-4 ring-[#eea000]/10" : "border-gray-100 hover:border-gray-300"
            )}
          >
            <div className="text-xl font-black uppercase tracking-tight text-[#1a1a1a] mb-2">Outdoor Advertising</div>
            <p className="text-sm text-gray-500">Premium LED billboards, static signage, and strategic out-of-home media placements across Ghana.</p>
          </button>
        </div>
      </div>

      <div className={cn("transition-all duration-500 overflow-hidden", service ? "opacity-100 h-auto" : "opacity-0 h-0 pointer-events-none")}>
        <div className="border-t border-gray-100 pt-10">
          <label className="block text-[11px] font-black uppercase tracking-widest text-[#eea000] mb-8 text-center">Step 2: Provide Details</label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Full Name *</label>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 focus:border-[#eea000] focus:ring-1 focus:ring-[#eea000] outline-none transition-all rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Email Address *</label>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 focus:border-[#eea000] focus:ring-1 focus:ring-[#eea000] outline-none transition-all rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 focus:border-[#eea000] outline-none transition-all rounded-md" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Company Name</label>
              <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 focus:border-[#eea000] outline-none transition-all rounded-md" />
            </div>
          </div>

          {/* Dynamic Fields */}
          {service === "export" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-[#fcf9f6] p-6 rounded-lg border border-[#eea000]/20">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Commodity of Interest</label>
                <select value={form.product} onChange={e => setForm({...form, product: e.target.value})} className="w-full bg-white border border-gray-200 px-4 py-3.5 focus:border-[#eea000] outline-none rounded-md">
                  <option value="">Select a product...</option>
                  <option value="Premium Honey">Premium Pure Honey</option>
                  <option value="Raw Cashew Nuts">Raw Cashew Nuts (RCN)</option>
                  <option value="Shea Butter">Unrefined Shea Butter</option>
                  <option value="Other">Other / Multiple</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Required Volume (e.g. 5,000 kg)</label>
                <input type="text" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="Estimated quantity" className="w-full bg-white border border-gray-200 px-4 py-3.5 focus:border-[#eea000] outline-none rounded-md" />
              </div>
            </div>
          )}

          {service === "advertising" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 bg-[#fcf9f6] p-6 rounded-lg border border-[#eea000]/20">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Campaign Type</label>
                <select value={form.product} onChange={e => setForm({...form, product: e.target.value})} className="w-full bg-white border border-gray-200 px-4 py-3.5 focus:border-[#eea000] outline-none rounded-md">
                  <option value="">Select campaign type...</option>
                  <option value="LED Billboard">Digital LED Billboard</option>
                  <option value="Static Billboard">Static Print Billboard</option>
                  <option value="Multi-Location">Multi-Location Campaign</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Campaign Duration</label>
                <input type="text" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="e.g. 3 Months" className="w-full bg-white border border-gray-200 px-4 py-3.5 focus:border-[#eea000] outline-none rounded-md" />
              </div>
            </div>
          )}

          <div className="space-y-2 mb-10">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#1a1a1a]">Additional Details</label>
            <textarea 
              rows={4} 
              value={form.message} 
              onChange={e => setForm({...form, message: e.target.value})}
              placeholder="Tell us more about your requirements, destination ports, or target audience..."
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3.5 focus:border-[#eea000] outline-none resize-none rounded-md"
            ></textarea>
          </div>

          <div className="text-center flex flex-col items-center">
            <button 
              disabled={loading}
              className="bg-[#1a1a1a] disabled:opacity-70 disabled:cursor-not-allowed text-white px-12 py-5 font-black text-[12px] uppercase tracking-[0.2em] hover:bg-[#eea000] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 w-full md:w-auto shadow-lg"
            >
              {loading ? "Submitting..." : (
                <>Submit Inquiry <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
            <p className="text-xs text-gray-400 mt-4 max-w-sm text-center">By submitting this form, you agree to our privacy policy. Your information is securely stored.</p>
          </div>
        </div>
      </div>
    </form>
  );
}
