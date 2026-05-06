export function NewsletterBanner() {
  return (
    <section className="bg-[#eea000] py-10 mt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              Let's Keep in Touch!
            </h2>
            <p className="text-white/80 font-medium">
              Subscribe to keep up with fresh news and exciting updates.
            </p>
          </div>

          {/* Subscription Form */}
          <div className="w-full max-w-2xl bg-white p-2 rounded-sm shadow-xl flex flex-col md:flex-row items-center gap-2">
            <input 
              type="email" 
              placeholder="Enter Your Email Address..." 
              className="flex-1 w-full px-6 py-4 text-[15px] focus:outline-none text-[#1a1a1a]"
            />
            <button className="w-full md:w-auto bg-[#1a1a1a] text-white px-10 py-4 font-black text-[11px] tracking-[0.2em] uppercase hover:bg-gray-800 transition-all rounded-sm">
              Subscribe
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}
