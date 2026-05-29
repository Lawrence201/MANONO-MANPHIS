// Mock data for the trade management system

export const products = [
  { id: "p1", name: "Premium Honey", category: "Honey", grade: "Premium", stock: 12500, reserved: 3200, unit: "kg" },
  { id: "p2", name: "Raw Wild Honey", category: "Honey", grade: "Standard", stock: 8400, reserved: 1800, unit: "kg" },
  { id: "p3", name: "W320 Cashew Nuts", category: "Cashew", grade: "Premium", stock: 24000, reserved: 8500, unit: "kg" },
  { id: "p4", name: "W240 Cashew Nuts", category: "Cashew", grade: "Premium", stock: 18000, reserved: 5200, unit: "kg" },
  { id: "p5", name: "Refined Shea Butter", category: "Shea", grade: "Premium", stock: 6800, reserved: 1500, unit: "kg" },
  { id: "p6", name: "Raw Shea Butter", category: "Shea", grade: "Standard", stock: 4200, reserved: 900, unit: "kg" },
];

export const kpis = {
  revenue: { value: 2_847_350, change: 18.4, trend: "up" as const },
  activeOrders: { value: 142, change: 12.1, trend: "up" as const },
  totalLeads: { value: 487, change: 24.6, trend: "up" as const },
  conversionRate: { value: 34.2, change: -2.1, trend: "down" as const },
  pendingShipments: { value: 28, change: 4.3, trend: "up" as const },
  avgDealSize: { value: 48_200, change: 9.7, trend: "up" as const },
};

export const revenueData = [
  { month: "Jan", revenue: 185000, orders: 24, leads: 38 },
  { month: "Feb", revenue: 220000, orders: 31, leads: 42 },
  { month: "Mar", revenue: 198000, orders: 28, leads: 45 },
  { month: "Apr", revenue: 285000, orders: 38, leads: 52 },
  { month: "May", revenue: 312000, orders: 42, leads: 61 },
  { month: "Jun", revenue: 298000, orders: 39, leads: 58 },
  { month: "Jul", revenue: 365000, orders: 47, leads: 67 },
  { month: "Aug", revenue: 410000, orders: 53, leads: 72 },
  { month: "Sep", revenue: 388000, orders: 49, leads: 68 },
  { month: "Oct", revenue: 445000, orders: 58, leads: 81 },
  { month: "Nov", revenue: 482000, orders: 62, leads: 85 },
  { month: "Dec", revenue: 528000, orders: 68, leads: 92 },
];

export const productPerformance = [
  { product: "Premium Honey", revenue: 850000, units: 28000, growth: 22 },
  { product: "Raw Honey", revenue: 420000, units: 18500, growth: 14 },
  { product: "W320 Cashew", revenue: 1_250_000, units: 95000, growth: 31 },
  { product: "W240 Cashew", revenue: 890000, units: 65000, growth: 18 },
  { product: "Refined Shea", revenue: 480000, units: 16000, growth: 27 },
  { product: "Raw Shea", revenue: 240000, units: 12000, growth: 9 },
];

export const countryData = [
  { country: "Germany", code: "DE", revenue: 685000, orders: 42, share: 24 },
  { country: "United States", code: "US", revenue: 542000, orders: 38, share: 19 },
  { country: "France", code: "FR", revenue: 428000, orders: 31, share: 15 },
  { country: "United Kingdom", code: "GB", revenue: 385000, orders: 28, share: 13.5 },
  { country: "Netherlands", code: "NL", revenue: 295000, orders: 22, share: 10.4 },
  { country: "UAE", code: "AE", revenue: 248000, orders: 18, share: 8.7 },
  { country: "Japan", code: "JP", revenue: 165000, orders: 12, share: 5.8 },
  { country: "Others", code: "XX", revenue: 99350, orders: 9, share: 3.6 },
];

export const pipelineFunnel = [
  { stage: "New Leads", value: 487, fill: "var(--chart-1)" },
  { stage: "Contacted", value: 342, fill: "var(--chart-2)" },
  { stage: "Qualified", value: 218, fill: "var(--chart-3)" },
  { stage: "Negotiating", value: 124, fill: "var(--chart-4)" },
  { stage: "Won", value: 78, fill: "var(--chart-5)" },
];

