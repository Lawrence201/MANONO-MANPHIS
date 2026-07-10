"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, Clock, LogIn, UserPlus, Globe, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function TopBar() {
  const { data: session } = useSession();
  const [countryCode, setCountryCode] = useState<string | null>(null);
  
  useEffect(() => {
    fetch('https://api.country.is/')
      .then(res => res.json())
      .then(data => {
        if (data && data.country) {
          setCountryCode(data.country);
        }
      })
      .catch(e => console.error("Could not fetch country", e));
  }, []);
  
  const firstName = session?.user?.name ? session.user.name.split(" ")[0] : "";
  return (
    <div className="bg-[#1a1a1a] text-white py-2 px-4 hidden md:block border-b border-white/5">
      <div className="container mx-auto flex justify-between items-center text-[11px] font-medium tracking-wide">
        <div className="flex items-center gap-6 max-[1028px]:gap-4">
          <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-default">
            <Mail className="w-3.5 h-3.5 text-[#eea000]" />
            <span>manono@manonomanphis.com</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-default">
            <Phone className="w-3.5 h-3.5 text-[#eea000]" />
            <span>+233 54 288 3496</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-default border-l border-white/20 pl-6 max-[1028px]:hidden">
            <Clock className="w-3.5 h-3.5 text-[#eea000]" />
            <span>9:00AM to 8:00PM</span>
          </div>
        </div>
        
        <div className="flex items-center gap-5 max-[1028px]:gap-3">
          {session ? (
            <>
              <div className="flex items-center gap-2 cursor-default">
                {session.user?.image ? (
                  <img src={session.user.image} alt={firstName || "Profile"} className="w-4 h-4 rounded-full object-cover border border-white/20" />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#eea000]" />
                )}
                <span className="max-[1028px]:hidden font-semibold text-white">Welcome, {firstName}</span>
              </div>
              <div className="w-px h-3 bg-white/20 max-[1028px]:hidden" />
              <button onClick={() => signOut()} className="flex items-center gap-2 hover:text-[#ff8080] transition-colors">
                <LogOut className="w-3.5 h-3.5" />
                <span className="max-[1028px]:hidden">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="flex items-center gap-2 hover:text-[#eea000] transition-colors">
                <LogIn className="w-3.5 h-3.5" />
                <span className="max-[1028px]:hidden">Login</span>
              </Link>
              <div className="w-px h-3 bg-white/20 max-[1028px]:hidden" />
              <Link href="/register" className="flex items-center gap-2 hover:text-[#eea000] transition-colors">
                <UserPlus className="w-3.5 h-3.5" />
                <span className="max-[1028px]:hidden">Registration</span>
              </Link>
            </>
          )}
          <div className="w-px h-3 bg-white/20 max-[1028px]:hidden" />
          <div className="flex items-center gap-2 cursor-pointer hover:text-[#eea000] transition-colors group">
            {countryCode ? (
              <img 
                src={`https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`} 
                alt={countryCode} 
                className="h-3 w-auto object-contain rounded-[2px]" 
              />
            ) : (
              <Globe className="w-3.5 h-3.5" />
            )}
            <span className="uppercase">{countryCode || "en"}</span>
            <span className="text-[8px] opacity-50 group-hover:opacity-100 transition-opacity">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}
