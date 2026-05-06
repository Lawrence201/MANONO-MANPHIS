"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, FileText, ShoppingCart, CreditCard,
  Receipt, Package, Truck, BarChart3, Globe2, Settings,
  Sparkles, FileBarChart, ShieldCheck, Map, Ship, UserCog,
  ScrollText, Bell, Workflow, Factory, MessageSquare,
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
    label: "Sales & CRM",
    items: [
      { title: "Leads & CRM", url: "/leads", icon: Users, badge: "12" },
      { title: "Quotations", url: "/quotations", icon: FileText },
      { title: "Customers", url: "/customers", icon: Globe2 },
      { title: "Communications", url: "/communications", icon: MessageSquare, badge: "2" },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Orders", url: "/orders", icon: ShoppingCart, badge: "8" },
      { title: "Inventory", url: "/inventory", icon: Package },
      { title: "Logistics", url: "/logistics", icon: Truck },
      { title: "Production", url: "/production", icon: Factory },
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
    label: "Compliance",
    items: [
      { title: "Documents", url: "/documents", icon: ShieldCheck },
    ],
  },
  {
    label: "Trade Management",
    items: [
      { title: "Countries & Regions", url: "/regions", icon: Map },
      { title: "Shipping Rules", url: "/shipping-rules", icon: Ship },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Users & Roles", url: "/users", icon: UserCog },
      { title: "Activity Logs", url: "/activity", icon: ScrollText },
      { title: "Settings", url: "/settings", icon: Settings },
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
          src="/logo.png" 
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
                const isActive =
                  item.url === "/" ? pathname === "/" : pathname?.startsWith(item.url);
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
                          <span className="text-[10px] font-semibold bg-accent/20 text-accent px-1.5 py-0.5 rounded-md ml-2">
                            {item.badge}
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
