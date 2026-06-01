import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download } from "lucide-react";
import { getExportOrders } from "@/lib/actions/export-order-actions";
import { OrdersTable } from "./orders-table";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 1;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : '';
  const type = typeof resolvedParams.type === 'string' ? resolvedParams.type : 'all';

  const result = await getExportOrders({ page, pageSize: 15, search, type });
  let paginatedOrders = result.success && result.data ? result.data : [];
  const pagination = result.pagination;

  // We need to fetch exact total counts from the database to keep summaries accurate across all pages
  const [totalOrders, honeyOrders, cashewOrders, sheaOrders] = await Promise.all([
    prisma.exportOrder.count(),
    prisma.exportOrder.count({ where: { product: { name: { contains: "honey", mode: 'insensitive' } } } }),
    prisma.exportOrder.count({ where: { product: { name: { contains: "cashew", mode: 'insensitive' } } } }),
    prisma.exportOrder.count({ where: { product: { name: { contains: "shea", mode: 'insensitive' } } } })
  ]);

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
        <SummaryCard label="Total Orders" value={totalOrders.toString()} hint="all time" />
        <SummaryCard label="Honey Orders" value={honeyOrders.toString()} hint="across all stages" accent />
        <SummaryCard label="Cashew Orders" value={cashewOrders.toString()} hint="across all stages" />
        <SummaryCard label="Sheabutter Orders" value={sheaOrders.toString()} hint="across all stages" warning />
      </div>

      {/* Table Component */}
      <OrdersTable 
        initialOrders={paginatedOrders} 
        pagination={pagination} 
        currentSearch={search}
        currentType={type}
      />
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
