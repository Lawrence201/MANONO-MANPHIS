"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/operations/status-pill";
import { movements } from "@/lib/mock-data";
import { ArrowRight, QrCode, Plus, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MovementsPage() {
  return (
    <AppLayout
      title="Asset Movements"
      subtitle="Every transfer, check-out and return across facilities — with full custody history."
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 h-9">
            <QrCode className="h-4 w-4" /> Scan to Move
          </Button>
          <Button size="sm" className="gap-1.5 h-9 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm">
            <Plus className="h-4 w-4" /> New Transfer
          </Button>
        </div>
      }
    >
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-border/60">
            {movements.map(m => (
              <div key={m.id} className="px-6 py-5 flex flex-wrap items-center gap-6 hover:bg-secondary/20 transition-all duration-300 group">
                <div className="flex items-center gap-4 w-32 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center group-hover:bg-[#6aabfc]/10 transition-colors">
                    <History className="h-4 w-4 text-muted-foreground group-hover:text-[#6aabfc]" />
                  </div>
                  <div className="font-mono text-[10px] font-black text-muted-foreground/60 tracking-tighter uppercase">{m.assetTag}</div>
                </div>
                
                <div className="flex-1 min-w-[200px]">
                  <div className="font-bold text-[15px] text-foreground tracking-tight">{m.assetName}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    Handled by <span className="text-foreground/80">{m.movedBy}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 bg-secondary/30 px-4 py-2 rounded-xl border border-border/40 min-w-[280px]">
                  <div className="text-xs font-bold text-muted-foreground/80 truncate max-w-[120px]">{m.from}</div>
                  <div className="h-6 w-6 rounded-full bg-[#6aabfc]/10 flex items-center justify-center shrink-0 shadow-sm border border-[#6aabfc]/20">
                    <ArrowRight className="h-3 w-3 text-[#6aabfc]" />
                  </div>
                  <div className="text-xs font-black text-foreground truncate max-w-[120px]">{m.to}</div>
                </div>
                
                <div className="flex items-center gap-3">
                  <StatusPill status={m.type} />
                  <StatusPill status={m.status} />
                </div>
                
                <div className="text-[10px] font-black text-muted-foreground/60 tabular-nums w-32 text-right uppercase tracking-widest">
                  {m.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="px-6 py-4 bg-secondary/10 border-t border-border">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
            Total logged movements: <span className="text-[#6aabfc] ml-1">{movements.length}</span>
          </p>
        </div>
      </Card>
    </AppLayout>
  );
}
