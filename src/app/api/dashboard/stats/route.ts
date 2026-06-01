import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Always fetch fresh data — never serve a cached response
export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Calculate Total Revenue from Billboards
        const billboardRevenueAgg = await prisma.billboardBooking.aggregate({
            _sum: { totalPrice: true },
            where: { status: { in: ['approved', 'active', 'paused'] } }
        });
        const billboardRevenue = Number(billboardRevenueAgg._sum.totalPrice || 0);

        const exportRevenueAgg = await prisma.exportOrder.findMany({
            where: { status: { in: ['approved', 'processing', 'in_transit', 'shipped', 'delivered', 'paid'] } },
            select: { totalEstimatedCost: true, customsValue: true, quantityRequested: true, product: { select: { pricePerUnit: true } } }
        });
        const exportRevenue = exportRevenueAgg.reduce((acc, order) => {
            const val = Number(order.totalEstimatedCost) || Number(order.customsValue) || (Number(order.quantityRequested) * Number(order.product.pricePerUnit || 0));
            return acc + val;
        }, 0);

        const globalTotalRevenue = billboardRevenue + exportRevenue;

        // 2. Count Active Billboards (billboards with at least one booking)
        const totalBillboards = await prisma.billboard.count();
        const activeBillboardsGroup = await prisma.billboardBooking.groupBy({
            by: ['billboardId'],
            where: {
                status: { in: ['approved', 'active', 'paused'] },
                startDate: { lte: new Date() },
                endDate: { gte: new Date() }
            }
        });
        const activeBillboardsCount = activeBillboardsGroup.length;

        // 3. Count Pending Approvals (bookings with status 'pending')
        const pendingApprovalsCount = await prisma.billboardBooking.count({
            where: {
                status: 'pending'
            }
        });

        // Count Pending Export Orders
        const pendingOrdersCount = await prisma.exportOrder.count({
            where: {
                status: 'pending'
            }
        });

        // 4. Count Total Clients (unique emails from bookings)
        const uniqueClients = await prisma.billboardBooking.groupBy({
            by: ['email']
        });
        const totalClientsCount = uniqueClients.length;

        // 5. Total export orders count (Approved/Processing)
        const totalBookingsCount = await prisma.exportOrder.count({
            where: { status: { in: ['approved', 'processing', 'in_transit', 'shipped', 'delivered', 'paid'] } }
        });

        // 6. Monthly revenue — Billboards (GH₵) + Export streams (GH₵)
        const allBookings = await prisma.billboardBooking.findMany({
            where: { status: { in: ['approved', 'active'] } },
            select: { totalPrice: true, createdAt: true, billboard: { select: { name: true, city: true } } }
        });

        const allExportForChart = await prisma.exportOrder.findMany({
            where: { status: { in: ['approved', 'processing', 'in_transit', 'shipped', 'delivered', 'paid'] } },
            select: {
                createdAt: true,
                quantityRequested: true,
                customsValue: true,
                totalEstimatedCost: true,
                product: { select: { name: true, pricePerUnit: true } }
            }
        });

        const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
        const monthlyData = monthNames.map(month => ({
            month, Billboards: 0, Honey: 0, Shea: 0, Cashew: 0
        }));

        allBookings.forEach(b => {
            const idx = new Date(b.createdAt).getMonth();
            monthlyData[idx].Billboards += Number(b.totalPrice || 0);
        });

        allExportForChart.forEach(o => {
            const idx = new Date(o.createdAt).getMonth();
            const rev = Number(o.totalEstimatedCost) || Number(o.customsValue) || (Number(o.quantityRequested) * Number(o.product.pricePerUnit || 0));
            const name = o.product.name.toLowerCase();
            if (name.includes('honey'))  monthlyData[idx].Honey  += rev;
            else if (name.includes('shea'))   monthlyData[idx].Shea   += rev;
            else if (name.includes('cashew')) monthlyData[idx].Cashew += rev;
        });

        // 7. Fetch recent bookings and format them for the dashboard table
        const recentBookings = await prisma.billboardBooking.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 5,
            include: {
                billboard: true
            }
        });

        const formattedBookings = recentBookings.map(b => {
            const orderId = `BKG-${String(b.id).padStart(4, '0')}`;
            
            // Calculate progress as % of time elapsed
            const startDate = new Date(b.startDate).getTime();
            const endDate = new Date(b.endDate).getTime();
            const now = Date.now();
            
            let progress = 0;
            if (b.status === 'completed' || b.status === 'rejected') {
                progress = 100;
            } else if (now <= startDate) {
                progress = 0; // 0% time elapsed before it starts
            } else if (now >= endDate) {
                progress = 100; // 100% time elapsed after it ends
            } else {
                const totalDuration = endDate - startDate;
                const timePassed = now - startDate;
                progress = Math.max(0, Math.min(100, Math.round((timePassed / totalDuration) * 100)));
            }

            let displayStatus = b.status;
            if (now > endDate && b.status !== 'rejected' && b.status !== 'cancelled') {
                displayStatus = 'Completed';
            } else if ((b.status === 'active' || b.status === 'approved') && now < startDate) {
                const daysUntilStart = Math.max(1, Math.ceil((startDate - now) / (1000 * 60 * 60 * 24)));
                displayStatus = `Active in ${daysUntilStart}d`;
            }

            return {
                id: orderId,
                customer: b.fullName,
                company: b.companyName || "Personal Booking",
                country: b.billboard.city || "Ghana",
                product: b.billboard.name,
                quantity: `${b.slotsRequested} Slot${b.slotsRequested > 1 ? 's' : ''}`,
                amount: Number(b.totalPrice),
                currency: "GH₵",
                payment: b.paymentStatus,
                status: displayStatus,
                progress: progress,
                date: new Date(b.createdAt),
                type: "billboard"
            };
        });

        // Fetch recent export orders
        const recentExportOrders = await prisma.exportOrder.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { product: true }
        });

        const formattedExportOrders = recentExportOrders.map(o => {
            const calculatedAmount = Number(o.totalEstimatedCost) || Number(o.customsValue) || (Number(o.quantityRequested) * Number(o.product.pricePerUnit || 0));
            
            return {
                id: o.referenceNumber,
                customer: o.companyName || o.buyerType,
                company: o.companyName,
                country: o.destinationCountry,
                product: o.product.name,
                quantity: `${Number(o.quantityRequested)} ${o.product.moqUnit}`,
                amount: calculatedAmount,
                currency: "GH₵",
                payment: o.status === 'paid' || o.status === 'approved' ? 'paid' : 'pending',
                status: o.status,
                progress: o.status === 'pending' ? 10 : (o.status === 'approved' || o.status === 'paid') ? 50 : o.status === 'shipped' ? 80 : 100,
                date: new Date(o.createdAt),
                type: "export"
            };
        });

        // Combine and sort by date
        const allRecentActivity = [...formattedBookings, ...formattedExportOrders]
            .sort((a, b) => b.date.getTime() - a.date.getTime())
            .slice(0, 8);

        // 8. Calculate Slot Statistics for the Pipeline Funnel Chart
        const allBillboards = await prisma.billboard.findMany({ select: { maxSlots: true } });
        const totalSlots = allBillboards.reduce((acc, b) => acc + (b.maxSlots || 12), 0);

        const allSlotBookings = await prisma.billboardBooking.findMany({
            select: { status: true, slotsRequested: true, startDate: true, endDate: true }
        });

        let reservedSlots = 0;
        let activeSlots = 0;
        let expiredSlots = 0;
        const now = new Date();

        allSlotBookings.forEach(b => {
            if (b.status === 'completed' || b.status === 'rejected') {
                expiredSlots += b.slotsRequested;
                return;
            }

            if (now < b.startDate) {
                // If it hasn't started yet, it is just reserved
                reservedSlots += b.slotsRequested;
            } else if (now > b.endDate) {
                // If it has ended
                expiredSlots += b.slotsRequested;
            } else {
                // Currently running timeframe
                if (b.status === 'pending') {
                    reservedSlots += b.slotsRequested;
                } else {
                    activeSlots += b.slotsRequested;
                }
            }
        });

        const availableSlots = Math.max(0, totalSlots - (activeSlots + reservedSlots));
        
        const slotStats = {
            availableSlots,
            reservedSlots,
            activeSlots,
            expiredSlots,
            maintenanceSlots: 0 // Mocked for now since Billboards don't have a status field yet
        };

        // 9. Fetch active export order destinations + per-country totals
        const activeExportOrders = await prisma.exportOrder.findMany({
            where: {
                status: { in: ['approved', 'processing', 'in_transit', 'shipped', 'delivered', 'paid'] }
            },
            select: {
                destinationCountry: true,
                quantityRequested: true,
                customsValue: true,
                totalEstimatedCost: true,
                product: { select: { pricePerUnit: true, moqUnit: true } }
            }
        });

        // Normalize "Country Name (ISO)" → "ISO" (e.g. "Russia (RU)" → "RU")
        const toIso = (raw: string): string => {
            const m = raw.match(/\(([A-Z]{2})\)\s*$/);
            return m ? m[1] : raw;
        };

        // Unique destination ISO codes (for map markers)
        const exportLocations = [...new Set(activeExportOrders.map(d => toIso(d.destinationCountry)))];

        // Per-country summary: total units, revenue, and unit label
        const countryMap: Record<string, { units: number; revenue: number; unit: string }> = {};
        activeExportOrders.forEach(o => {
            const iso   = toIso(o.destinationCountry);
            const qty   = Number(o.quantityRequested) || 0;
            const rev   = Number(o.totalEstimatedCost) || Number(o.customsValue) || (qty * Number(o.product.pricePerUnit || 0));
            const unit  = o.product.moqUnit || 'units';
            if (!countryMap[iso]) {
                countryMap[iso] = { units: 0, revenue: 0, unit };
            }
            countryMap[iso].units   += qty;
            countryMap[iso].revenue += rev;
        });

        const maxUnits       = Math.max(...Object.values(countryMap).map(v => v.units), 1);
        const totalRevenue   = Object.values(countryMap).reduce((s, v) => s + v.revenue, 0) || 1;

        const exportCountrySummary = Object.entries(countryMap)
            .sort((a, b) => b[1].revenue - a[1].revenue)
            .slice(0, 6)
            .map(([code, v]) => ({
                code,
                units:      Math.round(v.units),
                unit:       v.unit,
                revenue:    Math.round(v.revenue),
                percentage: Math.round((v.units / maxUnits) * 100),
                share:      Math.round((v.revenue / totalRevenue) * 100),
            }));

        // 10. Fetch recent reviews
        const recentReviews = await prisma.review.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // 11. Calculate Inventory Pipeline (Honey Focus)
        const honeyProducts = await prisma.product.findMany({
            where: { 
                OR: [
                    { name: { contains: 'Honey', mode: 'insensitive' } },
                    { category: { contains: 'Honey', mode: 'insensitive' } },
                    { category: { in: ['raw', 'processed', 'wild', 'organic'] } }
                ]
            }
        });
        
        const honeyTotal = honeyProducts.reduce((sum, p) => sum + (Number(p.stockQuantity) || 0), 0);

        const honeyOrders = await prisma.exportOrder.findMany({
            where: { product: { name: { contains: 'Honey', mode: 'insensitive' } } },
            select: { 
              status: true, 
              quantityRequested: true, 
              unitMeasurement: true, 
              product: { select: { packagingSize: true, stockUnit: true } } 
            }
        });

        let honeyReserved = 0;
        let honeyProcessing = 0;
        let honeyShipped = 0;

        honeyOrders.forEach(o => {
            let qty = Number(o.quantityRequested) || 0;
            
            if (o.product) {
              const orderUnit = (o.unitMeasurement || '').toLowerCase();
              const stockUnit = (o.product.stockUnit || '').toLowerCase();
              if (orderUnit && stockUnit && orderUnit !== stockUnit && !orderUnit.includes(stockUnit) && !stockUnit.includes(orderUnit)) {
                 if (o.product.packagingSize) {
                   const match = o.product.packagingSize.match(/(\d+(?:\.\d+)?)/);
                   if (match) {
                      qty = qty * Number(match[1]);
                   }
                 }
              }
            }

            if (o.status === 'pending') honeyReserved += qty;
            else if (['processing', 'approved', 'paid'].includes(o.status)) honeyProcessing += qty;
            else if (['shipped', 'delivered', 'in_transit'].includes(o.status)) honeyShipped += qty;
        });

        const inventoryStats = {
            totalStock: honeyTotal,
            available: Math.max(0, honeyTotal - honeyProcessing - honeyShipped),
            reserved: honeyReserved,
            processing: honeyProcessing,
            shipped: honeyShipped
        };

        // --- PRODUCT PERFORMANCE COMPUTATION ---
        const commodityMap: Record<string, number> = {};
        allExportForChart.forEach(o => {
            const rev = Number(o.totalEstimatedCost) || Number(o.customsValue) || (Number(o.quantityRequested) * Number(o.product.pricePerUnit || 0));
            let name = o.product.name;
            if (name.toLowerCase().includes('honey')) name = 'Honey';
            else if (name.toLowerCase().includes('shea')) name = 'Shea Butter';
            else if (name.toLowerCase().includes('cashew')) name = 'Cashew';
            
            if (!commodityMap[name]) commodityMap[name] = 0;
            commodityMap[name] += rev;
        });
        const commodityPerformance = Object.entries(commodityMap)
            .map(([product, revenue]) => ({ product, revenue }))
            .sort((a, b) => b.revenue - a.revenue);

        const adMap: Record<string, number> = {};
        allBookings.forEach(b => {
            const rev = Number(b.totalPrice || 0);
            const name = b.billboard?.name || 'Unknown Billboard';
            if (!adMap[name]) adMap[name] = 0;
            adMap[name] += rev;
        });
        const adPerformance = Object.entries(adMap)
            .map(([product, revenue]) => ({ product, revenue }))
            .sort((a, b) => b.revenue - a.revenue);

        // --- AD LOCATION PERFORMANCE COMPUTATION ---
        const adLocationMap: Record<string, number> = {};
        allBookings.forEach(b => {
            const rev = Number(b.totalPrice || 0);
            const city = b.billboard?.city || 'Others';
            const formattedCity = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
            if (!adLocationMap[formattedCity]) adLocationMap[formattedCity] = 0;
            adLocationMap[formattedCity] += rev;
        });
        
        const totalAdRevenue = Object.values(adLocationMap).reduce((s, v) => s + v, 0) || 1;
        const topAdLocations = Object.entries(adLocationMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5) // top 5
            .map(([name, revenue]) => ({
                name,
                revenue,
                share: Math.round((revenue / totalAdRevenue) * 100)
            }));

        return NextResponse.json({
            success: true,
            data: {
                totalRevenue: globalTotalRevenue,
                activeBillboardsCount,
                totalBillboards,
                pendingApprovalsCount,
                pendingOrdersCount,
                totalClientsCount,
                totalBookingsCount,
                monthlyData,
                recentBookings: allRecentActivity,
                slotStats,
                inventoryStats,
                exportLocations,
                exportCountrySummary,
                recentReviews,
                commodityPerformance,
                adPerformance,
                topAdLocations
            }
        });
    } catch (error: any) {
        console.error('Stats Fetch Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard stats' },
            { status: 500 }
        );
    }
}
