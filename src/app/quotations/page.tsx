import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus, Download, FileText, Send, Eye, Check, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const quotations = [
  { id: "QT-1184", customer: "Bremen Trading GmbH", country: "Germany", product: "Premium Honey", qty: "5,000 kg", amount: 47500, currency: "USD", status: "viewed", date: "Dec 14, 2024", validUntil: "Jan 14, 2025" },
  { id: "QT-1183", customer: "Osaka Imports Co.", country: "Japan", product: "W320 Cashew", qty: "20,000 kg", amount: 240000, currency: "USD", status: "negotiating", date: "Dec 12, 2024", validUntil: "Jan 12, 2025" },
  { id: "QT-1182", customer: "Gulf Trade LLC", country: "UAE", product: "Premium Honey", qty: "8,000 kg", amount: 72000, currency: "USD", status: "accepted", date: "Dec 8, 2024", validUntil: "Jan 8, 2025" },
  { id: "QT-1181", customer: "Atlantic Foods Inc.", country: "USA", product: "W240 Cashew", qty: "15,000 kg", amount: 210000, currency: "USD", status: "sent", date: "Dec 6, 2024", validUntil: "Jan 6, 2025" },
  { id: "QT-1180", customer: "Provence Naturals", country: "France", product: "Refined Shea", qty: "2,500 kg", amount: 28000, currency: "EUR", status: "draft", date: "Dec 18, 2024", validUntil: "Jan 18, 2025" },
  { id: "QT-1179", customer: "London Spice Co.", country: "UK", product: "Raw Honey", qty: "4,500 kg", amount: 32000, currency: "GBP", status: "rejected", date: "Dec 1, 2024", validUntil: "Jan 1, 2025" },
  { id: "QT-1178", customer: "Madrid Organics", country: "Spain", product: "Premium Honey", qty: "6,000 kg", amount: 54000, currency: "EUR", status: "accepted", date: "Nov 18, 2024", validUntil: "Dec 18, 2024" },
];

const statusConfig: Record<string, { label: string; cls: string; icon: React.ElementType }> = {
  draft: { label: "Draft", cls: "bg-muted text-muted-foreground", icon: FileText },
  sent: { label: "Sent", cls: "bg-info/10 text-info", icon: Send },
  viewed: { label: "Viewed", cls: "bg-chart-1/15 text-chart-1", icon: Eye },
  negotiating: { label: "Negotiating", cls: "bg-warning/10 text-warning", icon: Clock },
  accepted: { label: "Accepted", cls: "bg-success/10 text-success", icon: Check },
  rejected: { label: "Rejected", cls: "bg-destructive/10 text-destructive", icon: X },
};

const fmt = new Intl.NumberFormat("en-US");

export default function QuotationsPage() {
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
          <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> New Quote</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Quotes" value={quotations.length.toString()} hint="this period" />
        <Stat label="Total Value" value={`$${(totalValue / 1000).toFixed(0)}k`} hint="combined pipeline" accent />
        <Stat label="Accepted" value={accepted.toString()} hint={`$${(acceptedValue / 1000).toFixed(0)}k won`} success />
        <Stat label="Win Rate" value={`${((accepted / quotations.length) * 100).toFixed(0)}%`} hint="from sent quotes" />
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
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold">{q.id}</td>
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
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{q.date}</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{q.validUntil}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
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
