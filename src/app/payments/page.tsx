"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { orders } from "@/lib/mock-data";
import { PaymentBadge } from "@/components/dashboard/badges";
import { CreditCard, Smartphone, Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const fmt = new Intl.NumberFormat("en-US");

const methods = [
  { name: "Bank Transfer", value: 1850000, fill: "var(--color-chart-1)", icon: Building2 },
  { name: "Card Payment", value: 620000, fill: "var(--color-chart-2)", icon: CreditCard },
  { name: "Mobile Money", value: 377350, fill: "var(--color-chart-3)", icon: Smartphone },
];

export default function PaymentsPage() {
  const total = orders.reduce((s, o) => s + o.amount, 0);
  const paid = orders.filter(o => o.payment === "paid").reduce((s, o) => s + o.amount, 0);
  const pending = orders.filter(o => o.payment === "pending" || o.payment === "partial").reduce((s, o) => s + o.amount, 0);
  const overdue = orders.filter(o => o.payment === "overdue").reduce((s, o) => s + o.amount, 0);

  return (
    <AppLayout
      title="Payments"
      subtitle="Track collections, monitor outstanding balances, and manage installment plans"
      actions={<Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> Record Payment</Button>}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Total Invoiced" value={`$${(total / 1000).toFixed(0)}k`} hint="across all orders" />
        <Stat label="Collected" value={`$${(paid / 1000).toFixed(0)}k`} hint={`${((paid / total) * 100).toFixed(0)}% of total`} success />
        <Stat label="Outstanding" value={`$${(pending / 1000).toFixed(0)}k`} hint="awaiting collection" warning />
        <Stat label="Overdue" value={`$${(overdue / 1000).toFixed(0)}k`} hint="needs attention" danger />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Payment methods */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card lg:col-span-1">
          <h3 className="font-display font-semibold text-base mb-1">Payment Methods</h3>
          <p className="text-xs text-muted-foreground mb-4">Distribution by channel</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={methods} dataKey="value" innerRadius={45} outerRadius={75} paddingAngle={3} stroke="var(--color-card)" strokeWidth={2}>
                {methods.map((m, i) => <Cell key={i} fill={m.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px", fontSize: "12px" }} formatter={(v: any) => `$${fmt.format(v)}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {methods.map((m) => {
              const I = m.icon;
              return (
                <div key={m.name} className="flex items-center gap-3 text-xs">
                  <div className="w-7 h-7 rounded-md flex items-center justify-center text-white" style={{ background: m.fill }}>
                    <I className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium flex-1">{m.name}</span>
                  <span className="text-muted-foreground tabular-nums">${fmt.format(m.value)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent transactions */}
        <div className="bg-card rounded-xl border border-border shadow-card lg:col-span-2 overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="font-display font-semibold text-base">Payment Tracking</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Order-level payment status</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                  <th className="font-medium px-5 py-3">Order</th>
                  <th className="font-medium px-5 py-3">Customer</th>
                  <th className="font-medium px-5 py-3">Amount</th>
                  <th className="font-medium px-5 py-3">Status</th>
                  <th className="font-medium px-5 py-3">Method</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, i) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs font-semibold">{o.id}</td>
                    <td className="px-5 py-3 text-xs">{o.company}</td>
                    <td className="px-5 py-3 font-semibold tabular-nums text-xs">{o.currency} {fmt.format(o.amount)}</td>
                    <td className="px-5 py-3"><PaymentBadge status={o.payment} /></td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">{i % 3 === 0 ? "Bank Transfer" : i % 3 === 1 ? "Card" : "Mobile Money"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Stat({ label, value, hint, success, warning, danger }: { label: string; value: string; hint: string; success?: boolean; warning?: boolean; danger?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={cn("text-2xl font-bold font-display mt-2", success && "text-success", warning && "text-warning", danger && "text-destructive")}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
