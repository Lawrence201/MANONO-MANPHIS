"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { aiInsights } from "@/lib/mock-data";
import { Activity, AlertTriangle, TrendingUp, BrainCircuit, Sparkles, Zap, Eye } from "lucide-react";
import { CediSign as DollarSign } from "@/components/CediSign";;
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconMap = { Activity, AlertTriangle, TrendingUp, DollarSign };

const sevColor: Record<string, string> = {
  warning: "text-amber-600 bg-amber-500/15 border-amber-200 dark:border-amber-500/30",
  destructive: "text-rose-600 bg-rose-500/15 border-rose-200 dark:border-rose-500/30",
  info: "text-blue-600 bg-blue-500/15 border-blue-200 dark:border-blue-500/30",
  success: "text-emerald-600 bg-emerald-500/15 border-emerald-200 dark:border-emerald-500/30",
};

const capabilities = [
  { icon: Zap, title: "Predictive Maintenance", desc: "Forecasts failures from usage, runtime and historical service patterns.", count: "12 active predictions" },
  { icon: Eye, title: "Anomaly Detection", desc: "Flags unusual movement, missing scans and irregular consumption.", count: "3 anomalies detected" },
  { icon: TrendingUp, title: "Optimization", desc: "Spots underused assets, repair-vs-replace tipping points and schedule conflicts.", count: "7 recommendations" },
  { icon: Sparkles, title: "Asset Health Scoring", desc: "Composite score across condition, age, service history and warranty.", count: "1,894 assets scored" },
];

export default function InsightsPage() {
  return (
    <AppLayout
      title="AI Insights & Predictions"
      subtitle="Continuously analyzing 1,894 assets across 8 facilities — surfacing risks, opportunities and recommended actions."
      actions={
        <Button size="sm" className="gap-1.5 h-9 bg-gradient-primary text-white border-0 font-semibold shadow-glow">
          <BrainCircuit className="h-4 w-4" /> Run analysis
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Capability Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {capabilities.map(c => (
            <Card key={c.title} className="border-border/60 shadow-sm transition-all hover:shadow-md duration-300">
              <CardContent className="p-5">
                <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow mb-4">
                  <c.icon className="h-5 w-5 text-white" />
                </div>
                <div className="font-display text-[15px] font-bold text-foreground mb-1.5">{c.title}</div>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed h-10 line-clamp-3">
                  {c.desc}
                </p>
                <div className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#6aabfc]">
                  {c.count}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendations Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <div className="h-2 w-2 rounded-full bg-[#6aabfc]" />
            <h2 className="font-display text-lg font-bold tracking-tight">Active Recommendations</h2>
          </div>
          
          <div className="space-y-4">
            {aiInsights.map((ins, i) => {
              const Icon = iconMap[ins.icon as keyof typeof iconMap];
              const borderClass = ins.severity === 'destructive' ? 'border-l-rose-500' : 
                                 ins.severity === 'warning' ? 'border-l-amber-500' : 
                                 ins.severity === 'info' ? 'border-l-blue-500' : 'border-l-emerald-500';
              
              return (
                <Card key={i} className={cn("border-border/60 shadow-sm border-l-4", borderClass)}>
                  <CardContent className="p-6">
                    <div className="flex gap-5">
                      <div className={cn(
                        "h-12 w-12 shrink-0 rounded-2xl grid place-items-center shadow-inner",
                        sevColor[ins.severity]
                      )}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">
                          {ins.type}
                        </div>
                        <p className="text-sm font-bold text-foreground leading-relaxed">
                          {ins.text}
                        </p>
                        <div className="mt-4 flex gap-2">
                          <Button size="sm" className="h-8 px-4 text-[11px] font-black uppercase tracking-widest bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white">
                            Take action
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-4 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
