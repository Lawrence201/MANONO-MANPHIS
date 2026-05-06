'use client';
import { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Filter,
    Calendar,
    Users,
    TrendingUp,
    Clock,
    MapPin,
    Building2,
    PartyPopper,
    Briefcase,
    Heart,
    Church,
    Music,
    GraduationCap,
    BarChart3,
    Package
} from 'lucide-react';

interface BookedEvent {
    id: number;
    reference: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    eventType: string;
    eventName: string | null;
    eventDate: string;
    startTime: string;
    duration: string;
    totalAmount: string;
    paymentStatus: string;
    createdAt: string;
    bookedHalls?: { hallName: string }[];
    facilityType: 'Hall' | 'Package';
    facilityName?: string;
}

// Event type styling
const eventTypeStyles: Record<string, { color: string; bg: string; icon: any; label: string }> = {
    'wedding': { color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)', icon: Heart, label: 'Wedding' },
    'conference': { color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', icon: Briefcase, label: 'Conference' },
    'retreat': { color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', icon: Church, label: 'Retreat' },
    'birthday': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', icon: PartyPopper, label: 'Birthday' },
    'concert': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', icon: Music, label: 'Concert' },
    'graduation': { color: '#6366F1', bg: 'rgba(99, 102, 241, 0.1)', icon: GraduationCap, label: 'Graduation' },
    'vigil': { color: '#14B8A6', bg: 'rgba(20, 184, 166, 0.1)', icon: Church, label: 'Vigil' },
    'seminar': { color: '#0EA5E9', bg: 'rgba(14, 165, 233, 0.1)', icon: Briefcase, label: 'Seminar' },
    'other': { color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', icon: Calendar, label: 'Other' }
};

const paymentStatusStyles: Record<string, { color: string; bg: string }> = {
    'paid': { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
    'pending': { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' },
    'failed': { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' }
};

export default function EventList() {
    const [bookings, setBookings] = useState<BookedEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [timeFilter, setTimeFilter] = useState<string>('all'); // all, upcoming, past

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const [hallRes, packageRes] = await Promise.all([
                fetch('/api/bookings'),
                fetch('/api/package-bookings?all=true')
            ]);

            const hallData = hallRes.ok ? await hallRes.json() : [];
            const packageData = packageRes.ok ? await packageRes.json() : [];

            // Transform hall bookings
            const transformedHalls = hallData.map((b: any) => {
                const hallNames = b.bookedHalls?.map((bh: any) => bh.hall?.name || 'Unknown Hall') || [];
                return {
                    ...b,
                    bookedHalls: b.bookedHalls?.map((bh: any) => ({
                        hallName: bh.hall?.name || 'Unknown Hall'
                    })) || [],
                    facilityType: 'Hall' as const,
                    facilityName: hallNames.length > 1 ? `Multiple (${hallNames.length} Halls)` : (hallNames[0] || 'Unknown Hall')
                };
            });

            // Transform package bookings
            const transformedPackages = (Array.isArray(packageData) ? packageData : []).map((b: any) => ({
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
                duration: b.duration,
                totalAmount: b.totalAmount?.toString() || '0',
                paymentStatus: b.paymentStatus,
                createdAt: b.createdAt,
                bookedHalls: [],
                facilityType: 'Package' as const,
                facilityName: b.packageName || 'Event Package'
            }));

            const allBookings = [...transformedHalls, ...transformedPackages].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setBookings(allBookings);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    // Get unique event types from bookings
    const uniqueEventTypes = useMemo(() => {
        const types = new Set(bookings.map(b => b.eventType.toLowerCase()));
        return Array.from(types);
    }, [bookings]);

    // Stats calculations
    const stats = useMemo(() => {
        const now = new Date();
        const paidOnly = bookings.filter(b => b.paymentStatus?.toLowerCase() === 'paid');
        
        const total = paidOnly.length;
        const upcoming = paidOnly.filter(b => new Date(b.eventDate) >= now).length;
        const thisMonth = paidOnly.filter(b => {
            const date = new Date(b.eventDate);
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length;
        const paidBookings = total; // Already filtered

        return { total, upcoming, thisMonth, paidBookings };
    }, [bookings]);

    // Event type distribution for chart
    const typeDistribution = useMemo(() => {
        const types: Record<string, number> = {};
        const paidOnly = bookings.filter(b => b.paymentStatus?.toLowerCase() === 'paid');
        
        paidOnly.forEach(b => {
            const type = b.eventType.toLowerCase();
            types[type] = (types[type] || 0) + 1;
        });
        return Object.entries(types).sort((a, b) => b[1] - a[1]);
    }, [bookings]);

    // Monthly trend data
    const monthlyData = useMemo(() => {
        const months: Record<string, number> = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const paidOnly = bookings.filter(b => b.paymentStatus?.toLowerCase() === 'paid');

        paidOnly.forEach(b => {
            const date = new Date(b.eventDate);
            const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
            months[monthKey] = (months[monthKey] || 0) + 1;
        });

        return Object.entries(months).slice(-6);
    }, [bookings]);

    // Filtered bookings
    const filteredBookings = useMemo(() => {
        const now = new Date();
        return bookings.filter(b => {
            const matchesSearch =
                b.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.eventType.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = typeFilter === 'all' || b.eventType.toLowerCase() === typeFilter.toLowerCase();

            const eventDate = new Date(b.eventDate);
            const matchesTime = timeFilter === 'all' ||
                (timeFilter === 'upcoming' && eventDate >= now) ||
                (timeFilter === 'past' && eventDate < now);

            return matchesSearch && matchesType && matchesTime;
        }).sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
    }, [bookings, searchTerm, typeFilter, timeFilter]);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
        });
    };

    const getEventTypeStyle = (type: string) => {
        return eventTypeStyles[type.toLowerCase()] || eventTypeStyles['other'];
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#F59E0B', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                    <p style={{ color: '#6B7280' }}>Loading booked events...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>Events & Programs</h1>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>Track and monitor all client-booked events at Camp Elim</p>
            </div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Booked Events', value: stats.total, icon: Calendar, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
                    { label: 'Upcoming Events', value: stats.upcoming, icon: Clock, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)' },
                    { label: 'This Month', value: stats.thisMonth, icon: TrendingUp, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
                    { label: 'Paid Bookings', value: stats.paidBookings, icon: Users, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' }
                ].map((stat, i) => (
                    <div key={i} style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '12px', backgroundColor: stat.bg, borderRadius: '12px' }}>
                                <stat.icon size={24} color={stat.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</p>
                                <p style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                {/* Event Type Distribution */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <BarChart3 size={18} color="#6B7280" />
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Events by Type</h3>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {typeDistribution.length > 0 ? typeDistribution.slice(0, 6).map(([type, count], i) => {
                            const style = getEventTypeStyle(type);
                            const percentage = bookings.length > 0 ? (count / bookings.length) * 100 : 0;
                            return (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <style.icon size={14} color={style.color} />
                                            <span style={{ fontSize: '13px', color: '#374151', textTransform: 'capitalize' }}>{style.label}</span>
                                        </div>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{count}</span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#f3f4f6', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${percentage}%`,
                                            height: '100%',
                                            backgroundColor: style.color,
                                            borderRadius: '4px',
                                            transition: 'width 0.3s'
                                        }}></div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '20px' }}>No events booked yet</p>
                        )}
                    </div>
                </div>

                {/* Monthly Trend */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <TrendingUp size={18} color="#6B7280" />
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Booking Trend</h3>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '150px' }}>
                        {monthlyData.length > 0 ? monthlyData.map(([month, count], i) => {
                            const maxCount = Math.max(...monthlyData.map(d => d[1] as number));
                            const height = maxCount > 0 ? ((count as number) / maxCount) * 100 : 0;
                            return (
                                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{
                                        height: `${Math.max(height, 10)}%`,
                                        backgroundColor: '#F59E0B',
                                        borderRadius: '6px 6px 0 0',
                                        minHeight: '20px',
                                        transition: 'height 0.3s'
                                    }}></div>
                                    <p style={{ fontSize: '10px', color: '#6B7280', marginTop: '8px' }}>{month.split(' ')[0]}</p>
                                    <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>{count}</p>
                                </div>
                            );
                        }) : (
                            <p style={{ color: '#9CA3AF', margin: 'auto' }}>No booking data</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Search & Filters */}
            <div style={{
                backgroundColor: 'white', borderRadius: '16px', padding: '20px', marginBottom: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6'
            }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Search events by name, type, or client..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 12px 12px 42px',
                                border: '1px solid #e5e7eb', borderRadius: '10px',
                                fontSize: '14px', outline: 'none'
                            }}
                        />
                    </div>

                    <select
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        style={{
                            padding: '12px 16px', border: '1px solid #e5e7eb',
                            borderRadius: '10px', fontSize: '14px', cursor: 'pointer', outline: 'none'
                        }}
                    >
                        <option value="all">All Time</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past Events</option>
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        style={{
                            padding: '12px 16px', border: '1px solid #e5e7eb',
                            borderRadius: '10px', fontSize: '14px', cursor: 'pointer', outline: 'none'
                        }}
                    >
                        <option value="all">All Event Types</option>
                        {uniqueEventTypes.map(type => (
                            <option key={type} value={type} style={{ textTransform: 'capitalize' }}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Events Table */}
            <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Event</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Client</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Date & Time</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Venue</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Amount</th>
                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.length > 0 ? filteredBookings.map((booking) => {
                            const typeStyle = getEventTypeStyle(booking.eventType);
                            const TypeIcon = typeStyle.icon;
                            const paymentStyle = paymentStatusStyles[booking.paymentStatus?.toLowerCase()] || paymentStatusStyles['pending'];
                            const venueName = booking.facilityType === 'Package'
                                ? booking.facilityName
                                : (booking.bookedHalls?.map(h => h.hallName).join(', ') || booking.facilityName || 'N/A');
                            const VenueIcon = booking.facilityType === 'Package' ? Package : Building2;
                            const venueColor = booking.facilityType === 'Package' ? '#16A34A' : '#9CA3AF';

                            return (
                                <tr key={`${booking.facilityType}-${booking.id}`} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '10px',
                                                backgroundColor: typeStyle.bg, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <TypeIcon size={18} color={typeStyle.color} />
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                                                    {booking.eventName || typeStyle.label}
                                                </p>
                                                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                                    <span style={{
                                                        display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                                                        fontSize: '11px', fontWeight: '500',
                                                        backgroundColor: typeStyle.bg, color: typeStyle.color
                                                    }}>
                                                        {typeStyle.label}
                                                    </span>
                                                    {booking.facilityType === 'Package' && (
                                                        <span style={{
                                                            display: 'inline-block', padding: '2px 8px', borderRadius: '4px',
                                                            fontSize: '10px', fontWeight: '600',
                                                            backgroundColor: 'rgba(22, 163, 74, 0.1)', color: '#16A34A'
                                                        }}>
                                                            PACKAGE
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontWeight: '500', color: '#374151', fontSize: '14px' }}>
                                            {booking.firstName} {booking.lastName}
                                        </p>
                                        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{booking.phone}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontSize: '13px', color: '#374151' }}>{formatDate(booking.eventDate)}</p>
                                        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{booking.startTime} • {booking.duration}</p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <VenueIcon size={14} color={venueColor} />
                                            <span style={{ fontSize: '13px', color: '#374151' }}>{venueName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px' }}>
                                            ₵{parseFloat(booking.totalAmount || '0').toLocaleString()}
                                        </p>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{
                                            display: 'inline-block', padding: '6px 12px', borderRadius: '8px',
                                            fontSize: '12px', fontWeight: '500',
                                            backgroundColor: paymentStyle.bg, color: paymentStyle.color,
                                            textTransform: 'capitalize'
                                        }}>
                                            {booking.paymentStatus || 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6} style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
                                    <Calendar size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                                    <p>No booked events found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
