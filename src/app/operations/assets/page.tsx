"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusPill } from "@/components/operations/status-pill";
import { assets } from "@/lib/mock-data";
import { Plus, Filter, QrCode, Download, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AssetsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  
  const cats = useMemo(() => ["all", ...Array.from(new Set(assets.map(a => a.category)))], []);
  
  const filtered = useMemo(() => assets.filter(a =>
    (cat === "all" || a.category === cat) &&
    (q === "" || a.name.toLowerCase().includes(q.toLowerCase()) || a.tag.toLowerCase().includes(q.toLowerCase()))
  ), [q, cat]);

  return (
    <AppLayout
      title="Asset Registry"
      subtitle="Every tracked asset across hostels, halls, kitchens, vehicles and ministry equipment."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <QrCode className="h-4 w-4" /> Scan
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-1.5 h-9 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm">
            <Plus className="h-4 w-4" /> New Asset
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  value={q} 
                  onChange={e => setQ(e.target.value)} 
                  placeholder="Search by name, tag or serial…" 
                  className="pl-9 h-10 bg-secondary/30 border-transparent focus-visible:bg-background transition-all" 
                />
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground uppercase tracking-wider whitespace-nowrap mr-2">
                  <Filter className="h-3.5 w-3.5" /> Filter:
                </div>
                {cats.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setCat(c)} 
                    className={cn(
                      "h-8 px-4 rounded-full text-xs font-bold transition-all whitespace-nowrap",
                      cat === c 
                        ? "bg-[#6aabfc] text-white shadow-sm" 
                        : "bg-secondary/50 hover:bg-secondary text-muted-foreground"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 border-b border-border transition-colors">
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tag</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Details</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Category</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Location</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Condition</th>
                  <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Value</th>
                  <th className="px-5 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-5 py-4 font-mono text-[10px] font-bold text-muted-foreground/70">{a.tag}</td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-foreground">{a.name}</div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">SN: {a.serial}</div>
                    </td>
                    <td className="px-5 py-4 font-medium text-muted-foreground">{a.category}</td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-foreground/90">{a.facility}</div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{a.location}</div>
                    </td>
                    <td className="px-5 py-4"><StatusPill status={a.status} /></td>
                    <td className="px-5 py-4"><StatusPill status={a.condition} /></td>
                    <td className="px-5 py-4 text-right font-black tabular-nums">${a.currentValue.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-3">
                        <div className="w-16 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all duration-1000",
                              a.healthScore >= 85 ? "bg-[#6aabfc]" : 
                              a.healthScore >= 60 ? "bg-amber-400" : 
                              a.healthScore > 0 ? "bg-rose-400" : "bg-muted"
                            )} 
                            style={{ width: `${a.healthScore}%` }} 
                          />
                        </div>
                        <span className="text-[11px] font-bold tabular-nums w-6 text-muted-foreground">{a.healthScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-20 text-center">
                      <div className="inline-flex flex-col items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
                          <Search className="h-5 w-5 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-bold text-muted-foreground">No assets match your filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 bg-secondary/10 border-t border-border flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Showing {filtered.length} of {assets.length} assets
            </span>
            <span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
              Total value: <span className="text-[#6aabfc] ml-1">${filtered.reduce((s, a) => s + a.currentValue, 0).toLocaleString()}</span>
            </span>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

import { cn } from "@/lib/utils";
