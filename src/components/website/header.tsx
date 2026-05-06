"use client";

import { Search, Ship, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function WebsiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Lock scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

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
    <header className="bg-[#f7f3f0] sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 z-50">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="object-contain h-10 md:h-12 w-auto"
            priority
          />
          <span className="hidden sm:inline text-lg md:text-xl font-black text-[#1a1a1a] tracking-tight uppercase lg:-ml-3">
            MANONO <span className="text-[#eea000]">MANPHIS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
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
          
          <button className="ml-4 bg-[#eea000] p-3 text-white hover:bg-[#eea000]/90 transition-colors rounded-sm shadow-md">
            <Search className="w-5 h-5" />
          </button>
        </nav>

        {/* Mobile Middle Search Bar */}
        <div className="flex-1 mx-4 lg:hidden relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white/50 border border-gray-200 rounded-full py-2 pl-8 pr-4 text-[11px] font-bold text-[#1a1a1a] outline-none focus:border-[#eea000] transition-all"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          />
        </div>

        {/* Mobile Toggle & Search Icon */}
        <div className="flex items-center gap-2 lg:hidden z-50">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-[#1a1a1a] p-2 hover:bg-gray-200/50 rounded-full transition-colors"
          >
            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-[#f7f3f0] z-50 lg:hidden transition-transform duration-500 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl overflow-y-auto`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200/50">
          <Link href="/" className="flex items-center gap-0">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              width={80} 
              height={80} 
              className="object-contain h-10 w-auto"
            />
            <span className="text-lg font-black text-[#1a1a1a] tracking-tight uppercase">
              MANONO <span className="text-[#eea000]">MANPHIS</span>
            </span>
          </Link>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-[#1a1a1a] hover:bg-gray-200/50 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="p-8 pb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#eea000] transition-colors" />
            <input 
              type="text" 
              placeholder="Search services or products..." 
              className="w-full bg-white border border-gray-200 rounded-sm py-3.5 pl-10 pr-4 text-[13px] font-bold text-[#1a1a1a] outline-none focus:border-[#eea000] transition-all"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            />
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <div key={link.name} className="border-b border-gray-200/50 last:border-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className={`flex-1 py-4 text-[16px] font-black tracking-tight ${
                      link.active ? "text-[#eea000]" : "text-[#1a1a1a]"
                    }`}
                    onClick={(e) => {
                      if (link.hasDropdown) {
                        e.preventDefault();
                        setActiveDropdown(activeDropdown === link.name ? null : link.name);
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && (
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                      className="p-4"
                    >
                      <ChevronDown className={`w-5 h-5 transition-transform ${activeDropdown === link.name ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown Content */}
                {link.hasDropdown && (
                  <div className={`overflow-hidden transition-all duration-300 ${
                    activeDropdown === link.name ? "max-h-64 mb-4" : "max-h-0"
                  }`}>
                    <div className="pl-4 border-l-2 border-[#eea000]/30 flex flex-col gap-2">
                      {(link.name === "SERVICES" ? serviceItems : trackingItems).map((item) => (
                        <Link 
                          key={item.name}
                          href={item.href}
                          className="py-2 text-[13px] font-bold text-gray-500 hover:text-[#eea000]"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Footer Info */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>
              Contact Us
            </p>
            <p className="text-[#1a1a1a] font-bold text-sm mb-2">lawrenceantwi63@gmail.com</p>
            <p className="text-gray-500 text-[12px] font-medium leading-relaxed">
              Manono Manphis - Empowering Brands through Creativity and Global Excellence.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
