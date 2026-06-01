"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Mail, Phone, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { getAggregatedCustomers } from "@/lib/actions/crm-actions";

const fmt = new Intl.NumberFormat("en-US");

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

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

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Stat label="VIP Clients" value={customers.filter(c => c.type === "VIP").length.toString()} hint="high-value buyers" accent />
        <Stat label="Lifetime Revenue" value={`GH₵ ${(customers.reduce((s, c) => s + c.revenue, 0) / 1_000_000).toFixed(2)}M`} hint="across all clients" />
        <Stat label="Countries" value={new Set(customers.map(c => c.country)).size.toString()} hint="export markets" />
      </div>

      <div className="mb-4">
        <Input 
          placeholder="Search customers by name, contact, country..." 
          className="max-w-sm h-9 bg-card"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">Loading customers from database...</div>
        ) : paginated.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">No customers found.</div>
        ) : paginated.map((c) => (
          <div key={c.id} className="bg-card rounded-xl border border-border p-5 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {c.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("")}
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
              <div className="ml-auto flex items-center gap-1.5">
                {c.hasDeliveredOrder && (
                  <span className="bg-green-100/50 text-green-600 border border-green-200/50 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                    Delivered
                  </span>
                )}
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                  c.type === "VIP" && "bg-warning/15 text-warning",
                  c.type === "Trusted" && "bg-success/10 text-success",
                  c.type === "New" && "bg-info/10 text-info",
                )}>{c.type}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Revenue</div>
                <div className="text-sm font-bold tabular-nums mt-0.5">GH₵ {fmt.format(c.revenue)}</div>
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
