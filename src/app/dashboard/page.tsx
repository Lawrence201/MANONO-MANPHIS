"use client";

import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart, ProductPerformanceChart, CountryDistributionChart, PipelineFunnelChart } from "@/components/dashboard/charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { kpis, orders } from "@/lib/mock-data";
import { DollarSign, ShoppingCart, Users, TrendingUp, Truck, Target, Download, Plus, ArrowRight, Monitor, MessageSquare, ClipboardCheck, Globe, Star, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/badges";
import "./dashboard.css";

const fmt = new Intl.NumberFormat("en-US");

const countriesData = [
  { name: "Canada", percentage: 75, units: 500, x: 194.978, y: 85.27, color: "#0ea5e9" },
  { name: "Brazil", percentage: 90, units: 600, x: 278.001, y: 310.02, color: "#f97316" }, // Origin
  { name: "China", percentage: 85, units: 700, x: 687.42, y: 188.10, color: "#eab308" },
  { name: "Japan", percentage: 95, units: 450, x: 763.70, y: 187.57, color: "#ef4444" },
  { name: "Germany", percentage: 70, units: 350, x: 447.17, y: 144.54, color: "#8b5cf6" },
];



const reviews = [
  {
    name: "Ethan Brown",
    avatar: "/client_1.png",
    rating: 4.6,
    comment: "Highly recommend this service! The team was professional throughout.",
    time: "10h ago"
  },
  {
    name: "Sophia Lee",
    avatar: "/client_2.png",
    rating: 4.8,
    comment: "Great experience! Everything was smooth and the staff handled.",
    time: "1d ago"
  },
  {
    name: "Liam Smith",
    avatar: "/client_3.png",
    rating: 4.7,
    comment: "Impressed with the quick service and helpful customer support team.",
    time: "2d ago"
  }
];

const renderStars = (rating: number) => {
  const stars = [];
  const rounded = rating >= 4.8 ? 5 : 4.5;
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rounded)) {
      stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />);
    } else if (i === Math.ceil(rounded) && rounded % 1 !== 0) {
      stars.push(
        <div key={i} className="relative w-3.5 h-3.5 text-amber-500">
          <Star className="w-3.5 h-3.5 text-muted-foreground/20 fill-none" />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          </div>
        </div>
      );
    } else {
      stars.push(<Star key={i} className="w-3.5 h-3.5 text-muted-foreground/20 fill-none" />);
    }
  }
  return <div className="flex items-center gap-0.5">{stars}</div>;
};

