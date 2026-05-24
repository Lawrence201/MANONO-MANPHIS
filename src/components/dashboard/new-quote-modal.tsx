"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createQuotation } from "@/lib/actions/quotation-actions";

export function NewQuoteModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customer: "", product: "", amount: "" });

  const handleGenerate = async () => {
    if (!form.customer || !form.product || !form.amount) return;
    
    setLoading(true);
    const res = await createQuotation({
      customer: form.customer,
      product: form.product,
      amount: Number(form.amount)
    });
    setLoading(false);
    
    if (res.success) {
      setOpen(false);
      setForm({ customer: "", product: "", amount: "" });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm" className="gap-2 bg-gradient-accent border-0 shadow-glow">
        <Plus className="w-4 h-4" /> New Quote
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Quote</DialogTitle>
            <DialogDescription>
              Enter the details to generate a new quotation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="customer" className="text-right text-xs font-semibold">
                Customer
              </Label>
              <Input 
                id="customer" 
                placeholder="e.g. MTN Ghana" 
                className="col-span-3 h-8 text-sm" 
                value={form.customer}
                onChange={e => setForm({...form, customer: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right text-xs font-semibold">
                Product
              </Label>
              <Select value={form.product} onValueChange={v => setForm({...form, product: v})}>
                <SelectTrigger className="col-span-3 h-8 text-sm">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Premium Honey">Premium Honey</SelectItem>
                  <SelectItem value="Raw Cashew Nuts">Raw Cashew Nuts</SelectItem>
                  <SelectItem value="LED Billboard Ad">LED Billboard Ad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right text-xs font-semibold">
                Amount (GHS)
              </Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="0.00" 
                className="col-span-3 h-8 text-sm" 
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
            <Button size="sm" onClick={handleGenerate} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate Quote"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
