import { AppLayout } from "@/components/layout/app-layout";
import { Plane, Ship, Package, MapPin, Calendar, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getActiveShipments } from "@/lib/actions/export-order-actions";
import { LogisticsClient } from "./logistics-client";

export default async function LogisticsPage({ searchParams }: { searchParams: Promise<{ page?: string, filter?: string }> }) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const filter = params.filter || 'all';

  const { success, data, stats, error } = await getActiveShipments({ page, pageSize: 15, filter });

  if (!success) {
    return (
      <AppLayout title="Logistics & Shipping">
        <div className="p-6 text-red-500">Error loading shipments: {error}</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Logistics & Shipping"
      subtitle="Track active shipments, manage carriers, and handle export documentation"
      actions={<Button size="sm" variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export Report</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Active Shipments" value={stats?.totalActive.toString() || "0"} hint="in motion" />
        <Stat label="Sea Freight" value={stats?.seaFreight.toString() || "0"} hint="containers at sea" />
        <Stat label="Air Cargo" value={stats?.airCargo.toString() || "0"} hint="urgent shipments" accent />
        <Stat label="Avg Transit" value={stats?.avgTransit || "22 days"} hint="port to port" />
      </div>

      <LogisticsClient initialShipments={data || []} />
      
    </AppLayout>
  );
}

function Stat({ label, value, hint, accent }: { label: string; value: string; hint: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={cn("text-2xl font-bold font-display mt-2", accent && "text-gradient-accent")}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
