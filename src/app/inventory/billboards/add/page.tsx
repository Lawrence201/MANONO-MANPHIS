"use client";
import { useState, useEffect } from "react";
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
  X,
  Search
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function AddBillboardPage() {
  const [category, setCategory] = useState("premium");
  const [assetCode, setAssetCode] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [lat, setLat] = useState("5.6037");
  const [lng, setLng] = useState("-0.1870");

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "BB-";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    code += "-";
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setAssetCode(code);
  };

  useEffect(() => {
    generateCode();
  }, []);

  const detectLocation = () => {
    // Simulated detection logic
    if (locationSearch.toLowerCase().includes("accra")) {
      setLat("5.6037");
      setLng("-0.1870");
    } else if (locationSearch.toLowerCase().includes("kumasi")) {
      setLat("6.6666");
      setLng("-1.6163");
    } else {
      // Random generation for demo
      setLat((Math.random() * (6.5 - 5.1) + 5.1).toFixed(4));
      setLng((Math.random() * (-0.1 - -0.3) + -0.3).toFixed(4));
    }
  };

  return (
    <AppLayout
      title="Add Digital Billboard"
      subtitle="Register a new digital asset into the advertising inventory."
      actions={
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 h-10 px-5 border-border hover:bg-secondary/50 transition-all font-semibold">
            <Eye className="w-4 h-4" /> Preview
          </Button>
          <Button className="gap-2 h-10 px-6 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-lg shadow-blue-500/20 transition-all">
            <Save className="w-4 h-4" /> Publish Billboard
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
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Billboard Name</Label>
                  <Input id="name" placeholder="e.g., Accra Mall Entry A — Mega Screen" className="h-11 border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 shadow-none" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Asset Code (Internal)</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="code" 
                      value={assetCode}
                      onChange={(e) => setAssetCode(e.target.value)}
                      placeholder="e.g., BB-ACC-MAL-001" 
                      className="h-11 border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 font-mono shadow-none" 
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={generateCode}
                      className="h-11 border-border dark:border-white/10 dark:bg-transparent hover:bg-secondary/50 font-bold text-[10px] uppercase tracking-wider px-4"
                    >
                      Generate
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Category</Label>
                  <Select value={category} onValueChange={setCategory}>
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

                {category === "others" && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="custom-category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Specify Category</Label>
                    <Input id="custom-category" placeholder="Type your custom category name..." className="h-11 border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 shadow-none" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Marketing Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the billboard's unique advantages, audience demographic, and impact potential..." 
                  className="min-h-[120px] border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 resize-none shadow-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Location & Positioning */}
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
                  <Select defaultValue="accra">
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
                  <Input placeholder="e.g., Liberation Road" className="h-10 text-xs border-border dark:border-white/10 dark:bg-transparent shadow-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Latitude</Label>
                  <Input 
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    placeholder="5.6037" 
                    className="h-10 text-xs border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Longitude</Label>
                  <Input 
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    placeholder="-0.1870" 
                    className="h-10 text-xs border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                  />
                </div>
              </div>
              
              {/* Map Placeholder UI */}
              <div className="relative aspect-video bg-secondary/50 dark:bg-[#121212] rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center text-center p-8 group transition-all hover:bg-secondary/70">
                <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center mb-3 shadow-md border border-border group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <p className="font-semibold text-sm">Interactive Map Integration</p>
                <p className="text-xs text-muted-foreground mt-1">Select location on map to auto-fill coordinates</p>
                <Button variant="outline" size="sm" className="mt-4 h-8 text-[11px] font-bold uppercase tracking-wider">Open Map Selector</Button>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Technical Specifications */}
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
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Display Type</Label>
                  <Select defaultValue="led">
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
                  <Select defaultValue="p6">
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
                  <Select defaultValue="landscape">
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
                  <Input placeholder="e.g., 6500 nits" className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" />
                </div>
              </div>

              <Separator className="my-8" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Automatic Light Sensor</p>
                      <p className="text-[11px] text-muted-foreground">Adjusts brightness based on ambient light.</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Audio Support</p>
                      <p className="text-[11px] text-muted-foreground">Does this screen have external speakers?</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Live Streaming Support</p>
                      <p className="text-[11px] text-muted-foreground">Supports real-time RTMP/HLS streams.</p>
                    </div>
                    <Switch checked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Climate Control</p>
                      <p className="text-[11px] text-muted-foreground">Internal cooling/heating system status.</p>
                    </div>
                    <Switch checked={true} />
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
                      <Input type="time" defaultValue="06:00" className="h-10 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none" />
                    </div>
                    <div className="w-4 h-px bg-border mt-6" />
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Sleep Time</p>
                      <Input type="time" defaultValue="00:00" className="h-10 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none" />
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
                      <Input type="number" defaultValue="12" className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" />
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Slot Duration (sec)</p>
                      <Input type="number" defaultValue="10" className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" />
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
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Base Daily Rate (USD)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="0.00" className="pl-9 h-11 border-border dark:border-white/10 dark:bg-transparent font-mono font-bold text-lg shadow-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Min. Booking Duration</Label>
                  <Select defaultValue="1w">
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
                <Input placeholder="e.g., 50,000+ vehicles/day" className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" />
              </div>
              <div className="space-y-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Audience Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["Business", "Youth", "Premium", "Tourists"].map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-accent/10 text-accent border-accent/20 hover:bg-accent/20 cursor-pointer transition-all">
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
                  <div className="aspect-[4/3] bg-secondary/30 dark:bg-[#121212] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-secondary/50 hover:border-accent/50 transition-all group">
                    <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-accent mb-2" />
                    <p className="text-[11px] font-bold">Upload Hero Image</p>
                    <p className="text-[9px] text-muted-foreground mt-1 px-4">The main photo clients see first.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Video Showcase (MP4)</Label>
                  <div className="aspect-[4/3] bg-secondary/30 dark:bg-[#121212] rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center text-center p-4 cursor-pointer hover:bg-secondary/50 hover:border-accent/50 transition-all group">
                    <Monitor className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 mb-2" />
                    <p className="text-[11px] font-bold">Upload Site Video</p>
                    <p className="text-[9px] text-muted-foreground mt-1 px-4">Show the screen playing an ad.</p>
                  </div>
                </div>
              </div>

              <Separator className="opacity-50" />

              {/* Site Gallery */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Site & Location Gallery</Label>
                <div className="grid grid-cols-4 gap-3 mt-2">
                  <div className="aspect-square bg-secondary/50 rounded-lg border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-secondary transition-colors">
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square bg-secondary/30 rounded-lg border border-border/40 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-white"><X className="w-4 h-4" /></Button>
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
