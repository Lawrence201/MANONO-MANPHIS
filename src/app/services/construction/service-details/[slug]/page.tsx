import { TopBar } from "@/components/website/top-bar";
import { ConstructionNav } from "@/components/website/construction-nav";
import { WebsiteFooter } from "@/components/website/footer";
import Link from "next/link";
import Image from "next/image";
import { ChevronsRight, Award, Briefcase, UserCheck, ChevronRight } from "lucide-react";
import { ConstructionContactSection } from "@/components/website/construction-contact-section";
import { getConstructionServiceBySlug } from "@/lib/actions/construction-actions";
import { notFound } from "next/navigation";

// Helper component to render Lucide icons dynamically
function DynamicIcon({ name, className }: { name: string, className?: string }) {
  const icons: Record<string, any> = { Award, Briefcase, UserCheck };
  const Icon = icons[name] || Award;
  return <Icon className={className} strokeWidth={1.5} />;
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const result = await getConstructionServiceBySlug(resolvedParams.slug);
  
  if (!result.success || !result.service) {
    notFound();
  }
  
  const service = result.service;
  
  // Extract images
  const galleryImages = service.galleryImages?.map((img: any) => img.imagePath) || [];
  const image1 = galleryImages[0] || "/construction/image_1.jpg";
  const image2 = galleryImages[1] || "/construction/image.jpg";

  // Parse sub-services
  const subServices = Array.isArray(service.subServices) 
    ? service.subServices 
    : [
        { title: "Quality Workmanship", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Award" },
        { title: "Project Management", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "Briefcase" },
        { title: "Certified Professionals", description: "Provide our people with a meaningful experience that helps and guide growth.", iconName: "UserCheck" }
      ];

  return (
    <div className="min-h-screen relative font-sans selection:bg-[#FFC700] selection:text-black bg-[#fcfcfc]">
      {/* Top Bar */}
      <TopBar />
      
      {/* Navigation Bar */}
      <ConstructionNav />

      {/* Header / Hero */}
      <div className="relative pt-[160px] md:pt-[200px] pb-32 bg-[#1a1a1a] flex flex-col items-center justify-center min-h-[450px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src={service.heroImage || "/construction/slider_1.jpg"} 
            alt="Service Details Hero" 
            fill 
            className="object-cover"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/80"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          
          {/* Breadcrumbs */}
          <div className="flex items-center justify-center gap-2 text-[14px] font-medium mb-4">
            <Link href="/" className="text-white hover:text-[#FFC700] transition-colors font-bold">Home</Link>
            <ChevronsRight className="w-4 h-4 text-white" />
            <Link href="/services/construction/services" className="text-white hover:text-[#FFC700] transition-colors font-bold">Services</Link>
            <ChevronsRight className="w-4 h-4 text-white" />
            <span className="text-gray-400">{service.title}</span>
          </div>

          {/* Title */}
          <h1 className="text-[48px] md:text-[64px] lg:text-[72px] font-bold text-white tracking-tight mb-8">
            {service.title}
          </h1>

          {/* Divider Line with Yellow Center */}
          <div className="w-full max-w-[500px] relative h-px bg-gray-600/50">
             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[3px] bg-[#FFC700]"></div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="py-20 md:py-32 max-[480px]:py-10 bg-white relative">
        <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-[1400px] relative">
          
          {/* Main Image Section */}
          <div className="relative w-full mb-16 max-[480px]:mb-8 flex items-center justify-center">
            <div className="relative w-full h-[280px] md:h-[450px] lg:h-[500px] max-[480px]:h-[200px] rounded-[6px] overflow-hidden">
              <Image 
                src={service.mainImage || "/construction/details.jpg"} 
                alt={service.title} 
                fill 
                className="object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="mt-16 md:mt-24 max-[480px]:mt-8 w-full">
            <h2 className="text-[32px] md:text-[40px] lg:text-[46px] max-[480px]:text-[26px] font-bold text-[#1a1a1a] mb-6 max-[480px]:mb-4 tracking-tight">
              {service.accomplishedTitle || "What We've Accomplished Together"}
            </h2>
            
            <p className="text-[16px] md:text-[18px] max-[480px]:text-[14px] text-gray-500 leading-relaxed mb-10 max-[480px]:mb-6 whitespace-pre-line">
              {service.accomplishedDescription}
            </p>

            {service.accomplishedQuote && (
              <p className="text-[20px] md:text-[24px] max-[480px]:text-[16px] text-[#1a1a1a] font-medium italic leading-relaxed mb-12 max-[480px]:mb-8">
                {service.accomplishedQuote}
              </p>
            )}

            <hr className="border-t border-gray-200 mb-12 max-[480px]:mb-8" />

            <h2 className="text-[32px] md:text-[40px] lg:text-[46px] max-[480px]:text-[26px] font-bold text-[#1a1a1a] mb-6 max-[480px]:mb-4 tracking-tight">
              {service.overviewTitle || "Services Overview"}
            </h2>

            <p className="text-[16px] md:text-[18px] max-[480px]:text-[14px] text-gray-500 leading-relaxed mb-12 max-[480px]:mb-8 whitespace-pre-line">
              {service.overviewDescription}
            </p>

            {/* 3 Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-[480px]:gap-6">
              {subServices.map((sub: any, i: number) => (
                <div key={i} className="flex gap-4">
                  <div className="w-[60px] h-[60px] max-[480px]:w-[50px] max-[480px]:h-[50px] rounded-md bg-[#262626] flex items-center justify-center shrink-0">
                    <DynamicIcon name={sub.iconName} className="w-8 h-8 max-[480px]:w-6 max-[480px]:h-6 text-[#FFC700]" />
                  </div>
                  <div>
                    <h4 className="text-[18px] max-[480px]:text-[16px] font-bold text-[#1a1a1a] mb-2 tracking-tight">{sub.title}</h4>
                    <p className="text-[14px] max-[480px]:text-[13px] text-gray-500 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <hr className="border-t border-gray-200 mt-12 max-[480px]:mt-8" />

            {/* Images Section */}
            <div className="mt-16 md:mt-24 max-[480px]:mt-8 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                <Image src={image1} alt="Construction detail" width={800} height={450} className="w-full h-auto rounded-[4px] object-cover aspect-[4/3] md:aspect-[16/9]" />
                <div className="relative">
                  <Image src={image2} alt="Construction detail site" width={800} height={450} className="w-full h-auto rounded-[4px] object-cover aspect-[4/3] md:aspect-[16/9]" />
                  {/* Outline Circle with Yellow Dot */}
                  <div className="hidden lg:flex absolute -bottom-4 right-12 w-8 h-8 rounded-full border border-gray-300 items-center justify-center bg-white z-10">
                    <div className="w-1 h-1 rounded-full bg-[#FFC700]"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-16 max-[480px]:mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 max-[480px]:gap-10">
              {/* Highlight Features */}
              <div>
                <h3 className="text-[22px] md:text-[26px] max-[480px]:text-[20px] font-bold text-[#1a1a1a] mb-6 max-[480px]:mb-4 tracking-tight">
                  Highlight Features
                </h3>
                <ul className="space-y-6 max-[480px]:space-y-4">
                  {service.highlightFeatures?.map((hf: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2"></span>
                      <p className="text-[14px] md:text-[15px] text-gray-500 leading-[1.8] font-medium">
                        {hf}
                      </p>
                    </li>
                  ))}
                  {(!service.highlightFeatures || service.highlightFeatures.length === 0) && (
                    <p className="text-[14px] text-gray-500 italic">No highlight features listed.</p>
                  )}
                </ul>
              </div>

              {/* The Results */}
              <div>
                <h3 className="text-[22px] md:text-[26px] max-[480px]:text-[20px] font-bold text-[#1a1a1a] mb-6 max-[480px]:mb-4 tracking-tight">
                  The Results
                </h3>
                <ul className="space-y-6 max-[480px]:space-y-4">
                  {service.theResults?.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0 mt-2"></span>
                      <p className="text-[14px] md:text-[15px] text-gray-500 leading-[1.8] font-medium">
                        {r}
                      </p>
                    </li>
                  ))}
                  {(!service.theResults || service.theResults.length === 0) && (
                    <p className="text-[14px] text-gray-500 italic">No results listed.</p>
                  )}
                </ul>
              </div>
            </div>

            {/* Navigation Line */}
            <div className="mt-20 max-[480px]:mt-12 w-full relative">
              <div className="border-t border-[#e3e3e8]"></div>
              {/* Vertical Center Line */}
              <div className="hidden md:block absolute left-1/2 top-0 w-px h-24 bg-[#e3e3e8]"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-end py-10 max-[480px]:py-6">
                <Link href="/services/construction/services" className="flex items-center gap-4 max-[480px]:gap-3 group justify-end">
                  <span className="text-[16px] md:text-[18px] max-[480px]:text-[15px] font-bold text-[#1a1a1a]">View All Services</span>
                  <div className="w-12 h-12 max-[480px]:w-10 max-[480px]:h-10 rounded-full border border-[#e3e3e8] flex items-center justify-center text-gray-400 group-hover:border-[#1a1a1a] group-hover:text-[#1a1a1a] transition-colors flex-shrink-0">
                    <ChevronRight size={18} className="max-[480px]:w-4 max-[480px]:h-4" />
                  </div>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>

      <ConstructionContactSection />

      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
}
