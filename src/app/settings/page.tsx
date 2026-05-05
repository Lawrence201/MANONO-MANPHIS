"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Building2, DollarSign, Receipt, CreditCard, Truck, Globe, Save, Bell as BellIcon } from "lucide-react";

const sections = [
  { id: "company", label: "Company Profile", icon: Building2, active: true },
  { id: "currency", label: "Currency Settings", icon: DollarSign },
  { id: "tax", label: "Tax & VAT", icon: Receipt },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "shipping", label: "Shipping Defaults", icon: Truck },
  { id: "regional", label: "Regional & Locale", icon: Globe },
  { id: "notifications", label: "Notification Rules", icon: BellIcon },
];

export default function SettingsPage() {
  return (
    <AppLayout
      title="System Settings"
      subtitle="Configure company-wide preferences, currencies, taxes, payment methods and shipping defaults"
      actions={
        <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Save className="w-4 h-4" /> Save Changes</Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="bg-card rounded-xl border border-border p-3 shadow-card h-fit">
          <ul className="space-y-1">
            {sections.map((s) => {
              const Si = s.icon;
              return (
                <li key={s.id}>
                  <button className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-colors ${s.active ? "bg-secondary font-semibold" : "hover:bg-secondary/50 text-muted-foreground"}`}>
                    <Si className="w-3.5 h-3.5" />
                    <span className="flex-1 text-left">{s.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Main panels */}
        <div className="lg:col-span-3 space-y-6">
          {/* Company Profile */}
          <Panel title="Company Profile" subtitle="Your business information used on invoices, quotations and contracts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Legal Name"><Input defaultValue="Terranova Trade Ltd." /></Field>
              <Field label="Trading Name"><Input defaultValue="Terranova" /></Field>
              <Field label="Tax ID / EIN"><Input defaultValue="GH-2847-981023" /></Field>
              <Field label="Registration Number"><Input defaultValue="CS-104857-2018" /></Field>
              <Field label="Email"><Input defaultValue="trade@terranova.io" /></Field>
              <Field label="Phone"><Input defaultValue="+233 30 222 8401" /></Field>
              <div className="md:col-span-2">
                <Field label="Headquarters Address"><Input defaultValue="14 Independence Avenue, Accra, Ghana" /></Field>
              </div>
            </div>
          </Panel>

          {/* Currency */}
          <Panel title="Currency Settings" subtitle="Base currency, accepted currencies and FX behavior">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Base Currency"><Input defaultValue="USD" /></Field>
              <Field label="Display Format"><Input defaultValue="$1,234.56" /></Field>
              <Field label="FX Rate Source"><Input defaultValue="ECB Daily" /></Field>
            </div>
            <div className="mt-4">
              <Label className="text-xs text-muted-foreground mb-2 block">Accepted Currencies</Label>
              <div className="flex flex-wrap gap-2">
                {["USD", "EUR", "GBP", "JPY", "AED", "CNY"].map((c) => (
                  <span key={c} className="text-xs font-mono bg-secondary px-2.5 py-1 rounded-md font-semibold">{c}</span>
                ))}
              </div>
            </div>
          </Panel>

          {/* Tax */}
          <Panel title="Tax & VAT" subtitle="Tax rates applied per region and product category">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Field label="Default Tax Rate"><Input defaultValue="0%" /></Field>
              <Field label="EU VAT Rate"><Input defaultValue="20%" /></Field>
              <Field label="Tax Inclusive Pricing"><div className="flex items-center h-10"><Switch /></div></Field>
            </div>
          </Panel>

          {/* Payment Methods */}
          <Panel title="Payment Methods" subtitle="Enable and configure how customers can pay">
            <div className="space-y-3">
              {[
                { name: "Bank Wire (SWIFT)", desc: "International bank transfer", enabled: true },
                { name: "Letter of Credit", desc: "Bank-guaranteed payment", enabled: true },
                { name: "Stripe Card", desc: "Visa, Mastercard, Amex", enabled: true },
                { name: "Cryptocurrency", desc: "USDT, USDC stablecoins", enabled: false },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-[10px] text-muted-foreground">{p.desc}</div>
                  </div>
                  <Switch defaultChecked={p.enabled} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppLayout>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <div className="mb-5 pb-4 border-b border-border">
        <h3 className="font-display font-semibold text-base">{title}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground mb-1.5 block">{label}</Label>
      {children}
    </div>
  );
}
