"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart, ProductPerformanceChart, CountryDistributionChart, PipelineFunnelChart } from "@/components/dashboard/charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { kpis, orders } from "@/lib/mock-data";
import { DollarSign, ShoppingCart, Users, TrendingUp, Truck, Target, Download, Plus, ArrowRight, Monitor, MessageSquare, ClipboardCheck, Globe } from "lucide-react";
import Link from "next/link";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/badges";

const fmt = new Intl.NumberFormat("en-US");

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    totalRevenue: number;
    activeBillboardsCount: number;
    totalBillboards: number;
    pendingApprovalsCount: number;
    totalClientsCount: number;
    totalBookingsCount: number;
    monthlyData?: { month: string; Billboards: number }[];
  }>({
    totalRevenue: 0,
    activeBillboardsCount: 8,
    totalBillboards: 10,
    pendingApprovalsCount: 5,
    totalClientsCount: 86,
    totalBookingsCount: 142,
    monthlyData: []
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const json = await res.json();
        if (json.success && json.data) {
          setStats({
            totalRevenue: json.data.totalRevenue || 0,
            activeBillboardsCount: json.data.activeBillboardsCount || 8,
            totalBillboards: json.data.totalBillboards || 10,
            pendingApprovalsCount: json.data.pendingApprovalsCount !== undefined ? json.data.pendingApprovalsCount : 5,
            totalClientsCount: 86, // Keep premium mock data
            totalBookingsCount: 142, // Keep premium mock data
            monthlyData: json.data.monthlyData
          });
          setRecentBookings(json.data.recentBookings || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    }
    fetchStats();
  }, []);

  const formatRevenue = (val: number) => {
    if (val === 0) return "GH₵3,485k"; // Premium fallback if no database bookings yet
    if (val >= 1000) {
      return `GH₵${(val / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`;
    }
    return `GH₵${val.toLocaleString()}`;
  };

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
          value={formatRevenue(stats.totalRevenue)}
          change={18.4}
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
          accent="primary"
          sparkline={[40, 55, 48, 62, 70, 65, 80, 92]}
        />
        <KpiCard
          label="Export Orders"
          value="142"
          change={12.1}
          trend="up"
          icon={<Truck className="w-5 h-5" />}
          accent="accent"
          sparkline={[30, 45, 52, 48, 60, 65, 72, 78]}
        />
        <KpiCard
          label="Active Billboards"
          value={stats.totalRevenue > 0 ? `${stats.activeBillboardsCount} / ${stats.totalBillboards}` : "8 / 10"}
          change={24.6}
          trend="up"
          icon={<Monitor className="w-5 h-5" />}
          accent="info"
          sparkline={[25, 32, 38, 42, 50, 58, 70, 82]}
        />
        <KpiCard
          label="New Enquiries"
          value="487"
          change={15.3}
          trend="up"
          icon={<MessageSquare className="w-5 h-5" />}
          accent="warm"
          sparkline={[60, 55, 62, 58, 65, 70, 68, 72]}
        />
        <KpiCard
          label="Pending Approvals"
          value={stats.totalRevenue > 0 ? stats.pendingApprovalsCount.toString() : "5"}
          change={-2.1}
          trend="down"
          icon={<ClipboardCheck className="w-5 h-5" />}
          accent="primary"
          sparkline={[15, 22, 18, 25, 30, 28, 35, 42]}
        />
        <KpiCard
          label="Total Clients"
          value="86"
          change={9.7}
          trend="up"
          icon={<Globe className="w-5 h-5" />}
          accent="accent"
          sparkline={[35, 40, 38, 45, 48, 52, 55, 60]}
        />
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2">
          <RevenueChart data={stats.monthlyData} />
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
              {[...recentBookings, ...orders].slice(0, 8).map((o) => (
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

