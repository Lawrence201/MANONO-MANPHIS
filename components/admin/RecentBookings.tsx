'use client';
import { ArrowRight, Clock, Building2, Bed, Package, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BookingItem {
    id: number | string;
    type: 'hall' | 'hostel' | 'package';
    name: string;
    space: string;
    status: string;
    date: string;
    time: string;
    amount: string;
    paymentStatus: string;
    createdAt: string;
}

export default function RecentBookings() {
    const [bookings, setBookings] = useState<BookingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hallRes, hostelRes, packageRes] = await Promise.all([
                    fetch('/api/bookings', { cache: 'no-store' }),
                    fetch('/api/bookings/hostel', { cache: 'no-store' }),
                    fetch('/api/package-bookings?all=true', { cache: 'no-store' })
                ]);

                const hallData = hallRes.ok && hallRes.headers.get('content-type')?.includes('application/json') 
                    ? await hallRes.json() 
                    : [];
                const hostelData = hostelRes.ok && hostelRes.headers.get('content-type')?.includes('application/json')
                    ? await hostelRes.json()
                    : [];
                const packageData = packageRes.ok && packageRes.headers.get('content-type')?.includes('application/json')
                    ? await packageRes.json()
                    : [];

                const normalizedHalls = Array.isArray(hallData) ? hallData.map((b: any) => {
                    const hallNames = b.bookedHalls?.map((bh: any) => bh.hall?.name).filter(Boolean) || [];
                    const spaceName = hallNames.length > 1
                        ? `Multiple (${hallNames.length} Halls)`
                        : (hallNames[0] || 'Unknown Hall');

                    return {
                        id: b.id,
                        type: 'hall' as const,
                        name: b.organization || `${b.firstName} ${b.lastName}`,
                        space: spaceName,
                        status: b.paymentStatus === 'cancelled' ? 'Cancelled' : (b.paymentStatus === 'paid' ? 'Confirmed' : 'Pending'),
                        date: new Date(b.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        time: b.startTime,
                        amount: `GH₵ ${Number(b.totalAmount).toLocaleString()}`,
                        paymentStatus: b.paymentStatus === 'cancelled' ? 'Cancelled' : (b.paymentStatus === 'paid' ? 'Paid' : 'Due'),
                        createdAt: b.createdAt
                    };
                }) : [];

                const normalizedHostels = Array.isArray(hostelData) ? hostelData.map((b: any) => ({
                    id: b.id,
                    type: 'hostel' as const,
                    name: `${b.firstName} ${b.lastName}`,
                    space: b.hostel?.name || 'Unknown Lodge',
                    status: b.paymentStatus === 'cancelled' ? 'Cancelled' : (b.paymentStatus === 'paid' ? 'Confirmed' : 'Pending'),
                    date: new Date(b.checkInDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    time: b.checkInTime || '12:00 PM',
                    amount: `GH₵ ${Number(b.totalAmount).toLocaleString()}`,
                    paymentStatus: b.paymentStatus === 'cancelled' ? 'Cancelled' : (b.paymentStatus === 'paid' ? 'Paid' : 'Due'),
                    createdAt: b.createdAt
                })) : [];

                const normalizedPackages = Array.isArray(packageData) ? packageData.map((b: any) => ({
                    id: b.id,
                    type: 'package' as const,
                    name: b.organization || `${b.firstName || b.first_name} ${b.lastName || b.last_name}`,
                    space: b.package?.name || b.packageName || 'Event Package',
                    status: (b.paymentStatus === 'cancelled' || b.payment_status === 'cancelled') ? 'Cancelled' : ((b.paymentStatus === 'paid' || b.payment_status === 'paid') ? 'Confirmed' : 'Pending'),
                    date: new Date(b.eventDate || b.event_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    time: b.startTime || b.start_time || '9:00 AM',
                    amount: `GH₵ ${Number(b.totalAmount || b.total_amount || 0).toLocaleString()}`,
                    paymentStatus: (b.paymentStatus === 'cancelled' || b.payment_status === 'cancelled') ? 'Cancelled' : ((b.paymentStatus === 'paid' || b.payment_status === 'paid') ? 'Paid' : 'Due'),
                    createdAt: b.createdAt || b.created_at
                })) : [];

                const combined = [...normalizedHalls, ...normalizedHostels, ...normalizedPackages]
                    .filter(b => b.paymentStatus?.toLowerCase() === 'paid');
                combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setBookings(combined.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch recent bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'hall': return <Building2 size={16} />;
            case 'hostel': return <Bed size={16} />;
            case 'package': return <Package size={16} />;
            default: return <Building2 size={16} />;
        }
    };

    const getTypeColors = (type: string) => {
        switch (type) {
            case 'hall': return { bg: '#DBEAFE', color: '#3B82F6', border: '#93C5FD' };
            case 'hostel': return { bg: '#F3E8FF', color: '#8B5CF6', border: '#C4B5FD' };
            case 'package': return { bg: '#DCFCE7', color: '#16A34A', border: '#86EFAC' };
            default: return { bg: '#F3F4F6', color: '#6B7280', border: '#D1D5DB' };
        }
    };

    if (loading) {
        return (
            <div style={{
                backgroundColor: 'white', borderRadius: '16px', padding: '32px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '40px', height: '40px', border: '3px solid #E5E7EB',
                        borderTop: '3px solid #3B82F6', borderRadius: '50%',
                        animation: 'spin 1s linear infinite', margin: '0 auto 12px'
                    }} />
                    <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            backgroundColor: 'white', borderRadius: '16px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden'
        }}>
            {/* Header with gradient */}
            <div style={{
                background: '#ffffff',
                padding: '18px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e5e7eb'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <TrendingUp size={18} color="#374151" />
                    </div>

                    <div>
                        <h3 style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#111827',
                            margin: 0
                        }}>
                            Recent Bookings
                        </h3>
                        <p style={{
                            fontSize: '13px',
                            color: '#6b7280',
                            margin: 0
                        }}>
                            Latest {bookings.length} reservations
                        </p>
                    </div>
                </div>

                <Link href="/admin/facilities-bookings" style={{ textDecoration: 'none' }}>
                    <button style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#374151',
                        background: '#f9fafb',
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


            {/* Bookings List */}
            <div style={{ padding: '8px 0' }}>
                {bookings.length === 0 ? (
                    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                        <div style={{
                            width: '64px', height: '64px', backgroundColor: '#F3F4F6',
                            borderRadius: '50%', margin: '0 auto 16px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Clock size={28} color="#9CA3AF" />
                        </div>
                        <p style={{ color: '#6B7280', fontSize: '14px', margin: 0 }}>No recent bookings found</p>
                    </div>
                ) : (
                    bookings.map((item, i) => {
                        const typeColors = getTypeColors(item.type);
                        const isPaid = item.paymentStatus === 'Paid';
                        const isCancelled = item.paymentStatus === 'Cancelled';

                        return (
                            <div key={i} style={{
                                padding: '16px 24px',
                                borderBottom: i < bookings.length - 1 ? '1px solid #F3F4F6' : 'none',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                transition: 'background-color 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                {/* Left side */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1 }}>
                                    {/* Type Icon Badge */}
                                    <div style={{
                                        width: '42px', height: '42px',
                                        backgroundColor: typeColors.bg,
                                        borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: typeColors.color,
                                        border: `1px solid ${typeColors.border}`
                                    }}>
                                        {getTypeIcon(item.type)}
                                    </div>

                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <h4 style={{
                                                fontSize: '14px', fontWeight: '600', color: '#111827', margin: 0,
                                                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                maxWidth: '150px'
                                            }}>
                                                {item.name}
                                            </h4>
                                            <span style={{
                                                fontSize: '10px', fontWeight: '600',
                                                padding: '2px 8px', borderRadius: '10px',
                                                backgroundColor: typeColors.bg, color: typeColors.color,
                                                textTransform: 'uppercase'
                                            }}>
                                                {item.type === 'hostel' ? 'lodge' : item.type}
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '13px', color: '#6B7280', margin: 0,
                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                            maxWidth: '180px'
                                        }}>
                                            {item.space}
                                        </p>
                                    </div>
                                </div>

                                {/* Center - Date/Time */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6B7280', fontSize: '12px' }}>
                                    <Clock size={14} />
                                    <span>{item.date}</span>
                                    {item.time && <span>• {item.time}</span>}
                                </div>

                                {/* Right side - Amount & Status */}
                                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                    <p style={{
                                        fontSize: '15px', fontWeight: '700', color: '#111827', margin: '0 0 4px',
                                        textDecoration: isCancelled ? 'line-through' : 'none',
                                        opacity: isCancelled ? 0.6 : 1
                                    }}>
                                        {item.amount}
                                    </p>
                                    <div style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                                        fontSize: '11px', fontWeight: '600',
                                        padding: '3px 8px', borderRadius: '10px',
                                        backgroundColor: isCancelled ? '#FEE2E2' : (isPaid ? '#D1FAE5' : '#FEF3C7'),
                                        color: isCancelled ? '#991B1B' : (isPaid ? '#059669' : '#D97706')
                                    }}>
                                        {isCancelled ? <AlertCircle size={12} /> : (isPaid ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />)}
                                        {item.paymentStatus}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
