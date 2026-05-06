"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/mock-data";
import { Plus, AlertTriangle, Package, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = new Intl.NumberFormat("en-US");

export default function InventoryPage() {
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalReserved = products.reduce((s, p) => s + p.reserved, 0);
  const lowStock = products.filter(p => (p.stock - p.reserved) < 3000).length;

  const chartData = products.map(p => ({
    name: p.name.split(" ").slice(0, 2).join(" "),
    available: p.stock - p.reserved,
    reserved: p.reserved,
  }));

  return (
    <AppLayout
      title="Inventory Management"
      subtitle="Track stock levels, reservations, and product grades across your warehouse"
      actions={
        <Button size="sm" className="gap-2 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm"><Plus className="w-4 h-4" /> Add Stock</Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Stock" value={`${fmt.format(totalStock)} kg`} hint="across all products" icon={<Package className="w-5 h-5" />} />
        <Stat label="Available" value={`${fmt.format(totalStock - totalReserved)} kg`} hint="ready for orders" icon={<TrendingUp className="w-5 h-5" />} accent />
        <Stat label="Reserved" value={`${fmt.format(totalReserved)} kg`} hint="allocated to orders" />
        <Stat label="Low Stock Alert" value={lowStock.toString()} hint="products below threshold" warning />
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
        <div className="mb-5">
          <h3 className="font-display font-semibold text-base">Stock Levels by Product</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Available vs reserved inventory</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => `${fmt.format(v)} kg`} />
            <Bar dataKey="available" stackId="a" fill="var(--color-chart-2)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="reserved" stackId="a" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border bg-[#f8f9fa] dark:bg-[#181818] transition-colors">
              <th className="font-medium px-5 py-3">Product</th>
              <th className="font-medium px-5 py-3">Category</th>
              <th className="font-medium px-5 py-3">Grade</th>
              <th className="font-medium px-5 py-3">Total Stock</th>
              <th className="font-medium px-5 py-3">Reserved</th>
              <th className="font-medium px-5 py-3">Available</th>
              <th className="font-medium px-5 py-3">Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const available = p.stock - p.reserved;
              const pct = (available / p.stock) * 100;
              const low = available < 3000;
              return (
                <tr key={p.id} className="border-b border-black/[0.08] dark:border-white/[0.06] last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-xs flex items-center gap-2">
                      {p.name}
                      {low && <AlertTriangle className="w-3 h-3 text-warning" />}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider",
                      p.grade === "Premium" ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"
                    )}>{p.grade}</span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">{fmt.format(p.stock)} kg</td>
                  <td className="px-5 py-3.5 tabular-nums text-xs text-muted-foreground">{fmt.format(p.reserved)} kg</td>
                  <td className={cn("px-5 py-3.5 font-semibold tabular-nums text-xs", low && "text-warning")}>{fmt.format(available)} kg</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", low ? "bg-warning" : "bg-gradient-accent")} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums w-8">{pct.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value, hint, icon, accent, warning }: { label: string; value: string; hint: string; icon?: React.ReactNode; accent?: boolean; warning?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className={cn("text-2xl font-bold font-display mt-2", accent && "text-gradient-accent", warning && "text-warning")}>{value}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
        </div>
        {icon && <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">{icon}</div>}
      </div>
    </div>
  );
}
