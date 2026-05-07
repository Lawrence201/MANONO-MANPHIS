export function NewsletterBanner() {
  return (
    <section className="bg-[#eea000] py-8 md:py-10 mt-10 md:mt-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 md:gap-10">
          
          {/* Text Content */}
          <div className="text-left">
            <h2 className="text-[28px] md:text-[36px] font-black text-white mb-1 md:mb-2 leading-[1.1] tracking-tight">
              Let's Keep in Touch!
            </h2>
            <p className="text-white/90 font-medium text-[14px] md:text-base max-w-md">
              Subscribe to keep up with fresh news and exciting updates.
            </p>
          </div>

          {/* Subscription Form */}
          <div className="w-full max-w-xl bg-white p-1 md:p-1.5 rounded-sm shadow-2xl flex flex-row items-center">
            <input 
              type="email" 
              placeholder="Enter Your Email Address..." 
              className="flex-1 min-w-0 px-4 md:px-5 py-3 md:py-3.5 text-[13px] md:text-[14px] focus:outline-none text-[#1a1a1a] placeholder:text-gray-300"
            />
            <button className="bg-[#1a1a1a] text-white px-6 md:px-10 py-3 md:py-3.5 font-black text-[10px] md:text-[11px] tracking-[0.15em] uppercase hover:bg-gray-800 transition-all rounded-sm shrink-0">
              Subscribe
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
