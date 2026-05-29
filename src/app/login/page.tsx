"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, Check, ArrowRight, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMsg("Account created successfully! Please log in.");
      
      const timer = setTimeout(() => {
        setSuccessMsg("");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        const callbackUrl = searchParams.get("callbackUrl");
        if (callbackUrl && callbackUrl.startsWith("/")) {
          router.push(callbackUrl);
        } else {
          router.push("/");
        }
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        body, html {
          background-color: #2a2736 !important;
        }
        *::-webkit-scrollbar {
          display: none !important;
        }
        * {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
      `}} />

      {/* Fixed layer — covers the entire viewport + overscroll area so no white ever shows */}
      <div className="fixed inset-0 bg-[#2a2736] -z-10" />

      {/* Back button — fixed top-right corner of the viewport (visible only on mobile) */}
      <div className="fixed top-4 right-4 sm:top-5 sm:right-5 z-50 md:hidden">
        <Link
          href="/"
          className="text-white/70 bg-white/10 hover:bg-white/20 backdrop-blur-sm
                     px-4 py-1.5 rounded-full text-[13px] sm:text-sm font-medium transition-all
                     flex items-center gap-1.5"
        >
          <ArrowRight className="w-4 h-4 rotate-180" /> Back
        </Link>
      </div>

      {/* Strictly locked height to prevent any scrolling on mobile */}
      <div className="fixed inset-0 w-full flex flex-col md:flex-row font-sans overflow-hidden">

        {/* Left Panel - Image & Branding (Desktop Only) */}
        <div className="hidden md:flex relative w-[50%] h-full p-8 flex-col justify-between">
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
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to website
            </Link>
          </div>

          {/* Bottom Section */}
          <div className="relative z-20">
            <h1 className="text-white text-[32px] lg:text-[40px] font-medium leading-tight mb-8">
              Global Export &<br />
              Billboard Platform
            </h1>
            
            {/* Pagination Indicators */}
            <div className="flex gap-2">
              <div className="w-10 h-1 bg-white rounded-full"></div>
              <div className="w-8 h-1 bg-white/30 rounded-full"></div>
              <div className="w-8 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-[50%] flex flex-col items-center justify-center px-5 md:px-16 lg:px-24 h-full">

          <div className="w-full max-w-[480px] mx-auto mt-16 sm:mt-24 md:mt-0">

          <h2 className="text-white font-semibold mb-2 text-[28px] sm:text-[36px] md:text-[42px]">
            Log in
          </h2>
          <p className="text-gray-400 text-sm mb-8">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#8c82d4] hover:underline">
              Sign up
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" suppressHydrationWarning>
            {successMsg && (
              <div className="flex items-center gap-2.5 text-[#a8a1ff] text-sm bg-[#7d6ee7]/10 p-4 rounded-xl border border-[#7d6ee7]/20">
                <Check className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <p>{successMsg}</p>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2.5 text-[#ff8080] text-sm bg-[#ff4d4d]/10 p-4 rounded-xl border border-[#ff4d4d]/20">
                <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <p>{error}</p>
              </div>
            )}

            {/* Email — text-base (16px) prevents iOS auto-zoom on focus */}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              suppressHydrationWarning
              className="w-full bg-[#353245] border border-white/10 rounded-xl
                         px-4 py-3 sm:py-3.5 text-base
                         text-white placeholder:text-gray-500
                         focus:outline-none focus:border-[#7d6ee7] focus:ring-1 focus:ring-[#7d6ee7]
                         transition-all
                         [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#353245_inset]
                         [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
            />

            {/* Password — text-base (16px) prevents iOS auto-zoom on focus */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                suppressHydrationWarning
                className="w-full bg-[#353245] border border-white/10 rounded-xl
                           px-4 py-3 sm:py-3.5 pr-12 text-base
                           text-white placeholder:text-gray-500
                           focus:outline-none focus:border-[#7d6ee7] focus:ring-1 focus:ring-[#7d6ee7]
                           transition-all
                           [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#353245_inset]
                           [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between pt-1 pb-2">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-5 h-5 bg-white rounded flex-shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <Check className="w-3.5 h-3.5 text-black pointer-events-none opacity-0 checked-icon transition-opacity" strokeWidth={3} />
                </div>
                <label className="text-gray-300 text-sm cursor-pointer">Remember me</label>
              </div>
              <Link href="/forgot-password" className="text-[#8c82d4] text-sm hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#7d6ee7] hover:bg-[#6a5cd3] disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl
                         py-3.5 sm:py-4 font-medium transition-colors text-sm sm:text-base"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-4 sm:py-5">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">Or log in with</span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            {/* Social Buttons */}
            <div className="flex gap-3 sm:gap-4">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3
                           bg-transparent border border-white/10 rounded-xl
                           py-2.5 sm:py-3
                           hover:bg-white/5 transition-colors text-white text-xs sm:text-sm"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 sm:gap-3
                           bg-transparent border border-white/10 rounded-xl
                           py-2.5 sm:py-3
                           hover:bg-white/5 transition-colors text-white text-xs sm:text-sm"
              >
                <svg width="16" height="20" viewBox="0 0 384 512" fill="white">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                Apple
              </button>
            </div>

          </form>
        </div>
        </div>
      </div>
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#2a2736]" />}>
      <LoginForm />
    </Suspense>
  );
}
