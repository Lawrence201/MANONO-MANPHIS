import { recentActivities } from "@/lib/mock-data";
import { CreditCard, Users, Truck, FileText, ShoppingCart, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  payment: { icon: CreditCard, color: "text-success bg-success/10" },
  lead: { icon: Users, color: "text-info bg-info/10" },
  shipment: { icon: Truck, color: "text-chart-1 bg-chart-1/10" },
  quote: { icon: FileText, color: "text-chart-3 bg-chart-3/10" },
  order: { icon: ShoppingCart, color: "text-accent bg-accent/10" },
  alert: { icon: AlertTriangle, color: "text-warning bg-warning/10" },
};

export function ActivityFeed() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-semibold text-base">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live feed across the platform</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Live
        </span>
      </div>
      <ul className="space-y-1">
        {recentActivities.map((a) => {
          const cfg = iconMap[a.icon as keyof typeof iconMap];
          const Icon = cfg.icon;
          return (
            <li key={a.id} className="flex items-start gap-3 py-2.5 px-2 -mx-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs leading-relaxed">{a.text}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{a.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
