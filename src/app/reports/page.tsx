"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reportTemplates, revenueData, countryData } from "@/lib/mock-data";
import { Download, Plus, Calendar, FileSpreadsheet, FileText, Filter, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

export default function ReportsPage() {
  return (
    <AppLayout
      title="Reports Center"
      subtitle="Generate, schedule and export business documents — distinct from real-time analytics"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Calendar className="w-4 h-4" /> Schedule</Button>
          <Button size="sm" className="gap-2 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm"><Plus className="w-4 h-4" /> Generate Report</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Reports Generated" value="247" hint="this quarter" />
        <StatCard label="Scheduled Reports" value="18" hint="active schedules" accent />
        <StatCard label="Total Storage" value="84.2 MB" hint="archived docs" />
        <StatCard label="Distribution Lists" value="12" hint="recipient groups" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="font-display font-semibold text-base mb-1">Report Generation Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly report output volume</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              <Bar dataKey="orders" fill="#6aabfc" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="font-display font-semibold text-base mb-1">By Category</h3>
          <p className="text-xs text-muted-foreground mb-4">Report types distribution</p>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={countryData.slice(0, 5)} dataKey="orders" nameKey="country" outerRadius={80} innerRadius={45}>
                {countryData.slice(0, 5).map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Input placeholder="Search reports..." className="max-w-xs h-9 bg-card" />
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Type</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Format</Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-[#f8f9fa] dark:bg-[#181818] transition-colors">
                <th className="font-medium px-5 py-3">Report</th>
                <th className="font-medium px-5 py-3">Type</th>
                <th className="font-medium px-5 py-3">Format</th>
                <th className="font-medium px-5 py-3">Size</th>
                <th className="font-medium px-5 py-3">Schedule</th>
                <th className="font-medium px-5 py-3">Generated</th>
                <th className="font-medium px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportTemplates.map((r) => (
                <tr key={r.id} className="border-b border-black/[0.08] dark:border-white/[0.06] last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                        {r.format === "PDF" ? <FileText className="w-4 h-4 text-destructive" /> : <FileSpreadsheet className="w-4 h-4 text-[#6aabfc]" />}
                      </div>
                      <div>
                        <div className="font-medium text-xs">{r.name}</div>
                        <div className="text-[10px] text-muted-foreground font-mono">{r.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="text-[10px] font-semibold bg-secondary px-2 py-0.5 rounded">{r.type}</span></td>
                  <td className="px-5 py-3.5 text-xs">{r.format}</td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground tabular-nums">{r.size}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{r.schedule}</span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted-foreground">{r.generated}</td>
                  <td className="px-5 py-3.5 text-right">
                    <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-[#6aabfc] hover:text-[#6aabfc]/80"><Download className="w-3.5 h-3.5" /> Download</Button>
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

function StatCard({ label, value, hint, accent }: { label: string; value: string; hint: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card">
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-bold font-display mt-2 ${accent ? "text-gradient-accent" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
