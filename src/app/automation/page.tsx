import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { workflows } from "@/lib/mock-data";
import { Plus, Zap, ArrowRight, Play, Pause, Edit, Activity, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function AutomationPage() {
  const active = workflows.filter(w => w.active).length;
  const totalRuns = workflows.reduce((s, w) => s + w.runs, 0);

  return (
    <AppLayout
      title="Automation & Workflows"
      subtitle="Build no-code automation rules to eliminate manual coordination across your trade operations"
      actions={
        <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> New Workflow</Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Active Workflows" value={active.toString()} hint={`of ${workflows.length} total`} accent />
        <StatCard label="Total Runs" value={totalRuns.toLocaleString()} hint="all-time executions" />
        <StatCard label="Hours Saved" value="284h" hint="this quarter" />
        <StatCard label="Success Rate" value="97.4%" hint="last 30 days" />
      </div>

      {/* Featured automation flow visual */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent rounded-xl border border-border p-6 shadow-card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-accent" />
          <h3 className="font-display font-semibold text-base">Quote-to-Cash Automation Flow</h3>
        </div>
        <div className="flex items-stretch gap-2 overflow-x-auto pb-2">
          {[
            { label: "Lead Created", color: "bg-primary" },
            { label: "Quote Sent", color: "bg-primary" },
            { label: "Quote Approved", color: "bg-accent" },
            { label: "Invoice Generated", color: "bg-accent" },
            { label: "Payment Received", color: "bg-success" },
            { label: "Logistics Notified", color: "bg-success" },
            { label: "Shipment Created", color: "bg-success" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2 shrink-0">
              <div className="bg-card border border-border rounded-lg px-4 py-3 min-w-[140px] text-center">
                <div className={`w-6 h-6 rounded-full ${step.color} mx-auto mb-2 flex items-center justify-center`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="text-[11px] font-medium">{step.label}</div>
              </div>
              {i < arr.length - 1 && <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* Workflows list */}
      <div className="space-y-3">
        {workflows.map((w) => (
          <div key={w.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${w.active ? "bg-accent/10" : "bg-secondary"}`}>
                {w.active ? <Play className="w-5 h-5 text-accent" /> : <Pause className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-sm">{w.name}</h4>
                  <span className="text-[10px] font-mono text-muted-foreground">{w.id}</span>
                  {w.active && <span className="text-[9px] font-bold uppercase bg-success/10 text-success px-1.5 py-0.5 rounded">Live</span>}
                </div>
                <div className="flex items-center gap-2 text-xs flex-wrap">
                  <span className="text-muted-foreground">When</span>
                  <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded text-[11px]">{w.trigger}</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Do</span>
                  <span className="bg-accent/10 text-accent font-medium px-2 py-0.5 rounded text-[11px]">{w.action}</span>
                </div>
                <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> {w.runs} runs</span>
                  <span>Last: {w.lastRun}</span>
                  <span className="font-semibold text-success">{w.successRate}% success</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={w.active} />
                <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="w-3.5 h-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

function StatCard({ label, value, hint, accent }: { label: string; value: string; hint: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold font-display mt-2 ${accent ? "text-gradient-accent" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