const countryNames: Record<string, string> = {
  BD: "Bangladesh", BE: "Belgium", BF: "Burkina Faso", BG: "Bulgaria", BI: "Burundi",
  BJ: "Benin", BN: "Brunei", BO: "Bolivia", BR: "Brazil", BS: "Bahamas",
  BT: "Bhutan", BW: "Botswana", BY: "Belarus", BZ: "Belize", CA: "Canada",
  CD: "Democratic Republic of the Congo", CF: "Central African Republic",
  CG: "Republic of the Congo", CH: "Switzerland", CI: "Ivory Coast", CL: "Chile",
  CM: "Cameroon", CN: "China", CO: "Colombia", CR: "Costa Rica", CU: "Cuba",
  CY: "Cyprus", CZ: "Czech Republic", DE: "Germany", DJ: "Djibouti", DK: "Denmark",
  DO: "Dominican Republic", DZ: "Algeria", EC: "Ecuador", EE: "Estonia",
  EG: "Egypt", EH: "Western Sahara", ER: "Eritrea", ES: "Spain", ET: "Ethiopia",
  FI: "Finland", FJ: "Fiji", FK: "Falkland Islands", FR: "France", GA: "Gabon",
  GB: "United Kingdom", GE: "Georgia", GH: "Ghana", GL: "Greenland", GM: "Gambia",
  GN: "Guinea", GQ: "Equatorial Guinea", GR: "Greece", GT: "Guatemala",
  GW: "Guinea-Bissau", GY: "Guyana", HN: "Honduras", HR: "Croatia", HT: "Haiti",
  HU: "Hungary", ID: "Indonesia", IE: "Ireland", IL: "Israel", IN: "India",
  IQ: "Iraq", IR: "Iran", IS: "Iceland", IT: "Italy", JM: "Jamaica", JO: "Jordan",
  JP: "Japan", KE: "Kenya", KG: "Kyrgyzstan", KH: "Cambodia", KP: "North Korea",
  KR: "South Korea", KW: "Kuwait", KZ: "Kazakhstan", LA: "Laos", LB: "Lebanon",
  LK: "Sri Lanka", LR: "Liberia", LS: "Lesotho", LT: "Lithuania", LU: "Luxembourg",
  LV: "Latvia", LY: "Libya", MA: "Morocco", MD: "Moldova", ME: "Montenegro",
  MG: "Madagascar", MK: "Macedonia", ML: "Mali", MM: "Myanmar", MN: "Mongolia",
  MR: "Mauritania", MW: "Malawi", MX: "Mexico", MY: "Malaysia", MZ: "Mozambique",
  NA: "Namibia", NC: "New Caledonia", NE: "Niger", NG: "Nigeria", NI: "Nicaragua",
  NL: "Netherlands", NO: "Norway", NP: "Nepal", NZ: "New Zealand", OM: "Oman",
  PA: "Panama", PE: "Peru", PG: "Papua New Guinea", PH: "Philippines", PK: "Pakistan",
  PL: "Poland", PR: "Puerto Rico", PS: "Palestine", PT: "Portugal", PY: "Paraguay",
  QA: "Qatar", RO: "Romania", RS: "Serbia", RU: "Russia", RW: "Rwanda",
  SA: "Saudi Arabia", SB: "Solomon Islands", SD: "Sudan", SE: "Sweden", SG: "Singapore",
  SI: "Slovenia", SK: "Slovakia", SL: "Sierra Leone", SN: "Senegal", SO: "Somalia",
  SR: "Suriname", SS: "South Sudan", SV: "El Salvador", SY: "Syria", SZ: "Swaziland",
  TD: "Chad", TG: "Togo", TH: "Thailand", TJ: "Tajikistan", TL: "East Timor",
  TM: "Turkmenistan", TN: "Tunisia", TR: "Turkey", TT: "Trinidad and Tobago",
  TW: "Taiwan", TZ: "Tanzania", UA: "Ukraine", UG: "Uganda", US: "United States",
  UY: "Uruguay", UZ: "Uzbekistan", VE: "Venezuela", VN: "Vietnam", VU: "Vanuatu",
  YE: "Yemen", ZA: "South Africa", ZM: "Zambia", ZW: "Zimbabwe", AE: "United Arab Emirates",
  AF: "Afghanistan", AL: "Albania", AM: "Armenia", AO: "Angola", AR: "Argentina",
  AT: "Austria", AU: "Australia", AZ: "Azerbaijan", BA: "Bosnia and Herzegovina"
};

