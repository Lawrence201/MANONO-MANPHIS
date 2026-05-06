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
  { id: "L-2841", name: "Hans Mueller", company: "Bremen Trading GmbH", country: "Germany", email: "h.mueller@bremen-trading.de", phone: "+49 421 555-0123", product: "Premium Honey", quantity: "5,000 kg", budget: "$45-50k", stage: "negotiating", assignedTo: "Sarah Chen", initials: "HM", date: "2 days ago", tags: ["Hot", "VIP"], value: 47500 },
  { id: "L-2840", name: "Yuki Tanaka", company: "Osaka Imports Co.", country: "Japan", email: "tanaka@osaka-imports.jp", phone: "+81 6 6555 0188", product: "W320 Cashew", quantity: "20,000 kg", budget: "$240k", stage: "qualified", assignedTo: "James Okoro", initials: "YT", date: "3 days ago", tags: ["Bulk"], value: 240000 },
  { id: "L-2839", name: "Marie Dubois", company: "Provence Naturals", country: "France", email: "marie@provence-naturals.fr", phone: "+33 4 91 555 042", product: "Refined Shea", quantity: "2,500 kg", budget: "$28k", stage: "new", assignedTo: "Sarah Chen", initials: "MD", date: "5 hours ago", tags: ["New"], value: 28000 },
  { id: "L-2838", name: "John Whitman", company: "Atlantic Foods Inc.", country: "USA", email: "j.whitman@atlanticfoods.com", phone: "+1 212 555-0167", product: "W240 Cashew", quantity: "15,000 kg", budget: "$210k", stage: "contacted", assignedTo: "James Okoro", initials: "JW", date: "1 day ago", tags: ["Repeat"], value: 210000 },
  { id: "L-2837", name: "Ahmed Al-Rashid", company: "Gulf Trade LLC", country: "UAE", email: "ahmed@gulftrade.ae", phone: "+971 4 555 0199", product: "Premium Honey", quantity: "8,000 kg", budget: "$72k", stage: "won", assignedTo: "Sarah Chen", initials: "AR", date: "1 week ago", tags: ["VIP"], value: 72000 },
  { id: "L-2836", name: "Emma Bakker", company: "Rotterdam Commodities", country: "Netherlands", email: "e.bakker@rotterdam-co.nl", phone: "+31 10 555 0143", product: "Raw Shea Butter", quantity: "3,000 kg", budget: "$22k", stage: "qualified", assignedTo: "Lisa Park", initials: "EB", date: "4 days ago", tags: [], value: 22000 },
  { id: "L-2835", name: "Oliver Smith", company: "London Spice Co.", country: "UK", email: "oliver@londonspice.co.uk", phone: "+44 20 7555 0177", product: "Raw Honey", quantity: "4,500 kg", budget: "$32k", stage: "negotiating", assignedTo: "Lisa Park", initials: "OS", date: "6 days ago", tags: ["Hot"], value: 32000 },
  { id: "L-2834", name: "Klaus Weber", company: "Hamburg Naturals", country: "Germany", email: "k.weber@hamburg-naturals.de", phone: "+49 40 555 0156", product: "W320 Cashew", quantity: "10,000 kg", budget: "$125k", stage: "contacted", assignedTo: "James Okoro", initials: "KW", date: "2 days ago", tags: [], value: 125000 },
  { id: "L-2833", name: "Sophie Laurent", company: "Bio France", country: "France", email: "sophie@biofrance.fr", phone: "+33 1 45 555 089", product: "Refined Shea", quantity: "1,800 kg", budget: "$21k", stage: "new", assignedTo: "Sarah Chen", initials: "SL", date: "8 hours ago", tags: ["New"], value: 21000 },
  { id: "L-2832", name: "Carlos Mendez", company: "Madrid Organics", country: "Spain", email: "carlos@madridorganics.es", phone: "+34 91 555 0134", product: "Premium Honey", quantity: "6,000 kg", budget: "$54k", stage: "won", assignedTo: "Lisa Park", initials: "CM", date: "2 weeks ago", tags: ["Repeat"], value: 54000 },
  { id: "L-2831", name: "David Cohen", company: "Tel Aviv Trade", country: "Israel", email: "david@tatrade.co.il", phone: "+972 3 555 0122", product: "W240 Cashew", quantity: "8,000 kg", budget: "$112k", stage: "lost", assignedTo: "James Okoro", initials: "DC", date: "3 weeks ago", tags: [], value: 112000 },
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
  { id: "ORD-9845", customer: "Carlos Mendez", company: "Madrid Organics", country: "Spain", product: "Premium Honey", quantity: "6,000 kg", amount: 54000, currency: "EUR", payment: "paid", status: "delivered", shipping: "Sea", date: "2024-11-20", eta: "2024-12-18", progress: 100 },
  { id: "ORD-9844", customer: "Yuki Tanaka", company: "Osaka Imports Co.", country: "Japan", product: "W320 Cashew", quantity: "20,000 kg", amount: 240000, currency: "USD", payment: "partial", status: "ready", shipping: "Sea", date: "2024-12-12", eta: "2025-01-15", progress: 50 },
  { id: "ORD-9843", customer: "John Whitman", company: "Atlantic Foods Inc.", country: "USA", product: "W240 Cashew", quantity: "15,000 kg", amount: 210000, currency: "USD", payment: "paid", status: "in_transit", shipping: "Sea", date: "2024-12-05", eta: "2025-01-02", progress: 80 },
  { id: "ORD-9842", customer: "Emma Bakker", company: "Rotterdam Commodities", country: "Netherlands", product: "Raw Shea Butter", quantity: "3,000 kg", amount: 22000, currency: "EUR", payment: "pending", status: "pending", shipping: "Sea", date: "2024-12-18", eta: "2025-01-20", progress: 10 },
  { id: "ORD-9841", customer: "Oliver Smith", company: "London Spice Co.", country: "UK", product: "Raw Honey", quantity: "4,500 kg", amount: 32000, currency: "GBP", payment: "overdue", status: "ready", shipping: "Air", date: "2024-11-28", eta: "2024-12-22", progress: 60 },
  { id: "ORD-9840", customer: "Marie Dubois", company: "Provence Naturals", country: "France", product: "Refined Shea", quantity: "2,500 kg", amount: 28000, currency: "EUR", payment: "paid", status: "delivered", shipping: "Courier", date: "2024-11-15", eta: "2024-12-05", progress: 100 },
];

