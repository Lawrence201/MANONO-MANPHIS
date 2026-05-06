"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart, ProductPerformanceChart, CountryDistributionChart, PipelineFunnelChart } from "@/components/dashboard/charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { kpis, orders } from "@/lib/mock-data";
import { DollarSign, ShoppingCart, Users, TrendingUp, Truck, Target, Download, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/badges";

const fmt = new Intl.NumberFormat("en-US");

export default function DashboardPage() {
  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back, Sarah. Here's what's happening across your trade operations."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button size="sm" className="gap-2 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> New Lead
          </Button>
        </>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard
          label="Total Revenue"
          value={`$${(kpis.revenue.value / 1000).toFixed(0)}k`}
          change={kpis.revenue.change}
          trend={kpis.revenue.trend}
          icon={<DollarSign className="w-5 h-5" />}
          accent="primary"
          sparkline={[40, 55, 48, 62, 70, 65, 80, 92]}
        />
        <KpiCard
          label="Active Orders"
          value={kpis.activeOrders.value}
          change={kpis.activeOrders.change}
          trend={kpis.activeOrders.trend}
          icon={<ShoppingCart className="w-5 h-5" />}
          accent="accent"
          sparkline={[30, 45, 52, 48, 60, 65, 72, 78]}
        />
        <KpiCard
          label="Total Leads"
          value={kpis.totalLeads.value}
          change={kpis.totalLeads.change}
          trend={kpis.totalLeads.trend}
          icon={<Users className="w-5 h-5" />}
          accent="info"
          sparkline={[25, 32, 38, 42, 50, 58, 70, 82]}
        />
        <KpiCard
          label="Conversion Rate"
          value={`${kpis.conversionRate.value}%`}
          change={kpis.conversionRate.change}
          trend={kpis.conversionRate.trend}
          icon={<Target className="w-5 h-5" />}
          accent="warm"
          sparkline={[60, 55, 62, 58, 65, 70, 68, 72]}
        />
        <KpiCard
          label="Pending Shipments"
          value={kpis.pendingShipments.value}
          change={kpis.pendingShipments.change}
          trend={kpis.pendingShipments.trend}
          icon={<Truck className="w-5 h-5" />}
          accent="primary"
          sparkline={[15, 22, 18, 25, 30, 28, 35, 42]}
        />
        <KpiCard
          label="Avg Deal Size"
          value={`$${(kpis.avgDealSize.value / 1000).toFixed(1)}k`}
          change={kpis.avgDealSize.change}
          trend={kpis.avgDealSize.trend}
          icon={<TrendingUp className="w-5 h-5" />}
          accent="accent"
          sparkline={[35, 40, 38, 45, 48, 52, 55, 60]}
        />
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <PipelineFunnelChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ProductPerformanceChart />
        <CountryDistributionChart />
        <ActivityFeed />
      </div>

      {/* Recent orders */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-base">Recent Orders</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest activity from active deals</p>
          </div>
          <Link href="/orders" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-[#f8f9fa] dark:bg-[#181818] transition-colors">
                <th className="font-medium px-5 py-3">Order ID</th>
                <th className="font-medium px-5 py-3">Customer</th>
                <th className="font-medium px-5 py-3">Product</th>
                <th className="font-medium px-5 py-3">Amount</th>
                <th className="font-medium px-5 py-3">Payment</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-black/10 dark:border-white/[0.06] last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-xs">{o.customer}</div>
                    <div className="text-[10px] text-muted-foreground">{o.company} · {o.country}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <div>{o.product}</div>
                    <div className="text-[10px] text-muted-foreground">{o.quantity}</div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">{o.currency} {fmt.format(o.amount)}</td>
                  <td className="px-5 py-3.5">
                    <PaymentBadge status={o.payment} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-accent" style={{ width: `${o.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums w-8">{o.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

