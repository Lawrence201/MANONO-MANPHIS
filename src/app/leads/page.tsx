import { getLeads } from "@/lib/actions/lead-actions";
import LeadsBoard from "./leads-board";

export default async function LeadsPage() {
  const res = await getLeads();
  const leads = res.success ? (res.data as any[]) : [];
  
  return <LeadsBoard initialLeads={leads} />;
}
