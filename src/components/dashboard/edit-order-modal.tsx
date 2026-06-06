"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Save } from "lucide-react";
import { updateExportOrderDetails, updateExportOrderStatus } from "@/lib/actions/export-order-actions";

export function EditOrderModal({ order, onCloseAction, onSavedAction }: { order: any; onCloseAction: () => void; onSavedAction: () => void }) {
  const [loading, setLoading] = useState(false);
  const [qty, setQty] = useState(order.quantityRequested.toString());
  const [customsValue, setCustomsValue] = useState(order.customsValue ? order.customsValue.toString() : "");
  const [status, setStatus] = useState(order.status);
  
  const handleSave = async () => {
    setLoading(true);
    // Update Details
    await updateExportOrderDetails(order.id, {
      quantityRequested: parseFloat(qty),
      customsValue: customsValue ? parseFloat(customsValue) : undefined,
    });
    // Update Status
    if (status !== order.status) {
      await updateExportOrderStatus(order.id, status);
    }
    
    setLoading(false);
    onSavedAction();
    onCloseAction();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="font-display font-semibold text-lg">Edit Order: {order.referenceNumber}</h2>
          <button onClick={onCloseAction} className="p-1 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Product</label>
            <div className="text-sm font-medium">{order.product.name}</div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantity Requested ({order.product.moqUnit})</label>
            <Input 
              type="number" 
              value={qty} 
              onChange={(e) => setQty(e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customs Value (GH₵)</label>
            <Input 
              type="number" 
              value={customsValue} 
              onChange={(e) => setCustomsValue(e.target.value)}
              placeholder="e.g. 50000"
              className="bg-secondary/50"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-10 px-3 py-2 text-sm rounded-md border border-input bg-secondary/50 outline-none focus:ring-1 focus:ring-accent transition-all"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="processing">Processing</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        
        <div className="p-5 border-t border-border bg-secondary/20 flex justify-end gap-2">
          <Button variant="outline" onClick={onCloseAction} disabled={loading}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading} className="gap-2 bg-gradient-accent border-0">
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
