import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { productionBatches } from "@/lib/mock-data";
import { Plus, Factory, Sprout, Cog, ShieldCheck, Package, CheckCircle2 } from "lucide-react";

const stages = [
  { key: "sourcing", label: "Sourcing", icon: Sprout, color: "text-success", bg: "bg-success/10" },
  { key: "processing", label: "Processing", icon: Cog, color: "text-primary", bg: "bg-primary/10" },
  { key: "quality_check", label: "Quality Check", icon: ShieldCheck, color: "text-accent", bg: "bg-accent/10" },
  { key: "packaging", label: "Packaging", icon: Package, color: "text-warning", bg: "bg-warning/10" },
  { key: "ready", label: "Ready", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
];

export default function ProductionPage() {
  return (
    <AppLayout
      title="Production / Trade Operations"
      subtitle="Track agricultural commodity batches from sourcing through packaging and final readiness"
      actions={
        <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> New Batch</Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {stages.map((s) => {
          const count = productionBatches.filter(b => b.stage === s.key).length;
          const Si = s.icon;
          return (
            <div key={s.key} className="bg-card rounded-xl border border-border p-5 shadow-card">
              <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <Si className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className="text-2xl font-bold font-display">{count}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="space-y-4">
        {productionBatches.map((b) => {
          const stage = stages.find(s => s.key === b.stage)!;
          const Si = stage.icon;
          return (
            <div key={b.id} className="bg-card rounded-xl border border-border p-6 shadow-card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                    <Factory className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{b.product}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{b.id} · {b.quantity}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold ${stage.bg} ${stage.color}`}>
                  <Si className="w-3 h-3" /> {stage.label}
                </span>
              </div>

              {/* Pipeline progression */}
              <div className="flex items-center gap-1 mb-4">
                {stages.map((s, i) => {
                  const currentIdx = stages.findIndex(x => x.key === b.stage);
                  const done = i <= currentIdx;
                  return (
                    <div key={s.key} className="flex-1 flex items-center gap-1">
                      <div className={`flex-1 h-1.5 rounded-full ${done ? "bg-accent" : "bg-secondary"}`} />
                      {i < stages.length - 1 && <div className="w-1" />}
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-xs">
                <Field label="Facility" value={b.facility} />
                <Field label="Supervisor" value={b.supervisor} />
                <Field label="Started" value={b.startDate} />
                <Field label="Expected Ready" value={b.expectedReady} />
                <div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Progress</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-accent" style={{ width: `${b.progress}%` }} />
                    </div>
                    <span className="text-[10px] font-bold tabular-nums">{b.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
