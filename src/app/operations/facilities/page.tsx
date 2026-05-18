"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { facilities } from "@/lib/mock-data";
import { Building2, Users, Package, Plus, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FacilitiesPage() {
  return (
    <AppLayout
      title="Facilities"
      subtitle="Every building, hall, lodge and utility room — with live health and asset distribution."
      actions={
        <Button size="sm" className="gap-1.5 h-9 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm">
          <Plus className="h-4 w-4" /> Add Facility
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {facilities.map(f => (
          <Card key={f.id} className="overflow-hidden group hover:shadow-glow transition-all duration-300 border-border/60">
            {/* Header with gradient */}
            <div className="h-32 bg-gradient-primary relative">
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_70%)]" />
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-sm">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/90 px-3 py-1.5 rounded-full bg-black/10 backdrop-blur-md border border-white/10 shadow-inner">
                  {f.type}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="font-display text-xl font-bold text-white tracking-tight">{f.name}</div>
              </div>
            </div>
            
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/70 uppercase tracking-wider">
                  <MapPin className="h-3.5 w-3.5 text-[#6aabfc]" /> 
                  Manager: <span className="text-foreground font-black">{f.manager}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-secondary/40 p-3 border border-border/40 transition-colors group-hover:bg-secondary/60">
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                    <Users className="h-3 w-3" /> Capacity
                  </div>
                  <div className="font-display text-lg font-black text-foreground">{f.capacity || "—"}</div>
                </div>
                
                <div className="rounded-xl bg-secondary/40 p-3 border border-border/40 transition-colors group-hover:bg-secondary/60">
                  <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">
                    <Package className="h-3 w-3" /> Assets
                  </div>
                  <div className="font-display text-lg font-black text-foreground">{f.assetCount}</div>
                </div>
                
                <div className="rounded-xl bg-secondary/40 p-3 border border-border/40 transition-colors group-hover:bg-secondary/60">
                  <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Health</div>
                  <div className={cn(
                    "font-display text-lg font-black mt-0.5",
                    f.healthScore >= 85 ? "text-[#6aabfc]" : f.healthScore >= 70 ? "text-amber-500" : "text-rose-500"
                  )}>
                    {f.healthScore}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 relative h-1.5 w-full rounded-full bg-secondary overflow-hidden border border-border/20">
                <div 
                  className={cn(
                    "absolute inset-y-0 left-0 transition-all duration-1000",
                    f.healthScore >= 85 ? "bg-[#6aabfc]" : f.healthScore >= 70 ? "bg-amber-400" : "bg-rose-400"
                  )} 
                  style={{ width: `${f.healthScore}%` }} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
