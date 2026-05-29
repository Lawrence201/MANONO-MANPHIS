import type { ReactNode } from "react";

// This layout completely overrides AppLayout for the invoice page,
// preventing Tailwind's lab() theme colors from ever loading.
export default function InvoiceLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ margin: 0, padding: 0, background: '#f3f4f6', fontFamily: 'Arial, Helvetica, sans-serif', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
