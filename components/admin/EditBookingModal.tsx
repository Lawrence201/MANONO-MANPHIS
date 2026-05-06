'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
    X,
    Building2,
    Calendar,
    Clock,
    ChevronLeft,
    ChevronRight,
    Check,
    AlertTriangle,
    Send,
    Loader2,
    DollarSign,
    Package,
    ArrowRight
} from 'lucide-react';

interface HallAddOn {
    id: number;
    name: string;
    price: string;
    unit: string | null;
}

interface Hall {
    id: number;
    name: string;
    price: string;
    description: string;
    capacity: string;
    duration: string;
    mainImagePath: string | null;
    addOns: HallAddOn[];
}

interface BookedHallDetail {
    hallId: number;
    hallName: string;
    amount: number;
    addOns?: { id?: number; name: string; price: number }[];
}

interface BookingData {
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
    totalAmount: string;
    paymentStatus: string;
    organization?: string;
    message?: string;
    staffMember?: string;
    bookedHalls?: BookedHallDetail[];
}

interface EditBookingModalProps {
    booking: BookingData;
    onClose: () => void;
    onSuccess: () => void;
}

// Parse price helper
const parsePrice = (price: string | number | null | undefined): number => {
    if (!price) return 0;
    const stringPrice = String(price);
    const cleanPrice = stringPrice.replace(/[^\d.]/g, '');
    return parseFloat(cleanPrice) || 0;
};

