'use client';
import { Clock, MapPin, Users, Calendar, ArrowRight, Sparkles, Building2, Bed, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface EventItemProps {
    id: number | string;
    category: string;
    title: string;
    time: string;
    location: string;
    attendees: number;
    dateObj: Date;
    type?: 'hall' | 'hostel' | 'package';
    paymentStatus?: string;
}

function EventItem({ category, title, time, location, attendees, dateObj, type, paymentStatus }: EventItemProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(dateObj);
    eventDate.setHours(0, 0, 0, 0);
    const isToday = eventDate.getTime() === today.getTime();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = eventDate.getTime() === tomorrow.getTime();
    const isCancelled = paymentStatus?.toLowerCase() === 'cancelled';

    // Type-based colors
    const getTypeColors = () => {
        switch (type) {
            case 'hall': return { bg: '#EFF6FF', border: '#BFDBFE', icon: '#3B82F6' };
            case 'hostel': return { bg: '#FAF5FF', border: '#E9D5FF', icon: '#8B5CF6' };
            case 'package': return { bg: '#F0FDF4', border: '#BBF7D0', icon: '#16A34A' };
            default: return { bg: '#F3F4F6', border: '#E5E7EB', icon: '#6B7280' };
        }
    };

    const typeColors = getTypeColors();

    // Category badge colors
    const getCategoryColors = () => {
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('service') || categoryLower.includes('church')) {
            return { bg: '#FEF3C7', text: '#D97706' };
        } else if (categoryLower.includes('conference') || categoryLower.includes('summit')) {
            return { bg: '#DCFCE7', text: '#166534' };
        } else if (categoryLower.includes('seminar') || categoryLower.includes('workshop')) {
            return { bg: '#F3E8FF', text: '#9333EA' };
        } else if (categoryLower.includes('retreat') || categoryLower.includes('hostel')) {
            return { bg: '#E0F2FE', text: '#0284C7' };
        } else if (categoryLower.includes('wedding')) {
            return { bg: '#FCE7F3', text: '#BE185D' };
        }
        return { bg: '#F3F4F6', text: '#374151' };
    };

    const catColors = getCategoryColors();

    const getTypeIcon = () => {
        switch (type) {
            case 'hall': return <Building2 size={18} />;
            case 'hostel': return <Bed size={18} />;
            case 'package': return <Package size={18} />;
            default: return <Calendar size={18} />;
        }
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'stretch',
            backgroundColor: isCancelled ? '#FEF2F2' : typeColors.bg,
            borderRadius: '12px',
            marginBottom: '12px',
            border: isCancelled ? '1px solid #FCA5A5' : `1px solid ${typeColors.border}`,
            overflow: 'hidden',
            transition: 'all 0.2s',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Left accent bar */}
            <div style={{
                width: '4px',
                backgroundColor: isCancelled ? '#EF4444' : (isToday ? '#EF4444' : isTomorrow ? '#F59E0B' : typeColors.icon),
                flexShrink: 0
            }} />

            <div style={{ padding: '16px', flex: 1, display: 'flex', alignItems: 'center', gap: '14px' }}>
                {/* Icon */}
                <div style={{
                    width: '44px', height: '44px',
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: typeColors.icon,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                }}>
                    {getTypeIcon()}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <h4 style={{
                            fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            maxWidth: '180px',
                            textDecoration: isCancelled ? 'line-through' : 'none',
                            opacity: isCancelled ? 0.6 : 1
                        }}>
                            {title}
                        </h4>
                        <span style={{
                            backgroundColor: catColors.bg,
                            color: catColors.text,
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                        }}>
                            {category}
                        </span>
                        {isCancelled && (
                            <span style={{
                                backgroundColor: '#FEE2E2',
                                color: '#991B1B',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: '700'
                            }}>
                                CANCELLED
                            </span>
                        )}
                        {isToday && (
                            <span style={{
                                backgroundColor: '#FEE2E2',
                                color: '#DC2626',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: '700'
                            }}>
                                TODAY
                            </span>
                        )}
                        {isTomorrow && (
                            <span style={{
                                backgroundColor: '#FEF3C7',
                                color: '#D97706',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: '700'
                            }}>
                                TOMORROW
                            </span>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', color: '#6B7280', fontSize: '12px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} />
                            <span>{time}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} />
                            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                                {location}
                            </span>
                        </div>
                        {attendees > 0 && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Users size={13} />
                                <span>{attendees} guests</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Date badge */}
                <div style={{
                    textAlign: 'center',
                    backgroundColor: 'white',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    minWidth: '50px'
                }}>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: isToday ? '#DC2626' : '#111827' }}>
                        {dateObj.getDate()}
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: '500', color: '#6B7280', textTransform: 'uppercase' }}>
                        {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UpcomingEvents() {
    const [events, setEvents] = useState<EventItemProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const [hallRes, hostelRes, packageRes] = await Promise.all([
                    fetch('/api/bookings', { cache: 'no-store' }),
                    fetch('/api/bookings/hostel', { cache: 'no-store' }),
                    fetch('/api/package-bookings?all=true', { cache: 'no-store' })
                ]);

                // Helper to safely parse JSON or return empty array if response is HTML or fails
                const safeJson = async (res: Response) => {
                    try {
                        if (res.ok) {
                            const contentType = res.headers.get('content-type');
                            if (contentType && contentType.includes('application/json')) {
                                return await res.json();
                            }
                        }
                        return [];
                    } catch (e) {
                        console.error('JSON Parse error:', e);
                        return [];
                    }
                };

                const hallData = await safeJson(hallRes);
                const hostelData = await safeJson(hostelRes);
                const packageData = await safeJson(packageRes);
                const now = new Date();
                now.setHours(0, 0, 0, 0);

                const normalizedHalls = Array.isArray(hallData) ? hallData
                    .map((b: any) => {
                        const hallNames = b.bookedHalls?.map((bh: any) => bh.hall?.name).filter(Boolean) || [];
                        const locationName = hallNames.length > 1
                            ? `Multiple (${hallNames.length} Halls)`
                            : (hallNames[0] || 'Unknown Hall');
                        const displayTitle = b.eventName || b.organization || `${b.firstName} ${b.lastName}`;

                        return {
                            id: b.id,
                            category: b.eventType || 'Event',
                            title: displayTitle,
                            location: locationName,
                            attendees: 0,
                            dateObj: new Date(b.eventDate),
                            timeStr: b.startTime,
                            type: 'hall' as const,
                            paymentStatus: b.paymentStatus
                        };
                    })
                    .filter((e: any) => e.dateObj >= now && e.paymentStatus?.toLowerCase() === 'paid') : [];

                const normalizedHostels = Array.isArray(hostelData) ? hostelData
                    .map((b: any) => ({
                        id: b.id,
                        category: 'Lodge Stay',
                        title: `${b.firstName} ${b.lastName}`,
                        location: b.hostel?.name || 'Unknown Lodge',
                        attendees: b.guests || 1,
                        dateObj: new Date(b.checkInDate),
                        timeStr: b.checkInTime || '12:00 PM',
                        type: 'hostel' as const,
                        paymentStatus: b.paymentStatus
                    }))
                    .filter((e: any) => e.dateObj >= now && e.paymentStatus?.toLowerCase() === 'paid') : [];

                const normalizedPackages = Array.isArray(packageData) ? packageData
                    .map((b: any) => ({
                        id: b.id,
                        category: b.eventType || b.event_type || 'Event Package',
                        title: b.eventName || b.event_name || b.organization || `${b.firstName || b.first_name} ${b.lastName || b.last_name}`,
                        location: b.package?.name || b.packageName || 'Event Package',
                        attendees: b.guests || b.expected_guests || 0,
                        dateObj: new Date(b.eventDate || b.event_date),
                        timeStr: b.startTime || b.start_time || '9:00 AM',
                        type: 'package' as const,
                        paymentStatus: b.paymentStatus || b.payment_status
                    }))
                    .filter((e: any) => e.dateObj >= now && (e.paymentStatus?.toLowerCase() === 'paid')) : [];

                const combined = [...normalizedHalls, ...normalizedHostels, ...normalizedPackages];
                combined.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

                const formattedEvents = combined.slice(0, 5).map(e => {
                    return {
                        ...e,
                        time: e.timeStr
                    };
                });

                setEvents(formattedEvents);
            } catch (error) {
                console.error("Failed to fetch upcoming events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div style={{
                backgroundColor: 'white', padding: '32px', borderRadius: '16px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px', height: '40px', border: '3px solid #E5E7EB',
                        borderTop: '3px solid #10B981', borderRadius: '50%',
                        animation: 'spin 1s linear infinite', margin: '0 auto 12px'
                    }} />
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            border: '1px solid #e5e7eb',
            overflow: 'hidden'
        }}>
            {/* Header */}
            <div style={{
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Sparkles size={18} color="#374151" />
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#111827',
                            margin: 0
                        }}>
                            Upcoming Events
                        </h3>
                        <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            margin: 0
                        }}>
                            Next {events.length} scheduled
                        </p>
                    </div>
                </div>

                <Link href="/admin/events" style={{ textDecoration: 'none' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#374151',
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        padding: '7px 12px',
                        borderRadius: '6px'
                    }}>
                        View All <ArrowRight size={14} />
                    </button>
                </Link>
            </div>

            {/* Events List */}
            <div style={{ padding: '16px' }}>
                {events.length === 0 ? (
                    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            backgroundColor: '#f3f4f6',
                            borderRadius: '50%',
                            margin: '0 auto 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Calendar size={24} color="#9ca3af" />
                        </div>
                        <p style={{
                            color: '#6b7280',
                            fontSize: '14px',
                            margin: 0
                        }}>
                            No upcoming events scheduled
                        </p>
                    </div>
                ) : (
                    events.map((ev, i) => (
                        <EventItem key={i} {...ev} />
                    ))
                )}
            </div>
        </div>

    );
}
