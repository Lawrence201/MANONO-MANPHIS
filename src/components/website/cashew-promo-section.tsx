"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function CashewPromoSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-32 my-16">
      {/* Background large decorative circle */}
      <div 
        className="absolute top-1/2 right-0 w-[900px] h-[900px] bg-[#fff5eb] rounded-full translate-x-[30%] -translate-y-1/2 pointer-events-none"
      />
      
      <div className="container relative z-10 mx-auto px-4 max-w-[1300px] flex flex-col lg:flex-row items-center gap-8 min-[480px]:gap-10 lg:gap-8 xl:gap-24">
        
        {/* Left Content */}
        <div className="flex-1 space-y-5 min-[480px]:space-y-6 lg:space-y-8 max-w-[600px] lg:pl-4 xl:pl-10 text-center lg:text-left mt-8 min-[480px]:mt-10 lg:mt-0">
          <h2 className="text-[36px] min-[480px]:text-[42px] sm:text-[48px] md:text-[58px] lg:text-[48px] xl:text-[66px] font-semibold text-[#2a2a2a] leading-[1.15]">
            Manono Manphis Cashews
          </h2>
          
          <div className="space-y-3 min-[480px]:space-y-4">
            <p className="text-[16px] min-[480px]:text-[17px] sm:text-[19px] text-[#2a2a2a] font-bold leading-relaxed">
              Premium Quality. Naturally Grown.
            </p>
            <p className="text-[15px] min-[480px]:text-[16px] sm:text-[17px] text-gray-500 leading-relaxed mx-auto lg:mx-0 max-w-[500px] lg:max-w-none px-2 min-[480px]:px-4 lg:px-0">
              Carefully selected cashews processed to international standards for exceptional taste, freshness, and export quality.
            </p>
          </div>
          
          <div className="pt-2 min-[480px]:pt-4 lg:pt-2">
            <button className="bg-[#9c4921] hover:bg-[#7a391a] text-white px-8 lg:px-10 py-3 lg:py-4 rounded-full font-bold text-[13px] lg:text-[14px] tracking-wide transition-colors">
              Explore Products
            </button>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="flex-1 relative flex justify-center items-center py-6 min-[480px]:py-10 lg:translate-x-4 xl:translate-x-8">
          <motion.div 
            initial={{ y: 150, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            className="relative flex justify-center items-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="relative flex justify-center items-center"
            >
              {/* Outer thin ring */}
              <div className="absolute w-[280px] h-[280px] min-[480px]:w-[320px] min-[480px]:h-[320px] sm:w-[350px] sm:h-[350px] md:w-[450px] md:h-[450px] lg:w-[400px] lg:h-[400px] xl:w-[500px] xl:h-[500px] rounded-full border border-[#d2a382]" />
              
              {/* Image Container */}
              <div className="relative w-[240px] h-[240px] min-[480px]:w-[280px] min-[480px]:h-[280px] sm:w-[310px] sm:h-[310px] md:w-[410px] md:h-[410px] lg:w-[360px] lg:h-[360px] xl:w-[460px] xl:h-[460px] rounded-full overflow-hidden z-10">
                <Image 
                  src="/cashew.png" 
                  alt="Cashew Nuts" 
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
