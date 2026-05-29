"use client";
import { useState, useEffect, use } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { MapPin, Monitor, Activity, Clock, Maximize, Zap, ChevronLeft, Pencil, Eye, Navigation2, Calendar, ShieldCheck, Layout, Star, Info } from "lucide-react";
import { CediSign as DollarSign } from "@/components/CediSign";;
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBillboard } from "@/lib/actions/billboard-actions";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function BillboardDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [billboard, setBillboard] = useState<any>(null);

  useEffect(() => {
    const fetchBillboard = async () => {
      const result = await getBillboard(Number(id));
      if (result.success) {
        setBillboard(result.data);
      } else {
        toast.error("Failed to load billboard details");
        router.push("/inventory/billboards");
      }
      setLoading(false);
    };
    fetchBillboard();
  }, [id, router]);

  if (loading) return <div className="p-20 text-center font-bold">Loading billboard details...</div>;
  if (!billboard) return null;

  return (
    <AppLayout
      title={billboard.name}
      subtitle={`BILLBOARD CODE: ${billboard.assetCode} • ${billboard.city}`}
      actions={
        <div className="flex gap-3">
          <Link href={`/inventory/billboards/${id}/edit`}>
            <Button variant="outline" className="gap-2 h-10 px-5 border-border hover:bg-secondary/50 transition-all font-semibold">
              <Pencil className="w-4 h-4" /> Edit Asset
            </Button>
          </Link>
          <Button className="gap-2 h-10 px-6 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-lg shadow-blue-500/20 transition-all">
            <Calendar className="w-4 h-4" /> View Bookings
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        
        {/* Left Column: Visuals & Gallery */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl border border-border">
              <img 
                src={billboard.featureImage || "/placeholder.jpg"} 
                className="w-full h-full object-cover"
                alt="Main Feature"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/40 backdrop-blur-md border-white/20 text-[10px] uppercase tracking-widest px-3 py-1">Hero View</Badge>
              </div>
            </div>
            
            <div className="aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl border border-border bg-black flex items-center justify-center">
              {billboard.videoShowcase ? (
                <video 
                  src={billboard.videoShowcase} 
                  className="w-full h-full object-cover"
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                />
              ) : (
                <div className="text-center space-y-2 opacity-30">
                  <Monitor className="w-12 h-12 mx-auto text-white" />
                  <p className="text-white text-[10px] uppercase font-bold tracking-tighter">No Video Available</p>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge className="bg-blue-500/60 backdrop-blur-md border-white/20 text-[10px] uppercase tracking-widest px-3 py-1">Live Feed</Badge>
              </div>
            </div>
          </div>

          {/* Site Gallery */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Layout className="w-4 h-4 text-blue-500" /> Site & Context Gallery
              </h3>
              <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                {billboard.galleryImages?.length || 0} Photos
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {billboard.galleryImages?.map((img: any, idx: number) => (
                <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-border group cursor-zoom-in">
                  <img 
                    src={img.imagePath} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    alt={`Gallery ${idx}`}
                  />
                </div>
              ))}
              {(!billboard.galleryImages || billboard.galleryImages.length === 0) && (
                <div className="col-span-full py-12 bg-secondary/20 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground/40">
                  <Eye className="w-8 h-8 mb-2" />
                  <p className="text-[10px] font-bold uppercase">No additional photos uploaded</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <Card className="rounded-[32px] border-black/5 dark:border-white/5 shadow-xl shadow-black/[0.02]">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold">Asset Overview</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {billboard.description || "No description provided for this digital asset. This premium digital billboard offers high visibility and modern display technology to ensure your advertising campaign reaches the maximum audience with crystal clear resolution and vibrant colors."}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Display Technology</p>
                  <p className="font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 block" /> {billboard.screenType?.toUpperCase() || "LED"} Digital
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Pixel Pitch</p>
                  <p className="font-bold flex items-center gap-2 text-blue-500">
                    <Star className="w-4 h-4 fill-blue-500" /> {billboard.resolution || "P6"} Resolution
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">Orientation</p>
                  <p className="font-bold capitalize">{billboard.aspectRatio || "Landscape"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pricing & Location */}
        <div className="space-y-8">
          
          {/* Pricing Card */}
          <Card className="rounded-[32px] border-0 bg-[#1a1a1a] text-white shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                <DollarSign className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Investment Rate</span>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-black tracking-tighter">GH₵{Number(billboard.weeklyRate).toLocaleString()}</span>
                <span className="text-white/50 text-sm font-medium">/Week</span>
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-8">+ {billboard.taxRate}% Agency Service Fee</p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold">Available Slots</span>
                  </div>
                  <span className="text-sm font-black">{billboard.maxSlots || 12} Total</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-semibold">Loop Duration</span>
                  </div>
                  <span className="text-sm font-black">{billboard.slotDuration || 10} Sec</span>
                </div>
              </div>

              <Button className="w-full mt-8 h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-xs border-0 shadow-lg shadow-blue-500/20">
                Check Availability
              </Button>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="rounded-[32px] border-black/5 dark:border-white/5 shadow-xl overflow-hidden">
            <div className="h-48 relative group">
              {billboard.latitude && billboard.longitude ? (
                <>
                  <img 
                    src={`https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${billboard.longitude},${billboard.latitude}&z=15&l=map&size=400,300`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Map Location"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-4 bg-red-500 rounded-full border-4 border-white shadow-2xl animate-bounce" />
                  </div>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${billboard.latitude},${billboard.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg hover:bg-white transition-colors"
                  >
                    <Navigation2 className="w-4 h-4 text-blue-500" />
                  </a>
                </>
              ) : (
                <div className="w-full h-full bg-secondary/50 flex flex-col items-center justify-center text-muted-foreground/30">
                  <Navigation2 className="w-10 h-10 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-tighter">No Precise Coordinates</p>
                </div>
              )}
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Physical Location</span>
              </div>
              <h4 className="font-bold text-lg mb-2">{billboard.city}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{billboard.address}</p>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="flex-1 p-3 bg-secondary/50 rounded-xl">
                  <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Traffic Vol.</p>
                  <p className="text-xs font-bold">{billboard.trafficVolume || "High Visibility"}</p>
                </div>
                <div className="flex-1 p-3 bg-secondary/50 rounded-xl">
                  <p className="text-[8px] font-black uppercase text-muted-foreground mb-1">Operating Hours</p>
                  <p className="text-xs font-bold">{billboard.wakeTime || "06:00"} - {billboard.sleepTime || "00:00"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Meta */}
          <div className="px-4 space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground/60">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-medium">Verified Ad Inventory</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground/60">
              <Maximize className="w-4 h-4" />
              <span className="text-[10px] font-medium">Smart Monitoring Enabled</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
