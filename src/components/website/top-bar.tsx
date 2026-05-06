import { Mail, Phone, Clock, LogIn, UserPlus, Globe } from "lucide-react";
import Link from "next/link";

export function TopBar() {
  return (
    <div className="bg-[#1a1a1a] text-white py-2 px-4 hidden md:block border-b border-white/5">
      <div className="container mx-auto flex justify-between items-center text-[11px] font-medium tracking-wide">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-default">
            <Mail className="w-3.5 h-3.5 text-[#eea000]" />
            <span>info@worldshipping.com</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-default">
            <Phone className="w-3.5 h-3.5 text-[#eea000]" />
            <span>+88 01911 837404</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors cursor-default border-l border-white/20 pl-6">
            <Clock className="w-3.5 h-3.5 text-[#eea000]" />
            <span>9:00AM to 8:00PM</span>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="flex items-center gap-2 hover:text-[#eea000] transition-colors">
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </Link>
          <div className="w-px h-3 bg-white/20" />
          <Link href="#" className="flex items-center gap-2 hover:text-[#eea000] transition-colors">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Registration</span>
          </Link>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-2 cursor-pointer hover:text-[#eea000] transition-colors group">
            <Globe className="w-3.5 h-3.5" />
            <span className="uppercase">en</span>
            <span className="text-[8px] opacity-50 group-hover:opacity-100 transition-opacity">▼</span>
          </div>
        </div>
      </div>
    </div>
  );
}
