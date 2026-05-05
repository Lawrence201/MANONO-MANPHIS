"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { regions } from "@/lib/mock-data";
import { Plus, MapPin, Users, AlertOctagon, Eye, Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = new Intl.NumberFormat("en-US");

const statusBadge = {
  active: "bg-success/10 text-success",
  monitoring: "bg-warning/10 text-warning",
  restricted: "bg-destructive/10 text-destructive",
};

export default function RegionsPage() {
  const active = regions.filter(r => r.status === "active").length;
  const monitoring = regions.filter(r => r.status === "monitoring").length;
  const restricted = regions.filter(r => r.status === "restricted").length;
  const totalBuyers = regions.reduce((s, r) => s + r.buyers, 0);

  return (
    <AppLayout
      title="Countries & Regions"
      subtitle="Manage active export markets, region-based pricing rules and trade restrictions"
      actions={
        <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> Add Country</Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Markets" value={active.toString()} hint="open for trade" icon={<Globe className="w-5 h-5 text-success" />} />
        <StatCard label="Total Buyers" value={totalBuyers.toString()} hint="across regions" icon={<Users className="w-5 h-5 text-primary" />} />
        <StatCard label="Monitoring" value={monitoring.toString()} hint="restricted access" icon={<AlertOctagon className="w-5 h-5 text-warning" />} />
        <StatCard label="Restricted" value={restricted.toString()} hint="no shipments" icon={<AlertOctagon className="w-5 h-5 text-destructive" />} />
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
        <h3 className="font-display font-semibold text-base mb-1">Revenue by Country</h3>
        <p className="text-xs text-muted-foreground mb-4">Top performing markets year-to-date</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={regions.filter(r => r.revenue > 0)} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis dataKey="name" type="category" stroke="var(--color-muted-foreground)" fontSize={11} width={100} />
            <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
            <Bar dataKey="revenue" fill="var(--chart-2)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {regions.map((r) => (
          <div key={r.code} className="bg-card rounded-xl border border-border p-5 shadow-card hover:border-accent transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{r.flag}</div>
                <div>
                  <div className="font-semibold text-sm">{r.name}</div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1"><MapPin className="w-2.5 h-2.5" />{r.region}</div>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${statusBadge[r.status as keyof typeof statusBadge]}`}>{r.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-border">
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Revenue</div>
                <div className="font-bold font-display tabular-nums">${fmt.format(r.revenue)}</div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Buyers</div>
                <div className="font-bold font-display tabular-nums">{r.buyers}</div>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <Row label="Shipping Zone" value={r.shippingZone} />
              <Row label="Import Duty" value={`${r.duty}%`} />
              <Row label="Currency" value={r.currency} />
              <Row label="Lead Time" value={r.leadTime} />
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4 gap-2 h-8"><Eye className="w-3 h-3" /> Manage</Button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function StatCard({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className="text-2xl font-bold font-display mt-2">{value}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">{icon}</div>
      </div>
    </div>
  );
}
