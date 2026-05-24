import { AppLayout } from "@/components/layout/app-layout";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Download, Printer, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function QuotationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const quote = await prisma.quotation.findUnique({
    where: { quoteNumber: resolvedParams.id }
  });

  if (!quote) return notFound();

  const fmt = new Intl.NumberFormat("en-US");
  const amount = Number(quote.amount);

  return (
    <AppLayout
      title={`Quotation ${quote.quoteNumber}`}
      subtitle={`Prepared for ${quote.customer}`}
      actions={
        <>
          <Link href="/quotations">
            <Button variant="ghost" size="sm" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back</Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-2"><Mail className="w-4 h-4" /> Send to Client</Button>
          <Button size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow"><Download className="w-4 h-4" /> Download PDF</Button>
        </>
      }
    >
      <div className="max-w-4xl mx-auto bg-card rounded-xl border border-border shadow-card overflow-hidden">
        
        {/* Header Document */}
        <div className="p-10 border-b border-border bg-secondary/20 flex items-start justify-between">
          <div>
            <div className="font-display font-black text-2xl tracking-tight text-foreground uppercase leading-none mb-1">
              MANONO <span className="text-[#eea000]">MANPHIS</span>
            </div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-6">Export OS</div>
            
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Plot 42, Spintex Road</p>
              <p>Accra, Ghana</p>
              <p>contact@manonomanphis.com</p>
            </div>
          </div>
          
          <div className="text-right">
            <h2 className="text-3xl font-light text-muted-foreground mb-4 uppercase tracking-widest">Quotation</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-left">
              <span className="text-muted-foreground">Quote Number:</span>
              <span className="font-semibold text-foreground">{quote.quoteNumber}</span>
              
              <span className="text-muted-foreground">Date Issued:</span>
              <span className="font-semibold text-foreground">{quote.createdAt.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
              
              <span className="text-muted-foreground">Valid Until:</span>
              <span className="font-semibold text-foreground">{quote.validUntil.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</span>
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="p-10 border-b border-border flex items-start justify-between">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Prepared For:</h3>
            <p className="text-lg font-semibold text-foreground">{quote.customer}</p>
            <p className="text-sm text-muted-foreground">{quote.country}</p>
          </div>
          <div className="text-right">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">Status:</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-secondary text-foreground">
              {quote.status}
            </span>
          </div>
        </div>

        {/* Line Items */}
        <div className="p-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b-2 border-border">
                <th className="font-semibold px-4 py-3">Description</th>
                <th className="font-semibold px-4 py-3">Qty / Details</th>
                <th className="font-semibold px-4 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border last:border-0">
                <td className="px-4 py-6">
                  <p className="font-semibold text-foreground">{quote.product}</p>
                  <p className="text-xs text-muted-foreground mt-1">Standard service provision as discussed.</p>
                </td>
                <td className="px-4 py-6">{quote.qty}</td>
                <td className="px-4 py-6 text-right font-semibold">{quote.currency} {fmt.format(amount)}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-8 flex justify-end">
            <div className="w-72 space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{quote.currency} {fmt.format(amount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (0%)</span>
                <span>{quote.currency} 0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-3 border-t-2 border-border">
                <span>Total Due</span>
                <span>{quote.currency} {fmt.format(amount)}</span>
              </div>
            </div>
          </div>
          
          {/* Terms */}
          <div className="mt-16 pt-6 border-t border-border">
            <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-2">Terms & Conditions</h3>
            <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
              This quotation is valid for 30 days from the date of issue. To accept this quotation, please sign and return it or confirm via email. Payment is required as per the agreed milestones before delivery of physical goods or initiation of digital advertising campaigns.
            </p>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
