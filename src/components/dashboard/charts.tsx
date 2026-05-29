"use client";

import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar, Legend,
  FunnelChart, Funnel, LabelList,
} from "recharts";
import { countryData } from "@/lib/mock-data";

const tooltipStyle = {
  backgroundColor: "var(--color-card)",
  border: "1px solid var(--color-border)",
  borderRadius: "8px",
  fontSize: "12px",
  boxShadow: "var(--shadow-lg)",
  padding: "8px 12px",
};

const formatCurrency = (n: number) => `GH₵ ${(n / 1000).toFixed(0)}k`;

// Empty baseline — chart renders from real DB data only, no dummy values
const emptyMonthlyData = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
].map(month => ({ month, Billboards: 0, Honey: 0, Shea: 0, Cashew: 0 }));

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const billboardsVal = payload.find((p: any) => p.name === "Billboards")?.value || 0;
    const honeyVal = payload.find((p: any) => p.name === "Honey")?.value || 0;
    const sheaVal = payload.find((p: any) => p.name === "Shea")?.value || 0;
    const cashewVal = payload.find((p: any) => p.name === "Cashew")?.value || 0;

    return (
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl p-4 text-[12px] min-w-[200px]">
        <div className="font-bold text-zinc-900 dark:text-zinc-50 mb-2">{label}</div>
        <div className="space-y-1.5 font-bold">
          <div className="flex justify-between gap-6">
            <span className="text-[#3b82f6]">Billboards :</span>
            <span className="text-[#3b82f6] tabular-nums">GH₵{billboardsVal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#10b981]">Cashew :</span>
            <span className="text-[#10b981] tabular-nums">$ {cashewVal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#f59e0b]">Honey :</span>
            <span className="text-[#f59e0b] tabular-nums">$ {honeyVal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-[#ea580c]">Shea :</span>
            <span className="text-[#ea580c] tabular-nums">$ {sheaVal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function RevenueChart({ data }: {
  data?: { month: string; Billboards: number; Honey?: number; Shea?: number; Cashew?: number }[]
}) {
  // Merge incoming DB data into the 12-month skeleton — real zeros for empty months
  const chartData = emptyMonthlyData.map((skeleton, i) => {
    const row = data?.[i];
    return {
      month:      skeleton.month,
      Billboards: row?.Billboards ?? 0,
      Honey:      row?.Honey      ?? 0,
      Shea:       row?.Shea       ?? 0,
      Cashew:     row?.Cashew     ?? 0,
    };
  });

  const maxValue = chartData.reduce((max, d) => Math.max(max, d.Billboards + d.Honey + d.Shea + d.Cashew), 0);
  const useKFormat = maxValue >= 1000;
  
  const tickFormatter = (v: number) => {
    if (v === 0) return "GH₵ 0";
    if (useKFormat) {
      return `GH₵ ${(v / 1000).toFixed(0)}k`;
    }
    return `GH₵ ${v.toLocaleString()}`;
  };

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display font-semibold text-base">Revenue Performance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly revenue trends — Billboards (GH₵) · Exports (GH₵)</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold select-none">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
            <span className="text-[#64748b] dark:text-zinc-400">Billboards</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="text-[#64748b] dark:text-zinc-400">Honey</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]" />
            <span className="text-[#64748b] dark:text-zinc-400">Shea Butter</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span className="text-[#64748b] dark:text-zinc-400">Cashew</span>
          </span>
        </div>
      </div>
      <div className="flex-1 min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 5, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBillboards" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorHoney" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorShea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ea580c" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#ea580c" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="colorCashew" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis 
              stroke="var(--color-muted-foreground)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={tickFormatter} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="Billboards" stackId="1" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorBillboards)" />
            <Area type="monotone" dataKey="Honey" stackId="1" stroke="#f59e0b" strokeWidth={2.5} fill="url(#colorHoney)" />
            <Area type="monotone" dataKey="Shea" stackId="1" stroke="#ea580c" strokeWidth={2.5} fill="url(#colorShea)" />
            <Area type="monotone" dataKey="Cashew" stackId="1" stroke="#10b981" strokeWidth={2.5} fill="url(#colorCashew)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function ProductPerformanceChart() {
  const [mode, setMode] = useState<"commodities" | "advertising">("commodities");

  const commodityData = [
    { product: "W320 Cashew", revenue: 1250000 },
    { product: "W240 Cashew", revenue: 890000 },
    { product: "Premium Honey", revenue: 850000 },
    { product: "Refined Shea", revenue: 480000 },
    { product: "Raw Honey", revenue: 420000 },
    { product: "Raw Shea", revenue: 240000 },
  ];

  const adPackageData = [
    { product: "Digital LED Screens", revenue: 650000 },
    { product: "Static Billboards", revenue: 450000 },
    { product: "Transit Media", revenue: 280000 },
  ];

  const currentData = mode === "commodities" ? commodityData : adPackageData;
  const barColor = mode === "commodities" ? "#f59e0b" : "#3b82f6"; // Gold vs. Blue

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-semibold text-base">Product Performance</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Revenue by product line (YTD)</p>
          </div>
          <div className="flex bg-secondary p-1 rounded-lg border border-border shrink-0 select-none">
            <button
              onClick={() => setMode("commodities")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                mode === "commodities"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Commodities
            </button>
            <button
              onClick={() => setMode("advertising")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                mode === "advertising"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Advertising
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={currentData} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis 
              type="number" 
              stroke="var(--color-muted-foreground)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              tickFormatter={(v) => `GH₵ ${(v / 1000).toFixed(0)}k`} 
            />
            <YAxis 
              dataKey="product" 
              type="category" 
              stroke="var(--color-muted-foreground)" 
              fontSize={11} 
              tickLine={false} 
              axisLine={false} 
              width={120} 
            />
            <Tooltip 
              contentStyle={tooltipStyle} 
              formatter={(v: any) => [`GH₵ ${v.toLocaleString()}`, "Revenue"]} 
              cursor={{ fill: "var(--color-secondary)" }} 
            />
            <Bar dataKey="revenue" fill={barColor} radius={[0, 6, 6, 0]} barSize={22} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function CountryDistributionChart({
  exportData,
}: {
  exportData?: { name: string; revenue: number; share: number }[];
}) {
  const [mode, setMode] = useState<"exports" | "ads">("exports");

  const adLocationData = [
    { name: "Accra Central", revenue: 420000, share: 35 },
    { name: "Tema Motorway", revenue: 264000, share: 22 },
    { name: "Kumasi City", revenue: 216000, share: 18 },
    { name: "Takoradi Port", revenue: 144000, share: 12 },
    { name: "Others", revenue: 156000, share: 13 },
  ];

  const fallbackExportData = countryData.map((c) => ({ name: c.country, revenue: c.revenue, share: c.share }));

  const currentData = mode === "exports"
    ? (exportData && exportData.length > 0 ? exportData : fallbackExportData)
    : adLocationData;

  const palette = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)", "#8b5cf6", "#ec4899", "#94a3b8"];

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-semibold text-base">
              {mode === "exports" ? "Top Export Markets" : "Top Ad Locations"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === "exports" ? "Revenue distribution by country" : "Revenue distribution within Ghana (GH₵)"}
            </p>
          </div>
          <div className="flex bg-secondary p-1 rounded-lg border border-border shrink-0 select-none">
            <button
              onClick={() => setMode("exports")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                mode === "exports"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Exports
            </button>
            <button
              onClick={() => setMode("ads")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                mode === "ads"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Ad Locations
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="50%" height={220}>
            <PieChart>
              <Pie
                data={currentData}
                dataKey="revenue"
                nameKey="name"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                stroke="var(--color-card)"
                strokeWidth={2}
              >
                {currentData.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={tooltipStyle} 
                formatter={(v: any) => mode === "exports" ? `GH₵ ${v.toLocaleString()}` : `GH₵ ${v.toLocaleString()}`} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {currentData.slice(0, 6).map((c, i) => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: palette[i % palette.length] }} />
                  <span className="font-medium truncate">{c.name}</span>
                </div>
                <span className="text-muted-foreground tabular-nums">{c.share}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PipelineFunnelChart({ slotStats }: { slotStats?: { availableSlots: number, reservedSlots: number, activeSlots: number, expiredSlots: number, maintenanceSlots: number } }) {
  const [mode, setMode] = useState<"trade" | "advertising">("trade");

  const tradePipeline = [
    { stage: "New Leads", value: 487 },
    { stage: "Contacted", value: 342 },
    { stage: "Qualified", value: 218 },
    { stage: "Negotiating", value: 124 },
    { stage: "Won", value: 75 }, // ~15.4%
  ];

  const adPipeline = [
    { stage: "Available Slots", value: slotStats?.availableSlots || 0 },
    { stage: "Reserved Slots", value: slotStats?.reservedSlots || 0 },
    { stage: "Active Slots", value: slotStats?.activeSlots || 0 },
    { stage: "Expired Slots", value: slotStats?.expiredSlots || 0 },
    { stage: "Maintenance", value: slotStats?.maintenanceSlots || 0 },
  ];

  const currentData = mode === "trade" ? tradePipeline : adPipeline;
  
  // Custom logic for the funnel chart math
  const max = mode === "trade" ? currentData[0].value : Math.max(...currentData.map(d => d.value), 1);
  const totalWon = currentData[4].value;
  const totalLeads = currentData[0].value;
  const conversionRate = mode === "trade" ? ((totalWon / totalLeads) * 100).toFixed(1) : ((slotStats?.activeSlots || 0) / Math.max((slotStats?.availableSlots || 0) + (slotStats?.activeSlots || 0), 1) * 100).toFixed(1);

  const tradeColors = [
    "linear-gradient(90deg, #f59e0b, #f59e0b 60%, transparent)",
    "linear-gradient(90deg, #ea580c, #ea580c 60%, transparent)",
    "linear-gradient(90deg, #e11d48, #e11d48 60%, transparent)",
    "linear-gradient(90deg, #8b5cf6, #8b5cf6 60%, transparent)",
    "linear-gradient(90deg, #10b981, #10b981 60%, transparent)",
  ];

  const adColors = [
    "linear-gradient(90deg, #3b82f6, #3b82f6 60%, transparent)",
    "linear-gradient(90deg, #6366f1, #6366f1 60%, transparent)",
    "linear-gradient(90deg, #8b5cf6, #8b5cf6 60%, transparent)",
    "linear-gradient(90deg, #ec4899, #ec4899 60%, transparent)",
    "linear-gradient(90deg, #06b6d4, #06b6d4 60%, transparent)",
  ];

  const colors = mode === "trade" ? tradeColors : adColors;

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display font-semibold text-base">
              {mode === "trade" ? "Sales Pipeline Funnel" : "Billboard Activity Tracker"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === "trade" ? "Lead conversion by stage" : "Current slot utilization and status"}
            </p>
          </div>
          <div className="flex bg-secondary p-1 rounded-lg border border-border shrink-0 select-none">
            <button
              onClick={() => setMode("trade")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                mode === "trade"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Trade
            </button>
            <button
              onClick={() => setMode("advertising")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${
                mode === "advertising"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Advertising
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {currentData.map((stage, i) => {
            const pct = (stage.value / max) * 100;
            const conversion = i > 0 ? ((stage.value / currentData[i - 1].value) * 100).toFixed(0) : null;
            return (
              <div key={stage.stage}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-2 font-semibold">
                    {mode === "trade" && conversion && <span className="text-muted-foreground font-medium">→ {conversion}%</span>}
                    <span className="tabular-nums">{stage.value}</span>
                  </div>
                </div>
                <div className="h-9 rounded-md bg-secondary overflow-hidden relative">
                  <div
                    className="h-full rounded-md transition-all duration-700 flex items-center px-3 text-white text-xs font-medium"
                    style={{
                      width: `${pct}%`,
                      background: colors[i],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-5 pt-5 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{mode === "trade" ? "Overall Conversion" : "Slot Utilization"}</span>
        <span className="text-lg font-bold font-display text-gradient-accent">
          {conversionRate}%
        </span>
      </div>
    </div>
  );
}

const leadVolumeData = [
  { month: "Jan", leads: 0, orders: 0 },
  { month: "Feb", leads: 0, orders: 0 },
  { month: "Mar", leads: 0, orders: 0 },
  { month: "Apr", leads: 0, orders: 0 },
  { month: "May", leads: 2, orders: 2 },
  { month: "Jun", leads: 0, orders: 0 },
  { month: "Jul", leads: 0, orders: 0 },
  { month: "Aug", leads: 0, orders: 0 },
  { month: "Sep", leads: 0, orders: 0 },
  { month: "Oct", leads: 0, orders: 0 },
  { month: "Nov", leads: 0, orders: 0 },
  { month: "Dec", leads: 0, orders: 0 },
];

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
        <LineChart data={leadVolumeData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
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
