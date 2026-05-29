"use client";
import { useState, useRef } from "react";
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
import { Droplets, Package, Activity, ImagePlus, Save, Eye, Settings2, ShieldCheck, Layout, Plus, X, FileText, Truck, Percent, Calendar, Layers } from "lucide-react";
import { CediSign as DollarSign } from "@/components/CediSign";;
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { createProduct } from "@/lib/actions/product-actions";
import { useRouter } from "next/navigation";

export default function AddCashewPage() {
  const router = useRouter();
  const featureInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [newCountry, setNewCountry] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "rcn",
    description: "",
    packagingType: "jute_bag",
    packagingSize: "",
    moqValue: "",
    moqUnit: "tons",
    stockQuantity: "",
    stockUnit: "tons",
    stockStatus: "in_stock",
    pricePerUnit: "",
    priceUnitType: "per_ton",
    isExportReady: true,
    exportCountries: ["Vietnam", "India", "China", "USA", "Netherlands"] as string[],
    shippingMethods: ["sea"] as string[],
    isOrganic: false,
    certificates: [] as string[],
    featureImage: "",
    videoShowcase: "",
    galleryImages: [] as string[],
    processingTime: "1-2 weeks",
    warehouse: "tema_cold",
    status: "published",
    
    // Cashew Specifics
    cashewGrade: "W320",
    moistureContent: "8.5",
    kernelCount: "190",
    defectRate: "3.5",
    seasonality: "Seasonal (March - June)"
  });

  const handleSubmit = async () => {
    if (!formData.name || !formData.packagingSize || !formData.moqValue || !formData.stockQuantity || !formData.pricePerUnit) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createProduct({
        ...formData,
        moqValue: Number(formData.moqValue) || 0,
        stockQuantity: Number(formData.stockQuantity) || 0,
        pricePerUnit: Number(formData.pricePerUnit) || 0,
        moistureContent: formData.moistureContent ? Number(formData.moistureContent) : null,
        kernelCount: formData.kernelCount ? Number(formData.kernelCount) : null,
        defectRate: formData.defectRate ? Number(formData.defectRate) : null,
      });

      if (result.success) {
        toast.success("Cashew product registered successfully!");
        router.push("/inventory");
      } else {
        toast.error(result.error || "Failed to publish product.");
      }
    } catch (error) {
      toast.error("An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'feature' | 'video' | 'gallery' | 'cert') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      if (type === 'gallery') {
        const uploadPromises = Array.from(files).map(async (file) => {
          const formDataUpload = new FormData();
          formDataUpload.append("file", file);
          formDataUpload.append("folder", "products");
          
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
      } else if (type === 'cert') {
        const file = files[0];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "certificates");

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        });
        const result = await response.json();

        if (result.success && result.url) {
          setFormData(prev => ({ 
            ...prev, 
            certificates: [...prev.certificates, result.url as string] 
          }));
          toast.success("Certificate uploaded successfully!");
        } else {
          toast.error(result.error || "Upload failed");
        }
      } else {
        const file = files[0];
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "products");

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

  const addCountry = () => {
    const trimmed = newCountry.trim();
    if (trimmed && !formData.exportCountries.includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        exportCountries: [...prev.exportCountries, trimmed]
      }));
      setNewCountry("");
    }
  };

  const removeCountry = (c: string) => {
    setFormData(prev => ({
      ...prev,
      exportCountries: prev.exportCountries.filter(item => item !== c)
    }));
  };

  const toggleShippingMethod = (method: string) => {
    setFormData(prev => {
      const methods = [...prev.shippingMethods];
      if (methods.includes(method)) {
        return { ...prev, shippingMethods: methods.filter(m => m !== method) };
      } else {
        return { ...prev, shippingMethods: [...methods, method] };
      }
    });
  };

  return (
    <AppLayout
      title="Add Cashew Product"
      subtitle="Register a new cashew export batch into the commodity database."
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
            {isSubmitting ? "Publishing..." : <><Save className="w-4 h-4" /> Publish Product</>}
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
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">General Information</CardTitle>
                  <CardDescription>Product title, classification, and detailed description.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Title</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Ghana Organic Raw Cashew Nuts (RCN)" 
                    className="h-11 border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 shadow-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cashew Type</Label>
                  <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                    <SelectTrigger className="h-11 border-border dark:border-white/10 dark:bg-transparent">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rcn">Raw Cashew Nuts (RCN)</SelectItem>
                      <SelectItem value="kernels">Shelled Cashew Kernels</SelectItem>
                      <SelectItem value="roasted">Roasted Cashew</SelectItem>
                      <SelectItem value="organic">Organic Cashew</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe details regarding farm origin, crop year, nut count, KOR (Kernel Outturn Ratio), sorting process..." 
                  className="min-h-[120px] border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 resize-none shadow-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Quality Certificates & Media */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                  <ImagePlus className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Quality & Media Showcase</CardTitle>
                  <CardDescription>Organic accreditation, inspection papers, and visual media assets.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold">Organic Certified Batch</p>
                  <p className="text-[11px] text-muted-foreground">Certified organic cashew indicators will display on public portals.</p>
                </div>
                <Switch checked={formData.isOrganic} onCheckedChange={(v) => setFormData({...formData, isOrganic: v})} />
              </div>

              <Separator className="opacity-50" />

              {/* Certificate Uploads */}
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">FDA / Phytosanitary / Inspection Certificates (PDF)</Label>
                <input 
                  type="file" 
                  ref={certInputRef} 
                  className="hidden" 
                  accept=".pdf" 
                  onChange={(e) => handleFileUpload(e, 'cert')} 
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => certInputRef.current?.click()}
                  className="w-full h-10 border-dashed border-border hover:bg-secondary/50 font-semibold text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Upload PDF Document
                </Button>

                <div className="space-y-1.5 pt-1">
                  {formData.certificates.map((url, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-secondary/40 border border-border/60 text-xs">
                      <div className="flex items-center gap-2 truncate pr-4">
                        <FileText className="w-4 h-4 text-red-500 shrink-0" />
                        <span className="truncate font-medium">{url.split('/').pop()}</span>
                      </div>
                      <X className="w-4 h-4 hover:text-red-500 cursor-pointer shrink-0" onClick={() => {
                        setFormData(prev => ({ ...prev, certificates: prev.certificates.filter((_, i) => i !== idx) }));
                      }} />
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="opacity-50" />

              {/* Media Uploads Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Feature Photo</Label>
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
                          alt="Cashew Feature" 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Photo</p>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-accent mb-2" />
                        <p className="text-[11px] font-bold">Upload Feature Image</p>
                        <p className="text-[9px] text-muted-foreground mt-1 px-4 text-center">Catalog showcase image for this cashew batch.</p>
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
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Processing/Sorting Video (MP4)</Label>
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
                        <Droplets className="w-8 h-8 text-muted-foreground group-hover:text-blue-500 mb-2" />
                        <p className="text-[11px] font-bold">Upload Showcase Video</p>
                        <p className="text-[9px] text-muted-foreground mt-1 px-4 text-center">Short clip of cashew harvest sorting or warehouse sacks.</p>
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
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Detail Gallery</Label>
                <input 
                  type="file" 
                  ref={galleryInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple
                  onChange={(e) => handleFileUpload(e, 'gallery')} 
                />
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-2">
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
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Pricing & Export Config */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Pricing & Export Settings</CardTitle>
                  <CardDescription>Export rates, target countries, and shipment logistics defaults.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit Export Price (GH₵)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">GH₵</span>
                    <Input 
                      type="number"
                      value={formData.pricePerUnit}
                      onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                      placeholder="0.00" 
                      className="pl-12 h-10 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price Tier Unit</Label>
                  <Select value={formData.priceUnitType} onValueChange={(v) => setFormData({...formData, priceUnitType: v})}>
                    <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per_kg">Per Kilogram (kg)</SelectItem>
                      <SelectItem value="per_ton">Per Metric Ton (MT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-2 opacity-50" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Ready for Global Export</p>
                      <p className="text-[11px] text-muted-foreground">Enables international RFQ reservation forms.</p>
                    </div>
                    <Switch checked={formData.isExportReady} onCheckedChange={(v) => setFormData({...formData, isExportReady: v})} />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <p className="text-sm font-semibold">Shipping Modes Handled</p>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.shippingMethods.includes("sea")} 
                          onChange={() => toggleShippingMethod("sea")}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                        />
                        Sea Freight (Tema Port)
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={formData.shippingMethods.includes("air")} 
                          onChange={() => toggleShippingMethod("air")}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4" 
                        />
                        Air Cargo (Accra)
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Countries Cleared For</Label>
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Add country name..." 
                        value={newCountry}
                        onChange={(e) => setNewCountry(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCountry(); } }}
                        className="h-9 text-xs border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                      />
                      <Button 
                        type="button"
                        onClick={addCountry}
                        variant="secondary" 
                        className="h-9 bg-accent/10 text-accent hover:bg-accent/20 border-accent/20 font-bold text-[9px] uppercase tracking-wider px-3 shadow-none"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.exportCountries.map(c => (
                      <Badge key={c} variant="secondary" className="gap-1.5 bg-accent/5 border border-accent/20 text-accent py-1 px-2.5 rounded-full text-[10px] font-bold">
                        {c}
                        <X className="w-3 h-3 cursor-pointer hover:text-red-500" onClick={() => removeCountry(c)} />
                      </Badge>
                    ))}
                    {formData.exportCountries.length === 0 && (
                      <span className="text-[10px] text-muted-foreground italic">No restrictions (global shipping).</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Section 4: Cashew Quality & Grading */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Grading & Quality</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cashew Kernel Grade</Label>
                <Select value={formData.cashewGrade} onValueChange={(v) => setFormData({...formData, cashewGrade: v})}>
                  <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RCN">Raw Cashew Nut (In-Shell)</SelectItem>
                    <SelectItem value="W180">W180 (Premium King Size)</SelectItem>
                    <SelectItem value="W240">W240 (Large)</SelectItem>
                    <SelectItem value="W320">W320 (Standard Export)</SelectItem>
                    <SelectItem value="W450">W450 (Small)</SelectItem>
                    <SelectItem value="splits">Splits (Broken pieces)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Moisture Content (%)</Label>
                  <div className="relative">
                    <Input 
                      type="number"
                      step="0.1"
                      value={formData.moistureContent}
                      onChange={(e) => setFormData({...formData, moistureContent: e.target.value})}
                      placeholder="e.g. 8.0" 
                      className="h-10 pr-8 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none animate-none" 
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Defect Rate (%)</Label>
                  <div className="relative">
                    <Input 
                      type="number"
                      step="0.1"
                      value={formData.defectRate}
                      onChange={(e) => setFormData({...formData, defectRate: e.target.value})}
                      placeholder="e.g. 5.0" 
                      className="h-10 pr-8 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none" 
                    />
                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nut / Kernel Count per Kg</Label>
                <Input 
                  type="number"
                  value={formData.kernelCount}
                  onChange={(e) => setFormData({...formData, kernelCount: e.target.value})}
                  placeholder="e.g. 190" 
                  className="h-10 border-border dark:border-white/10 dark:bg-transparent font-mono shadow-none" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seasonal Availability / Timeline</Label>
                <div className="relative">
                  <Input 
                    value={formData.seasonality}
                    onChange={(e) => setFormData({...formData, seasonality: e.target.value})}
                    placeholder="e.g. March - June Harvest" 
                    className="h-10 pl-9 border-border dark:border-white/10 dark:bg-transparent shadow-none text-xs" 
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Packaging & Stock */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Packaging & Stock</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Export Packaging Type</Label>
                <Select value={formData.packagingType} onValueChange={(v) => setFormData({...formData, packagingType: v})}>
                  <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                    <SelectValue placeholder="Select Packaging" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jute_bag">Jute Bags (Standard Raw Nuts)</SelectItem>
                    <SelectItem value="vacuum_tin">Vacuum Sealed Tins (Kernels)</SelectItem>
                    <SelectItem value="vacuum_pouch">Vacuum Pouches in Carton</SelectItem>
                    <SelectItem value="bulk_sack">Bulk Sacks</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Packaging Size / Weight</Label>
                <Input 
                  value={formData.packagingSize}
                  onChange={(e) => setFormData({...formData, packagingSize: e.target.value})}
                  placeholder="e.g., 80kg bags, 22.68kg cartons" 
                  className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Minimum Order Quantity (MOQ)</Label>
                <div className="flex gap-2">
                  <Input 
                    type="number"
                    value={formData.moqValue}
                    onChange={(e) => setFormData({...formData, moqValue: e.target.value})}
                    placeholder="e.g. 19" 
                    className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none font-mono" 
                  />
                  <Select value={formData.moqUnit} onValueChange={(v) => setFormData({...formData, moqUnit: v})}>
                    <SelectTrigger className="h-10 w-28 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tons">Tons (MT)</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="cartons">Cartons</SelectItem>
                      <SelectItem value="containers">FCL Containers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quantity</Label>
                  <Input 
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                    placeholder="e.g., 100" 
                    className="h-10 border-border dark:border-white/10 dark:bg-transparent shadow-none font-mono" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Unit</Label>
                  <Select value={formData.stockUnit} onValueChange={(v) => setFormData({...formData, stockUnit: v})}>
                    <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kilograms">Kilograms (kg)</SelectItem>
                      <SelectItem value="tons">Metric Tons (MT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Stock Status</Label>
                <Select value={formData.stockStatus} onValueChange={(v) => setFormData({...formData, stockStatus: v})}>
                  <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock Warning</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Section 6: Logistics & Operations */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Truck className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Logistics & Storage</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Estimated Sorting & Pack Time</Label>
                  <Select value={formData.processingTime} onValueChange={(v) => setFormData({...formData, processingTime: v})}>
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                      <SelectItem value="custom">Subject to RFQ Negotiation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Warehouse Facility</Label>
                  <Select value={formData.warehouse} onValueChange={(v) => setFormData({...formData, warehouse: v})}>
                    <SelectTrigger className="h-10 border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tema_cold">Tema Harbour Cold Vault</SelectItem>
                      <SelectItem value="accra_warehouse">Accra Industrial Port Site</SelectItem>
                      <SelectItem value="kumasi_hub">Kumasi Sourcing Facility</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Status Controls */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-500">
                  <Settings2 className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Visibility Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Publishing State</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="h-10 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published (Visible on Shop)</SelectItem>
                    <SelectItem value="draft">Draft (Admin Eyes Only)</SelectItem>
                    <SelectItem value="hidden">Hidden / Suspended</SelectItem>
                  </SelectContent>
                </Select>
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
            <span>Phytosanitary Export Cleared</span>
          </div>
          <div className="flex items-center gap-2">
            <Layout className="w-4 h-4 text-blue-500" />
            <span>Automatic Sync with B2B Portal</span>
          </div>
        </div>
        <p className="text-[11px] font-medium italic">Commodity changes will reflect on the live catalog immediately after publishing.</p>
      </div>

    </AppLayout>
  );
}
