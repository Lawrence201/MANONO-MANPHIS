import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { AnalyticsClient } from "./analytics-client";
import { 
  getRevenueForecast, 
  getMarketOpportunity, 
  getPerformanceKPIs, 
  getTeamLeaderboard 
} from "@/lib/actions/analytics-actions";

export default async function AnalyticsPage() {
  const [revenueRes, marketRes, kpiRes, teamRes] = await Promise.all([
    getRevenueForecast(),
    getMarketOpportunity(),
    getPerformanceKPIs(),
    getTeamLeaderboard()
  ]);

  const revenueData = (revenueRes.success ? revenueRes.data : []) as any[];
  const scatterData = (marketRes.success ? marketRes.data : []) as any[];
  const radarData = (kpiRes.success ? kpiRes.data : []) as any[];
  const teamPerf = (teamRes.success ? teamRes.data : []) as any[];

  return (
    <AppLayout
      title="Business Intelligence"
      subtitle="Deep analytics, forecasting, and team performance insights"
      actions={<Button variant="outline" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export Report</Button>}
    >
      <AnalyticsClient 
        revenueData={revenueData} 
        radarData={radarData} 
        scatterData={scatterData} 
        teamPerf={teamPerf} 
      />
    </AppLayout>
  );
}
