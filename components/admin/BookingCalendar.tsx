'use client';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Plus, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

interface BookedHallInfo {
    hallId: number;
    hallName: string;
    amount: number;
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
    eventDate: string; // ISO string
    startTime: string; // "HH:mm"
    duration: string;
    numberOfDays?: number; // For hostel bookings - number of days booked
    bookingType: 'hall' | 'hostel' | 'package';
    hall?: {
        name: string;
    };
    hostel?: {
        name: string;
    };
    package?: {
        name: string;
    };
    paymentStatus: string;
    bookedHalls?: BookedHallInfo[]; // For multi-hall bookings
    facilityDisplayName?: string; // Computed display name
}

interface BookingColors {
    background: string;
    border: string;
    text: string;
    lightBg: string;
}

export default function BookingCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<'Month' | 'Week' | 'Day'>('Month');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    // Color coding helper
    // Color coding helper
    const getBookingColors = (bookingType: 'hall' | 'hostel' | 'package', status: string): BookingColors => {
        if (status === 'cancelled') {
            return {
                background: '#FEE2E2', // Red 100
                border: '#EF4444',     // Red 500
                text: '#991B1B',       // Red 800
                lightBg: '#FECACA'     // Red 200
            };
        }

        if (bookingType === 'hostel') {
            return {
                background: '#DBEAFE', // Blue 100 (more visible than 50)
                border: '#2563EB',     // Blue 600
                text: '#1E40AF',       // Blue 800
                lightBg: '#BFDBFE'     // Blue 200 (hover)
            };
        }
        if (bookingType === 'package') {
            return {
                background: '#DCFCE7', // Green 100
                border: '#16A34A',     // Green 600
                text: '#166534',       // Green 800
                lightBg: '#BBF7D0'     // Green 200 (hover)
            };
        }
        // Hall colors (amber/yellow)
        return {
            background: '#FFFBEB',
            border: '#D97706',
            text: '#92400E',
            lightBg: '#FEF3C7'
        };
    };

    const fetchBookings = async () => {
        try {
            // Fetch hall, hostel, and package bookings
            const [hallRes, hostelRes, packageRes] = await Promise.all([
                fetch('/api/bookings', { cache: 'no-store' }),
                fetch('/api/bookings/hostel', { cache: 'no-store' }),
                fetch('/api/package-bookings?all=true', { cache: 'no-store' })
            ]);

            const hallBookings = hallRes.ok ? await hallRes.json() : [];
            const hostelBookings = hostelRes.ok ? await hostelRes.json() : [];
            const packageBookings = packageRes.ok ? await packageRes.json() : [];

            // Add booking type to each booking and handle bookedHalls
            const typedHallBookings = hallBookings.map((b: any) => {
                // Extract hall info from bookedHalls array
                const bookedHallsInfo = b.bookedHalls?.map((bh: any) => ({
                    hallId: bh.hallId,
                    hallName: bh.hall?.name || 'Unknown Hall',
                    amount: bh.amount || 0
                })) || [];

                const hallNames = bookedHallsInfo.map((bh: BookedHallInfo) => bh.hallName);
                const facilityDisplayName = hallNames.length > 1
                    ? `Multiple (${hallNames.length} Halls)`
                    : (hallNames[0] || b.hall?.name || 'Unknown Hall');

                return {
                    ...b,
                    bookingType: 'hall' as const,
                    bookedHalls: bookedHallsInfo,
                    facilityDisplayName
                };
            });
            const typedHostelBookings = hostelBookings.map((b: any) => {
                // Parse numberOfDays from the booking or duration string
                let numDays = b.numberOfDays || 1;
                if (!b.numberOfDays && b.duration) {
                    // Try to extract days from duration string like "6 Days"
                    const match = b.duration.match(/(\d+)/);
                    if (match) numDays = parseInt(match[1]);
                }
                return {
                    ...b,
                    bookingType: 'hostel' as const,
                    eventDate: b.checkInDate, // Map hostel date field
                    startTime: b.checkInTime || '14:00', // Default check-in time
                    eventType: 'Accommodation', // Generic type for hostels
                    numberOfDays: numDays,
                    facilityDisplayName: b.hostel?.name || 'Unknown Lodge'
                };
            });

            // Normalize package bookings
            const typedPackageBookings = (Array.isArray(packageBookings) ? packageBookings : []).map((b: any) => ({
                ...b,
                bookingType: 'package' as const,
                facilityDisplayName: b.packageName || 'Event Package'
            }));

            // Combine, filter, and sort by date
            const allBookings = [...typedHallBookings, ...typedHostelBookings, ...typedPackageBookings]
                .filter(b => b.paymentStatus !== 'pending')
                .sort((a, b) =>
                    new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
                );

            setBookings(allBookings);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to parse time in various formats (handles both "14:00" and "3:00 pm")
    const parseTimeString = (timeStr: string): { hours: number; minutes: number } => {
        // Remove extra spaces and convert to lowercase
        const cleaned = timeStr.trim().toLowerCase();

        // Check if it's 12-hour format (contains am/pm)
        if (cleaned.includes('am') || cleaned.includes('pm')) {
            const isPM = cleaned.includes('pm');
            // Extract just the time part (remove am/pm)
            const timePart = cleaned.replace(/am|pm/g, '').trim();
            const [hourStr, minStr] = timePart.split(':');
            let hours = parseInt(hourStr);
            const minutes = parseInt(minStr) || 0;

            // Convert to 24-hour format
            if (isPM && hours !== 12) {
                hours += 12;
            } else if (!isPM && hours === 12) {
                hours = 0;
            }

            return { hours, minutes };
        }

        // 24-hour format "14:00"
        const [hourStr, minStr] = cleaned.split(':');
        return {
            hours: parseInt(hourStr) || 0,
            minutes: parseInt(minStr) || 0
        };
    };

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // --- Date Helpers ---

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const calendarDays = [];
        // Previous month padding
        for (let i = 0; i < startingDay; i++) {
            const prevDate = new Date(year, month, 0 - (startingDay - 1 - i));
            calendarDays.push({ day: prevDate.getDate().toString(), current: false, bg: false, date: prevDate, fade: true });
        }
        // Days of the month
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            const isToday = d.toDateString() === new Date().toDateString();
            const isSelected = d.toDateString() === currentDate.toDateString();
            calendarDays.push({
                day: i.toString(),
                current: isSelected || isToday,
                bg: false, // Removed charcoal background for selected dates
                date: d,
                fade: false
            });
        }
        // Next month padding
        const remaining = 42 - calendarDays.length;
        for (let i = 1; i <= remaining; i++) {
            const nextDate = new Date(year, month + 1, i);
            calendarDays.push({ day: i.toString(), current: false, bg: false, date: nextDate, fade: true });
        }
        return calendarDays;
    };

    const getWeekDays = (date: Date) => {
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay()); // Go to Sunday

        const week = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            week.push(d);
        }
        return week;
    };

    // --- Handlers ---

    const handlePrev = () => {
        const newDate = new Date(currentDate);
        if (view === 'Month') newDate.setMonth(currentDate.getMonth() - 1);
        if (view === 'Week') newDate.setDate(currentDate.getDate() - 7);
        if (view === 'Day') newDate.setDate(currentDate.getDate() - 1);
        setCurrentDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(currentDate);
        if (view === 'Month') newDate.setMonth(currentDate.getMonth() + 1);
        if (view === 'Week') newDate.setDate(currentDate.getDate() + 7);
        if (view === 'Day') newDate.setDate(currentDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    };

    // --- Renderers ---

    const formatTitle = () => {
        if (view === 'Month') return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (view === 'Day') return currentDate.toLocaleString('default', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        if (view === 'Week') {
            const week = getWeekDays(currentDate);
            const start = week[0];
            const end = week[6];
            if (start.getMonth() === end.getMonth()) {
                return `${start.toLocaleString('default', { month: 'long' })} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
            }
            return `${start.toLocaleString('default', { month: 'short' })} ${start.getDate()} - ${end.toLocaleString('default', { month: 'short' })} ${end.getDate()}, ${end.getFullYear()}`;
        }
        return '';
    };

    // Helper to get bookings for a specific day
    const getBookingsForDay = (date: Date) => {
        return bookings.filter(b => {
            const eventDate = new Date(b.eventDate);
            const eventDateStr = eventDate.toDateString();
            const dateStr = date.toDateString();

            // For hostel bookings, check if the date falls within the booking range
            if (b.bookingType === 'hostel' && b.numberOfDays && b.numberOfDays > 1) {
                const checkInDate = new Date(b.eventDate);
                checkInDate.setHours(0, 0, 0, 0);
                const checkOutDate = new Date(checkInDate);
                checkOutDate.setDate(checkOutDate.getDate() + b.numberOfDays);

                const checkDate = new Date(date);
                checkDate.setHours(0, 0, 0, 0);

                return checkDate >= checkInDate && checkDate < checkOutDate;
            }

            // For halls and packages, just check the event date
            return eventDateStr === dateStr;
        });
    };

    const renderMonthView = () => {
        const calendarDays = getDaysInMonth(currentDate);
        return (
            <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                    {days.map((day, i) => (
                        <div key={i} style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#6B7280', borderRight: i < 6 ? '1px solid #F3F4F6' : 'none' }}>{day}</div>
                    ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {calendarDays.map((dateObj, i) => {
                        const dayBookings = getBookingsForDay(dateObj.date);
                        const hasBookings = dayBookings.length > 0;

                        // Determine booking types for this day
                        const hasHallBookings = dayBookings.some(b => b.bookingType === 'hall');
                        const hasHostelBookings = dayBookings.some(b => b.bookingType === 'hostel');
                        const hasPackageBookings = dayBookings.some(b => b.bookingType === 'package');

                        // Determine background color based on booking types
                        let bgColor = 'white';
                        if (dateObj.bg) {
                            bgColor = '#1F2937'; // Selected/current date
                        } else if (hasBookings) {
                            const typeCount = [hasHallBookings, hasHostelBookings, hasPackageBookings].filter(Boolean).length;
                            if (typeCount > 1) {
                                // Multiple types: use a gradient
                                bgColor = 'linear-gradient(135deg, #FEF3C7 33%, #DBEAFE 66%, #DCFCE7 100%)';
                            } else if (hasHallBookings) {
                                bgColor = '#FEF3C7'; // Light amber for halls
                            } else if (hasHostelBookings) {
                                bgColor = '#DBEAFE'; // Light blue for hostels
                            } else if (hasPackageBookings) {
                                bgColor = '#DCFCE7'; // Light green for packages
                            }
                        }

                        return (
                            <div key={i}
                                onClick={() => { setCurrentDate(dateObj.date); setView('Day'); }}
                                style={{
                                    minHeight: '120px',
                                    padding: '8px',
                                    borderRight: (i + 1) % 7 !== 0 ? '1px solid #F3F4F6' : 'none',
                                    borderBottom: i < 35 ? '1px solid #F3F4F6' : 'none',
                                    background: bgColor, // Changed from backgroundColor to support gradients
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#F3F4F6'}
                                onMouseLeave={(e) => e.currentTarget.style.background = bgColor}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        backgroundColor: (dateObj.current || hasBookings)
                                            ? (hasPackageBookings && !hasHallBookings && !hasHostelBookings ? '#16A34A'
                                                : hasHostelBookings && !hasHallBookings && !hasPackageBookings ? '#60A5FA'
                                                    : '#F59E0B') // Green for package-only, Blue for hostel-only, orange for others
                                            : 'transparent',
                                        color: (dateObj.current || hasBookings) ? 'white' : (dateObj.fade ? '#D1D5DB' : '#374151'),
                                        fontSize: '13px', fontWeight: (dateObj.current || hasBookings) ? '600' : '400'
                                    }}>
                                        {dateObj.day}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    {dayBookings.slice(0, 3).map(b => {
                                        const colors = getBookingColors(b.bookingType, b.paymentStatus);
                                        const facilityName = (b.facilityDisplayName || (b.bookingType === 'hall' ? b.hall?.name : b.hostel?.name)) +
                                            (b.paymentStatus === 'cancelled' ? ' (Cancelled)' : '');

                                        return (
                                            <div
                                                key={b.id}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedBooking(b);
                                                }}
                                                style={{
                                                    fontSize: '11px', padding: '2px 6px', borderRadius: '4px',
                                                    backgroundColor: colors.background,
                                                    color: colors.text,
                                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                    borderLeft: `3px solid ${colors.border}`,
                                                    marginBottom: '2px',
                                                    fontWeight: '500',
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.1s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = 'translateX(2px)';
                                                    e.currentTarget.style.backgroundColor = colors.lightBg;
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = 'translateX(0)';
                                                    e.currentTarget.style.backgroundColor = colors.background;
                                                }}>
                                                <span style={{ fontSize: '10px', opacity: 0.8 }}>{b.startTime}</span>
                                                <span style={{ textTransform: 'uppercase' }}>{facilityName || 'N/A'}</span>
                                            </div>
                                        );
                                    })}
                                    {dayBookings.length > 3 && (
                                        <div style={{ fontSize: '10px', color: '#6B7280', paddingLeft: '4px' }}>
                                            + {dayBookings.length - 3} more
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div >
        );
    };

    // Time slots (6am to 10pm)
    const startHour = 6;
    const endHour = 22;
    const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

    const renderTimeGrid = (cols: number, headers: React.ReactNode[], dates: Date[]) => (
        <div style={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', backgroundColor: '#F9FAFB' }}>
                <div style={{ width: '60px', flexShrink: 0, borderRight: '1px solid #E5E7EB' }}></div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, flex: 1 }}>
                    {headers}
                </div>
            </div>

            {/* Body */}
            <div style={{ height: '600px', overflowY: 'auto', display: 'flex' }}>
                {/* Time Column */}
                <div style={{ width: '60px', flexShrink: 0, borderRight: '1px solid #E5E7EB', backgroundColor: 'white' }}>
                    {hours.map(h => (
                        <div key={h} style={{ height: '60px', borderBottom: '1px solid #F3F4F6', fontSize: '11px', color: '#9CA3AF', textAlign: 'right', paddingRight: '8px', paddingTop: '4px' }}>
                            {h > 12 ? h - 12 : h} {h >= 12 ? 'PM' : 'AM'}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, position: 'relative' }}>
                    {/* Horizontal lines */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none' }}>
                        {hours.map(h => (
                            <div key={h} style={{ height: '60px', borderBottom: '1px solid #F3F4F6' }}></div>
                        ))}
                    </div>

                    {/* Columns and Events */}
                    {dates.map((date, colIndex) => {
                        const dayBookings = getBookingsForDay(date);
                        return (
                            <div key={colIndex} style={{ borderRight: colIndex < cols - 1 ? '1px solid #F3F4F6' : 'none', position: 'relative', height: `${hours.length * 60}px` }}>
                                {dayBookings.map(b => {
                                    const colors = getBookingColors(b.bookingType, b.paymentStatus);
                                    const facilityName = (b.facilityDisplayName || (b.bookingType === 'hall' ? b.hall?.name : b.hostel?.name)) +
                                        (b.paymentStatus === 'cancelled' ? ' (Cancelled)' : '');

                                    // Parse start time (handles both "14:00" and "3:00 pm")
                                    const { hours: h, minutes: m } = parseTimeString(b.startTime);

                                    // Calculate top position
                                    // Grid starts at startHour (6). Each hour is 60px.
                                    if (h < startHour) return null; // Too early to show
                                    const top = ((h - startHour) * 60) + m;

                                    // Parse duration (e.g. "4 hours", "4", or "3pm to 12pm")
                                    const durationHours = parseInt(b.duration) || 2; // Default 2h if fails
                                    const height = durationHours * 60;

                                    return (
                                        <div
                                            key={b.id}
                                            onClick={() => setSelectedBooking(b)}
                                            style={{
                                                position: 'absolute',
                                                top: `${top}px`,
                                                left: '4px',
                                                right: '4px',
                                                height: `${height}px`,
                                                backgroundColor: colors.background,
                                                borderLeft: `4px solid ${colors.border}`,
                                                borderRadius: '4px',
                                                padding: '8px',
                                                fontSize: '12px',
                                                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                zIndex: 10,
                                                overflow: 'hidden',
                                                color: colors.text,
                                                cursor: 'pointer',
                                                transition: 'transform 0.1s, box-shadow 0.1s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'scale(1.02)';
                                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'scale(1)';
                                                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
                                            }}>
                                            <div style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '11px', marginBottom: '2px' }}>{facilityName || 'N/A'}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '500' }}>
                                                <Clock size={10} /> {b.startTime} - {b.duration}
                                            </div>
                                            <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '2px' }}>
                                                {b.firstName} {b.lastName}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const renderWeekView = () => {
        const week = getWeekDays(currentDate);
        const headers = week.map((d, i) => {
            const isToday = d.toDateString() === new Date().toDateString();
            const isSelected = d.toDateString() === currentDate.toDateString();
            return (
                <div key={i} style={{ padding: '12px', textAlign: 'center', borderRight: i < 6 ? '1px solid #F3F4F6' : 'none', backgroundColor: isSelected ? '#FFFCF5' : 'transparent' }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: isToday ? '#F59E0B' : '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>{weekDays[d.getDay()]}</div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        width: '32px', height: '32px', borderRadius: '50%',
                        backgroundColor: isToday ? '#F59E0B' : 'transparent',
                        color: isToday ? 'white' : '#111827',
                        fontSize: '18px', fontWeight: '600'
                    }}>
                        {d.getDate()}
                    </div>
                </div>
            );
        });
        return renderTimeGrid(7, headers, week);
    };

    const renderDayView = () => {
        const d = currentDate;
        const isToday = d.toDateString() === new Date().toDateString();
        const headers = [(
            <div key={0} style={{ padding: '12px', textAlign: 'left', paddingLeft: '24px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: isToday ? '#F59E0B' : '#6B7280', textTransform: 'uppercase', marginBottom: '4px' }}>{weekDays[d.getDay()]}</div>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '36px', height: '36px', borderRadius: '50%',
                    backgroundColor: isToday ? '#F59E0B' : 'transparent',
                    color: isToday ? 'white' : '#111827',
                    fontSize: '24px', fontWeight: '700'
                }}>
                    {d.getDate()}
                </div>
            </div>
        )];
        return renderTimeGrid(1, headers, [d]);
    };

    return (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
            {/* Top Navigation Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>

                {/* Left: Date Nav */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={handlePrev}
                            style={{
                                width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E5E7EB',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', cursor: 'pointer'
                            }}>
                            <ChevronLeft size={18} color="#374151" />
                        </button>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', display: 'flex', alignItems: 'center', minWidth: '220px', justifyContent: 'center' }}>
                            {formatTitle()}
                        </h2>
                        <button
                            onClick={handleNext}
                            style={{
                                width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E5E7EB',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', cursor: 'pointer'
                            }}>
                            <ChevronRight size={18} color="#374151" />
                        </button>
                    </div>
                    <button
                        onClick={handleToday}
                        style={{
                            padding: '8px 16px', borderRadius: '8px', border: '1px solid #E5E7EB',
                            backgroundColor: 'white', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer'
                        }}>Today</button>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                        <button
                            onClick={() => setView('Month')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: view === 'Month' ? '#1F2937' : 'white',
                                color: view === 'Month' ? 'white' : '#6B7280',
                                fontSize: '14px', fontWeight: '500', border: 'none', cursor: 'pointer'
                            }}>Month</button>
                        <button
                            onClick={() => setView('Week')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: view === 'Week' ? '#1F2937' : 'white',
                                color: view === 'Week' ? 'white' : '#6B7280',
                                fontSize: '14px', fontWeight: '500',
                                border: 'none', borderLeft: '1px solid #E5E7EB', cursor: 'pointer'
                            }}>Week</button>
                        <button
                            onClick={() => setView('Day')}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: view === 'Day' ? '#1F2937' : 'white',
                                color: view === 'Day' ? 'white' : '#6B7280',
                                fontSize: '14px', fontWeight: '500',
                                border: 'none', borderLeft: '1px solid #E5E7EB', cursor: 'pointer'
                            }}>Day</button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Loading calendar...</div>
            ) : (
                <>
                    {view === 'Month' && renderMonthView()}
                    {view === 'Week' && renderWeekView()}
                    {view === 'Day' && renderDayView()}
                </>
            )}

            {/* Booking Details Modal */}
            {selectedBooking && (
                <div
                    onClick={() => setSelectedBooking(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '32px',
                            maxWidth: '600px',
                            width: '90%',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                        }}>
                        {/* Header */}
                        <div style={{ borderBottom: '1px solid #E5E7EB', paddingBottom: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                                        Booking Details
                                    </h3>
                                    <p style={{ fontSize: '14px', color: '#6B7280' }}>
                                        Reference: <span style={{ fontWeight: '600', color: '#F59E0B' }}>{selectedBooking.reference}</span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    style={{
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        fontSize: '24px',
                                        color: '#9CA3AF',
                                        cursor: 'pointer',
                                        padding: '4px'
                                    }}>
                                    ×
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* Left Column */}
                            <div>
                                {/* Booked Halls for multi-hall bookings */}
                                {selectedBooking.bookedHalls && selectedBooking.bookedHalls.length > 1 ? (
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Booked Halls ({selectedBooking.bookedHalls.length})
                                        </label>
                                        <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {selectedBooking.bookedHalls.map((bh, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#FEF3C7', borderRadius: '6px', borderLeft: '3px solid #F59E0B' }}>
                                                    <span style={{ fontWeight: 500, color: '#92400E' }}>{bh.hallName}</span>
                                                    <span style={{ fontWeight: 600, color: '#059669' }}>GH₵{bh.amount.toLocaleString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Facility Name
                                        </label>
                                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>
                                            {selectedBooking.facilityDisplayName || (selectedBooking.bookingType === 'hall' ? selectedBooking.hall?.name : selectedBooking.hostel?.name)}
                                        </p>
                                        <span style={{ fontSize: '12px', color: '#6B7280', textTransform: 'capitalize' }}>
                                            ({selectedBooking.bookingType})
                                        </span>
                                    </div>
                                )}

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Event Type
                                    </label>
                                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>
                                        {selectedBooking.eventType}
                                    </p>
                                </div>

                                {selectedBooking.eventName && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            Event Name
                                        </label>
                                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>
                                            {selectedBooking.eventName}
                                        </p>
                                    </div>
                                )}

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Date & Time
                                    </label>
                                    <p style={{ fontSize: '14px', color: '#111827', marginTop: '4px' }}>
                                        {new Date(selectedBooking.eventDate).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                    <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '2px' }}>
                                        {selectedBooking.startTime} • Duration: {selectedBooking.duration}
                                    </p>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Customer Name
                                    </label>
                                    <p style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginTop: '4px' }}>
                                        {selectedBooking.firstName} {selectedBooking.lastName}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Email Address
                                    </label>
                                    <p style={{ fontSize: '14px', color: '#111827', marginTop: '4px' }}>
                                        {selectedBooking.email}
                                    </p>
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Phone Number
                                    </label>
                                    <p style={{ fontSize: '14px', color: '#111827', marginTop: '4px' }}>
                                        {selectedBooking.phone}
                                    </p>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Payment Status
                                    </label>
                                    <div style={{ marginTop: '4px' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            backgroundColor: selectedBooking.paymentStatus === 'paid' ? '#ECFDF5' : '#FEF3C7',
                                            color: selectedBooking.paymentStatus === 'paid' ? '#047857' : '#92400E'
                                        }}>
                                            {selectedBooking.paymentStatus.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #E5E7EB', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #E5E7EB',
                                    backgroundColor: 'white',
                                    color: '#374151',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: 'pointer'
                                }}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
