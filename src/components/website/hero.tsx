import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="container mx-auto px-4 relative z-10 text-center text-white">
        <h4 className="text-lg md:text-xl font-bold tracking-[0.3em] uppercase mb-4 animate-fade-in-up">
          WE ARE PROUD
        </h4>
        <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight animate-fade-in-up delay-100">
          TO BE ALWAYS <span className="text-[#eea000]">ON DEMAND</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-300 text-sm md:text-base leading-relaxed mb-10 animate-fade-in-up delay-200">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
        </p>
        
        <button className="bg-[#eea000] text-white px-10 py-4 font-bold text-sm tracking-widest hover:bg-white hover:text-[#1a1a1a] transition-all duration-300 rounded-sm shadow-xl animate-fade-in-up delay-300">
          CONTACT WITH US
        </button>
      </div>

      {/* Slider Controls */}
      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none">
        <button className="w-12 h-12 bg-white/10 hover:bg-[#eea000] text-white rounded-full flex items-center justify-center transition-all pointer-events-auto backdrop-blur-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="w-12 h-12 bg-white/10 hover:bg-[#eea000] text-white rounded-full flex items-center justify-center transition-all pointer-events-auto backdrop-blur-sm">
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Decorative lines/elements */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 mb-8">
        <div className="w-12 h-1 bg-[#eea000] rounded-full cursor-pointer" />
        <div className="w-12 h-1 bg-white/30 rounded-full cursor-pointer hover:bg-white/50 transition-colors" />
        <div className="w-12 h-1 bg-white/30 rounded-full cursor-pointer hover:bg-white/50 transition-colors" />
      </div>
    </section>
  );
}
