"use client";

import { useState } from "react";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/badges";
import { Plane, Ship, Package as PackageIcon, CheckCircle2, XCircle, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateExportOrderStatus } from "@/lib/actions/export-order-actions";
import { EditOrderModal } from "@/components/dashboard/edit-order-modal";

const fmt = new Intl.NumberFormat("en-US");

const shipIcon = (s: string) => s.toLowerCase().includes("air") ? Plane : s.toLowerCase().includes("sea") ? Ship : PackageIcon;

export function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  const handleApprove = async (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "approved" } : o));
    await updateExportOrderStatus(id, "approved");
  };

  const handleReject = async (id: number) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: "rejected" } : o));
    await updateExportOrderStatus(id, "rejected");
  };

  return (
    <>
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
                <th className="font-medium px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No export orders found.
                  </td>
                </tr>
              ) : (
                orders.map((o) => {
                  const ShipI = shipIcon(o.shippingType);
                  const amount = o.customsValue || (o.quantityRequested * (o.product.pricePerUnit || 0));
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
                        <div className="text-[10px] text-muted-foreground">{o.quantityRequested} {o.product.moqUnit}</div>
                      </td>
                      <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">USD {fmt.format(amount)}</td>
                      <td className="px-5 py-3.5"><PaymentBadge status={"pending"} /></td>
                      <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <ShipI className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="truncate max-w-[100px] block" title={o.shippingType}>{o.shippingType}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">{o.preferredDate || "N/A"}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          {o.status === "pending" && (
                            <>
                              <button onClick={() => handleApprove(o.id)} className="p-1.5 text-success hover:bg-success/10 rounded-md transition-colors" title="Approve">
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(o.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md transition-colors" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button onClick={() => setEditingOrder(o)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors" title="Edit Order">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {editingOrder && (
        <EditOrderModal 
          order={editingOrder} 
          onClose={() => setEditingOrder(null)} 
          onSaved={() => {
            // Hard reload for now to reflect new data from server
            window.location.reload();
          }} 
        />
      )}
    </>
  );
}
