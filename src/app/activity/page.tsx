import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { activityLogs } from "@/lib/mock-data";
import { Filter, Download, Plus, Edit, Trash2, LogIn, FileDown, CheckCircle2 } from "lucide-react";

const typeMap = {
  create: { icon: Plus, color: "text-success", bg: "bg-success/10" },
  update: { icon: Edit, color: "text-primary", bg: "bg-primary/10" },
  delete: { icon: Trash2, color: "text-destructive", bg: "bg-destructive/10" },
  login: { icon: LogIn, color: "text-muted-foreground", bg: "bg-secondary" },
  export: { icon: FileDown, color: "text-accent", bg: "bg-accent/10" },
  approve: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
};

export default function ActivityPage() {
  return (
    <AppLayout
      title="Activity Logs"
      subtitle="Complete audit trail of every action taken across the platform"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export Logs</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Events Today" value="247" hint="all users" />
        <StatCard label="This Week" value="1,842" hint="↑ 12% vs last week" />
        <StatCard label="Failed Attempts" value="3" hint="security flags" warning />
        <StatCard label="Active Sessions" value="6" hint="currently online" accent />
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Input placeholder="Search by user, action, or target..." className="max-w-md h-9 bg-card" />
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> User</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Module</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Type</Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="divide-y divide-border">
          {activityLogs.map((log) => {
            const t = typeMap[log.type as keyof typeof typeMap];
            const Ti = t.icon;
            return (
              <div key={log.id} className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors">
                <div className={`w-9 h-9 rounded-lg ${t.bg} flex items-center justify-center shrink-0`}>
                  <Ti className={`w-4 h-4 ${t.color}`} />
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-[10px] font-semibold text-white shrink-0">{log.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs">
                    <span className="font-semibold">{log.user}</span>
                    <span className="text-muted-foreground"> · {log.action} </span>
                    <span className="font-medium">{log.target}</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-2">
                    <span className="bg-secondary px-1.5 py-0.5 rounded">{log.module}</span>
                    <span>{log.timestamp}</span>
                    <span className="font-mono">{log.ip}</span>
                  </div>
                </div>
                <div className="text-[10px] font-mono text-muted-foreground">{log.id}</div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ label, value, hint, accent, warning }: { label: string; value: string; hint: string; accent?: boolean; warning?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold font-display mt-2 ${accent ? "text-gradient-accent" : warning ? "text-warning" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