export type LeadStage = "new" | "contacted" | "qualified" | "negotiating" | "won" | "lost";

export interface Lead {
  id: string;
  name: string;
  company: string;
  country: string;
  email: string;
  phone: string;
  product: string;
  quantity: string;
  budget: string;
  stage: LeadStage;
  assignedTo: string;
  initials: string;
  date: string;
  tags: string[];
  value: number;
}

export const leads: Lead[] = [
  { id: "L-2841", name: "Hans Mueller", company: "Bremen Trading GmbH", country: "Germany", email: "h.mueller@bremen-trading.de", phone: "+49 421 555-0123", product: "Premium Honey", quantity: "5,000 kg", budget: "GH₵ 45-50k", stage: "negotiating", assignedTo: "Sarah Chen", initials: "HM", date: "2 days ago", tags: ["Hot", "VIP"], value: 47500 },
  { id: "L-2840", name: "Yuki Tanaka", company: "Osaka Imports Co.", country: "Japan", email: "tanaka@osaka-imports.jp", phone: "+81 6 6555 0188", product: "W320 Cashew", quantity: "20,000 kg", budget: "GH₵ 240k", stage: "qualified", assignedTo: "James Okoro", initials: "YT", date: "3 days ago", tags: ["Bulk"], value: 240000 },
  { id: "L-2839", name: "Marie Dubois", company: "Provence Naturals", country: "France", email: "marie@provence-naturals.fr", phone: "+33 4 91 555 042", product: "Refined Shea", quantity: "2,500 kg", budget: "GH₵ 28k", stage: "new", assignedTo: "Sarah Chen", initials: "MD", date: "5 hours ago", tags: ["New"], value: 28000 },
  { id: "L-2838", name: "John Whitman", company: "Atlantic Foods Inc.", country: "USA", email: "j.whitman@atlanticfoods.com", phone: "+1 212 555-0167", product: "W240 Cashew", quantity: "15,000 kg", budget: "GH₵ 210k", stage: "contacted", assignedTo: "James Okoro", initials: "JW", date: "1 day ago", tags: ["Repeat"], value: 210000 },
];

export type OrderStatus = "processing" | "ready" | "in_transit" | "delivered" | "pending";
export type PaymentStatus = "pending" | "partial" | "paid" | "overdue";

export interface Order {
  id: string;
  customer: string;
  company: string;
  country: string;
  product: string;
  quantity: string;
  amount: number;
  currency: string;
  payment: PaymentStatus;
  status: OrderStatus;
  shipping: "Air" | "Sea" | "Courier";
  date: string;
  eta: string;
  progress: number;
}

export const orders: Order[] = [
  { id: "ORD-9847", customer: "Hans Mueller", company: "Bremen Trading GmbH", country: "Germany", product: "Premium Honey", quantity: "5,000 kg", amount: 47500, currency: "USD", payment: "partial", status: "processing", shipping: "Sea", date: "2024-12-15", eta: "2025-01-08", progress: 35 },
  { id: "ORD-9846", customer: "Ahmed Al-Rashid", company: "Gulf Trade LLC", country: "UAE", product: "Premium Honey", quantity: "8,000 kg", amount: 72000, currency: "USD", payment: "paid", status: "in_transit", shipping: "Air", date: "2024-12-10", eta: "2024-12-28", progress: 75 },
];

export const recentActivities = [
  { id: 1, type: "payment", text: "Payment of GH₵ 72,000 received from Gulf Trade LLC", time: "12 minutes ago", icon: "payment" },
  { id: 2, type: "lead", text: "New lead from Provence Naturals (France) — Refined Shea", time: "5 hours ago", icon: "lead" },
];

export const shipments = orders.filter(o => o.status === "in_transit" || o.status === "ready" || o.status === "processing");

export const complianceDocs = [
  { id: "DOC-1042", name: "Certificate of Origin — ORD-9847", type: "Certificate of Origin", orderRef: "ORD-9847", country: "Germany", issuedBy: "Ghana Chamber of Commerce", issueDate: "2024-12-15", expiryDate: "2025-06-15", status: "valid", size: "2.4 MB" },
];

export const systemUsers = [
  { id: "U-01", name: "Sarah Chen", email: "sarah@terranova.io", role: "Admin", status: "active", initials: "SC", lastActive: "Online now", permissions: 32 },
];

