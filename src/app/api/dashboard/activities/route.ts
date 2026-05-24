import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Fetch latest activities from each relevant model
        const [billboardBookings, exportOrders, leads, quotations] = await Promise.all([
            prisma.billboardBooking.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.exportOrder.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { product: true }
            }),
            prisma.lead.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.quotation.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        // 2. Map them into consistent Activity items
        const activities = [
            ...billboardBookings.map(b => ({
                id: `bb-${b.id}`,
                type: 'order',
                icon: 'order',
                text: `New Billboard booking "${b.campaignTitle}" confirmed for ${b.fullName} — GH₵${Number(b.totalPrice).toLocaleString()}`,
                createdAt: b.createdAt.toISOString()
            })),
            ...exportOrders.map(o => ({
                id: `export-${o.id}`,
                type: 'shipment',
                icon: 'shipment',
                text: `New Export Order for ${o.product?.name || 'Commodity'} placed by ${o.companyName || o.buyerType} to ${o.destinationCountry}`,
                createdAt: o.createdAt.toISOString()
            })),
            ...leads.map(lead => ({
                id: `lead-${lead.id}`,
                type: 'lead',
                icon: 'lead',
                text: `New Lead captured: ${lead.name} is interested in ${lead.serviceType}`,
                createdAt: lead.createdAt.toISOString()
            })),
            ...quotations.map(q => ({
                id: `quote-${q.id}`,
                type: 'quote',
                icon: 'quote',
                text: `Quotation sent to ${q.customer} for ${q.qty} of ${q.product} — $${Number(q.amount).toLocaleString()}`,
                createdAt: q.createdAt.toISOString()
            }))
        ];

        // 3. Sort by createdAt descending
        activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ success: true, data: activities.slice(0, 10) });

    } catch (error: any) {
        console.error('Activities Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch platform activities' },
            { status: 500 }
        );
    }
}
