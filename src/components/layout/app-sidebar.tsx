"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, ShoppingCart, CreditCard,
  Receipt, Package, Truck, BarChart3, Globe2, Settings,
  Sparkles, FileBarChart, ShieldCheck, Map, Ship, UserCog,
  ScrollText, Bell, Workflow, Factory, MessageSquare, Monitor, Layers, Calendar, Megaphone,
  HardHat, Inbox, ImagePlus, PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Core",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Analytics", url: "/analytics", icon: BarChart3 },
      { title: "Reports", url: "/reports", icon: FileBarChart },
    ],
  },
  {
    label: "Advertising Services",
    items: [
      { title: "Billboard Manager", url: "/inventory/billboard-manager", icon: Monitor },
      { title: "Ad Bookings", url: "/inventory/bookings", icon: Megaphone, badge: "5" },
      { title: "Campaign Schedule", url: "/inventory/schedule", icon: Calendar },
    ],
  },
  {
    label: "Trade Operations",
    items: [
      { title: "Orders", url: "/orders", icon: ShoppingCart, badge: "8" },
      { title: "Quotations", url: "/quotations", icon: FileText },
      { title: "Customers", url: "/customers", icon: Globe2 },
      { title: "Inventory", url: "/inventory", icon: Layers },
      { title: "Logistics", url: "/logistics", icon: Truck },
      { title: "Production", url: "/production", icon: Factory },
    ],
  },
  {
    label: "Construction",
    items: [
      { title: "Service Requests", url: "/construction/requests", icon: Inbox, badge: "0" },
      { title: "Active Projects", url: "/construction/projects", icon: HardHat },
      { title: "Portfolio", url: "/construction/portfolio", icon: ImagePlus },
      { title: "Add Project", url: "/inventory/construction/projects/add", icon: PlusCircle },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Payments", url: "/payments", icon: CreditCard },
      { title: "Invoices", url: "/invoices", icon: Receipt },
    ],
  },
  {
    label: "Communication",
    items: [
      { title: "Leads & CRM", url: "/leads", icon: Users, badge: "12" },
      { title: "Communications", url: "/communications", icon: MessageSquare, badge: "2" },
    ],
  },
  {
    label: "Administration Console",
    items: [
      { title: "Client Management", url: "/clients", icon: UserCog },
      { title: "System Settings", url: "/settings", icon: Settings },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Notifications", url: "/notifications", icon: Bell, badge: "4" },
      { title: "Automation", url: "/automation", icon: Workflow },
    ],
  },
];

export function AppSidebar({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [pendingConstructionCount, setPendingConstructionCount] = useState<number>(0);

  useEffect(() => {
    async function fetchPendingCount() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const json = await res.json();
        if (json.success && json.data) {
          setPendingCount(json.data.pendingApprovalsCount || 0);
          setPendingOrdersCount(json.data.pendingOrdersCount || 0);
          setPendingConstructionCount(json.data.pendingConstructionRequestsCount || 0);
        }
      } catch (err) {
        console.error("Failed to fetch sidebar pending approvals count:", err);
      }
    }
    fetchPendingCount();
    
    window.addEventListener("bookingsUpdated", fetchPendingCount);
    window.addEventListener("cartUpdated", fetchPendingCount);
    window.addEventListener("constructionRequestsUpdated", fetchPendingCount);

    return () => {
      window.removeEventListener("bookingsUpdated", fetchPendingCount);
      window.removeEventListener("cartUpdated", fetchPendingCount);
      window.removeEventListener("constructionRequestsUpdated", fetchPendingCount);
    };
  }, []);

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className={cn("h-16 flex items-center border-b border-sidebar-border shrink-0 transition-all", collapsed ? "justify-center px-0" : "gap-2 px-4")}>
        <Image 
          src="/logo.PNG" 
          alt="Logo" 
          width={40} 
          height={40} 
          className="object-contain h-10 w-auto"
        />
        <div className={cn(
          "transition-all duration-300 overflow-hidden whitespace-nowrap ml-2",
          collapsed ? "w-0 opacity-0 ml-0" : "w-full opacity-100"
        )}>
          <div className="font-display font-black text-sm tracking-tight text-white uppercase leading-none">
            MANONO <span className="text-[#eea000]">MANPHIS</span>
          </div>
          <div className="text-[9px] text-sidebar-foreground/60 uppercase tracking-[0.2em] mt-1">Export OS</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-very-thin">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5">
            <div className={cn(
              "px-3 pb-2 text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold transition-all duration-300 overflow-hidden whitespace-nowrap",
              collapsed ? "h-0 opacity-0 pb-0" : "h-auto opacity-100"
            )}>
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = (() => {
                  if (item.url === "/") return pathname === "/";
                  // Inventory should only activate on its own sub-pages, not advertising ones
                  if (item.url === "/inventory") {
                    const inventoryPaths = ["/inventory/honey", "/inventory/cashew", "/inventory/sheabutter", "/inventory/billboards"];
                    return pathname === "/inventory" || inventoryPaths.some(p => pathname?.startsWith(p));
                  }
                  return pathname?.startsWith(item.url);
                })();
                const Icon = item.icon;
                return (
                  <li key={item.url}>
                    <Link
                      href={item.url}
                      className={cn(
                        "group flex items-center rounded-lg py-2.5 text-sm font-medium transition-all relative",
                        collapsed ? "justify-center px-0 mx-2" : "gap-3 px-3",
                        isActive
                          ? "text-[#f5f5f5]"
                          : "text-[#a1a1a1] hover:text-white"
                      )}
                    >

                      <Icon className={cn(collapsed ? "w-[22px] h-[22px]" : "w-[18px] h-[18px]", "shrink-0 transition-all duration-300", isActive ? "text-[#f5f5f5]" : "text-[#a1a1a1] group-hover:text-white")} />
                      <div className={cn(
                        "flex-1 flex items-center justify-between transition-all duration-300 overflow-hidden whitespace-nowrap ml-3",
                        collapsed ? "w-0 opacity-0 ml-0" : "w-full opacity-100"
                      )}>
                        <span className="truncate">{item.title}</span>
                        {"badge" in item && item.badge && (
                          <span className={cn(
                            "text-[10px] font-semibold bg-accent/20 text-accent px-1.5 py-0.5 rounded-md ml-2",
                            (item.title === "Ad Bookings" && pendingCount === 0) || 
                            (item.title === "Orders" && pendingOrdersCount === 0) ||
                            (item.title === "Service Requests" && pendingConstructionCount === 0) ? "hidden" : ""
                          )}>
                            {item.title === "Ad Bookings" 
                              ? pendingCount 
                              : item.title === "Orders" 
                                ? pendingOrdersCount 
                                : item.title === "Service Requests"
                                  ? pendingConstructionCount
                                  : item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
