"use client";

import { Search, Ship, ChevronDown, Menu, X, LayoutGrid, Home, Settings, MapPin, FileText, Layers, PhoneCall, User, ShoppingCart, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { getCart } from "@/lib/actions/cart-actions";
import { useSession, signOut } from "next-auth/react";

export function WebsiteHeader() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { data: session } = useSession();
  const firstName = session?.user?.name ? session.user.name.split(" ")[0] : "";

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const getLinkIcon = (name: string, isActive: boolean) => {
    const iconColor = isActive ? "text-[#eea000]" : "text-[#6f737c]";
    switch (name) {
      case "HOME": return <Home className={`w-6 h-6 ${iconColor}`} />;
      case "SERVICES": return <Settings className={`w-6 h-6 ${iconColor}`} />;
      case "SHIPPING": return <Ship className={`w-6 h-6 ${iconColor}`} />;
      case "TRACKING": return <MapPin className={`w-6 h-6 ${iconColor}`} />;
      case "BLOG": return <FileText className={`w-6 h-6 ${iconColor}`} />;
      case "PAGES": return <Layers className={`w-6 h-6 ${iconColor}`} />;
      case "CONTACT US": return <PhoneCall className={`w-6 h-6 ${iconColor}`} />;
      default: return null;
    }
  };

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
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdown when clicking or tapping outside of nav items
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (activeDropdown && !target.closest("[data-nav-dropdown='true']")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [activeDropdown]);

  const updateCartCount = async () => {
    try {
      const res = await getCart();
      if (res.success && res.data?.items) {
        const totalItems = res.data.items.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const navLinks = [
    { name: "HOME", href: "/", active: pathname === "/" },
    { name: "SERVICES", href: "#", hasDropdown: true, active: pathname.includes("/services") || pathname.includes("/products") },
    { name: "SHIPPING", href: "/shipping", active: pathname === "/shipping" },
    { name: "TRACKING", href: "#", hasDropdown: true, active: pathname.includes("/tracking") },
    { name: "BLOG", href: "#", active: pathname === "/blog" },
    { name: "PAGES", href: "#", active: pathname === "/pages" },
    { name: "CONTACT US", href: "/contact", active: pathname === "/contact" },
  ];

  const serviceItems = [
    { name: "Digital Billboards Rental", href: "/services/billboards" },
    { name: "Construction Services", href: "/services/construction" },
    { name: "Honey & Cashew Nut Export", href: "/products" },
    { name: "Shea Butter", href: "#" },
  ];

  const trackingItems = [
    { name: "Tracking", href: "/tracking" },
    { name: "Shipment Process", href: "/tracking/process" },
  ];

  return (
    <header className="bg-[#f7f3f0] sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 flex justify-between items-center h-18 max-[380px]:h-14 relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-0 z-50 ml-0">
          <Image 
            src="/logo.PNG" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="object-contain h-10 md:h-12 max-[380px]:h-8 w-auto"
            priority
          />
          <span className="hidden min-[1029px]:inline text-base md:text-lg font-black text-[#1a1a1a] tracking-tight uppercase lg:-ml-3">
            MANONO <span className="text-[#eea000]">MANPHIS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden min-[1029px]:flex items-center">
          <ul className="flex items-center">
            {navLinks.map((link, index) => (
              <li 
                key={link.name} 
                className="relative group"
                data-nav-dropdown="true"
                onMouseLeave={() => {
                  if (activeDropdown === link.name) {
                    setActiveDropdown(null);
                  }
                }}
              >
                <Link
                  href={link.href}
                  onClick={(e) => {
                    if (link.hasDropdown) {
                      e.preventDefault();
                      setActiveDropdown(activeDropdown === link.name ? null : link.name);
                    }
                  }}
                  className={`px-4 py-8 text-[14px] font-semibold tracking-wide transition-all border-t-4 border-transparent hover:text-[#eea000] flex items-center gap-1.5 ${
                    link.active || activeDropdown === link.name ? "text-[#eea000] border-[#eea000]" : "text-[#1a1a1a]"
                  }`}
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown className={`w-3.5 h-3.5 transition-transform group-hover:rotate-180 ${activeDropdown === link.name ? "rotate-180" : ""}`} />}
                </Link>

                {/* Dropdown Menu */}
                {link.hasDropdown && (
                  <ul className={`absolute top-full left-0 w-64 bg-white shadow-2xl transition-all duration-300 border-t-2 border-[#eea000] py-2 ${
                    activeDropdown === link.name
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
                  }`}>
                    {(link.name === "SERVICES" ? serviceItems : trackingItems).map((item) => (
                      <li key={item.name}>
                        <Link 
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-6 py-3.5 text-[13px] font-semibold text-[#1a1a1a] hover:bg-[#f7f3f0] hover:text-[#eea000] transition-colors"
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
          
          <Link href="/cart" className="ml-4 bg-[#eea000] p-3 text-white hover:bg-[#eea000]/90 transition-colors rounded-sm shadow-md flex items-center justify-center relative">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              {cartCount}
            </span>
          </Link>
        </nav>

        {/* Mobile Middle Search Bar */}
        <div className="absolute left-1/2 max-[1028px]:left-[58%] max-[768px]:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] max-[768px]:w-[40%] max-[480px]:w-[48%] max-[1028px]:flex hidden items-center z-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            suppressHydrationWarning
            className="w-full bg-white/50 border border-gray-200 rounded-full py-2 pl-8 pr-4 text-[16px] max-[1028px]:text-[15px] font-bold text-[#1a1a1a] outline-none focus:border-[#eea000] transition-all"
            style={{ fontFamily: "var(--font-jetbrains-mono)" }}
          />
        </div>

        {/* Mobile Toggle & Cart Icon */}
        <div className="flex items-center gap-2 max-[1028px]:flex hidden">
          <Link href="/cart" className="p-2 flex items-center justify-center bg-transparent z-[80] relative">
            <ShoppingCart className="w-6 h-6 max-[380px]:w-5 max-[380px]:h-5 text-[#eea000]" />
            <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`bg-white border border-gray-200 text-[#1a1a1a] p-2 rounded-xl hover:border-[#eea000] transition-all shadow-sm flex items-center justify-center z-[100] ${isMenuOpen ? "fixed top-4 right-4 max-[380px]:top-2" : "relative"}`}
          >
            <div className={`relative w-6 h-6 max-[380px]:w-5 max-[380px]:h-5 transition-all duration-500 ${isMenuOpen ? "rotate-180" : "rotate-0"}`}>
              {/* X Icon (appears with delay as menu slides in) */}
              <div className={`absolute inset-0 transition-all duration-300 ease-out ${isMenuOpen ? "opacity-100 scale-100 delay-300" : "opacity-0 scale-50"}`}>
                <X className="w-6 h-6 max-[380px]:w-5 max-[380px]:h-5" />
              </div>
              {/* Grid Icon (disappears quickly) */}
              <div className={`absolute inset-0 transition-all duration-300 ease-in ${isMenuOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"}`}>
                <LayoutGrid className="w-6 h-6 max-[380px]:w-5 max-[380px]:h-5" />
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] max-[1028px]:block hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <div 
        className={`fixed inset-0 bg-[#f7f3f0] z-[90] max-[1028px]:block hidden transition-transform duration-500 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl overflow-y-auto`}
      >
        {/* Drawer Header */}
        <div className="sticky top-0 z-20 bg-[#f7f3f0] flex items-center justify-between pt-28 max-[480px]:pt-12 px-4 pb-6">
          <Link href="/" className="flex items-center gap-0 translate-x-10 max-[480px]:translate-x-6">
            <Image 
              src="/logo.PNG" 
              alt="Logo" 
              width={160} 
              height={160} 
              className="object-contain h-16 min-[768px]:h-18 max-[480px]:h-12 max-[380px]:h-9 w-auto"
            />
            <span className="text-3xl max-[480px]:text-xl max-[380px]:text-lg font-black text-[#1a1a1a] tracking-tight uppercase">
              MANONO <span className="text-[#eea000]">MANPHIS</span>
            </span>
          </Link>
          {/* Removed redundant X button - main toggle overlays instead */}
        </div>

        {/* Removed redundant search bar from mobile menu */}
        <div className="px-8 pt-0 min-[768px]:pt-4 pb-8">
          <div className="flex flex-col gap-2">
            {navLinks.map((link, index) => (
              <div 
                key={link.name} 
                data-nav-dropdown="true"
                className={`border-b border-gray-200/50 last:border-0 transition-all duration-500 ease-out transform ${
                  isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
                }`}
                style={{ transitionDelay: isMenuOpen ? `${(index + 1) * 100}ms` : "0ms" }}
              >
                <Link
                  href={link.href}
                  className="flex items-center justify-between w-full group"
                  onClick={(e) => {
                    if (link.hasDropdown) {
                      e.preventDefault();
                      setActiveDropdown(activeDropdown === link.name ? null : link.name);
                    }
                  }}
                >
                  <div
                    className={`flex-1 py-4 text-[24px] max-[768px]:text-[20px] max-[480px]:text-[17px] max-[380px]:text-[15px] font-semibold tracking-tight transition-colors ${
                      link.active ? "text-[#eea000]" : "text-[#1a1a1a] group-hover:text-[#eea000]"
                    }`}
                  >
                    {link.name}
                  </div>
                  <div className="p-4 flex items-center transition-colors">
                    {getLinkIcon(link.name, !!link.active)}
                  </div>
                </Link>

                {/* Mobile Dropdown Content */}
                {link.hasDropdown && (
                  <div className={`overflow-hidden transition-all duration-300 ${
                    activeDropdown === link.name ? "max-h-64 mb-4" : "max-h-0"
                  }`}>
                    <div className="pl-4 flex flex-col gap-2">
                      {(link.name === "SERVICES" ? serviceItems : trackingItems).map((item) => (
                        <Link 
                          key={item.name}
                          href={item.href}
                          className="py-2 text-[16px] font-semibold text-[#4b4b4b] hover:text-[#eea000]"
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

          <div 
            className={`px-8 pt-3 min-[768px]:pt-10 mt-4 min-[768px]:mt-10 transition-all duration-500 ease-out transform ${
              isMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
            style={{ transitionDelay: isMenuOpen ? `${(navLinks.length + 1) * 100}ms` : "0ms" }}
          >
            <div className="flex flex-nowrap items-center gap-4 max-[768px]:gap-3 max-[480px]:gap-2 text-[26px] max-[768px]:text-[20px] max-[480px]:text-[16px] max-[380px]:text-[14px] font-semibold text-[#1a1a1a] whitespace-nowrap">
              {session ? (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-7 h-7 max-[768px]:w-6 max-[768px]:h-6 max-[480px]:w-5 max-[480px]:h-5 text-[#eea001]" />
                    <span>Welcome, {firstName}</span>
                  </div>
                  <div className="w-[1px] h-6 max-[480px]:h-4 bg-gray-400" />
                  <button 
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut();
                    }}
                    className="flex items-center gap-2 hover:text-[#ff8080] transition-colors"
                  >
                    <LogOut className="w-7 h-7 max-[768px]:w-6 max-[768px]:h-6 max-[480px]:w-5 max-[480px]:h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-7 h-7 text-[#eea001]" />
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  </div>
                  <div className="w-[1px] h-6 bg-gray-400" />
                  <Link href="/register" onClick={() => setIsMenuOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
