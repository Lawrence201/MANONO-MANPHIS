import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { complianceDocs } from "@/lib/mock-data";
import { ShieldCheck, Upload, Filter, FileText, AlertTriangle, CheckCircle2, Clock, XCircle, Download, Eye } from "lucide-react";

const statusMap = {
  valid: { color: "text-success", bg: "bg-success/10", icon: CheckCircle2, label: "Valid" },
  expiring: { color: "text-warning", bg: "bg-warning/10", icon: Clock, label: "Expiring Soon" },
  expired: { color: "text-destructive", bg: "bg-destructive/10", icon: XCircle, label: "Expired" },
  pending: { color: "text-muted-foreground", bg: "bg-muted", icon: AlertTriangle, label: "Pending" },
};

export default function DocumentsPage() {
  const valid = complianceDocs.filter(d => d.status === "valid").length;
  const expiring = complianceDocs.filter(d => d.status === "expiring").length;
  const expired = complianceDocs.filter(d => d.status === "expired").length;

  return (
    <AppLayout
      title="Documents & Compliance"
      subtitle="Certificates, licenses, contracts and regulatory documents — all in one secure vault"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
          <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Upload className="w-4 h-4" /> Upload Document</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Documents" value={complianceDocs.length.toString()} hint="across all categories" icon={<FileText className="w-5 h-5 text-primary" />} />
        <StatCard label="Valid" value={valid.toString()} hint="up to date" icon={<CheckCircle2 className="w-5 h-5 text-success" />} />
        <StatCard label="Expiring Soon" value={expiring.toString()} hint="action required" icon={<Clock className="w-5 h-5 text-warning" />} warning />
        <StatCard label="Expired" value={expired.toString()} hint="renewal needed" icon={<XCircle className="w-5 h-5 text-destructive" />} danger />
      </div>

      {/* Document categories */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
        {["Certificate of Origin", "Export License", "Bill of Lading", "Contract", "Phytosanitary", "Insurance", "Quality Cert"].map((cat) => {
          const count = complianceDocs.filter(d => d.type === cat).length;
          return (
            <div key={cat} className="bg-card rounded-xl border border-border p-4 shadow-card hover:border-accent transition-colors cursor-pointer">
              <ShieldCheck className="w-4 h-4 text-accent mb-2" />
              <div className="text-[10px] text-muted-foreground line-clamp-1">{cat}</div>
              <div className="text-lg font-bold font-display">{count}</div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Input placeholder="Search documents..." className="max-w-xs h-9 bg-card" />
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Type</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Status</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Country</Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                <th className="font-medium px-5 py-3">Document</th>
                <th className="font-medium px-5 py-3">Type</th>
                <th className="font-medium px-5 py-3">Country</th>
                <th className="font-medium px-5 py-3">Issued By</th>
                <th className="font-medium px-5 py-3">Expiry</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complianceDocs.map((d) => {
                const s = statusMap[d.status as keyof typeof statusMap];
                const Si = s.icon;
                return (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-xs line-clamp-1">{d.name}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{d.id} · {d.size}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><span className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded">{d.type}</span></td>
                    <td className="px-5 py-3.5 text-xs">{d.country}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{d.issuedBy}</td>
                    <td className="px-5 py-3.5 text-xs tabular-nums">{d.expiryDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold ${s.bg} ${s.color}`}>
                        <Si className="w-3 h-3" /> {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="w-3.5 h-3.5" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Download className="w-3.5 h-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({ label, value, hint, icon, warning, danger }: { label: string; value: string; hint: string; icon: React.ReactNode; warning?: boolean; danger?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
          <div className={`text-2xl font-bold font-display mt-2 ${warning ? "text-warning" : danger ? "text-destructive" : ""}`}>{value}</div>
          <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
        </div>
        <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">{icon}</div>
      </div>
    </div>
  );
}
