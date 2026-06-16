import { TopBar } from "@/components/website/top-bar";
import { ConstructionNav } from "@/components/website/construction-nav";
import { WebsiteFooter } from "@/components/website/footer";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function AllProjectsPage() {
  return (
    <div className="min-h-screen relative font-sans selection:bg-[#FFC700] selection:text-black bg-[#fcfcfc]">
      {/* Top Bar */}
      <TopBar />
      
      {/* Navigation Bar */}
      <ConstructionNav />

      {/* Page Header / Hero */}
      <div className="relative pt-[160px] md:pt-[200px] pb-24 md:pb-32 bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/construction/slider_1.jpg" 
            alt="Projects Hero" 
            fill 
            className="object-cover"
            priority
          />
          {/* Overlay to darken image */}
          <div className="absolute inset-0 bg-black/70"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 mb-4 text-[13px] md:text-[15px] font-medium">
            <Link href="/" className="text-white hover:text-[#FFD100] transition-colors">Home</Link>
            <span className="text-white text-[10px]">≫</span>
            <span className="text-[#FFD100]">Projects</span>
          </div>

          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
            Projects
          </h1>
          
          {/* Custom Divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="h-[1px] w-20 md:w-32 bg-white/30"></div>
            <div className="h-[3px] w-16 bg-[#FFD100]"></div>
            <div className="h-[1px] w-20 md:w-32 bg-white/30"></div>
          </div>

          {/* Subtitle */}
          <p className="text-white/90 text-[15px] md:text-[17px] max-w-2xl mx-auto leading-relaxed">
            Construction is the process of planning, designing, and building infrastructure such as residential homes, commercial and industrial facilities.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 py-24 bg-[#fcfcfc]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {[
            {
              id: 1,
              title: "Oceanview Residences",
              image: "/construction/project_6.jpg",
              desc: "This project reflects our commitment to quality construction, efficient project management, and sustainable building practices."
            },
            {
              id: 2,
              title: "Shapla Housing",
              image: "/construction/product_1.jpg",
              desc: "This project reflects our commitment to quality construction, efficient project management, and sustainable building practices."
            },
            {
              id: 3,
              title: "Integrity Build",
              image: "/construction/project_2.jpg",
              desc: "This project reflects our commitment to quality construction, efficient project management, and sustainable building practices."
            },
            {
              id: 4,
              title: "Modern Villa",
              image: "/construction/project_3.jpg",
              desc: "This project reflects our commitment to quality construction, efficient project management, and sustainable building practices."
            },
            {
              id: 5,
              title: "Skyline Tower",
              image: "/construction/project_4.jpg",
              desc: "This project reflects our commitment to quality construction, efficient project management, and sustainable building practices."
            },
            {
              id: 6,
              title: "Urban Oasis",
              image: "/construction/project_5.jpg",
              desc: "This project reflects our commitment to quality construction, efficient project management, and sustainable building practices."
            }
          ].map((project) => (
            <div key={project.id} className="group relative rounded-md overflow-hidden bg-[#f9f9f9] transition-all duration-500 shadow-sm hover:shadow-md">
              {/* Image Container */}
              <div className="relative h-[300px] md:h-[340px] group-hover:h-[250px] md:group-hover:h-[290px] w-full overflow-hidden transition-all duration-300 ease-in-out">
                <Image 
                  src={project.image} 
                  alt={project.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>
              
              {/* Content Container */}
              <div className="p-6 md:p-8 relative bg-[#f9f9f9] group-hover:bg-[#FFD100] flex flex-col h-[180px] group-hover:h-[230px] transition-all duration-300 ease-in-out">
                <h3 className="text-[20px] md:text-[22px] font-semibold text-[#1a1a1a] mb-4 tracking-tight">{project.title}</h3>
                
                <div className="flex-grow relative">
                  {/* Custom Divider - visible on non-hover */}
                  <div className="absolute inset-0 flex items-start transition-opacity duration-300 opacity-100 group-hover:opacity-0 pt-2">
                    <div className="h-[1px] w-10 bg-gray-500"></div>
                    <div className="h-[1px] w-12 bg-gray-300"></div>
                  </div>
                  
                  {/* Description - visible on hover */}
                  <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <p className="text-[#1a1a1a]/80 text-[13px] md:text-[14px] leading-relaxed line-clamp-3">
                      {project.desc}
                    </p>
                  </div>
                </div>

                {/* View Details Link */}
                <Link href="/services/construction/project-details" className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gray-500 group-hover:text-[#1a1a1a] transition-colors duration-300 mt-auto">
                  View Details 
                  <ArrowUpRight className="w-[18px] h-[18px]" strokeWidth={2} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Footer */}
      <WebsiteFooter />
    </div>
  );
}