export default function DashboardPage() {
  const [tooltip, setTooltip] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    const path = target.closest('path');
    if (path) {
      const code = path.getAttribute('data-code');
      if (code) {
        const name = countryNames[code] || code;
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
          name,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    } else {
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };
  const [stats, setStats] = useState<{
    totalRevenue: number;
    activeBillboardsCount: number;
    totalBillboards: number;
    pendingApprovalsCount: number;
    totalClientsCount: number;
    totalBookingsCount: number;
    monthlyData?: { month: string; Billboards: number }[];
  }>({
    totalRevenue: 0,
    activeBillboardsCount: 8,
    totalBillboards: 10,
    pendingApprovalsCount: 5,
    totalClientsCount: 86,
    totalBookingsCount: 142,
    monthlyData: []
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [svgHtml, setSvgHtml] = useState<string>("");

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const json = await res.json();
        if (json.success && json.data) {
          setStats({
            totalRevenue: json.data.totalRevenue || 0,
            activeBillboardsCount: json.data.activeBillboardsCount || 8,
            totalBillboards: json.data.totalBillboards || 10,
            pendingApprovalsCount: json.data.pendingApprovalsCount !== undefined ? json.data.pendingApprovalsCount : 5,
            totalClientsCount: 86, // Keep premium mock data
            totalBookingsCount: 142, // Keep premium mock data
            monthlyData: json.data.monthlyData
          });
          setRecentBookings(json.data.recentBookings || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    }
    fetchStats();
  }, []);

  useEffect(() => {
    fetch("/map.svg?v=" + Date.now())
      .then((res) => res.text())
      .then((text) => {
        let adjustedText = text;
        if (!text.includes("viewBox")) {
          adjustedText = text.replace("<svg", '<svg viewBox="0 0 678 350"');
        }
        setSvgHtml(adjustedText);
      })
      .catch((err) => console.error("Error loading map SVG:", err));
  }, []);

  const formatRevenue = (val: number) => {
    if (val === 0) return "GH₵3,485k"; // Premium fallback if no database bookings yet
    if (val >= 1000) {
      return `GH₵${(val / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`;
    }
    return `GH₵${val.toLocaleString()}`;
  };

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back, Sarah. Here's what's happening across your trade operations."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button size="sm" className="gap-2 bg-[#6aabfc] hover:bg-[#6aabfc]/90 text-white border-0 font-semibold shadow-sm">
            <Plus className="w-4 h-4" /> New Lead
          </Button>
        </>
      }
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard
          label="Total Revenue"
          value={formatRevenue(stats.totalRevenue)}
          change={18.4}
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
          accent="primary"
          sparkline={[40, 55, 48, 62, 70, 65, 80, 92]}
        />
        <KpiCard
          label="Export Orders"
          value="142"
          change={12.1}
          trend="up"
          icon={<Truck className="w-5 h-5" />}
          accent="accent"
          sparkline={[30, 45, 52, 48, 60, 65, 72, 78]}
        />
        <KpiCard
          label="Active Billboards"
          value={stats.totalRevenue > 0 ? `${stats.activeBillboardsCount} / ${stats.totalBillboards}` : "8 / 10"}
          change={24.6}
          trend="up"
          icon={<Monitor className="w-5 h-5" />}
          accent="info"
          sparkline={[25, 32, 38, 42, 50, 58, 70, 82]}
        />
        <KpiCard
          label="New Enquiries"
          value="487"
          change={15.3}
          trend="up"
          icon={<MessageSquare className="w-5 h-5" />}
          accent="warm"
          sparkline={[60, 55, 62, 58, 65, 70, 68, 72]}
        />
        <KpiCard
          label="Pending Approvals"
          value={stats.totalRevenue > 0 ? stats.pendingApprovalsCount.toString() : "5"}
          change={-2.1}
          trend="down"
          icon={<ClipboardCheck className="w-5 h-5" />}
          accent="primary"
          sparkline={[15, 22, 18, 25, 30, 28, 35, 42]}
        />
        <KpiCard
          label="Total Clients"
          value="86"
          change={9.7}
          trend="up"
          icon={<Globe className="w-5 h-5" />}
          accent="accent"
          sparkline={[35, 40, 38, 45, 48, 52, 55, 60]}
        />
      </div>

      {/* Main charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 items-stretch">
        <div className="lg:col-span-2 h-full">
          <RevenueChart data={stats.monthlyData} />
        </div>
        <div className="h-full">
          <PipelineFunnelChart />
        </div>
      </div>

      {/* Sales Location & Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Most Sales Location Widget */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col h-full">
            <div className="p-5 pb-0 flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-foreground">Most Sales Location</h3>
            </div>
            <div className="p-5 flex-1 flex flex-col lg:flex-row gap-6 justify-between items-center">
              {/* Map Container */}
              <div
                className="relative w-full lg:w-[65%] h-[320px] flex items-center justify-center overflow-hidden"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                {/* Dynamic inline map rendering */}
                <div
                  className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:scale-[1.15] [&>svg_path]:fill-[#e1e7e7] [&>svg_path]:hover:fill-[#55b2b9] [&>svg_path]:transition-colors [&>svg_path]:duration-200 [&>svg_path]:cursor-pointer [&>svg_path]:stroke-background [&>svg_path]:stroke-[0.5px]"
                  dangerouslySetInnerHTML={{ __html: svgHtml }}
                />

                {/* Custom Tooltip */}
                {tooltip && (
                  <div
                    className="absolute pointer-events-none bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg z-50 transform -translate-x-1/2 -translate-y-full transition-all duration-75 ease-out"
                    style={{
                      left: tooltip.x,
                      top: tooltip.y - 10,
                    }}
                  >
                    {tooltip.name}
                  </div>
                )}
              </div>

              {/* Country List Sidebar */}
              <div className="w-full lg:w-[30%] flex flex-col">
                {countriesData.map((country, idx) => (
                  <div key={idx} className="flex items-center justify-between p-[10px] mb-[10px] last:mb-0 bg-card border border-border/80 rounded-lg transition-all duration-300 hover:bg-primary/5 hover:border-primary/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{country.name}</span>
                      <span className="text-[11px] text-muted-foreground">{country.units} Unit</span>
                    </div>
                    <div className="relative flex items-center justify-center w-11 h-11">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="22"
                          cy="22"
                          r="18"
                          className="stroke-muted-foreground/10 fill-none"
                          strokeWidth="3"
                        />
                        <circle
                          cx="22"
                          cy="22"
                          r="18"
                          stroke={country.color}
                          className="fill-none transition-all duration-1000"
                          strokeWidth="3"
                          strokeDasharray={2 * Math.PI * 18}
                          strokeDashoffset={2 * Math.PI * 18 * (1 - country.percentage / 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[9px] font-bold text-foreground">{country.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Review Widget */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden flex flex-col h-full">
            <div className="p-5 pb-0 flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-foreground">Customer Review</h3>
              <button className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary/40 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
            <div className="relative flex-1 min-h-0">
              <div className="p-5 pt-3 max-h-[325px] overflow-y-auto custom-scrollbar flex flex-col">
                {reviews.map((review, idx) => (
                  <div key={idx} className="flex items-center border-b border-border/50 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                    <div className="mr-4 flex-shrink-0">
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-[100px] h-[100px] min-w-[100px] rounded-lg object-cover border border-border/50 shadow-sm"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-sm font-bold text-foreground mb-1 leading-none">{review.name}</h5>
                      <p className="text-xs text-muted-foreground mb-2 leading-relaxed">
                        {review.comment}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-muted-foreground">Rating: ({review.rating})</span>
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-[11px] text-muted-foreground">{review.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Fade gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-card to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ProductPerformanceChart />
        <CountryDistributionChart />
        <ActivityFeed />
      </div>

      {/* Recent orders */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-display font-semibold text-base">Recent Orders</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest activity from active deals</p>
          </div>
          <Link href="/orders" className="text-xs text-accent font-medium hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border bg-[#f8f9fa] dark:bg-[#181818] transition-colors">
                <th className="font-medium px-5 py-3">Order ID</th>
                <th className="font-medium px-5 py-3">Customer</th>
                <th className="font-medium px-5 py-3">Product</th>
                <th className="font-medium px-5 py-3">Amount</th>
                <th className="font-medium px-5 py-3">Payment</th>
                <th className="font-medium px-5 py-3">Status</th>
                <th className="font-medium px-5 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {[...recentBookings, ...orders].slice(0, 8).map((o) => (
                <tr key={o.id} className="border-b border-black/10 dark:border-white/[0.06] last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-xs">{o.customer}</div>
                    <div className="text-[10px] text-muted-foreground">{o.company} · {o.country}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <div>{o.product}</div>
                    <div className="text-[10px] text-muted-foreground">{o.quantity}</div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">{o.currency} {fmt.format(o.amount)}</td>
                  <td className="px-5 py-3.5">
                    <PaymentBadge status={o.payment} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-accent" style={{ width: `${o.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground tabular-nums w-8">{o.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

