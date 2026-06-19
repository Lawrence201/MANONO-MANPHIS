"use client";

import { useState, useRef } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Search, Filter, Plus, Image as ImageIcon, Eye, Edit, Trash2, 
  Globe, EyeOff, XCircle, Upload, CheckCircle2, Images, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Dummy Data ─────────────────────────────────────────────────────────────
const DUMMY_PORTFOLIO = [
  {
    id: 1,
    title: "Luxury Villa Extension",
    category: "Residential",
    location: "Cantonments, Accra",
    image: "/construction/hero.png",
    published: true,
    dateAdded: "2026-05-12",
  },
  {
    id: 2,
    title: "Modern Office Fit-Out",
    category: "Commercial",
    location: "Osu Oxford Street",
    image: "/uploads/construction_requests/casheew-1781879587821-99226133.webp",
    published: true,
    dateAdded: "2026-06-01",
  },
  {
    id: 3,
    title: "East Legon Boys Quarters",
    category: "Residential",
    location: "East Legon",
    image: "/uploads/construction_requests/cashew_3-1781879587801-580794758.avif",
    published: false,
    dateAdded: "2026-06-15",
  },
  {
    id: 4,
    title: "Industrial Warehouse Flooring",
    category: "Industrial",
    location: "Tema Industrial Area",
    image: "/construction/hero.png",
    published: true,
    dateAdded: "2026-03-20",
  },
];

// ── Upload Modal Component ──────────────────────────────────────────────────
function UploadModal({ onClose }: { onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
              <Images className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground text-lg">Add Portfolio Project</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Upload high-quality images of completed work.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto scrollbar-very-thin flex-1 space-y-6">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Project Title</label>
              <Input placeholder="e.g., Luxury Villa Extension" className="bg-muted/30" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Category</label>
              <select className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
                <option>Renovation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="e.g., Cantonments, Accra" className="pl-9 bg-muted/30" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Project Description & Testimonial</label>
            <textarea 
              className="w-full bg-muted/30 border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent min-h-[100px]"
              placeholder="Describe the scope of work and include any quotes from the client..."
            ></textarea>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1.5 block">Project Photography</label>
            <input 
              type="file" 
              ref={fileRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            
            {!selectedFile ? (
              <div 
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 hover:border-accent/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="font-semibold text-foreground text-sm">Click to upload photos</p>
                <p className="text-xs text-muted-foreground mt-1 text-center max-w-xs">
                  Upload high-res JPG or PNG images. Minimum 1920x1080px recommended for gallery display.
                </p>
              </div>
            ) : (
              <div className="relative border border-border rounded-xl overflow-hidden aspect-video bg-muted group">
                <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/20" onClick={() => fileRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" /> Replace Photo
                  </Button>
                </div>
              </div>
            )}
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-muted/10">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground" onClick={onClose}>
            <CheckCircle2 className="w-4 h-4" /> Save & Publish
          </Button>
        </div>

      </div>
    </div>
  );
}

// ── Main Page Component ──────────────────────────────────────────────────
export default function PortfolioPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState(DUMMY_PORTFOLIO);

  const togglePublish = (id: number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, published: !item.published } : item));
  };

  const filtered = items.filter(p => {
    const matchSearch = !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === "all" || p.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchSearch && matchCategory;
  });

  return (
    <AppLayout>
      
      {/* Modal */}
      {isModalOpen && <UploadModal onClose={() => setIsModalOpen(false)} />}

      <div className="flex flex-col gap-6 p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground flex items-center gap-2">
              <Images className="w-6 h-6 text-accent" /> Portfolio Manager
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Curate and publish your best completed projects to the public website.</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow shrink-0">
            <Plus className="w-4 h-4" /> Add New Project
          </Button>
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
            {filtered.map(item => (
              <div key={item.id} className="group relative bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300">
                
                {/* Image Area */}
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  
                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    {item.published ? (
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
                        onClick={() => togglePublish(item.id)}
                        className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                      >
                        {item.published ? <EyeOff className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                        {item.published ? "Unpublish" : "Publish"}
                      </button>
                      <button className="bg-accent hover:bg-accent/90 text-accent-foreground backdrop-blur-md px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-glow">
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 border-t border-border flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-foreground text-sm line-clamp-1 mb-1">{item.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 shrink-0" /> {item.location}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-md">
                      {item.category}
                    </span>
                    <button className="text-muted-foreground hover:text-red-500 transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  );
}
