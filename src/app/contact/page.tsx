import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { MapSection } from "@/components/website/map-section";
import { AdvancedContactForm } from "@/components/website/advanced-contact-form";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f7f3f0] selection:bg-[#eea000] selection:text-white flex flex-col">
      <TopBar />
      <WebsiteHeader />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-[#1a1a1a] pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">Let's Talk <span className="text-[#eea000]">Business</span></h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Whether you need premium African commodities for export or strategic outdoor advertising in Ghana, our team is ready to deliver.
            </p>
          </div>
        </section>

        {/* Quick Contact Info */}
        <section className="relative z-20 -mt-10 mb-8 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-[#fcf9f6] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#eea000]" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Call Us Directly</div>
                  <div className="font-bold text-[#1a1a1a]">+233 24 123 4567</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-[#fcf9f6] rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-[#eea000]" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Email Support</div>
                  <div className="font-bold text-[#1a1a1a]">trade@manonomanphis.com</div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-center gap-4 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-[#fcf9f6] rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#eea000]" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Head Office</div>
                  <div className="font-bold text-[#1a1a1a]">Accra, Ghana</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="px-4">
          <AdvancedContactForm />
        </section>

        {/* Map */}
        <MapSection />
      </main>

      <WebsiteFooter />
    </div>
  );
}
