"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveConstructionInvoice, updateConstructionRequestStatus } from "@/lib/actions/construction-request-actions";
import {
  Search, Filter, Eye, CheckCircle2, XCircle, Clock, 
  MapPin, Phone, Mail, FileText, Download, Building2, HardHat, Home, Trash2, Calendar, ClipboardList, Plus, Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import type { ConstructionRequest } from "@prisma/client";
import { InvoiceDocument } from "@/components/invoice/InvoiceDocument";

// ── Helpers ─────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending:    { label: "New Request",  color: "text-amber-500",  bg: "bg-amber-500/10",  icon: Clock },
  contacted:  { label: "Contacted",    color: "text-blue-500",   bg: "bg-blue-500/10",   icon: Phone },
  site_visit: { label: "Site Visit",   color: "text-indigo-500", bg: "bg-indigo-500/10", icon: MapPin },
  quoted:     { label: "Quote Sent",   color: "text-emerald-500",bg: "bg-emerald-500/10", icon: FileText },
  accepted:   { label: "Accepted",     color: "text-emerald-600",bg: "bg-emerald-600/10", icon: CheckCircle2 },
  approved:   { label: "Approved",     color: "text-emerald-600",bg: "bg-emerald-600/10", icon: CheckCircle2 },
  rejected:   { label: "Rejected",     color: "text-red-500",    bg: "bg-red-500/10",    icon: XCircle },
};

