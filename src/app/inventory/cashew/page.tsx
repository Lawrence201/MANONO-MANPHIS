"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Plus, Search, Droplets, Scale, Activity, Filter, Trash2, ChevronRight, Sparkles, MoreVertical, Eye, Pencil, FileText, MapPin, Truck, ShieldCheck, Users, Layers, Package } from "lucide-react";
import { CediSign as DollarSign } from "@/components/CediSign";
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
import { getCashewProducts, deleteProduct, getCashewClientsCount } from "@/lib/actions/product-actions";
import { toast } from "sonner";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function CashewListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [totalClients, setTotalClients] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    const [result, clientsResult] = await Promise.all([
      getCashewProducts(),
      getCashewClientsCount()
    ]);
    
    if (result.success) {
      setProducts(result.data || []);
    } else {
      toast.error(result.error || "Failed to load cashew products");
    }
    
    if (clientsResult.success) {
      setTotalClients(clientsResult.count || 0);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this cashew product?")) return;
    
    const result = await deleteProduct(id);
    if (result.success) {
      toast.success("Cashew product deleted successfully");
      fetchProducts();
    } else {
      toast.error(result.error || "Failed to delete product");
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.packagingType.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (categoryFilter === "all") return matchesSearch;
    return matchesSearch && p.category === categoryFilter;
  });

  // Calculate statistics
  const organicCount = products.filter(p => p.isOrganic).length;
  const exportReadyCount = products.filter(p => p.isExportReady).length;
  const totalValuation = products.reduce((acc, curr) => acc + (Number(curr.stockQuantity) * Number(curr.pricePerUnit)), 0);
  const totalVolume = products.reduce((acc, curr) => acc + Number(curr.stockQuantity), 0);
  const totalWeightOrdered = products.reduce((acc, curr) => {
    const stock = Number(curr.stockQuantity) || 0;
    const available = curr.availableStock || 0;
    return acc + Math.max(0, stock - available);
  }, 0);

  return (
    <AppLayout
      title="Cashew Export Inventory"
      subtitle="Manage your wholesale Ghanaian cashew products, bulk packaging, export certifications, and shipping logs."
      actions={
        <Link href="/inventory/cashew/add">
          <Button className="rounded-xl bg-[#eea000] hover:bg-[#eea000]/90 text-white px-5 py-6 h-auto transition-all shadow-xl hover:scale-105 group font-bold">
            <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Cashew Batch
          </Button>
        </Link>
      }
    >
      <TooltipProvider>
      <div style={{ fontFamily: "'Inter', sans-serif" }} className="animate-in fade-in duration-700 pb-20">
        
        {/* Cashew Export Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
          <StatCard 
            label="Total Cashew Stock" 
            value={`${products.length.toLocaleString()}`} 
            icon={<Layers className="w-5 h-5 text-amber-600" />} 
          />
          <StatCard 
            label="Amount Expected" 
            value={`GH₵ ${totalValuation.toLocaleString()}`} 
            icon={<DollarSign className="w-5 h-5 text-amber-600" />} 
            accent 
          />
          <StatCard 
            label="Total Weight" 
            value={`${totalVolume.toLocaleString()} MT`} 
            icon={<Scale className="w-5 h-5 text-blue-500" />} 
          />
          <StatCard 
            label="Total Weight Ordered" 
            value={`${totalWeightOrdered.toLocaleString()} MT`} 
            icon={<Truck className="w-5 h-5 text-emerald-500" />} 
          />
          <StatCard 
            label="Total Clients (Cashew)" 
            value={totalClients.toString()} 
            icon={<Users className="w-5 h-5 text-purple-500" />} 
          />
        </div>

        {/* Search & Category Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1 max-w-sm group text-inter">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-black dark:group-focus-within:text-white transition-colors" />
            <Input 
              placeholder="Search cashew products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-12 border border-black/10 dark:border-white/10 bg-transparent rounded-2xl text-sm focus:ring-1 focus:ring-black/10 dark:focus:ring-white/10"
            />
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-12 px-5 rounded-2xl bg-transparent border border-black/10 dark:border-white/10 shadow-none font-semibold text-xs gap-2">
                  <Filter className="w-4 h-4" />
                  Category: <span className="capitalize text-amber-700 dark:text-amber-500">{categoryFilter}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl border-black/5">
                <DropdownMenuItem onClick={() => setCategoryFilter("all")} className="font-semibold text-xs py-2 cursor-pointer">All Categories</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("rcn")} className="font-semibold text-xs py-2 cursor-pointer">Raw Cashew Nut (RCN)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("kernels")} className="font-semibold text-xs py-2 cursor-pointer">Cashew Kernels</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("roasted")} className="font-semibold text-xs py-2 cursor-pointer">Roasted Cashew</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCategoryFilter("organic")} className="font-semibold text-xs py-2 cursor-pointer">Organic Certified</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Cashew Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-[420px] bg-white/50 dark:bg-white/5 rounded-[24px] border border-black/5 animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 bg-white/50 dark:bg-white/5 rounded-[24px] border border-dashed border-black/10 text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-white dark:bg-black shadow-xl flex items-center justify-center mb-8">
              <Layers className="w-10 h-10 text-amber-600/30" />
            </div>
            <h3 className="text-2xl font-bold">No Cashew Batches Found</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              There are no cashew products registered under this search or filter. Register a new batch to start.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <CashewProductCard 
                key={product.id} 
                product={product} 
                index={idx}
                onDelete={() => handleDelete(product.id)} 
              />
            ))}
          </div>
        )}
      </div>
      </TooltipProvider>
    </AppLayout>
  );
}

function CashewProductCard({ product, index, onDelete }: { product: any, index: number, onDelete: () => void }) {
  const router = useRouter();
  
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'rcn': return 'RCN (Raw)';
      case 'kernels': return 'Kernels';
      case 'roasted': return 'Roasted';
      case 'organic': return 'Organic';
      default: return cat;
    }
  };

  const getStockStatusLabel = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return status;
    }
  };

  const getStockUnitLabel = (unit: string) => {
    if (!unit) return 'MT';
    const lower = unit.toLowerCase();
    if (lower.includes('kilo') || lower === 'kg') return 'KG';
    if (lower.includes('ton') || lower === 'mt') return 'MT';
    return unit;
  };

  return (
    <div className="group bg-white dark:bg-[#1a1a1a] rounded-[24px] p-3 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-black/5 transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col h-full font-inter">
      {/* Product Image & Badges */}
      <div className="relative aspect-[1.5/1] rounded-[18px] overflow-hidden mb-4 group/image shadow-md">
        {product.featureImage ? (
          <Image 
            src={product.featureImage} 
            alt={product.name} 
            fill 
            className="object-cover transition-all duration-1000 group-hover/image:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-amber-600/5 dark:bg-amber-600/[0.02] flex items-center justify-center">
            <Layers className="w-10 h-10 text-amber-600/20" />
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-10 scale-90 origin-top-left flex flex-col gap-1.5">
          <div className="bg-amber-600/20 backdrop-blur-xl px-3 py-1.5 rounded-full flex items-center border border-amber-600/30 shadow-xl">
            <span className="text-[9px] font-bold text-white uppercase tracking-wider">
              {product.stockUnit?.toLowerCase().includes(product.packagingType?.toLowerCase() || 'bag') 
                ? Number(product.availableStock ?? product.stockQuantity).toLocaleString()
                : Math.floor(Number(product.availableStock ?? product.stockQuantity) / (parseFloat(product.packagingSize) || 1)).toLocaleString()} {product.packagingType?.replace('_', ' ')}s in stock
            </span>
          </div>
          {product.isExportReady && (
            <div className="bg-emerald-500/20 backdrop-blur-xl px-3 py-1.5 rounded-full flex items-center border border-emerald-500/30 shadow-xl">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Export Ready</span>
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10 scale-90 origin-top-right">
          <div className="bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-full flex items-center border border-white/10 shadow-xl">
            <span className="text-[9px] font-bold text-white capitalize">{getCategoryLabel(product.category)}</span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="bg-black/40 backdrop-blur-xl w-8 h-8 rounded-full flex items-center justify-center border border-white/10 shadow-xl hover:bg-black/60 transition-all">
                <MoreVertical className="w-3.5 h-3.5 text-white" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl p-1 shadow-2xl border-black/5">
              <DropdownMenuItem onClick={() => router.push(`/inventory/cashew/edit/${product.id}`)} className="gap-2 rounded-lg py-2 cursor-pointer text-[11px] font-semibold">
                <Pencil className="w-3.5 h-3.5 text-amber-600" /> Edit Batch
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete}
                className="gap-2 rounded-lg py-2 cursor-pointer text-[11px] font-semibold text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Batch
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom Title Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between z-10">
          <div className="flex-1 pr-3">
            <h3 className="text-white text-[14px] font-bold tracking-tight leading-tight mb-0.5 drop-shadow-md">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-white/90">
              <MapPin className="w-2.5 h-2.5 text-amber-500" />
              <span className="text-[9px] font-medium tracking-tight">
                {product.warehouse === 'accra_warehouse' ? 'Accra Port Site' : product.warehouse === 'kumasi_hub' ? 'Kumasi Sourcing Facility' : product.warehouse === 'tema_cold' ? 'Tema Cold Vault' : product.warehouse || '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Details Specifications */}
      <div className="px-1 pb-1 flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-4">
          {/* Rate & Minimum Order */}
          <div className="space-y-0.5">
            <h2 className="text-[17px] font-bold text-[#1a1a1a] dark:text-white leading-tight">
              GH₵ {(Number(product.pricePerUnit) * (product.priceUnitType === 'per_unit' ? 1 : (parseFloat(product.packagingSize) || 1))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              Price / {product.packagingType ? product.packagingType.replace('_', ' ').charAt(0).toUpperCase() + product.packagingType.replace('_', ' ').slice(1) : 'Unit'}
            </p>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-[17px] font-bold text-[#1a1a1a] dark:text-white leading-tight">
              {product.moqValue} <span className="text-xs font-semibold text-gray-400 capitalize">{product.moqUnit}</span>
            </h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Minimum Order</p>
          </div>

          {/* Stock volume & Packaging */}
          <div className="space-y-0.5">
            <h2 className="text-[17px] font-bold text-[#1a1a1a] dark:text-white leading-tight">
              {Number(product.availableStock ?? product.stockQuantity).toLocaleString()} <span className="text-sm">{getStockUnitLabel(product.stockUnit)}</span>
            </h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Stock Available</p>
          </div>

          <div className="space-y-0.5">
            <h2 className="text-[14px] font-bold text-[#1a1a1a] dark:text-white leading-tight capitalize truncate">
              {product.stockUnit?.toLowerCase().includes(product.packagingType?.toLowerCase() || 'bag') 
                ? Number(product.availableStock ?? product.stockQuantity).toLocaleString()
                : Math.floor(Number(product.availableStock ?? product.stockQuantity) / (parseFloat(product.packagingSize) || 1)).toLocaleString()} {product.packagingType?.includes('bag') ? 'Bags' : product.packagingType?.includes('sack') ? 'Sacks' : product.packagingType?.includes('tin') ? 'Tins' : product.packagingType ? product.packagingType.replace('_', ' ') + 's' : 'Units'}
            </h2>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              Total {product.packagingType?.includes('bag') ? 'Bags' : product.packagingType?.includes('sack') ? 'Sacks' : product.packagingType?.includes('tin') ? 'Tins' : product.packagingType ? product.packagingType.replace('_', ' ') + 's' : 'Units'}
            </p>
          </div>
        </div>

        {/* Certificates & Stock Indicators */}
        <div className="border-t border-black/5 dark:border-white/5 pt-3 mt-auto flex items-center justify-between">
          <div className="flex gap-1">
            {product.certificates && product.certificates.length > 0 ? (
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{product.certificates.length} Certs</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>No PDF Logs</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full",
              product.stockStatus === 'in_stock' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
              product.stockStatus === 'low_stock' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-red-500"
            )} />
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {getStockStatusLabel(product.stockStatus)}
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
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-600/5 rounded-full blur-2xl group-hover:bg-amber-600/10 transition-colors" />
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
