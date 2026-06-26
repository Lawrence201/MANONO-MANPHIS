"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Search, Filter, MapPin, Clock, Calendar,
  Settings, XCircle, HardHat, Activity, BarChart3,
  CheckCircle2, AlertTriangle, Shield, TrendingUp, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Dummy Data ─────────────────────────────────────────────────────────────
const DUMMY_PROJECTS = [
  {
    id: 101,
    title: "Osu Office Renovation",
    clientName: "Sarah Osei",
    location: "Osu Oxford Street",
    phase: "Finishing",
    progress: 85,
    startDate: "2026-04-10",
    deadline: "2026-07-15",
    budget: "GH₵85,000",
    status: "on_track", // on_track, delayed, completed
    thumbnail: "/uploads/construction_requests/casheew-1781879587821-99226133.webp",
    manager: "Kofi Annan",
  },
  {
    id: 102,
    title: "East Legon Boys Quarters",
    clientName: "Lawrence Antwi",
    location: "East Legon Hills",
    phase: "Foundation",
    progress: 20,
    startDate: "2026-06-01",
    deadline: "2026-10-23",
    budget: "GH₵120,000",
    status: "on_track",
    thumbnail: "/uploads/construction_requests/cashew_3-1781879587801-580794758.avif",
    manager: "Emmanuel Mensah",
  },
  {
    id: 103,
    title: "Spintex Roof Replacement",
    clientName: "Kwame Mensah",
    location: "Spintex Road",
    phase: "Framing",
    progress: 45,
    startDate: "2026-05-15",
    deadline: "2026-06-25",
    budget: "GH₵45,000",
    status: "delayed",
    thumbnail: "/construction/hero.png",
    manager: "David Otoo",
  },
  {
    id: 104,
    title: "Cantonments Villa Extension",
    clientName: "Dr. Appiah",
    location: "Cantonments",
    phase: "Completed",
    progress: 100,
    startDate: "2026-01-10",
    deadline: "2026-06-05",
    budget: "GH₵350,000",
    status: "completed",
    thumbnail: "/construction/hero.png",
    manager: "Kofi Annan",
  }
];

