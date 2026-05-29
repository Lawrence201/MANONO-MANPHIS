"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  Calendar, Monitor, ChevronLeft, ChevronRight, RefreshCw,
  Clock, CheckCircle2, XCircle, Layers, MapPin, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getBillboardBookings } from "@/lib/actions/booking-actions";
import { toast } from "sonner";

type Booking = {
  id: number;
  fullName: string;
  companyName: string | null;
  campaignTitle: string;
  campaignType: string;
  startDate: string;
  endDate: string;
  slotsRequested: number;
  status: string;
  totalPrice: number;
  billboard: {
    id: number;
    name: string;
    city: string;
    address: string;
  };
};

const STATUS_COLORS: Record<string, string> = {
  pending:   "bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400",
  approved:  "bg-emerald-500/20 border-emerald-500 text-emerald-600 dark:text-emerald-400",
  active:    "bg-blue-500/20 border-blue-500 text-blue-600 dark:text-blue-400",
  completed: "bg-zinc-400/20 border-zinc-400 text-zinc-500 dark:text-zinc-400",
  rejected:  "bg-red-500/20 border-red-500 text-red-500",
};

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatCurrency(n: number) {
  return `GH₵ ${n.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
}

function isoToDate(iso: string) {
  return new Date(iso);
}

function bookingOverlapsDay(booking: Booking, year: number, month: number, day: number) {
  const cellDate = new Date(year, month, day);
  const start = isoToDate(booking.startDate);
  const end = isoToDate(booking.endDate);
  start.setHours(0,0,0,0);
  end.setHours(23,59,59,999);
  return cellDate >= start && cellDate <= end;
}

export default function CampaignSchedulePage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const fetchBookings = async () => {
    setLoading(true);
    const result = await getBillboardBookings();
    if (result.success) {
      setBookings((result.data as Booking[]).filter(b => b.status !== "rejected"));
    } else {
      toast.error("Failed to load campaign schedule");
    }
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, []);

  const prevMonth = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(today.getDate());
  };

  const filteredBookings = bookings.filter(b => statusFilter === "all" || b.status === statusFilter);

  // Get bookings for selected day
  const dayBookings = selectedDay
    ? filteredBookings.filter(b => bookingOverlapsDay(b, year, month, selectedDay))
    : [];

  // Get bookings for a given day (for calendar dots)
  const getBookingsForDay = (day: number) =>
    filteredBookings.filter(b => bookingOverlapsDay(b, year, month, day));

  // Group active bookings by billboard for timeline
  const billboards = Array.from(new Map(filteredBookings.map(b => [b.billboard.id, b.billboard])).values());

  // Stats for current month
  const monthBookings = filteredBookings.filter(b => {
    const s = isoToDate(b.startDate);
    const e = isoToDate(b.endDate);
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);
    return s <= monthEnd && e >= monthStart;
  });

  return (
    <AppLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="font-display font-bold text-2xl text-foreground">Campaign Schedule</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Visual overview of all billboard campaigns by date</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToToday} className="gap-2">
              <Calendar className="w-4 h-4" />
              Today
            </Button>
            <Button variant="outline" size="sm" onClick={fetchBookings} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Month stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Active This Month", value: monthBookings.filter(b => b.status === "active").length, color: "text-blue-500", dot: "bg-blue-500" },
            { label: "Approved", value: monthBookings.filter(b => b.status === "approved").length, color: "text-emerald-500", dot: "bg-emerald-500" },
            { label: "Pending", value: monthBookings.filter(b => b.status === "pending").length, color: "text-amber-500", dot: "bg-amber-500" },
            { label: "Billboards In Use", value: new Set(monthBookings.map(b => b.billboard.id)).size, color: "text-foreground", dot: "bg-muted-foreground" },
          ].map(stat => (
            <div key={stat.label} className="bg-card rounded-xl border border-border shadow-card px-4 py-3 flex items-center gap-3">
              <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", stat.dot)} />
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={cn("text-xl font-bold font-display", stat.color)}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2 flex-wrap">
          {["all", "active", "approved", "pending", "completed"].map(s => (
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
              {s === "all" ? "All Statuses" : s}
            </button>
          ))}
        </div>

        <div className="flex gap-4 flex-col xl:flex-row">
          {/* Calendar */}
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex-1">
            {/* Month nav */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="font-display font-semibold text-foreground">
                {MONTH_NAMES[month]} {year}
              </h2>
              <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {DAY_NAMES.map(d => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            {loading ? (
              <div className="p-6 grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-7">
                {/* Empty cells before month start */}
                {[...Array(firstDay)].map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-[80px] border-r border-b border-border/40 bg-muted/10" />
                ))}

                {/* Days */}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day = i + 1;
                  const dayBks = getBookingsForDay(day);
                  const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                  const isSelected = selectedDay === day;

                  return (
                    <div
                      key={day}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={cn(
                        "min-h-[80px] border-r border-b border-border/40 p-1.5 cursor-pointer transition-colors",
                        isSelected ? "bg-accent/10" : "hover:bg-muted/30",
                      )}
                    >
                      <div className={cn(
                        "w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold mb-1 mx-auto",
                        isToday ? "bg-accent text-accent-foreground" : "text-foreground",
                      )}>
                        {day}
                      </div>
                      <div className="space-y-0.5">
                        {dayBks.slice(0, 2).map(b => (
                          <div
                            key={b.id}
                            className={cn(
                              "text-[10px] truncate px-1 py-0.5 rounded border-l-2",
                              STATUS_COLORS[b.status] || STATUS_COLORS.pending
                            )}
                          >
                            {b.campaignTitle}
                          </div>
                        ))}
                        {dayBks.length > 2 && (
                          <div className="text-[10px] text-muted-foreground px-1">+{dayBks.length - 2} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right panel: selected day or timeline */}
          <div className="xl:w-[360px] shrink-0 flex flex-col gap-4">
            {/* Selected day panel */}
            {selectedDay ? (
              <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h3 className="font-display font-semibold text-foreground">
                    {MONTH_NAMES[month]} {selectedDay}, {year}
                  </h3>
                  <span className="text-xs text-muted-foreground">{dayBookings.length} campaign{dayBookings.length !== 1 ? "s" : ""}</span>
                </div>
                {dayBookings.length === 0 ? (
                  <div className="py-10 text-center">
                    <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No campaigns on this day</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {dayBookings.map(b => (
                      <div key={b.id} className="p-4 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-foreground text-sm leading-tight">{b.campaignTitle}</p>
                          <span className={cn("shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border-l-2 capitalize", STATUS_COLORS[b.status])}>
                            {b.status}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Monitor className="w-3 h-3" />
                            {b.billboard.name}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3 h-3" />
                            {b.billboard.city}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3 h-3" />
                            {b.fullName}{b.companyName ? ` · ${b.companyName}` : ""}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Layers className="w-3 h-3" />
                            {b.slotsRequested} slot{b.slotsRequested !== 1 ? "s" : ""} · {b.campaignType}
                          </div>
                        </div>
                        <div className="text-xs font-semibold text-foreground">
                          {formatCurrency(b.totalPrice)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border shadow-card p-4">
                <p className="text-xs text-muted-foreground text-center py-4">Click a day on the calendar to see campaigns</p>
              </div>
            )}

            {/* Billboard Timeline */}
            <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-display font-semibold text-foreground text-sm">Billboard Activity This Month</h3>
              </div>
              {loading ? (
                <div className="p-4 space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />)}
                </div>
              ) : billboards.length === 0 ? (
                <div className="py-8 text-center">
                  <Monitor className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No active campaigns</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {billboards.map(board => {
                    const bkgs = monthBookings.filter(b => b.billboard.id === board.id);
                    const activeCount = bkgs.filter(b => b.status === "active").length;
                    const approvedCount = bkgs.filter(b => b.status === "approved").length;
                    return (
                      <div key={board.id} className="px-4 py-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-muted-foreground shrink-0" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{board.name}</p>
                              <p className="text-xs text-muted-foreground">{board.city || board.address}</p>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{bkgs.length} campaign{bkgs.length !== 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex gap-1.5 mt-2">
                          {activeCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-500 rounded font-semibold">
                              {activeCount} active
                            </span>
                          )}
                          {approvedCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded font-semibold">
                              {approvedCount} approved
                            </span>
                          )}
                          {bkgs.filter(b => b.status === "pending").length > 0 && (
                            <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-500 rounded font-semibold">
                              {bkgs.filter(b => b.status === "pending").length} pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
