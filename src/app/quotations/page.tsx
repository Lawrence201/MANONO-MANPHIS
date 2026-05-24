import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileText, Send, Eye, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getQuotations } from "@/lib/actions/quotation-actions";
import { NewQuoteModal } from "@/components/dashboard/new-quote-modal";
import Link from "next/link";

const statusConfig: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground", icon: FileText },
  sent: { label: "Sent", cls: "bg-info/10 text-info", icon: Send },
  viewed: { label: "Viewed", cls: "bg-chart-1/15 text-chart-1", icon: Eye },
  negotiating: { label: "Negotiating", cls: "bg-warning/10 text-warning", icon: Clock },
  accepted: { label: "Accepted", cls: "bg-success/10 text-success", icon: Check },
  rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive", icon: X },
};

const fmt = new Intl.NumberFormat("en-US");

export default async function QuotationsPage() {
  const res = await getQuotations();
  const quotations = res.success ? (res.data as any[]) : [];
  const totalValue = quotations.reduce((s, q) => s + q.amount, 0);
  const accepted = quotations.filter(q => q.status === "accepted").length;
  const acceptedValue = quotations.filter(q => q.status === "accepted").reduce((s, q) => s + q.amount, 0);

  return (
    <AppLayout
      title="Quotations"
      subtitle="Generate, send, and track professional quotations across all currencies"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export</Button>
          <NewQuoteModal />
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Quotes" value={quotations.length.toString()} hint="this period" />
        <Stat label="Total Value" value={`$${(totalValue / 1000).toFixed(0)}k`} hint="combined pipeline" accent />
        <Stat label="Accepted" value={accepted.toString()} hint={`$${(acceptedValue / 1000).toFixed(0)}k won`} success />
        <Stat label="Win Rate" value={`${quotations.length > 0 ? ((accepted / quotations.length) * 100).toFixed(0) : 0}%`} hint="from sent quotes" />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                <th className="font-medium px-5 py-3">Quote</th>
                <th className="font-medium px-5 py-3">Customer</th>
                <th className="font-medium px-5 py-3">Product</th>
                <th className="font-medium px-5 py-3">Amount</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3">Issued</th>
                <th className="font-medium px-5 py-3">Valid Until</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.map((q) => {
                const cfg = statusConfig[q.status as keyof typeof statusConfig];
                const Icon = cfg.icon;
                return (
                  <tr key={q.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold">{q.quoteNumber}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-medium">{q.customer}</div>
                      <div className="text-[10px] text-muted-foreground">{q.country}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <div>{q.product}</div>
                      <div className="text-[10px] text-muted-foreground">{q.qty}</div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">{q.currency} {fmt.format(q.amount)}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide", cfg.cls)}>
                        <Icon className="w-2.5 h-2.5" /> {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(q.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{new Date(q.validUntil).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/quotations/${q.quoteNumber}`}>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                      </Link>
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

function Stat({ label, value, hint, accent, success }: { label: string; value: string; hint: string; accent?: boolean; success?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={cn("text-2xl font-bold font-display mt-2", accent && "text-gradient-accent", success && "text-success")}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
