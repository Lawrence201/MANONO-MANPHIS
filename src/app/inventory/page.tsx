"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { getGlobalInventory } from "@/lib/actions/product-actions";
import { Plus, AlertTriangle, Package, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const fmt = new Intl.NumberFormat("en-US");

export default function InventoryPage() {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await getGlobalInventory();
      if (res.success && res.data) {
        setAllProducts(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const products = allProducts.filter(p => {
    if (activeTab === "all") return true;
    const cat = p.category.toLowerCase();
    const name = p.name.toLowerCase();
    
    if (activeTab === "honey") return name.includes('honey') || cat.includes('raw') || cat.includes('processed') || cat.includes('wild');
    if (activeTab === "cashew") return name.includes('cashew') || cat.includes('rcn') || cat.includes('kernel') || cat.includes('roasted');
    if (activeTab === "sheabutter") return name.includes('shea') || cat.includes('butter');
    return true;
  });

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const totalReserved = products.reduce((s, p) => s + p.reserved, 0);
  const lowStock = products.filter(p => (p.stock - p.reserved) < 3000).length;

  const chartData = products.map(p => {
    const n = p.name.toLowerCase();
    const c = p.category.toLowerCase();
    let color = "var(--color-chart-2)";
    let darkColor = "var(--color-chart-3)";
    
    if (n.includes('cashew') || c.includes('rcn') || c.includes('kernel') || c.includes('roasted')) {
      color = "#8bbdfc"; // Light blue for cashew available
      darkColor = "#3b82f6"; // Darker blue for cashew ordered
    } else if (n.includes('honey') || c.includes('raw') || c.includes('processed') || c.includes('wild')) {
      color = "#d97706"; 
      darkColor = "#fbbf24"; 
    } else if (n.includes('shea') || c.includes('butter')) {
      color = "#34d399"; // Emerald for sheabutter available
      darkColor = "#059669"; // Darker emerald for ordered
    }

    return {
      name: p.name.split(" ").slice(0, 2).join(" "),
      available: p.stock - p.reserved,
      ordered: p.reserved,
      color,
      darkColor
    };
  });

  return (
    <AppLayout
      title="Inventory Management"
      subtitle="Track stock levels, reservations, and product grades across your warehouse"
    >
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
        {["all", "honey", "cashew", "sheabutter"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize",
              activeTab === tab 
                ? "bg-[#6aabfc] text-white shadow-lg scale-105" 
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            )}
          >
            {tab === "all" ? "All Inventory" : tab === "sheabutter" ? "Shea Butter" : tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Stock" value={`${fmt.format(totalStock)}`} hint="across all products" icon={<Package className="w-5 h-5" />} />
        <Stat label="Available" value={`${fmt.format(totalStock - totalReserved)}`} hint="ready for orders" icon={<TrendingUp className="w-5 h-5" />} accent />
        <Stat label="Ordered" value={`${fmt.format(totalReserved)}`} hint="allocated to orders" />
        <Stat label="Low Stock Alert" value={lowStock.toString()} hint="products below threshold" warning />
      </div>

      {/* Chart */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
        <div className="mb-5">
          <h3 className="font-display font-semibold text-base">Stock Levels by Product</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Available vs ordered inventory</p>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => `${fmt.format(v)}`} />
            <Bar dataKey="available" stackId="a" radius={[0, 0, 4, 4]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-avail-${index}`} fill={entry.color || "var(--color-chart-2)"} />
              ))}
            </Bar>
            <Bar dataKey="ordered" stackId="a" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-order-${index}`} fill={entry.darkColor || "var(--color-chart-3)"} />
              ))}
            </Bar>
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
              <th className="font-medium px-5 py-3">Package Unit</th>
              <th className="font-medium px-5 py-3">Total Stock</th>
              <th className="font-medium px-5 py-3">Ordered</th>
              <th className="font-medium px-5 py-3">Available</th>
              <th className="font-medium px-5 py-3">Stock Level</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-5 py-20 text-center text-muted-foreground text-sm">
                  Fetching live inventory from database...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-20 text-center text-muted-foreground text-sm">
                  No products found. Start by adding stock.
                </td>
              </tr>
            ) : products.map((p) => {
              const available = p.stock - p.reserved;
              const pct = p.stock > 0 ? (available / p.stock) * 100 : 0;
              const low = available < 3000;
              
              const n = p.name.toLowerCase();
              const c = p.category.toLowerCase();
              let barColor = "bg-gradient-accent";
              let textColor = "";
              let isCashew = false;
              
              if (n.includes('cashew') || c.includes('rcn') || c.includes('kernel') || c.includes('roasted')) {
                barColor = "bg-[#6aabfc]";
                textColor = "text-[#6aabfc]";
                isCashew = true;
              }
              else if (n.includes('honey') || c.includes('raw') || c.includes('processed') || c.includes('wild')) barColor = "bg-amber-400";
              else if (n.includes('shea') || c.includes('butter')) barColor = "bg-emerald-400";
              
              let basePkg = (p.packageType || 'Unit').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
              if (basePkg.toLowerCase().includes('drum')) basePkg = 'Steel Drum';
              
              const pkgDisplay = basePkg;
              const pkgPlural = basePkg.endsWith('s') ? basePkg : basePkg + 's';

              return (
                <tr key={p.id} className="border-b border-black/[0.08] dark:border-white/[0.06] last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt={p.name} className="w-9 h-9 rounded-md object-cover border border-border shadow-sm shrink-0 bg-white" />
                      ) : (
                        <div className="w-9 h-9 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0 shadow-sm">
                          <span className="text-[10px] font-bold text-muted-foreground">{p.name.substring(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                      <div className="font-medium text-xs flex items-center gap-2">
                        {p.name}
                        {(low && !isCashew) && <AlertTriangle className="w-3 h-3 text-warning" />}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{p.category}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider bg-muted text-muted-foreground">
                      {pkgDisplay}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">
                    <div>{fmt.format(p.stock)} {p.unit}</div>
                    {p.packagesTotal > 0 && <div className="text-[10px] text-muted-foreground font-normal mt-0.5">{fmt.format(p.packagesTotal)} {p.packagesTotal !== 1 ? pkgPlural : pkgDisplay}</div>}
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-xs text-muted-foreground">
                    <div>{fmt.format(p.reserved)} {p.unit}</div>
                    {p.packagesReserved > 0 && <div className="text-[10px] font-normal mt-0.5">{fmt.format(p.packagesReserved)} {p.packagesReserved !== 1 ? pkgPlural : pkgDisplay}</div>}
                  </td>
                  <td className={cn("px-5 py-3.5 font-semibold tabular-nums text-xs", (low && !isCashew) ? "text-warning" : textColor)}>
                    <div>{fmt.format(available)} {p.unit}</div>
                    {p.packagesAvailable > 0 && <div className={cn("text-[10px] font-normal mt-0.5", (low && !isCashew) ? "" : (isCashew ? "opacity-80" : "text-muted-foreground"))}>{fmt.format(p.packagesAvailable)} {p.packagesAvailable !== 1 ? pkgPlural : pkgDisplay}</div>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full", (low && !isCashew) ? "bg-warning" : barColor)} style={{ width: `${pct}%` }} />
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
