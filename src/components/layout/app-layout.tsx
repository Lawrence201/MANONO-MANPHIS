"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { AppSidebar } from "./app-sidebar";
import { 
  Search, Bell, Menu, Moon, Sun, ChevronDown, Plus, Clock, LayoutGrid, X, 
  Building2, LayoutDashboard, Sparkles, TrendingUp, CreditCard, FileText, 
  BarChart3, ShieldCheck, Monitor, Droplets, Nut, Leaf, PlusCircle, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-secondary/50 dark:bg-secondary/30 rounded-lg border border-border/60 dark:border-border/50">
      <Clock className="w-4 h-4 text-muted-foreground" />
      <div className="flex flex-col -space-y-1">
        <span className="text-[11px] font-bold text-foreground dark:text-white tabular-nums uppercase whitespace-nowrap">
          {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
        </span>
        <span className="text-[9px] font-medium text-muted-foreground dark:text-[#6c7889] tabular-nums whitespace-nowrap">
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

export function AppLayout({ children, title, subtitle, actions }: {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(true);
  const [dark, setDark] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className={cn("h-screen w-full flex bg-background text-foreground overflow-hidden", dark && "dark")}>
      <div 
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className="h-full flex shrink-0 transition-all duration-300 ease-in-out"
      >
        <AppSidebar collapsed={collapsed} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 border-b border-border bg-white dark:bg-[#181818] flex items-center px-4 gap-4 sticky top-0 z-30 shadow-sm transition-colors shrink-0">
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className="lg:hidden text-foreground">
            <Menu className="w-5 h-5" />
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search leads, orders, customers, invoices..."
              className="pl-9 h-9 bg-secondary/50 dark:bg-secondary/30 border border-transparent focus-visible:bg-white dark:focus-visible:bg-card focus-visible:border-accent/50 focus-visible:ring-4 focus-visible:ring-accent/10 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-background border border-border rounded px-1.5 py-0.5 text-muted-foreground">⌘K</kbd>
          </div>

          <div className="flex-1" />

          <LiveClock />

          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 text-muted-foreground hover:text-foreground">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button variant="ghost" size="icon" className="h-9 w-9 relative text-muted-foreground hover:text-foreground">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#6aabfc] rounded-full animate-pulse-glow" />
          </Button>

          <div className="h-8 w-px bg-border" />

          <button className="flex items-center gap-2.5 hover:bg-secondary rounded-lg pl-1 pr-2 py-1 transition-colors group">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white shadow-sm">
              SC
            </div>
            <div className="text-left hidden md:block">
              <div className="text-xs font-semibold text-foreground leading-none">Sarah Chen</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Sales Manager</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          <div className="h-8 w-px bg-border ml-2" />

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className={cn(
              "h-10 w-10 transition-all group/menu rounded-lg border shadow-sm",
              rightSidebarOpen 
                ? "bg-accent text-white border-accent hover:bg-accent/90" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary dark:hover:bg-white/5 border-[#68a9fb]"
            )}
          >
            {rightSidebarOpen ? (
              <X className="w-5 h-5 animate-in spin-in-90 duration-300" />
            ) : (
              <LayoutGrid className="w-5 h-5 group-hover/menu:scale-110 transition-transform" />
            )}
          </Button>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {/* Page header */}
          {(title || actions) && (
            <div className="px-8 pt-8 pb-2 flex items-start justify-between gap-4 flex-wrap">
              <div>
                {title && <h1 className="text-2xl font-bold tracking-tight font-display">{title}</h1>}
                {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          )}

          {/* Content */}
          <main className="px-8 py-6 animate-fade-in-up">
            {children}
          </main>
        </div>
      </div>
      {rightSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-500" 
          onClick={() => setRightSidebarOpen(false)}
        />
      )}
      <RightSidebar open={rightSidebarOpen} onClose={() => setRightSidebarOpen(false)} dark={dark} />
    </div>
  );
}

function RightSidebar({ open, onClose, dark }: { open: boolean, onClose: () => void, dark: boolean }) {
  return (
    <div 
      className={cn(
        "fixed top-0 right-0 h-full border-l transition-all duration-500 ease-in-out overflow-hidden shrink-0 z-50",
        dark ? "bg-[#19191b] border-white/5 shadow-2xl" : "bg-white border-border shadow-lg",
        open ? "w-[300px]" : "w-0 border-l-0"
      )}
    >
      <div className={cn(
        "w-[300px] h-full flex flex-col",
        dark ? "text-white" : "text-foreground"
      )}>
        {/* Sidebar Header from Image */}
        <div className="p-6 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#3b82f6] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Website Control</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-[#a1a1a1] mt-0.5">Administration Console</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center transition-all group",
              dark ? "border-white/10 hover:bg-white/5" : "border-border hover:bg-secondary"
            )}
          >
            <X className={cn("w-5 h-5 transition-colors", dark ? "text-white/70 group-hover:text-white" : "text-muted-foreground group-hover:text-foreground")} />
          </button>
        </div>

        <div className={cn("h-px mx-6 mb-6", dark ? "bg-white/5" : "bg-border")} />

        <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-very-thin">
          <div className="space-y-8">
            {/* Products Group */}
            <div>
              <div className={cn(
                "text-[10px] uppercase tracking-widest font-semibold mb-4 px-4",
                dark ? "text-[#a1a1a1]/40" : "text-muted-foreground/60"
              )}>
                Products
              </div>
              <nav className="space-y-1">
                {[
                  { label: 'Digital Billboards', icon: Monitor },
                  { label: 'Honey', icon: Droplets },
                  { label: 'Cashew', icon: Nut },
                  { label: 'Sheabutter', icon: Leaf },
                ].map((item, idx) => (
                  <button 
                    key={idx} 
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group",
                      dark ? "text-[#a1a1a1] hover:text-white" : "text-slate-600 hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5 transition-colors", dark ? "text-[#a1a1a1] group-hover:text-white" : "text-slate-500 group-hover:text-foreground")} />
                    <span className="text-sm font-medium tracking-tight">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            {/* Management Group */}
            <div>
              <div className={cn(
                "text-[10px] uppercase tracking-widest font-semibold mb-4 px-4",
                dark ? "text-[#a1a1a1]/40" : "text-muted-foreground/60"
              )}>
                Management
              </div>
              <nav className="space-y-1">
                {[
                  { label: 'Add Digital Billboards', icon: Monitor, url: '/inventory/billboards/add' },
                  { label: 'Add Honey', icon: Droplets, url: '#' },
                  { label: 'Add Cashew', icon: Nut, url: '#' },
                  { label: 'Add Sheabutter', icon: Leaf, url: '#' },
                ].map((item, idx) => (
                  <Link 
                    key={idx} 
                    href={item.url}
                    className={cn(
                      "w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group",
                      dark ? "text-[#a1a1a1] hover:text-white" : "text-slate-600 hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    <div className="relative">
                      <item.icon className={cn("w-5 h-5 transition-colors", dark ? "text-[#a1a1a1]/60 group-hover:text-white" : "text-slate-500 group-hover:text-foreground")} />
                      <Plus className={cn(
                        "absolute -top-1 -right-1 w-2.5 h-2.5 stroke-[4px] transition-all",
                        dark ? "text-[#a1a1a1] opacity-70 group-hover:opacity-100 group-hover:text-white" : "text-slate-500 group-hover:text-foreground"
                      )} />
                    </div>
                    <span className="text-sm font-medium tracking-tight">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
