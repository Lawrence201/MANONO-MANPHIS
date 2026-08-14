import Link from "next/link";
import Image from "next/image";
import { Ship, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function WebsiteFooter() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-16 md:pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          {/* About */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-0 mb-6">
              <Image 
                src="/logo.PNG" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="object-contain h-12 md:h-14 w-auto"
              />
              <span className="inline max-[1028px]:hidden max-[768px]:inline text-base md:text-lg font-black tracking-tight uppercase -ml-2 md:-ml-3">
                MANONO <span className="text-[#eea000]">MANPHIS</span>
              </span>
            </Link>
            <p className="text-gray-400 text-[13px] leading-relaxed mb-6">
              Manono Manphis is a trusted multi-sector company based in Ghana, specializing in high-quality agricultural exports, outdoor digital media solutions, and professional construction services.
            </p>

            <div className="flex flex-nowrap gap-2 sm:gap-2.5">
              <Link
                href="#"
                className="btn btn-icon footer-social-btn btn-outline-facebook waves-effect waves-light"
              >
                <i className="fa-brands fa-facebook-f"></i>
              </Link>
              <Link
                href="#"
                className="btn btn-icon footer-social-btn btn-outline-twitter-footer waves-effect waves-light"
              >
                <i className="fa-brands fa-x-twitter"></i>
              </Link>
              <Link
                href="#"
                className="btn btn-icon footer-social-btn btn-outline-linkedin waves-effect waves-light"
              >
                <i className="fa-brands fa-linkedin-in"></i>
              </Link>
              <Link
                href="#"
                className="btn btn-icon footer-social-btn btn-outline-whatsapp waves-effect waves-light"
              >
                <i className="fa-brands fa-whatsapp"></i>
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
              <li><Link href="/services/construction" className="hover:text-[#eea000] transition-colors">Construction Services</Link></li>
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
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-base font-bold mb-8 relative after:content-[''] after:absolute after:left-0 after:-bottom-2 after:w-8 after:h-1 after:bg-[#eea000]">Get In Touch</h4>
            <ul className="space-y-4 text-[13px] text-gray-400">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-[#eea000] shrink-0" />
                <span>42 Adote nwenmeete road dansoman</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-[#eea000] shrink-0" />
                <span>+233 54 288 3496 | +233 55 860 0605 | +233 59 450 0059</span>
              </li>
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-[#eea000] shrink-0" />
                <span>manono@manonomanphis.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <p>© 2026 MANONO MANPHIS. All Rights Reserved.</p>
          <p>Trade • Media • Construction</p>
        </div>
      </div>
    </footer>
  );
}