export const recentActivities = [
  { id: 1, type: "payment", text: "Payment of $72,000 received from Gulf Trade LLC", time: "12 minutes ago", icon: "payment" },
  { id: 2, type: "lead", text: "New lead from Provence Naturals (France) — Refined Shea", time: "5 hours ago", icon: "lead" },
  { id: 3, type: "shipment", text: "ORD-9846 departed Tema Port — ETA Dec 28", time: "8 hours ago", icon: "shipment" },
  { id: 4, type: "quote", text: "Quote QT-1184 viewed by Bremen Trading GmbH", time: "1 day ago", icon: "quote" },
  { id: 5, type: "order", text: "ORD-9847 created from accepted quote QT-1182", time: "1 day ago", icon: "order" },
  { id: 6, type: "stock", text: "Low stock alert: Refined Shea Butter (1,500 kg left)", time: "2 days ago", icon: "alert" },
];

export const shipments = orders.filter(o => o.status === "in_transit" || o.status === "ready" || o.status === "processing");

// ============ ENTERPRISE MODULES ============

export type DocStatus = "valid" | "expiring" | "expired" | "pending";
export interface ComplianceDoc {
  id: string;
  name: string;
  type: "Certificate of Origin" | "Export License" | "Bill of Lading" | "Contract" | "Phytosanitary" | "Insurance" | "Quality Cert";
  orderRef?: string;
  country: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: DocStatus;
  size: string;
}
export const complianceDocs: ComplianceDoc[] = [
  { id: "DOC-1042", name: "Certificate of Origin — ORD-9847", type: "Certificate of Origin", orderRef: "ORD-9847", country: "Germany", issuedBy: "Ghana Chamber of Commerce", issueDate: "2024-12-15", expiryDate: "2025-06-15", status: "valid", size: "2.4 MB" },
  { id: "DOC-1041", name: "Export License — Honey Q4 2024", type: "Export License", country: "Multi-region", issuedBy: "Ministry of Trade", issueDate: "2024-10-01", expiryDate: "2025-03-31", status: "expiring", size: "1.1 MB" },
  { id: "DOC-1040", name: "Bill of Lading — ORD-9846", type: "Bill of Lading", orderRef: "ORD-9846", country: "UAE", issuedBy: "Maersk Lines", issueDate: "2024-12-10", expiryDate: "2025-01-10", status: "valid", size: "3.8 MB" },
  { id: "DOC-1039", name: "Phytosanitary Certificate — Cashew", type: "Phytosanitary", orderRef: "ORD-9844", country: "Japan", issuedBy: "Plant Protection Division", issueDate: "2024-12-12", expiryDate: "2025-02-12", status: "valid", size: "890 KB" },
  { id: "DOC-1038", name: "Supply Contract — Bremen Trading", type: "Contract", country: "Germany", issuedBy: "Legal Dept.", issueDate: "2024-01-15", expiryDate: "2025-01-15", status: "expiring", size: "5.2 MB" },
  { id: "DOC-1037", name: "Marine Insurance Policy", type: "Insurance", country: "Global", issuedBy: "Lloyd's of London", issueDate: "2024-06-01", expiryDate: "2025-06-01", status: "valid", size: "2.1 MB" },
  { id: "DOC-1036", name: "Quality Cert — Premium Honey Batch 89", type: "Quality Cert", country: "Multi-region", issuedBy: "SGS Laboratory", issueDate: "2024-11-20", expiryDate: "2024-11-30", status: "expired", size: "1.4 MB" },
  { id: "DOC-1035", name: "Certificate of Origin — ORD-9843", type: "Certificate of Origin", orderRef: "ORD-9843", country: "USA", issuedBy: "Ghana Chamber of Commerce", issueDate: "2024-12-05", expiryDate: "2025-06-05", status: "valid", size: "2.2 MB" },
];

