"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        const session = await getSession();
        const callbackUrl = searchParams.get("callbackUrl");
        
        if ((session?.user as any)?.role === "admin") {
          router.push("/dashboard");
        } else if (callbackUrl && callbackUrl.startsWith("/")) {
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

  useEffect(() => {
    document.body.style.backgroundColor = '#000000';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex font-sans text-white overflow-hidden z-50">
      <style dangerouslySetInnerHTML={{ __html: `
        body::-webkit-scrollbar, html::-webkit-scrollbar {
          display: none !important;
        }
        body, html {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
        .hide-scrollbar {
          -ms-overflow-style: none !important;
          scrollbar-width: none !important;
        }
        /* Autofill — light blue background */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #dbeafe inset !important;
            box-shadow: 0 0 0 1000px #dbeafe inset !important;
            -webkit-text-fill-color: #1e3a8a !important;
            transition: background-color 9999999s ease-in-out 0s !important;
            caret-color: #1e3a8a !important;
        }
      `}} />
      {/* Left Panel */}
      <div className="hidden min-[1029px]:flex min-[1029px]:w-[45%] relative border-r border-white/5 overflow-hidden flex-col items-center justify-center bg-[#0a0a0a]">
        {/* Background Image */}
        <Image
          src="/billboards/login.png"
          alt="Login Background"
          fill
          className="object-cover z-0 opacity-50"
          priority
        />

        <div className="relative z-10 flex flex-col items-center text-center px-12 -mt-12">
          {/* Logo Icon */}
          <div className="mb-6">
            <Image 
              src="/logo.PNG" 
              alt="Manono Manphis Logo" 
              width={100} 
              height={28} 
              className="object-contain"
            />
          </div>
          
          <h1 className="text-[22px] md:text-[26px] font-medium leading-relaxed tracking-tight text-white/90">
            Export Globally. Advertise Digitally. Grow Limitlessly.
          </h1>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 relative flex flex-col h-full overflow-hidden bg-black">
        {/* Back Link */}
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
          <Link href="/" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 max-[480px]:mt-0 mt-16 sm:mt-0 w-full">
          <div className="w-full max-w-[360px] space-y-4 max-[480px]:space-y-3.5">
            {/* Mobile/Tablet Logo */}
            <div className="hidden max-[1028px]:flex justify-center mb-4">
              <Image 
                src="/logo.PNG" 
                alt="Manono Manphis Logo" 
                width={90} 
                height={25} 
                className="object-contain"
                priority
              />
            </div>

            {/* Header */}
            <div className="text-center space-y-1.5">
              <h2 className="text-[26px] font-semibold tracking-tight text-white">Login to Manono</h2>
              <p className="text-[14px] text-gray-400">Connect to Manono with:</p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="relative flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-transparent border border-white/10 hover:bg-white/5 transition-colors text-[13px] font-medium text-white group">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>

              <button type="button" className="flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-transparent border border-white/10 hover:bg-white/5 transition-colors text-[13px] font-medium text-white group">
                <svg width="15" height="18" viewBox="0 0 384 512" fill="white">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                </svg>
                iCloud
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/10" />
              <span className="flex-shrink-0 mx-4 text-[12px] text-gray-500">Or continue with</span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              {searchParams?.get("registered") === "true" && (
                <div className="text-green-500 text-xs mb-4 text-center bg-green-500/10 py-2 rounded">
                  Account successfully created! Please log in.
                </div>
              )}
              {error && (
                <div className="text-red-500 text-xs mb-4 text-center bg-red-500/10 py-2 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-gray-200">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[#111111] border border-white/10 rounded-md px-3.5 py-2.5 text-[16px] sm:text-[14px] text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#1a1a1a] transition-all [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#111111_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[13px] font-medium text-gray-200">Password</label>
                  <Link href="/forgot-password" className="text-[12px] text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a unique password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#111111] border border-white/10 rounded-md px-3.5 py-2.5 text-[16px] sm:text-[14px] text-white placeholder:text-gray-600 focus:outline-none focus:border-white/30 focus:bg-[#1a1a1a] transition-all pr-10 [&:-webkit-autofill]:[box-shadow:0_0_0_30px_#111111_inset] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-transparent border border-white/10 hover:bg-white/5 text-gray-300 disabled:opacity-50 rounded-md py-2.5 text-[14px] font-medium transition-colors mt-2"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <p className="text-center text-[13px] text-gray-200 pt-2">
              New to Manono?{" "}
              <Link href="/register" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                Sign up for an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginForm />
    </Suspense>
  );
}
