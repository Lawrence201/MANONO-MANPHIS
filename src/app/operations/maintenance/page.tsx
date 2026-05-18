"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { StatusPill } from "@/components/operations/status-pill";
import { maintenanceOrders } from "@/lib/mock-data";
import { Plus, Wrench, Clock, CheckCircle2, AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function MaintenancePage() {
  const overdue = maintenanceOrders.filter(m => m.status === "overdue").length;
  const inProgress = maintenanceOrders.filter(m => m.status === "in_progress").length;
  const scheduled = maintenanceOrders.filter(m => m.status === "scheduled").length;
  const completed = maintenanceOrders.filter(m => m.status === "completed").length;

  const kpis = [
    { label: "Overdue", value: overdue, icon: AlertOctagon, accent: "text-rose-600 bg-rose-500/15" },
    { label: "In Progress", value: inProgress, icon: Wrench, accent: "text-blue-600 bg-blue-500/15" },
    { label: "Scheduled", value: scheduled, icon: Clock, accent: "text-amber-600 bg-amber-500/15" },
    { label: "Completed", value: completed, icon: CheckCircle2, accent: "text-emerald-600 bg-emerald-500/15" },
  ];

  return (
    <AppLayout
      title="Maintenance"
      subtitle="Preventive, corrective and emergency work orders across the entire estate."
      actions={
        <Button size="sm" className="gap-1.5 h-9 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm">
          <Plus className="h-4 w-4" /> New Work Order
        </Button>
      }
    >
      <div className="space-y-6">
        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(c => (
            <Card key={c.label} className="border-border/60 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] duration-300">
              <CardContent className="p-5 flex items-center gap-5">
                <div className={cn("h-12 w-12 rounded-2xl grid place-items-center transition-colors", c.accent)}>
                  <c.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/70">{c.label}</div>
                  <div className="font-display text-3xl font-black leading-none mt-1.5">{c.value}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Work Orders Table */}
        <Card className="border-border/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary/30 border-b border-border transition-colors">
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Work Order</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Asset Details</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Type</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Technician</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date Scheduled</th>
                  <th className="px-5 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {maintenanceOrders.map(m => (
                  <tr key={m.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-5 py-4">
                      <div className="font-mono text-[10px] font-black text-[#6aabfc] tracking-tighter uppercase">WO-{m.id}</div>
                      <div className="text-[11px] font-bold text-foreground/80 mt-1 max-w-[240px] truncate leading-tight" title={m.description}>
                        {m.description}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-bold text-foreground">{m.assetName}</div>
                      <div className="text-[10px] text-muted-foreground font-medium mt-0.5">{m.assetTag}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/80">
                        {m.type}
                      </span>
                    </td>
                    <td className="px-5 py-4"><StatusPill status={m.priority} /></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center text-[10px] font-black text-muted-foreground">
                          {m.technician.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[12px] font-bold text-foreground/90">{m.technician}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[12px] font-bold text-muted-foreground/70">{m.scheduledDate}</td>
                    <td className="px-5 py-4"><StatusPill status={m.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-4 bg-secondary/10 border-t border-border">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
              Total active work orders: <span className="text-[#6aabfc] ml-1">{maintenanceOrders.length}</span>
            </p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
