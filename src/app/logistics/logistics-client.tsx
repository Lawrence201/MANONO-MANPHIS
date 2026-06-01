"use client";

import { useState } from "react";
import { Plane, Ship, Package, MapPin, Calendar, FileText, Download, ChevronDown, CheckCircle2, Factory, CheckSquare, PackageCheck, Waves, Cloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateExportOrderStatus } from "@/lib/actions/export-order-actions";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const shipIcon = (s: string) => {
  const t = (s || "").toLowerCase();
  if (t.includes("air")) return Plane;
  if (t.includes("ocean") || t.includes("sea")) return Ship;
  return Package;
};

const STATUS_STAGES = [
  { id: "approved", label: "Order Confirmed" },
  { id: "processing", label: "Production" },
  { id: "shipped", label: "In Transit" },
  { id: "delivered", label: "Delivered" },
];

export function LogisticsClient({ initialShipments }: { initialShipments: any[] }) {
  const [shipments, setShipments] = useState(initialShipments);
  const [selectedUpdate, setSelectedUpdate] = useState<{ id: number; status: string; label: string } | null>(null);
  const [updateDate, setUpdateDate] = useState<string>("");

  const handleUpdateStatus = async (id: number, newStatus: string, timestamp?: string) => {
    // Optimistic update
    setShipments(prev => prev.map(s => s.id === id ? { ...s, status: newStatus } : s));
    
    const res = await updateExportOrderStatus(id, newStatus, timestamp);
    if (res.success) {
      toast.success(`Shipment #${id} updated to ${newStatus}`);
    } else {
      toast.error("Failed to update status");
      // Revert on failure
      setShipments(initialShipments);
    }
  };

  const getProgress = (status: string) => {
    switch (status) {
      case "approved": return 25;
      case "processing": return 50;
      case "shipped": 
      case "in_transit": return 75;
      case "delivered": return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-4">
      {shipments.map((s) => {
        const ShipI = shipIcon(s.shippingType);
        const progress = getProgress(s.status);

        return (
          <div key={s.id} className="relative bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-elegant transition-all overflow-hidden group">
            
            {/* Thematic Backgrounds */}
            <div className="absolute inset-0 pointer-events-none opacity-5 transition-opacity group-hover:opacity-10">
              {(s.shippingType || "").toLowerCase().includes("ocean") && (
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0iIzM4YmRmOCIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNMDEsMTI4TDEyMCwxNDlDMjQwLDE3MCw0ODAsMjEzLDcyMCwyMTRDOTYwLDIxNSwxMjAwLDE3MSwxMzIwLDE0OUwxNDQwLDEyOEwxNDQwLDMyMEwxMzIwLDMyMEMxMjAwLDMyMCw5NjAsMzIwLDcyMCwzMjBDNDgwLDMyMCwyNDAsMzIwLDEyMCwzMjBMMDEsMzIwWiI+PC9wYXRoPjwvc3ZnPg==')] bg-cover bg-bottom animate-pulse" />
              )}
              {(s.shippingType || "").toLowerCase().includes("air") && (
                <div className="absolute top-0 left-0 right-0 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0iI2Y1OWUwYiIgZmlsbC1vcGFjaXR5PSIxIiBkPSJNMDEsMTYwTDEyMCwxMjRDMjQwLDc4LDQ4MCw0NCw3MjAsNThDOTYwLDczLDEyMDAsMTM4LDEzMjAsMTcwTDE0NDAsMjAyTDE0NDAsMEwxMzIwLDBDMTIwMCwwLDk2MCwwLDcyMCwwQzQ4MCwwLDI0MCwwLDEyMCwwTDAxLDBaIj48L3BhdGg+PC9zdmc+')] bg-cover bg-top animate-pulse" />
              )}
            </div>

            <div className="relative z-10 flex items-start justify-between gap-4 mb-5 flex-wrap">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md",
                  (s.shippingType || "").toLowerCase().includes("air") ? "bg-gradient-warm" : "bg-gradient-primary"
                )}>
                  <ShipI className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold">EXP-{s.id}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary">
                      {s.shippingType || "Standard"}
                    </span>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 py-0 border-primary/20 text-primary bg-primary/5 hover:bg-primary/10">
                          {s.status.toUpperCase()} <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {STATUS_STAGES.map(stage => (
                          <DropdownMenuItem 
                            key={stage.id}
                            onClick={() => {
                              setSelectedUpdate({ id: s.id, status: stage.id, label: stage.label });
                              const now = new Date();
                              now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
                              setUpdateDate(now.toISOString().slice(0, 16));
                            }}
                            className="text-xs"
                          >
                            Mark as {stage.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                  </div>
                  <div className="text-sm font-medium mt-0.5">{s.product.name} · {s.quantityRequested} {s.unitMeasurement}</div>
                  <div className="text-xs text-muted-foreground">{s.companyName}</div>
                </div>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 justify-end">
                    <MapPin className="w-2.5 h-2.5" /> Destination
                  </div>
                  <div className="text-sm font-semibold mt-0.5">{s.destinationCountry}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 justify-end">
                    <Calendar className="w-2.5 h-2.5" /> Ordered
                  </div>
                  <div className="text-sm font-semibold mt-0.5 tabular-nums">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Thematic Timeline */}
            <div className="relative mt-8 mb-4">
              <div className="absolute left-0 right-0 top-3 h-1.5 bg-secondary rounded-full overflow-hidden" />
              
              {/* Progress Bar Fill */}
              <div 
                className={cn(
                  "absolute left-0 top-3 h-1.5 rounded-full transition-all duration-1000 ease-out",
                  (s.shippingType || "").toLowerCase().includes("air") ? "bg-gradient-warm" : "bg-gradient-primary"
                )} 
                style={{ width: `${progress}%` }} 
              />
              
              {/* Floating Vehicle Icon */}
              {(progress > 0 && progress < 100) && (
                <div 
                  className="absolute top-1 -mt-2 transition-all duration-1000 ease-out z-20"
                  style={{ left: `calc(${progress}% - 14px)` }}
                >
                  <div className="bg-white dark:bg-black p-1 rounded-full shadow-lg border border-border">
                    <ShipI className={cn("w-4 h-4", (s.shippingType || "").toLowerCase().includes("air") ? "text-orange-500" : "text-blue-500")} />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-4 relative z-10">
                {STATUS_STAGES.map((stage, i) => {
                  const stageProgress = (i + 1) * 25;
                  const done = progress >= stageProgress;
                  const isCurrent = progress === stageProgress;
                  
                  // Thematic icons for stages
                  const StageIcon = i === 0 ? CheckSquare : i === 1 ? Factory : i === 2 ? ((s.shippingType || "").toLowerCase().includes("air") ? Cloud : Waves) : PackageCheck;
                  
                  return (
                    <div key={i} className="flex flex-col items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all bg-card shadow-sm",
                        done
                          ? "border-accent text-accent"
                          : "border-border text-muted-foreground",
                        isCurrent && "shadow-glow bg-accent text-white border-accent scale-110"
                      )}>
                        {isCurrent ? <StageIcon className="w-4 h-4" /> : (done ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-border" />)}
                      </div>
                      <span className={cn("text-[10px] mt-2 text-center max-w-[90px]", done ? "font-semibold text-foreground" : "text-muted-foreground")}>
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Documents */}
            <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-2">Documents:</span>
              
              {s.invoicePdfPath ? (
                <a href={s.invoicePdfPath} target="_blank" rel="noopener noreferrer" className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-500/10 text-green-600 hover:bg-green-500/20 font-medium transition-colors">
                  <FileText className="w-2.5 h-2.5" /> Invoice
                </a>
              ) : (
                <span className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-muted-foreground opacity-50 cursor-not-allowed">
                  <FileText className="w-2.5 h-2.5" /> No Invoice
                </span>
              )}

              {["Bill of Lading", "Cert. of Origin"].map((doc) => (
                <button key={doc} className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary hover:bg-accent/10 hover:text-accent transition-colors">
                  <FileText className="w-2.5 h-2.5" /> {doc}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      
      {shipments.length === 0 && (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold">No Active Shipments</h3>
          <p className="text-muted-foreground text-sm mt-1">Approve pending export orders to move them into logistics.</p>
        </div>
      )}
      {/* Status Update Modal */}
      <Dialog open={!!selectedUpdate} onOpenChange={(open) => !open && setSelectedUpdate(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Status Time</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              You are marking Shipment <strong>#EXP-{selectedUpdate?.id}</strong> as <strong>{selectedUpdate?.label}</strong>. 
              Please confirm the exact date and time this occurred:
            </p>
            <input 
              type="datetime-local" 
              value={updateDate}
              onChange={(e) => setUpdateDate(e.target.value)}
              className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedUpdate(null)}>Cancel</Button>
            <Button onClick={() => {
              if (selectedUpdate) {
                handleUpdateStatus(selectedUpdate.id, selectedUpdate.status, new Date(updateDate).toISOString());
                setSelectedUpdate(null);
              }
            }}>Confirm Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