export type UserRole = "Admin" | "Sales" | "Logistics" | "Finance" | "Compliance";
export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "active" | "invited" | "suspended";
  initials: string;
  lastActive: string;
  permissions: number;
}
export const systemUsers: SystemUser[] = [
  { id: "U-01", name: "Sarah Chen", email: "sarah@terranova.io", role: "Admin", status: "active", initials: "SC", lastActive: "Online now", permissions: 32 },
  { id: "U-02", name: "James Okoro", email: "james@terranova.io", role: "Sales", status: "active", initials: "JO", lastActive: "12 min ago", permissions: 18 },
  { id: "U-03", name: "Lisa Park", email: "lisa@terranova.io", role: "Sales", status: "active", initials: "LP", lastActive: "2 hours ago", permissions: 18 },
  { id: "U-04", name: "Marcus Webb", email: "marcus@terranova.io", role: "Logistics", status: "active", initials: "MW", lastActive: "Online now", permissions: 14 },
  { id: "U-05", name: "Priya Sharma", email: "priya@terranova.io", role: "Finance", status: "active", initials: "PS", lastActive: "1 hour ago", permissions: 22 },
  { id: "U-06", name: "Kwame Mensah", email: "kwame@terranova.io", role: "Compliance", status: "active", initials: "KM", lastActive: "3 hours ago", permissions: 12 },
  { id: "U-07", name: "Anna Schmidt", email: "anna@terranova.io", role: "Logistics", status: "invited", initials: "AS", lastActive: "Pending", permissions: 14 },
  { id: "U-08", name: "Tomás Rivera", email: "tomas@terranova.io", role: "Sales", status: "suspended", initials: "TR", lastActive: "5 days ago", permissions: 0 },
];

