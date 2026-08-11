import { TopBar } from "@/components/website/top-bar";
import { WebsiteHeader } from "@/components/website/header";
import { WebsiteFooter } from "@/components/website/footer";
import { MapSection } from "@/components/website/map-section";
import { AdvancedContactForm } from "@/components/website/advanced-contact-form";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Contact Us - Manono Manphis",
  description: "Get in touch with Manono Manphis via phone, email, or our contact form.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white selection:bg-[#d11231] selection:text-white flex flex-col font-sans">
      <TopBar />
      <WebsiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-[#1a1a1a] pt-32 pb-24 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 bg-[url('/billboards/contact_us.jpg')] bg-cover bg-center bg-no-repeat opacity-50"></div>
          {/* Dark Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/90 via-[#1a1a1a]/60 to-[#1a1a1a]/90"></div>
          
          <div className="container mx-auto px-4 max-w-7xl relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
                <Link href="/" className="hover:text-[#eea000] transition-colors">Home</Link>
                <ChevronRight className="w-3 h-3" />
                <span className="text-[#eea000]">Contact Us</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-[-0.02em] leading-tight mb-6">
                Let's Talk <span className="text-[#eea000]">Business</span>
              </h1>
            </div>
          </div>
        </section>

        <AdvancedContactForm />
        
        <MapSection />
      </main>

      <WebsiteFooter />
    </div>
  );
}
