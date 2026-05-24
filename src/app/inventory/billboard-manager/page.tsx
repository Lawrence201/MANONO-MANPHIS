"use client";

import { useEffect, useRef, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Monitor, MapPin, Mail, Phone, Clock, RefreshCw, Search,
  Crown, CheckCircle2, Zap, AlertTriangle, TrendingUp,
  Settings, Pause, Play, Trash2, Upload, X, Calendar,
  ImageIcon, ExternalLink, Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  getBillboardBookings,
  updateBillboardBookingStatus,
  updateBillboardBookingDates,
  updateBillboardBookingMedia,
  deleteBillboardBooking,
} from "@/lib/actions/booking-actions";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────────
type Booking = {
  id: number;
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
  totalPrice: number;
  status: string;
  paymentStatus: string;
  advertFile: string | null;
  billboard: {
    id: number;
    name: string;
    city: string;
    address: string;
    category: string;
    latitude: string | null;
    longitude: string | null;
    featureImage: string | null;
    assetCode: string;
  };
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-[#1a4d5c]", "bg-[#1e5c3a]", "bg-[#3d2d6b]", "bg-[#5c3d1a]",
  "bg-[#1a3d6b]", "bg-[#5c1a3d]", "bg-[#2d5c4a]", "bg-[#4a1a5c]",
];

function getInitials(name: string) {
  return name.split(/[\s&]+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();
}
function getAvatarColor(id: number) { return AVATAR_COLORS[id % AVATAR_COLORS.length]; }
function formatCurrency(n: number) {
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
function toInputDate(iso: string) {
  return new Date(iso).toISOString().split("T")[0];
}
function isRunning(startDate: string, endDate: string) {
  const now = Date.now();
  return new Date(startDate).getTime() <= now && new Date(endDate).getTime() >= now;
}
function isExpiringSoon(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
}
function getClientTier(booking: Booking) {
  const type = (booking.clientType || "").toLowerCase();
  if (type === "vip" || booking.totalPrice >= 5000) return "vip";
  if (type === "corporate" || type === "trusted" || booking.totalPrice >= 2000) return "trusted";
  return "new";
}
function daysLeft(endDate: string) {
  return Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

// ── Live Countdown ─────────────────────────────────────────────────────────────
function Countdown({ startDate, endDate, paused }: { startDate: string; endDate: string; paused?: boolean }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  if (paused) {
    return <span className="font-mono text-xs font-bold text-blue-400 tracking-wider">⏸ PAUSED</span>;
  }

  const now = Date.now();
  const startT = new Date(startDate).getTime();
  
  if (now < startT) {
    const daysUntilStart = Math.max(1, Math.ceil((startT - now) / (1000 * 60 * 60 * 24)));
    return <span className="font-mono text-xs font-bold text-emerald-500 tracking-wider">Starts in {daysUntilStart}d</span>;
  }

  const diff = new Date(endDate).getTime() - now;
  if (diff <= 0) {
    return <span className="font-mono text-xs font-bold text-red-500 tracking-wider">Expired</span>;
  }
  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);
  const urgent = d < 7;
  return (
    <span className={cn("font-mono text-xs font-bold tracking-wider", urgent ? "text-red-500" : "text-amber-500")}>
      {d}d : {String(h).padStart(2, "0")}h : {String(m).padStart(2, "0")}m : {String(s).padStart(2, "0")}s
    </span>
  );
}


// ── Admin Modal ────────────────────────────────────────────────────────────────
function AdminModal({
  booking,
  onClose,
  onStatusChange,
  onExtend,
  onMediaUpdate,
  onDelete,
}: {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: number, status: string) => Promise<void>;
  onExtend: (id: number, startDate: string, endDate: string) => Promise<void>;
  onMediaUpdate: (id: number, url: string) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}) {
  const [newStartDate, setNewStartDate] = useState(toInputDate(booking.startDate));
  const [newEndDate, setNewEndDate] = useState(toInputDate(booking.endDate));
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const paused = booking.status === "paused";

  const handleExtend = async () => {
    if (!newStartDate || !newEndDate) return;
    setSaving(true);
    await onExtend(booking.id, newStartDate, newEndDate);
    setSaving(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "campaign-media");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.success) {
        await onMediaUpdate(booking.id, data.url);
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload error");
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-very-thin">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent" />
              <h2 className="font-display font-bold text-foreground">Admin Controls</h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {booking.billboard.name} · #{booking.id}
            </p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Current campaign snapshot */}
          <div className="bg-muted/40 rounded-xl p-4 space-y-1.5 text-sm">
            <p className="font-semibold text-foreground">{booking.campaignTitle}</p>
            <p className="text-muted-foreground text-xs">
              {booking.companyName || booking.fullName} · {formatCurrency(booking.totalPrice)}
            </p>
            <div className="flex gap-3 mt-2 text-xs">
              <span>
                <span className="text-muted-foreground">Start:</span>{" "}
                <span className={newStartDate !== toInputDate(booking.startDate) ? "text-accent font-bold" : ""}>
                  {formatDate(new Date(newStartDate).toISOString())}
                </span>
              </span>
              <span>
                <span className="text-muted-foreground">End:</span>{" "}
                <span className={newEndDate !== toInputDate(booking.endDate) ? "text-accent font-bold" : ""}>
                  {formatDate(new Date(newEndDate).toISOString())}
                </span>
              </span>
            </div>
            <div className="text-xs text-amber-500 font-semibold mt-1">
              <span className={newEndDate !== toInputDate(booking.endDate) || newStartDate !== toInputDate(booking.startDate) ? "text-accent font-bold" : ""}>
                {Math.max(0, Math.ceil((new Date(newEndDate).getTime() - new Date(newStartDate).getTime()) / (1000 * 60 * 60 * 24)))} days duration
              </span>
            </div>
          </div>

          {/* ── Section 1: Timeline ── */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" /> Timeline Management
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">New Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">New End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    min={newStartDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40"
                  />
                </div>
              </div>
              <Button
                size="sm"
                className="w-full gap-2"
                onClick={handleExtend}
                disabled={saving || (newEndDate === toInputDate(booking.endDate) && newStartDate === toInputDate(booking.startDate))}
              >
                <Calendar className="w-4 h-4" />
                {saving ? "Saving…" : "Update Campaign Dates"}
              </Button>
            </div>
          </div>

          {/* ── Section 2: Pause / Resume ── */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Campaign Timer
            </p>
            <div className="flex items-center justify-between bg-muted/40 rounded-xl px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {paused ? "Campaign is paused" : "Campaign is running"}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {paused ? "Countdown stopped — days not consumed" : "Countdown ticking in real time"}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className={cn("gap-2 shrink-0 ml-3", paused && "border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10")}
                onClick={() => onStatusChange(booking.id, paused ? "active" : "paused")}
              >
                {paused ? <><Play className="w-3.5 h-3.5" />Resume</> : <><Pause className="w-3.5 h-3.5" />Pause</>}
              </Button>
            </div>
          </div>

          {/* ── Section 3: Media ── */}
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" /> Client Media
            </p>

            {booking.advertFile ? (
              <div className="flex items-center gap-3 bg-muted/40 rounded-xl px-4 py-3 mb-3">
                <ImageIcon className="w-4 h-4 text-muted-foreground shrink-0" />
                <a
                  href={booking.advertFile}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent text-sm truncate hover:underline flex-1"
                >
                  View current media file
                </a>
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground mb-3 italic">No media uploaded yet.</p>
            )}

            <input
              ref={fileRef}
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-2"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading…" : booking.advertFile ? "Replace Media File" : "Upload Media File"}
            </Button>
          </div>

          {/* ── Section 4: Danger Zone ── */}
          <div className="border border-red-500/20 rounded-xl p-4">
            <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Danger Zone
            </p>

            {!confirmDelete ? (
              <Button
                size="sm"
                variant="outline"
                className="w-full gap-2 border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete Slot
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-400 text-center">
                  This permanently deletes the booking and cannot be undone.
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
                    onClick={() => onDelete(booking.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Yes, Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon: Icon }: {
  label: string; value: string | number; sub?: string; icon: any;
}) {
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

// ── Campaign Card ──────────────────────────────────────────────────────────────
function CampaignCard({ booking, onAdminClick }: {
  booking: Booking;
  onAdminClick: (b: Booking) => void;
}) {
  const tier = getClientTier(booking);
  const running = isRunning(booking.startDate, booking.endDate);
  const expiring = isExpiringSoon(booking.endDate);
  const paused = booking.status === "paused";
  const displayName = booking.companyName || booking.fullName;

  const past = new Date(booking.endDate).getTime() < Date.now();
  const liveLabel = paused ? "PAUSED" : past ? "COMPLETED" : running && !expiring ? "LIVE" : expiring ? "EXPIRING" : "APPROVED";
  const liveColor = paused
    ? "bg-blue-500/15 text-blue-400"
    : past
    ? "bg-zinc-500/15 text-zinc-500"
    : running && !expiring
    ? "bg-emerald-500/15 text-emerald-500"
    : expiring
    ? "bg-red-500/15 text-red-500"
    : "bg-indigo-500/15 text-indigo-400";

  return (
    <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col overflow-hidden hover:shadow-lg transition-shadow group">

      {/* ── Billboard Hero Image ── */}
      <div className="relative w-full h-[220px] min-h-[220px] max-h-[220px] shrink-0 bg-muted overflow-hidden">
        {booking.billboard.featureImage ? (
          <img
            src={booking.billboard.featureImage}
            alt={booking.billboard.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
            <Monitor className="w-10 h-10 text-zinc-600" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Category badge top-right */}
        <span className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize">
          {booking.billboard.category}
        </span>

        {/* Status pill top-left */}
        <span className={cn("absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-1 rounded-full", liveColor)}>
          {liveLabel}
        </span>

        {/* Billboard name overlaid on image bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-2.5">
          <p className="text-white font-bold text-sm leading-tight drop-shadow">{booking.billboard.name}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3 text-white/70" />
            <p className="text-white/80 text-[11px]">{booking.billboard.city} · {booking.billboard.address}</p>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Client Info ── */}
      <div className="p-4 pb-3 flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs font-display",
          getAvatarColor(booking.id)
        )}>
          {getInitials(displayName)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-foreground text-sm truncate">{displayName}</p>
          <p className="text-xs text-muted-foreground truncate">
            {booking.fullName !== displayName ? booking.fullName : booking.email}
          </p>
        </div>
        {tier === "vip" && <Crown className="w-4 h-4 text-amber-500 shrink-0" />}
        {tier === "trusted" && <span className="text-[10px] font-bold text-blue-500 shrink-0">TRUSTED</span>}
        {tier === "new" && <span className="text-[10px] font-bold text-emerald-500 shrink-0">NEW</span>}
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border mx-4" />

      {/* ── Stats ── */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Price</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{formatCurrency(booking.totalPrice)}</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Slots</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{booking.slotsRequested}</p>
        </div>
        <div>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Days Left</p>
          <p className={cn("text-sm font-bold mt-0.5", daysLeft(booking.endDate) < 7 ? "text-red-500" : "text-foreground")}>
            {daysLeft(booking.endDate)}d
          </p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border mx-4" />

      {/* ── Countdown ── */}
      <div className="px-4 py-3 flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <Countdown startDate={booking.startDate} endDate={booking.endDate} paused={paused} />
      </div>

      {/* Campaign name + Map */}
      <div className="px-4 pb-3 flex items-center justify-between gap-3">
        <div className="min-w-0 space-y-0.5">
          <p className="text-xs text-muted-foreground truncate">
            <span className="font-semibold text-muted-foreground">Title:</span>{" "}
            <span className="text-foreground font-medium">{booking.campaignTitle}</span>
          </p>
          <p className="text-xs text-muted-foreground truncate capitalize">
            <span className="font-semibold text-muted-foreground">Media Type:</span>{" "}
            <span className="text-foreground font-medium">{booking.campaignType}</span>
          </p>
        </div>
        {(() => {
          const lat = booking.billboard.latitude && booking.billboard.latitude !== "0" ? booking.billboard.latitude : "5.603";
          const lng = booking.billboard.longitude && booking.billboard.longitude !== "0" ? booking.billboard.longitude : "-0.186";
          return (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-[105px] h-[60px] bg-gray-50 rounded-[6px] overflow-hidden border border-gray-100 relative group/map shadow-inner shrink-0 -mt-8"
            >
              <img
                src={`https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${lng},${lat}&z=13&l=map&size=150,150`}
                alt="Billboard location"
                className="w-full h-full object-cover transition-transform duration-700 group-hover/map:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-md animate-bounce">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EA4335" />
                </svg>
              </div>
            </a>
          );
        })()}
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-border" />

      {/* ── Actions ── */}
      <div className="flex divide-x divide-border">
        <button
          onClick={() => onAdminClick(booking)}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <Settings className="w-3.5 h-3.5" />
          Admin
        </button>
        <a
          href={`mailto:${booking.email}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          Email
        </a>
        <a
          href={booking.phone ? `tel:${booking.phone}` : "#"}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          Call
        </a>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "all",      label: "All" },
  { key: "live",     label: "Live Now" },
  { key: "approved", label: "Approved" },
  { key: "paused",   label: "Paused" },
  { key: "expiring", label: "Expiring Soon" },
  { key: "completed",label: "Completed" },
];

export default function BillboardManagerPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [adminTarget, setAdminTarget] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    const result = await getBillboardBookings();
    if (result.success) {
      setBookings(
        (result.data as Booking[]).filter(
          (b) => b.status !== "pending" && b.status !== "rejected"
        )
      );
    } else {
      toast.error("Failed to load campaigns");
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  // ── Admin handlers ──
  const handleStatusChange = async (id: number, status: string) => {
    const result = await updateBillboardBookingStatus(id, status);
    if (result.success) {
      toast.success(`Campaign ${status === "paused" ? "paused" : "resumed"}`);
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
      setAdminTarget((prev) => (prev?.id === id ? { ...prev, status } : prev));
    } else {
      toast.error("Failed to update status");
    }
  };

  const handleExtend = async (id: number, newStartDate: string, newEndDate: string) => {
    const result = await updateBillboardBookingDates(id, newStartDate, newEndDate);
    if (result.success) {
      toast.success("Campaign dates updated");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, startDate: new Date(newStartDate).toISOString(), endDate: new Date(newEndDate).toISOString() } : b))
      );
      setAdminTarget((prev) =>
        prev?.id === id ? { ...prev, startDate: new Date(newStartDate).toISOString(), endDate: new Date(newEndDate).toISOString() } : prev
      );
    } else {
      toast.error("Failed to update dates");
    }
  };

  const handleMediaUpdate = async (id: number, url: string) => {
    const result = await updateBillboardBookingMedia(id, url);
    if (result.success) {
      toast.success("Media updated successfully");
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, advertFile: url } : b))
      );
      setAdminTarget((prev) => (prev?.id === id ? { ...prev, advertFile: url } : prev));
    } else {
      toast.error("Failed to update media");
    }
  };

  const handleDelete = async (id: number) => {
    const result = await deleteBillboardBooking(id);
    if (result.success) {
      toast.success("Booking deleted");
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setAdminTarget(null);
    } else {
      toast.error("Failed to delete booking");
    }
  };

  // ── Filter ──
  const filtered = bookings.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      b.campaignTitle.toLowerCase().includes(q) ||
      (b.companyName || "").toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.billboard.name.toLowerCase().includes(q) ||
      b.billboard.city.toLowerCase().includes(q);

    const matchTab =
      activeTab === "all" ? true
      : activeTab === "live"      ? isRunning(b.startDate, b.endDate) && b.status !== "completed" && b.status !== "paused"
      : activeTab === "approved"  ? b.status === "approved" && !isRunning(b.startDate, b.endDate)
      : activeTab === "paused"    ? b.status === "paused"
      : activeTab === "expiring"  ? isExpiringSoon(b.endDate) && b.status !== "completed"
      : activeTab === "completed" ? b.status === "completed"
      : true;

    return matchSearch && matchTab;
  });

  // Stats
  const liveCount    = bookings.filter((b) => isRunning(b.startDate, b.endDate) && b.status !== "completed" && b.status !== "paused").length;
  const approvedCount= bookings.filter((b) => b.status === "approved").length;
  const pausedCount  = bookings.filter((b) => b.status === "paused").length;
  const expiringCount= bookings.filter((b) => isExpiringSoon(b.endDate) && b.status !== "completed").length;
  const totalRevenue = bookings.reduce((s, b) => s + b.totalPrice, 0);

  return (
    <AppLayout>
      {/* Admin Modal */}
      {adminTarget && (
        <AdminModal
          booking={adminTarget}
          onClose={() => setAdminTarget(null)}
          onStatusChange={handleStatusChange}
          onExtend={handleExtend}
          onMediaUpdate={handleMediaUpdate}
          onDelete={handleDelete}
        />
      )}

      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Digital Billboard Manager</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage all approved campaigns — view billboard images, maps, and client controls
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={fetchBookings} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard label="Live Now"       value={liveCount}              sub="Broadcasting"         icon={Zap} />
          <StatCard label="Approved"       value={approvedCount}          sub="Scheduled"            icon={CheckCircle2} />
          <StatCard label="Paused"         value={pausedCount}            sub="On hold"              icon={Pause} />
          <StatCard label="Expiring Soon"  value={expiringCount}          sub="< 7 days"             icon={AlertTriangle} />
          <StatCard label="Campaign Value" value={formatCurrency(totalRevenue)} sub="All campaigns"  icon={TrendingUp} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search campaign, client, billboard…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 flex-wrap">
            {TABS.map((tab) => {
              const count =
                tab.key === "live"      ? liveCount
                : tab.key === "approved"  ? approvedCount
                : tab.key === "paused"    ? pausedCount
                : tab.key === "expiring"  ? expiringCount
                : tab.key === "completed" ? bookings.filter(b => b.status === "completed").length
                : bookings.length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap",
                    activeTab === tab.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {tab.key !== "all" && (
                    <span className="ml-1.5 opacity-60">{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Expiring alert */}
        {expiringCount > 0 && activeTab !== "expiring" && (
          <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-sm text-amber-600 dark:text-amber-400">
              <span className="font-semibold">{expiringCount} campaign{expiringCount !== 1 ? "s" : ""}</span>{" "}
              expiring within 7 days — reach out to clients for renewal.
            </p>
            <button
              onClick={() => setActiveTab("expiring")}
              className="ml-auto text-xs font-semibold text-amber-500 hover:text-amber-400 shrink-0"
            >
              View All
            </button>
          </div>
        )}

        {/* Cards grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border h-[500px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border shadow-card flex flex-col items-center justify-center py-24 text-center">
            <Monitor className="w-14 h-14 text-muted-foreground/20 mb-4" />
            <p className="font-semibold text-foreground text-lg">No campaigns found</p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              {searchTerm
                ? "Try a different search term"
                : activeTab === "all"
                ? "Approved campaigns will appear here once bookings are approved from Ad Bookings"
                : `No ${activeTab} campaigns right now`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((booking) => (
              <CampaignCard
                key={booking.id}
                booking={booking}
                onAdminClick={setAdminTarget}
              />
            ))}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground text-center pb-2">
            Showing {filtered.length} of {bookings.length} campaign{bookings.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </AppLayout>
  );
}