export const rolePermissions = [
  { role: "Admin", users: 1, capabilities: ["Full system access", "User management", "Billing", "Settings", "All modules"], color: "destructive" },
  { role: "Sales", users: 3, capabilities: ["Leads & CRM", "Quotations", "Customers view", "Orders create"], color: "primary" },
  { role: "Logistics", users: 2, capabilities: ["Orders", "Inventory", "Shipments", "Documents"], color: "accent" },
  { role: "Finance", users: 1, capabilities: ["Payments", "Invoices", "Reports", "Tax settings"], color: "success" },
  { role: "Compliance", users: 1, capabilities: ["Documents", "Certifications", "Audit logs"], color: "warning" },
];

export interface ActivityLog {
  id: string;
  user: string;
  initials: string;
  action: string;
  module: string;
  target: string;
  timestamp: string;
  ip: string;
  type: "create" | "update" | "delete" | "login" | "export" | "approve";
}
export const activityLogs: ActivityLog[] = [
  { id: "A-9921", user: "Sarah Chen", initials: "SC", action: "Approved quotation", module: "Quotations", target: "QT-1184", timestamp: "2 minutes ago", ip: "41.66.218.14", type: "approve" },
  { id: "A-9920", user: "Priya Sharma", initials: "PS", action: "Recorded payment", module: "Payments", target: "$72,000 — Gulf Trade", timestamp: "12 minutes ago", ip: "41.66.218.22", type: "create" },
  { id: "A-9919", user: "Marcus Webb", initials: "MW", action: "Updated shipment status", module: "Logistics", target: "ORD-9846 → In Transit", timestamp: "1 hour ago", ip: "41.66.218.31", type: "update" },
  { id: "A-9918", user: "James Okoro", initials: "JO", action: "Created new lead", module: "Leads & CRM", target: "Osaka Imports Co.", timestamp: "3 hours ago", ip: "41.66.218.45", type: "create" },
  { id: "A-9917", user: "Kwame Mensah", initials: "KM", action: "Uploaded document", module: "Compliance", target: "DOC-1042 Cert of Origin", timestamp: "5 hours ago", ip: "41.66.218.18", type: "create" },
  { id: "A-9916", user: "Sarah Chen", initials: "SC", action: "Logged in", module: "System", target: "Dashboard", timestamp: "6 hours ago", ip: "41.66.218.14", type: "login" },
  { id: "A-9915", user: "Lisa Park", initials: "LP", action: "Exported report", module: "Reports", target: "Q4 Sales Report.xlsx", timestamp: "8 hours ago", ip: "41.66.218.52", type: "export" },
  { id: "A-9914", user: "Sarah Chen", initials: "SC", action: "Deleted draft quotation", module: "Quotations", target: "QT-1180 (draft)", timestamp: "Yesterday", ip: "41.66.218.14", type: "delete" },
  { id: "A-9913", user: "Priya Sharma", initials: "PS", action: "Generated invoice", module: "Invoices", target: "INV-2284 — $240,000", timestamp: "Yesterday", ip: "41.66.218.22", type: "create" },
  { id: "A-9912", user: "Marcus Webb", initials: "MW", action: "Updated inventory", module: "Inventory", target: "W320 Cashew +5,000 kg", timestamp: "Yesterday", ip: "41.66.218.31", type: "update" },
];

