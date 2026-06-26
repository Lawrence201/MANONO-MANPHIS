"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Search, Filter, Plus, Image as ImageIcon, Eye, Edit, Trash2, 
  Globe, EyeOff, MapPin, Images
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
import { updateConstructionProjectStatus, deleteConstructionProject } from "@/lib/actions/construction-actions";
import { useRouter } from "next/navigation";

export default function PortfolioClient({ initialProjects }: { initialProjects: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [items, setItems] = useState(initialProjects);

  const togglePublish = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    
    // Optimistic UI update
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    
    const result = await updateConstructionProjectStatus(id, newStatus);
    if (result.success) {
      toast.success(`Project ${newStatus === "published" ? "published" : "unpublished"} successfully`);
      router.refresh();
    } else {
      toast.error(result.error);
      // Revert on failure
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: currentStatus } : item));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
    
    const result = await deleteConstructionProject(id);
    if (result.success) {
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success("Project deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  const filtered = items.filter(p => {
    const matchSearch = !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.clientName && p.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // We don't have strict categories in DB right now, but we have serviceType. Let's filter on serviceType for now
    const matchCategory = categoryFilter === "all" || (p.serviceType && p.serviceType.toLowerCase().includes(categoryFilter.toLowerCase()));
    return matchSearch && matchCategory;
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
              <Images className="w-6 h-6 text-accent" /> Portfolio Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Curate and publish your best completed projects to the public website.</p>
          </div>
          <Link href="/inventory/construction/projects/add">
            <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow shrink-0">
              <Plus className="w-4 h-4" /> Add New Project
            </Button>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
            <Filter className="w-4 h-4 text-muted-foreground shrink-0 ml-1" />
            {["all", "Residential", "Commercial", "Industrial", "Renovation"].map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap",
                  categoryFilter.toLowerCase() === c.toLowerCase()
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {c === "all" ? "All Categories" : c}
              </button>
            ))}
          </div>
          
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-border rounded-xl shadow-sm">
            <ImageIcon className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground font-medium">No portfolio items found</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your filters or add a new project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(item => {
              const isPublished = item.status === "published";
              return (
              <div key={item.id} className="group relative bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
                
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img src={item.heroImage || "/construction/hero.png"} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {isPublished ? (
                      <span className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <Globe className="w-3 h-3" /> Published
                      </span>
                    ) : (
                      <span className="bg-zinc-800/90 backdrop-blur-sm text-zinc-300 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <EyeOff className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </div>

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => togglePublish(item.id, item.status)}
                        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                      >
                        {isPublished ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        {isPublished ? "Unpublish" : "Publish"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 border-t border-border flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-foreground text-sm line-clamp-1 mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 shrink-0" /> {item.clientName || "Unknown Client"}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-md line-clamp-1">
                      {item.serviceType || "General"}
                    </span>
                    <div className="flex gap-1">
                      <Link href={`/inventory/construction/projects/edit/${item.id}`} className="text-muted-foreground hover:text-[#6aabfc] transition-colors p-1">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )})}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
