import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Download, FileText, Send, CheckCircle2 } from "lucide-react";
import { getExportOrders } from "@/lib/actions/export-order-actions";
import Link from "next/link";
import { cn } from "@/lib/utils";

const fmt = new Intl.NumberFormat("en-US");

export default async function QuotationsPage() {
  const res = await getExportOrders();
  const allOrders = res.success ? (res.data as any[]) : [];
  
  // Only show pending orders in the Quotations/Invoicing hub
  const pendingOrders = allOrders.filter(o => o.status === "pending");
  
  const totalValue = pendingOrders.reduce((sum, o) => {
    return sum + (Number(o.quantityRequested) * Number(o.product?.pricePerUnit || 0));
  }, 0);

  return (
    <AppLayout
      title="Invoicing & Quotations"
      subtitle="Generate professional invoices from pending export orders"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export List</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Stat label="Pending Orders" value={pendingOrders.length.toString()} hint="awaiting invoice generation" />
        <Stat label="Total Pipeline Value" value={`GH₵ ${(totalValue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} hint="estimated potential revenue" accent />
        <Stat label="Total Processed" value={allOrders.filter(o => o.status !== "pending").length.toString()} hint="orders already invoiced" success />
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                <th className="font-medium px-5 py-3">Order Ref</th>
                <th className="font-medium px-5 py-3">Buyer / Company</th>
                <th className="font-medium px-5 py-3">Product</th>
                <th className="font-medium px-5 py-3">Est. Value</th>
                <th className="font-medium px-5 py-3">Destination</th>
                <th className="font-medium px-5 py-3">Date Requested</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => {
                const estimatedValue = Number(order.quantityRequested) * Number(order.product?.pricePerUnit || 0);
                return (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-xs font-semibold">{order.referenceNumber}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-xs font-medium">{order.companyName || order.buyerType}</div>
                      <div className="text-[10px] text-muted-foreground">{order.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <div className="truncate max-w-[200px]">{order.product?.name}</div>
                      <div className="text-[10px] text-muted-foreground">{order.quantityRequested} {order.product?.priceUnitType === "per_kg" ? "KG" : "Liters"}</div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-xs text-[#eea000]">
                      USD ${fmt.format(estimatedValue)}
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      {order.destinationCountry}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/quotations/generate/${order.id}`}>
                        <Button size="sm" className="h-8 text-xs bg-[#1f1e24] hover:bg-black text-white gap-2">
                          <FileText className="w-3.5 h-3.5" /> Generate Invoice
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {pendingOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-muted-foreground">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                    <p>No pending orders requiring invoices.</p>
                  </td>
                </tr>
              )}
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
      <div className={cn("text-2xl font-bold font-display mt-2", accent && "text-[#eea000]", success && "text-green-600")}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
