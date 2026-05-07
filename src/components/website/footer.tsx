import Link from "next/link";
import Image from "next/image";
import { Ship, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function WebsiteFooter() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 md:pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          {/* About */}
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-0 mb-6">
              <Image 
                src="/logo.PNG" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="object-contain h-12 md:h-14 w-auto"
              />
              <span className="text-base md:text-lg font-black tracking-tight uppercase -ml-2 md:-ml-3">
                MANONO <span className="text-[#eea000]">MANPHIS</span>
              </span>
            </Link>
            <p className="text-gray-400 text-[13px] leading-relaxed mb-6">
              Manono Manphis is a trusted export company based in Ghana, specializing in the supply of high-quality agricultural commodities including honey, cashew nuts, and shea butter.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-full hover:bg-[#eea000] transition-colors">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-full hover:bg-[#eea000] transition-colors">
                <Twitter className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-full hover:bg-[#eea000] transition-colors">
                <Linkedin className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-8 h-8 bg-white/5 flex items-center justify-center rounded-full hover:bg-[#eea000] transition-colors">
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base font-bold mb-8 relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-8 after:h-1 after:bg-[#eea000]">Quick Links</h4>
            <ul className="space-y-4 text-[13px] text-gray-400">
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Our Services</Link></li>
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Latest News</Link></li>
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-base font-bold mb-8 relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-8 after:h-1 after:bg-[#eea000]">Our Products</h4>
            <ul className="space-y-4 text-[13px] text-gray-400">
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Natural Honey</Link></li>
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Raw Cashew Nuts</Link></li>
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Shea Butter</Link></li>
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Cocoa Beans</Link></li>
              <li><Link href="#" className="hover:text-[#eea000] transition-colors">Tracking</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-base font-bold mb-8 relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-8 after:h-1 after:bg-[#eea000]">Get In Touch</h4>
            <ul className="space-y-4 text-[13px] text-gray-400">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#eea000] shrink-0" />
                <span>Manono Manphis Lane, Accra, Ghana</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-[#eea000] shrink-0" />
                <span>+233 24 123 4567</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-[#eea000] shrink-0" />
                <span>trade@manonomanphis.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <p>© 2026 MANONO MANPHIS. All Rights Reserved.</p>
          <p>Global Agricultural Export & Logistics.</p>
        </div>
      </div>
    </footer>
  );
}
