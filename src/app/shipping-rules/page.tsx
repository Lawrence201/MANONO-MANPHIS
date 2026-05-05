"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { shippingRules } from "@/lib/mock-data";
import { Plus, Ship, Plane, Truck, Zap, Edit } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const methodIcon: Record<string, React.ElementType> = {
  "Sea Freight": Ship,
  "Air Freight": Plane,
  "Express Courier": Zap,
  "Road": Truck,
};

const methodColor: Record<string, string> = {
  "Sea Freight": "text-primary bg-primary/10",
  "Air Freight": "text-accent bg-accent/10",
  "Express Courier": "text-warning bg-warning/10",
  "Road": "text-success bg-success/10",
};

export default function ShippingRulesPage() {
  return (
    <AppLayout
      title="Shipping Rules"
      subtitle="Define freight rates, transit times and zone-based pricing for all shipping methods"
      actions={
        <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> New Rule</Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Rules" value={shippingRules.filter(r => r.active).length.toString()} hint="currently applied" />
        <StatCard label="Shipping Zones" value="4" hint="A · B · C · D" accent />
        <StatCard label="Avg Sea Rate" value="$0.62/kg" hint="per kilogram" />
        <StatCard label="Avg Air Rate" value="$3.38/kg" hint="per kilogram" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {shippingRules.map((rule) => {
          const Icon = methodIcon[rule.method] || Ship;
          return (
            <div key={rule.id} className="bg-card rounded-xl border border-border p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${methodColor[rule.method]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{rule.name}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{rule.id} · {rule.zone}</div>
                  </div>
                </div>
                <Switch checked={rule.active} />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Base Rate</div>
                  <div className="text-lg font-bold font-display tabular-nums">${rule.baseRate}</div>
                </div>
                <div className="bg-secondary/50 rounded-lg p-3">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Per kg</div>
                  <div className="text-lg font-bold font-display tabular-nums">${rule.perKg}</div>
                </div>
              </div>

              <div className="space-y-2 text-xs mb-4">
                <Row label="Weight Range" value={`${rule.minWeight} – ${rule.maxWeight.toLocaleString()} kg`} />
                <Row label="Transit Time" value={`${rule.transitDays} days`} />
                <Row label="Method" value={rule.method} />
              </div>

              <Button variant="outline" size="sm" className="w-full gap-2 h-8"><Edit className="w-3 h-3" /> Edit Rule</Button>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatCard({ label, value, hint, accent }: { label: string; value: string; hint: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold font-display mt-2 ${accent ? "text-gradient-accent" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
