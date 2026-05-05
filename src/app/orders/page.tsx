import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orders } from "@/lib/mock-data";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/badges";
import { Plus, Filter, Download, Plane, Ship, Package as PackageIcon } from "lucide-react";

const fmt = new Intl.NumberFormat("en-US");

const shipIcon = (s: string) => s === "Air" ? Plane : s === "Sea" ? Ship : PackageIcon;

export default function OrdersPage() {
  const totalRevenue = orders.reduce((s, o) => s + o.amount, 0);
  const inTransit = orders.filter(o => o.status === "in_transit").length;
  const pending = orders.filter(o => o.payment === "pending" || o.payment === "partial").length;

  return (
    <AppLayout
      title="Order Management"
      subtitle="Track and manage all customer orders through their full lifecycle"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export</Button>
          <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> New Order</Button>
        </>
      }
    >
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard label="Total Orders" value={orders.length.toString()} hint="all time" />
        <SummaryCard label="Pipeline Value" value={`$${(totalRevenue / 1000).toFixed(0)}k`} hint="across all orders" accent />
        <SummaryCard label="In Transit" value={inTransit.toString()} hint="actively shipping" />
        <SummaryCard label="Pending Payment" value={pending.toString()} hint="awaiting collection" warning />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Input placeholder="Search orders..." className="max-w-xs h-9 bg-card" />
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Status</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Payment</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Country</Button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                <th className="font-medium px-5 py-3">Order</th>
                <th className="font-medium px-5 py-3">Customer</th>
                <th className="font-medium px-5 py-3">Product & Qty</th>
                <th className="font-medium px-5 py-3">Amount</th>
                <th className="font-medium px-5 py-3">Payment</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3">Shipping</th>
                <th className="font-medium px-5 py-3">ETA</th>
                <th className="font-medium px-5 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const ShipI = shipIcon(o.shipping);
                return (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-mono text-xs font-semibold">{o.id}</div>
                      <div className="text-[10px] text-muted-foreground">{o.date}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-medium text-xs">{o.customer}</div>
                      <div className="text-[10px] text-muted-foreground">{o.company}</div>
                    </td>
                    <td className="px-5 py-3.5 text-xs">
                      <div className="font-medium">{o.product}</div>
                      <div className="text-[10px] text-muted-foreground">{o.quantity}</div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">{o.currency} {fmt.format(o.amount)}</td>
                    <td className="px-5 py-3.5"><PaymentBadge status={o.payment} /></td>
                    <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <ShipI className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{o.shipping}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">{o.eta}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-accent" style={{ width: `${o.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums w-8">{o.progress}%</span>
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

function SummaryCard({ label, value, hint, accent, warning }: { label: string; value: string; hint: string; accent?: boolean; warning?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold font-display mt-2 ${accent ? "text-gradient-accent" : warning ? "text-warning" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
