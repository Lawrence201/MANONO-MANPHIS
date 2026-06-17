"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter, Trash2, MoreVertical, Pencil, HardHat, Layers, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getConstructionServices, deleteConstructionService } from "@/lib/actions/construction-actions";
import { toast } from "sonner";
import Image from "next/image";

export default function ConstructionServicesListPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchServices = async () => {
    setLoading(true);
    const result = await getConstructionServices();
    
    if (result.success) {
      setServices(result.services || []);
    } else {
      toast.error(result.error || "Failed to load construction services");
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this construction service?")) return;
    
    const result = await deleteConstructionService(id);
    if (result.success) {
      toast.success("Service deleted successfully");
      fetchServices();
    } else {
      toast.error(result.error || "Failed to delete service");
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.shortDescription && s.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AppLayout
      title="Construction Services"
      subtitle="Manage your construction and multi-service offerings for the main website."
      actions={
        <Link href="/inventory/construction/add">
          <Button className="rounded-xl bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white px-5 py-6 h-auto transition-all shadow-xl hover:scale-105 group font-bold">
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Service
          </Button>
        </Link>
      }
    >
      <div style={{ fontFamily: "'Inter', sans-serif" }} className="animate-in fade-in duration-700 pb-20">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <StatCard 
            label="Total Services" 
            value={`${services.length.toLocaleString()}`} 
            icon={<HardHat className="w-5 h-5 text-blue-500" />} 
            accent 
          />
          <StatCard 
            label="Published Services" 
            value={`${services.filter(s => s.status === 'published').length.toLocaleString()}`} 
            icon={<Activity className="w-5 h-5 text-emerald-500" />} 
          />
          <StatCard 
            label="Draft Services" 
            value={`${services.filter(s => s.status === 'draft').length.toLocaleString()}`} 
            icon={<Layers className="w-5 h-5 text-amber-500" />} 
          />
        </div>

        {/* Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm group text-inter">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <Input 
              placeholder="Search services by title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 border border-black/10 dark:border-white/10 bg-transparent rounded-2xl text-sm focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10"
            />
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[380px] bg-white/50 dark:bg-white/5 rounded-[24px] border border-black/5 animate-pulse" />
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white/50 dark:bg-white/5 rounded-[24px] border border-dashed border-black/10 text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black shadow-xl flex items-center justify-center mb-8">
              <HardHat className="w-10 h-10 text-blue-500/30" />
            </div>
            <h3 className="text-2xl font-bold">No Services Found</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              There are no construction services registered under this search. Add a new service to start.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service, idx) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={idx}
                onDelete={() => handleDelete(service.id)} 
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function ServiceCard({ service, index, onDelete }: { service: any, index: number, onDelete: () => void }) {
  const router = useRouter();

  return (
    <div className="group bg-white dark:bg-[#1a1a1a] rounded-[24px] p-3 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-black/5 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col h-full font-inter">
      {/* Image & Badges */}
      <div className="relative aspect-[16/9] rounded-[18px] overflow-hidden mb-4 group/image shadow-md">
        {service.heroImage ? (
          <Image 
            src={service.heroImage} 
            alt={service.title} 
            fill 
            className="object-cover transition-all duration-1000 group-hover/image:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-blue-500/5 dark:bg-blue-500/[0.02] flex items-center justify-center">
            <HardHat className="w-10 h-10 text-blue-500/20" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 scale-90 origin-top-left flex flex-col gap-1.5">
          <div className="bg-black/60 backdrop-blur-xl px-3 py-1.5 rounded-full flex items-center border border-white/10 shadow-xl">
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">
              {service.status === 'published' ? 'Live' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 scale-90 origin-top-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-black/40 backdrop-blur-xl w-8 h-8 rounded-full flex items-center justify-center border border-white/10 shadow-xl hover:bg-black/60 transition-all">
                <MoreVertical className="w-3.5 h-3.5 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-2xl border-black/5">
              <DropdownMenuItem onClick={() => router.push(`/inventory/construction/edit/${service.id}`)} className="gap-2 rounded-lg py-2 cursor-pointer text-[11px] font-semibold">
                <Pencil className="w-3.5 h-3.5 text-blue-500" /> Edit Service
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="gap-2 rounded-lg py-2 cursor-pointer text-[11px] font-semibold text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Service
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom Title Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between z-10">
          <div className="flex-1 pr-3">
            <h3 className="text-white text-[16px] font-bold tracking-tight leading-tight mb-1 drop-shadow-md">
              {service.title}
            </h3>
            <p className="text-[10px] text-white/80 font-medium tracking-tight truncate max-w-[200px]">
              {service.slug}
            </p>
          </div>
        </div>
      </div>

      {/* Details Specifications */}
      <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-4">
          {service.shortDescription || "No short description provided for this service."}
        </p>

        <div className="border-t border-black/5 dark:border-white/5 pt-3 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="flex -space-x-2">
                {service.galleryImages?.slice(0, 3).map((img: any, i: number) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-white dark:border-[#1a1a1a] overflow-hidden bg-gray-100">
                    <Image src={img.imagePath} alt="Gallery" width={24} height={24} className="object-cover w-full h-full" />
                  </div>
                ))}
             </div>
             <span className="text-[10px] text-gray-500 font-semibold">{service.galleryImages?.length || 0} Images</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {service.features?.length || 0} Features
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent }: { label: string; value: string; icon: React.ReactNode; accent?: boolean }) {
  return (
    <div className="bg-transparent rounded-xl border border-black/5 dark:border-white/5 p-6 shadow-none transition-all group overflow-hidden relative text-inter">
      {accent && (
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />
      )}
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] leading-tight">{label}</p>
          <h3 className="text-2xl font-bold mt-2 tracking-tight text-black dark:text-white">{value}</h3>
        </div>
        <div className="w-12 h-12 rounded-xl bg-secondary/50 dark:bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          {icon}
        </div>
      </div>
    </div>
  );
}
