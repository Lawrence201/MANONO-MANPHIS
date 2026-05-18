"use client";
import { useState, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Monitor, 
  MapPin, 
  Zap, 
  DollarSign, 
  Activity, 
  ImagePlus, 
  Info, 
  Save, 
  Eye, 
  Maximize2,
  Settings2,
  ShieldCheck,
  TrendingUp,
  Clock,
  Layout,
  Plus,
  Minus,
  X,
  Search
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { resolveGoogleMapsLink } from "@/lib/actions/location-actions";
import { createBillboard } from "@/lib/actions/billboard-actions";
import { useRouter } from "next/navigation";
import { uploadBillboardMedia } from "@/lib/actions/upload-actions";

export default function AddBillboardPage() {
  const router = useRouter();
  const featureInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [zoom, setZoom] = useState(14);
  const [formData, setFormData] = useState({
    name: "",
    assetCode: "",
    category: "premium",
    description: "",
    city: "accra",
    address: "",
    latitude: "",
    longitude: "",
    screenType: "led",
    resolution: "p6",
    aspectRatio: "landscape",
    dimensions: "",
    brightness: "",
    trafficVolume: "",
    weeklyRate: "",
    taxRate: "",
    minDuration: "1w",
    wakeTime: "06:00",
    sleepTime: "00:00",
    maxSlots: "",
    slotDuration: "",
    hasLightSensor: true,
    hasAudio: false,
    hasStreaming: true,
    hasClimate: true,
    featureImage: "",
    videoShowcase: "",
    galleryImages: [] as string[],
    audienceTags: [] as string[]
  });

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "BB-";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    code += "-";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData(prev => ({ ...prev, assetCode: code }));
  };

  useEffect(() => {
    generateCode();
  }, []);

  const detectLocation = async () => {
    let search = locationSearch.trim();
    if (!search) return;

    // Try to resolve Google Maps short links first
    if (search.includes("goo.gl") || search.includes("maps.app.goo.gl") || search.includes("g.page")) {
      const resolveResult = await resolveGoogleMapsLink(search);
      if (resolveResult.success && resolveResult.url) {
        search = resolveResult.url;
      } else {
        toast.error("Failed to resolve link.", { id: "detect" });
        return;
      }
    }

    // Comprehensive patterns for Google Maps coordinates
    const patterns = [
      /@(-?\d+\.\d+),(-?\d+\.\d+)/,
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
      /[?&](?:q|ll)=(-?\d+\.\d+),[\s+]*(-?\d+\.\d+)/,
      /search\/(-?\d+\.\d+),[\s+]*(-?\d+\.\d+)/,
      /(-?\d+\.\d+)\s*,\s*[\s+]*(-?\d+\.\d+)/
    ];

    let foundLat = "";
    let foundLng = "";

    for (const pattern of patterns) {
      const match = search.match(pattern);
      if (match && match[1] && match[2]) {
        foundLat = match[1];
        foundLng = match[2];
        break;
      }
    }

    if (foundLat && foundLng) {
      setFormData(prev => ({ ...prev, latitude: foundLat, longitude: foundLng }));
      
      if (Number(foundLat) > 5.5 && Number(foundLat) < 5.7 && Number(foundLng) > -0.3 && Number(foundLng) < -0.1) {
        setFormData(prev => ({ ...prev, city: "accra" }));
      }
      return;
    }

    const searchLower = search.toLowerCase();
    if (searchLower.includes("accra")) {
      setFormData(prev => ({ ...prev, latitude: "5.6037", longitude: "-0.1870", city: "accra" }));
    } else {
      toast.error("Could not extract coordinates.", { id: "detect" });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.assetCode || !formData.city || !formData.address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createBillboard({
        ...formData,
        weeklyRate: Number(formData.weeklyRate) || 0,
        taxRate: Number(formData.taxRate) || 0,
        maxSlots: Number(formData.maxSlots) || 12,
        slotDuration: Number(formData.slotDuration) || 10,
      });
      if (result.success) {
        toast.success("Billboard registered successfully!");
        router.push("/inventory/billboards");
      } else {
        toast.error(result.error || "Failed to publish billboard.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'feature' | 'video' | 'gallery') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      if (type === 'gallery') {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formDataUpload = new FormData();
          formDataUpload.append("file", file);
          formDataUpload.append("folder", "billboards");
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formDataUpload,
          });
          const result = await response.json();
          return result.success ? result.url : null;
        });

        const urls = await Promise.all(uploadPromises);
        const validUrls = urls.filter((url): url is string => url !== null);
        
        if (validUrls.length > 0) {
          setFormData(prev => ({ 
            ...prev, 
            galleryImages: [...prev.galleryImages, ...validUrls] 
          }));
          toast.success(`${validUrls.length} gallery images added!`);
        }
      } else {
        const file = files[0];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "billboards");

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        const result = await response.json();

        if (result.success && result.url) {
          if (type === 'feature') {
            setFormData(prev => ({ ...prev, featureImage: result.url as string }));
            toast.success("Hero image uploaded!");
          } else if (type === 'video') {
            setFormData(prev => ({ ...prev, videoShowcase: result.url as string }));
            toast.success("Video uploaded!");
          }
        } else {
          toast.error(result.error || "Upload failed");
        }
      }
    } catch (error) {
      toast.error("An error occurred during upload");
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  return (
    <AppLayout
      title="Add Digital Billboard"
      subtitle="Add a new digital asset into the advertising inventory."
      actions={
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 h-10 px-5 border-border hover:bg-secondary/50 transition-all font-semibold">
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2 h-10 px-6 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-lg shadow-blue-500/20 transition-all"
          >
            {isSubmitting ? "Publishing..." : <><Save className="w-4 h-4" /> Publish Billboard</>}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Form Column */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Section 1: General Info */}
          <Card className="border-border shadow-card overflow-hidden transition-all">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">General Information</CardTitle>
                  <CardDescription>Basic identification and classification for the billboard.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billboard Name</Label>
                  <Input 
                    value={formData.name || ""}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Accra Mall Entry A — Mega Screen" 
                    className="h-11 border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 shadow-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">BILLBOARD CODE</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={formData.assetCode || ""}
                      onChange={(e) => setFormData({...formData, assetCode: e.target.value})}
                      placeholder="e.g., BB-ACC-MAL-001" 
                      className="h-11 border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 font-mono shadow-none" 
                    />
                    <Button 
                      type="button"
                      onClick={generateCode}
                      variant="outline" 
                      className="h-11 border-border dark:border-white/10 dark:bg-transparent hover:bg-secondary/50 font-bold text-[10px] uppercase tracking-wider px-4"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Category</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger className="h-11 border-border dark:border-white/10 dark:bg-transparent">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="premium">Premium Hub (High Traffic)</SelectItem>
                      <SelectItem value="standard">Standard Urban</SelectItem>
                      <SelectItem value="highway">Highway / Long-range</SelectItem>
                      <SelectItem value="transit">Transit / Terminal</SelectItem>
                      <SelectItem value="others">Others (Custom)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billboard Description</Label>
                <Textarea 
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the billboard's unique advantages..." 
                  className="min-h-[120px] border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 resize-none shadow-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Location & Mapping</CardTitle>
                  <CardDescription>Precise geographical details and landmark references.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Google Maps Search or Link</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input 
                      placeholder="Paste link or type location..." 
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="h-10 pl-9 text-xs border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 shadow-none" 
                    />
                  </div>
                  <Button 
                    variant="secondary" 
                    onClick={detectLocation}
                    className="h-10 bg-accent/10 text-accent hover:bg-accent/20 border-accent/20 font-bold text-[9px] uppercase tracking-wider px-4 shadow-none"
                  >
                    Detect
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">City</Label>
                  <Select value={formData.city} onValueChange={(v) => setFormData({...formData, city: v})}>
                    <SelectTrigger className="h-10 text-xs border-border dark:border-white/10 dark:bg-transparent shadow-none">
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accra">Accra</SelectItem>
                      <SelectItem value="kumasi">Kumasi</SelectItem>
                      <SelectItem value="tema">Tema</SelectItem>
                      <SelectItem value="takoradi">Takoradi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Street Address / Landmark</Label>
                  <Input 
                    value={formData.address || ""}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="e.g., Liberation Road" 
                    className="h-10 text-xs border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Latitude</Label>
                  <Input 
                    value={formData.latitude || ""}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    placeholder="5.6037" 
                    className="h-10 text-xs border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Longitude</Label>
                  <Input 
                    value={formData.longitude || ""}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    placeholder="-0.1870" 
                    className="h-10 text-xs border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                  />
                </div>
              </div>
              
              <div className="relative aspect-video bg-secondary/50 dark:bg-[#121212] rounded-xl border-2 border-border/60 overflow-hidden group transition-all">
                {formData.latitude && formData.longitude ? (
                  <>
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.google.com/maps?ll=${formData.latitude},${formData.longitude}&z=${zoom}&t=m&hl=en&output=embed`}
                      className="w-full h-full transition-all pointer-events-none"
                      allowFullScreen
                    ></iframe>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <div className="animate-bounce" style={{ animationDuration: '1.2s' }}>
                        <svg 
                          width="45" 
                          height="45" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          xmlns="http://www.w3.org/2000/svg"
                          className="drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)] -translate-y-5"
                        >
                          <path 
                            d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                            fill="#EA4335" 
                          />
                        </svg>
                        <div className="w-2 h-1 bg-black/20 rounded-full blur-[2px] mx-auto -mt-1 scale-x-150" />
                      </div>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-20">
                      <Button 
                        type="button"
                        variant="secondary" 
                        size="icon" 
                        className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md hover:bg-white dark:hover:bg-black border border-black/5 dark:border-white/10"
                        onClick={(e) => { e.preventDefault(); setZoom(prev => Math.min(prev + 1, 21)); }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button 
                        type="button"
                        variant="secondary" 
                        size="icon" 
                        className="w-8 h-8 rounded-lg bg-white/90 dark:bg-black/90 backdrop-blur-md shadow-md hover:bg-white dark:hover:bg-black border border-black/5 dark:border-white/10"
                        onClick={(e) => { e.preventDefault(); setZoom(prev => Math.max(prev - 1, 0)); }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <MapPin className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-xs font-semibold">Map coordinates not set.</p>
                  </div>
                )}
                
                <div className="absolute bottom-3 right-3 flex gap-2 pointer-events-none">
                   <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[9px] shadow-lg">LAT: {formData.latitude}</Badge>
                   <Badge className="bg-black/60 backdrop-blur-md text-white border-white/10 text-[9px] shadow-lg">LNG: {formData.longitude}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Settings2 className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Technical Specifications</CardTitle>
                  <CardDescription>Hardware details and display capabilities.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Type</Label>
                  <Select value={formData.screenType} onValueChange={(v) => setFormData({...formData, screenType: v})}>
                    <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="led">SMD LED Board</SelectItem>
                      <SelectItem value="dip">DIP LED Board</SelectItem>
                      <SelectItem value="lcd">High-Bright LCD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resolution</Label>
                  <Select value={formData.resolution} onValueChange={(v) => setFormData({...formData, resolution: v})}>
                    <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="p4">P4 (Ultra Clear)</SelectItem>
                      <SelectItem value="p6">P6 (Standard)</SelectItem>
                      <SelectItem value="p8">P8 (Large Format)</SelectItem>
                      <SelectItem value="p10">P10 (Distance)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Format</Label>
                  <Select value={formData.aspectRatio} onValueChange={(v) => setFormData({...formData, aspectRatio: v})}>
                    <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landscape">Landscape</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Brightness</Label>
                  <Input 
                    value={formData.brightness || ""}
                    onChange={(e) => setFormData({...formData, brightness: e.target.value})}
                    placeholder="e.g., 6500 nits" 
                    className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Dimensions (W×H)</Label>
                  <Input 
                    value={formData.dimensions || ""}
                    onChange={(e) => setFormData({...formData, dimensions: e.target.value})}
                    placeholder="e.g., 12m × 4m" 
                    className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                  />
                </div>
              </div>

              <Separator className="my-8 opacity-50" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Automatic Light Sensor</p>
                      <p className="text-[11px] text-muted-foreground">Adjusts brightness based on ambient light.</p>
                    </div>
                    <Switch checked={formData.hasLightSensor} onCheckedChange={(v) => setFormData({...formData, hasLightSensor: v})} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Audio Support</p>
                      <p className="text-[11px] text-muted-foreground">Integrated sound system status.</p>
                    </div>
                    <Switch checked={formData.hasAudio} onCheckedChange={(v) => setFormData({...formData, hasAudio: v})} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Live Streaming Support</p>
                      <p className="text-[11px] text-muted-foreground">Supports real-time RTMP/HLS streams.</p>
                    </div>
                    <Switch checked={formData.hasStreaming} onCheckedChange={(v) => setFormData({...formData, hasStreaming: v})} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Climate Control</p>
                      <p className="text-[11px] text-muted-foreground">Internal cooling/heating system status.</p>
                    </div>
                    <Switch checked={formData.hasClimate} onCheckedChange={(v) => setFormData({...formData, hasClimate: v})} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Operational Controls & Scheduling */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Operational & Scheduling</CardTitle>
                  <CardDescription>Control the automation logic and airtime availability.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    Operating Hours
                    <Badge variant="outline" className="text-[9px] h-4 px-1 border-emerald-500/30 text-emerald-500 uppercase">Automated</Badge>
                  </Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Wake Time</p>
                      <Input 
                        type="time" 
                        value={formData.wakeTime || "06:00"}
                        onChange={(e) => setFormData({...formData, wakeTime: e.target.value})}
                        className="h-10 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none" 
                      />
                    </div>
                    <div className="w-4 h-px bg-border mt-6" />
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Sleep Time</p>
                      <Input 
                        type="time" 
                        value={formData.sleepTime || "00:00"}
                        onChange={(e) => setFormData({...formData, sleepTime: e.target.value})}
                        className="h-10 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none" 
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground italic">Screen will automatically power down during sleep hours.</p>
                </div>

                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    Loop Capacity
                    <Badge variant="outline" className="text-[9px] h-4 px-1 border-blue-500/30 text-blue-500 uppercase">Logic</Badge>
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Max Slots</p>
                      <Input 
                        type="number" 
                        value={formData.maxSlots || ""}
                        onChange={(e) => setFormData({...formData, maxSlots: e.target.value})}
                        className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Slot Duration (sec)</p>
                      <Input 
                        type="number" 
                        value={formData.slotDuration || ""}
                        onChange={(e) => setFormData({...formData, slotDuration: e.target.value})}
                        className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                      />
                    </div>
                  </div>
                  <div className="bg-blue-500/5 rounded-lg p-3 border border-blue-500/10">
                    <p className="text-[11px] text-blue-500 font-medium">
                      Calculation: 120s total loop cycle time. Ads repeat every 2 minutes.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Section 5: Pricing & Revenue */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                  <DollarSign className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Rental Pricing</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Base Weekly Rate (GH₵)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-muted-foreground">GH₵</span>
                    <Input 
                      type="number"
                      value={formData.weeklyRate || ""}
                      onChange={(e) => setFormData({...formData, weeklyRate: e.target.value})}
                      placeholder="0.00" 
                      className="pl-12 h-11 border-border dark:border-white/10 dark:bg-transparent font-mono font-bold text-lg shadow-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Tax (%)</Label>
                  <div className="relative">
                    <Input 
                      type="number"
                      value={formData.taxRate || ""}
                      onChange={(e) => setFormData({...formData, taxRate: e.target.value})}
                      placeholder="0.00" 
                      className="pr-12 h-11 border-border dark:border-white/10 dark:bg-transparent font-mono font-bold text-lg shadow-none" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Min. Booking Duration</Label>
                  <Select value={formData.minDuration} onValueChange={(v) => setFormData({...formData, minDuration: v})}>
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">1 Day</SelectItem>
                      <SelectItem value="1w">1 Week</SelectItem>
                      <SelectItem value="1m">1 Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-secondary/30 dark:bg-white/[0.03] rounded-xl p-4 border border-border/50">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">Revenue Potential</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Est. Monthly Revenue:</span>
                    <span className="font-bold text-foreground">$0.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Max Utilization:</span>
                    <span className="font-bold text-foreground">100% (12 slots)</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full h-10 border-dashed border-border hover:bg-secondary/50 transition-all font-semibold text-xs">
                Configure Bulk Discounts
              </Button>
            </CardContent>
          </Card>

          {/* Section 5: Visibility & Audience */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Audience Insights</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Daily Traffic Volume</Label>
                <Input 
                  value={formData.trafficVolume || ""}
                  onChange={(e) => setFormData({...formData, trafficVolume: e.target.value})}
                  placeholder="e.g., 50,000+ vehicles/day" 
                  className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Audience Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["Business", "Youth", "Premium", "Tourists"].map(tag => (
                    <Badge 
                      key={tag} 
                      variant={formData.audienceTags.includes(tag) ? "default" : "secondary"}
                      className={`cursor-pointer transition-all ${formData.audienceTags.includes(tag) ? "bg-accent text-white" : "bg-accent/10 text-accent"}`}
                      onClick={() => {
                        const tags = [...formData.audienceTags];
                        if (tags.includes(tag)) {
                          setFormData({...formData, audienceTags: tags.filter(t => t !== tag)});
                        } else {
                          setFormData({...formData, audienceTags: [...tags, tag]});
                        }
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                  <button className="h-6 px-2 rounded-full border border-dashed border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground hover:bg-secondary transition-colors">
                    + ADD
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media & Showcase Card */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                  <ImagePlus className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Media & Showcase</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Primary Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Main Feature Photo</Label>
                  <input 
                    type="file" 
                    ref={featureInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={(e) => handleFileUpload(e, 'feature')} 
                  />
                  <div 
                    onClick={() => featureInputRef.current?.click()}
                    className="aspect-[4/3] relative bg-secondary/30 dark:bg-[#121212] rounded-xl border-2 border-dashed border-border overflow-hidden cursor-pointer hover:bg-secondary/50 hover:border-accent/50 transition-all group shadow-sm"
                  >
                    {formData.featureImage ? (
                      <>
                        <img 
                          src={formData.featureImage} 
                          alt="Billboard Feature" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Photo</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-accent mb-2" />
                        <p className="text-[11px] font-bold">Upload Hero Image</p>
                        <p className="text-[9px] text-muted-foreground mt-1 px-4 text-center">The main photo clients see first.</p>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
                        <Activity className="w-6 h-6 text-accent animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Video Showcase (MP4)</Label>
                  <input 
                    type="file" 
                    ref={videoInputRef} 
                    className="hidden" 
                    accept="video/mp4,video/webm" 
                    onChange={(e) => handleFileUpload(e, 'video')} 
                  />
                  <div 
                    onClick={() => videoInputRef.current?.click()}
                    className="aspect-[4/3] relative bg-secondary/30 dark:bg-[#121212] rounded-xl border-2 border-dashed border-border overflow-hidden cursor-pointer hover:bg-secondary/50 hover:border-accent/50 transition-all group"
                  >
                    {formData.videoShowcase ? (
                      <>
                        <video 
                          src={formData.videoShowcase} 
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Video</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                        <Monitor className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 mb-2" />
                        <p className="text-[11px] font-bold">Upload Site Video</p>
                        <p className="text-[9px] text-muted-foreground mt-1 px-4 text-center">Show the screen playing an ad.</p>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center z-50">
                        <Activity className="w-6 h-6 text-blue-500 animate-spin" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator className="opacity-50" />

              {/* Site Gallery */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Site & Location Gallery</Label>
                <input 
                  type="file" 
                  ref={galleryInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple
                  onChange={(e) => handleFileUpload(e, 'gallery')} 
                />
                <div className="grid grid-cols-4 gap-3 mt-2">
                  <div 
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-square bg-secondary/50 rounded-lg border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-secondary transition-colors relative"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground" />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-accent animate-spin" />
                      </div>
                    )}
                  </div>
                  {formData.galleryImages?.map((path: string, idx: number) => (
                    <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-border group">
                      <img src={path} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={`Gallery ${idx}`} />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-white" 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newGallery = [...formData.galleryImages];
                            newGallery.splice(idx, 1);
                            setFormData({ ...formData, galleryImages: newGallery });
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground italic mt-2">Add at least 3 photos showing the surrounding traffic and landmarks.</p>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Footer Meta */}
      <div className="mt-12 py-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span>GDPR Compliant Privacy</span>
          </div>
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-500" />
            <span>Automatic UI Syncing</span>
          </div>
        </div>
        <p className="text-[11px] font-medium italic">Asset changes will reflect on the live website immediately after publishing.</p>
      </div>

    </AppLayout>
  );
}
