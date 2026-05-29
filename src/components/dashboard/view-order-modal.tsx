"use client";

import { X, CheckCircle2, FileText, Plane, Ship, Package as PackageIcon, ShieldCheck, MapPin, Building, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const fmt = new Intl.NumberFormat("en-US");
const shipIcon = (s: string) => s?.toLowerCase().includes("air") ? Plane : s?.toLowerCase().includes("sea") ? Ship : PackageIcon;

export function ViewOrderModal({ order, onClose, onApprove }: { order: any; onClose: () => void; onApprove?: (id: number) => void }) {
  const amount = order.customsValue || (order.quantityRequested * (order.product.pricePerUnit || 0));
  const ShipI = shipIcon(order.shippingType || "");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/80 backdrop-blur-md flex items-center justify-between p-5 border-b border-border">
          <div>
            <h2 className="font-display font-semibold text-lg flex items-center gap-2">
              Order Details <span className="text-muted-foreground font-mono text-sm">#{order.referenceNumber}</span>
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Submitted on {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-secondary rounded-full transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="p-6 space-y-8">
          
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Buyer Details */}
            <div className="space-y-4 bg-secondary/30 p-4 rounded-xl border border-border/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><Building className="w-3.5 h-3.5" /> Buyer Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Company:</span> <span className="font-medium">{order.companyName || "N/A"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type:</span> <span>{order.buyerType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span>{order.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Phone:</span> <span>{order.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax ID:</span> <span>{order.taxId || "N/A"}</span></div>
              </div>
            </div>

            {/* Destination Details */}
            <div className="space-y-4 bg-secondary/30 p-4 rounded-xl border border-border/50">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Destination</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Country:</span> <span className="font-bold text-[#eea000]">{order.destinationCountry}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">City/State:</span> <span>{order.city}, {order.stateRegion}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Postal Code:</span> <span>{order.postalCode}</span></div>
                <div className="flex flex-col mt-2 pt-2 border-t border-border/50">
                  <span className="text-muted-foreground text-xs mb-1">Full Address:</span> 
                  <span className="text-xs">{order.deliveryAddress}</span>
                </div>
              </div>
            </div>
            
          </div>

          {/* Product & Financials */}
          <div>
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-1.5"><PackageIcon className="w-3.5 h-3.5" /> Product & Financials</h3>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/50 border-b border-border text-xs text-muted-foreground">
                  <tr>
                    <th className="px-4 py-2 font-medium">Product</th>
                    <th className="px-4 py-2 font-medium">Unit Price</th>
                    <th className="px-4 py-2 font-medium">Quantity</th>
                    <th className="px-4 py-2 font-medium text-right">Total Est.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 font-medium">{order.product.name}</td>
                    <td className="px-4 py-3">USD ${order.product.pricePerUnit} / {order.product.priceUnitType === 'per_kg' ? 'KG' : 'L'}</td>
                    <td className="px-4 py-3 font-bold">{order.quantityRequested} {order.product.priceUnitType === 'per_kg' ? 'KG' : 'L'}</td>
                    <td className="px-4 py-3 font-bold text-right text-lg text-[#eea000]">USD ${fmt.format(amount)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-secondary/30 p-4 border-t border-border text-sm flex justify-between">
                <div><span className="text-muted-foreground">Payment Method:</span> {order.paymentMethod}</div>
                <div><span className="text-muted-foreground">Deposit Terms:</span> {order.depositRequired}</div>
              </div>
            </div>
          </div>

          {/* Logistics & Compliance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Shipping Requirements */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><ShipI className="w-3.5 h-3.5" /> Shipping Preferences</h3>
              <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-semibold">{order.shippingType}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Incoterm / Delivery</span>
                  <span className="font-semibold">{order.deliveryType}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-border/50">
                  <span className="text-muted-foreground">Pickup/Dispatch</span>
                  <span className="capitalize">{order.pickupOption}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Preferred ETA</span>
                  <span>{order.preferredDate || "Anytime"}</span>
                </div>
              </div>
            </div>

            {/* Compliance Documents */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Required Certificates</h3>
              <div className="bg-card border border-border rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                <div className={`flex items-center gap-2 ${order.requiresFda ? 'text-foreground' : 'text-muted-foreground/30 line-through'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${order.requiresFda ? 'text-success' : ''}`} /> FDA Certificate
                </div>
                <div className={`flex items-center gap-2 ${order.requiresPhyto ? 'text-foreground' : 'text-muted-foreground/30 line-through'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${order.requiresPhyto ? 'text-success' : ''}`} /> Phytosanitary
                </div>
                <div className={`flex items-center gap-2 ${order.requiresOrganic ? 'text-foreground' : 'text-muted-foreground/30 line-through'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${order.requiresOrganic ? 'text-success' : ''}`} /> Organic Cert
                </div>
                <div className={`flex items-center gap-2 ${order.requiresOrigin ? 'text-foreground' : 'text-muted-foreground/30 line-through'}`}>
                  <CheckCircle2 className={`w-4 h-4 ${order.requiresOrigin ? 'text-success' : ''}`} /> Cert of Origin
                </div>
              </div>
              {order.importRequirements && (
                <div className="mt-2 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-lg border border-border/50">
                  <span className="font-semibold text-foreground">Special Instructions:</span><br/>
                  {order.importRequirements}
                </div>
              )}
            </div>

          </div>

        </div>
        
        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-card border-t border-border p-5 flex justify-between items-center">
          <div className="text-sm font-medium">
            Status: <span className="uppercase text-xs tracking-wider px-2 py-1 bg-secondary rounded-md ml-2">{order.status}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {order.status === "pending" && onApprove && (
              <Button onClick={() => { onApprove(order.id); onClose(); }} className="gap-2 bg-success hover:bg-success/90 text-white">
                <CheckCircle2 className="w-4 h-4" /> Approve Order
              </Button>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