export interface Region {
  code: string;
  name: string;
  flag: string;
  region: "Europe" | "North America" | "Asia" | "Middle East" | "Africa" | "Oceania";
  status: "active" | "restricted" | "monitoring";
  buyers: number;
  revenue: number;
  shippingZone: "Zone A" | "Zone B" | "Zone C" | "Zone D";
  duty: number;
  currency: string;
  leadTime: string;
}
export const regions: Region[] = [
  { code: "DE", name: "Germany", flag: "🇩🇪", region: "Europe", status: "active", buyers: 14, revenue: 685000, shippingZone: "Zone A", duty: 0, currency: "EUR", leadTime: "18-22 days" },
  { code: "US", name: "United States", flag: "🇺🇸", region: "North America", status: "active", buyers: 11, revenue: 542000, shippingZone: "Zone B", duty: 4.5, currency: "USD", leadTime: "21-28 days" },
  { code: "FR", name: "France", flag: "🇫🇷", region: "Europe", status: "active", buyers: 9, revenue: 428000, shippingZone: "Zone A", duty: 0, currency: "EUR", leadTime: "18-22 days" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", region: "Europe", status: "active", buyers: 8, revenue: 385000, shippingZone: "Zone A", duty: 2.0, currency: "GBP", leadTime: "16-20 days" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", region: "Europe", status: "active", buyers: 7, revenue: 295000, shippingZone: "Zone A", duty: 0, currency: "EUR", leadTime: "16-20 days" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪", region: "Middle East", status: "active", buyers: 6, revenue: 248000, shippingZone: "Zone C", duty: 5.0, currency: "AED", leadTime: "14-18 days" },
  { code: "JP", name: "Japan", flag: "🇯🇵", region: "Asia", status: "active", buyers: 4, revenue: 165000, shippingZone: "Zone D", duty: 8.5, currency: "JPY", leadTime: "28-35 days" },
  { code: "CN", name: "China", flag: "🇨🇳", region: "Asia", status: "monitoring", buyers: 2, revenue: 88000, shippingZone: "Zone D", duty: 12.0, currency: "CNY", leadTime: "25-32 days" },
  { code: "RU", name: "Russia", flag: "🇷🇺", region: "Europe", status: "restricted", buyers: 0, revenue: 0, shippingZone: "Zone D", duty: 0, currency: "RUB", leadTime: "—" },
];

export interface ShippingRule {
  id: string;
  name: string;
  zone: string;
  method: "Air Freight" | "Sea Freight" | "Express Courier" | "Road";
  minWeight: number;
  maxWeight: number;
  baseRate: number;
  perKg: number;
  transitDays: string;
  active: boolean;
}
export const shippingRules: ShippingRule[] = [
  { id: "SR-01", name: "EU Sea Standard", zone: "Zone A", method: "Sea Freight", minWeight: 1000, maxWeight: 25000, baseRate: 850, perKg: 0.45, transitDays: "16-22", active: true },
  { id: "SR-02", name: "EU Air Express", zone: "Zone A", method: "Air Freight", minWeight: 100, maxWeight: 2000, baseRate: 1200, perKg: 3.80, transitDays: "3-5", active: true },
  { id: "SR-03", name: "North America Sea", zone: "Zone B", method: "Sea Freight", minWeight: 1000, maxWeight: 25000, baseRate: 1450, perKg: 0.62, transitDays: "21-28", active: true },
  { id: "SR-04", name: "Middle East Air", zone: "Zone C", method: "Air Freight", minWeight: 100, maxWeight: 5000, baseRate: 980, perKg: 2.95, transitDays: "4-6", active: true },
  { id: "SR-05", name: "Asia Sea Standard", zone: "Zone D", method: "Sea Freight", minWeight: 2000, maxWeight: 30000, baseRate: 1850, perKg: 0.78, transitDays: "28-35", active: true },
  { id: "SR-06", name: "Express Samples", zone: "All Zones", method: "Express Courier", minWeight: 1, maxWeight: 50, baseRate: 85, perKg: 12.50, transitDays: "2-4", active: true },
];

export interface SystemNotification {
  id: string;
  category: "lead" | "payment" | "shipment" | "system" | "compliance" | "stock";
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: "high" | "medium" | "low";
}
export const notifications: SystemNotification[] = [
  { id: "N-1", category: "payment", title: "Payment received", message: "$72,000 from Gulf Trade LLC for ORD-9846", time: "12 min ago", read: false, priority: "high" },
  { id: "N-2", category: "compliance", title: "Document expiring soon", message: "Export License expires in 14 days", time: "2 hours ago", read: false, priority: "high" },
  { id: "N-3", category: "shipment", title: "Shipment delayed", message: "ORD-9841 — port congestion at Felixstowe", time: "3 hours ago", read: false, priority: "high" },
  { id: "N-4", category: "lead", title: "New high-value lead", message: "Osaka Imports requesting $240k W320 Cashew quote", time: "5 hours ago", read: false, priority: "medium" },
  { id: "N-5", category: "stock", title: "Low stock alert", message: "Refined Shea Butter — only 1,500 kg remaining", time: "8 hours ago", read: true, priority: "medium" },
  { id: "N-6", category: "system", title: "Weekly backup completed", message: "Database backup successful — 2.4 GB archived", time: "Yesterday", read: true, priority: "low" },
  { id: "N-7", category: "payment", title: "Payment overdue", message: "London Spice Co. — invoice INV-2278 past due 3 days", time: "Yesterday", read: true, priority: "high" },
  { id: "N-8", category: "lead", title: "Lead stage advanced", message: "Hans Mueller moved to Negotiating", time: "2 days ago", read: true, priority: "low" },
];

export interface Workflow {
  id: string;
  name: string;
  trigger: string;
  action: string;
  active: boolean;
  runs: number;
  lastRun: string;
  successRate: number;
}
export const workflows: Workflow[] = [
  { id: "W-01", name: "Auto-advance qualified leads", trigger: "Lead receives 2nd email reply", action: "Move stage → Qualified + Notify owner", active: true, runs: 142, lastRun: "1 hour ago", successRate: 96 },
  { id: "W-02", name: "Quote approval → Invoice", trigger: "Quotation status = Approved", action: "Generate draft invoice + Email customer", active: true, runs: 89, lastRun: "3 hours ago", successRate: 100 },
  { id: "W-03", name: "Payment confirmed → Logistics", trigger: "Payment status = Paid (full)", action: "Notify logistics team + Reserve inventory", active: true, runs: 67, lastRun: "12 min ago", successRate: 98 },
  { id: "W-04", name: "Low stock auto-reorder alert", trigger: "Inventory < 20% threshold", action: "Email procurement + Slack #ops alert", active: true, runs: 23, lastRun: "Yesterday", successRate: 100 },
  { id: "W-05", name: "Document expiry reminders", trigger: "Doc expiry in 30 days", action: "Email compliance team daily", active: true, runs: 412, lastRun: "Today 8:00 AM", successRate: 100 },
  { id: "W-06", name: "Overdue invoice escalation", trigger: "Invoice unpaid +7 days", action: "Email customer + Notify finance manager", active: false, runs: 18, lastRun: "1 week ago", successRate: 88 },
  { id: "W-07", name: "VIP customer order alert", trigger: "Order from tagged VIP customer", action: "Slack #vip-orders + Priority flag", active: true, runs: 34, lastRun: "2 days ago", successRate: 100 },
];

export interface CommThread {
  id: string;
  customer: string;
  initials: string;
  channel: "email" | "call" | "whatsapp" | "note";
  subject: string;
  preview: string;
  agent: string;
  time: string;
  unread: boolean;
}
export const commThreads: CommThread[] = [
  { id: "C-1", customer: "Hans Mueller", initials: "HM", channel: "email", subject: "Re: Premium Honey Q1 contract terms", preview: "Thanks Sarah — we accept the proposed pricing of $9.50/kg. Please send the formal contract...", agent: "Sarah Chen", time: "12 min ago", unread: true },
  { id: "C-2", customer: "Yuki Tanaka", initials: "YT", channel: "whatsapp", subject: "W320 Cashew quote follow-up", preview: "Konnichiwa. Our quality team approved samples. Ready to proceed with full 20,000 kg order.", agent: "James Okoro", time: "1 hour ago", unread: true },
  { id: "C-3", customer: "Ahmed Al-Rashid", initials: "AR", channel: "call", subject: "Inbound call — 14 min", preview: "Discussed shipping ETA for ORD-9846. Customer satisfied with progress. No action required.", agent: "Sarah Chen", time: "3 hours ago", unread: false },
  { id: "C-4", customer: "Marie Dubois", initials: "MD", channel: "email", subject: "Refined Shea sample request", preview: "Bonjour, please send 250g samples of your premium refined shea to our Marseille office...", agent: "Sarah Chen", time: "5 hours ago", unread: false },
  { id: "C-5", customer: "Internal", initials: "TN", channel: "note", subject: "Note on Bremen Trading account", preview: "Customer hinted at potential 50,000 kg annual contract for 2025. Schedule executive call.", agent: "Sarah Chen", time: "Yesterday", unread: false },
  { id: "C-6", customer: "Oliver Smith", initials: "OS", channel: "email", subject: "Payment delay — apology", preview: "Apologies for the delay on INV-2278. Bank transfer initiated this morning, ref# UK-88421...", agent: "Priya Sharma", time: "Yesterday", unread: false },
];

export const reportTemplates = [
  { id: "R-1", name: "Q4 2024 Sales Performance", type: "Sales", format: "PDF", size: "4.2 MB", generated: "2 days ago", schedule: "Quarterly" },
  { id: "R-2", name: "Monthly Revenue Breakdown — Dec", type: "Revenue", format: "Excel", size: "1.8 MB", generated: "5 days ago", schedule: "Monthly" },
  { id: "R-3", name: "Export Performance by Country", type: "Export", format: "PDF", size: "3.1 MB", generated: "1 week ago", schedule: "Monthly" },
  { id: "R-4", name: "Inventory Aging Report", type: "Inventory", format: "Excel", size: "920 KB", generated: "3 days ago", schedule: "Weekly" },
  { id: "R-5", name: "Customer Lifetime Value Analysis", type: "CRM", format: "PDF", size: "2.6 MB", generated: "2 weeks ago", schedule: "Quarterly" },
  { id: "R-6", name: "Compliance Audit Trail — Nov", type: "Compliance", format: "PDF", size: "5.8 MB", generated: "3 weeks ago", schedule: "Monthly" },
  { id: "R-7", name: "Logistics Cost Analysis", type: "Logistics", format: "Excel", size: "1.4 MB", generated: "4 days ago", schedule: "Monthly" },
  { id: "R-8", name: "Tax Summary — FY 2024", type: "Finance", format: "PDF", size: "3.4 MB", generated: "1 month ago", schedule: "Annually" },
];

export interface ProductionBatch {
  id: string;
  product: string;
  stage: "sourcing" | "processing" | "quality_check" | "packaging" | "ready";
  quantity: string;
  startDate: string;
  expectedReady: string;
  progress: number;
  facility: string;
  supervisor: string;
}
export const productionBatches: ProductionBatch[] = [
  { id: "BATCH-2024-089", product: "Premium Honey", stage: "packaging", quantity: "8,000 kg", startDate: "2024-11-28", expectedReady: "2024-12-30", progress: 85, facility: "Tema Facility A", supervisor: "Kofi Asante" },
  { id: "BATCH-2024-088", product: "W320 Cashew Nuts", stage: "quality_check", quantity: "20,000 kg", startDate: "2024-11-15", expectedReady: "2025-01-05", progress: 70, facility: "Kumasi Facility B", supervisor: "Ama Boateng" },
  { id: "BATCH-2024-087", product: "Refined Shea Butter", stage: "processing", quantity: "5,000 kg", startDate: "2024-12-01", expectedReady: "2025-01-10", progress: 45, facility: "Tamale Facility C", supervisor: "Yaw Owusu" },
  { id: "BATCH-2024-086", product: "W240 Cashew Nuts", stage: "sourcing", quantity: "15,000 kg", startDate: "2024-12-10", expectedReady: "2025-01-25", progress: 20, facility: "Kumasi Facility B", supervisor: "Ama Boateng" },
  { id: "BATCH-2024-085", product: "Raw Wild Honey", stage: "ready", quantity: "4,500 kg", startDate: "2024-11-01", expectedReady: "2024-12-15", progress: 100, facility: "Tema Facility A", supervisor: "Kofi Asante" },
];