export const rolePermissions = [
  { role: "Admin", users: 1, capabilities: ["Full system access"], color: "destructive" },
];

export const activityLogs = [
  { id: "A-9921", user: "Sarah Chen", initials: "SC", action: "Approved quotation", module: "Quotations", target: "QT-1184", timestamp: "2 minutes ago", ip: "41.66.218.14", type: "approve" },
];

export const regions = [
  { code: "DE", name: "Germany", flag: "🇩🇪", region: "Europe", status: "active", buyers: 14, revenue: 685000, shippingZone: "Zone A", duty: 0, currency: "EUR", leadTime: "18-22 days" },
];

export const shippingRules = [
  { id: "SR-01", name: "EU Sea Standard", zone: "Zone A", method: "Sea Freight", minWeight: 1000, maxWeight: 25000, baseRate: 850, perKg: 0.45, transitDays: "16-22", active: true },
];

export const notifications = [
  { id: "N-1", category: "payment", title: "Payment received", message: "GH₵ 72,000 from Gulf Trade LLC for ORD-9846", time: "12 min ago", read: false, priority: "high" },
];

export const workflows = [
  { id: "W-01", name: "Auto-advance qualified leads", trigger: "Lead receives 2nd email reply", action: "Move stage → Qualified", active: true, runs: 142, lastRun: "1 hour ago", successRate: 96 },
];

export const commThreads = [
  { id: "C-1", customer: "Hans Mueller", initials: "HM", channel: "email", subject: "Re: Contract terms", preview: "Thanks Sarah...", agent: "Sarah Chen", time: "12 min ago", unread: true },
];

export const reportTemplates = [
  { id: "R-1", name: "Q4 2024 Sales Performance", type: "Sales", format: "PDF", size: "4.2 MB", generated: "2 days ago", schedule: "Quarterly" },
];

export const productionBatches = [
  { id: "BATCH-2024-089", product: "Premium Honey", stage: "packaging", quantity: "8,000 kg", startDate: "2024-11-28", expectedReady: "2024-12-30", progress: 85, facility: "Tema Facility A", supervisor: "Kofi Asante" },
];

// ============ OPERATIONS MODULES ============

export const assets = [
  { id: "AST-001", tag: "AST-001", name: "High-Volume Extractor", category: "Processing", status: "active", facility: "Tema Facility A", location: "Line 1", condition: "good", serial: "HVE-2024-X1", currentValue: 45000, healthScore: 92 },
  { id: "AST-002", tag: "AST-002", name: "Industrial Desheller", category: "Processing", status: "maintenance", facility: "Kumasi Facility B", location: "Storage", condition: "fair", serial: "IDS-2024-Y2", currentValue: 12500, healthScore: 64 },
];

export const facilities = [
  { id: "FAC-001", name: "Tema Facility A", type: "Processing & Packaging", location: "Greater Accra", capacity: "High", status: "operational", manager: "Kofi Asante", assetCount: 12, healthScore: 88, occupancy: 75 },
];

export const incidents = [
  { id: "INC-942", title: "Power outage at Facility A", severity: "medium", status: "resolved", reportedAt: "2024-12-18", facility: "Tema Facility A", assetTag: "AST-001", description: "Main power grid failure.", reportedBy: "Kofi Asante" },
];

export const maintenanceOrders = [
  { id: "882", assetName: "High-Volume Extractor", assetTag: "AST-001", type: "repair", status: "in_progress", scheduledDate: "2024-12-19", priority: "high", technician: "Yaw Owusu", description: "Hydraulic leak fix." },
];

export const movements = [
  { id: "MOV-101", assetTag: "AST-001", assetName: "High-Volume Extractor", from: "Storage", to: "Processing Line", type: "internal", status: "completed", date: "2024-12-18", movedBy: "Sarah Chen" },
];

export const consumables = [
  { id: "CON-001", name: "Packaging Jars (500g)", category: "Supplies", stock: 5000, unit: "pcs", reorderAt: 1000, unitCost: 0.45, supplier: "GlassPack Ltd" },
];

export const aiInsights = [
  { id: "INS-001", type: "efficiency", text: "Production speed in Facility A increased by 15%.", confidence: 94, icon: "Activity", severity: "success" },
];
