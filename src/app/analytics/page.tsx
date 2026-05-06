"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { revenueData, productPerformance, countryData } from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
  ComposedChart, Bar, Line, ScatterChart, Scatter, ZAxis,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  fontSize: "12px",
};

const teamPerf = [
  { agent: "Sarah Chen", deals: 28, revenue: 980, calls: 142, emails: 320 },
  { agent: "James Okoro", deals: 24, revenue: 850, calls: 128, emails: 285 },
  { agent: "Lisa Park", deals: 19, revenue: 620, calls: 110, emails: 240 },
  { agent: "Marco Silva", deals: 16, revenue: 510, calls: 95, emails: 210 },
];

const radarData = [
  { metric: "Lead Quality", current: 85, target: 90 },
  { metric: "Response Time", current: 78, target: 95 },
  { metric: "Win Rate", current: 72, target: 80 },
  { metric: "Avg Deal Size", current: 88, target: 75 },
  { metric: "Customer Satisfaction", current: 92, target: 90 },
  { metric: "Retention", current: 81, target: 85 },
];

const scatterData = countryData.map(c => ({
  x: c.orders,
  y: c.revenue / 1000,
  z: c.share * 30,
  name: c.country,
}));

export default function AnalyticsPage() {
  return (
    <AppLayout
      title="Business Intelligence"
      subtitle="Deep analytics, forecasting, and team performance insights"
      actions={<Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export Report</Button>}
    >
      {/* Forecast */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card mb-6">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h3 className="font-display font-semibold text-base">Revenue Forecast</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Actual vs projected revenue with order trend</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <Legend />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="forecast" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#forecast)" name="Revenue" />
            <Bar yAxisId="right" dataKey="orders" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} barSize={20} name="Orders" />
            <Line yAxisId="right" type="monotone" dataKey="leads" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={{ r: 3 }} name="Leads" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Radar — KPI health */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-base">Performance vs Target</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Multi-dimensional KPI health check</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--color-chart-grid)" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--color-muted-foreground)" }} />
              <Radar name="Current" dataKey="current" stroke="var(--color-chart-2)" fill="var(--color-chart-2)" fillOpacity={0.4} />
              <Radar name="Target" dataKey="target" stroke="var(--color-chart-1)" fill="var(--color-chart-1)" fillOpacity={0.15} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Country bubble */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <div className="mb-5">
            <h3 className="font-display font-semibold text-base">Market Opportunity Map</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Orders × Revenue × Market share</p>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" />
              <XAxis dataKey="x" name="Orders" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} label={{ value: "Orders", position: "bottom", offset: -5, fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <YAxis dataKey="y" name="Revenue ($k)" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} label={{ value: "Revenue ($k)", angle: -90, position: "insideLeft", fontSize: 10, fill: "var(--color-muted-foreground)" }} />
              <ZAxis dataKey="z" range={[80, 600]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: "3 3" }} formatter={(v: any, n: any) => n === "Revenue ($k)" ? `$${v}k` : v} />
              <Scatter data={scatterData} fill="var(--color-chart-2)" fillOpacity={0.7} stroke="var(--color-chart-2)" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team leaderboard */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <div className="mb-5">
          <h3 className="font-display font-semibold text-base">Sales Team Leaderboard</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Performance metrics by agent</p>
        </div>
        <div className="space-y-4">
          {teamPerf.map((agent, idx) => {
            const max = teamPerf[0].revenue;
            const pct = (agent.revenue / max) * 100;
            return (
              <div key={agent.agent} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {agent.agent.split(" ").map(w => w[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{agent.agent}</span>
                      {idx === 0 && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-warning/15 text-warning">🏆 Top</span>}
                    </div>
                    <span className="text-sm font-bold tabular-nums">${agent.revenue}k</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-accent rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground tabular-nums shrink-0">
                      <span>{agent.deals} deals</span>
                      <span>·</span>
                      <span>{agent.calls} calls</span>
                      <span>·</span>
                      <span>{agent.emails} emails</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
