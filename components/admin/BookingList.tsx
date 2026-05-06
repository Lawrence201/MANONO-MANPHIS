'use client';
import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Filter,
    MoreHorizontal,
    Calendar,
    Building2,
    User,
    ArrowUpDown,
    Bed,
    Package,
    Download,
    TrendingUp,
    TrendingDown,
    AlertCircle,
    Clock,
    DollarSign,
    Users,
    CheckCircle2,
    XCircle,
    Sparkles,
    CalendarDays,
    FileSpreadsheet,
    X,
    Edit
} from 'lucide-react';
import EditBookingModal from './EditBookingModal';
import NewBookingModal from './NewBookingModal';

interface BookedHallDetail {
    hallId: number;
    hallName: string;
    amount: number;
    addOns?: { name: string; price: number }[];
}

interface Booking {
    id: number;
    reference: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    eventType: string;
    eventName?: string;
    eventDate: string;
    startTime: string;
    duration: string;
    facilityName: string;
    facilityType: 'Hall' | 'Hostel' | 'Package';
    totalAmount: string;
    paymentStatus: string;
    paymentMethod: string;
    staffMember?: string;
    createdAt: string;
    guests?: number;
    bookedHalls?: BookedHallDetail[];
    profilePicture?: string | null;
    receiptPath?: string | null;
    organization?: string;
    message?: string;
    eventEnd?: string;
    numberOfDays?: number; // For hostel bookings
    numberOfRooms?: number; // For hostel bookings
}

interface GroupedBooking {
    baseReference: string;
    members: Booking[];
    isMultiple: boolean;
    combinedAmount: number;
    primary: Booking;
}

interface Insight {
    id: string;
    type: 'warning' | 'info' | 'success';
    icon: React.ReactNode;
    message: string;
    action?: string;
}

// Style constants for modal buttons
const linkStyle: React.CSSProperties = {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '14px'
};

const primaryButton: React.CSSProperties = {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#111827',
    color: 'white',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer'
};

const secondaryButton: React.CSSProperties = {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: 'white',
    color: '#374151',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer'
};

const ghostButton: React.CSSProperties = {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f9fafb',
    color: '#374151',
    border: '1px solid #e5e7eb',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer'
};

// Helper components for modal sections
const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#6b7280' }}>
            {icon}
            <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', margin: 0 }}>
                {title}
            </h3>
        </div>
        {children}
    </div>
);

const InfoGrid = ({ children }: { children: React.ReactNode }) => (
    <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2,1fr)',
        gap: '16px',
        backgroundColor: '#f9fafb',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
    }}>
        {children}
    </div>
);

const InfoItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
            {label}
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, margin: 0, color: '#111827' }}>
            {children}
        </p>
    </div>
);


const BookingAvatar = ({ src, alt }: { src: string | null | undefined, alt: string }) => {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9CA3AF',
                flexShrink: 0
            }}>
                <User size={18} />
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={36}
            height={36}
            className="rounded-full object-cover border-2 border-gray-200"
            style={{
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #E5E7EB',
                flexShrink: 0
            }}
            onError={() => setError(true)}
            unoptimized
        />
    );
};

