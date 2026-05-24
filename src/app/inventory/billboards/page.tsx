"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search, 
  MapPin, 
  Monitor, 
  Activity, 
  DollarSign,
  Filter,
  Trash2,
  ChevronRight,
  Star,
  MoreVertical,
  Eye,
  Pencil,
  Navigation2,
  ChevronLeft,
  Zap,
  Calendar,
  Clock,
  Phone
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getBillboards, deleteBillboard } from "@/lib/actions/billboard-actions";
import { toast } from "sonner";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BillboardsListPage() {
  const router = useRouter();
  const [billboards, setBillboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBillboards = async () => {
    setLoading(true);
    const result = await getBillboards();
    if (result.success) {
      setBillboards(result.data || []);
    } else {
      toast.error(result.error || "Failed to load billboards");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBillboards();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this billboard?")) return;
    
    const result = await deleteBillboard(id);
    if (result.success) {
      toast.success("Billboard deleted successfully");
      fetchBillboards();
    } else {
      toast.error(result.error || "Failed to delete");
    }
  };

  const filteredBillboards = billboards.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.assetCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.city.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <AppLayout
      title="Digital Billboard Inventory"
      subtitle="Manage your network of digital advertising Bill Boards and track their status."
      actions={
        <Link href="/inventory/billboards/add">
          <Button className="rounded-xl bg-[#1a1a1a] hover:bg-[#eea000] text-white px-5 py-6 h-auto transition-all shadow-xl hover:scale-105 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </Button>
        </Link>
      }
    >
      <TooltipProvider>
      <div style={{ fontFamily: "'Inter', sans-serif" }} className="animate-in fade-in duration-700 pb-20">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <StatCard 
            label="Total Billboards" 
            value={billboards.length.toString()} 
            icon={<Monitor className="w-5 h-5 text-blue-500" />} 
          />
          <StatCard 
            label="Active Billboards" 
            value={billboards.length.toString()} 
            icon={<Activity className="w-5 h-5 text-emerald-500" />} 
            accent 
          />
          <StatCard 
            label="Cities" 
            value={Array.from(new Set(billboards.map(b => b.city))).length.toString()} 
            icon={<MapPin className="w-5 h-5 text-purple-500" />} 
          />
        </div>

        {/* Modern Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm group text-inter">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <Input 
              placeholder="Search Bill Boards..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 border border-black/10 dark:border-white/10 bg-transparent rounded-2xl text-sm focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="h-12 w-12 rounded-2xl bg-transparent border border-black/10 dark:border-white/10 shadow-none">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Billboards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[400px] bg-white/50 dark:bg-white/5 rounded-2xl border border-black/5 animate-pulse" />
            ))}
          </div>
        ) : filteredBillboards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white/50 dark:bg-white/5 rounded-2xl border border-dashed border-black/10 text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black shadow-xl flex items-center justify-center mb-8">
              <Monitor className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-2xl font-bold">No Bill Boards found</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Your search didn't return any results. Try a different term or register a new Bill Board.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredBillboards.map((billboard, idx) => (
              <PremiumBillboardCard 
                key={billboard.id} 
                billboard={billboard} 
                index={idx}
                onDelete={() => handleDelete(billboard.id)} 
              />
            ))}
          </div>
        )}
      </div>
      </TooltipProvider>
    </AppLayout>
  );
}

function PremiumBillboardCard({ billboard, index, onDelete }: { billboard: any, index: number, onDelete: () => void }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Clean capitalization logic
  const city = billboard.city.charAt(0).toUpperCase() + billboard.city.slice(1).toLowerCase();
  const addressPart = (billboard.address?.split(',')[0] || "Ghana").charAt(0).toUpperCase() + (billboard.address?.split(',')[0] || "Ghana").slice(1).toLowerCase();
  const locationLabel = `${city}, ${addressPart}`;

  // Combine feature image and gallery images
  const images = [
    billboard.featureImage,
    ...(billboard.galleryImages?.map((img: any) => img.imagePath) || [])
  ].filter(Boolean);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="group bg-white dark:bg-[#1a1a1a] rounded-[24px] p-3 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-black/5 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col h-full font-inter">
      {/* Visual Header */}
      <div className="relative aspect-[1.6/1] rounded-[18px] overflow-hidden mb-4 group/image shadow-md">
        {images.length > 0 ? (
          <Image 
            src={images[activeImageIndex]} 
            alt={billboard.name} 
            fill 
            className="object-cover transition-all duration-1000 group-hover/image:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Monitor className="w-8 h-8 text-muted-foreground/20" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 scale-90 origin-top-left">
          <div className="bg-[#4b91f1]/20 backdrop-blur-xl px-3 py-1.5 rounded-full flex items-center border border-white/20 shadow-xl">
            <span className="text-[9px] font-bold text-[#4b91f1] mr-1">ID:</span>
            <span className="text-[9px] font-bold text-white tracking-tight">{billboard.assetCode}</span>
          </div>
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 scale-90 origin-top-right">
          <div className="bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full flex items-center border border-white/20 shadow-xl">
            <span className="text-[9px] font-bold text-white capitalize">{billboard.category || "Standard"}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-white/20 backdrop-blur-xl w-8 h-8 rounded-full flex items-center justify-center border border-white/20 shadow-xl hover:bg-white/30 transition-all">
                <MoreVertical className="w-3.5 h-3.5 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-2xl border-black/5">
              <DropdownMenuItem asChild className="gap-2 rounded-lg py-2 cursor-pointer text-[11px] font-semibold">
                <Link href={`/inventory/billboards/${billboard.id}`}>
                  <Eye className="w-3.5 h-3.5 text-blue-500" /> View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="gap-2 rounded-lg py-2 cursor-pointer text-[11px] font-semibold">
                <Link href={`/inventory/billboards/${billboard.id}/edit`}>
                  <Pencil className="w-3.5 h-3.5 text-amber-500" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="gap-2 rounded-lg py-2 cursor-pointer text-[11px] font-semibold text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between z-10">
          <div className="flex-1 pr-3">
            <h3 className="text-white text-[14px] font-bold tracking-tight leading-tight mb-0.5 drop-shadow-md">
              {billboard.name}
            </h3>
            <div className="flex items-center gap-1 text-white/90">
              <MapPin className="w-2.5 h-2.5 text-white/60" />
              <span className="text-[9px] font-medium tracking-tight">
                {locationLabel}
              </span>
            </div>
          </div>

          <Link href={`/inventory/billboards/${billboard.id}`} className="shrink-0">
            <button className="bg-white text-black rounded-full px-4 py-2 text-[9px] font-bold flex items-center gap-1.5 hover:bg-gray-100 transition-all shadow-xl">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </Link>
        </div>

        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-20">
            {images.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 h-1 rounded-full transition-all duration-300",
                  activeImageIndex === i ? "bg-white scale-125" : "bg-white/40"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details Section */}
      <div className="px-1 pb-1">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 grid grid-cols-2 gap-y-4 gap-x-4">
            {/* Rate & Slots */}
            <div className="space-y-0.5">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] dark:text-white leading-tight">
                GH₵{Number(billboard.weeklyRate).toLocaleString()}
              </h2>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Rate/Wk</p>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] dark:text-white leading-tight">
                {billboard.availableSlots !== undefined ? billboard.availableSlots : (billboard.maxSlots || "10")}
              </h2>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Avail. Slots</p>
            </div>

            {/* Display & Duration */}
            <div className="space-y-2">
              <div className="w-10 h-1.5 bg-[#ff69b4] rounded-full" />
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">LED Display</p>
            </div>

            <div className="space-y-0.5">
              <h2 className="text-[18px] font-bold text-[#1a1a1a] dark:text-white leading-tight">
                {billboard.minDuration?.replace(/m$/, " Month").replace(/w$/, " Week") || "1 Month"}
              </h2>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Duration</p>
            </div>

            {/* Resolution & Brightness */}
            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <h2 className="text-[18px] font-bold text-[#1a1a1a] dark:text-white leading-tight">
                  {billboard.resolution || "p6"}
                </h2>
                <Star className="w-3 h-3 text-[#eea000] fill-[#eea000]" />
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Resolution</p>
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-1">
                <h2 className="text-[18px] font-bold text-[#1a1a1a] dark:text-white leading-tight">
                  {billboard.brightness || "6500"}
                </h2>
                <Zap className="w-3 h-3 text-[#00d2ff] fill-[#00d2ff]" />
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Brightness</p>
            </div>
          </div>

          {/* Map Preview */}
          <div className="w-[95px] h-[95px] bg-gray-50 dark:bg-white/5 rounded-[20px] overflow-hidden relative shrink-0 border border-black/5 shadow-inner group/map">
            {billboard.latitude && billboard.longitude && billboard.latitude !== "0" ? (
              <>
                <img 
                  src={`https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${billboard.longitude},${billboard.latitude}&z=13&l=map&size=150,150`}
                  alt="Location"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/map:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full border border-white shadow-xl animate-pulse" />
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-1 opacity-20 h-full">
                <Navigation2 className="w-5 h-5" />
              </div>
            )}
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
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors" />
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
