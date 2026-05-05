import { AppLayout } from "@/components/layout/app-layout";
import { orders } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Download, Plus, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = new Intl.NumberFormat("en-US");

const invoices = orders.map((o, i) => ({
  number: `INV-${(2024100 + i).toString()}`,
  order: o.id,
  customer: o.company,
  country: o.country,
  amount: o.amount,
  currency: o.currency,
  status: o.payment,
  issued: o.date,
  due: new Date(new Date(o.date).getTime() + 30 * 86400000).toISOString().slice(0, 10),
  terms: i % 2 === 0 ? "50% upfront / 50% on shipment" : "Net 30",
}));

const statusMap: Record<string, string> = {
  paid: "bg-success/10 text-success",
  partial: "bg-warning/10 text-warning",
  pending: "bg-muted text-muted-foreground",
  overdue: "bg-destructive/10 text-destructive",
};

export default function InvoicesPage() {
  return (
    <AppLayout
      title="Invoices"
      subtitle="Generate, send, and track payment terms across all customer invoices"
      actions={<Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> New Invoice</Button>}
    >
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                <th className="font-medium px-5 py-3">Invoice #</th>
                <th className="font-medium px-5 py-3">Order</th>
                <th className="font-medium px-5 py-3">Customer</th>
                <th className="font-medium px-5 py-3">Amount</th>
                <th className="font-medium px-5 py-3">Terms</th>
                <th className="font-medium px-5 py-3">Issued</th>
                <th className="font-medium px-5 py-3">Due</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.number} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-accent" />
                      <span className="font-mono text-xs font-semibold">{inv.number}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{inv.order}</td>
                  <td className="px-5 py-3.5">
                    <div className="text-xs font-medium">{inv.customer}</div>
                    <div className="text-[10px] text-muted-foreground">{inv.country}</div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">{inv.currency} {fmt.format(inv.amount)}</td>
                  <td className="px-5 py-3.5 text-[11px] text-muted-foreground">{inv.terms}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">{inv.issued}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">{inv.due}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide", statusMap[inv.status])}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1"><Download className="w-3 h-3" /> PDF</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
