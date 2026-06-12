"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Package } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { getAggregatedCustomers } from "@/lib/actions/crm-actions";
import { ViewOrderModal } from "@/components/dashboard/view-order-modal";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const fmt = new Intl.NumberFormat("en-US");

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [viewingOrder, setViewingOrder] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await getAggregatedCustomers();
      if (res.success && res.data) {
        setCustomers(res.data);
      }
      setLoading(false);
    }
    load();
  }, []);

  const [page, setPage] = useState(1);
  const pageSize = 20;

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const filtered = customers.filter(c => {
    // 1. Search Match
    const term = searchTerm.toLowerCase();
    const searchMatch = !term || 
      c.name.toLowerCase().includes(term) || 
      c.contact.toLowerCase().includes(term) || 
      c.country.toLowerCase().includes(term) ||
      (c.latestOrderId && c.latestOrderId.toLowerCase().includes(term));

    // 2. Type Match
    let typeMatch = true;
    if (filterType !== 'all') {
      const productName = (c.latestOrder?.product?.name || "").toLowerCase();
      if (filterType === 'shea') {
        typeMatch = productName.includes('shea');
      } else if (filterType === 'honey') {
        typeMatch = productName.includes('honey') || productName.includes('honney');
      } else {
        typeMatch = productName.includes(filterType);
      }
    }

    // 3. Status Match
    let statusMatch = true;
    if (filterStatus !== 'all') {
      statusMatch = c.latestOrder?.status === filterStatus;
    }

    return searchMatch && typeMatch && statusMatch;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AppLayout
      title="Customer CRM"
      subtitle="Manage relationships, track revenue, and segment your global buyer network"
      actions={
        <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> Add Customer</Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Customers" value={customers.length.toString()} hint="active accounts" />
        <Stat label="Approved Orders" value={customers.filter(c => c.type === "Approved").length.toString()} hint="ready for fulfillment" accent />
        <Stat label="Lifetime Revenue" value={`GH₵ ${(customers.reduce((s, c) => s + c.revenue, 0) / 1_000_000).toFixed(2)}M`} hint="across all clients" />
        <Stat label="Countries" value={new Set(customers.map(c => c.country)).size.toString()} hint="export markets" />
      </div>

      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <Input 
          placeholder="Search customers by name, contact, country..." 
          className="max-w-xs h-9 bg-card"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => setFilterType('all')} variant={filterType === 'all' ? 'default' : 'outline'} size="sm" className={cn("h-9", filterType === 'all' && "bg-[#6aabfc] text-white")}>All Orders</Button>
        <Button onClick={() => setFilterType('honey')} variant={filterType === 'honey' ? 'default' : 'outline'} size="sm" className={cn("h-9", filterType === 'honey' && "bg-[#eea000] text-white")}>Honey</Button>
        <Button onClick={() => setFilterType('cashew')} variant={filterType === 'cashew' ? 'default' : 'outline'} size="sm" className={cn("h-9", filterType === 'cashew' && "bg-[#e5d5b5] text-amber-900")}>Cashew nut</Button>
        <Button onClick={() => setFilterType('shea')} variant={filterType === 'shea' ? 'default' : 'outline'} size="sm" className={cn("h-9", filterType === 'shea' && "bg-[#e1ceb6] text-amber-900")}>Sheabutter</Button>
        
        <div className="ml-auto flex items-center">
          <Select 
            value={filterStatus} 
            onValueChange={setFilterStatus}
          >
            <SelectTrigger className="w-[140px] h-9 bg-card text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="processing">Production</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">Loading customers from database...</div>
        ) : paginated.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">No customers found.</div>
        ) : paginated.map((c) => {
          const isPending = c.type === "Pending";
          const statusBg = isPending ? "bg-orange-50" : "bg-[#60a4fa]/15";
          const statusText = isPending ? "text-orange-600" : "text-[#60a4fa]";
          const displayId = `#CUST-${c.id.substring(c.id.length - 5).toUpperCase()}`;

          return (
          <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all group">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 bg-white shadow-sm shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div className="font-semibold text-[15px] text-gray-800 tracking-wide">{c.latestOrderId || displayId}</div>
              </div>
              <div className={cn("px-3 py-1.5 rounded-md text-xs font-medium", statusBg, statusText)}>
                {c.type}
              </div>
            </div>

            <div className="h-px bg-gray-100 my-4" />

            {/* Timeline & Map */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 pt-1 min-w-0">
                {/* Current Location */}
                <div className="flex items-start gap-3 relative">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#60a4fa] flex items-center justify-center bg-white z-10 relative">
                      <div className="w-1.5 h-1.5 bg-[#60a4fa] rounded-full" />
                    </div>
                    <div className="w-0.5 h-8 border-l-2 border-dashed border-[#60a4fa]/30 my-0.5 -ml-[0.5px]" />
                  </div>
                  <div className="flex-1 pb-4 min-w-0">
                    <div className="text-[13px] text-gray-500 mb-0.5">Customer location</div>
                    <div className="text-[14px] text-gray-800 font-medium leading-snug truncate" title={c.country}>{c.country} {c.flag}</div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center mt-1">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#60a4fa] flex items-center justify-center bg-white z-10 relative">
                      <div className="w-1.5 h-1.5 bg-[#60a4fa] rounded-full" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] text-gray-500 mb-0.5">Contact info</div>
                    <div className="text-[14px] text-gray-800 font-medium leading-snug truncate" title={c.contact}>{c.contact}</div>
                  </div>
                </div>
              </div>

              {/* Map Thumbnail / Product Image */}
              <div className="w-[84px] h-[84px] rounded-xl overflow-hidden shrink-0 border border-gray-100 relative shadow-inner">
                <Image src={c.latestProductImage || "/map_thumbnail.png"} alt="Product Thumbnail" fill className="object-cover" />
              </div>
            </div>

            <div className="h-px bg-gray-100 my-5" />

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#1e293b] text-white flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                  {c.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-[12px] text-gray-500 mb-0.5">Client name</div>
                  <div className="text-[14px] text-gray-800 font-medium truncate" title={c.name}>{c.name}</div>
                </div>
              </div>

              <div>
                <div className="text-[12px] text-gray-500 mb-0.5">Order Quantity</div>
                <div className="text-[14px] text-gray-800 font-medium truncate" title={c.latestQuantity}>{c.latestQuantity || "-"}</div>
              </div>

              <div>
                <div className="text-[12px] text-gray-500 mb-0.5">Lifetime Revenue</div>
                <div className="text-[14px] text-gray-800 font-medium">GH₵ {fmt.format(c.revenue)}</div>
              </div>

              <div>
                <div className="text-[12px] text-gray-500 mb-0.5">Order Status</div>
                {(() => {
                  const s = c.latestOrder?.status;
                  let statusText = c.hasDeliveredOrder ? "Delivered" : "Order Confirmed";
                  if (s === 'delivered') statusText = 'Delivered';
                  else if (s === 'shipped' || s === 'in_transit') statusText = 'In Transit';
                  else if (s === 'processing') statusText = 'Production';
                  else if (s === 'approved' || s === 'paid') statusText = 'Order Confirmed';

                  return (
                    <div className={cn("text-[13px] font-bold w-fit", statusText === "Delivered" ? "text-[#60a4fa] bg-[#60a4fa]/15 px-2 py-0.5 rounded-md" : "text-[14px] text-gray-800")}>
                      {statusText}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Action */}
            <Button 
              variant="outline" 
              onClick={() => {
                if (c.latestOrder) {
                  setViewingOrder(c.latestOrder);
                } else {
                  toast.error("No full order details available for this customer.");
                }
              }}
              className="w-full mt-5 rounded-lg border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors h-11"
            >
              View detail
            </Button>
          </div>
        )})}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 mb-4">
          <p className="text-xs text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      {/* View Order Modal */}
      {viewingOrder && (
        <ViewOrderModal 
          order={viewingOrder} 
          onClose={() => setViewingOrder(null)} 
        />
      )}
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
