import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Download } from "lucide-react";
import { getExportOrders } from "@/lib/actions/export-order-actions";
import { OrdersTable } from "./orders-table";

export default async function OrdersPage() {
  const result = await getExportOrders();
  const orders = result.success && result.data ? result.data : [];

  const honeyOrders = orders.filter(o => o.product?.name.toLowerCase().includes("honey")).length;
  const cashewOrders = orders.filter(o => o.product?.name.toLowerCase().includes("cashew")).length;
  const sheaOrders = orders.filter(o => o.product?.name.toLowerCase().includes("shea")).length;

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
        <SummaryCard label="Honey Orders" value={honeyOrders.toString()} hint="across all stages" accent />
        <SummaryCard label="Cashew Orders" value={cashewOrders.toString()} hint="across all stages" />
        <SummaryCard label="Sheabutter Orders" value={sheaOrders.toString()} hint="across all stages" warning />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Input placeholder="Search orders..." className="max-w-xs h-9 bg-card" />
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Status</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Shipping</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Country</Button>
      </div>

      {/* Table Component */}
      <OrdersTable initialOrders={orders} />
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
