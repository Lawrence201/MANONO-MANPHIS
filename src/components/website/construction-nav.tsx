"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, ArrowUpRight, X, LayoutGrid } from "lucide-react";

export function ConstructionNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Services", href: "/services/construction/services" },
    { name: "Projects", href: "#projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className={`fixed inset-x-0 mx-auto z-[100] flex items-center justify-between transition-all duration-500 ${
      isScrolled 
        ? "top-0 w-full max-w-full bg-white rounded-none px-4 min-[480px]:px-6 lg:px-12 py-3 shadow-md" 
        : "top-4 min-[480px]:top-14 md:top-[70px] w-[95%] max-w-[1500px] bg-[#313131] rounded-xl px-4 min-[480px]:px-6 lg:px-10 py-3 min-[480px]:py-5 shadow-2xl"
    }`}>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-0">
        <Image 
          src="/logo.PNG" 
          alt="Logo" 
          width={80} 
          height={80} 
          className={`object-contain transition-all duration-500 ${isScrolled ? "h-8 md:h-11" : "h-8 min-[480px]:h-10 md:h-12"} w-auto`}
          priority
        />
        <span className={`hidden min-[500px]:inline text-lg md:text-xl font-black tracking-tight uppercase lg:-ml-2 transition-colors duration-500 ${
          isScrolled ? "text-[#1a1a1a]" : "text-white"
        }`}>
          MANONO <span className="text-[#FFD100]">MANPHIS</span>
        </span>
      </Link>

      {/* Links */}
      <div className="hidden min-[900px]:flex items-center gap-10">
        <Link href="/" className="text-[15px] font-bold text-[#FFD100]">Home</Link>
        <Link href="/#about" className={`text-[15px] font-bold transition-colors duration-500 hover:text-[#FFD100] ${isScrolled ? "text-[#1a1a1a]" : "text-white"}`}>About</Link>
        <Link href="/services/construction/services" className={`text-[15px] font-bold transition-colors duration-500 hover:text-[#FFD100] ${isScrolled ? "text-[#1a1a1a]" : "text-white"}`}>Services</Link>
        <Link href="#projects" className={`text-[15px] font-bold transition-colors duration-500 hover:text-[#FFD100] ${isScrolled ? "text-[#1a1a1a]" : "text-white"}`}>Projects</Link>
        <Link href="/blog" className={`text-[15px] font-bold transition-colors duration-500 hover:text-[#FFD100] ${isScrolled ? "text-[#1a1a1a]" : "text-white"}`}>Blog</Link>
        <Link href="/contact" className={`text-[15px] font-bold transition-colors duration-500 hover:text-[#FFD100] ${isScrolled ? "text-[#1a1a1a]" : "text-white"}`}>Contact</Link>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        <Link href="/contact" className={`hidden sm:flex items-center gap-2 text-black px-6 font-bold text-[15px] transition-all duration-500 ${
          isScrolled ? "bg-[#FFD100] py-2.5 hover:bg-[#FFD100]/90 rounded-sm" : "bg-[#FFD100] py-3 hover:bg-[#FFD100]/90"
        }`}>
          Get Free Quote <ArrowUpRight className="w-5 h-5" />
        </Link>
        <button className={`w-11 h-11 rounded-full border flex items-center justify-center transition-colors duration-500 ${
          isScrolled 
            ? "border-black/20 text-[#1a1a1a] hover:bg-black/5" 
            : "border-white/20 text-white hover:bg-white/10"
        }`}>
          <Search className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`min-[900px]:hidden w-9 h-9 min-[480px]:w-11 min-[480px]:h-11 rounded-full border flex items-center justify-center transition-all duration-500 z-[100] ${
            isScrolled || isMenuOpen
              ? "border-black/20 text-[#1a1a1a] hover:bg-black/5 bg-white" 
              : "border-white/20 text-white hover:bg-white/10"
          }`}
        >
          <div className={`relative w-5 h-5 transition-all duration-500 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}>
            <div className={`absolute inset-0 transition-all duration-300 ease-out ${isMenuOpen ? "opacity-100 scale-100 delay-300" : "opacity-0 scale-50"}`}>
              <X className="w-5 h-5" />
            </div>
            <div className={`absolute inset-0 transition-all duration-300 ease-in ${isMenuOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}>
              <LayoutGrid className="w-5 h-5" />
            </div>
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] min-[900px]:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-[#1a1a1a] z-[90] min-[900px]:hidden transition-transform duration-500 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl overflow-y-auto`}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-[#1a1a1a] flex items-center justify-between pt-28 max-[480px]:pt-12 px-4 pb-6">
          <Link href="/" className="flex items-center gap-0 translate-x-10 max-[480px]:translate-x-6" onClick={() => setIsMenuOpen(false)}>
            <Image 
              src="/logo.PNG" 
              alt="Logo" 
              width={160} 
              height={160} 
              className="object-contain h-16 min-[768px]:h-18 max-[480px]:h-12 max-[380px]:h-9 w-auto"
            />
            <span className="text-3xl max-[480px]:text-xl max-[380px]:text-lg font-black text-white tracking-tight uppercase">
              MANONO <span className="text-[#FFD100]">MANPHIS</span>
            </span>
          </Link>
        </div>

        <div className="px-8 max-[480px]:px-6 pt-0 min-[768px]:pt-4 pb-8">
          <div className="flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <div 
                key={link.name} 
                className={`border-b border-white/10 last:border-0 transition-all duration-500 ease-out transform ${
                  isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: isMenuOpen ? `${(index + 1) * 100}ms` : "0ms" }}
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={link.href}
                    className="flex-1 py-4 text-[24px] max-[768px]:text-[20px] max-[480px]:text-[17px] max-[380px]:text-[15px] font-semibold tracking-tight text-white hover:text-[#FFD100] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Mobile Get Quote Button */}
          <div 
            className={`mt-10 transition-all duration-500 ease-out transform ${
              isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
            style={{ transitionDelay: isMenuOpen ? `${(navLinks.length + 1) * 100}ms` : "0ms" }}
          >
            <Link 
              href="/contact" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#FFD100] text-[#1a1a1a] px-6 py-4 font-bold text-[16px] hover:bg-white transition-colors rounded-sm"
            >
              Get Free Quote <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}
