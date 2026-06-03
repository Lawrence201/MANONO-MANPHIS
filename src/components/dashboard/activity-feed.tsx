"use client";
import React, { useState, useEffect } from "react";
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

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHr / 24);

  if (diffSec < 60) return "Just now";
  if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

interface ActivityItem {
  id: string;
  type: string;
  icon: string;
  text: string;
  createdAt: string;
}

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch("/api/dashboard/activities");
        const result = await response.json();
        if (result.success && result.data) {
          setActivities(result.data);
        }
      } catch (err) {
        console.error("Failed to load dashboard activities:", err);
      } finally {
        setLoading(false);
      }
    }
    loadActivities();
  }, []);

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card flex flex-col">
      <div className="flex items-center justify-between mb-5 shrink-0">
        <div>
          <h3 className="font-display font-semibold text-base">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live feed across the platform</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-success">
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          Live
        </span>
      </div>
      {loading ? (
        <div className="text-center py-8 text-xs text-muted-foreground font-semibold">
          Loading live feed...
        </div>
      ) : (
        <div className="overflow-y-auto custom-scrollbar pr-2" style={{ maxHeight: "320px" }}>
          <ul className="space-y-1">
            {activities.map((a) => {
              const cfg = iconMap[a.icon as keyof typeof iconMap] || iconMap.order;
              const Icon = cfg.icon;
              const isExportOrder = a.text.toLowerCase().includes("export order") || a.icon === "export";
              const isCashew = a.text.toLowerCase().includes("cashew");
              const isBillboard = a.text.toLowerCase().includes("billboard") || a.icon === "billboard";

              const hasCustomImage = isExportOrder || isBillboard;
              let customImageSrc = "/export.PNG";
              if (isBillboard) customImageSrc = "/bill_board_notification.PNG";
              else if (isExportOrder && isCashew) customImageSrc = "/cashew_notification.PNG";

              return (
                <li key={a.id} className="flex items-start gap-3 py-2.5 px-2 -mx-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  {hasCustomImage ? (
                    <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0 overflow-hidden bg-gray-100">
                      <img src={customImageSrc} alt="Activity" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", cfg.color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs leading-relaxed">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{formatRelativeTime(a.createdAt)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
