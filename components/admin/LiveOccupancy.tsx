'use client';
import { Building2, Users, Sparkles, Wrench, Package, Info, Gift } from 'lucide-react';
import { useEffect, useState } from 'react';

// Update VenueItem Interface
interface VenueItem {
    id: string;
    name: string;
    type: 'Hall' | 'Hostel' | 'Package';
    packageType?: 'event' | 'special' | 'group_retreat'; // New field for package categorization
    capacity: string;
    status: 'Occupied' | 'Available' | 'Cleaning' | 'Maintenance' | 'Booked';
    details: string;
    bookedBy?: string | null;
    date?: string | null; // Start Date
    endDate?: string | null; // End Date (New)
    duration?: string | null; // Duration (New)
    bookedAt?: string | null; // Booking Creation Date (New)
    image?: string | null;
    availableRooms?: number;
}

const StatusCard = ({ item }: { item: VenueItem }) => {
    // 1. Theme Colors (for Icons)
    let theme = { iconColor: '' };

    switch (item.type) {
        case 'Hall':
            theme = { iconColor: '#3B82F6' }; // Blue
            break;
        case 'Hostel':
            theme = { iconColor: '#A855F7' }; // Purple
            break;
        case 'Package':
            theme = { iconColor: '#F59E0B' }; // Amber
            break;
        default:
            theme = { iconColor: '#6B7280' };
    }

    // 2. Status Indicator
    const status = item.status;
    let statusColor = '#16A34A'; // Green (Available)
    let statusBg = '#F0FDF4';
    let statusBorder = '#BBF7D0';
    let statusLabel = 'AVAILABLE';

    if (status === 'Occupied') {
        statusColor = '#DC2626'; // Red
        statusBg = '#FEF2F2';
        statusBorder = '#FECACA';
        statusLabel = 'BOOKED';
    } else if (status === 'Booked') {
        statusColor = '#D97706'; // Amber/Orange
        statusBg = '#FFFBEB';
        statusBorder = '#FDE68A';
        statusLabel = 'BOOKED';
    }

    // Icon Selection
    const Icon = (status === 'Occupied' || status === 'Booked') ? Users : (item.type === 'Hall' ? Building2 : (item.type === 'Hostel' ? Users : Package));

    const hasImage = !!item.image;

    // "Original Professional" Fallback Styles (if no image)
    const fallbackTheme = {
        bg: item.type === 'Hall' ? '#EFF6FF' : (item.type === 'Hostel' ? '#FAF5FF' : '#FFFBEB'),
        border: item.type === 'Hall' ? '#BFDBFE' : (item.type === 'Hostel' ? '#E9D5FF' : '#FDE68A')
    };

    // Helper to format "Time Ago" for recent bookings
    const getTimeAgo = (dateStr?: string | null) => {
        if (!dateStr) return '';
        const created = new Date(dateStr);
        const now = new Date();
        const diffMs = now.getTime() - created.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `Booked ${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `Booked ${diffHours} hr${diffHours !== 1 ? 's' : ''} ago`;
        if (diffDays === 0) return 'Booked Today';
        if (diffDays === 1) return 'Booked Yesterday';
        return `Booked ${diffDays} days ago`;
    };

    const timeAgo = (status === 'Occupied' || status === 'Booked') ? getTimeAgo(item.bookedAt) : '';

    return (
        <div style={{
            backgroundColor: hasImage ? '#1F2937' : fallbackTheme.bg,
            border: hasImage ? 'none' : `1px solid ${fallbackTheme.border}`,
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '140px',
            minWidth: '0',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: hasImage ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none'
        }}>
            {/* Background Image & Overlay */}
            {hasImage && (
                <>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        // Dark Gradient Overlay
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.3) 100%)',
                        zIndex: 1
                    }} />
                </>
            )}

            {/* Content Z-Index Wrapper */}
            <div style={{ position: 'relative', zIndex: 10, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                {/* Top Row: Icon + Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{
                        padding: '6px',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}>
                        <Icon size={16} color={theme.iconColor} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                        <span style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            color: statusColor,
                            backgroundColor: statusBg,
                            border: `1px solid ${statusBorder}`,
                            padding: '3px 8px',
                            borderRadius: '20px',
                            textTransform: 'uppercase',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }}>
                            {statusLabel}
                        </span>
                        {/* New: Status Time Ago (e.g. "Booked 5 mins ago") */}
                        {timeAgo && (
                            <span style={{
                                fontSize: '9px',
                                color: hasImage ? '#E5E7EB' : '#6B7280',
                                fontWeight: '500',
                                textShadow: hasImage ? '0 1px 2px rgba(0,0,0,0.5)' : 'none'
                            }}>
                                {timeAgo}
                            </span>
                        )}
                    </div>
                </div>

                <div style={{ marginTop: 'auto' }}>
                    <h4 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: hasImage ? 'white' : '#1F2937',
                        marginBottom: '4px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        textShadow: hasImage ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                    }}>
                        {item.name}
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{
                            fontSize: '11px',
                            color: hasImage ? '#E5E7EB' : '#6B7280',
                            fontWeight: '500'
                        }}>
                            {/* Smart Capacity/Available Display */}
                            {item.status === 'Available' ? (
                                item.type === 'Hostel' && item.availableRooms !== undefined
                                    ? <span style={{ color: '#4ADE80' }}>✓ {item.availableRooms} Rooms Open</span>
                                    : (item.type === 'Hall' ? `Capacity: ${item.capacity}` : item.capacity)
                            ) : (
                                // If Booked, show Period!
                                item.endDate ? (
                                    <span style={{ color: hasImage ? '#FCA5A5' : '#EF4444' }}>
                                        {item.date} - {item.endDate}
                                        {item.duration ? ` (${item.duration})` : ''}
                                    </span>
                                ) : (
                                    item.type === 'Hostel' ? `Booked for ${item.date}` : `Capacity: ${item.capacity}`
                                )
                            )}
                        </span>

                        {(status === 'Occupied' || status === 'Booked') && item.bookedBy && (
                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '2px' }}>
                                <span style={{
                                    fontSize: '10px',
                                    color: hasImage ? '#D1D5DB' : '#4B5563',
                                    fontWeight: '600',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    By: {item.bookedBy}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function LiveOccupancy() {
    const [venues, setVenues] = useState<VenueItem[]>([]);
    const [counts, setCounts] = useState({ available: 0, occupied: 0, cleaning: 0, maintenance: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/admin/occupancy', { cache: 'no-store' });
                const data = await res.json();
                if (res.ok) {
                    let items: VenueItem[] = data.items;

                    // SORTING LOGIC:
                    // Priority 1: Status (Occupied/Booked MUST be first)
                    // Priority 2: Recency (Most recently booked first)
                    items.sort((a, b) => {
                        const isBookedA = a.status === 'Occupied' || a.status === 'Booked';
                        const isBookedB = b.status === 'Occupied' || b.status === 'Booked';

                        if (isBookedA && !isBookedB) return -1; // A comes first
                        if (!isBookedA && isBookedB) return 1;  // B comes first

                        // If both booked, sort by bookedAt DESC (Newest first)
                        if (isBookedA && isBookedB) {
                            if (a.bookedAt && b.bookedAt) {
                                return new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime();
                            }
                            return 0;
                        }

                        // Default sorting for available (by name)
                        return a.name.localeCompare(b.name);
                    });

                    setVenues(items);
                    setCounts(data.counts);
                }
            } catch (error) {
                console.error("Failed to fetch occupancy:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        const interval = setInterval(fetchData, 15000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', color: '#6B7280' }}>Loading live status...</div>;
    }

    return (
        <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>Live Venue Status</h3>
                    <p style={{ fontSize: '14px', color: '#6B7280' }}>Real-time facility occupancy</p>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#6B7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#48BB78' }}></span> Available ({counts.available})
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F56565' }}></span> Booked ({counts.occupied})
                    </div>
                </div>
            </div>

            {/* Dynamically ordered sections based on most recent booking */}
            {(() => {
                // Define sections with their data - Packages are now separated by type
                const sections = [
                    {
                        id: 'halls',
                        icon: Building2,
                        title: 'Conference Halls',
                        items: venues.filter(v => v.type === 'Hall'),
                        emptyMessage: 'No halls found.'
                    },
                    {
                        id: 'hostels',
                        icon: Users,
                        title: 'Accommodation (Lodges)',
                        items: venues.filter(v => v.type === 'Hostel'),
                        emptyMessage: 'No lodges found.'
                    },
                    {
                        id: 'event-packages',
                        icon: Package,
                        title: 'Event Packages',
                        items: venues.filter(v => v.type === 'Package' && v.packageType === 'event'),
                        emptyMessage: 'No event packages found.'
                    },
                    {
                        id: 'special-packages',
                        icon: Sparkles,
                        title: 'Special Packages',
                        items: venues.filter(v => v.type === 'Package' && v.packageType === 'special'),
                        emptyMessage: 'No special packages found.'
                    },
                    {
                        id: 'group-retreats',
                        icon: Gift,
                        title: 'Group Retreats',
                        items: venues.filter(v => v.type === 'Package' && v.packageType === 'group_retreat'),
                        emptyMessage: 'No group retreats found.'
                    }
                ];

                // Calculate most recent booking time for each section
                const sectionsWithRecency = sections.map(section => {
                    const bookedItems = section.items.filter(item =>
                        item.status === 'Occupied' || item.status === 'Booked'
                    );

                    // Find the most recent booking in this section
                    let mostRecentTime = 0;
                    if (bookedItems.length > 0) {
                        mostRecentTime = Math.max(
                            ...bookedItems
                                .filter(item => item.bookedAt)
                                .map(item => new Date(item.bookedAt!).getTime())
                        );
                    }

                    return {
                        ...section,
                        mostRecentBooking: mostRecentTime,
                        hasBookings: bookedItems.length > 0
                    };
                });

                // Sort sections: those with bookings first (by recency), then those without
                const sortedSections = sectionsWithRecency.sort((a, b) => {
                    if (a.hasBookings && !b.hasBookings) return -1;
                    if (!a.hasBookings && b.hasBookings) return 1;
                    if (a.hasBookings && b.hasBookings) {
                        return b.mostRecentBooking - a.mostRecentBooking; // Most recent first
                    }
                    return 0; // Keep original order for sections without bookings
                });

                // Render sections in sorted order
                return sortedSections.map((section, index) => {
                    const Icon = section.icon;
                    const isLast = index === sortedSections.length - 1;

                    return (
                        <div key={section.id} style={{ marginBottom: isLast ? '0' : '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#6B7280', fontSize: '14px', fontWeight: '500' }}>
                                <Icon size={18} />
                                <span>{section.title}</span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                                {section.items.map((item, i) => (
                                    <StatusCard key={i} item={item} />
                                ))}
                                {section.items.length === 0 && <p style={{ fontSize: '13px', color: '#9CA3AF' }}>{section.emptyMessage}</p>}
                            </div>
                        </div>
                    );
                });
            })()}
        </div>
    );
}
