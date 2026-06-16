import Image from "next/image";

export function ConstructionMarquee() {
  return (
    <div className="w-full bg-[#fed403] py-5 md:py-6 max-[480px]:py-3 overflow-hidden flex items-center shadow-inner">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marqueeTextRight {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animate-marqueeTextRight {
          display: flex;
          white-space: nowrap;
          animation: marqueeTextRight 30s linear infinite;
        }
      `}} />
      <div className="animate-marqueeTextRight text-[#1a1a1a] font-black text-lg md:text-xl max-[480px]:text-sm tracking-widest uppercase">
        {/* Render 4 sets to ensure seamless loop on all screen sizes */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            <span className="mx-6 md:mx-8 max-[480px]:mx-4">Construction</span>
            <div className="mx-6 md:mx-8 max-[480px]:mx-4 w-6 h-6 md:w-8 md:h-8 max-[480px]:w-4 max-[480px]:h-4 relative shrink-0">
              <Image src="/construction/astertics.png" alt="*" fill className="object-contain" />
            </div>
            <span className="mx-6 md:mx-8 max-[480px]:mx-4">Building</span>
            <div className="mx-6 md:mx-8 max-[480px]:mx-4 w-6 h-6 md:w-8 md:h-8 max-[480px]:w-4 max-[480px]:h-4 relative shrink-0">
              <Image src="/construction/astertics.png" alt="*" fill className="object-contain" />
            </div>
            <span className="mx-6 md:mx-8 max-[480px]:mx-4">Renovation</span>
            <div className="mx-6 md:mx-8 max-[480px]:mx-4 w-6 h-6 md:w-8 md:h-8 max-[480px]:w-4 max-[480px]:h-4 relative shrink-0">
              <Image src="/construction/astertics.png" alt="*" fill className="object-contain" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
