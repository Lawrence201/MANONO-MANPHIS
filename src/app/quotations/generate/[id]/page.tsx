import { getExportOrderById } from "@/lib/actions/export-order-actions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { PrintInvoiceButton } from "@/components/dashboard/print-invoice-button";

export default async function GenerateInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const orderId = parseInt(resolvedParams.id, 10);
  if (isNaN(orderId)) return notFound();

  const res = await getExportOrderById(orderId);
  if (!res.success || !res.data) return notFound();

  const order = res.data;
  const product = order.product;
  const quantity = order.quantityRequested;
  const subtotal = order.totalEstimatedCost ? Number(order.totalEstimatedCost) : (quantity * product.pricePerUnit);
  const unitPrice = quantity > 0 ? (subtotal / quantity) : product.pricePerUnit;
  const invoiceNumber = `INV-${order.referenceNumber.split('-').pop()}`;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const unit = order.unitMeasurement || (product.priceUnitType === 'per_kg' ? 'KG' : 'L');

  return (
    <>
      {/* Toolbar — excluded from PDF capture */}
      <div style={{




        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: '#111827', padding: '12px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)'
      }}>
        <Link href="/quotations" style={{
          color: '#9ca3af', textDecoration: 'none', fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          ← Back to Pending Orders
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#6b7280', fontSize: 12 }}>{invoiceNumber}</span>
          <PrintInvoiceButton invoiceId={invoiceNumber} orderId={order.id} />
        </div>
      </div>

      {/* Page with top padding for toolbar */}
      <div style={{ paddingTop: 72, paddingBottom: 60 }}>

        {/* THE INVOICE — only this div gets captured by html2canvas */}
        <div id="invoice-document" style={{
          background: '#ffffff',
          maxWidth: 794,
          margin: '32px auto',
          padding: '60px',
          boxShadow: '0 4px 40px rgba(0,0,0,0.12)',
          color: '#111827',
          fontSize: 13,
          lineHeight: 1.6,
        }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 900, letterSpacing: 6, margin: 0, color: '#111827', fontFamily: 'Arial, sans-serif' }}>
              COMMERCIAL INVOICE
            </h1>
          </div>

          {/* Logo + Company + Invoice Meta */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '2px solid #e5e7eb', paddingBottom: 24, marginBottom: 32, marginTop: 12 }}>
            <div>
              <img src="/logo.png" alt="Manphis Logo" width={72} height={72} style={{ display: 'block', marginBottom: 10 }} crossOrigin="anonymous" />
              <p style={{ fontWeight: 700, fontSize: 13, margin: '0 0 2px 0', color: '#1f2937' }}>MANONO MANPHIS LTD.</p>
              <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>Plot 45, Industrial Area, Accra, Ghana</p>
              <p style={{ color: '#6b7280', fontSize: 11, margin: 0 }}>exports@manphis.com | +233 50 000 0000</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: '0 0 4px 0' }}><span style={{ color: '#9ca3af' }}>Invoice No: </span><strong>{invoiceNumber}</strong></p>
              <p style={{ margin: '0 0 4px 0' }}><span style={{ color: '#9ca3af' }}>Date Issued: </span><strong>{date}</strong></p>
              <p style={{ margin: 0 }}><span style={{ color: '#9ca3af' }}>Order Ref: </span><strong>{order.referenceNumber}</strong></p>
            </div>
          </div>

          {/* Bill To / Ship To */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, marginBottom: 40 }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 10px 0' }}>Bill To</p>
              <p style={{ fontWeight: 700, fontSize: 15, margin: '0 0 4px 0' }}>{order.companyName || order.buyerType}</p>
              <p style={{ color: '#4b5563', margin: '0 0 2px 0' }}>{order.email}</p>
              <p style={{ color: '#4b5563', margin: '0 0 2px 0' }}>{order.phone}</p>
              <p style={{ color: '#4b5563', margin: '4px 0 0 0' }}>{order.billingAddress || order.deliveryAddress}</p>
              {order.taxId && <p style={{ color: '#4b5563', margin: '4px 0 0 0' }}>Tax ID: {order.taxId}</p>}
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 10px 0' }}>Ship To</p>
              <p style={{ fontWeight: 700, color: '#1f2937', margin: '0 0 4px 0' }}>{order.city}, {order.stateRegion}</p>
              <p style={{ color: '#4b5563', margin: '0 0 2px 0' }}>{order.destinationCountry} — {order.postalCode}</p>
              <p style={{ color: '#4b5563', margin: '0 0 12px 0' }}>{order.deliveryAddress}</p>
              <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 8, padding: '10px 12px' }}>
                <p style={{ fontSize: 10, color: '#6b7280', fontWeight: 600, margin: '0 0 4px 0' }}>Logistics Info</p>
                <p style={{ fontWeight: 600, margin: '0 0 2px 0' }}>{order.shippingType}</p>
                <p style={{ color: '#4b5563', margin: 0 }}>{order.deliveryType} | {order.pickupOption}</p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div style={{ marginBottom: 40 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280' }}>Description</th>
                  <th style={{ padding: '10px 16px', textAlign: 'center', fontWeight: 600, color: '#6b7280' }}>Qty</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>Unit Price</th>
                  <th style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: '#6b7280' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: 16 }}>
                    <p style={{ fontWeight: 700, color: '#1f2937', margin: '0 0 4px 0' }}>{product.name}</p>
                    <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>
                      Origin: Ghana | Required Certs:{order.requiresFda ? ' FDA' : ''}{order.requiresPhyto ? ' Phyto' : ''}{order.requiresOrganic ? ' Organic' : ''}{order.requiresOrigin ? ' Certificate of Origin' : ''}
                    </p>
                  </td>
                  <td style={{ padding: 16, textAlign: 'center', fontWeight: 600 }}>{quantity} {unit}</td>
                  <td style={{ padding: 16, textAlign: 'right' }}>GH₵ {unitPrice.toFixed(2)}</td>
                  <td style={{ padding: 16, textAlign: 'right', fontWeight: 700 }}>GH₵ {subtotal.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals + Payment */}
          <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 3, textTransform: 'uppercase', margin: '0 0 10px 0' }}>Payment Instructions</p>
              <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: 12, padding: 16 }}>
                <p style={{ fontWeight: 700, color: '#1f2937', margin: '0 0 10px 0' }}>Wire Transfer Details:</p>
                <table style={{ width: '100%', fontSize: 12 }}>
                  <tbody>
                    {[
                      ['Bank:', 'Ecobank Ghana Ltd'],
                      ['Account Name:', 'Manphis Export Corp'],
                      ['Account No:', '1234567890123'],
                      ['SWIFT Code:', 'ECOCGHAC'],
                    ].map(([label, value]) => (
                      <tr key={label}>
                        <td style={{ color: '#6b7280', padding: '2px 0', width: 110, verticalAlign: 'top' }}>{label}</td>
                        <td style={{ fontWeight: 600, color: '#1f2937', padding: '2px 0' }}>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#d97706', margin: '12px 0 0 0' }}>{order.depositRequired}</p>
              </div>
            </div>

            <div style={{ width: 250 }}>
              {[
                { label: 'Subtotal', value: `GH₵ ${subtotal.toFixed(2)}` },
                { label: 'Shipping & Handling', value: 'TBD (Billed Separately)' },
                { label: 'Tax', value: 'GH₵ 0.00' },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: 8, fontSize: 13 }}>
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #1f2937', paddingTop: 12, marginTop: 8 }}>
                <span style={{ fontWeight: 700, color: '#1f2937', textTransform: 'uppercase', letterSpacing: 1, fontSize: 12 }}>Total Amount</span>
                <span style={{ fontWeight: 900, fontSize: 20, color: '#d97706' }}>GH₵{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #f3f4f6', textAlign: 'center', color: '#9ca3af', fontSize: 11 }}>
            <p style={{ margin: '0 0 4px 0' }}>This is a computer generated document. No signature is required.</p>
            <p style={{ margin: 0 }}>Thank you for doing business with Manono Manphis Ltd.</p>
          </div>

        </div>
      </div>
    </>
  );
}
