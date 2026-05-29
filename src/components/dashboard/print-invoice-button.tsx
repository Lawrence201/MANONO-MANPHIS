"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

export function PrintInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      const element = document.getElementById('invoice-document');
      if (!element) {
        alert("Invoice element not found.");
        setLoading(false);
        return;
      }

      // Capture the exact element as seen on screen, at 2x resolution
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        // Strip ALL stylesheets from the clone so lab()/oklch() colors never get parsed
        onclone: (clonedDoc) => {
          // Remove every <link rel="stylesheet"> 
          clonedDoc.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.remove());
          // Remove every <style> tag
          clonedDoc.querySelectorAll('style').forEach(el => el.remove());
        },
      });

      const imgData = canvas.toDataURL('image/png');

      // Use A4 width (210mm) but set the page HEIGHT to exactly match 
      // the content so the entire invoice fits on ONE page, always.
      const a4WidthMM = 210;
      const contentHeightMM = (canvas.height * a4WidthMM) / canvas.width;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [a4WidthMM, contentHeightMM],
      });

      pdf.addImage(imgData, 'PNG', 0, 0, a4WidthMM, contentHeightMM);
      pdf.save(`${invoiceId}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="gap-2 bg-gradient-accent border-0 shadow-glow min-w-[150px]"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download PDF
        </>
      )}
    </Button>
  );
}
