"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/operations/status-pill";
import { incidents } from "@/lib/mock-data";
import { Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function IncidentsPage() {
  return (
    <AppLayout
      title="Incidents & Damage Reports"
      subtitle="AI-classified incident log — severity, escalation status and recommended actions."
      actions={
        <Button size="sm" className="gap-1.5 h-9 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm">
          <Plus className="h-4 w-4" /> Report Incident
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {incidents.map(i => (
          <Card key={i.id} className="border-border/60 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] duration-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-5">
                <div className={cn(
                  "h-12 w-12 rounded-2xl grid place-items-center shrink-0 shadow-inner",
                  i.severity === "critical" || i.severity === "high" 
                    ? "bg-rose-500/15 text-rose-600 dark:text-rose-400" 
                    : i.severity === "medium" 
                    ? "bg-amber-500/15 text-amber-600 dark:text-amber-400" 
                    : "bg-blue-500/15 text-blue-600 dark:text-blue-400"
                )}>
                  <AlertTriangle className="h-6 w-6" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <StatusPill status={i.severity} />
                    <StatusPill status={i.status} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-auto">
                      {i.reportedAt}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-lg font-bold leading-tight text-foreground tracking-tight">
                    {i.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60 mt-1.5">
                    <span className="text-foreground/80">{i.facility}</span>
                    {i.assetTag && (
                      <>
                        <span className="opacity-30">·</span>
                        <span className="font-mono text-[#6aabfc]">{i.assetTag}</span>
                      </>
                    )}
                  </div>
                  
                  <p className="mt-4 text-sm font-medium text-muted-foreground leading-relaxed">
                    {i.description}
                  </p>
                  
                  <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Reported by <span className="text-foreground ml-1">{i.reportedBy}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase tracking-widest text-[#6aabfc] hover:text-[#6aabfc]/80 hover:bg-[#6aabfc]/5">
                      Investigate →
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
