"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { consumables } from "@/lib/mock-data";
import { Plus, AlertCircle, Package2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OperationsInventoryPage() {
  const lowStock = consumables.filter(c => c.stock <= c.reorderAt);

  return (
    <AppLayout
      title="Operations Inventory"
      subtitle="Stock levels, reorder thresholds and supplier records for every consumable."
      actions={
        <Button size="sm" className="gap-1.5 h-9 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm">
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      }
    >
      <div className="space-y-6">
        {lowStock.length > 0 && (
          <Card className="border-amber-200 dark:border-amber-500/30 bg-amber-500/5 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-500/15 flex items-center justify-center shadow-inner">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-foreground">
                    {lowStock.length} item(s) at or below reorder threshold
                  </div>
                  <div className="text-[11px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wider">
                    {lowStock.map(c => c.name).join(" · ")}
                  </div>
                </div>
                <Button size="sm" variant="outline" className="h-9 gap-1.5 font-bold text-xs border-amber-200 dark:border-amber-500/30 hover:bg-amber-500/10">
                  <ShoppingCart className="h-3.5 w-3.5" /> Create PO
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {consumables.map(c => {
            const low = c.stock <= c.reorderAt;
            const pct = Math.min(100, (c.stock / (c.reorderAt * 2)) * 100);
            return (
              <Card key={c.id} className="border-border/60 shadow-sm transition-all hover:shadow-md duration-300 overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-secondary/50 flex items-center justify-center border border-border/40">
                        <Package2 className="h-4.5 w-4.5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">{c.category}</div>
                        <div className="font-bold text-[13px] text-foreground truncate max-w-[120px]">{c.name}</div>
                      </div>
                    </div>
                    {low && (
                      <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    )}
                  </div>
                  
                  <div className="flex items-end justify-between mt-6">
                    <div>
                      <div className={cn(
                        "font-display text-3xl font-black leading-none tracking-tighter",
                        low ? "text-rose-500" : "text-foreground"
                      )}>
                        {c.stock}
                        <span className="text-sm font-bold text-muted-foreground ml-1.5 lowercase">{c.unit}</span>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2">
                        Reorder at {c.reorderAt}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-foreground tabular-nums">${(c.stock * c.unitCost).toFixed(0)}</div>
                      <div className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest mt-1">Stock Value</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 relative h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div 
                      className={cn(
                        "absolute inset-y-0 left-0 transition-all duration-1000",
                        low ? "bg-rose-400" : pct > 60 ? "bg-[#6aabfc]" : "bg-amber-400"
                      )} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                    <div className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest">
                      {c.supplier}
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#6aabfc]">
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
