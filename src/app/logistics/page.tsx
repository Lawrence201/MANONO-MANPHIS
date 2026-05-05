import { AppLayout } from "@/components/layout/app-layout";
import { shipments } from "@/lib/mock-data";
import { Plane, Ship, Package, MapPin, Calendar, FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const shipIcon = (s: string) => s === "Air" ? Plane : s === "Sea" ? Ship : Package;

export default function LogisticsPage() {
  return (
    <AppLayout
      title="Logistics & Shipping"
      subtitle="Track active shipments, manage carriers, and handle export documentation"
      actions={<Button size="sm" variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export Report</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Active Shipments" value={shipments.length.toString()} hint="in motion" />
        <Stat label="Sea Freight" value={shipments.filter(s => s.shipping === "Sea").length.toString()} hint="containers at sea" />
        <Stat label="Air Cargo" value={shipments.filter(s => s.shipping === "Air").length.toString()} hint="urgent shipments" accent />
        <Stat label="Avg Transit" value="22 days" hint="port to port" />
      </div>

      <div className="space-y-4">
        {shipments.map((s) => {
          const ShipI = shipIcon(s.shipping);
          const stages = [
            { label: "Order Confirmed", done: true },
            { label: "Production", done: s.progress >= 35 },
            { label: "Ready for Shipment", done: s.progress >= 50 },
            { label: "In Transit", done: s.progress >= 75 },
            { label: "Delivered", done: s.progress >= 100 },
          ];

          return (
            <div key={s.id} className="bg-card rounded-xl border border-border p-6 shadow-card hover:shadow-elegant transition-all">
              <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center text-white shadow-md",
                    s.shipping === "Air" && "bg-gradient-warm",
                    s.shipping === "Sea" && "bg-gradient-primary",
                    s.shipping === "Courier" && "bg-gradient-accent"
                  )}>
                    <ShipI className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold">{s.id}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary">{s.shipping}</span>
                    </div>
                    <div className="text-sm font-medium mt-0.5">{s.product} · {s.quantity}</div>
                    <div className="text-xs text-muted-foreground">{s.customer} · {s.company}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-wrap">
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 justify-end">
                      <MapPin className="w-2.5 h-2.5" /> Destination
                    </div>
                    <div className="text-sm font-semibold mt-0.5">{s.country}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1 justify-end">
                      <Calendar className="w-2.5 h-2.5" /> ETA
                    </div>
                    <div className="text-sm font-semibold mt-0.5 tabular-nums">{s.eta}</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-0 right-0 top-3 h-0.5 bg-secondary" />
                <div className="absolute left-0 top-3 h-0.5 bg-gradient-accent transition-all duration-700" style={{ width: `${s.progress}%` }} />
                <div className="grid grid-cols-5 relative">
                  {stages.map((stage, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        stage.done
                          ? "bg-accent border-accent text-white shadow-glow"
                          : "bg-card border-border"
                      )}>
                        {stage.done && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className={cn("text-[10px] mt-2 text-center max-w-[90px]", stage.done ? "font-semibold" : "text-muted-foreground")}>
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div className="mt-5 pt-4 border-t border-border flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-2">Documents:</span>
                {["Invoice", "Bill of Lading", "Cert. of Origin"].map((doc) => (
                  <button key={doc} className="text-[10px] inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary hover:bg-accent/10 hover:text-accent transition-colors">
                    <FileText className="w-2.5 h-2.5" /> {doc}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
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
