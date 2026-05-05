"use client";

import { Search, Ship, ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function WebsiteHeader() {
  const pathname = usePathname();

  const navLinks = [
    { name: "HOME", href: "/", active: pathname === "/" },
    { name: "SERVICES", href: "#", hasDropdown: true, active: pathname.includes("/services") || pathname.includes("/products") },
    { name: "SHIPPING", href: "/shipping", active: pathname === "/shipping" },
    { name: "TRACKING", href: "#", hasDropdown: true, active: pathname.includes("/tracking") },
    { name: "BLOG", href: "#", active: pathname === "/blog" },
    { name: "PAGES", href: "#", active: pathname === "/pages" },
    { name: "CONTACT US", href: "#", active: pathname === "/contact" },
  ];

  const serviceItems = [
    { name: "Digital Billboards Rental", href: "/services/billboards" },
    { name: "Honey & Cashew Nut Export", href: "/products" },
    { name: "Shea Butter", href: "#" },
  ];

  const trackingItems = [
    { name: "Tracking", href: "/tracking" },
    { name: "Shipment Process", href: "/tracking/process" },
  ];

  return (
    <header className="bg-[#f7f3f0] sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0">
          <Image 
            src="/logo.PNG" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="object-contain h-12 w-auto"
            priority
          />
          <span className="hidden lg:inline text-xl font-black text-[#1a1a1a] tracking-tight uppercase lg:-ml-3">
            MANONO <span className="text-[#eea000]">MANPHIS</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center">
          <ul className="flex items-center">
            {navLinks.map((link) => (
              <li key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className={`px-4 py-8 text-[13px] font-bold tracking-wide transition-all border-t-4 border-transparent hover:text-[#eea000] flex items-center gap-1.5 ${
                    link.active ? "text-[#eea000] border-[#eea000]" : "text-[#1a1a1a]"
                  }`}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />}
                </Link>

                {/* Dropdown Menu */}
                {link.hasDropdown && (
                  <ul className="absolute top-full left-0 w-64 bg-white shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 border-t-2 border-[#eea000] py-2">
                    {(link.name === "SERVICES" ? serviceItems : trackingItems).map((item) => (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          className="block px-6 py-3.5 text-[12px] font-bold text-[#1a1a1a] hover:bg-[#f7f3f0] hover:text-[#eea000] transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
          
          {/* Search Button */}
          <button className="ml-4 bg-[#eea000] p-3 text-white hover:bg-[#eea000]/90 transition-colors rounded-sm shadow-md">
            <Search className="w-5 h-5" />
          </button>
        </nav>

        {/* Mobile Toggle Placeholder */}
        <button className="lg:hidden text-[#1a1a1a] p-2">
          <div className="w-6 h-0.5 bg-current mb-1" />
          <div className="w-6 h-0.5 bg-current mb-1" />
          <div className="w-6 h-0.5 bg-current" />
        </button>
      </div>
    </header>
  );
}
