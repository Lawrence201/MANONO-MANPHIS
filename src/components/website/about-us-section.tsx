import Image from "next/image";
import Link from "next/link";

export function AboutUsSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-[#2d2d2d]">
      {/* Large Honeycomb Pattern Background */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='112' height='194' viewBox='0 0 112 194'%3E%3Cpath d='M56 128L0 96L0 32L56 0L112 32L112 96L56 128L56 192' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '112px 194px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-24 mb-[-40px] md:mb-[-40px] relative z-20">
          
          {/* Vertical Image */}
          <div className="w-full md:w-[420px] aspect-[1/1] md:aspect-[3/4.5] relative shadow-2xl border-[8px] md:border-[12px] border-[#2d2d2d] md:ml-12">
            <Image 
              src="/uploads/about_us.webp" 
              alt="Manono Manphis Business" 
              fill
              className="object-cover"
            />
          </div>

          {/* About Us Content */}
          <div className="text-center md:text-left relative pt-0 pb-12 flex-1 flex flex-col justify-start md:mt-[-20px] px-2 md:px-0 max-w-3xl mx-auto md:mx-0">
            <p className="text-[#eea000] font-bold tracking-[0.2em] text-[14px] md:text-[16px] uppercase mb-4 md:mb-6 text-center md:text-left">About Us</p>
            <div className="space-y-4 md:space-y-6 text-gray-300 text-[16px] min-[480px]:text-[17px] md:text-[19px] leading-relaxed text-left">
              <p>
                <strong className="text-white text-[19px] md:text-[22px] block mb-2">Manono Manphis is a trusted export company based in Ghana,</strong> 
                specializing in the supply of high-quality agricultural commodities including honey, cashew nuts, and shea butter. We connect local production with global markets through a structured and reliable trade process.
              </p>
              <p className="opacity-90">
                Our focus is on delivering consistent quality, transparent transactions, and efficient logistics that meet international standards. We work closely with buyers across different regions to ensure smooth sourcing, processing, and delivery of bulk orders.
              </p>
              <p className="opacity-90">
                In addition to our export operations, we also offer digital billboard advertising services, allowing businesses to promote their products through high-impact video displays. Clients can easily book advertising slots and showcase their brands to a wider audience through our modern outdoor media platforms.
              </p>
              <p className="opacity-90">
                At Manono Manphis, we are committed to creating value across both trade and media by combining reliability, visibility, and professional service delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col-reverse md:flex-row bg-white shadow-2xl overflow-hidden relative z-10 mx-auto max-w-7xl">
          {/* Left Content (White) */}
          <div className="flex-[1.5] p-10 md:p-14 flex flex-col justify-center items-center text-center bg-white relative min-w-full md:min-w-[350px] min-h-[380px] md:min-h-[480px]">
            <h3 className="text-2xl md:text-3xl font-black text-[#1a1a1a] leading-tight mb-4 uppercase" style={{fontFamily: "'Plus Jakarta Sans', sans-serif"}}>
              Reliable <br />
              Bulk Export <br />
              <span className="text-[#eea000]">from Ghana</span>
            </h3>
            
            <p className="text-gray-500 text-[13px] md:text-[14px] leading-relaxed mb-8 max-w-[280px] mx-auto font-medium">
              Quality products. Trusted supply. Global delivery.
            </p>
            
            <Link 
              href="#" 
              className="inline-block bg-[#eea000] text-[#1a1a1a] px-10 py-4 rounded-full font-bold text-[11px] tracking-[0.1em] uppercase hover:bg-[#1a1a1a] hover:text-white transition-all shadow-sm"
            >
              Know More
            </Link>
            
            {/* Small honeycomb accent bottom right of white section */}
            <div className="absolute bottom-0 right-0 w-20 h-20 md:w-24 md:h-24 pointer-events-none">
               <Image src="/hero_img.webp" alt="" fill className="object-cover opacity-90" style={{clipPath: 'polygon(100% 100%, 100% 0, 0 100%)'}} />
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-[2.5] relative min-h-[300px] md:min-h-[480px]">
            <Image 
              src="/about_honey_horizontal.png" 
              alt="Natural Honeycomb" 
              fill
              className="object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
