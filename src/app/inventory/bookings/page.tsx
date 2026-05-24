"use client";

import { useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Search, Filter, Eye, CheckCircle2, XCircle, Clock, ChevronDown,
  DollarSign, Calendar, Users, BarChart3, Monitor, Download, RefreshCw,
  Building2, Mail, Phone, MapPin, FileImage, CreditCard, Layers, Pause
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getBillboardBookings, updateBillboardBookingStatus } from "@/lib/actions/booking-actions";
import { toast } from "sonner";

type Booking = {
  id: number;
  billboardId: number;
  fullName: string;
  email: string;
  phone: string | null;
  companyName: string | null;
  clientType: string | null;
  campaignTitle: string;
  campaignType: string;
  campaignDuration: number | null;
  startDate: string;
  endDate: string;
  slotsRequested: number;
  description: string | null;
  advertFile: string | null;
  totalPrice: number;
  taxRate: number | null;
  paymentMethod: string | null;
  status: string;
  paymentStatus: string;
  createdAt: string;
  billboard: {
    id: number;
    name: string;
    city: string;
    address: string;
  };
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending:   { label: "Pending",   color: "text-amber-500",  bg: "bg-amber-500/10",  icon: Clock },
  paused:    { label: "Paused",    color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", icon: Pause },
  approved:  { label: "Approved",  color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  rejected:  { label: "Rejected",  color: "text-red-500",    bg: "bg-red-500/10",    icon: XCircle },
  active:    { label: "Active",    color: "text-blue-500",   bg: "bg-blue-500/10",   icon: Monitor },
  completed: { label: "Completed", color: "text-zinc-400",   bg: "bg-zinc-400/10",   icon: CheckCircle2 },
};

const PAYMENT_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Unpaid",  color: "text-amber-500", bg: "bg-amber-500/10" },
  paid:    { label: "Paid",    color: "text-emerald-500", bg: "bg-emerald-500/10" },
  partial: { label: "Partial", color: "text-blue-500",   bg: "bg-blue-500/10" },
  refunded:{ label: "Refunded",color: "text-red-400",    bg: "bg-red-400/10" },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatCurrency(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getDurationString(start: string, end: string, duration: number | null) {
  if (!duration) return "—";
  const diffDays = Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffDays - duration) <= 1) return `${duration} day${duration > 1 ? 's' : ''}`;
  if (Math.abs(diffDays - duration * 7) <= 2) return `${duration} week${duration > 1 ? 's' : ''}`;
  
  return `${duration} month${duration > 1 ? 's' : ''}`;
}

function RowCountdown({ startDate, endDate, status }: { startDate: string; endDate: string; status: string }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (status !== "pending" && status !== "paused") {
      const t = setInterval(() => setTick(n => n + 1), 1000);
      return () => clearInterval(t);
    }
  }, [status]);

  if (status === "completed" || status === "rejected") {
    return <span className="text-xs text-muted-foreground">—</span>;
  }
  
  if (status === "paused") {
    return <span className="text-xs font-semibold text-blue-500 font-mono tracking-wider">⏸ PAUSED</span>;
  }

  const now = Date.now();
  const startT = new Date(startDate).getTime();
  const endT = new Date(endDate).getTime();

  if (now < startT) {
    const daysUntilStart = Math.max(1, Math.ceil((startT - now) / (1000 * 60 * 60 * 24)));
    return <span className="text-xs font-semibold text-emerald-500 font-mono tracking-wider">Starts in {daysUntilStart}d</span>;
  }

  const diff = status === "pending"
    ? endT - startT
    : endT - now;
  if (diff <= 0) {
    return <span className="text-xs font-semibold text-red-500 font-mono">Expired</span>;
  }

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  const urgent = d < 7;

  return (
    <span className={cn("text-xs font-bold font-mono tracking-wide whitespace-nowrap", urgent ? "text-red-500" : "text-amber-500")}>
      {d}d {String(h).padStart(2,"0")}h {String(m).padStart(2,"0")}m {String(s).padStart(2,"0")}s
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold", cfg.bg, cfg.color)}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const cfg = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.pending;
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium", cfg.bg, cfg.color)}>
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string | number; sub?: string; icon: any }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground mt-0.5">{value}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function AdBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const result = await getBillboardBookings();
    if (result.success) {
      setBookings(result.data as Booking[]);
    } else {
      toast.error("Failed to load bookings");
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    setActionLoading(id);
    const result = await updateBillboardBookingStatus(id, status);
    if (result.success) {
      toast.success(`Booking ${status} successfully`);
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status, ...((status === "approved" || status === "active") ? { paymentStatus: "paid" } : {}) } : b));
      if (selectedBooking?.id === id) setSelectedBooking(prev => prev ? { ...prev, status, ...((status === "approved" || status === "active") ? { paymentStatus: "paid" } : {}) } : null);
    } else {
      toast.error("Failed to update booking status");
    }
    setActionLoading(null);
  };

  const filtered = bookings.filter(b => {
    const matchSearch = !searchTerm ||
      b.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.campaignTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.billboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (b.companyName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const total = bookings.length;
  const pending = bookings.filter(b => b.status === "pending").length;
  const approved = bookings.filter(b => b.status === "approved" || b.status === "active").length;
  const totalRevenue = bookings.filter(b => b.paymentStatus === "paid").reduce((s, b) => s + b.totalPrice, 0);

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Ad Bookings</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Review, approve, and manage billboard booking requests</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchBookings} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Bookings" value={total} icon={Layers} />
          <StatCard label="Pending Review" value={pending} sub="Awaiting decision" icon={Clock} />
          <StatCard label="Approved / Active" value={approved} sub="Running campaigns" icon={CheckCircle2} />
          <StatCard label="Confirmed Revenue" value={formatCurrency(totalRevenue)} sub="From paid bookings" icon={DollarSign} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by client, campaign, billboard..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {["all", "pending", "approved", "active", "completed", "rejected"].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors",
                  statusFilter === s
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "all" ? "All" : STATUS_CONFIG[s]?.label || s}
                {s !== "all" && (
                  <span className="ml-1.5 text-[10px] opacity-70">
                    {bookings.filter(b => b.status === s).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main content: table + detail panel */}
        <div className="flex gap-4 h-[620px] items-stretch">
          {/* Table */}
          <div className={cn("bg-card rounded-xl border border-border shadow-card overflow-hidden flex-1 transition-all", selectedBooking ? "lg:max-w-[calc(100%-380px)]" : "w-full")}>
            {loading ? (
              <div className="p-8 space-y-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Monitor className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">No bookings found</p>
                <p className="text-sm text-muted-foreground/60 mt-1">
                  {searchTerm || statusFilter !== "all" ? "Try adjusting your filters" : "Bookings will appear here once submitted"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto overflow-y-auto h-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30 sticky top-0 z-10">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Client</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Campaign</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Billboard</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Period</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Time Remaining</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Value</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Payment</th>
                      <th className="px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filtered.map(booking => (
                      <tr
                        key={booking.id}
                        onClick={() => setSelectedBooking(selectedBooking?.id === booking.id ? null : booking)}
                        className={cn(
                          "cursor-pointer transition-colors hover:bg-muted/30 h-[54px]",
                          selectedBooking?.id === booking.id && "bg-accent/5 border-l-2 border-l-accent"
                        )}
                      >
                        <td className="px-4 py-0 overflow-hidden max-w-[140px]">
                          <div className="font-medium text-foreground truncate max-w-[140px]">{booking.fullName}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[140px]">{booking.companyName || booking.email}</div>
                        </td>
                        <td className="px-4 py-0 overflow-hidden">
                          <div className="font-medium text-foreground truncate max-w-[160px]">{booking.campaignTitle}</div>
                          <div className="text-xs text-muted-foreground capitalize">{booking.campaignType}</div>
                        </td>
                        <td className="px-4 py-0 overflow-hidden">
                          <div className="text-foreground truncate max-w-[120px]">{booking.billboard.name}</div>
                          <div className="text-xs text-muted-foreground">{booking.billboard.city}</div>
                        </td>
                        <td className="px-4 py-0 whitespace-nowrap overflow-hidden">
                          <div className="text-foreground text-xs">{formatDate(booking.startDate)}</div>
                          <div className="text-muted-foreground text-xs">→ {formatDate(booking.endDate)}</div>
                        </td>
                        <td className="py-4 px-4 align-middle">
                          <RowCountdown startDate={booking.startDate} endDate={booking.endDate} status={booking.status} />
                        </td>
                        <td className="px-4 py-0 overflow-hidden">
                          <span className="font-semibold text-foreground">{formatCurrency(booking.totalPrice)}</span>
                        </td>
                        <td className="px-4 py-0 overflow-hidden">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-4 py-0 overflow-hidden">
                          <PaymentBadge status={booking.paymentStatus} />
                        </td>
                        <td className="px-4 py-0">
                          <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Detail Panel */}
          {selectedBooking && (
            <div className="w-[370px] shrink-0 bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-display font-semibold text-foreground">Booking Detail</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">ID #{selectedBooking.id}</p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-very-thin p-4 space-y-5">
                {/* Status + Actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <StatusBadge status={selectedBooking.status} />
                  <PaymentBadge status={selectedBooking.paymentStatus} />
                </div>

                {selectedBooking.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                      disabled={actionLoading === selectedBooking.id}
                      onClick={() => handleStatusChange(selectedBooking.id, "active")}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-500 hover:bg-red-500/10 gap-2"
                      disabled={actionLoading === selectedBooking.id}
                      onClick={() => handleStatusChange(selectedBooking.id, "rejected")}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  </div>
                )}

                {selectedBooking.status === "approved" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                      disabled={actionLoading === selectedBooking.id}
                      onClick={() => handleStatusChange(selectedBooking.id, "active")}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      Mark Active
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 gap-2"
                      disabled={actionLoading === selectedBooking.id}
                      onClick={() => handleStatusChange(selectedBooking.id, "completed")}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Complete
                    </Button>
                  </div>
                )}

                {selectedBooking.status === "active" && (
                  <Button
                    size="sm"
                    className="w-full gap-2"
                    variant="outline"
                    disabled={actionLoading === selectedBooking.id}
                    onClick={() => handleStatusChange(selectedBooking.id, "completed")}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Mark as Completed
                  </Button>
                )}

                {/* Campaign Info */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Campaign</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Title</span>
                      <span className="text-foreground font-medium text-right max-w-[180px]">{selectedBooking.campaignTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type</span>
                      <span className="text-foreground capitalize">{selectedBooking.campaignType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="text-foreground">{getDurationString(selectedBooking.startDate, selectedBooking.endDate, selectedBooking.campaignDuration)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Slots</span>
                      <span className="text-foreground">{selectedBooking.slotsRequested} slots</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Start</span>
                      <span className="text-foreground">{formatDate(selectedBooking.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">End</span>
                      <span className="text-foreground">{formatDate(selectedBooking.endDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Billboard Info */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Billboard</p>
                  <div className="bg-muted/40 rounded-lg p-3 space-y-1.5 text-sm">
                    <div className="font-medium text-foreground flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-muted-foreground" />
                      {selectedBooking.billboard.name}
                    </div>
                    <div className="text-muted-foreground flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5" />
                      {selectedBooking.billboard.city} · {selectedBooking.billboard.address}
                    </div>
                  </div>
                </div>

                {/* Client Info */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Client</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-foreground">
                      <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="font-medium">{selectedBooking.fullName}</span>
                      {selectedBooking.clientType && (
                        <span className="text-xs text-muted-foreground capitalize">({selectedBooking.clientType})</span>
                      )}
                    </div>
                    {selectedBooking.companyName && (
                      <div className="flex items-center gap-2 text-foreground">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        {selectedBooking.companyName}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      {selectedBooking.email}
                    </div>
                    {selectedBooking.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-3.5 h-3.5 shrink-0" />
                        {selectedBooking.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Payment</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="text-foreground font-bold text-base">{formatCurrency(selectedBooking.totalPrice)}</span>
                    </div>
                    {selectedBooking.taxRate && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax Rate</span>
                        <span className="text-foreground">{selectedBooking.taxRate}%</span>
                      </div>
                    )}
                    {selectedBooking.paymentMethod && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Method</span>
                        <span className="text-foreground capitalize">{selectedBooking.paymentMethod}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                {selectedBooking.description && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Description</p>
                    <p className="text-sm text-foreground bg-muted/40 rounded-lg p-3 leading-relaxed">
                      {selectedBooking.description}
                    </p>
                  </div>
                )}

                {/* Advert File */}
                {selectedBooking.advertFile && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Advert File</p>
                    <div className="bg-muted/40 rounded-lg p-3 flex items-center gap-2.5">
                      <FileImage className="w-5 h-5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-sm text-foreground flex-1">Client media file</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={selectedBooking.advertFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-muted hover:bg-muted/70 text-xs font-semibold text-foreground transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </a>
                        <a
                          href={selectedBooking.advertFile}
                          download
                          onClick={async (e) => {
                            e.preventDefault();
                            try {
                              const res = await fetch(selectedBooking.advertFile!);
                              const blob = await res.blob();
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = `campaign-media-${selectedBooking.id}`;
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            } catch {
                              window.open(selectedBooking.advertFile!, "_blank");
                            }
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-accent text-accent-foreground hover:opacity-90 text-xs font-semibold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-muted-foreground border-t border-border pt-3">
                  Submitted {formatDate(selectedBooking.createdAt)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