// ── Helpers ─────────────────────────────────────────────────────────────
const PHASE_COLORS: Record<string, string> = {
  "Planning": "bg-slate-500",
  "Foundation": "bg-amber-600",
  "Framing": "bg-orange-500",
  "Finishing": "bg-blue-500",
  "Completed": "bg-emerald-500",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  on_track:  { label: "On Track",  color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  delayed:   { label: "Delayed",   color: "text-red-500",     bg: "bg-red-500/10",     icon: AlertTriangle },
  completed: { label: "Completed", color: "text-blue-500",    bg: "bg-blue-500/10",    icon: CheckCircle2 },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function daysLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function StatCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string | number; sub?: string; icon: any, accent?: boolean }) {
  return (
    <div className={cn("bg-card rounded-xl border p-5 flex items-start gap-4 transition-all duration-300 shadow-sm", accent ? "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "border-border")}>
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", accent ? "bg-emerald-500/10" : "bg-muted/50")}>
        <Icon className={cn("w-5 h-5", accent ? "text-emerald-500" : "text-muted-foreground")} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Project Update Modal ─────────────────────────────────────────────────
function UpdateModal({ project, onClose }: { project: any, onClose: () => void }) {
  const [progress, setProgress] = useState(project.progress);
  const [phase, setPhase] = useState(project.phase);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-border flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <h2 className="font-display font-bold text-foreground text-lg">Update Project</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{project.title}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-6">
          
          {/* Progress Slider */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" /> Overall Progress
              </label>
              <span className="text-2xl font-display font-black text-foreground">{progress}%</span>
            </div>
            
            <input 
              type="range" 
              min="0" max="100" 
              value={progress}
              onChange={(e) => setProgress(parseInt(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            
            <div className="w-full bg-muted/50 rounded-full h-3 mt-3 overflow-hidden border border-border">
              <div 
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Phase Selector */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <HardHat className="w-3.5 h-3.5" /> Construction Phase
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Planning", "Foundation", "Framing", "Finishing", "Completed"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPhase(p)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs font-semibold transition-all border",
                    phase === p 
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600" 
                      : "bg-card border-border text-muted-foreground hover:bg-muted"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">
              Admin Notes
            </label>
            <textarea 
              className="w-full bg-muted/30 border border-border rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
              placeholder="Add update notes for the team..."
            ></textarea>
          </div>

          <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={onClose}>
            <CheckCircle2 className="w-4 h-4" /> Save Changes
          </Button>

        </div>
      </div>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────
export default function ActiveProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const filtered = DUMMY_PROJECTS.filter(p => {
    const matchSearch = !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = DUMMY_PROJECTS.length;
  const onTrack = DUMMY_PROJECTS.filter(p => p.status === "on_track").length;
  const delayed = DUMMY_PROJECTS.filter(p => p.status === "delayed").length;
  const completed = DUMMY_PROJECTS.filter(p => p.status === "completed").length;

  return (
    <AppLayout>
      
      {/* Modal */}
      {selectedProject && (
        <UpdateModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      <div className="flex flex-col gap-6 p-6">
        
        {/* Header */}
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Active Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Track construction progress, deadlines, and phases.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Active" value={total - completed} sub="Ongoing projects" icon={HardHat} />
          <StatCard label="On Track" value={onTrack} sub="Meeting deadlines" icon={TrendingUp} />
          <StatCard label="Delayed" value={delayed} sub="Requires attention" icon={AlertTriangle} />
          <StatCard label="Completed" value={completed} sub="Finished this year" icon={CheckCircle2} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by project, client, or location..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
            {["all", "on_track", "delayed", "completed"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap",
                  statusFilter === s
                    ? "bg-accent text-accent-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s]?.label || s}
              </button>
            ))}
          </div>
        </div>

        {/* Card Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border rounded-xl">
            <HardHat className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No projects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(project => {
              const StatusIcon = STATUS_CONFIG[project.status].icon;
              return (
                <div key={project.id} className="bg-card rounded-2xl border border-border shadow-card overflow-hidden flex flex-col group hover:shadow-lg transition-all duration-300">
                  
                  {/* Image Hero */}
                  <div className="relative h-[160px] bg-muted overflow-hidden">
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Status Pill */}
                    <div className={cn("absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md", STATUS_CONFIG[project.status].bg, STATUS_CONFIG[project.status].color)}>
                      <StatusIcon className="w-3 h-3" /> {STATUS_CONFIG[project.status].label}
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg leading-tight drop-shadow-md truncate">{project.title}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <MapPin className="w-3 h-3 text-white/70" />
                        <p className="text-white/80 text-xs font-medium truncate">{project.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    
                    {/* Client & Manager */}
                    <div className="flex items-center justify-between mb-5 bg-muted/30 p-3 rounded-lg border border-border/50">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Client</p>
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                           {project.clientName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Site Manager</p>
                        <p className="text-sm font-medium text-foreground">{project.manager}</p>
                      </div>
                    </div>

                    {/* Progress Area */}
                    <div className="mb-5">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Phase</p>
                          <p className="text-sm font-bold text-foreground mt-0.5">{project.phase}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-display font-black text-foreground">{project.progress}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2 overflow-hidden border border-border/50">
                        <div 
                          className={cn("h-full transition-all duration-1000", PHASE_COLORS[project.phase] || "bg-emerald-500")} 
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div>
                        <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">Deadline</span>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{formatDate(project.deadline)}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1.5 text-muted-foreground mb-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[10px] uppercase tracking-widest font-bold">Time Left</span>
                        </div>
                        <p className={cn("text-sm font-bold", project.status === 'completed' ? 'text-blue-500' : daysLeft(project.deadline) < 30 ? "text-red-500" : "text-emerald-500")}>
                          {project.status === 'completed' ? 'Done' : `${daysLeft(project.deadline)} Days`}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Actions */}
                  <div className="border-t border-border p-3 bg-muted/10">
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 text-muted-foreground hover:text-foreground border-border bg-card"
                      onClick={() => setSelectedProject(project)}
                    >
                      <Settings className="w-4 h-4" /> Update Progress
                    </Button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
