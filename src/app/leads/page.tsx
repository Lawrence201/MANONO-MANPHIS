"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { leads, type Lead, type LeadStage } from "@/lib/mock-data";
import { Plus, Filter, Download, MoreHorizontal, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

const stages: { id: LeadStage; label: string; color: string; accent: string }[] = [
  { id: "new", label: "New", color: "border-t-info", accent: "bg-info" },
  { id: "contacted", label: "Contacted", color: "border-t-chart-1", accent: "bg-chart-1" },
  { id: "qualified", label: "Qualified", color: "border-t-chart-3", accent: "bg-chart-3" },
  { id: "negotiating", label: "Negotiating", color: "border-t-warning", accent: "bg-warning" },
  { id: "won", label: "Won", color: "border-t-success", accent: "bg-success" },
  { id: "lost", label: "Lost", color: "border-t-destructive", accent: "bg-destructive" },
];

const fmt = new Intl.NumberFormat("en-US");

export default function LeadsPage() {
  const [items, setItems] = useState<Lead[]>(leads);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const onDrop = (stage: LeadStage) => {
    if (!draggedId) return;
    setItems((prev) => prev.map((l) => (l.id === draggedId ? { ...l, stage } : l)));
    setDraggedId(null);
  };

  const totalValue = items.reduce((s, l) => s + l.value, 0);

  return (
    <AppLayout
      title="Leads & Pipeline"
      subtitle={`${items.length} active leads · $${(totalValue / 1000).toFixed(0)}k total pipeline value`}
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> New Lead</Button>
        </>
      }
    >
      <div className="mb-5">
        <Input placeholder="Search by name, company, country, product..." className="max-w-sm h-9 bg-card" />
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 pb-6">
        {stages.map((stage) => {
          const stageLeads = items.filter((l) => l.stage === stage.id);
          const stageValue = stageLeads.reduce((s, l) => s + l.value, 0);
          return (
            <div
              key={stage.id}
              className={cn("bg-secondary/40 rounded-xl border-t-2 flex flex-col min-h-[200px]", stage.color)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(stage.id)}
            >
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("w-1.5 h-1.5 rounded-full", stage.accent)} />
                  <span className="text-xs font-semibold uppercase tracking-wider">{stage.label}</span>
                  <span className="text-[10px] bg-card border border-border rounded-md px-1.5 py-0.5 text-muted-foreground font-semibold tabular-nums">{stageLeads.length}</span>
                </div>
                <button className="text-muted-foreground hover:text-foreground"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <div className="px-3 pb-2 text-[10px] text-muted-foreground font-medium tabular-nums">
                ${fmt.format(stageValue)}
              </div>

              <div className="flex-1 px-2 pb-3 space-y-2 overflow-y-auto scrollbar-thin">
                {stageLeads.map((lead) => (
                  <article
                    key={lead.id}
                    draggable
                    onDragStart={() => setDraggedId(lead.id)}
                    className={cn(
                      "bg-card rounded-lg p-3 border border-border cursor-grab active:cursor-grabbing hover:shadow-md hover:-translate-y-0.5 transition-all group",
                      draggedId === lead.id && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-gradient-primary flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                          {lead.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-semibold truncate">{lead.name}</div>
                          <div className="text-[10px] text-muted-foreground truncate">{lead.company}</div>
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 text-muted-foreground"><MoreHorizontal className="w-3.5 h-3.5" /></button>
                    </div>

                    <div className="text-[11px] text-muted-foreground mb-2 leading-relaxed">
                      <span className="font-medium text-foreground">{lead.product}</span> · {lead.quantity}
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold tabular-nums text-gradient-accent">${fmt.format(lead.value)}</span>
                      <span className="text-[10px] text-muted-foreground">{lead.country}</span>
                    </div>

                    {lead.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {lead.tags.map((t) => (
                          <span key={t} className={cn(
                            "text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider",
                            t === "Hot" && "bg-destructive/10 text-destructive",
                            t === "VIP" && "bg-accent/15 text-accent",
                            t === "New" && "bg-info/10 text-info",
                            t === "Bulk" && "bg-chart-3/15 text-chart-3",
                            t === "Repeat" && "bg-success/10 text-success",
                          )}>{t}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5" /> {lead.date}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">{lead.assignedTo.split(" ")[0]}</span>
                    </div>
                  </article>
                ))}
                {stageLeads.length === 0 && (
                  <div className="text-center py-8 text-[11px] text-muted-foreground/60 italic">
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}
