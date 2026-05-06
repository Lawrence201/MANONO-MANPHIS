import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { commThreads } from "@/lib/mock-data";
import { Mail, Phone, MessageCircle, StickyNote, Plus, Search, Filter } from "lucide-react";

const channelMap = {
  email: { icon: Mail, color: "text-primary", bg: "bg-primary/10", label: "Email" },
  call: { icon: Phone, color: "text-success", bg: "bg-success/10", label: "Call" },
  whatsapp: { icon: MessageCircle, color: "text-success", bg: "bg-success/10", label: "WhatsApp" },
  note: { icon: StickyNote, color: "text-warning", bg: "bg-warning/10", label: "Internal Note" },
};

export default function CommunicationsPage() {
  const unread = commThreads.filter(c => c.unread).length;

  return (
    <AppLayout
      title="Communications Center"
      subtitle="Unified inbox for emails, calls, WhatsApp and internal notes — every conversation in context"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Filter className="w-4 h-4" /> Filter</Button>
          <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Plus className="w-4 h-4" /> New Message</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Unread" value={unread.toString()} hint="awaiting reply" accent />
        <StatCard label="Active Threads" value={commThreads.length.toString()} hint="across channels" />
        <StatCard label="Avg Response" value="2.4h" hint="last 7 days" />
        <StatCard label="Calls Today" value="8" hint="logged interactions" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Channel filter */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-card h-fit">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Channels</h3>
          <ul className="space-y-1">
            {[
              { label: "All Conversations", icon: Search, count: commThreads.length, active: true },
              { label: "Email", icon: Mail, count: commThreads.filter(c => c.channel === "email").length },
              { label: "WhatsApp", icon: MessageCircle, count: commThreads.filter(c => c.channel === "whatsapp").length },
              { label: "Calls", icon: Phone, count: commThreads.filter(c => c.channel === "call").length },
              { label: "Internal Notes", icon: StickyNote, count: commThreads.filter(c => c.channel === "note").length },
            ].map((c) => {
              const Ci = c.icon;
              return (
                <li key={c.label}>
                  <button className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-xs transition-colors ${c.active ? "bg-secondary font-semibold" : "hover:bg-secondary/50 text-muted-foreground"}`}>
                    <Ci className="w-3.5 h-3.5" />
                    <span className="flex-1 text-left">{c.label}</span>
                    <span className="text-[10px] text-muted-foreground tabular-nums">{c.count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Thread list */}
        <div className="lg:col-span-3 bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="p-3 border-b border-border">
            <Input placeholder="Search messages..." className="h-9 bg-secondary/50 border-transparent" />
          </div>
          <div className="divide-y divide-border">
            {commThreads.map((t) => {
              const c = channelMap[t.channel as keyof typeof channelMap];
              const Ci = c.icon;
              return (
                <div key={t.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors cursor-pointer ${t.unread ? "bg-primary/[0.03]" : ""}`}>
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-xs font-semibold text-white shrink-0 relative">
                    {t.initials}
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${c.bg} border-2 border-card flex items-center justify-center`}>
                      <Ci className={`w-2.5 h-2.5 ${c.color}`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{t.customer}</span>
                      <span className={`text-[9px] font-bold uppercase ${c.bg} ${c.color} px-1.5 py-0.5 rounded`}>{c.label}</span>
                      {t.unread && <span className="w-2 h-2 rounded-full bg-accent" />}
                    </div>
                    <div className="text-xs font-medium mb-0.5 line-clamp-1">{t.subject}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-2">{t.preview}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{t.agent} · {t.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
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
