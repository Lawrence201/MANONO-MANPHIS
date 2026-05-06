import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { notifications } from "@/lib/mock-data";
import { Bell, CheckCheck, DollarSign, Truck, Users, ShieldAlert, Package, Settings, Check } from "lucide-react";

const catIcon: Record<string, { i: React.ElementType; color: string; bg: string }> = {
  payment: { i: DollarSign, color: "text-success", bg: "bg-success/10" },
  shipment: { i: Truck, color: "text-primary", bg: "bg-primary/10" },
  lead: { i: Users, color: "text-accent", bg: "bg-accent/10" },
  compliance: { i: ShieldAlert, color: "text-warning", bg: "bg-warning/10" },
  stock: { i: Package, color: "text-warning", bg: "bg-warning/10" },
  system: { i: Settings, color: "text-muted-foreground", bg: "bg-secondary" },
};

export default function NotificationsPage() {
  const unread = notifications.filter(n => !n.read).length;

  return (
    <AppLayout
      title="Notifications Center"
      subtitle="All system alerts, updates and notifications in one unified inbox"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Settings className="w-4 h-4" /> Preferences</Button>
          <Button size="sm" className="gap-2"><CheckCheck className="w-4 h-4" /> Mark all read</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Unread" value={unread.toString()} hint="needs attention" accent />
        <StatCard label="High Priority" value={notifications.filter(n => n.priority === "high").length.toString()} hint="action required" warning />
        <StatCard label="Today" value="6" hint="last 24 hours" />
        <StatCard label="This Week" value="42" hint="all categories" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories sidebar */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-card h-fit">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Categories</h3>
          <ul className="space-y-1">
            {[
              { label: "All", icon: Bell, count: notifications.length, active: true },
              { label: "Payments", icon: DollarSign, count: notifications.filter(n => n.category === "payment").length },
              { label: "Shipments", icon: Truck, count: notifications.filter(n => n.category === "shipment").length },
              { label: "Leads", icon: Users, count: notifications.filter(n => n.category === "lead").length },
              { label: "Compliance", icon: ShieldAlert, count: notifications.filter(n => n.category === "compliance").length },
              { label: "Inventory", icon: Package, count: notifications.filter(n => n.category === "stock").length },
              { label: "System", icon: Settings, count: notifications.filter(n => n.category === "system").length },
            ].map((c) => {
              const Ci = c.icon;
              return (
                <li key={c.label}>
                  <button className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition-colors ${c.active ? "bg-secondary font-semibold" : "hover:bg-secondary/50 text-muted-foreground"}`}>
                    <Ci className="w-3.5 h-3.5" />
                    <span className="flex-1 text-left">{c.label}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{c.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Notifications list */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="divide-y divide-border">
            {notifications.map((n) => {
              const c = catIcon[n.category as keyof typeof catIcon];
              const Ci = c.i;
              return (
                <div key={n.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors ${!n.read ? "bg-primary/[0.03]" : ""}`}>
                  <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}>
                    <Ci className={`w-4 h-4 ${c.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-semibold text-sm">{n.title}</div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />}
                      {n.priority === "high" && <span className="text-[9px] font-bold uppercase bg-destructive/10 text-destructive px-1.5 py-0.5 rounded">High</span>}
                    </div>
                    <div className="text-xs text-muted-foreground">{n.message}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{n.time}</div>
                  </div>
                  {!n.read && (
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1"><Check className="w-3 h-3" /> Mark read</Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ label, value, hint, accent, warning }: { label: string; value: string; hint: string; accent?: boolean; warning?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold font-display mt-2 ${accent ? "text-gradient-accent" : warning ? "text-warning" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
