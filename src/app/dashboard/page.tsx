"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { AppLayout } from "@/components/layout/app-layout";

const BillboardMap = dynamic(() => import("@/components/dashboard/billboard-map"), { ssr: false });
import { KpiCard } from "@/components/dashboard/kpi-card";
import { RevenueChart, ProductPerformanceChart, CountryDistributionChart, PipelineFunnelChart } from "@/components/dashboard/charts";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { Button } from "@/components/ui/button";
import { kpis, orders } from "@/lib/mock-data";
import { ShoppingCart, Users, TrendingUp, Truck, Target, Download, Plus, ArrowRight, Monitor, MessageSquare, ClipboardCheck, Globe, Star, MoreHorizontal, MapPin, X } from "lucide-react";
import { CediSign as DollarSign } from "@/components/CediSign";;
import Link from "next/link";
import { PaymentBadge, StatusBadge } from "@/components/dashboard/badges";
import "./dashboard.css";


const fmt = new Intl.NumberFormat("en-US");

// Colour palette cycled per country slot
const COUNTRY_COLORS = ["#0ea5e9", "#f97316", "#eab308", "#ef4444", "#8b5cf6", "#10b981"];

const ghanaData = [
  { name: "Greater Accra", percentage: 95, units: 1200, color: "#0ea5e9" },
  { name: "Ashanti", percentage: 85, units: 950, color: "#f97316" },
  { name: "Western", percentage: 75, units: 600, color: "#eab308" },
  { name: "Northern", percentage: 70, units: 450, color: "#ef4444" },
  { name: "Central", percentage: 90, units: 800, color: "#8b5cf6" },
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
  const rounded = Math.round(rating * 2) / 2;
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
  "GH.UW": "Upper West",
  "GH.UE": "Upper East",
  "GH.NP": "Northern",
  "GH.BA": "Brong Ahafo",
  "GH.TV": "Volta",
  "GH.AH": "Ashanti",
  "GH.EP": "Eastern",
  "GH.GP": "Greater Accra",
  "GH.CP": "Central",
  "GH.WP": "Western",
  GH: "Ghana",
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
  GB: "United Kingdom", GE: "Georgia", GL: "Greenland", GM: "Gambia",
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
    customer?: string;
    productName?: string;
    quantity?: number;
    unit?: string;
    image?: string | null;
  } | null>(null);

  const [mapTab, setMapTab] = useState<"world" | "ghana" | "billboard">("world");
  const [expandedReviews, setExpandedReviews] = useState<Record<number, boolean>>({});
  const [selectedBillboard, setSelectedBillboard] = useState<{ id: number; name: string; city: string; latitude: number; longitude: number; image?: string | null; clients?: { name: string; duration: string; daysRemaining: number }[] } | null>(null);
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [showBillboardPanel, setShowBillboardPanel] = useState(false);


  const toggleReview = (id: number) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    const path = target.closest('path');
    if (path) {
      const code = path.getAttribute('data-code');
      if (code) {
        const name = countryNames[code] || code;
        const rect = e.currentTarget.getBoundingClientRect();
        const countryStats = stats.exportCountrySummary?.find((c: any) => c.code === code);
        const order = countryStats?.recentOrder;

        setTooltip({
          name,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          customer: order?.customer,
          productName: order?.productName,
          quantity: order?.quantity,
          unit: countryStats?.unit,
          image: order?.image,
        });
      } else {
        setTooltip(null);
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
    pendingOrdersCount: number;
    totalClientsCount: number;
    totalBookingsCount: number;
    monthlyData?: { month: string; Billboards: number; Honey: number; Shea: number; Cashew: number }[];
    slotStats?: {
      availableSlots: number;
      reservedSlots: number;
      activeSlots: number;
      expiredSlots: number;
      maintenanceSlots: number;
    };
    inventoryStats?: {
      totalStock: number;
      available: number;
      reserved: number;
      processing: number;
      shipped: number;
    };
    cashewInventoryStats?: {
      totalStock: number;
      available: number;
      reserved: number;
      processing: number;
      shipped: number;
    };
    exportLocations?: string[];
    exportCountrySummary?: { code: string; units: number; unit: string; revenue: number; percentage: number; share: number; recentOrder?: { customer?: string; quantity?: number; productName?: string; image?: string | null } }[];
    recentReviews?: any[];
    commodityPerformance?: { product: string; revenue: number }[];
    adPerformance?: { product: string; revenue: number }[];
    topAdLocations?: { name: string; revenue: number; share: number }[];
    activeBillboardLocations?: { id: number; name: string; city: string; latitude: number; longitude: number; image?: string | null; clients?: { name: string; duration: string; daysRemaining: number }[] }[];
  }>({
    totalRevenue: 0,
    activeBillboardsCount: 0,
    totalBillboards: 0,
    pendingApprovalsCount: 0,
    pendingOrdersCount: 0,
    totalClientsCount: 0,
    totalBookingsCount: 0,
    monthlyData: [],
    slotStats: { availableSlots: 0, reservedSlots: 0, activeSlots: 0, expiredSlots: 0, maintenanceSlots: 0 },
    exportLocations: [],
    exportCountrySummary: [],
    recentReviews: [],
    commodityPerformance: [],
    adPerformance: [],
    topAdLocations: [],
    activeBillboardLocations: []
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [svgHtml, setSvgHtml] = useState<string>("");
  const [mapMarkers, setMapMarkers] = useState<{ cx: number; cy: number; color: string; key: string }[]>([]);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const json = await res.json();
        if (json.success && json.data) {
          setStats({
            totalRevenue: json.data.totalRevenue || 0,
            activeBillboardsCount: json.data.activeBillboardsCount || 0,
            totalBillboards: json.data.totalBillboards || 0,
            pendingApprovalsCount: json.data.pendingApprovalsCount !== undefined ? json.data.pendingApprovalsCount : 0,
            pendingOrdersCount: json.data.pendingOrdersCount !== undefined ? json.data.pendingOrdersCount : 0,
            totalClientsCount: json.data.totalClientsCount || 0,
            totalBookingsCount: json.data.totalBookingsCount || 0,
            monthlyData: json.data.monthlyData,
            slotStats: json.data.slotStats,
            inventoryStats: json.data.inventoryStats,
            cashewInventoryStats: json.data.cashewInventoryStats,
            exportLocations: json.data.exportLocations || [],
            exportCountrySummary: json.data.exportCountrySummary || [],
            recentReviews: json.data.recentReviews || [],
            commodityPerformance: json.data.commodityPerformance || [],
            adPerformance: json.data.adPerformance || [],
            topAdLocations: json.data.topAdLocations || [],
            activeBillboardLocations: json.data.activeBillboardLocations || []
          });
          setRecentBookings(json.data.recentBookings || []);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      }
    }
    fetchStats();
  }, []);

  const mapCoordinates: Record<string, { cx: number, cy: number }> = {
    // Americas
    "United States": { cx: 130, cy: 155 },
    "USA": { cx: 130, cy: 155 },
    "US": { cx: 130, cy: 155 },
    "Canada": { cx: 120, cy: 100 },
    "Mexico": { cx: 115, cy: 185 },
    "Brazil": { cx: 215, cy: 255 },
    "Argentina": { cx: 200, cy: 300 },
    "Colombia": { cx: 180, cy: 215 },
    "Peru": { cx: 185, cy: 255 },
    "Chile": { cx: 190, cy: 295 },
    "Venezuela": { cx: 195, cy: 205 },
    "Cuba": { cx: 155, cy: 185 },
    "Jamaica": { cx: 160, cy: 195 },
    // Europe
    "United Kingdom": { cx: 305, cy: 118 },
    "UK": { cx: 305, cy: 118 },
    "Germany": { cx: 330, cy: 125 },
    "France": { cx: 318, cy: 132 },
    "Italy": { cx: 335, cy: 140 },
    "Spain": { cx: 308, cy: 142 },
    "Portugal": { cx: 300, cy: 142 },
    "Netherlands": { cx: 325, cy: 120 },
    "Belgium": { cx: 322, cy: 123 },
    "Switzerland": { cx: 328, cy: 132 },
    "Sweden": { cx: 340, cy: 105 },
    "Norway": { cx: 330, cy: 100 },
    "Denmark": { cx: 332, cy: 112 },
    "Finland": { cx: 348, cy: 100 },
    "Poland": { cx: 342, cy: 122 },
    "Austria": { cx: 336, cy: 128 },
    "Russia": { cx: 440, cy: 108 },
    "Ukraine": { cx: 355, cy: 125 },
    "Turkey": { cx: 370, cy: 142 },
    "Greece": { cx: 348, cy: 148 },
    // Middle East
    "Saudi Arabia": { cx: 393, cy: 168 },
    "UAE": { cx: 407, cy: 172 },
    "United Arab Emirates": { cx: 407, cy: 172 },
    "Qatar": { cx: 403, cy: 172 },
    "Kuwait": { cx: 396, cy: 162 },
    "Israel": { cx: 374, cy: 157 },
    "Jordan": { cx: 376, cy: 160 },
    "Iraq": { cx: 385, cy: 155 },
    "Iran": { cx: 400, cy: 152 },
    "Yemen": { cx: 394, cy: 182 },
    "Oman": { cx: 408, cy: 178 },
    // Africa
    "Ghana": { cx: 305, cy: 200 },
    "Nigeria": { cx: 318, cy: 198 },
    "South Africa": { cx: 340, cy: 278 },
    "Kenya": { cx: 368, cy: 215 },
    "Ethiopia": { cx: 368, cy: 202 },
    "Egypt": { cx: 355, cy: 165 },
    "Morocco": { cx: 306, cy: 158 },
    "Algeria": { cx: 315, cy: 163 },
    "Tanzania": { cx: 365, cy: 228 },
    "Senegal": { cx: 292, cy: 188 },
    "Ivory Coast": { cx: 300, cy: 202 },
    "Cameroon": { cx: 330, cy: 210 },
    // Asia
    "China": { cx: 508, cy: 152 },
    "Japan": { cx: 556, cy: 148 },
    "India": { cx: 447, cy: 172 },
    "South Korea": { cx: 545, cy: 148 },
    "Singapore": { cx: 508, cy: 215 },
    "Malaysia": { cx: 505, cy: 210 },
    "Indonesia": { cx: 525, cy: 222 },
    "Thailand": { cx: 499, cy: 195 },
    "Vietnam": { cx: 512, cy: 193 },
    "Philippines": { cx: 533, cy: 195 },
    "Pakistan": { cx: 432, cy: 162 },
    "Bangladesh": { cx: 462, cy: 172 },
    "Sri Lanka": { cx: 449, cy: 192 },
    // Oceania
    "Australia": { cx: 545, cy: 282 },
    "New Zealand": { cx: 580, cy: 308 },
  };

  // Precomputed SVG-space centers (traced from actual path data in map.svg, 678x350 coordinate space)
  // For countries with multiple subpaths (e.g. US includes Alaska), we use the mainland center only
  const svgCountryCenters: Record<string, { x: number; y: number }> = {
    "AE": { x: 556.24, y: 223 },
    "AF": { x: 586.83, y: 196.46 },
    "AL": { x: 471.45, y: 175.69 },
    "AM": { x: 533.83, y: 179.09 },
    "AO": { x: 465.66, y: 314.92 },
    "AR": { x: 261.9, y: 384.91 },
    "AT": { x: 454.08, y: 155.35 },
    "AU": { x: 755.2, y: 349.9 },
    "AZ": { x: 540.19, y: 178.83 },
    "BA": { x: 465.22, y: 167.09 },
    "BD": { x: 647.34, y: 223.93 },
    "BE": { x: 431.84, y: 146.29 },
    "BF": { x: 416.83, y: 253.73 },
    "BG": { x: 484.62, y: 170.98 },
    "BI": { x: 495.96, y: 293.35 },
    "BJ": { x: 426.67, y: 261.76 },
    "BN": { x: 708.52, y: 273.1 },
    "BO": { x: 261.86, y: 326.28 },
    "BR": { x: 284.87, y: 322.12 },
    "BS": { x: 225.74, y: 222.37 },
    "BT": { x: 647.47, y: 214.26 },
    "BW": { x: 482.54, y: 341.65 },
    "BY": { x: 490.91, y: 135.34 },
    "BZ": { x: 198.96, y: 241.45 },
    "CA": { x: 174.73, y: 118.34 },
    "CD": { x: 475.17, y: 294.99 },
    "CF": { x: 473.28, y: 267.78 },
    "CG": { x: 458, y: 286.44 },
    "CH": { x: 441.54, y: 158.34 },
    "CI": { x: 407.02, y: 266.29 },
    "CL": { x: 242.41, y: 382.19 },
    "CM": { x: 451.57, y: 266.53 },
    "CN": { x: 682.12, y: 184.98 },
    "CO": { x: 238.11, y: 274.42 },
    "CR": { x: 209.93, y: 260.42 },
    "CU": { x: 221.93, y: 230.14 },
    "CY": { x: 503.57, y: 193.88 },
    "CZ": { x: 459.75, y: 148.57 },
    "DE": { x: 447.2, y: 144 },
    "DJ": { x: 527.34, y: 255.17 },
    "DK": { x: 444.68, y: 126.8 },
    "DO": { x: 245.35, y: 237.33 },
    "DZ": { x: 425.06, y: 212.02 },
    "EC": { x: 225.46, y: 289.34 },
    "EE": { x: 485.36, y: 118.56 },
    "EG": { x: 497.79, y: 216.01 },
    "EH": { x: 387.55, y: 225.2 },
    "ER": { x: 520.23, y: 246.52 },
    "ES": { x: 413.08, y: 179.35 },
    "ET": { x: 521.89, y: 261.82 },
    "FI": { x: 486.36, y: 92.69 },
    "FJ": { x: 866.66, y: 330.01 },
    "FK": { x: 272.05, y: 427.32 },
    "FR": { x: 425.23, y: 158.24 },
    "GA": { x: 450.03, y: 286.94 },
    "GB": { x: 415.36, y: 133.24 },
    "GE": { x: 529.44, y: 172.2 },
    "GH": { x: 418.13, y: 265.04 },
    "GL": { x: 313.83, y: 56.57 },
    "GM": { x: 381.59, y: 250.88 },
    "GN": { x: 392.28, y: 259.88 },
    "GQ": { x: 446.76, y: 280.71 },
    "GR": { x: 479.48, y: 181.75 },
    "GT": { x: 194.71, y: 245 },
    "GW": { x: 382.96, y: 255.04 },
    "GY": { x: 273.21, y: 272.82 },
    "HN": { x: 204.84, y: 248.34 },
    "HR": { x: 462.96, y: 164.85 },
    "HT": { x: 239.46, y: 236.75 },
    "HU": { x: 469.72, y: 157.09 },
    "ID": { x: 761.13, y: 296.56 },
    "IE": { x: 401.02, y: 136.8 },
    "IL": { x: 508.2, y: 204.9 },
    "IN": { x: 628.35, y: 228.54 },
    "IQ": { x: 530.06, y: 198.32 },
    "IR": { x: 555.45, y: 200.41 },
    "IS": { x: 373.5, y: 93.57 },
    "IT": { x: 452.54, y: 171.27 },
    "JM": { x: 227.39, y: 239.04 },
    "JO": { x: 513.73, y: 204 },
    "JP": { x: 760.74, y: 189.78 },
    "KE": { x: 515.61, y: 283.83 },
    "KG": { x: 608.37, y: 175.24 },
    "KH": { x: 683.83, y: 253.4 },
    "KP": { x: 740.14, y: 178.08 },
    "KR": { x: 741.01, y: 189.39 },
    "KW": { x: 539.94, y: 209.43 },
    "KZ": { x: 588.52, y: 153.5 },
    "LA": { x: 681.06, y: 238.78 },
    "LB": { x: 510.82, y: 196.75 },
    "LK": { x: 623.14, y: 265.19 },
    "LR": { x: 397.23, y: 268.77 },
    "LS": { x: 491.48, y: 361.36 },
    "LT": { x: 480.62, y: 130.72 },
    "LU": { x: 435.88, y: 148.78 },
    "LV": { x: 482.57, y: 124.86 },
    "LY": { x: 464.15, y: 216.95 },
    "MA": { x: 398.23, y: 210.91 },
    "MD": { x: 491.9, y: 157.66 },
    "ME": { x: 469.5, y: 170.75 },
    "MG": { x: 538.3, y: 332.92 },
    "MK": { x: 475.3, y: 174.35 },
    "ML": { x: 411.08, y: 240.24 },
    "MM": { x: 663.21, y: 235.46 },
    "MN": { x: 680.83, y: 157.84 },
    "MR": { x: 393.05, y: 231.41 },
    "MW": { x: 506.69, y: 317.71 },
    "MX": { x: 165.7, y: 223.9 },
    "MY": { x: 707.52, y: 275.22 },
    "MZ": { x: 509.78, y: 332.25 },
    "NA": { x: 462.5, y: 343.71 },
    "NC": { x: 835.54, y: 338.9 },
    "NE": { x: 441.19, y: 240.09 },
    "NG": { x: 442.55, y: 262.11 },
    "NI": { x: 207.28, y: 252.45 },
    "NL": { x: 434.31, y: 140.73 },
    "NO": { x: 466.06, y: 93.61 },
    "NP": { x: 631.58, y: 211.81 },
    "NZ": { x: 860.67, y: 385.16 },
    "OM": { x: 561.02, y: 231.98 },
    "PA": { x: 220.39, y: 263.76 },
    "PE": { x: 233.04, y: 308.2 },
    "PG": { x: 786.22, y: 301.62 },
    "PH": { x: 726.49, y: 245.55 },
    "PK": { x: 594.87, y: 205.94 },
    "PL": { x: 468.72, y: 141.31 },
    "PR": { x: 254.6, y: 238.73 },
    "PS": { x: 509.29, y: 201.97 },
    "PT": { x: 400.97, y: 180.33 },
    "PY": { x: 274.52, y: 344.77 },
    "QA": { x: 549.11, y: 220.06 },
    "RO": { x: 483.56, y: 160.9 },
    "RS": { x: 473.31, y: 166.28 },
    "RU": { x: 693.15, y: 105.22 },
    "RW": { x: 495.9, y: 290 },
    "SA": { x: 534.04, y: 222.46 },
    "SB": { x: 819.86, y: 305.02 },
    "SD": { x: 496.46, y: 246.08 },
    "SE": { x: 464.61, y: 103.16 },
    "SI": { x: 458.77, y: 160.38 },
    "SK": { x: 470.23, y: 152.43 },
    "SL": { x: 391.33, y: 263.74 },
    "SN": { x: 384.65, y: 248.41 },
    "SO": { x: 536.28, y: 271.75 },
    "SR": { x: 280.66, y: 275.05 },
    "SS": { x: 495.25, y: 265.08 },
    "SV": { x: 198.33, y: 250.15 },
    "SY": { x: 518.55, y: 194.16 },
    "SZ": { x: 499.51, y: 352.8 },
    "TD": { x: 467.84, y: 245.74 },
    "TF": { x: 595.31, y: 419.23 },
    "TG": { x: 423.18, y: 263.58 },
    "TH": { x: 675.15, y: 244.16 },
    "TJ": { x: 599.29, y: 182.44 },
    "TL": { x: 736.7, y: 307.01 },
    "TM": { x: 570.27, y: 181.83 },
    "TN": { x: 444.77, y: 196.62 },
    "TR": { x: 509.79, y: 181.99 },
    "TT": { x: 267.34, y: 258.63 },
    "TW": { x: 724, y: 224.44 },
    "TZ": { x: 508.35, y: 300.89 },
    "UA": { x: 498.82, y: 153.16 },
    "UG": { x: 501.85, y: 281.44 },
    "US": { x: 180.99, y: 185.42 },
    "UY": { x: 281.12, y: 369.36 },
    "UZ": { x: 582.25, y: 174.77 },
    "VE": { x: 254.3, y: 268.79 },
    "VN": { x: 685.84, y: 244.29 },
    "VU": { x: 838.94, y: 323.25 },
    "YE": { x: 540.85, y: 244.95 },
    "ZA": { x: 482.47, y: 358.43 },
    "ZM": { x: 490.27, y: 317.91 },
    "ZW": { x: 493.84, y: 332.82 },
  };

  // We will inject markers + trade route lines natively into the SVG string before rendering
  const getSvgWithMarkers = () => {
    if (!svgHtml) return { __html: "" };
    let modifiedSvg = svgHtml;

    if (mapTab === "world") {
      let linesHtml = "";
      let markersHtml = "";

      // Ghana origin marker (gold) — always the single source
      const gh = svgCountryCenters["GH"];
      if (gh) {
        markersHtml += `<circle cx="${gh.x}" cy="${gh.y}" r="4" fill="#0ea5e9" fill-opacity="1" stroke="#0ea5e9" stroke-width="8" stroke-opacity="0.22" pointer-events="none"></circle>`;
      }

      // Name → ISO code lookup
      const nameToCode: Record<string, string> = {
        "United States": "US", "USA": "US", "United Kingdom": "GB", "UK": "GB",
        "Germany": "DE", "France": "FR", "Italy": "IT", "Spain": "ES", "Portugal": "PT",
        "Netherlands": "NL", "Belgium": "BE", "Switzerland": "CH", "Sweden": "SE",
        "Norway": "NO", "Denmark": "DK", "Finland": "FI", "Poland": "PL",
        "Austria": "AT", "Russia": "RU", "Ukraine": "UA", "Turkey": "TR", "Greece": "GR",
        "Saudi Arabia": "SA", "UAE": "AE", "United Arab Emirates": "AE", "Qatar": "QA",
        "Kuwait": "KW", "Israel": "IL", "Jordan": "JO", "Iraq": "IQ", "Iran": "IR",
        "Yemen": "YE", "Oman": "OM", "Nigeria": "NG", "South Africa": "ZA",
        "Kenya": "KE", "Ethiopia": "ET", "Egypt": "EG", "Morocco": "MA",
        "Algeria": "DZ", "Tanzania": "TZ", "Senegal": "SN", "Ivory Coast": "CI",
        "Cameroon": "CM", "Ghana": "GH", "China": "CN", "Japan": "JP", "India": "IN",
        "South Korea": "KR", "Singapore": "SG", "Malaysia": "MY", "Indonesia": "ID",
        "Thailand": "TH", "Vietnam": "VN", "Philippines": "PH", "Pakistan": "PK",
        "Bangladesh": "BD", "Sri Lanka": "LK", "Australia": "AU", "New Zealand": "NZ",
        "Canada": "CA", "Mexico": "MX", "Brazil": "BR", "Argentina": "AR",
        "Colombia": "CO", "Chile": "CL", "Peru": "PE",
      };

      (stats.exportLocations || []).forEach((country) => {
        const code = nameToCode[country] || country;
        if (!code || !svgCountryCenters[code]) return;
        const dest = svgCountryCenters[code];

        // Determine marker colour from the product going to this destination
        const summary = (stats.exportCountrySummary || []).find(s => s.code === code);
        const pName = (summary?.recentOrder?.productName || '').toLowerCase();
        const markerColor = pName.includes('honey') ? '#eea000' : pName.includes('cashew') ? '#9c4921' : '#0ea5e9';

        // ── Curved dashed trade-route arc from Ghana → destination ──
        if (gh) {
          const dx = dest.x - gh.x;
          const dy = dest.y - gh.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const midX = (gh.x + dest.x) / 2;
          const midY = (gh.y + dest.y) / 2;

          // Perpendicular unit vector — pick the direction that arcs northward (lower Y)
          const perpX1 = -dy / dist;
          const perpY1 =  dx / dist;
          const curveAmount = dist * 0.30; // 30% of chord = gentle arc

          let cpX = midX + perpX1 * curveAmount;
          let cpY = midY + perpY1 * curveAmount;
          // If control point is south of midpoint, flip to guarantee northward arc
          if (cpY > midY) {
            cpX = midX - perpX1 * curveAmount;
            cpY = midY - perpY1 * curveAmount;
          }

          const pathD = `M ${gh.x},${gh.y} Q ${cpX.toFixed(1)},${cpY.toFixed(1)} ${dest.x},${dest.y}`;

          // Layer 1 — static faint trail so the full arc is always visible
          linesHtml += `<path d="${pathD}" fill="none" stroke="#969ba4" stroke-width="1.2" stroke-dasharray="5,5" stroke-opacity="0.25" stroke-linecap="round"/>`;

          // Layer 2 — animated flowing dashes
          linesHtml += `<path d="${pathD}" fill="none" stroke="#969ba4" stroke-width="1.8" stroke-dasharray="8,6" stroke-opacity="0.85" stroke-linecap="round"><animate attributeName="stroke-dashoffset" from="14" to="0" dur="0.5s" repeatCount="indefinite"/></path>`;
        }

        // Destination marker coloured by product (pointer-events="none" so hover passes through to the path)
        markersHtml += `<circle cx="${dest.x}" cy="${dest.y}" r="4" fill="${markerColor}" fill-opacity="1" stroke="${markerColor}" stroke-width="8" stroke-opacity="0.22" pointer-events="none"></circle>`;
      });

      // Inject: lines first (behind), then markers (on top) — both INSIDE transform group
      modifiedSvg = modifiedSvg.replace(
        "</g></svg>",
        `<g class="map-trade-lines">${linesHtml}</g><g class="map-markers">${markersHtml}</g></g></svg>`
      );
    }

    return { __html: modifiedSvg };
  };

  useEffect(() => {
    const filename = mapTab === "world" ? "map.svg" : "ghana_map.svg";
    if (mapTab === "billboard") return; // Skip fetching SVGs for billboard map
    
    fetch(`/${filename}?v=` + Date.now())
      .then((res) => res.text())
      .then((text) => {
        setMapMarkers([]); // reset while loading
        setSvgHtml(text);
      })
      .catch((err) => console.error("Error loading map SVG:", err));
  }, [mapTab]);


  useEffect(() => {
    if (mapTab === "billboard" && !selectedBillboard && stats.activeBillboardLocations && stats.activeBillboardLocations.length > 0) {
      setSelectedBillboard(stats.activeBillboardLocations[0]);
    }
  }, [mapTab, stats.activeBillboardLocations, selectedBillboard]);

  const formatRevenue = (val: number) => {
    if (val === 0) return "GH₵ 0";
    if (val >= 1000) {
      return `GH₵ ${(val / 1000).toLocaleString(undefined, { maximumFractionDigits: 1 })}k`;
    }
    return `GH₵ ${val.toLocaleString()}`;
  };

  // Build dynamic world sidebar from live export order data
  const worldSidebarData = (stats.exportCountrySummary || []).map((item, idx) => ({
    name: countryNames[item.code] || item.code,
    units: item.units,
    unit: item.unit || 'units',
    percentage: item.percentage,
    color: COUNTRY_COLORS[idx % COUNTRY_COLORS.length],
  }));

  const activeSidebarData = mapTab === "world" ? worldSidebarData : (mapTab === "ghana" ? ghanaData : []);

  // Build data for the Top Export Markets pie chart
  const exportPieData = (stats.exportCountrySummary || []).map((item) => ({
    name: countryNames[item.code] || item.code,
    revenue: item.revenue ?? 0,
    share: item.share ?? 0,
  }));

  return (
    <AppLayout
      title="Dashboard"
      subtitle="Welcome back, Sarah. Here's what's happening across your trade operations."
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <KpiCard
          label="Total Revenue"
          value={formatRevenue(stats.totalRevenue)}
          tooltip={stats.totalRevenue > 0 ? `GH₵ ${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : undefined}
          change={18.4}
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
          accent="primary"
          sparkline={[40, 55, 48, 62, 70, 65, 80, 92]}
        />
        <KpiCard
          label="Export Orders"
          value={stats.totalBookingsCount.toString()}
          change={12.1}
          trend="up"
          icon={<Truck className="w-5 h-5" />}
          accent="accent"
          sparkline={[30, 45, 52, 48, 60, 65, 72, 78]}
        />
        <KpiCard
          label="Active Billboards"
          value={`${stats.activeBillboardsCount} / ${stats.totalBillboards}`}
          change={24.6}
          trend="up"
          icon={<Monitor className="w-5 h-5" />}
          accent="info"
          sparkline={[25, 32, 38, 42, 50, 58, 70, 82]}
        />
        <KpiCard
          label="Pending Orders (Trade)"
          value={String(stats.pendingOrdersCount || 0)}
          change={15.3}
          trend="up"
          icon={<MessageSquare className="w-5 h-5" />}
          accent="warm"
          sparkline={[60, 55, 62, 58, 65, 70, 68, 72]}
        />
        <KpiCard
          label="Pending Approvals (Billboard)"
          value={stats.pendingApprovalsCount.toString()}
          change={-2.1}
          trend="down"
          icon={<ClipboardCheck className="w-5 h-5" />}
          accent="primary"
          sparkline={[15, 22, 18, 25, 30, 28, 35, 42]}
        />
        <KpiCard
          label="Total Clients"
          value={stats.totalClientsCount.toString()}
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
          <PipelineFunnelChart slotStats={stats.slotStats} inventoryStats={stats.inventoryStats} cashewInventoryStats={stats.cashewInventoryStats} />
        </div>
      </div>

      {/* Sales Location & Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Most Sales Location Widget */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border shadow-card overflow-visible flex flex-col h-full">
            <div className="p-5 pb-0 flex items-center justify-between">
              <h3 className="font-display font-semibold text-base text-foreground">
                {mapTab === "billboard" ? "Active Billboard Location" : "Most Sales Location"}
              </h3>
              <div className="flex bg-secondary p-1 rounded-lg border border-border shrink-0 select-none">
                <button
                  onClick={() => setMapTab("world")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${mapTab === "world"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  World Map
                </button>
                <button
                  onClick={() => setMapTab("ghana")}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${mapTab === "ghana"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Ghana Map
                </button>
                <button
                  onClick={() => {
                    setMapTab("billboard");
                    setShowClientsModal(false);
                    setShowBillboardPanel(false);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all duration-200 ${mapTab === "billboard"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  Billboard Map
                </button>
              </div>
            </div>
            <div className="p-5 flex-1 flex flex-col lg:flex-row gap-6 justify-between items-center">
              {/* Map Container */}
              <div
                className={`relative w-full h-[400px] flex items-center justify-center overflow-visible transition-all duration-300 ${mapTab === "billboard" ? (showBillboardPanel ? "lg:w-[60%]" : "lg:w-full") : "lg:w-[65%]"}`}
                onMouseMove={mapTab !== "billboard" ? handleMouseMove : undefined}
                onMouseLeave={mapTab !== "billboard" ? handleMouseLeave : undefined}
              >
                <style dangerouslySetInnerHTML={{
                  __html: `
                  path[data-code] {
                    fill: #e1e7e7 !important;
                    transition: fill 0.2s ease;
                    cursor: pointer;
                    stroke: #FFFFFF !important;
                    stroke-width: 0.5px !important;
                  }
                  path[data-code]:hover {
                    fill: #55b2b9 !important;
                  }
                  .dark path[data-code] {
                    fill: #3f4145 !important;
                    stroke: #282828 !important;
                  }
                  .dark path[data-code]:hover {
                    fill: #55b2b9 !important;
                  }
                `}} />
                {mapTab === "billboard" ? (
                  <div className="w-full h-full rounded-lg overflow-hidden border border-border shadow-sm bg-muted/20 relative">
                    {true ? (
                      <BillboardMap
                        locations={stats.activeBillboardLocations || []}
                        selectedId={selectedBillboard?.id ?? null}
                        onMarkerClick={(b) => {
                          setSelectedBillboard(b);
                          setShowBillboardPanel(true);
                        }}
                      />
                    ) : (
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4047271.299908127!2d-3.391295988350029!3d7.953507963248386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed14ed8650e2dd3!2sGhana!5e0!3m2!1sen!2sgh!4v1717596000000!5m2!1sen!2sgh"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    )}
                  </div>
                ) : (
                  <div
                    className={`w-full h-full [&>svg]:w-full [&>svg]:h-full ${mapTab === "world" ? "[&>svg]:scale-[1.15] [&>svg]:translate-x-20" : "[&>svg]:scale-[1.05]"
                      }`}
                    dangerouslySetInnerHTML={getSvgWithMarkers()}
                  />
                )}

                {/* Custom Tooltip */}
                {tooltip && (
                  tooltip.customer ? (
                    <div
                      className="absolute pointer-events-none bg-popover/95 backdrop-blur-sm border border-border text-foreground text-xs rounded-xl shadow-xl z-50 transform -translate-x-1/2 -translate-y-[calc(100%+15px)] transition-all duration-75 ease-out min-w-[200px] overflow-hidden"
                      style={{
                        left: tooltip.x,
                        top: tooltip.y,
                      }}
                    >
                      <div className="bg-primary/10 px-3 py-2 border-b border-border font-semibold flex items-center justify-between">
                        <span>{tooltip.name}</span>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-3">
                          {tooltip.image ? (
                            <img src={tooltip.image} alt={tooltip.productName} className="w-10 h-10 rounded-md object-cover border border-border shadow-sm shrink-0 bg-white" />
                          ) : (
                            <div className="w-10 h-10 rounded-md bg-secondary border border-border flex items-center justify-center shrink-0 shadow-sm">
                              <span className="text-[10px] font-bold text-muted-foreground">{tooltip.productName?.substring(0, 2).toUpperCase()}</span>
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-[13px]">{tooltip.customer}</div>
                            <div className="text-muted-foreground mt-0.5">
                              {tooltip.quantity} {tooltip.unit} of {tooltip.productName}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="absolute pointer-events-none bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg z-50 transform -translate-x-1/2 -translate-y-full transition-all duration-75 ease-out"
                      style={{
                        left: tooltip.x,
                        top: tooltip.y - 10,
                      }}
                    >
                      {tooltip.name}
                    </div>
                  )
                )}

              </div>

              {/* Country List Sidebar */}
              <div className={`w-full flex flex-col transition-all duration-300 ${mapTab === "billboard" ? (showBillboardPanel ? "lg:w-[38%] h-[400px]" : "hidden") : "lg:w-[30%]"}`}>
                {activeSidebarData.length === 0 && mapTab === "world" && (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                    <span className="text-muted-foreground text-xs">No approved export orders yet</span>
                  </div>
                )}
                {mapTab === "billboard" && (!stats.activeBillboardLocations || stats.activeBillboardLocations.length === 0) && (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                    <span className="text-muted-foreground text-xs">No active billboards found</span>
                  </div>
                )}
                {mapTab === "billboard" && (!stats.activeBillboardLocations || stats.activeBillboardLocations.length === 0) && (
                  <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                    <span className="text-muted-foreground text-xs">No active billboards found</span>
                  </div>
                )}
                {mapTab === "billboard" && selectedBillboard && showBillboardPanel && (
                  <div className="flex flex-col h-full bg-card rounded-xl border border-border overflow-hidden shadow-sm">
                    {stats.activeBillboardLocations && stats.activeBillboardLocations.length > 1 && (
                      <div className="p-3 border-b border-border bg-muted/20">
                        <select
                          className="w-full p-2.5 rounded-lg border border-border bg-card text-sm font-medium outline-none focus:border-primary"
                          value={selectedBillboard.id}
                          onChange={(e) => {
                            const b = stats.activeBillboardLocations?.find((b: any) => b.id.toString() === e.target.value);
                            if (b) setSelectedBillboard(b);
                          }}
                        >
                          {stats.activeBillboardLocations.map((b: any) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="p-3 border-b border-border flex justify-between items-center bg-muted/30">
                      <div className="flex items-center gap-3">
                        <img 
                          src={selectedBillboard.image || "/billboards/bill_boards 3.webp"} 
                          alt={selectedBillboard.name} 
                          className="w-12 h-12 rounded-md object-cover border border-border bg-white" 
                          onError={(e) => {
                            e.currentTarget.src = "/billboards/bill_boards 3.webp";
                          }}
                        />
                        <div>
                          <h3 className="text-sm font-bold text-foreground leading-tight">{selectedBillboard.name}</h3>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {selectedBillboard.city} — Active Bookings
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setShowBillboardPanel(false)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground shrink-0">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-0 overflow-y-auto custom-scrollbar flex-1 bg-card">
                      {selectedBillboard.clients && selectedBillboard.clients.length > 0 ? (
                        <table className="w-full text-left">
                          <thead className="bg-muted text-muted-foreground text-[11px] uppercase tracking-wider border-b border-border sticky top-0 z-10">
                            <tr>
                              <th className="px-3 py-2 font-semibold">Client Name</th>
                              <th className="px-3 py-2 font-semibold">Duration</th>
                              <th className="px-3 py-2 font-semibold text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {selectedBillboard.clients.map((client: any, idx: number) => (
                              <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                <td className="px-3 py-2.5 font-medium text-foreground text-xs leading-tight">{client.name}</td>
                                <td className="px-3 py-2.5 text-muted-foreground text-[10px] whitespace-normal leading-tight min-w-[70px] max-w-[80px] break-words">{client.duration}</td>
                                <td className="px-3 py-2.5 text-right">
                                  <div className="flex flex-col items-end gap-1">
                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary/15 text-primary uppercase tracking-wider">Active</span>
                                    <span className="text-[10px] font-bold text-[#fe9a00] whitespace-nowrap">{client.daysRemaining} day{client.daysRemaining !== 1 ? 's' : ''} left</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-center py-12 flex flex-col items-center justify-center bg-muted/10 h-full">
                          <Users className="w-10 h-10 text-muted-foreground mb-3 opacity-20" />
                          <p className="text-muted-foreground text-sm">No active clients found for this billboard.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {mapTab !== "billboard" && activeSidebarData.map((country, idx) => (
                  <div key={idx} className="flex items-center justify-between p-[10px] mb-[10px] last:mb-0 bg-card border border-border/80 dark:border-[#3a3a3a] rounded-lg transition-all duration-300 hover:bg-primary/5 hover:border-primary/5">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-foreground">{country.name}</span>
                      <span className="text-[11px] text-muted-foreground">{country.units} {(country as any).unit ?? 'Units'}</span>
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
              <div className="p-5 pt-3 max-h-[405px] overflow-y-auto custom-scrollbar flex flex-col">
                {(stats.recentReviews || []).length > 0 ? (stats.recentReviews || []).map((review, idx) => {
                  const isLong = review.comment.length > 100;
                  const isExpanded = expandedReviews[review.id];
                  return (
                    <div key={review.id} className="flex items-center border-b border-border/50 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                      <div className="mr-4 flex-shrink-0 self-start mt-1">
                        <img
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.authorName)}&background=random`}
                          alt={review.authorName}
                          className="w-[50px] h-[50px] min-w-[50px] rounded-full object-cover border border-border/50 shadow-sm"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-bold text-foreground mb-1 leading-none">{review.authorName}</h5>
                        <p className="text-xs text-muted-foreground mb-2 leading-relaxed whitespace-pre-wrap">
                          {isExpanded || !isLong ? review.comment : `${review.comment.substring(0, 100)}... `}
                          {isLong && (
                            <button
                              onClick={() => toggleReview(review.id)}
                              className="text-[#0ea5e9] font-semibold hover:underline ml-1"
                            >
                              {isExpanded ? "Show less" : "Read more"}
                            </button>
                          )}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-muted-foreground">Rating: ({review.rating})</span>
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-[11px] text-muted-foreground">
                            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">No reviews yet</div>
                )}
              </div>
              {/* Fade gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-card to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <ProductPerformanceChart 
          commodityData={stats.commodityPerformance} 
          adData={stats.adPerformance} 
        />
        <CountryDistributionChart exportData={exportPieData} adLocationData={stats.topAdLocations} />
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
              {recentBookings.map((o) => (
                <tr key={o.id} className="border-b border-black/10 dark:border-white/[0.06] last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-xs font-semibold">{o.id}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-medium text-xs">{o.customer}</div>
                    <div className="text-[10px] text-muted-foreground">{o.company} · {o.country}</div>
                  </td>
                  <td className="px-5 py-3.5 text-xs">
                    <div className="flex items-center gap-3">
                      <img 
                        src={o.image || (o.type === "billboard" ? "/billboards/bill_boards 3.webp" : 
                                         o.product.toLowerCase().includes("cashew") ? "/cashew.png" : 
                                         o.product.toLowerCase().includes("shea") ? "/shea_butter.png" : 
                                         "/honey.png")} 
                        alt={o.product} 
                        className="w-9 h-9 rounded-md object-cover border border-border shadow-sm shrink-0 bg-white" 
                        onError={(e) => {
                          e.currentTarget.src = o.type === "billboard" ? "/billboards/bill_boards 3.webp" : 
                                                o.product.toLowerCase().includes("cashew") ? "/cashew.png" : 
                                                o.product.toLowerCase().includes("shea") ? "/shea_butter.png" : 
                                                "/honey.png";
                        }}
                      />
                      <div>
                        <div className="font-medium text-foreground">{o.product}</div>
                        <div className="text-[10px] text-muted-foreground">{o.quantity}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums text-xs">{o.currency} {fmt.format(o.amount)}</td>
                  <td className="px-5 py-3.5">
                    <PaymentBadge status={o.payment} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {String(o.status).toLowerCase().includes("pending") ? (
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-full border border-amber-200/20">
                        Pending Approval
                      </span>
                    ) : o.type === "export" ? (
                      <span className="text-xs font-semibold capitalize text-muted-foreground">{o.status}</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-accent" style={{ width: `${o.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-muted-foreground tabular-nums w-8">{o.progress}%</span>
                      </div>
                    )}
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

