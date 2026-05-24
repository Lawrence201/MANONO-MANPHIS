import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        // 1. Calculate Total Revenue from Billboards
        const billboardRevenueAgg = await prisma.billboardBooking.aggregate({
            _sum: {
                totalPrice: true
            },
            where: {
                status: { in: ['approved', 'active', 'paused'] }
            }
        });
        const billboardRevenue = Number(billboardRevenueAgg._sum.totalPrice || 0);

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

        // 4. Count Total Clients (unique emails from bookings)
        const uniqueClients = await prisma.billboardBooking.groupBy({
            by: ['email']
        });
        const totalClientsCount = uniqueClients.length;

        // 5. Total bookings count (Export Orders)
        const totalBookingsCount = await prisma.exportOrder.count();

        // 6. Calculate monthly billboard revenue trends
        const allBookings = await prisma.billboardBooking.findMany({
            where: {
                status: { in: ['approved', 'active'] }
            },
            select: {
                totalPrice: true,
                createdAt: true
            }
        });

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyData = monthNames.map(month => ({ month, Billboards: 0 }));

        allBookings.forEach(booking => {
            const date = new Date(booking.createdAt);
            const monthIndex = date.getMonth();
            if (monthIndex >= 0 && monthIndex < 12) {
                monthlyData[monthIndex].Billboards += Number(booking.totalPrice || 0);
            }
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

        const formattedExportOrders = recentExportOrders.map(o => ({
            id: o.referenceNumber,
            customer: o.companyName || o.buyerType,
            company: o.companyName,
            country: o.destinationCountry,
            product: o.product.name,
            quantity: `${Number(o.quantityRequested)} ${o.product.moqUnit}`,
            amount: Number(o.customsValue) || 0,
            currency: "USD",
            payment: "pending",
            status: o.status,
            progress: o.status === 'pending' ? 10 : o.status === 'approved' ? 50 : o.status === 'shipped' ? 80 : 100,
            date: new Date(o.createdAt),
            type: "export"
        }));

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

        // 9. Fetch active export order destinations
        const activeExportDestinations = await prisma.exportOrder.findMany({
            where: {
                status: { in: ['approved', 'processing', 'in_transit'] }
            },
            select: {
                destinationCountry: true
            },
            distinct: ['destinationCountry']
        });
        const exportLocations = activeExportDestinations.map(d => d.destinationCountry);

        return NextResponse.json({
            success: true,
            data: {
                totalRevenue: billboardRevenue,
                activeBillboardsCount,
                totalBillboards,
                pendingApprovalsCount,
                totalClientsCount,
                totalBookingsCount,
                monthlyData,
                recentBookings: allRecentActivity,
                slotStats,
                exportLocations
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
