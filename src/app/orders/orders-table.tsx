"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/badges";
import { Plane, Ship, Package as PackageIcon, CheckCircle2, XCircle, Edit3, Eye, MoreHorizontal, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateExportOrderStatus, deleteExportOrder } from "@/lib/actions/export-order-actions";
import { EditOrderModal } from "@/components/dashboard/edit-order-modal";
import { ViewOrderModal } from "@/components/dashboard/view-order-modal";

const fmt = new Intl.NumberFormat("en-US");

const shipIcon = (s: string) => s.toLowerCase().includes("air") ? Plane : s.toLowerCase().includes("sea") ? Ship : PackageIcon;

export function OrdersTable({ 
  initialOrders, 
  pagination, 
  currentSearch, 
  currentType,
  currentStatus
}: { 
  initialOrders: any[],
  pagination?: { total: number, page: number, pageSize: number, totalPages: number },
  currentSearch?: string,
  currentType?: string,
  currentStatus?: string
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [orders, setOrders] = useState(initialOrders);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);

  // Sync state when props change
  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Update URL parameters for search and filtering
  const updateUrlParams = (key: string, value: string) => {
    const params = new URLSearchParams();
    // Keep search and type if they exist, unless we're changing them
    if (currentSearch && key !== 'search') params.set('search', currentSearch);
    if (currentType && currentType !== 'all' && key !== 'type') params.set('type', currentType);
    if (currentStatus && currentStatus !== 'all' && key !== 'status') params.set('status', currentStatus);
    
    // Set the new value
    if (value && value !== 'all') {
      params.set(key, value);
    }
    
    // Reset to page 1 on search/filter changes unless we're explicitly changing pages
    if (key === 'page') {
      params.set('page', value);
    } else {
      params.set('page', '1');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // The orders are already filtered on the server!
  const filteredOrders = orders;

  const handleApprove = async (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "approved" } : o));
    await updateExportOrderStatus(id, "approved");
    toast.success("Order Approved successfully!");
  };

  const handleReject = async (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "rejected" } : o));
    await updateExportOrderStatus(id, "rejected");
    toast.error("Order Rejected.");
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Are you sure you want to permanently delete order EXP-${id}?`)) return;
    
    // Optimistic update
    setOrders(orders.filter(o => o.id !== id));
    
    const res = await deleteExportOrder(id);
    if (res.success) {
      toast.success(`Order EXP-${id} deleted successfully!`);
    } else {
      toast.error("Failed to delete order");
      setOrders(orders); // Revert
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Input 
          placeholder="Search orders..." 
          defaultValue={currentSearch} 
          onChange={e => {
            const val = e.target.value;
            const t = setTimeout(() => updateUrlParams('search', val), 500);
            return () => clearTimeout(t);
          }} 
          className="max-w-xs h-9 bg-card" 
        />
        <Button onClick={() => updateUrlParams('type', 'all')} variant={(!currentType || currentType === 'all') ? 'default' : 'outline'} size="sm" className={cn("h-9", (!currentType || currentType === 'all') && "bg-[#6aabfc] text-white")}>All Orders</Button>
        <Button onClick={() => updateUrlParams('type', 'honey')} variant={currentType === 'honey' ? 'default' : 'outline'} size="sm" className={cn("h-9", currentType === 'honey' && "bg-[#eea000] text-white")}>Honey</Button>
        <Button onClick={() => updateUrlParams('type', 'cashew')} variant={currentType === 'cashew' ? 'default' : 'outline'} size="sm" className={cn("h-9", currentType === 'cashew' && "bg-[#e5d5b5] text-amber-900")}>Cashew nut</Button>
        <Button onClick={() => updateUrlParams('type', 'shea')} variant={currentType === 'shea' ? 'default' : 'outline'} size="sm" className={cn("h-9", currentType === 'shea' && "bg-[#e1ceb6] text-amber-900")}>Sheabutter</Button>
        
        <div className="ml-auto flex items-center">
          <Select 
            value={currentStatus || 'all'} 
            onValueChange={(val) => updateUrlParams('status', val)}
          >
            <SelectTrigger className="w-[140px] h-9 bg-card text-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="in_transit">In Transit</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[400px]">
        <div className="overflow-auto flex-1 relative scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="sticky top-0 z-20 bg-secondary shadow-sm">
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="font-medium px-5 py-3">Order</th>
                <th className="font-medium px-5 py-3">Customer</th>
                <th className="font-medium px-5 py-3">Product & Qty</th>
                <th className="font-medium px-5 py-3">Amount</th>
                <th className="font-medium px-5 py-3">Payment</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3">Shipping</th>
                <th className="font-medium px-5 py-3">ETA</th>
                <th className="font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No export orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => {
                  const ShipI = shipIcon(o.shippingType);
                  const amount = o.totalEstimatedCost ? Number(o.totalEstimatedCost) : (o.customsValue || (o.quantityRequested * (o.product.pricePerUnit || 0)));
                  const date = new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                  
                  return (
                    <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-mono text-xs font-semibold">{o.referenceNumber}</div>
                        <div className="text-[10px] text-muted-foreground">{date}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-xs">{o.companyName || o.buyerType}</div>
                        <div className="text-[10px] text-muted-foreground">{o.destinationCountry}</div>
                      </td>
                      <td className="px-5 py-3.5 text-xs">
                        <div className="font-medium">{o.product.name}</div>
                        <div className="text-[10px] text-muted-foreground">{o.quantityRequested} {o.unitMeasurement || o.product.moqUnit || "Units"}</div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">GH₵ {fmt.format(amount)}</td>
                      <td className="px-5 py-3.5"><PaymentBadge status={o.status === "paid" || o.status === "approved" ? "paid" : "pending"} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <ShipI className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[100px] block" title={o.shippingType}>{o.shippingType}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">{o.preferredDate || "N/A"}</td>
                      <td className="px-5 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setViewingOrder(o)} className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditingOrder(o)} className="cursor-pointer">
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit Order
                            </DropdownMenuItem>
                            {o.status === "pending" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setViewingOrder(o)} className="cursor-pointer text-blue-600 focus:bg-blue-50 focus:text-blue-700">
                                  <CheckCircle2 className="mr-2 h-4 w-4" />
                                  Review to Approve...
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(o.id)} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-xs text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page <= 1}
              onClick={() => updateUrlParams('page', String(pagination.page - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => updateUrlParams('page', String(pagination.page + 1))}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
      
      {viewingOrder && (
        <ViewOrderModal 
          order={viewingOrder} 
          onClose={() => setViewingOrder(null)} 
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {editingOrder && (
        <EditOrderModal 
          order={editingOrder} 
          onCloseAction={() => setEditingOrder(null)} 
          onSavedAction={() => {
            window.location.reload();
          }} 
        />
      )}
    </>
  );
}