export default function BookingList() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'paid'>('all');
    const [facilityFilter, setFacilityFilter] = useState<'all' | 'Hall' | 'Hostel' | 'Package'>('all');
    const [dateFilter, setDateFilter] = useState<string>('');
    const [selectedGroup, setSelectedGroup] = useState<GroupedBooking | null>(null);
    const [editBooking, setEditBooking] = useState<Booking | null>(null);
    // Export modal state
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportStartDate, setExportStartDate] = useState<string>('');
    const [exportEndDate, setExportEndDate] = useState<string>('');
    const [exportFacilityType, setExportFacilityType] = useState<'all' | 'Hall' | 'Hostel' | 'Package'>('all');
    const [exportStatus, setExportStatus] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all');
    const [exportFormat, setExportFormat] = useState<'csv' | 'excel'>('excel');
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [fullEditBooking, setFullEditBooking] = useState<Booking | null>(null);
    const [showNewBookingModal, setShowNewBookingModal] = useState(false);

    // New state for tab navigation and selection
    const [activeTab, setActiveTab] = useState<'all' | 'halls' | 'hostels' | 'packages' | 'special' | 'group' | 'cancelled'>('all');
    const [selectedBookings, setSelectedBookings] = useState<Set<string>>(new Set());

    // Cancel booking state
    const [cancelling, setCancelling] = useState(false);
    const [cancelBookingTarget, setCancelBookingTarget] = useState<Booking | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const [hallRes, hostelRes, packageRes] = await Promise.all([
                fetch('/api/bookings', { cache: 'no-store' }),
                fetch('/api/bookings/hostel', { cache: 'no-store' }),
                fetch('/api/package-bookings?all=true', { cache: 'no-store' })
            ]);

            const hallData = hallRes.ok ? await hallRes.json() : [];
            const hostelData = hostelRes.ok ? await hostelRes.json() : [];
            const packageData = packageRes.ok ? await packageRes.json() : [];

            const normalizedHalls = hallData.map((b: any) => {
                const bookedHallDetails = b.bookedHalls?.map((bh: any) => ({
                    hallId: bh.hallId,
                    hallName: bh.hall?.name || 'Unknown Hall',
                    amount: bh.amount || 0,
                    addOns: bh.addOns?.map((a: any) => ({ name: a.name, price: a.price })) || []
                })) || [];

                const hallNames = bookedHallDetails.map((bh: any) => bh.hallName);
                const facilityName = hallNames.length > 1
                    ? `Multiple (${hallNames.length} Halls)`
                    : (hallNames[0] || 'Unknown Hall');

                return {
                    id: b.id,
                    reference: b.reference,
                    firstName: b.firstName,
                    lastName: b.lastName,
                    email: b.email,
                    phone: b.phone,
                    eventType: b.eventType,
                    eventName: b.eventName || null,
                    eventDate: b.eventDate,
                    startTime: b.startTime,
                    duration: b.duration ? `${b.duration} hours` : '',
                    facilityName,
                    facilityType: 'Hall' as const,
                    totalAmount: b.totalAmount,
                    paymentStatus: b.paymentStatus,
                    paymentMethod: b.paymentMethod,
                    staffMember: b.staffMember,
                    createdAt: b.createdAt,
                    bookedHalls: bookedHallDetails,
                    profilePicture: b.profilePicture || null,
                    receiptPath: b.receiptPath || null,
                    organization: b.organization || '',
                    message: b.message || ''
                };
            });

            const normalizedHostels = hostelData.map((b: any) => ({
                id: b.id,
                reference: b.reference,
                firstName: b.firstName,
                lastName: b.lastName,
                email: b.email,
                phone: b.phone,
                eventType: 'Accommodation',
                eventDate: b.checkInDate,
                startTime: b.checkInTime || '14:00',
                duration: b.duration ? `${b.duration} days` : '',
                facilityName: b.hostel?.name || 'Unknown Lodge',
                facilityType: 'Hostel' as const,
                totalAmount: b.totalAmount.toString(),
                paymentStatus: b.paymentStatus,
                paymentMethod: b.paymentMethod,
                staffMember: b.staffMember,
                createdAt: b.createdAt,
                guests: b.guests || 1,
                profilePicture: b.profilePicture || null,
                receiptPath: b.receiptPath || null,
                organization: b.institution || ''
            }));

            const normalizedPackages = (Array.isArray(packageData) ? packageData : []).map((b: any) => ({
                id: b.id,
                reference: b.reference,
                firstName: b.firstName,
                lastName: b.lastName,
                email: b.email,
                phone: b.phone,
                eventType: b.eventType,
                eventDate: b.eventDate,
                startTime: b.startTime,
                duration: b.duration ? `${b.duration} hours` : '',
                facilityName: b.packageName || 'Event Package',
                facilityType: 'Package' as const,
                totalAmount: b.totalAmount?.toString() || '0',
                paymentStatus: b.paymentStatus,
                paymentMethod: b.paymentMethod,
                staffMember: b.staffMember,
                createdAt: b.createdAt,
                guests: b.guests || 1,
                profilePicture: b.profilePicture || null,
                receiptPath: b.receiptPath || null,
                organization: b.organization || '',
                message: b.message || ''
            }));

            const allBookings = [...normalizedHalls, ...normalizedHostels, ...normalizedPackages].sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setBookings(allBookings);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Statistics
    const stats = useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        // Filter for ONLY confirmed (paid) bookings for the counts
        const confirmedBookings = bookings.filter(b => b.paymentStatus === 'paid');

        const todayBookings = confirmedBookings.filter(b => {
            const d = new Date(b.createdAt);
            d.setHours(0, 0, 0, 0);
            return d.getTime() === today.getTime();
        });

        const thisWeekBookings = confirmedBookings.filter(b => new Date(b.createdAt) >= thisWeekStart);
        const thisMonthBookings = confirmedBookings.filter(b => new Date(b.createdAt) >= thisMonthStart);

        const paidBookings = bookings.filter(b => b.paymentStatus === 'paid');
        const pendingBookings = bookings.filter(b => b.paymentStatus === 'pending');

        const hallBookings = confirmedBookings.filter(b => b.facilityType === 'Hall');
        const hostelBookings = confirmedBookings.filter(b => b.facilityType === 'Hostel');
        const packageBookings = confirmedBookings.filter(b => b.facilityType === 'Package');

        // Monthly bookings by type (only confirmed)
        const hallsThisMonth = thisMonthBookings.filter(b => b.facilityType === 'Hall').length;
        const hostelsThisMonth = thisMonthBookings.filter(b => b.facilityType === 'Hostel').length;
        const packagesThisMonth = thisMonthBookings.filter(b => b.facilityType === 'Package').length;
        const cancelledThisMonth = bookings.filter(b => b.paymentStatus === 'cancelled' && new Date(b.createdAt) >= thisMonthStart).length;
        const cancelled = bookings.filter(b => b.paymentStatus === 'cancelled').length;

        const grossPaidRevenueThisMonth = thisMonthBookings
            .reduce((sum, b) => sum + parseFloat(b.totalAmount || '0'), 0);

        // Total Paid = Only sum of PAID bookings (cancelled bookings are excluded entirely)
        const paidRevenueThisMonth = grossPaidRevenueThisMonth;

        const specialPackages = confirmedBookings.filter(b => (b.facilityType as string) === 'Special Package').length;
        const groupPackages = confirmedBookings.filter(b => (b.facilityType as string) === 'Group Package').length;

        const totalRevenue = bookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || '0'), 0);
        const paidRevenue = paidBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || '0'), 0);
        const pendingRevenue = pendingBookings.reduce((sum, b) => sum + parseFloat(b.totalAmount || '0'), 0);

        return {
            total: confirmedBookings.length,
            today: todayBookings.length,
            thisWeek: thisWeekBookings.length,
            thisMonth: thisMonthBookings.length,
            paid: paidBookings.length,
            pending: pendingBookings.length,
            cancelled,
            halls: hallBookings.length,
            hostels: hostelBookings.length,
            packages: packageBookings.length,
            hallsThisMonth,
            hostelsThisMonth,
            packagesThisMonth,
            cancelledThisMonth,
            paidRevenueThisMonth,
            specialPackages,
            groupPackages,
            totalRevenue,
            paidRevenue,
            pendingRevenue
        };
    }, [bookings]);

    // Generate Smart Insights
    const insights: Insight[] = useMemo(() => {
        const result: Insight[] = [];

        if (stats.pending > 0) {
            result.push({
                id: 'pending-payments',
                type: 'warning',
                icon: <Clock size={16} />,
                message: `${stats.pending} booking${stats.pending > 1 ? 's' : ''} pending payment`,
                action: `GH₵${stats.pendingRevenue.toLocaleString()} awaiting`
            });
        }

        if (stats.today > 0) {
            result.push({
                id: 'today-bookings',
                type: 'info',
                icon: <CalendarDays size={16} />,
                message: `${stats.today} booking${stats.today > 1 ? 's' : ''} scheduled for today`,
                action: 'Review schedule'
            });
        }

        if (stats.thisWeek > 5) {
            result.push({
                id: 'busy-week',
                type: 'success',
                icon: <TrendingUp size={16} />,
                message: `Great week! ${stats.thisWeek} bookings this week`,
                action: '+' + Math.round((stats.thisWeek / 7) * 100) + '% activity'
            });
        }

        if (stats.packages === 0 && stats.total > 0) {
            result.push({
                id: 'no-packages',
                type: 'info',
                icon: <Package size={16} />,
                message: 'No event package bookings yet',
                action: 'Consider promotion'
            });
        }

        return result.slice(0, 3); // Max 3 insights
    }, [stats]);

    // Export to CSV or Excel with date range
    const handleExport = async () => {
        setExporting(true);

        try {
            // Filter bookings based on export criteria
            let exportBookings = [...bookings]; // Create a copy

            // Date range filter - FILTER BY BOOKING CREATION DATE (when booking was received)
            if (exportStartDate) {
                const startDate = new Date(exportStartDate);
                startDate.setHours(0, 0, 0, 0);
                exportBookings = exportBookings.filter(b => new Date(b.createdAt) >= startDate);
            }
            if (exportEndDate) {
                const endDate = new Date(exportEndDate);
                endDate.setHours(23, 59, 59, 999);
                exportBookings = exportBookings.filter(b => new Date(b.createdAt) <= endDate);
            }

            // Facility type filter
            if (exportFacilityType !== 'all') {
                exportBookings = exportBookings.filter(b => b.facilityType === exportFacilityType);
            }

            // Status filter (case-insensitive to handle 'Cancelled' vs 'cancelled')
            if (exportStatus !== 'all') {
                exportBookings = exportBookings.filter(b =>
                    b.paymentStatus.toLowerCase() === exportStatus.toLowerCase()
                );
            }

            if (exportBookings.length === 0) {
                alert('No bookings found for the selected criteria');
                setExporting(false);
                return;
            }

            // Parse amount properly (remove GHS prefix, commas, etc.)
            const parseAmount = (amount: string): number => {
                if (!amount) return 0;
                const numStr = String(amount).replace(/[^\d.]/g, '');
                return parseFloat(numStr) || 0;
            };

            const headers = ['Reference', 'Customer Name', 'Email', 'Phone', 'Organization', 'Facility', 'Type', 'Event Type', 'Event Date', 'Start Time', 'Duration', 'Days', 'Rooms', 'Amount (GHS)', 'Payment Status', 'Payment Method', 'Booking Received'];

            const data = exportBookings.map(b => ({
                'Reference': b.reference,
                'Customer Name': `${b.firstName} ${b.lastName}`,
                'Email': b.email,
                'Phone': b.phone,
                'Organization': b.organization || '',
                'Facility': b.facilityName,
                'Type': b.facilityType,
                'Event Type': b.eventType,
                'Event Date': new Date(b.eventDate).toLocaleDateString('en-GB'),
                'Start Time': b.startTime || '',
                'Duration': b.duration || '',
                'Days': b.facilityType === 'Hostel' ? (b.numberOfDays || parseInt(b.duration) || 1) : '',
                'Rooms': b.facilityType === 'Hostel' ? (b.numberOfRooms || 1) : '',
                'Amount (GHS)': parseAmount(b.totalAmount),
                'Payment Status': b.paymentStatus,
                'Payment Method': b.paymentMethod || '',
                'Booking Received': new Date(b.createdAt).toLocaleDateString('en-GB')
            }));

            // Generate filename
            let filename = 'CampElim_Bookings';
            if (exportFacilityType !== 'all') {
                filename += `_${exportFacilityType}s`;
            }
            if (exportStartDate && exportEndDate) {
                filename += `_${exportStartDate}_to_${exportEndDate}`;
            } else if (exportStartDate) {
                filename += `_from_${exportStartDate}`;
            } else if (exportEndDate) {
                filename += `_until_${exportEndDate}`;
            } else {
                filename += `_${new Date().toISOString().split('T')[0]}`;
            }

            if (exportFormat === 'excel') {
                // Excel export
                const XLSX = await import('xlsx');
                const worksheet = XLSX.utils.json_to_sheet(data);

                // Set column widths
                const colWidths = [
                    { wch: 15 }, // Reference
                    { wch: 25 }, // Customer Name
                    { wch: 30 }, // Email
                    { wch: 15 }, // Phone
                    { wch: 25 }, // Organization
                    { wch: 30 }, // Facility
                    { wch: 10 }, // Type
                    { wch: 20 }, // Event Type
                    { wch: 12 }, // Event Date
                    { wch: 12 }, // Start Time
                    { wch: 10 }, // Duration
                    { wch: 12 }, // Amount
                    { wch: 12 }, // Payment Status
                    { wch: 15 }, // Payment Method
                    { wch: 15 }  // Booking Received
                ];
                worksheet['!cols'] = colWidths;

                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings');
                XLSX.writeFile(workbook, `${filename}.xlsx`);
            } else {
                // CSV export
                const csvRows = data.map(row =>
                    headers.map(header => {
                        const value = row[header as keyof typeof row];
                        const str = String(value || '');
                        // Escape quotes and wrap in quotes if contains comma, quote, or newline
                        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                            return `"${str.replace(/"/g, '""')}"`;
                        }
                        return str;
                    }).join(',')
                );

                const BOM = '\uFEFF';
                const csvContent = BOM + [headers.join(','), ...csvRows].join('\n');
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }

            setShowExportModal(false);
            setTimeout(() => setExporting(false), 1000);
        } catch (error) {
            console.error('Export error:', error);
            alert('Failed to export bookings');
            setExporting(false);
        }
    };

    // Cancel Booking Handler
    const handleCancelBooking = async (booking: Booking) => {
        setCancelling(true);
        try {
            const endpoint = booking.facilityType === 'Hall'
                ? '/api/bookings'
                : booking.facilityType === 'Hostel'
                    ? '/api/bookings/hostel'
                    : '/api/package-bookings';

            const response = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: booking.id,
                    paymentStatus: 'cancelled'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel booking');
            }

            // Refresh all bookings to ensure stats (revenue) update correctly
            await fetchBookings();

            setCancelBookingTarget(null);
            setActiveMenuId(null);
            alert(`Booking ${booking.reference} has been cancelled successfully.`);
        } catch (error) {
            console.error('Cancel booking error:', error);
            alert('Failed to cancel booking. Please try again.');
        } finally {
            setCancelling(false);
        }
    };

    const handleDeleteBooking = async (booking: Booking) => {
        if (!confirm('Are you sure you want to delete this booking?')) return;
        setDeleting(true);
        try {
            const endpoint = booking.facilityType === 'Hall'
                ? `/api/bookings?id=${booking.id}`
                : booking.facilityType === 'Hostel'
                    ? `/api/bookings/hostel?id=${booking.id}`
                    : `/api/package-bookings?id=${booking.id}`;

            const res = await fetch(endpoint, { method: 'DELETE' });

            if (res.ok) {
                setBookings(bookings.filter(b => b.id !== booking.id || b.facilityType !== booking.facilityType));
                setActiveMenuId(null);
            } else {
                // Try to parse error message if available
                const text = await res.text();
                let errorMsg = 'Failed to delete booking';
                if (text) {
                    try {
                        const data = JSON.parse(text);
                        errorMsg = data.message || errorMsg;
                        if (data.error) {
                            errorMsg += `: ${data.error}`;
                        }
                    } catch {
                        errorMsg = text || errorMsg;
                    }
                }
                console.error('Delete failed:', errorMsg);
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Error deleting booking: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
            setDeleting(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!editBooking) return;
        try {
            const endpoint = editBooking.facilityType === 'Hall'
                ? '/api/bookings'
                : editBooking.facilityType === 'Hostel'
                    ? '/api/bookings/hostel'
                    : '/api/package-bookings';

            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editBooking.id, paymentStatus: editBooking.paymentStatus })
            });

            if (res.ok) {
                setBookings(bookings.map(b =>
                    (b.id === editBooking.id && b.facilityType === editBooking.facilityType)
                        ? { ...b, paymentStatus: editBooking.paymentStatus }
                        : b
                ));
                setEditBooking(null);
            }
        } catch (error) {
            alert('Failed to update booking');
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.facilityName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.paymentStatus === statusFilter;
        const matchesFacility = facilityFilter === 'all' || booking.facilityType === facilityFilter;

        let matchesDate = true;
        if (dateFilter) {
            const bookingDate = new Date(booking.eventDate).toISOString().split('T')[0];
            matchesDate = bookingDate === dateFilter;
        }

        // Tab filtering
        let matchesTab = true;
        switch (activeTab) {
            case 'halls':
                matchesTab = booking.facilityType === 'Hall' && booking.paymentStatus !== 'cancelled';
                break;
            case 'hostels':
                matchesTab = booking.facilityType === 'Hostel' && booking.paymentStatus !== 'cancelled';
                break;
            case 'packages':
                matchesTab = booking.facilityType === 'Package' && booking.paymentStatus !== 'cancelled';
                break;
            case 'special':
                // Placeholder - will be configured later
                matchesTab = false;
                break;
            case 'group':
                // Placeholder - will be configured later
                matchesTab = false;
                break;
            case 'cancelled':
                // Placeholder - will be configured later
                matchesTab = booking.paymentStatus === 'cancelled';
                break;
            case 'all':
            default:
                matchesTab = true;
        }

        return matchesSearch && matchesStatus && matchesFacility && matchesDate && matchesTab;
    });

    const getBaseReference = (ref: string): string => {
        const parts = ref.split('-');
        if (parts.length >= 3 && !isNaN(Number(parts[parts.length - 1]))) {
            return parts.slice(0, -1).join('-');
        }
        return ref;
    };

    const groupedBookings: GroupedBooking[] = useMemo(() => {
        const groupMap = new Map<string, Booking[]>();

        filteredBookings.forEach(booking => {
            // Use full reference for all booking types to prevent incorrect grouping
            // Each booking is its own unique entry
            const key = `${booking.facilityType}-${booking.id}`;
            groupMap.set(key, [booking]);
        });

        const result: GroupedBooking[] = [];
        groupMap.forEach((members, baseReference) => {
            result.push({
                baseReference,
                members,
                isMultiple: members.length > 1,
                combinedAmount: members.reduce((sum, b) => sum + parseFloat(b.totalAmount), 0),
                primary: members[0]
            });
        });

        result.sort((a, b) => new Date(b.primary.createdAt).getTime() - new Date(a.primary.createdAt).getTime());
        return result;
    }, [filteredBookings]);

    const toggleMenu = (uniqueId: string) => {
        setActiveMenuId(activeMenuId === uniqueId ? null : uniqueId);
    };

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return { bg: '#d1fae5', text: '#059669' };
            case 'pending': return { bg: '#fef3c7', text: '#d97706' };
            case 'cancelled': return { bg: '#fee2e2', text: '#991b1b' }; // User requested red
            default: return { bg: '#F3F4F6', text: '#374151' };
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getFacilityIcon = (type: string) => {
        switch (type) {
            case 'Hall': return <Building2 size={16} color="#F59E0B" />;
            case 'Hostel': return <Bed size={16} color="#3B82F6" />;
            case 'Package': return <Package size={16} color="#16A34A" />;
            default: return <Building2 size={16} color="#6B7280" />;
        }
    };

    return (
        <div style={{ fontFamily: 'Inter, sans-serif', color: '#1F2937' }}>

            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: 0 }}>Bookings Management</h1>
                    <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '4px' }}>Manage and track all facility bookings</p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowNewBookingModal(true)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 16px', borderRadius: '8px',
                            backgroundColor: '#2563eb', color: 'white',
                            border: 'none', fontSize: '14px', fontWeight: 600,
                            cursor: 'pointer', transition: 'all 0.2s',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        <Calendar size={16} />
                        New Booking
                    </button>
                    <button
                        onClick={() => setShowExportModal(true)}
                        disabled={exporting}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 16px', borderRadius: '8px',
                            border: '1px solid #E5E7EB', backgroundColor: 'white',
                            color: '#374151', fontSize: '14px', fontWeight: 500,
                            cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <FileSpreadsheet size={16} />
                        {exporting ? 'Exporting...' : 'Export'}
                    </button>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '10px 16px', borderRadius: '8px',
                            border: '1px solid #E5E7EB',
                            backgroundColor: showFilters ? '#1F2937' : 'white',
                            color: showFilters ? 'white' : '#374151',
                            fontSize: '14px', fontWeight: 500, cursor: 'pointer'
                        }}
                    >
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </div>

            {/* AI-Powered Insights */}
            {insights.length > 0 && (
                <div style={{
                    backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                    border: '1px solid #E5E7EB', marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <Sparkles size={20} color="#F59E0B" />
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Smart Insights</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {insights.map(insight => (
                            <div key={insight.id} style={{
                                flex: '1 1 280px', display: 'flex', alignItems: 'flex-start', gap: '12px',
                                padding: '16px', borderRadius: '8px', backgroundColor: '#F9FAFB',
                                borderLeft: `4px solid ${insight.type === 'warning' ? '#F59E0B' : insight.type === 'success' ? '#10B981' : '#3B82F6'}`
                            }}>
                                <div style={{
                                    padding: '8px', borderRadius: '50%',
                                    backgroundColor: insight.type === 'warning' ? '#FEF3C7' : insight.type === 'success' ? '#D1FAE5' : '#DBEAFE',
                                    color: insight.type === 'warning' ? '#D97706' : insight.type === 'success' ? '#059669' : '#2563EB'
                                }}>
                                    {insight.icon}
                                </div>
                                <div>
                                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#374151', margin: 0 }}>{insight.message}</p>
                                    {insight.action && <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0' }}>{insight.action}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Statistics Grid */}
            <div style={{
                backgroundColor: 'white', borderRadius: '12px', border: '1px solid #E5E7EB',
                marginBottom: '24px', overflow: 'hidden'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #E5E7EB' }}>
                    {/* Row 1 */}
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#3B82F6' }}>{stats.total}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Total Bookings</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#8B5CF6' }}>{stats.thisMonth}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>This Month</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#06B6D4' }}>{stats.thisWeek}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>This Week</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#EC4899' }}>{stats.today}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Today</div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid #E5E7EB' }}>
                    {/* Row 2 - Monthly Bookings by Type */}
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#F59E0B' }}>{stats.hallsThisMonth}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Hall Booking This Month</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#3B82F6' }}>{stats.hostelsThisMonth}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Lodge Booking This Month</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#16A34A' }}>{stats.packagesThisMonth}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Packages This Month</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#EF4444' }}>{stats.cancelledThisMonth}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Book Cancelled This Month</div>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
                    {/* Row 3 - Additional Stats */}
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#059669' }}>GH₵{stats.paidRevenueThisMonth.toLocaleString()}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Total Paid this month</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#F59E0B' }}>{stats.pending}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Pending Number</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center', borderRight: '1px solid #E5E7EB' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#8B5CF6' }}>{stats.specialPackages}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Special Packages</div>
                    </div>
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <div style={{ fontSize: '32px', fontWeight: 700, color: '#EC4899' }}>{stats.groupPackages}</div>
                        <div style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>Group Retreat Package</div>
                    </div>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
                <div style={{
                    backgroundColor: 'white', borderRadius: '12px', padding: '20px',
                    border: '1px solid #E5E7EB', marginBottom: '24px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>Advanced Filters</h3>
                        <button onClick={() => { setStatusFilter('all'); setFacilityFilter('all'); setDateFilter(''); }}
                            style={{ fontSize: '13px', color: '#6B7280', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Clear All
                        </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Status</label>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }}>
                                <option value="all">All Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Facility Type</label>
                            <select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value as any)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }}>
                                <option value="all">All Types</option>
                                <option value="Hall">Halls</option>
                                <option value="Hostel">Lodges</option>
                                <option value="Package">Packages</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Event Date</label>
                            <input type="date" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '6px' }}>Search</label>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Navigation & Search Bar - New Section */}
            <div style={{ marginBottom: '24px' }}>
                {/* Full-Width Search Bar */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    border: '1px solid #E5E7EB',
                    marginBottom: '16px'
                }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} color="#9CA3AF" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                            type="text"
                            placeholder="Search bookings, reference, customer, facility..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 12px 12px 42px',
                                borderRadius: '8px',
                                border: '1px solid #E5E7EB',
                                fontSize: '14px',
                                outline: 'none',
                                backgroundColor: '#F9FAFB'
                            }}
                        />
                    </div>
                </div>

                {/* Tab Navigation */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    border: '1px solid #E5E7EB',
                    marginBottom: '16px'
                }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                        {[
                            { key: 'all', label: 'Total Booking', count: bookings.length },
                            { key: 'halls', label: 'Halls', count: stats.halls },
                            { key: 'hostels', label: 'Lodge', count: stats.hostels },
                            { key: 'packages', label: 'Event Packages', count: stats.packages },
                            { key: 'special', label: 'Special Package', count: 0 },
                            { key: 'group', label: 'Group Package', count: 0 },
                            { key: 'cancelled', label: 'Cancelled Booking', count: stats.cancelled }
                        ].map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as any)}
                                style={{
                                    padding: '12px 8px',
                                    borderRadius: '20px',
                                    border: 'none',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    backgroundColor: activeTab === tab.key ? '#2563EB' : '#F3F4F6',
                                    color: activeTab === tab.key ? 'white' : '#6B7280',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    width: '100%',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {tab.label}
                                <span style={{
                                    backgroundColor: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : '#E5E7EB',
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    color: activeTab === tab.key ? 'white' : '#6B7280'
                                }}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>



                {/* Booking Directory Header */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px 12px 0 0',
                    padding: '16px 20px',
                    border: '1px solid #E5E7EB',
                    borderBottom: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>
                            Booking Directory
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0 0' }}>
                            Complete list of all bookings
                        </p>
                    </div>

                </div>
            </div>

            {/* Table */}
            <div style={{
                backgroundColor: 'white', borderRadius: '0 0 12px 12px', border: '1px solid #E5E7EB',
                borderTop: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'visible'
            }}>
                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>Loading bookings...</div>
                ) : groupedBookings.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
                        <Calendar size={48} color="#D1D5DB" style={{ marginBottom: '16px' }} />
                        <p style={{ fontSize: '16px', fontWeight: 500 }}>No bookings found</p>
                        <p style={{ fontSize: '14px' }}>Try adjusting your filters</p>
                    </div>
                ) : (
                    <>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #F3F4F6', backgroundColor: '#F9FAFB' }}>
                                    <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Reference</th>
                                    <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</th>
                                    <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Facility</th>
                                    <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date & Time</th>
                                    <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                                    <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</th>
                                    <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedBookings.map((group, index) => {
                                    const booking = group.primary;
                                    const statusStyle = getStatusStyles(booking.paymentStatus);
                                    return (
                                        <tr key={group.baseReference} style={{ borderBottom: index < groupedBookings.length - 1 ? '1px solid #F3F4F6' : 'none' }}>
                                            <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                                <span style={{ color: '#10B981', fontWeight: 600, fontSize: '14px' }}>{group.baseReference}</span>
                                                {group.isMultiple && (
                                                    <span style={{ marginLeft: '8px', backgroundColor: '#EEF2FF', color: '#4F46E5', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 600 }}>
                                                        {group.members.length} Halls
                                                    </span>
                                                )}
                                                <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{formatDate(booking.createdAt)}</div>
                                            </td>

                                            <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <BookingAvatar
                                                        src={booking.profilePicture}
                                                        alt={booking.firstName}
                                                    />
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>{booking.firstName} {booking.lastName}</div>
                                                        <div style={{ fontSize: '12px', color: '#6B7280' }}>{booking.email}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {getFacilityIcon(booking.facilityType)}
                                                    <div>
                                                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{booking.facilityName}</div>
                                                        <div style={{ fontSize: '12px', color: '#6B7280' }}>{booking.eventType}{booking.eventName && ` • ${booking.eventName}`}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>{formatDate(booking.eventDate)}</div>
                                                <div style={{ fontSize: '12px', color: '#6B7280' }}>{booking.startTime} • {booking.duration}</div>
                                            </td>

                                            <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                                <span style={{
                                                    backgroundColor: statusStyle.bg, color: statusStyle.text,
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600
                                                }}>
                                                    {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                                                </span>
                                            </td>

                                            <td style={{ padding: '16px 20px', verticalAlign: 'top' }}>
                                                <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>GH₵ {group.combinedAmount.toLocaleString()}</span>
                                                <div style={{ fontSize: '11px', color: '#6B7280' }}>{booking.paymentMethod}</div>
                                            </td>

                                            <td style={{ padding: '16px 20px', verticalAlign: 'top', textAlign: 'center', position: 'relative' }}>
                                                <button onClick={() => toggleMenu(`${booking.facilityType}-${booking.id}`)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px' }}>
                                                    <MoreHorizontal size={20} />
                                                </button>

                                                {activeMenuId === `${booking.facilityType}-${booking.id}` && (
                                                    <div style={{
                                                        position: 'absolute', right: '100%', top: '0', marginRight: '8px',
                                                        backgroundColor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                        borderRadius: '8px', border: '1px solid #E5E7EB', zIndex: 100,
                                                        width: '160px', textAlign: 'left', overflow: 'hidden'
                                                    }}>
                                                        <div style={{ padding: '4px' }}>
                                                            <div onClick={() => { setSelectedGroup(group); setActiveMenuId(null); }}
                                                                style={{ padding: '8px 12px', fontSize: '13px', color: 'white', backgroundColor: '#10B981', borderRadius: '4px', cursor: 'pointer', marginBottom: '2px', fontWeight: 500 }}>
                                                                View Details
                                                            </div>
                                                            {/* For Hall bookings, always use on-demand receipt regeneration */}
                                                            {booking.facilityType === 'Hall' && booking.paymentStatus === 'paid' ? (
                                                                <a href={`/api/receipts/booking/${booking.id}`} target="_blank" rel="noopener noreferrer" download
                                                                    onClick={() => setActiveMenuId(null)}
                                                                    style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: '#2563EB', cursor: 'pointer', textDecoration: 'none' }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>
                                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                                                    </svg>
                                                                    Download Receipt
                                                                </a>
                                                            ) : null}
                                                            {/* For Package bookings, use package receipt endpoint */}
                                                            {booking.facilityType === 'Package' && booking.paymentStatus === 'paid' ? (
                                                                <a href={`/api/receipts/package/${booking.id}`} target="_blank" rel="noopener noreferrer" download
                                                                    onClick={() => setActiveMenuId(null)}
                                                                    style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: '#16A34A', cursor: 'pointer', textDecoration: 'none' }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>
                                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                                                    </svg>
                                                                    Download Receipt
                                                                </a>
                                                            ) : null}
                                                            {/* For Hostel bookings, use hostel receipt endpoint */}
                                                            {booking.facilityType === 'Hostel' && booking.paymentStatus === 'paid' ? (
                                                                <a href={`/api/receipts/hostel/${booking.id}`} target="_blank" rel="noopener noreferrer" download
                                                                    onClick={() => setActiveMenuId(null)}
                                                                    style={{ display: 'block', padding: '8px 12px', fontSize: '13px', color: '#3B82F6', cursor: 'pointer', textDecoration: 'none' }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px', display: 'inline-block', verticalAlign: 'middle' }}>
                                                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                                        <polyline points="7 10 12 15 17 10"></polyline>
                                                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                                                    </svg>
                                                                    Download Receipt
                                                                </a>
                                                            ) : null}
                                                            <div onClick={() => { setEditBooking(booking); setActiveMenuId(null); }}
                                                                style={{ padding: '8px 12px', fontSize: '13px', color: '#374151', cursor: 'pointer' }}>
                                                                Edit Status
                                                            </div>
                                                            {/* Cancel Booking - only show if not already cancelled */}
                                                            {booking.paymentStatus !== 'cancelled' && (
                                                                <div onClick={() => { setCancelBookingTarget(booking); setActiveMenuId(null); }}
                                                                    style={{ padding: '8px 12px', fontSize: '13px', color: '#F59E0B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                    <XCircle size={14} />
                                                                    Cancel Booking
                                                                </div>
                                                            )}
                                                            <div onClick={() => handleDeleteBooking(booking)}
                                                                style={{ padding: '8px 12px', fontSize: '13px', color: '#EF4444', cursor: 'pointer', borderTop: '1px solid #F3F4F6' }}>
                                                                {deleting ? 'Deleting...' : 'Delete'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>

                        <div style={{ padding: '16px 20px', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F9FAFB' }}>
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>
                                Showing <strong>{groupedBookings.length}</strong> of <strong>{bookings.length}</strong> bookings
                            </span>
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>
                                Total Revenue: <strong style={{ color: '#059669' }}>GH₵ {stats.totalRevenue.toLocaleString()}</strong>
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* View Details Modal - Professional Design */}
            {selectedGroup && (
                <div
                    onClick={() => setSelectedGroup(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '14px',
                            maxWidth: '760px',
                            width: '95%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            border: '1px solid #e5e7eb'
                        }}
                    >
                        {/* HEADER */}
                        <div style={{
                            padding: '20px 24px',
                            borderBottom: '1px solid #e5e7eb',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                <div style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    backgroundColor: '#f3f4f6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {selectedGroup.primary.facilityType === 'Hall' ? (
                                        <Building2 size={22} color="#374151" />
                                    ) : selectedGroup.primary.facilityType === 'Hostel' ? (
                                        <Bed size={22} color="#374151" />
                                    ) : (
                                        <Package size={22} color="#374151" />
                                    )}
                                </div>

                                <div>
                                    <h2 style={{
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: '#111827',
                                        margin: 0
                                    }}>
                                        Booking Details
                                    </h2>
                                    <p style={{
                                        fontSize: '13px',
                                        color: '#6b7280',
                                        marginTop: '4px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {selectedGroup.primary.reference}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedGroup(null)}
                                style={{
                                    width: '34px',
                                    height: '34px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    backgroundColor: '#f9fafb',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={18} color="#374151" />
                            </button>
                        </div>

                        {/* TAGS */}
                        <div style={{ padding: '16px 24px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{
                                fontSize: '12px',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                fontWeight: 500
                            }}>
                                {selectedGroup.primary.facilityType}
                            </span>

                            <span style={{
                                fontSize: '12px',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                backgroundColor: selectedGroup.primary.paymentStatus === 'paid'
                                    ? '#ecfdf5'
                                    : '#fffbeb',
                                color: selectedGroup.primary.paymentStatus === 'paid'
                                    ? '#065f46'
                                    : '#92400e',
                                border: '1px solid #e5e7eb',
                                fontWeight: 600
                            }}>
                                {selectedGroup.primary.paymentStatus.toUpperCase()}
                            </span>
                        </div>

                        {/* CONTENT */}
                        <div style={{ padding: '24px' }}>

                            {/* CUSTOMER INFO */}
                            <Section title="Customer Information" icon={<User size={18} />}>
                                <InfoGrid>
                                    <InfoItem label="Full Name">
                                        {selectedGroup.primary.firstName} {selectedGroup.primary.lastName}
                                    </InfoItem>

                                    {selectedGroup.primary.organization && (
                                        <InfoItem label="Organization">
                                            {selectedGroup.primary.organization}
                                        </InfoItem>
                                    )}

                                    <InfoItem label="Email">
                                        <a href={`mailto:${selectedGroup.primary.email}`} style={linkStyle}>
                                            {selectedGroup.primary.email}
                                        </a>
                                    </InfoItem>

                                    <InfoItem label="Phone">
                                        <a href={`tel:${selectedGroup.primary.phone}`} style={linkStyle}>
                                            {selectedGroup.primary.phone}
                                        </a>
                                    </InfoItem>
                                </InfoGrid>
                            </Section>

                            {/* EVENT/ACCOMMODATION INFO */}
                            <Section title={selectedGroup.primary.facilityType === 'Hostel' ? 'Accommodation Details' : 'Event Details'} icon={<Calendar size={18} />}>
                                <InfoGrid>
                                    {selectedGroup.primary.facilityType === 'Hostel' ? (
                                        <>
                                            <InfoItem label="Check-In Date">
                                                {formatDate(selectedGroup.primary.eventDate)}
                                            </InfoItem>

                                            <InfoItem label="Check-Out Date">
                                                {(() => {
                                                    const checkIn = new Date(selectedGroup.primary.eventDate);
                                                    const days = selectedGroup.primary.numberOfDays || parseInt(selectedGroup.primary.duration) || 1;
                                                    const checkOut = new Date(checkIn);
                                                    checkOut.setDate(checkOut.getDate() + days);
                                                    return formatDate(checkOut.toISOString());
                                                })()}
                                            </InfoItem>

                                            <InfoItem label="Duration">
                                                {selectedGroup.primary.numberOfDays || parseInt(selectedGroup.primary.duration) || 1} Day(s)
                                            </InfoItem>

                                            <InfoItem label="Rooms Booked">
                                                {selectedGroup.primary.numberOfRooms || 1} Room(s)
                                            </InfoItem>

                                            {selectedGroup.primary.guests && (
                                                <InfoItem label="Guests">
                                                    {selectedGroup.primary.guests} Guest(s)
                                                </InfoItem>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <InfoItem label="Event Type">
                                                {selectedGroup.primary.eventType}
                                            </InfoItem>

                                            {selectedGroup.primary.eventName && (
                                                <InfoItem label="Event Name">
                                                    {selectedGroup.primary.eventName}
                                                </InfoItem>
                                            )}

                                            <InfoItem label="Date">
                                                {formatDate(selectedGroup.primary.eventDate)}
                                            </InfoItem>

                                            <InfoItem label="Time & Duration">
                                                {selectedGroup.primary.startTime} • {selectedGroup.primary.duration}
                                            </InfoItem>
                                        </>
                                    )}
                                </InfoGrid>
                            </Section>

                            {/* CUSTOMER MESSAGE */}
                            {selectedGroup.primary.message && (
                                <Section title="Customer Message" icon={<AlertCircle size={18} />}>
                                    <div style={{
                                        backgroundColor: '#fffbeb',
                                        borderRadius: '12px',
                                        padding: '16px 20px',
                                        border: '1px solid #fde68a'
                                    }}>
                                        <p style={{
                                            fontSize: '14px',
                                            color: '#92400e',
                                            margin: 0,
                                            fontStyle: 'italic',
                                            lineHeight: 1.6
                                        }}>
                                            "{selectedGroup.primary.message}"
                                        </p>
                                    </div>
                                </Section>
                            )}

                            {/* PAYMENT */}
                            <Section title="Payment Information" icon={<DollarSign size={18} />}>
                                <div style={{
                                    backgroundColor: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '20px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ color: '#6b7280' }}>Total Amount</span>
                                        <strong style={{ fontSize: '20px' }}>
                                            GH₵ {selectedGroup.combinedAmount.toLocaleString()}
                                        </strong>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px', borderTop: '1px solid #e5e7eb', paddingTop: '12px' }}>
                                        <InfoItem label="Method">
                                            {selectedGroup.primary.paymentMethod || 'N/A'}
                                        </InfoItem>

                                        <InfoItem label="Status">
                                            {selectedGroup.primary.paymentStatus.toUpperCase()}
                                        </InfoItem>
                                    </div>
                                </div>
                            </Section>

                            {/* ACTIONS */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                                <button style={primaryButton}>
                                    Download Receipt
                                </button>

                                {/* Edit Booking - Full edit for Hall bookings only */}
                                {selectedGroup.primary.facilityType === 'Hall' && (
                                    <button
                                        onClick={() => {
                                            setFullEditBooking(selectedGroup.primary);
                                            setSelectedGroup(null);
                                        }}
                                        style={{
                                            ...secondaryButton,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <Edit size={14} />
                                        Edit Booking
                                    </button>
                                )}

                                {/* Quick Edit Status - for all booking types */}
                                <button
                                    onClick={() => {
                                        setEditBooking(selectedGroup.primary);
                                        setSelectedGroup(null);
                                    }}
                                    style={ghostButton}
                                >
                                    Edit Status
                                </button>

                                <button
                                    onClick={() => setSelectedGroup(null)}
                                    style={ghostButton}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>)}

            {/* Edit Status Modal */}
            {editBooking && (
                <div onClick={() => setEditBooking(null)}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '90%' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>Update Payment Status</h3>
                        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>Booking: <strong>{editBooking.reference}</strong></p>

                        <select value={editBooking.paymentStatus}
                            onChange={(e) => setEditBooking({ ...editBooking, paymentStatus: e.target.value })}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', marginBottom: '20px' }}>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                        </select>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setEditBooking(null)}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}>
                                Cancel
                            </button>
                            <button onClick={handleUpdateStatus}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#10B981', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeMenuId && <div onClick={() => setActiveMenuId(null)} style={{ position: 'fixed', inset: 0, zIndex: 50 }} />}

            {/* Export Modal */}
            {showExportModal && (
                <div onClick={() => setShowExportModal(false)}
                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div onClick={(e) => e.stopPropagation()}
                        style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '90%' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ padding: '10px', backgroundColor: '#DBEAFE', borderRadius: '10px' }}>
                                    <FileSpreadsheet size={24} color="#2563EB" />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>Export Bookings</h3>
                                    <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Download booking records</p>
                                </div>
                            </div>
                            <button onClick={() => setShowExportModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Date Range */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Received From</label>
                                    <input
                                        type="date"
                                        value={exportStartDate}
                                        onChange={(e) => setExportStartDate(e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Received To</label>
                                    <input
                                        type="date"
                                        value={exportEndDate}
                                        onChange={(e) => setExportEndDate(e.target.value)}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Facility Type */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Facility Type</label>
                                <select
                                    value={exportFacilityType}
                                    onChange={(e) => setExportFacilityType(e.target.value as any)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                                >
                                    <option value="all">All Types</option>
                                    <option value="Hall">Halls Only</option>
                                    <option value="Hostel">Lodges Only</option>
                                    <option value="Package">Packages Only</option>
                                </select>
                            </div>

                            {/* Payment Status */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Payment Status</label>
                                <select
                                    value={exportStatus}
                                    onChange={(e) => setExportStatus(e.target.value as any)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="paid">Paid Only</option>
                                    <option value="pending">Pending Only</option>
                                    <option value="cancelled">Cancelled Only</option>
                                </select>
                            </div>

                            {/* Export Format */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '6px' }}>Export Format</label>
                                <select
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value as any)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '14px', outline: 'none', backgroundColor: 'white' }}
                                >
                                    <option value="excel">📊 Excel (.xlsx) - Recommended</option>
                                    <option value="csv">📄 CSV (.csv)</option>
                                </select>
                            </div>

                            {/* Quick Select Buttons */}
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '8px' }}>Quick Select</label>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <button
                                        onClick={() => {
                                            const today = new Date();
                                            setExportStartDate(today.toISOString().split('T')[0]);
                                            setExportEndDate(today.toISOString().split('T')[0]);
                                        }}
                                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '12px', cursor: 'pointer', fontWeight: 500, color: '#374151' }}
                                    >Today</button>
                                    <button
                                        onClick={() => {
                                            const today = new Date();
                                            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                            setExportStartDate(weekAgo.toISOString().split('T')[0]);
                                            setExportEndDate(today.toISOString().split('T')[0]);
                                        }}
                                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '12px', cursor: 'pointer', fontWeight: 500, color: '#374151' }}
                                    >Last 7 Days</button>
                                    <button
                                        onClick={() => {
                                            const today = new Date();
                                            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                                            setExportStartDate(monthStart.toISOString().split('T')[0]);
                                            setExportEndDate(today.toISOString().split('T')[0]);
                                        }}
                                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '12px', cursor: 'pointer', fontWeight: 500, color: '#374151' }}
                                    >This Month</button>
                                    <button
                                        onClick={() => {
                                            setExportStartDate('');
                                            setExportEndDate('');
                                        }}
                                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #E5E7EB', backgroundColor: '#F9FAFB', fontSize: '12px', cursor: 'pointer', fontWeight: 500, color: '#374151' }}
                                    >All Time</button>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button
                                onClick={() => setShowExportModal(false)}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #E5E7EB', backgroundColor: 'white', color: '#374151', fontSize: '14px', fontWeight: 500, cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExport}
                                disabled={exporting}
                                style={{ flex: 1, padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#2563EB', color: 'white', fontSize: '14px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            >
                                <Download size={16} />
                                {exporting ? 'Exporting...' : (exportFormat === 'excel' ? 'Export Excel' : 'Export CSV')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* New Booking Modal */}
            {showNewBookingModal && (
                <NewBookingModal
                    onClose={() => setShowNewBookingModal(false)}
                    onSuccess={() => {
                        fetchBookings();
                        setShowNewBookingModal(false);
                    }}
                />
            )}

            {/* Full Edit Booking Modal - Hall bookings only */}
            {fullEditBooking && fullEditBooking.facilityType === 'Hall' && (
                <EditBookingModal
                    booking={fullEditBooking}
                    onClose={() => setFullEditBooking(null)}
                    onSuccess={() => {
                        fetchBookings();
                        setFullEditBooking(null);
                    }}
                />
            )}

            {/* Cancel Booking Confirmation Modal */}
            {cancelBookingTarget && (
                <div
                    onClick={() => setCancelBookingTarget(null)}
                    style={{
                        position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                            maxWidth: '440px', width: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '16px',
                                backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 16px'
                            }}>
                                <XCircle size={32} color="#F59E0B" />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
                                Cancel Booking?
                            </h3>
                            <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
                                Are you sure you want to cancel this booking?
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: '#F9FAFB', borderRadius: '12px', padding: '16px',
                            marginBottom: '24px', border: '1px solid #E5E7EB'
                        }}>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: '#6B7280' }}>Reference:</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{cancelBookingTarget.reference}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: '#6B7280' }}>Customer:</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{cancelBookingTarget.firstName} {cancelBookingTarget.lastName}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: '#6B7280' }}>Facility:</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>{cancelBookingTarget.facilityName}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: '13px', color: '#6B7280' }}>Amount:</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>GH₵ {parseFloat(cancelBookingTarget.totalAmount).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setCancelBookingTarget(null)}
                                disabled={cancelling}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '10px',
                                    border: '1px solid #E5E7EB', backgroundColor: 'white',
                                    color: '#374151', fontSize: '14px', fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={() => handleCancelBooking(cancelBookingTarget)}
                                disabled={cancelling}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '10px',
                                    border: 'none', backgroundColor: '#F59E0B',
                                    color: 'white', fontSize: '14px', fontWeight: 600,
                                    cursor: cancelling ? 'not-allowed' : 'pointer',
                                    opacity: cancelling ? 0.7 : 1
                                }}
                            >
                                {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
