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
      
      <div className="container relative z-10 mx-auto px-4 max-w-[1300px] flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Content */}
        <div className="flex-1 space-y-8 max-w-[600px] lg:pl-10">
          <h2 className="text-[48px] md:text-[58px] lg:text-[66px] font-semibold text-[#2a2a2a] leading-[1.15]">
            Manono Manphis Cashews
          </h2>
          
          <div className="space-y-4">
            <p className="text-[19px] text-[#2a2a2a] font-bold leading-relaxed">
              Premium Quality. Naturally Grown.
            </p>
            <p className="text-[17px] text-gray-500 leading-relaxed">
              Carefully selected cashews processed to international standards for exceptional taste, freshness, and export quality.
            </p>
          </div>
          
          <div className="pt-2">
            <button className="bg-[#9c4921] hover:bg-[#7a391a] text-white px-10 py-4 rounded-full font-bold text-[14px] tracking-wide transition-colors">
              Explore Products
            </button>
          </div>
        </div>

        {/* Right Content - Image */}
        <div className="flex-1 relative flex justify-center items-center py-10 translate-x-4 lg:translate-x-8">
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
              <div className="absolute w-[500px] h-[500px] rounded-full border border-[#d2a382]" />
              
              {/* Image Container */}
              <div className="relative w-[460px] h-[460px] rounded-full overflow-hidden z-10">
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