export default function EditBookingModal({ booking, onClose, onSuccess }: EditBookingModalProps) {
    // Steps: 1 = Venue, 2 = Date/Time, 3 = Add-ons, 4 = Review
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sendingInvoice, setSendingInvoice] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successData, setSuccessData] = useState<{
        originalTotal: number;
        newTotal: number;
        balanceDue: number;
    } | null>(null);

    // Data states
    const [halls, setHalls] = useState<Hall[]>([]);
    const [loadingHalls, setLoadingHalls] = useState(true);

    // Form states - initialized from booking
    const [selectedHallIds, setSelectedHallIds] = useState<number[]>([]);
    const [eventType, setEventType] = useState(booking.eventType);
    const [eventName, setEventName] = useState(booking.eventName || '');
    const [duration, setDuration] = useState(booking.duration.replace(/[^0-9]/g, ''));
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(booking.startTime);
    const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);
    const [staffMember, setStaffMember] = useState(booking.staffMember || 'Any staff member');

    // Calendar state
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);

    const originalTotal = parsePrice(booking.totalAmount);

    // Fetch halls on mount
    useEffect(() => {
        const fetchHalls = async () => {
            try {
                const res = await fetch('/api/halls');
                if (res.ok) {
                    const data = await res.json();
                    setHalls(data.halls || []);
                }
            } catch (err) {
                console.error('Error fetching halls:', err);
            } finally {
                setLoadingHalls(false);
            }
        };
        fetchHalls();
    }, []);

    // Initialize form from booking data - wait for halls to be loaded
    useEffect(() => {
        if (booking.bookedHalls && booking.bookedHalls.length > 0) {
            setSelectedHallIds(booking.bookedHalls.map(bh => bh.hallId));
        }
        if (booking.eventDate) {
            setSelectedDate(new Date(booking.eventDate));
            setCurrentMonth(new Date(booking.eventDate));
        }
    }, [booking]);

    // Match booked add-on names to hall add-on IDs once halls are loaded
    useEffect(() => {
        if (halls.length === 0 || !booking.bookedHalls) return;

        const matchedAddonIds: number[] = [];

        // For each booked hall's add-ons, find the matching hall add-on by name
        booking.bookedHalls.forEach(bookedHall => {
            const hall = halls.find(h => h.id === bookedHall.hallId);
            if (hall && bookedHall.addOns) {
                bookedHall.addOns.forEach(bookedAddon => {
                    // Match by name (case-insensitive)
                    const matchingAddon = hall.addOns.find(
                        a => a.name.toLowerCase() === bookedAddon.name.toLowerCase()
                    );
                    if (matchingAddon && !matchedAddonIds.includes(matchingAddon.id)) {
                        matchedAddonIds.push(matchingAddon.id);
                    }
                });
            }
        });

        if (matchedAddonIds.length > 0) {
            setSelectedAddonIds(matchedAddonIds);
        }
    }, [halls, booking.bookedHalls]);

    // Get selected halls data
    const selectedHallsData = useMemo(() =>
        halls.filter(h => selectedHallIds.includes(h.id)),
        [halls, selectedHallIds]
    );

    // Calculate new total price
    const newTotalPrice = useMemo(() => {
        if (selectedHallsData.length === 0) return 0;

        const hallsTotal = selectedHallsData.reduce((sum, hall) => {
            const basePrice = parsePrice(hall.price);
            const baseDuration = parseInt(hall.duration) || 4;
            const hourlyRate = basePrice / baseDuration;
            const enteredDuration = parseFloat(duration) || 0;

            if (enteredDuration > 0) {
                return sum + Math.round(hourlyRate * enteredDuration);
            }
            return sum;
        }, 0);

        const addonsPrice = selectedAddonIds.reduce((acc, id) => {
            for (const hall of selectedHallsData) {
                const addon = hall.addOns.find(a => a.id === id);
                if (addon) {
                    return acc + parsePrice(addon.price);
                }
            }
            return acc;
        }, 0);

        return hallsTotal + addonsPrice;
    }, [selectedHallsData, selectedAddonIds, duration]);

    const balanceDue = newTotalPrice - originalTotal;
    const canSubmit = newTotalPrice >= originalTotal && newTotalPrice > 0;

    // Fetch booked time slots for selected date/halls
    const fetchTimeSlots = useCallback(async () => {
        if (selectedHallIds.length === 0 || !selectedDate) {
            setBookedTimeSlots([]);
            return;
        }

        setLoadingSlots(true);
        try {
            const allOccupied = new Set<string>();
            const promises = selectedHallIds.map(async (id) => {
                const res = await fetch(`/api/bookings?hallId=${id}`);
                if (res.ok) return res.json();
                return [];
            });

            const results = await Promise.all(promises);
            const selectedDateStr = selectedDate.toDateString();

            results.forEach((bookings: any[]) => {
                bookings
                    .filter((b: any) => {
                        const bDate = new Date(b.eventDate);
                        // Exclude current booking from conflicts
                        return bDate.toDateString() === selectedDateStr && b.id !== booking.id;
                    })
                    .forEach((b: any) => {
                        const startMins = timeToMinutes(b.startTime);
                        const durHours = parseInt(b.duration) || 1;
                        const endMins = startMins + ((durHours + 1) * 60);
                        for (let m = startMins; m < endMins; m += 60) {
                            allOccupied.add(minutesToTime(m));
                        }
                    });
            });

            setBookedTimeSlots(Array.from(allOccupied));
        } catch (err) {
            console.error('Error fetching time slots:', err);
        } finally {
            setLoadingSlots(false);
        }
    }, [selectedHallIds, selectedDate, booking.id]);

    useEffect(() => {
        fetchTimeSlots();
    }, [fetchTimeSlots]);

    // Time helpers
    const timeToMinutes = (timeStr: string): number => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period?.toLowerCase() === 'pm' && hours !== 12) hours += 12;
        if (period?.toLowerCase() === 'am' && hours === 12) hours = 0;
        return hours * 60 + (minutes || 0);
    };

    const minutesToTime = (mins: number): string => {
        let hours = Math.floor(mins / 60);
        const m = mins % 60;
        const period = hours >= 12 ? 'pm' : 'am';
        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;
        return `${hours}:${m === 0 ? '00' : m} ${period}`;
    };

    const allTimes = [
        '6:00 am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am',
        '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm',
        '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm'
    ];

    // Calendar helpers
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handleSubmit = async () => {
        if (!canSubmit || !selectedDate || !selectedTime) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/bookings/edit', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: booking.id,
                    hallIds: selectedHallIds,
                    eventType,
                    eventName,
                    eventDate: selectedDate.toISOString(),
                    startTime: selectedTime,
                    duration,
                    addOns: selectedAddonIds,
                    staffMember
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccessData({
                    originalTotal: data.originalTotal,
                    newTotal: data.newTotal,
                    balanceDue: data.balanceDue
                });
                setShowSuccess(true);
            } else {
                alert(data.message || 'Failed to update booking');
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSendInvoice = async () => {
        if (!successData || successData.balanceDue <= 0) return;

        setSendingInvoice(true);
        try {
            const res = await fetch('/api/bookings/invoice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId: booking.id,
                    originalAmount: successData.originalTotal,
                    newAmount: successData.newTotal,
                    balanceDue: successData.balanceDue
                })
            });

            const data = await res.json();
            if (res.ok) {
                alert(`Invoice sent to ${data.sentTo}`);
            } else {
                alert(data.message || 'Failed to send invoice');
            }
        } catch (err) {
            console.error('Invoice error:', err);
            alert('Failed to send invoice');
        } finally {
            setSendingInvoice(false);
        }
    };

    // Render success view
    if (showSuccess && successData) {
        return (
            <div onClick={onClose} style={{
                position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}>
                <div onClick={e => e.stopPropagation()} style={{
                    backgroundColor: 'white', borderRadius: '20px', padding: '40px',
                    maxWidth: '500px', width: '90%', textAlign: 'center'
                }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 24px'
                    }}>
                        <Check size={40} color="#059669" />
                    </div>

                    <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                        Booking Updated
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                        Reference: <strong>{booking.reference}</strong>
                    </p>

                    <div style={{
                        backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px',
                        marginBottom: '24px', textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: '#6b7280' }}>Original Amount</span>
                            <span style={{ fontWeight: 600 }}>GH₵ {successData.originalTotal.toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <span style={{ color: '#6b7280' }}>New Total</span>
                            <span style={{ fontWeight: 600 }}>GH₵ {successData.newTotal.toLocaleString()}</span>
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            paddingTop: '12px', borderTop: '2px solid #e5e7eb'
                        }}>
                            <span style={{ color: successData.balanceDue > 0 ? '#d97706' : '#059669', fontWeight: 600 }}>
                                {successData.balanceDue > 0 ? 'Balance Due' : 'No Additional Charge'}
                            </span>
                            <span style={{
                                fontWeight: 700, fontSize: '18px',
                                color: successData.balanceDue > 0 ? '#d97706' : '#059669'
                            }}>
                                GH₵ {successData.balanceDue.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        {successData.balanceDue > 0 && (
                            <button
                                onClick={handleSendInvoice}
                                disabled={sendingInvoice}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '10px',
                                    backgroundColor: '#10b981', color: 'white', border: 'none',
                                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                            >
                                {sendingInvoice ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                Send Invoice
                            </button>
                        )}
                        <button
                            onClick={() => { onSuccess(); onClose(); }}
                            style={{
                                flex: 1, padding: '14px', borderRadius: '10px',
                                backgroundColor: '#111827', color: 'white', border: 'none',
                                fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Done
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Modal styles
    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 14px', borderRadius: '10px',
        border: '1px solid #e5e7eb', fontSize: '14px', outline: 'none'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block', fontSize: '13px', fontWeight: 600,
        color: '#374151', marginBottom: '6px'
    };

    return (
        <div onClick={onClose} style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
            padding: '20px'
        }}>
            <div onClick={e => e.stopPropagation()} style={{
                backgroundColor: 'white', borderRadius: '20px',
                maxWidth: '900px', width: '100%', maxHeight: '90vh',
                display: 'flex', flexDirection: 'column', overflow: 'hidden'
            }}>
                {/* Header */}
                <div style={{
                    padding: '20px 24px', borderBottom: '1px solid #e5e7eb',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                            Edit Booking
                        </h2>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>
                            {booking.reference} • {booking.firstName} {booking.lastName}
                        </p>
                    </div>
                    <button onClick={onClose} style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        border: '1px solid #e5e7eb', backgroundColor: '#f9fafb',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}>
                        <X size={18} color="#6b7280" />
                    </button>
                </div>

                {/* Step Indicator */}
                <div style={{
                    padding: '16px 24px', backgroundColor: '#f9fafb',
                    display: 'flex', justifyContent: 'center', gap: '8px'
                }}>
                    {[1, 2, 3, 4].map(step => (
                        <div key={step} style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            backgroundColor: currentStep >= step ? '#111827' : '#d1d5db'
                        }} />
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {/* Step 1: Venue Selection */}
                    {currentStep === 1 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Building2 size={20} /> Select Venue & Event Details
                            </h3>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Facility *</label>
                                {loadingHalls ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading halls...</div>
                                ) : (
                                    <div style={{
                                        maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb',
                                        borderRadius: '12px', padding: '8px'
                                    }}>
                                        {halls.map(hall => {
                                            const isSelected = selectedHallIds.includes(hall.id);
                                            return (
                                                <div
                                                    key={hall.id}
                                                    onClick={() => setSelectedHallIds(prev =>
                                                        prev.includes(hall.id)
                                                            ? prev.filter(id => id !== hall.id)
                                                            : [...prev, hall.id]
                                                    )}
                                                    style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                                                        border: isSelected ? '1px solid #3b82f6' : '1px solid transparent',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <input type="checkbox" checked={isSelected} readOnly style={{ cursor: 'pointer' }} />
                                                        <span style={{ fontWeight: isSelected ? 600 : 400 }}>{hall.name}</span>
                                                    </div>
                                                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                                                        GH₵{parsePrice(hall.price).toLocaleString()} / {hall.duration}hrs
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Event Type *</label>
                                    <select value={eventType} onChange={e => setEventType(e.target.value)} style={inputStyle}>
                                        <option value="wedding">Wedding</option>
                                        <option value="conference">Conference</option>
                                        <option value="church">Church Service</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Event Name</label>
                                    <input type="text" value={eventName} onChange={e => setEventName(e.target.value)}
                                        placeholder="e.g. Youth Summit 2026" style={inputStyle} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Duration (Hours) *</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={duration}
                                    onChange={e => setDuration(e.target.value)}
                                    style={inputStyle}
                                    placeholder="Enter duration in hours"
                                />
                                {selectedHallsData.length > 0 && parseFloat(duration) > 0 && (
                                    <p style={{ fontSize: '13px', color: '#059669', marginTop: '8px' }}>
                                        Estimated: GH₵{newTotalPrice.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {currentStep === 2 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={20} /> Select Date & Time
                            </h3>

                            {/* Calendar */}
                            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    <span style={{ fontWeight: 600 }}>
                                        {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                    </span>
                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                        style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                        <ChevronRight size={20} />
                                    </button>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                        <div key={d} style={{ fontSize: '12px', color: '#9ca3af', padding: '8px' }}>{d}</div>
                                    ))}

                                    {Array(getFirstDayOfMonth(currentMonth)).fill(null).map((_, i) => (
                                        <div key={`empty-${i}`} />
                                    ))}

                                    {Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1).map(day => {
                                        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                                        return (
                                            <div
                                                key={day}
                                                onClick={() => setSelectedDate(date)}
                                                style={{
                                                    padding: '10px', borderRadius: '8px', cursor: 'pointer',
                                                    backgroundColor: isSelected ? '#111827' : 'transparent',
                                                    color: isSelected ? 'white' : '#374151',
                                                    fontWeight: isSelected ? 600 : 400
                                                }}
                                            >
                                                {day}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <label style={labelStyle}>Select Time</label>
                                {loadingSlots ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading...</div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                        {allTimes.map(time => {
                                            const isBooked = bookedTimeSlots.includes(time);
                                            const isSelected = selectedTime === time;
                                            return (
                                                <button
                                                    key={time}
                                                    disabled={isBooked}
                                                    onClick={() => setSelectedTime(time)}
                                                    style={{
                                                        padding: '12px', borderRadius: '8px',
                                                        border: isSelected ? '2px solid #111827' : '1px solid #e5e7eb',
                                                        backgroundColor: isBooked ? '#f3f4f6' : isSelected ? '#111827' : 'white',
                                                        color: isBooked ? '#9ca3af' : isSelected ? 'white' : '#374151',
                                                        cursor: isBooked ? 'not-allowed' : 'pointer',
                                                        fontSize: '13px', fontWeight: 500,
                                                        textDecoration: isBooked ? 'line-through' : 'none'
                                                    }}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Add-ons */}
                    {currentStep === 3 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={20} /> Select Add-ons (Optional)
                            </h3>

                            {selectedHallsData.length === 0 ? (
                                <p style={{ color: '#6b7280' }}>Please select a hall first.</p>
                            ) : (
                                selectedHallsData.map(hall => (
                                    <div key={hall.id} style={{ marginBottom: '20px' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>{hall.name}</h4>
                                        {hall.addOns.length === 0 ? (
                                            <p style={{ color: '#9ca3af', fontSize: '13px' }}>No add-ons available</p>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {hall.addOns.map(addon => {
                                                    const isSelected = selectedAddonIds.includes(addon.id);
                                                    return (
                                                        <div
                                                            key={addon.id}
                                                            onClick={() => setSelectedAddonIds(prev =>
                                                                prev.includes(addon.id)
                                                                    ? prev.filter(id => id !== addon.id)
                                                                    : [...prev, addon.id]
                                                            )}
                                                            style={{
                                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                                padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
                                                                backgroundColor: isSelected ? '#ecfdf5' : '#f9fafb',
                                                                border: isSelected ? '1px solid #059669' : '1px solid #e5e7eb'
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <input type="checkbox" checked={isSelected} readOnly />
                                                                <span style={{ fontSize: '14px' }}>{addon.name}</span>
                                                            </div>
                                                            <span style={{ fontWeight: 600, color: '#059669' }}>
                                                                GH₵{parsePrice(addon.price).toLocaleString()}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {/* Step 4: Review */}
                    {currentStep === 4 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <DollarSign size={20} /> Review Changes
                            </h3>

                            {/* Price Comparison */}
                            <div style={{
                                backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px',
                                marginBottom: '20px', border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: '#6b7280' }}>Original Amount (Paid)</span>
                                    <span style={{ fontWeight: 600 }}>GH₵ {originalTotal.toLocaleString()}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <span style={{ color: '#6b7280' }}>New Total</span>
                                    <span style={{ fontWeight: 600 }}>GH₵ {newTotalPrice.toLocaleString()}</span>
                                </div>
                                <div style={{
                                    display: 'flex', justifyContent: 'space-between',
                                    paddingTop: '12px', borderTop: '2px solid #e5e7eb'
                                }}>
                                    <span style={{ fontWeight: 600, color: balanceDue > 0 ? '#d97706' : '#059669' }}>
                                        {balanceDue > 0 ? 'Balance Due' : 'No Additional Charge'}
                                    </span>
                                    <span style={{ fontWeight: 700, fontSize: '20px', color: balanceDue > 0 ? '#d97706' : '#059669' }}>
                                        GH₵ {Math.abs(balanceDue).toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* Warning if price decreased */}
                            {!canSubmit && (
                                <div style={{
                                    backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px',
                                    padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '20px'
                                }}>
                                    <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontWeight: 600, color: '#dc2626', margin: 0 }}>Cannot reduce booking amount</p>
                                        <p style={{ fontSize: '13px', color: '#b91c1c', margin: '4px 0 0' }}>
                                            The new total (GH₵{newTotalPrice.toLocaleString()}) is less than the original paid amount (GH₵{originalTotal.toLocaleString()}).
                                            Please adjust the selection.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Summary */}
                            <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px' }}>
                                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Updated Details</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                                    <div>
                                        <p style={{ color: '#9ca3af', margin: 0 }}>Facility</p>
                                        <p style={{ fontWeight: 500, margin: '4px 0 0' }}>{selectedHallsData.map(h => h.name).join(', ') || 'None'}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: '#9ca3af', margin: 0 }}>Event</p>
                                        <p style={{ fontWeight: 500, margin: '4px 0 0' }}>{eventType}</p>
                                    </div>
                                    <div>
                                        <p style={{ color: '#9ca3af', margin: 0 }}>Date</p>
                                        <p style={{ fontWeight: 500, margin: '4px 0 0' }}>
                                            {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={{ color: '#9ca3af', margin: 0 }}>Time & Duration</p>
                                        <p style={{ fontWeight: 500, margin: '4px 0 0' }}>{selectedTime} • {duration} hrs</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '16px 24px', borderTop: '1px solid #e5e7eb',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <button
                        onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
                        disabled={currentStep === 1}
                        style={{
                            padding: '12px 20px', borderRadius: '10px',
                            border: '1px solid #e5e7eb', backgroundColor: 'white',
                            color: currentStep === 1 ? '#d1d5db' : '#374151',
                            fontSize: '14px', fontWeight: 500, cursor: currentStep === 1 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Back
                    </button>

                    {currentStep < 4 ? (
                        <button
                            onClick={() => setCurrentStep(s => Math.min(4, s + 1))}
                            style={{
                                padding: '12px 24px', borderRadius: '10px',
                                backgroundColor: '#111827', color: 'white', border: 'none',
                                fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            Next <ArrowRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={!canSubmit || isSubmitting}
                            style={{
                                padding: '12px 24px', borderRadius: '10px',
                                backgroundColor: canSubmit ? '#10b981' : '#d1d5db',
                                color: 'white', border: 'none',
                                fontSize: '14px', fontWeight: 600,
                                cursor: canSubmit && !isSubmitting ? 'pointer' : 'not-allowed',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Check size={16} /> Save Changes
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
