import { TopBar } from "@/components/website/top-bar";
import { WebsiteFooter } from "@/components/website/footer";
import { ConstructionNav } from "@/components/website/construction-nav";
import ConstructionRequestClient from "./ConstructionRequestClient";
import { MapSection } from "@/components/website/map-section";
import Image from "next/image";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";
export default function ConstructionRequestPage() {
  return (
    <div className="min-h-screen relative font-sans bg-[#ffffff] selection:bg-[#FFD100] selection:text-black">
      <TopBar />
      <ConstructionNav />
      
      {/* Hero Section */}
      <div className="relative pt-[160px] md:pt-[200px] pb-32 bg-[#1a1a1a] flex flex-col items-center justify-center min-h-[450px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/construction/hero.png" 
            alt="Service Request Background" 
            fill 
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/80"></div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-[14px] font-medium mb-4">
            <Link href="/" className="text-white hover:text-[#FFC700] transition-colors font-bold">Home</Link>
            <ChevronsRight className="w-4 h-4 text-white" />
            <span className="text-gray-400">Service Request</span>
          </div>

          {/* Title */}
          <h1 className="text-[48px] md:text-[64px] lg:text-[72px] font-bold text-white tracking-tight mb-8">
            Service Request
          </h1>
          
          {/* Divider Line with Yellow Center */}
          <div className="w-full max-w-[500px] relative h-px bg-gray-600/50 mb-8">
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[3px] bg-[#FFC700]"></div>
          </div>

          {/* Paragraph */}
          <div className="relative inline-block max-w-[700px]">
            <p className="text-[15px] max-[480px]:text-[14px] min-[1028px]:text-[16px] text-gray-300 leading-relaxed font-medium">
              Construction is the process of planning, designing, and building infrastructure<br className="hidden min-[1028px]:block" />
              such as residential homes, commercial and industrial facilities.
            </p>
          </div>
        </div>
      </div>

      <main className="pt-12 pb-12">
        <ConstructionRequestClient />
      </main>

      <MapSection />
      <WebsiteFooter />
    </div>
  );
}
