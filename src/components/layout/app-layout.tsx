"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { Search, Bell, Menu, Moon, Sun, ChevronDown, Plus, Clock } from "lucide-react";
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
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className={cn("h-screen w-full flex bg-background text-foreground overflow-hidden", dark && "dark")}>
      <AppSidebar collapsed={collapsed} />

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
    </div>
  );
}
