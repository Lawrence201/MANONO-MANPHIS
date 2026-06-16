import Image from "next/image";
import { Headphones, Clock, Globe } from "lucide-react";

export function ConstructionContactSection() {
  return (
    <section className="relative w-full bg-[#fcfcfc] overflow-hidden pt-10 pb-20 lg:pt-0 lg:pb-32 max-[480px]:pt-4">
      {/* Subtle Map Pattern Background */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full opacity-[0.03] pointer-events-none z-0" style={{
        backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
        backgroundSize: '24px 24px'
      }}></div>

      {/* Left Image (touches bottom and left of section) - Desktop Only */}
      <div className="absolute left-0 bottom-0 lg:w-[38vw] xl:w-[35vw] lg:h-[85%] xl:h-[90%] overflow-hidden z-0 hidden lg:block">
        <Image 
          src="/construction/slider_1.jpg" 
          alt="Worker" 
          fill 
          className="object-cover" 
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex flex-col lg:flex-row relative z-10 pt-10 lg:pt-0">

        {/* Left Column (Image + Form) */}
        <div className="w-full lg:w-1/2 relative flex items-start lg:items-center mb-16 lg:mb-0 lg:min-h-[700px]">
          
          {/* Floating Form Box */}
          <div className="w-full max-[480px]:w-full lg:w-[480px] bg-[#313131] relative z-20 p-10 md:p-12 max-[480px]:p-6 shadow-2xl lg:ml-auto lg:mr-[20px] xl:mr-[60px] mt-10 lg:mt-0 xl:mt-8 lg:translate-y-20 xl:translate-y-28 mx-auto rounded-lg">
            <h3 className="text-white text-[28px] lg:text-[32px] font-bold mb-2 tracking-tight">Have Any Questions?</h3>
            <p className="text-gray-400 text-[13px] md:text-[14px] mb-8 font-medium">The point of using Lorem Ipsum is that it has more</p>
            
            <form className="flex flex-col gap-5">
              <input 
                type="text" 
                placeholder="Your name" 
                className="bg-[#404040] border-none px-6 py-5 text-[14px] text-white placeholder:text-gray-400 outline-none w-full rounded-md focus:ring-1 focus:ring-[#FFD100] transition-shadow" 
              />
              <div className="flex flex-col sm:flex-row gap-5">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-[#404040] border-none px-6 py-5 text-[14px] text-white placeholder:text-gray-400 outline-none w-full sm:w-1/2 rounded-md focus:ring-1 focus:ring-[#FFD100] transition-shadow" 
                />
                <input 
                  type="tel" 
                  placeholder="Your phone" 
                  className="bg-[#404040] border-none px-6 py-5 text-[14px] text-white placeholder:text-gray-400 outline-none w-full sm:w-1/2 rounded-md focus:ring-1 focus:ring-[#FFD100] transition-shadow" 
                />
              </div>
              <textarea 
                placeholder="Your message" 
                rows={5} 
                className="bg-[#404040] border-none px-6 py-5 text-[14px] text-white placeholder:text-gray-400 outline-none w-full resize-none rounded-md focus:ring-1 focus:ring-[#FFD100] transition-shadow"
              ></textarea>
              <button 
                type="submit" 
                className="bg-[#FFD100] text-black font-bold text-[15px] px-10 py-5 mt-2 w-fit max-[480px]:w-full lg:w-full xl:w-fit hover:bg-white transition-colors rounded-md text-center"
              >
                Submit Now
              </button>
            </form>
          </div>
      </div>

      {/* Right Column (Info) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center relative z-10 lg:pl-12 xl:pl-16">
        <div className="flex items-center gap-2 mb-4 max-[480px]:mb-3">
          <div className="w-1.5 h-1.5 max-[480px]:w-1 max-[480px]:h-1 rounded-full bg-[#FFD100]"></div>
          <span className="text-[12px] max-[480px]:text-[11px] font-bold text-gray-500 tracking-[0.2em] uppercase">LET'S WORK</span>
          <div className="w-1.5 h-1.5 max-[480px]:w-1 max-[480px]:h-1 rounded-full bg-[#FFD100]"></div>
        </div>
        
        <h2 className="text-4xl lg:text-[54px] max-[480px]:text-3xl font-black text-[#1a1a1a] mb-6 max-[480px]:mb-4 leading-[1.05] tracking-tight max-w-[450px]">
          Your Trusted Partner in Construction.
        </h2>
        
        <p className="text-gray-500 text-[15px] max-[480px]:text-[14px] leading-[1.8] max-[480px]:leading-[1.6] mb-12 max-[480px]:mb-8 max-w-[450px] font-medium">
          Crafting compelling digital experiences that captivate and drive meaningful connections, our digital agency combines innovation online success.
        </p>

        <div className="flex flex-col gap-6 max-[480px]:gap-4 relative z-20">
          {/* Contact Item 1 */}
          <div className="flex items-start gap-5 max-[480px]:gap-4">
            <div className="w-[60px] h-[60px] max-[480px]:w-[50px] max-[480px]:h-[50px] bg-[#313131] rounded-none flex items-center justify-center shrink-0 shadow-md">
              <Headphones className="w-6 h-6 max-[480px]:w-5 max-[480px]:h-5 text-[#FFD100]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center h-[60px] max-[480px]:h-[50px]">
              <h4 className="text-[#1a1a1a] text-[18px] max-[480px]:text-[16px] font-bold mb-1 max-[480px]:mb-0.5">Phone Number:</h4>
              <p className="text-gray-500 text-[14px] max-[480px]:text-[13px]">+88015569569</p>
            </div>
          </div>
          
          {/* Contact Item 2 */}
          <div className="flex items-start gap-5 max-[480px]:gap-4">
            <div className="w-[60px] h-[60px] max-[480px]:w-[50px] max-[480px]:h-[50px] bg-[#313131] rounded-none flex items-center justify-center shrink-0 shadow-md">
              <Clock className="w-6 h-6 max-[480px]:w-5 max-[480px]:h-5 text-[#FFD100]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center h-[60px] max-[480px]:h-[50px]">
              <h4 className="text-[#1a1a1a] text-[18px] max-[480px]:text-[16px] font-bold mb-1 max-[480px]:mb-0.5">Opening Hours:</h4>
              <p className="text-gray-500 text-[14px] max-[480px]:text-[13px]">Mon-Fri: 08:00 - 17:00 Sat-Sun: Closed</p>
            </div>
          </div>

          {/* Contact Item 3 */}
          <div className="flex items-start gap-5 max-[480px]:gap-4">
            <div className="w-[60px] h-[60px] max-[480px]:w-[50px] max-[480px]:h-[50px] bg-[#313131] rounded-none flex items-center justify-center shrink-0 shadow-md">
              <Globe className="w-6 h-6 max-[480px]:w-5 max-[480px]:h-5 text-[#FFD100]" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col justify-center h-[60px] max-[480px]:h-[50px]">
              <h4 className="text-[#1a1a1a] text-[18px] max-[480px]:text-[16px] font-bold mb-1 max-[480px]:mb-0.5">Office Location:</h4>
              <p className="text-gray-500 text-[14px] max-[480px]:text-[13px]">New Jesrsy, 1201, USA</p>
            </div>
          </div>
        </div>

        {/* Big Image for Mobile/Tablet */}
        <div className="w-full h-[400px] md:h-[500px] max-[480px]:h-[300px] relative mt-16 max-[480px]:mt-10 lg:hidden rounded-lg overflow-hidden shadow-2xl z-20">
          <Image 
            src="/construction/slider_1.jpg" 
            alt="Worker" 
            fill 
            className="object-cover" 
          />
        </div>
      </div>
      </div>

      {/* Yellow Caterpillar Image */}
      <div className="absolute right-[-50px] max-[480px]:right-[-20px] bottom-[-20px] max-[480px]:bottom-[-10px] w-[450px] md:w-[600px] lg:w-[750px] max-[480px]:w-[280px] h-[350px] md:h-[450px] lg:h-[500px] max-[480px]:h-[200px] pointer-events-none z-30 mix-blend-normal animate-drive-slow">
        <Image 
          src="/construction/van.png" 
          alt="Construction Loader" 
          fill 
          className="object-contain object-bottom object-right drop-shadow-2xl" 
        />
      </div>
    </section>
  );
}
