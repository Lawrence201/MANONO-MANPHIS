import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { systemUsers, rolePermissions } from "@/lib/mock-data";
import { UserPlus, Shield, Filter, MoreVertical, Mail, CheckCircle2, Clock, Ban } from "lucide-react";

const roleColors: Record<string, string> = {
  Admin: "bg-destructive/10 text-destructive",
  Sales: "bg-primary/10 text-primary",
  Logistics: "bg-accent/10 text-accent",
  Finance: "bg-success/10 text-success",
  Compliance: "bg-warning/10 text-warning",
};

const statusIcon = {
  active: { icon: CheckCircle2, color: "text-success", label: "Active" },
  invited: { icon: Clock, color: "text-warning", label: "Invited" },
  suspended: { icon: Ban, color: "text-destructive", label: "Suspended" },
};

export default function UsersPage() {
  return (
    <AppLayout
      title="Users & Roles"
      subtitle="Manage team access, role-based permissions and security policies"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Shield className="w-4 h-4" /> Permissions Matrix</Button>
          <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><UserPlus className="w-4 h-4" /> Invite User</Button>
        </>
      }
    >
      {/* Roles overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        {rolePermissions.map((r) => (
          <div key={r.role} className="bg-card rounded-xl border border-border p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-semibold px-2 py-1 rounded ${roleColors[r.role]}`}>{r.role}</span>
              <Shield className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="text-2xl font-bold font-display">{r.users}</div>
            <div className="text-[10px] text-muted-foreground mb-3">team members</div>
            <ul className="space-y-1">
              {r.capabilities.slice(0, 3).map((c) => (
                <li key={c} className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-success shrink-0" /> {c}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Input placeholder="Search users..." className="max-w-xs h-9 bg-card" />
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Role</Button>
        <Button variant="outline" size="sm" className="gap-2 h-9"><Filter className="w-3.5 h-3.5" /> Status</Button>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-secondary/30">
                <th className="font-medium px-5 py-3">User</th>
                <th className="font-medium px-5 py-3">Role</th>
                <th className="font-medium px-5 py-3">Permissions</th>
                <th className="font-medium px-5 py-3">Last Active</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3 text-right"></th>
              </tr>
            </thead>
            <tbody>
              {systemUsers.map((u) => {
                const s = statusIcon[u.status as keyof typeof statusIcon];
                const Si = s.icon;
                return (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white">{u.initials}</div>
                        <div>
                          <div className="font-medium text-xs">{u.name}</div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-1"><Mail className="w-2.5 h-2.5" />{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${roleColors[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs tabular-nums">{u.permissions} granted</td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{u.lastActive}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${s.color}`}>
                        <Si className="w-3 h-3" /> {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="w-3.5 h-3.5" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
