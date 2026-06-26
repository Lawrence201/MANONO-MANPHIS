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
import { Layers, ImagePlus, Save, Eye, Plus, X, Building2, Activity, HardHat, FileText, LayoutList } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createConstructionProject } from "@/lib/actions/construction-actions";

export default function AddConstructionProjectPage() {
  const router = useRouter();
  
  const heroInputRef = useRef<HTMLInputElement>(null);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  
  const [newHighlight, setNewHighlight] = useState("");
  const [newResult, setNewResult] = useState("");

  const initialFormState = {
    title: "",
    slug: "",
    shortDescription: "",
    heroImage: "",
    mainImage: "",
    clientName: "",
    serviceType: "",
    projectDate: "",
    websiteUrl: "",
    accomplishedTitle: "What We've Accomplished Together",
    accomplishedDescription: "",
    accomplishedQuote: "",
    overviewTitle: "Project Overview",
    overviewDescription: "",
    highlightFeatures: [] as string[],
    theResults: [] as string[],
    status: "published",
    galleryImages: [] as string[],
  };

  const [formData, setFormData] = useState(initialFormState);

  const handleSubmit = async () => {
    if (!formData.title || !formData.slug) {
      toast.error("Title and Slug are required fields.");
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      let finalHeroUrl = formData.heroImage;
      let finalMainUrl = formData.mainImage;
      let finalGalleryUrls: string[] = [];

      if (heroFile) {
        const fd = new FormData(); fd.append("file", heroFile); fd.append("folder", "construction_projects");
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) finalHeroUrl = data.url;
        else throw new Error(data.error || "Failed to upload hero image");
      }
      if (mainFile) {
        const fd = new FormData(); fd.append("file", mainFile); fd.append("folder", "construction_projects");
        const res = await fetch('/api/upload', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) finalMainUrl = data.url;
        else throw new Error(data.error || "Failed to upload main image");
      }
      if (galleryFiles.length > 0) {
        const uploadPromises = galleryFiles.map(async (file) => {
          const fd = new FormData(); fd.append("file", file); fd.append("folder", "construction_projects");
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          const data = await res.json(); return data.success ? data.url : null;
        });
        const urls = await Promise.all(uploadPromises);
        finalGalleryUrls = urls.filter((url): url is string => url !== null);
      }

      const result = await createConstructionProject({
        ...formData,
        heroImage: finalHeroUrl,
        mainImage: finalMainUrl,
        galleryImages: finalGalleryUrls
      });

      if (result.success) {
        toast.success("Construction project created successfully!");
        setHeroFile(null);
        setMainFile(null);
        setGalleryFiles([]);
        setFormData(initialFormState);
      } else {
        toast.error(result.error || "Failed to publish project.");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during submission.");
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'main' | 'gallery') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'gallery') {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(f => URL.createObjectURL(f));
      
      setGalleryFiles(prev => [...prev, ...newFiles]);
      setFormData(prev => ({ 
        ...prev, 
        galleryImages: [...prev.galleryImages, ...newPreviews] 
      }));
      toast.success(`${newFiles.length} gallery images queued!`);
    } else {
      const file = files[0];
      const preview = URL.createObjectURL(file);

      if (type === 'hero') {
        setHeroFile(file);
        setFormData(prev => ({ ...prev, heroImage: preview }));
        toast.success("Hero image queued!");
      } else if (type === 'main') {
        setMainFile(file);
        setFormData(prev => ({ ...prev, mainImage: preview }));
        toast.success("Main image queued!");
      }
    }
    
    e.target.value = '';
  };

  const addArrayItem = (field: 'highlightFeatures' | 'theResults', value: string, setter: (val: string) => void) => {
    const trimmed = value.trim();
    if (trimmed && !formData[field].includes(trimmed)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], trimmed]
      }));
      setter("");
    }
  };

  const removeArrayItem = (field: 'highlightFeatures' | 'theResults', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(item => item !== value)
    }));
  };

  const handleSlugGen = () => {
    if (formData.title) {
      const generated = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData(prev => ({ ...prev, slug: generated }));
    }
  };

  return (
    <AppLayout
      title="Add Construction Project"
      subtitle="Create a new portfolio project for the construction portal."
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
            {isSubmitting ? "Publishing..." : <><Save className="w-4 h-4" /> Publish Project</>}
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
                  <HardHat className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">General Details</CardTitle>
                  <CardDescription>Primary project identity and short description.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Title</Label>
                  <Input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    onBlur={handleSlugGen}
                    placeholder="e.g., Oceanview Residences" 
                    className="h-11 border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 shadow-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">URL Slug</Label>
                  <Input 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="e.g., oceanview-residences" 
                    className="h-11 border-border dark:border-white/10 dark:bg-transparent shadow-none font-mono" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Short Description (For Cards)</Label>
                <Textarea 
                  value={formData.shortDescription || ""}
                  onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                  placeholder="A brief overview of the project displayed on the main portfolio grid..." 
                  className="min-h-[80px] border-border dark:border-white/10 dark:bg-transparent focus:ring-accent/20 resize-none shadow-none"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Info Bar Details */}
          <Card className="border-border shadow-card overflow-hidden transition-all">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Project Info Bar</CardTitle>
                  <CardDescription>Key details shown prominently on the project page.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Client Name</Label>
                  <Input 
                    value={formData.clientName || ""}
                    onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                    placeholder="e.g., Brickz Limited" 
                    className="h-11 border-border dark:border-white/10 dark:bg-transparent" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Service Provided</Label>
                  <Input 
                    value={formData.serviceType || ""}
                    onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                    placeholder="e.g., General Contracting" 
                    className="h-11 border-border dark:border-white/10 dark:bg-transparent" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Project Date</Label>
                  <Input 
                    value={formData.projectDate || ""}
                    onChange={(e) => setFormData({...formData, projectDate: e.target.value})}
                    placeholder="e.g., February 24, 2026" 
                    className="h-11 border-border dark:border-white/10 dark:bg-transparent" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Website URL (Optional)</Label>
                  <Input 
                    value={formData.websiteUrl || ""}
                    onChange={(e) => setFormData({...formData, websiteUrl: e.target.value})}
                    placeholder="e.g., https://example.com" 
                    className="h-11 border-border dark:border-white/10 dark:bg-transparent" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Page Details */}
          <Card className="border-border shadow-card overflow-hidden transition-all">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Detailed Page Content</CardTitle>
                  <CardDescription>Configure the full project-details page sections.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              
              {/* Accomplished */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground border-b pb-2">"What We've Accomplished Together" Section</h4>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Section Title</Label>
                    <Input 
                      value={formData.accomplishedTitle || ""}
                      onChange={(e) => setFormData({...formData, accomplishedTitle: e.target.value})}
                      className="h-10 border-border dark:border-white/10 dark:bg-transparent" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Description Paragraph</Label>
                    <Textarea 
                      value={formData.accomplishedDescription || ""}
                      onChange={(e) => setFormData({...formData, accomplishedDescription: e.target.value})}
                      className="min-h-[100px] border-border dark:border-white/10 dark:bg-transparent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Italicized Quote / Subtext</Label>
                    <Textarea 
                      value={formData.accomplishedQuote || ""}
                      onChange={(e) => setFormData({...formData, accomplishedQuote: e.target.value})}
                      className="min-h-[80px] border-border dark:border-white/10 dark:bg-transparent italic text-muted-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-foreground border-b pb-2">"Project Overview" Section</h4>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overview Title</Label>
                    <Input 
                      value={formData.overviewTitle || ""}
                      onChange={(e) => setFormData({...formData, overviewTitle: e.target.value})}
                      className="h-10 border-border dark:border-white/10 dark:bg-transparent" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overview Description</Label>
                    <Textarea 
                      value={formData.overviewDescription || ""}
                      onChange={(e) => setFormData({...formData, overviewDescription: e.target.value})}
                      className="min-h-[100px] border-border dark:border-white/10 dark:bg-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Lists / Arrays */}
              <div className="space-y-6">
                <h4 className="text-sm font-bold text-foreground border-b pb-2">Feature Lists</h4>
                
                {/* Highlight Features */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Highlight Features</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a highlight feature..." 
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addArrayItem('highlightFeatures', newHighlight, setNewHighlight); } }}
                      className="h-10 text-sm border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                    />
                    <Button 
                      type="button"
                      onClick={() => addArrayItem('highlightFeatures', newHighlight, setNewHighlight)}
                      variant="secondary" 
                      className="h-10 px-4"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {formData.highlightFeatures.map((h, i) => (
                      <div key={i} className="flex items-center justify-between bg-secondary/50 p-2.5 rounded-md border border-border/60 text-sm">
                        <span className="truncate pr-4">{h}</span>
                        <X className="w-4 h-4 cursor-pointer hover:text-red-500 shrink-0" onClick={() => removeArrayItem('highlightFeatures', h)} />
                      </div>
                    ))}
                    {formData.highlightFeatures.length === 0 && (
                      <span className="text-[11px] text-muted-foreground italic">No highlights added.</span>
                    )}
                  </div>
                </div>

                {/* The Results */}
                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">The Results</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Add a result point..." 
                      value={newResult}
                      onChange={(e) => setNewResult(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addArrayItem('theResults', newResult, setNewResult); } }}
                      className="h-10 text-sm border-border dark:border-white/10 dark:bg-transparent shadow-none" 
                    />
                    <Button 
                      type="button"
                      onClick={() => addArrayItem('theResults', newResult, setNewResult)}
                      variant="secondary" 
                      className="h-10 px-4"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    {formData.theResults.map((r, i) => (
                      <div key={i} className="flex items-center justify-between bg-secondary/50 p-2.5 rounded-md border border-border/60 text-sm">
                        <span className="truncate pr-4">{r}</span>
                        <X className="w-4 h-4 cursor-pointer hover:text-red-500 shrink-0" onClick={() => removeArrayItem('theResults', r)} />
                      </div>
                    ))}
                    {formData.theResults.length === 0 && (
                      <span className="text-[11px] text-muted-foreground italic">No result points added.</span>
                    )}
                  </div>
                </div>

              </div>

            </CardContent>
          </Card>

        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          
          {/* Section 4: Media Uploads */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-500">
                  <ImagePlus className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Media Assets</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Hero Background (Dark Overlay)</Label>
                <input 
                  type="file" 
                  ref={heroInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, 'hero')} 
                />
                <div 
                  onClick={() => heroInputRef.current?.click()}
                  className="aspect-[21/9] relative bg-secondary/30 dark:bg-[#121212] rounded-xl border-2 border-dashed border-border overflow-hidden cursor-pointer hover:bg-secondary/50 hover:border-accent/50 transition-all group"
                >
                  {formData.heroImage ? (
                    <>
                      <img src={formData.heroImage} className="w-full h-full object-cover" alt="Hero" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Photo</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImagePlus className="w-6 h-6 text-muted-foreground mb-2" />
                      <p className="text-[10px] font-bold uppercase">Upload Hero</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Content Slider Image</Label>
                <input 
                  type="file" 
                  ref={mainInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, 'main')} 
                />
                <div 
                  onClick={() => mainInputRef.current?.click()}
                  className="aspect-[16/9] relative bg-secondary/30 dark:bg-[#121212] rounded-xl border-2 border-dashed border-border overflow-hidden cursor-pointer hover:bg-secondary/50 hover:border-accent/50 transition-all group"
                >
                  {formData.mainImage ? (
                    <>
                      <img src={formData.mainImage} className="w-full h-full object-cover" alt="Main" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white text-[10px] font-bold uppercase tracking-widest">Change Photo</p>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                      <ImagePlus className="w-6 h-6 text-muted-foreground mb-2" />
                      <p className="text-[10px] font-bold uppercase">Upload Main Image</p>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="opacity-50" />

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detail Gallery (2 Images)</Label>
                <input 
                  type="file" 
                  ref={galleryInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  multiple
                  onChange={(e) => handleFileUpload(e, 'gallery')} 
                />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div 
                    onClick={() => galleryInputRef.current?.click()}
                    className="aspect-[4/3] bg-secondary/50 rounded-lg border border-dashed border-border flex items-center justify-center cursor-pointer hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-5 h-5 text-muted-foreground" />
                  </div>
                  {formData.galleryImages?.map((path: string, idx: number) => (
                    <div key={idx} className="aspect-[4/3] relative rounded-lg overflow-hidden border border-border group">
                      <img src={path} className="w-full h-full object-cover" alt="Gallery" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center">
                        <Button 
                          variant="ghost" size="icon" className="h-6 w-6 text-white" 
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(prev => ({
                              ...prev,
                              galleryImages: prev.galleryImages.filter((_, i) => i !== idx)
                            }));
                            setGalleryFiles(prev => prev.filter((_, i) => i !== idx));
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: Status */}
          <Card className="border-border shadow-card overflow-hidden">
            <CardHeader className="bg-secondary/20 dark:bg-white/[0.02] border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <LayoutList className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Visibility Status</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Visibility Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="h-10 border-border dark:border-white/10 dark:bg-transparent">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="published">Published (Live)</SelectItem>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
      
      {/* Uploading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[100] flex flex-col items-center justify-center">
           <Activity className="w-10 h-10 text-white animate-spin mb-4" />
           <p className="text-white font-bold tracking-widest uppercase">Uploading Media...</p>
        </div>
      )}
    </AppLayout>
  );
}
