import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Eye, Check } from "lucide-react";

export default function RegisterPage() {
  return (
    <div className="h-screen w-full bg-[#2a2736] flex flex-col md:flex-row font-sans overflow-hidden">
        
        {/* Left Panel - Image & Branding */}
        <div className="relative w-full md:w-[50%] h-[400px] md:h-full p-8 flex flex-col justify-between">
          <Image
            src="/login1.png"
            alt="Sand dunes at twilight"
            fill
            className="object-cover z-0"
            priority
          />
          {/* Overlay to darken the image slightly */}
          <div className="absolute inset-0 bg-black/10 z-10"></div>

          {/* Top Section */}
          <div className="relative z-20 flex justify-between items-center w-full">
            <div className="text-white font-bold text-2xl tracking-widest flex items-center gap-1">
              <Image 
                src="/logo.PNG" 
                alt="Manono Manphis Logo" 
                width={100} 
                height={28} 
                className="object-contain"
              />
            </div>
            
            <Link 
              href="/" 
              className="text-white/80 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2"
            >
              Back to website <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="relative z-20">
            <h1 className="text-white text-[32px] md:text-[40px] font-medium leading-tight mb-8">
              Global Export &<br />
              Billboard Platform
            </h1>
            
            {/* Pagination Indicators */}
            <div className="flex gap-2">
              <div className="w-8 h-1 bg-white/30 rounded-full"></div>
              <div className="w-8 h-1 bg-white/30 rounded-full"></div>
              <div className="w-10 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-[50%] p-8 md:p-16 lg:p-24 flex flex-col justify-center h-full">
          <div className="max-w-[480px] mx-auto w-full">
            <h2 className="text-white text-[42px] font-semibold mb-2">Create an account</h2>
            <p className="text-gray-400 text-sm mb-10">
              Already have an account? <Link href="/login" className="text-[#8c82d4] hover:underline">Log in</Link>
            </p>

            <form className="space-y-5">
              {/* Name Fields Row */}
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Fletcher" 
                    className="w-full bg-[#353245] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-400 focus:outline-none focus:border-[#7d6ee7] focus:ring-1 focus:ring-[#7d6ee7] transition-all [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#353245_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                  />
                </div>
                <div className="flex-1">
                  <input 
                    type="text" 
                    placeholder="Last name" 
                    className="w-full bg-[#353245] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7d6ee7] focus:ring-1 focus:ring-[#7d6ee7] transition-all [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#353245_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <input 
                  type="email" 
                  placeholder="Email" 
                  className="w-full bg-[#353245] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7d6ee7] focus:ring-1 focus:ring-[#7d6ee7] transition-all [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#353245_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="w-full bg-[#353245] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#7d6ee7] focus:ring-1 focus:ring-[#7d6ee7] transition-all pr-12 [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#353245_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                />
                <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-3 pt-2 pb-4">
                <div className="relative flex items-center justify-center w-5 h-5 bg-white rounded flex-shrink-0 cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <Check className="w-3.5 h-3.5 text-black pointer-events-none" strokeWidth={3} />
                </div>
                <label className="text-gray-300 text-sm">
                  I agree to the <Link href="/terms" className="text-[#8c82d4] hover:underline">Terms & Conditions</Link>
                </label>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                className="w-full bg-[#7d6ee7] hover:bg-[#6a5cd3] text-white rounded-xl py-4 font-medium transition-colors"
              >
                Create account
              </button>

              {/* Divider */}
              <div className="relative flex items-center py-6">
                <div className="flex-grow border-t border-white/10"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">Or register with</span>
                <div className="flex-grow border-t border-white/10"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex gap-4">
                <button 
                  type="button"
                  className="flex-1 flex items-center justify-center gap-3 bg-transparent border border-white/10 rounded-xl py-3 hover:bg-white/5 transition-colors text-white text-sm"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button 
                  type="button"
                  className="flex-1 flex items-center justify-center gap-3 bg-transparent border border-white/10 rounded-xl py-3 hover:bg-white/5 transition-colors text-white text-sm"
                >
                  <svg width="18" height="22" viewBox="0 0 384 512" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                  </svg>
                  Apple
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}
