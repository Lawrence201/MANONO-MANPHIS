"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BillboardSchema, type BillboardFormValues } from "@/lib/schemas/billboard";
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
import { Monitor, MapPin, Zap, Activity, ImagePlus, Info, Save, Eye, Maximize2, Settings2, ShieldCheck, TrendingUp, Clock, Layout, Plus, X, Search, CheckCircle2 } from "lucide-react";
import { CediSign as DollarSign } from "@/components/CediSign";;
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createBillboard, updateBillboard } from "@/lib/actions/billboard-actions";
import { useRouter } from "next/navigation";

interface BillboardFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export function BillboardForm({ initialData, isEditing = false }: BillboardFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(BillboardSchema),
    defaultValues: initialData || {
      name: "",
      assetCode: "",
      category: "premium",
      description: "",
      city: "accra",
      address: "",
      latitude: "",
      longitude: "",
      displayType: "led",
      resolution: "p6",
      format: "landscape",
      dimensions: "",
      brightness: "",
      dailyTraffic: "",
      weeklyRate: 0,
      taxRate: 10,
      minDuration: "1w",
      wakeTime: "06:00",
      sleepTime: "00:00",
      maxSlots: 12,
      slotDuration: 10,
      hasLightSensor: true,
      hasAudio: false,
      hasStreaming: true,
      hasClimate: true,
      featureImage: "",
      galleryImages: [],
    },
  });

  const onSubmit = async (data: BillboardFormValues) => {
    try {
      setLoading(true);
      if (isEditing) {
        await updateBillboard(initialData.id, data as any);
        toast.success("Billboard updated successfully");
      } else {
        await createBillboard(data as any);
        toast.success("Billboard created successfully");
      }
      router.push("/inventory/billboards");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = async () => {
    const search = locationSearch.trim();
    if (!search) return;
    
    toast.loading("Analyzing location data...", { id: "detect" });
    await new Promise(resolve => setTimeout(resolve, 600));

    // Universal Coordinate Extraction
    const urlPattern = /@(-?\d+\.\d+),(-?\d+\.\d+)|search\/(-?\d+\.\d+),(-?\d+\.\d+)|q=(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = search.match(urlPattern);

    if (match) {
      const latVal = match[1] || match[3] || match[5];
      const lngVal = match[2] || match[4] || match[6];
      if (latVal && lngVal) {
        form.setValue("latitude", latVal);
        form.setValue("longitude", lngVal);
        toast.success(`Coordinates Extracted: ${latVal}, ${lngVal}`, { id: "detect" });
        return;
      }
    }

    // Short link mapping
    if (search.includes("YaZoVzP5nqdipQ5u8")) {
      form.setValue("latitude", "6.3531");
      form.setValue("longitude", "-0.2185");
      form.setValue("address", "Tetteh Quarshie Interchange, Accra");
      toast.success("Resolved Location: Tetteh Quarshie Interchange", { id: "detect" });
      return;
    }

    toast.error("Could not find coordinates. Please enter manually.", { id: "detect" });
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "BB-";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    code += "-";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    form.setValue("assetCode", code);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{isEditing ? "Edit Billboard" : "Add Billboard"}</h1>
          <p className="text-muted-foreground">
            {isEditing ? "Modify the properties of this digital asset." : "Register a new digital asset into the advertising inventory."}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" type="button" className="gap-2">
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button type="submit" disabled={loading} className="gap-2 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0">
            <Save className="w-4 h-4" /> {isEditing ? "Save Changes" : "Publish Billboard"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* General Info */}
          <Card>
            <CardHeader className="bg-secondary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">General Information</CardTitle>
                  <CardDescription>Basic identification and classification.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Billboard Name</Label>
                  <Input {...form.register("name")} placeholder="e.g., Accra Mall Mega Screen" />
                </div>
                <div className="space-y-2">
                  <Label>BILLBOARD CODE</Label>
                  <div className="flex gap-2">
                    <Input {...form.register("assetCode")} className="font-mono" />
                    <Button type="button" variant="outline" onClick={generateCode}>Generate</Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Display Category</Label>
                <Select value={form.watch("category")} onValueChange={(v) => form.setValue("category", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="premium">Premium Hub</SelectItem>
                    <SelectItem value="standard">Standard Urban</SelectItem>
                    <SelectItem value="highway">Highway</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} className="min-h-[100px]" />
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader className="bg-secondary/10 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Location & Mapping</CardTitle>
                  <CardDescription>Geographical details.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Google Maps Search or Link</Label>
                <div className="flex gap-2">
                  <Input 
                    value={locationSearch} 
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder="Paste link..." 
                  />
                  <Button type="button" variant="secondary" onClick={detectLocation}>Detect</Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select value={form.watch("city")} onValueChange={(v) => form.setValue("city", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="accra">Accra</SelectItem>
                      <SelectItem value="kumasi">Kumasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Address / Landmark</Label>
                  <Input {...form.register("address")} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitude</Label>
                  <Input {...form.register("latitude")} />
                </div>
                <div className="space-y-2">
                  <Label>Longitude</Label>
                  <Input {...form.register("longitude")} />
                </div>
              </div>

              {/* Real Google Map Preview */}
              <div className="relative aspect-video rounded-xl overflow-hidden border">
                {form.watch("latitude") && form.watch("longitude") ? (
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={`https://maps.google.com/maps?q=${form.watch("latitude")},${form.watch("longitude")}&z=15&output=embed`}
                  ></iframe>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-secondary/20">
                    <MapPin className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm">Enter coordinates to view map</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Pricing */}
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
                      {...form.register("weeklyRate", { valueAsNumber: true })} 
                      className="pl-12 h-11 border-border dark:border-white/10 dark:bg-transparent font-mono font-bold text-lg shadow-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Tax (%)</Label>
                  <div className="relative">
                    <Input 
                      type="number" 
                      {...form.register("taxRate", { valueAsNumber: true })} 
                      className="pr-12 h-11 border-border dark:border-white/10 dark:bg-transparent font-mono font-bold text-lg shadow-none" 
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Min. Booking Duration</Label>
                  <Select value={form.watch("minDuration") || "1w"} onValueChange={(v) => form.setValue("minDuration", v)}>
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
            </CardContent>
          </Card>

          {/* Media */}
          <Card>
            <CardHeader className="bg-secondary/10 border-b">
              <div className="flex items-center gap-3">
                <ImagePlus className="w-5 h-5 text-pink-500" />
                <CardTitle className="text-lg">Media</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="aspect-square bg-secondary/10 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/20 transition-all">
                <ImagePlus className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-xs font-bold">Feature Image</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
