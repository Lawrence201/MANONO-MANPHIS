import { AppLayout } from "@/components/layout/app-layout";
import { getClients } from "@/lib/actions/client-actions";
import { ClientsTable } from "./clients-table";
import { Users, UserPlus, UserCheck, Activity } from "lucide-react";

export default async function ClientsPage() {
  const result = await getClients();
  const clients = result.success && result.data ? result.data : [];

  const newThisMonth = clients.filter(c => {
    const d = new Date(c.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <AppLayout
      title="Client Management"
      subtitle="Manage your registered website clients, update their contact information, and track activity."
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <SummaryCard 
          label="Total Clients" 
          value={clients.length.toString()} 
          hint="All registered clients" 
          icon={<Users className="w-5 h-5 text-muted-foreground" />}
        />
        <SummaryCard 
          label="New This Month" 
          value={newThisMonth.toString()} 
          hint="Clients joined this month" 
          accent 
          icon={<UserPlus className="w-5 h-5 text-[#6aabfc]" />}
        />
        <SummaryCard 
          label="Active Clients" 
          value={clients.length.toString()} 
          hint="Clients with accounts" 
          icon={<UserCheck className="w-5 h-5 text-muted-foreground" />}
        />
        <SummaryCard 
          label="System Status" 
          value="Online" 
          hint="Database connection active" 
          icon={<Activity className="w-5 h-5 text-success" />}
        />
      </div>

      <ClientsTable initialClients={clients} />
    </AppLayout>
  );
}

function SummaryCard({ label, value, hint, accent, icon }: { label: string; value: string; hint: string; accent?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 shadow-card relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
        {icon}
      </div>
      <div className={`text-2xl font-bold font-display mt-1 ${accent ? "text-[#6aabfc]" : ""}`}>{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{hint}</div>
    </div>
  );
}
