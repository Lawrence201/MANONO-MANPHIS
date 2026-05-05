import { type ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: ReactNode;
  change?: number;
  trend?: "up" | "down";
  icon?: ReactNode;
  accent?: "primary" | "accent" | "warm" | "info";
  sparkline?: number[];
}

const accentClasses = {
  primary: "bg-gradient-primary",
  accent: "bg-gradient-accent",
  warm: "bg-gradient-warm",
  info: "bg-info",
};

export function KpiCard({ label, value, change, trend, icon, accent = "primary", sparkline }: KpiCardProps) {
  const isUp = trend === "up";
  return (
    <div className="group relative bg-card rounded-xl border border-border p-5 transition-all duration-300 overflow-hidden">
      <div className="flex items-start justify-between gap-3 relative">
        <div className="space-y-2 min-w-0">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold font-display tracking-tight">{value}</div>

        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground bg-secondary shrink-0 border border-border">
            {icon}
          </div>
        )}
      </div>

      {sparkline && (
        <div className="mt-4 flex items-end gap-0.5 h-8">
          {sparkline.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-accent/20 group-hover:bg-accent/40 transition-colors"
              style={{ height: `${(v / Math.max(...sparkline)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