function formatDate(iso: string | Date) {
  const d = typeof iso === 'string' ? new Date(iso) : iso;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap", cfg.bg, cfg.color)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, accent }: { label: string; value: string | number; sub?: string; icon: any, accent?: boolean }) {
  return (
    <div className={cn("bg-card rounded-xl border p-5 flex items-start gap-4 transition-all duration-300 shadow-sm", accent ? "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]" : "border-border")}>
      <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", accent ? "bg-amber-500/10" : "bg-muted/50")}>
        <Icon className={cn("w-5 h-5", accent ? "text-amber-500" : "text-muted-foreground")} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ── Client Component ──────────────────────────────────────────────────────
export function RequestsClient({ requests }: { requests: any[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReq, setSelectedReq] = useState<any | null>(null);
  
  const [isBlankInvoiceOpen, setIsBlankInvoiceOpen] = useState(false);
  const [isFillInvoiceOpen, setIsFillInvoiceOpen] = useState(false);
  const [vatPercentage, setVatPercentage] = useState("15");
  
  const [fillName, setFillName] = useState("");
  const [fillService, setFillService] = useState("");
  const [fillAddress, setFillAddress] = useState("");
  const [fillDate, setFillDate] = useState("");
  const [fillVat, setFillVat] = useState("15");
  const [fillItems, setFillItems] = useState([{ qty: 1, desc: "", price: 0 }]);
  
  // Hidden invoice state for PDF generation
  const [activeInvoiceNo, setActiveInvoiceNo] = useState("0031");
  const [activeVat, setActiveVat] = useState("15");

  const filtered = requests.filter(r => {
    const matchSearch = !searchTerm ||
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serviceRequired.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total = requests.length;
  const pending = requests.filter(r => r.status === "pending").length;
  const siteVisits = requests.filter(r => r.status === "site_visit").length;
  const quoted = requests.filter(r => r.status === "quoted").length;

  return (
    <div className="flex flex-col gap-6 p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">Service Requests</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage incoming construction inquiries and quotes.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button style={{ backgroundColor: '#6aabfc', color: '#fff' }} className="hover:opacity-90 transition-opacity">
              Generate invoice
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsBlankInvoiceOpen(true)}>
              Blank Invoice
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsFillInvoiceOpen(true)}>
              Fill from Request
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Requests" value={total} sub="All time" icon={ClipboardList} />
        <StatCard label="New Pending" value={pending} sub="Awaiting review" icon={Clock} />
        <StatCard label="Site Visits" value={siteVisits} sub="Scheduled" icon={MapPin} />
        <StatCard label="Quotes Sent" value={quoted} sub="Awaiting client response" icon={FileText} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, ID, service..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0 ml-2" />
          {["all", "pending", "contacted", "site_visit", "quoted"].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap",
                statusFilter === s
                  ? "bg-accent text-accent-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {s === "all" ? "All" : STATUS_CONFIG[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Inbox Layout */}
      <div className="flex gap-4 h-[650px] items-stretch">
        
        {/* Master Table */}
        <div className={cn("bg-card rounded-xl border border-border shadow-sm flex-1 transition-all flex flex-col", selectedReq ? "lg:max-w-[calc(100%-400px)] hidden lg:flex" : "w-full")}>
          <div className="overflow-x-auto flex-1 scrollbar-very-thin">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20 sticky top-0 z-10">
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Client & Ref</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Service & Type</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Location</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Budget</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Submitted</th>
                  <th className="text-left px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                  <th className="text-right px-5 py-3.5 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-20 text-center">
                      <ClipboardList className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground font-medium">No requests found</p>
                    </td>
                  </tr>
                ) : filtered.map(req => (
                  <tr
                    key={req.id}
                    className={cn(
                      "transition-colors hover:bg-muted/30",
                      selectedReq?.id === req.id ? "bg-accent/5 border-l-2 border-l-accent" : "border-l-2 border-l-transparent"
                    )}
                  >
                    <td className="px-5 py-4">
                      <div className="font-bold text-foreground text-sm">{req.fullName}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{req.referenceId}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-foreground">{req.serviceRequired}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 capitalize">{req.projectType}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-foreground text-sm truncate max-w-[150px]">{req.propertyAddress}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{req.cityRegion}</div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-foreground">
                      {req.estimatedBudget}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">
                      {formatDate(req.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => setSelectedReq(selectedReq?.id === req.id ? null : req)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Slide-out Panel */}
        {selectedReq && (
          <div className="w-full lg:w-[400px] shrink-0 bg-card rounded-xl border border-border shadow-2xl flex flex-col animate-in slide-in-from-right-8 duration-300">
            
            {/* Panel Header */}
            <div className="p-5 border-b border-border flex items-start justify-between bg-muted/10">
              <div>
                <h3 className="font-display font-bold text-foreground text-lg">{selectedReq.fullName}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono bg-background border px-1.5 py-0.5 rounded text-muted-foreground">{selectedReq.referenceId}</span>
                  <span className="text-xs text-muted-foreground">• {formatDate(selectedReq.createdAt)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-very-thin">
              
              {/* Status & Actions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current Status</p>
                  <StatusBadge status={selectedReq.status} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedReq.status === "pending" && !selectedReq.invoiceData && (
                    <Button 
                      size="sm" 
                      className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        setFillName(selectedReq.fullName);
                        setFillService(selectedReq.serviceRequired);
                        setFillAddress(selectedReq.propertyAddress);
                        setFillDate(new Date().toISOString().split('T')[0]);
                        setFillItems([{ qty: 1, desc: "", price: 0 }]); // Reset items
                        setIsFillInvoiceOpen(true);
                      }}
                    >
                      <FileText className="w-3.5 h-3.5" /> Generate Invoice
                    </Button>
                  )}
                  {selectedReq.status === "pending" && (
                    <Button 
                      size="sm" 
                      className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={async () => {
                        await updateConstructionRequestStatus(selectedReq.id, "approved");
                        setSelectedReq({ ...selectedReq, status: "approved" });
                        router.refresh();
                      }}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                    </Button>
                  )}
                  {selectedReq.invoiceData && (
                    <Button 
                      size="sm" 
                      className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        const itemsJson = encodeURIComponent(JSON.stringify(selectedReq?.invoiceData?.items || []));
                        const params = new URLSearchParams({
                          name: selectedReq.fullName,
                          service: selectedReq.serviceRequired,
                          address: selectedReq.propertyAddress,
                          date: selectedReq?.invoiceData?.date || new Date().toISOString().split('T')[0],
                          vat: selectedReq?.invoiceData?.vat || '15',
                          invoiceNo: selectedReq.invoiceNo || '',
                          items: itemsJson,
                          autoPrint: 'true'
                        });
                        window.open(`/invoice-template-2?${params.toString()}`, '_blank');
                      }}
                    >
                      <Download className="w-3.5 h-3.5" /> Download Invoice
                    </Button>
                  )}
                  {selectedReq.status === "contacted" && (
                    <Button size="sm" className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                      <MapPin className="w-3.5 h-3.5" /> Sched. Site Visit
                    </Button>
                  )}
                  {(selectedReq.status === "site_visit" || selectedReq.status === "contacted") && (
                    <Button size="sm" className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                      <FileText className="w-3.5 h-3.5" /> Send Quote
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="w-full border-red-500/20 text-red-500 hover:bg-red-500/10">
                    Reject
                  </Button>
                </div>
              </div>

              <hr className="border-border" />

              {/* Contact Information */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3" /> Client Info
                </p>
                <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-2.5">
                  <div className="flex items-center gap-3 text-foreground">
                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a href={`mailto:${selectedReq.email}`} className="hover:underline hover:text-accent truncate">{selectedReq.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                    <a href={`tel:${selectedReq.phone}`} className="hover:underline hover:text-accent truncate">{selectedReq.phone}</a>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <HardHat className="w-3 h-3" /> Project Details
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Service & Type</p>
                    <p className="text-sm font-semibold text-foreground">{selectedReq.serviceRequired} ({selectedReq.projectType})</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Estimated Budget</p>
                    <p className="text-sm font-semibold text-amber-500">{selectedReq.estimatedBudget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Project Description</p>
                    <p className="text-sm text-foreground bg-muted/30 p-3 rounded-lg leading-relaxed">
                      {selectedReq.projectDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location & Dates */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Home className="w-3 h-3" /> Location & Timeline
                </p>
                <div className="bg-muted/30 rounded-lg p-3 text-sm space-y-3">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">{selectedReq.propertyAddress}</p>
                      <p className="text-xs text-muted-foreground">{selectedReq.cityRegion}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div className="flex gap-4">
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground">Start</p>
                        <p className="font-medium text-foreground">{selectedReq.preferredStartDate ? formatDate(selectedReq.preferredStartDate) : 'TBD'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground">Deadline</p>
                        <p className="font-medium text-foreground">{selectedReq.projectDeadline ? formatDate(selectedReq.projectDeadline) : 'TBD'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attached Media */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Download className="w-3 h-3" /> Attached Media
                </p>
                {selectedReq.mediaUrls && selectedReq.mediaUrls.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReq.mediaUrls.map((url: string, i: number) => (
                      <div key={i} className="group relative aspect-video bg-muted rounded-lg overflow-hidden border border-border">
                        <img src={url} alt={`Attachment ${i}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <a href={url} target="_blank" rel="noopener noreferrer" className="bg-white/20 hover:bg-white/40 p-2 rounded-full backdrop-blur-sm transition-colors">
                            <Eye className="w-4 h-4 text-white" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic bg-muted/30 p-3 rounded-lg">No media files attached.</p>
                )}
              </div>

              {/* Danger Zone */}
              <div className="pt-4">
                <Button variant="ghost" size="sm" className="w-full text-red-500 hover:bg-red-500/10 hover:text-red-600 gap-2">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Request
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>

      <Dialog open={isBlankInvoiceOpen} onOpenChange={setIsBlankInvoiceOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Blank Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-1.5 block">VAT Percentage (%)</label>
            <Input 
              type="number" 
              value={vatPercentage}
              onChange={e => setVatPercentage(e.target.value)}
              placeholder="e.g. 15"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBlankInvoiceOpen(false)}>Cancel</Button>
            <Button 
              style={{ backgroundColor: '#6aabfc', color: '#fff' }}
              onClick={() => {
                const uniqueNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
                window.open(`/invoice-template?vat=${vatPercentage}&invoiceNo=${uniqueNo}&autoPrint=true`, '_blank');
                setIsBlankInvoiceOpen(false);
              }}
            >
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fill Invoice Dialog */}
      <Dialog open={isFillInvoiceOpen} onOpenChange={setIsFillInvoiceOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Invoice</DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4">
            
            <div className="bg-muted/30 p-3 rounded-lg text-sm mb-4">
              <p><strong>Client:</strong> {fillName}</p>
              <p><strong>Service:</strong> {fillService}</p>
              <p><strong>Address:</strong> {fillAddress}</p>
              <p><strong>Date:</strong> {fillDate}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Invoice Items</label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={() => setFillItems([...fillItems, { qty: 1, desc: "", price: 0 }])}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Row
                </Button>
              </div>
              <div className="space-y-2">
                {fillItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-center bg-card border rounded-lg p-2">
                    <Input 
                      type="number" 
                      className="w-16 h-8 text-sm" 
                      placeholder="Qty" 
                      value={item.qty || ""} 
                      onChange={(e) => {
                        const newItems = [...fillItems];
                        newItems[index].qty = Number(e.target.value);
                        setFillItems(newItems);
                      }} 
                    />
                    <Input 
                      className="flex-1 h-8 text-sm" 
                      placeholder="Description" 
                      value={item.desc} 
                      onChange={(e) => {
                        const newItems = [...fillItems];
                        newItems[index].desc = e.target.value;
                        setFillItems(newItems);
                      }} 
                    />
                    <Input 
                      type="number" 
                      className="w-24 h-8 text-sm" 
                      placeholder="Price" 
                      value={item.price || ""} 
                      onChange={(e) => {
                        const newItems = [...fillItems];
                        newItems[index].price = Number(e.target.value);
                        setFillItems(newItems);
                      }} 
                    />
                    <div className="w-20 text-right text-sm font-semibold whitespace-nowrap">
                      GH₵ {(item.qty * item.price).toLocaleString()}
                    </div>
                    {fillItems.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-600 shrink-0"
                        onClick={() => {
                          const newItems = fillItems.filter((_, i) => i !== index);
                          setFillItems(newItems);
                        }}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t mt-4">
              <div className="w-48">
                <label className="text-sm font-medium mb-1.5 block">VAT (%)</label>
                <Input type="number" value={fillVat} onChange={e => setFillVat(e.target.value)} placeholder="15" />
              </div>
            </div>

          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFillInvoiceOpen(false)}>Cancel</Button>
            <Button 
              style={{ backgroundColor: '#6aabfc', color: '#fff' }}
              onClick={async () => {
                const uniqueNo = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
                const itemsJson = encodeURIComponent(JSON.stringify(fillItems));
                const params = new URLSearchParams({
                  name: fillName,
                  service: fillService,
                  address: fillAddress,
                  date: fillDate,
                  vat: fillVat,
                  invoiceNo: uniqueNo,
                  items: itemsJson,
                  autoPrint: 'true'
                });
                
                if (selectedReq) {
                  const invoiceData = {
                    date: fillDate,
                    vat: fillVat,
                    items: fillItems
                  };
                  await saveConstructionInvoice(selectedReq.id, uniqueNo, invoiceData);
                  router.refresh();
                  setSelectedReq({
                    ...selectedReq,
                    invoiceNo: uniqueNo,
                    invoiceData: invoiceData
                  });
                }
                
                // Need to avoid URL too long issues if items are massive, but typically it's fine for < 2000 chars.
                // Modern browsers support 64k+ chars in URL.
                window.open(`/invoice-template-2?${params.toString()}`, '_blank');
                setIsFillInvoiceOpen(false);
              }}
            >
              Generate & Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
