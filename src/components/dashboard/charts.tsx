"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
  FunnelChart, Funnel, LabelList,
} from "recharts";
import { revenueData, productPerformance, countryData, pipelineFunnel } from "@/lib/mock-data";

const tooltipStyle = {
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  fontSize: "12px",
  boxShadow: "var(--shadow-lg)",
  padding: "8px 12px",
};

const formatCurrency = (n: number) => `$${(n / 1000).toFixed(0)}k`;

export function RevenueChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-display font-semibold text-base">Revenue Performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue with order volume</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-chart-1" />
            <span className="text-muted-foreground">Revenue</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-chart-2" />
            <span className="text-muted-foreground">Orders</span>
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="ord" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
              <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: any, n) => n === "revenue" ? [`$${v.toLocaleString()}`, "Revenue"] : [v, n]} />
          <Area type="monotone" dataKey="revenue" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#rev)" />
          <Area type="monotone" dataKey="orders" stroke="var(--color-chart-2)" strokeWidth={2} fill="url(#ord)" yAxisId={0} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProductPerformanceChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="mb-6">
        <h3 className="font-display font-semibold text-base">Product Performance</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Revenue by product line (YTD)</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={productPerformance} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" horizontal={false} />
          <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={formatCurrency} />
          <YAxis dataKey="product" type="category" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={110} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`$${v.toLocaleString()}`, "Revenue"]} cursor={{ fill: "var(--color-secondary)" }} />
          <Bar dataKey="revenue" fill="var(--color-chart-2)" radius={[0, 6, 6, 0]} barSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CountryDistributionChart() {
  const palette = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "#8b5cf6", "#ec4899", "#94a3b8"];
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="mb-4">
        <h3 className="font-display font-semibold text-base">Top Export Markets</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Revenue distribution by country</p>
      </div>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width="50%" height={220}>
          <PieChart>
            <Pie
              data={countryData}
              dataKey="revenue"
              nameKey="country"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={2}
              stroke="var(--color-card)"
              strokeWidth={2}
            >
              {countryData.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `$${v.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {countryData.slice(0, 6).map((c, i) => (
            <div key={c.country} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: palette[i] }} />
                <span className="font-medium truncate">{c.country}</span>
              </div>
              <span className="text-muted-foreground tabular-nums">{c.share}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PipelineFunnelChart() {
  const max = pipelineFunnel[0].value;
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="mb-6">
        <h3 className="font-display font-semibold text-base">Sales Pipeline Funnel</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Lead conversion by stage</p>
      </div>
      <div className="space-y-3">
        {pipelineFunnel.map((stage, i) => {
          const pct = (stage.value / max) * 100;
          const conversion = i > 0 ? ((stage.value / pipelineFunnel[i - 1].value) * 100).toFixed(0) : null;
          return (
            <div key={stage.stage}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium">{stage.stage}</span>
                <div className="flex items-center gap-2">
                  {conversion && <span className="text-muted-foreground">→ {conversion}%</span>}
                  <span className="font-semibold tabular-nums">{stage.value}</span>
                </div>
              </div>
              <div className="h-9 rounded-md bg-secondary overflow-hidden relative">
                <div
                  className="h-full rounded-md transition-all duration-700 flex items-center px-3 text-white text-xs font-medium"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, var(--color-chart-${i + 1}), var(--color-chart-${i + 1}) 60%, transparent)`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Overall Conversion</span>
        <span className="text-lg font-bold font-display text-gradient-accent">
          {((pipelineFunnel[4].value / pipelineFunnel[0].value) * 100).toFixed(1)}%
        </span>
      </div>
    </div>
  );
}

export function ConversionTrendChart() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="font-display font-semibold text-base">Lead Volume & Orders</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Pipeline activity throughout the year</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={revenueData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="leads" stroke="var(--color-chart-3)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-chart-3)" }} activeDot={{ r: 5 }} />
          <Line type="monotone" dataKey="orders" stroke="var(--color-chart-2)" strokeWidth={2.5} dot={{ r: 3, fill: "var(--color-chart-2)" }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
