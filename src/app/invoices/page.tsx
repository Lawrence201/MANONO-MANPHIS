import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Download, Plus, FileText, ExternalLink, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getExportOrders } from "@/lib/actions/export-order-actions";
import Link from "next/link";

const fmt = new Intl.NumberFormat("en-US");

const statusMap: Record<string, string> = {
  paid: "bg-success/10 text-success",
  partial: "bg-warning/10 text-warning",
  pending: "bg-muted text-muted-foreground",
  overdue: "bg-destructive/10 text-destructive",
};

export default async function InvoicesPage() {
  const res = await getExportOrders();
  const allOrders = res.success ? (res.data as any[]) : [];
  
  // Only show orders that have an invoice generated
  const invoicedOrders = allOrders.filter(o => o.invoicePdfPath);

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
              {invoicedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p>No invoices have been generated yet.</p>
                  </td>
                </tr>
              ) : (
                invoicedOrders.map((inv) => {
                  const invoiceNumber = `INV-${inv.referenceNumber.split('-').pop()}`;
                  const amount = inv.totalEstimatedCost ? Number(inv.totalEstimatedCost) : (Number(inv.quantityRequested) * Number(inv.product?.pricePerUnit || 0));
                  const issuedDate = new Date(inv.invoiceDate || inv.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
                  
                  return (
                    <tr key={inv.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-accent" />
                          <span className="font-mono text-xs font-semibold">{invoiceNumber}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">{inv.referenceNumber}</td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs font-medium">{inv.companyName || inv.buyerType}</div>
                        <div className="text-[10px] text-muted-foreground">{inv.destinationCountry}</div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">GH₵ {fmt.format(amount)}</td>
                      <td className="px-5 py-3.5 text-[11px] text-muted-foreground">{inv.depositRequired}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">{issuedDate}</td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">-</td>
                      <td className="px-5 py-3.5">
                        <span className={cn("inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide", statusMap[inv.status] || statusMap.pending)}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link href={inv.invoicePdfPath} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                            <ExternalLink className="w-3 h-3" /> View PDF
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
