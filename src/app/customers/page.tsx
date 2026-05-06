import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Mail, Phone, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

const customers = [
  { id: "C-001", name: "Bremen Trading GmbH", contact: "Hans Mueller", country: "Germany", flag: "🇩🇪", revenue: 685000, orders: 18, type: "VIP", tier: "Premium", since: "2021" },
  { id: "C-002", name: "Atlantic Foods Inc.", contact: "John Whitman", country: "USA", flag: "🇺🇸", revenue: 542000, orders: 14, type: "VIP", tier: "Premium", since: "2020" },
  { id: "C-003", name: "Provence Naturals", contact: "Marie Dubois", country: "France", flag: "🇫🇷", revenue: 428000, orders: 12, type: "Trusted", tier: "Standard", since: "2022" },
  { id: "C-004", name: "London Spice Co.", contact: "Oliver Smith", country: "UK", flag: "🇬🇧", revenue: 385000, orders: 11, type: "Trusted", tier: "Standard", since: "2022" },
  { id: "C-005", name: "Rotterdam Commodities", contact: "Emma Bakker", country: "Netherlands", flag: "🇳🇱", revenue: 295000, orders: 9, type: "Trusted", tier: "Standard", since: "2023" },
  { id: "C-006", name: "Gulf Trade LLC", contact: "Ahmed Al-Rashid", country: "UAE", flag: "🇦🇪", revenue: 248000, orders: 7, type: "VIP", tier: "Premium", since: "2023" },
  { id: "C-007", name: "Osaka Imports Co.", contact: "Yuki Tanaka", country: "Japan", flag: "🇯🇵", revenue: 165000, orders: 5, type: "New", tier: "Standard", since: "2024" },
  { id: "C-008", name: "Madrid Organics", contact: "Carlos Mendez", country: "Spain", flag: "🇪🇸", revenue: 142000, orders: 6, type: "Trusted", tier: "Standard", since: "2023" },
];

const fmt = new Intl.NumberFormat("en-US");

export default function CustomersPage() {
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
        <Stat label="VIP Clients" value={customers.filter(c => c.type === "VIP").length.toString()} hint="high-value buyers" accent />
        <Stat label="Lifetime Revenue" value={`$${(customers.reduce((s, c) => s + c.revenue, 0) / 1_000_000).toFixed(2)}M`} hint="across all clients" />
        <Stat label="Countries" value={new Set(customers.map(c => c.country)).size.toString()} hint="export markets" />
      </div>

      <div className="mb-4">
        <Input placeholder="Search customers by name, contact, country..." className="max-w-sm h-9 bg-card" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {customers.map((c) => (
          <div key={c.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {c.name.split(" ").slice(0, 2).map(w => w[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm truncate">{c.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{c.contact}</div>
                </div>
              </div>
              {c.type === "VIP" && <Crown className="w-4 h-4 text-warning shrink-0" />}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{c.flag}</span>
              <span className="text-xs text-muted-foreground">{c.country}</span>
              <span className={cn(
                "ml-auto text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                c.type === "VIP" && "bg-warning/15 text-warning",
                c.type === "Trusted" && "bg-success/10 text-success",
                c.type === "New" && "bg-info/10 text-info",
              )}>{c.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</div>
                <div className="text-sm font-bold tabular-nums mt-0.5">${fmt.format(c.revenue)}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Orders</div>
                <div className="text-sm font-bold tabular-nums mt-0.5">{c.orders}</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] flex-1"><Mail className="w-3 h-3 mr-1" /> Email</Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] flex-1"><Phone className="w-3 h-3 mr-1" /> Call</Button>
            </div>
          </div>
        ))}
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
