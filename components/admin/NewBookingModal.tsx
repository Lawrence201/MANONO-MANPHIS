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
    ArrowRight,
    User,
    Phone,
    Mail,
    Briefcase
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
    roomQuantity?: number; // Added for Hostels
}

interface Hostel {
    id: number;
    name: string;
    description: string;
    price: string;
    duration: string;
    roomQuantity: number;
    mainImagePath: string | null;
    addOns: any[];
}

interface NewBookingModalProps {
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

export default function NewBookingModal({ onClose, onSuccess }: NewBookingModalProps) {
    // Steps: 1 = Customer Details, 2 = Venue, 3 = Date/Time, 4 = Add-ons, 5 = Review
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [bookingRef, setBookingRef] = useState('');

    // Data states
    const [facilityType, setFacilityType] = useState<'Hall' | 'Hostel'>('Hall');
    const [halls, setHalls] = useState<Hall[]>([]);
    const [loadingFacilities, setLoadingFacilities] = useState(true);
    const [availableRooms, setAvailableRooms] = useState<number>(0);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);

    // Form states - Step 1: Customer Details
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [organization, setOrganization] = useState('');
    const [message, setMessage] = useState('');

    // Form states - Step 2: Venue/Lodge
    const [selectedHallIds, setSelectedHallIds] = useState<number[]>([]);
    const [eventType, setEventType] = useState('wedding');
    const [eventName, setEventName] = useState('');
    const [duration, setDuration] = useState('');
    const [numberOfRooms, setNumberOfRooms] = useState('1');
    const [guests, setGuests] = useState('1');

    // Form states - Step 3: Date & Time
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [staffMember, setStaffMember] = useState('Any staff member');

    // Form states - Step 4: Add-ons
    const [selectedAddonIds, setSelectedAddonIds] = useState<number[]>([]);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [serverTime, setServerTime] = useState<Date | null>(null);

    const LATE_PENALTY = 300;

    // Fetch server time on mount
    useEffect(() => {
        const fetchTime = async () => {
            try {
                const res = await fetch('/api/server-time');
                if (res.ok) {
                    const data = await res.json();
                    setServerTime(new Date(data.now));
                }
            } catch (e) {
                console.error('Failed to fetch server time', e);
            }
        };
        fetchTime();
    }, []);

    const isLateBooking = useMemo(() => {
        if (!selectedDate || !serverTime) return false;
        try {
            const eventDateTime = new Date(selectedDate);
            // Default check time if none selected: Hall: 6am, Hostel: 3pm
            const checkTime = selectedTime || (facilityType === 'Hostel' ? '3:00 pm' : '6:00 am');
            const startTimePart = checkTime.split(' - ')[0] || checkTime;
            const [timeStr, period] = startTimePart.trim().split(' ');
            let [hours, minutes] = timeStr.split(':').map(Number);
            if (isNaN(minutes)) minutes = 0;
            if (period?.toLowerCase() === 'pm' && hours !== 12) hours += 12;
            if (period?.toLowerCase() === 'am' && hours === 12) hours = 0;
            eventDateTime.setHours(hours, minutes, 0, 0);

            const diffMs = eventDateTime.getTime() - serverTime.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            return diffHours < 72;
        } catch (e) {
            return false;
        }
    }, [selectedDate, serverTime, selectedTime, facilityType]);

    // Fetch facilities on mount and type change
    useEffect(() => {
        const fetchFacilities = async () => {
            setLoadingFacilities(true);
            try {
                const endpoint = facilityType === 'Hall' ? '/api/halls' : '/api/hostels';
                const res = await fetch(endpoint);
                if (res.ok) {
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await res.json();
                        setHalls(facilityType === 'Hall' ? (data.halls || []) : (data || []));
                    } else {
                        console.error(`Non-JSON response from ${endpoint}`);
                    }
                } else {
                    console.error(`Failed to fetch ${facilityType}:`, res.status);
                }
            } catch (err) {
                console.error(`Error fetching ${facilityType}:`, err);
            } finally {
                setLoadingFacilities(false);
            }
        };
        fetchFacilities();
        setSelectedHallIds([]); // Reset selection when type changes
        setSelectedTime(facilityType === 'Hostel' ? '3:00 pm' : null);
    }, [facilityType]);

    const selectedHallsData = useMemo(() =>
        halls.filter(h => selectedHallIds.includes(h.id)),
        [halls, selectedHallIds]
    );

    // Fetch dynamic availability for Lodges
    useEffect(() => {
        const fetchAvailability = async () => {
            const selectedHostelId = selectedHallIds[0];
            if (facilityType !== 'Hostel' || !selectedHostelId || !selectedDate) return;

            setAvailabilityLoading(true);
            try {
                const checkInDateStr = selectedDate.toISOString().split('T')[0];
                const days = parseInt(duration) || 1;
                const res = await fetch(
                    `/api/hostels/availability?hostelId=${selectedHostelId}&checkInDate=${checkInDateStr}&numberOfDays=${days}`,
                    { cache: 'no-store' }
                );

                if (res.ok) {
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await res.json();
                        setAvailableRooms(data.availableRooms);
                        // Adjust selected rooms if they exceed available
                        if (parseInt(numberOfRooms) > data.availableRooms && data.availableRooms > 0) {
                            setNumberOfRooms(data.availableRooms.toString());
                        } else if (data.availableRooms === 0) {
                            setNumberOfRooms('0');
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to fetch availability:', err);
            } finally {
                setAvailabilityLoading(false);
            }
        };

        fetchAvailability();
    }, [facilityType, selectedHallIds, selectedDate, duration]);

    // Auto-initialize fields when facility is selected
    useEffect(() => {
        if (selectedHallIds.length > 0 && selectedHallsData.length > 0) {
            const facility = selectedHallsData[0];
            if (facilityType === 'Hall') {
                setDuration(facility.duration.replace(/[^0-9]/g, '') || '4');
                setGuests(facility.capacity?.toString() || '50');
            } else {
                // For Lodges
                setDuration('1'); // Default to 1 day
                setGuests(facility.capacity?.toString() || '1');
                setNumberOfRooms('1');
            }
        }
    }, [selectedHallIds, facilityType, selectedHallsData]);

    // Calculate total price
    const totalPrice = useMemo(() => {
        if (selectedHallsData.length === 0) return 0;

        let baseFacilityTotal = 0;
        if (facilityType === 'Hall') {
            baseFacilityTotal = selectedHallsData.reduce((sum, hall) => {
                const basePrice = parsePrice(hall.price);
                const baseDuration = parseInt(hall.duration) || 4;
                const hourlyRate = basePrice / baseDuration;
                const enteredDuration = parseFloat(duration) || baseDuration;
                return sum + Math.round(hourlyRate * enteredDuration);
            }, 0);
        } else {
            // Lodge calculation: Price * Days * Rooms
            baseFacilityTotal = selectedHallsData.reduce((sum, lodge) => {
                const basePrice = parsePrice(lodge.price);
                const days = parseInt(duration) || 1;
                const rooms = parseInt(numberOfRooms) || 1;
                return sum + (basePrice * days * rooms);
            }, 0);
        }

        const addonsPrice = selectedAddonIds.reduce((acc, id) => {
            for (const facility of selectedHallsData) {
                const addon = facility.addOns?.find((a: any) => a.id === id);
                if (addon) {
                    return acc + parsePrice(addon.price);
                }
            }
            return acc;
        }, 0);

        return baseFacilityTotal + addonsPrice + (isLateBooking ? LATE_PENALTY : 0);
    }, [selectedHallsData, selectedAddonIds, duration, facilityType, numberOfRooms, isLateBooking]);

    // Fetch booked time slots
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
                        return bDate.toDateString() === selectedDateStr && b.paymentStatus !== 'cancelled';
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
    }, [selectedHallIds, selectedDate]);

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
        '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm'
    ];

    const lodgeTimes = [
        '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm'
    ];

    // Calendar helpers
    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    
    const isDateInRange = (date: Date): boolean => {
        if (facilityType !== 'Hostel' || !selectedDate || (parseInt(duration) || 1) <= 1) return false;
        const startTime = new Date(selectedDate);
        startTime.setHours(0, 0, 0, 0);
        const endTime = new Date(startTime);
        endTime.setDate(endTime.getDate() + (parseInt(duration) - 1));
        
        const dateTime = new Date(date);
        dateTime.setHours(0, 0, 0, 0);
        
        return dateTime > startTime && dateTime <= endTime;
    };

    const handleSubmit = async () => {
        if (!selectedDate || (facilityType === 'Hall' && !selectedTime) || selectedHallIds.length === 0) return;

        setIsSubmitting(true);
        try {
            const endpoint = facilityType === 'Hall' ? '/api/bookings' : '/api/bookings/hostel';
            
            const payload = facilityType === 'Hall' ? {
                hallIds: selectedHallIds,
                eventType,
                eventName,
                eventDate: selectedDate.toISOString(),
                startTime: selectedTime,
                duration: duration || (selectedHallsData[0]?.duration.replace(/[^0-9]/g, '')),
                firstName,
                lastName,
                email,
                phone,
                organization,
                message,
                addOns: selectedAddonIds,
                staffMember,
                paymentMethod: 'Direct Admin Booking',
                penalty: isLateBooking ? LATE_PENALTY : 0,
                totalAmount: totalPrice
            } : {
                hostelId: selectedHallIds[0],
                checkInDate: selectedDate.toISOString(),
                numberOfDays: parseInt(duration) || 1,
                guests: parseInt(guests) || 1,
                numberOfRooms: parseInt(numberOfRooms) || 1,
                firstName,
                lastName,
                email,
                phone,
                institution: organization,
                specialRequests: message,
                addOns: selectedHallsData[0].addOns
                    .filter((a: any) => selectedAddonIds.includes(a.id))
                    .map((a: any) => ({
                        name: a.name,
                        price: parsePrice(a.price),
                        unit: a.unit || 'Fixed'
                    })),
                paymentMethod: 'Direct Admin Booking',
                penalty: isLateBooking ? LATE_PENALTY : 0,
                totalAmount: totalPrice
            };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const contentType = res.headers.get('content-type');
            let data;
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error('Non-JSON response from booking API:', text);
                throw new Error(`Server returned non-JSON response (${res.status}). Please check console.`);
            }

            if (res.ok) {
                setBookingRef(data.reference);
                setShowSuccess(true);
                
                // Trigger PDF generation for the admin
                import('@/lib/receiptGenerator').then(module => {
                    module.generateInternalInvoicePDF({
                        reference: data.reference,
                        customerName: `${firstName} ${lastName}`,
                        email,
                        phone,
                        organization: organization || undefined,
                        eventType: facilityType === 'Hall' ? eventType : 'Accommodation',
                        eventName: eventName || undefined,
                        eventDate: selectedDate!.toLocaleDateString(),
                        startTime: selectedTime || (facilityType === 'Hostel' ? '3:00 pm' : ''),
                        duration: facilityType === 'Hall' ? (duration || '4') : `${duration} days`,
                        facilities: selectedHallsData.map(h => {
                            let price = parsePrice(h.price);
                            if (facilityType === 'Hall') {
                                const baseDuration = parseInt(h.duration) || 4;
                                const hourlyRate = price / baseDuration;
                                const enteredDuration = parseFloat(duration) || baseDuration;
                                price = Math.round(hourlyRate * enteredDuration);
                            } else {
                                const days = parseInt(duration) || 1;
                                const rooms = parseInt(numberOfRooms) || 1;
                                price = price * days * rooms;
                            }
                            return { name: h.name, price };
                        }),
                        addOns: selectedAddonIds.length > 0
                            ? selectedHallsData.flatMap(h =>
                                h.addOns?.filter((a: any) => selectedAddonIds.includes(a.id)).map((a: any) => ({
                                    name: a.name,
                                    price: parsePrice(a.price)
                                })) || []
                            )
                            : undefined,
                        paymentDate: new Date().toLocaleDateString(),
                        facilityType: facilityType === 'Hall' ? 'Hall' : 'Lodge',
                        penalty: isLateBooking ? LATE_PENALTY : 0,
                        subtotal: totalPrice,
                        totalAmount: totalPrice,
                        paymentMethod: 'Internal Invoice'
                    }).catch(err => console.error('PDF Generation Error:', err));
                });
            } else {
                alert(data.message || 'Failed to create booking');
            }
        } catch (err) {
            console.error('Submit error:', err);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-fill duration when hall changes and lock it
    useEffect(() => {
        if (selectedHallIds.length > 0 && selectedHallsData.length > 0) {
            const hallDuration = selectedHallsData[0].duration.replace(/[^0-9]/g, '');
            setDuration(hallDuration);
        } else if (selectedHallIds.length === 0) {
            setDuration('');
        }
    }, [selectedHallIds, selectedHallsData]);

    // Validation for steps
    const isStep1Valid = firstName && lastName && email && phone;
    const isStep2Valid = selectedHallIds.length > 0 && eventType;
    const isStep3Valid = selectedDate && selectedTime;

    const nextStep = () => {
        if (currentStep === 1 && !isStep1Valid) return;
        if (currentStep === 2 && !isStep2Valid) return;
        if (currentStep === 3 && !isStep3Valid) return;
        setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => setCurrentStep(prev => prev - 1);

    if (showSuccess) {
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
                        Booking Created
                    </h2>
                    <p style={{ color: '#6b7280', marginBottom: '24px' }}>
                        Reference: <strong>{bookingRef}</strong>
                    </p>

                    <div style={{
                        backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px',
                        marginBottom: '24px', textAlign: 'left'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#6b7280' }}>Customer</span>
                            <span style={{ fontWeight: 600 }}>{firstName} {lastName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ color: '#6b7280' }}>Total Amount</span>
                            <span style={{ fontWeight: 600 }}>GH₵ {totalPrice.toLocaleString()}</span>
                        </div>
                        {isLateBooking && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626', fontSize: '13px' }}>
                                <span>Includes Late Penalty</span>
                                <span>GH₵ {LATE_PENALTY}</span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => { onSuccess(); onClose(); }}
                        style={{
                            width: '100%', padding: '14px', borderRadius: '10px',
                            backgroundColor: '#111827', color: 'white', border: 'none',
                            fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

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
                            New Admin Booking
                        </h2>
                        <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0' }}>
                            Create a manual booking for a client
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
                    {[1, 2, 3, 4, 5].map(step => (
                        <div key={step} style={{
                            width: '40px', height: '4px', borderRadius: '2px',
                            backgroundColor: currentStep >= step ? '#2563eb' : '#d1d5db'
                        }} />
                    ))}
                </div>

                {/* Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                    {/* Step 1: Customer Details */}
                    {currentStep === 1 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={20} /> Customer Information
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>First Name *</label>
                                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} style={inputStyle} placeholder="John" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Last Name *</label>
                                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} style={inputStyle} placeholder="Doe" />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                <div>
                                    <label style={labelStyle}>Email Address *</label>
                                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} placeholder="client@example.com" />
                                </div>
                                <div>
                                    <label style={labelStyle}>Phone Number *</label>
                                    <input type="text" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} placeholder="+233..." />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Organization / Group</label>
                                <input type="text" value={organization} onChange={e => setOrganization(e.target.value)} style={inputStyle} placeholder="e.g. Calvary Church" />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>Special Message / Notes</label>
                                <textarea
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                                    placeholder="Any special requests..."
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Venue */}
                    {currentStep === 2 && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Building2 size={20} /> Select Facility
                                </h3>
                                <div style={{ display: 'flex', gap: '8px', padding: '4px', backgroundColor: '#f3f4f6', borderRadius: '10px' }}>
                                    <button
                                        onClick={() => setFacilityType('Hall')}
                                        style={{
                                            padding: '6px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 600,
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            backgroundColor: facilityType === 'Hall' ? 'white' : 'transparent',
                                            color: facilityType === 'Hall' ? '#111827' : '#6b7280',
                                            boxShadow: facilityType === 'Hall' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >Halls</button>
                                    <button
                                        onClick={() => setFacilityType('Hostel')}
                                        style={{
                                            padding: '6px 16px', borderRadius: '8px', border: 'none', fontSize: '12px', fontWeight: 600,
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            backgroundColor: facilityType === 'Hostel' ? 'white' : 'transparent',
                                            color: facilityType === 'Hostel' ? '#111827' : '#6b7280',
                                            boxShadow: facilityType === 'Hostel' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >Lodges</button>
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '20px' }}>
                                <label style={labelStyle}>{facilityType === 'Hall' ? 'Facilities *' : 'Lodge *'}</label>
                                {loadingFacilities ? (
                                    <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading {facilityType.toLowerCase()}...</div>
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
                                                    onClick={() => {
                                                        if (facilityType === 'Hostel') {
                                                            setSelectedHallIds([hall.id]); // Hostels usually single selection
                                                        } else {
                                                            setSelectedHallIds(prev =>
                                                                prev.includes(hall.id)
                                                                    ? prev.filter(id => id !== hall.id)
                                                                    : [...prev, hall.id]
                                                            );
                                                        }
                                                    }}
                                                    style={{
                                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                        padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                                        backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                                                        border: isSelected ? '1px solid #3b82f6' : '1px solid transparent',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <input 
                                                            type={facilityType === 'Hostel' ? "radio" : "checkbox"} 
                                                            checked={isSelected} 
                                                            readOnly 
                                                            name="facility"
                                                        />
                                                        <span style={{ fontWeight: isSelected ? 600 : 400 }}>{hall.name}</span>
                                                    </div>
                                                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                                                        GH₵{facilityType === 'Hostel' 
                                                            ? (parsePrice(hall.price) * (parseInt(duration) || 1) * (parseInt(numberOfRooms) || 1)).toLocaleString()
                                                            : parsePrice(hall.price).toLocaleString()
                                                        }
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {facilityType === 'Hostel' && selectedHallIds.length > 0 && (
                                <div style={{
                                    marginTop: '-10px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb',
                                    backgroundColor: availabilityLoading ? '#f3f4f6' : (availableRooms > 0 ? '#ecfdf5' : '#fef2f2'),
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    marginBottom: '20px'
                                }}>
                                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#374151' }}>Real-time Availability:</span>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: availableRooms > 0 ? '#059669' : '#DC2626' }}>
                                        {availabilityLoading ? 'Checking...' : (!selectedDate ? 'Select a date first (Step 3)' : (availableRooms > 0 ? `${availableRooms} Rooms available` : '0 (Sold Out)'))}
                                    </span>
                                </div>
                            )}

                            {facilityType === 'Hall' ? (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={labelStyle}>Event Type *</label>
                                            <select value={eventType} onChange={e => setEventType(e.target.value)} style={inputStyle}>
                                                <option value="wedding">Wedding</option>
                                                <option value="conference">Conference</option>
                                                <option value="church">Church Service</option>
                                                <option value="party">Party</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Event Name</label>
                                            <input type="text" value={eventName} onChange={e => setEventName(e.target.value)}
                                                placeholder="e.g. Annual Banquet" style={inputStyle} />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={labelStyle}>Duration (Hours) *</label>
                                        <input
                                            type="text"
                                            value={duration}
                                            onChange={e => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setDuration(val);
                                            }}
                                            readOnly={selectedHallIds.length > 0}
                                            style={{
                                                ...inputStyle,
                                                backgroundColor: selectedHallIds.length > 0 ? '#f3f4f6' : 'white',
                                                cursor: selectedHallIds.length > 0 ? 'not-allowed' : 'default',
                                                fontWeight: selectedHallIds.length > 0 ? '600' : '400'
                                            }}
                                            placeholder={selectedHallIds.length > 0 ? "" : "Select a hall first"}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                                        <div>
                                            <label style={labelStyle}>Number of Rooms *</label>
                                            <select 
                                                value={numberOfRooms} 
                                                onChange={e => setNumberOfRooms(e.target.value)} 
                                                style={inputStyle}
                                                disabled={availableRooms === 0 || availabilityLoading}
                                            >
                                                {availableRooms === 0 ? (
                                                    <option value="0">No rooms available</option>
                                                ) : (
                                                    Array.from({ length: availableRooms }, (_, i) => i + 1).map(num => (
                                                        <option key={num} value={num.toString()}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                                                    ))
                                                )}
                                            </select>
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Total Guests *</label>
                                            <input 
                                                type="number" 
                                                min="1" 
                                                value={guests} 
                                                onChange={e => setGuests(e.target.value)} 
                                                style={inputStyle} 
                                            />
                                        </div>
                                    </div>
                                    <div style={{ marginBottom: '20px' }}>
                                        <label style={labelStyle}>Duration (Days) *</label>
                                        <input
                                            type="text"
                                            value={duration}
                                            onChange={e => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                setDuration(val);
                                            }}
                                            style={inputStyle}
                                            placeholder="Number of days"
                                        />
                                    </div>
                                </>
                            )}

                            {/* Live Price Calculator Display */}
                            {selectedHallIds.length > 0 && selectedHallsData.length > 0 && (
                                <div style={{
                                    marginTop: '20px',
                                    padding: '16px',
                                    backgroundColor: '#f0fdf4',
                                    border: '1px solid #bbf7d0',
                                    borderRadius: '12px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                        <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.025em' }}>
                                            Estimated Total
                                        </span>
                                        <div style={{ fontSize: '14px', color: '#166534', fontWeight: '500' }}>
                                            {facilityType === 'Hostel' ? (
                                                <span>{numberOfRooms} Room{parseInt(numberOfRooms) !== 1 ? 's' : ''} × {duration || '1'} Day{parseInt(duration) !== 1 ? 's' : ''} booking</span>
                                            ) : (
                                                <span>{duration || (selectedHallsData[0]?.duration.replace(/[^0-9]/g, '') || '4')} Hour{parseInt(duration) !== 1 ? 's' : ''} booking</span>
                                            )}
                                            <span style={{ opacity: 0.6, marginLeft: '6px', fontSize: '12px', fontWeight: '400' }}>
                                                (₵{parsePrice(selectedHallsData[0].price).toLocaleString()} base)
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '20px', fontWeight: '800', color: '#166534' }}>
                                        GH₵ {totalPrice.toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Date & Time */}
                    {currentStep === 3 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Calendar size={20} /> Date & Time
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                {/* Calendar */}
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px' }}>
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
                                            const isInRange = isDateInRange(date);
                                            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                                            return (
                                                <div
                                                    key={day}
                                                    onClick={() => !isPast && setSelectedDate(date)}
                                                    style={{
                                                        padding: '10px', borderRadius: '8px', cursor: isPast ? 'not-allowed' : 'pointer',
                                                        backgroundColor: isSelected ? '#2563eb' : (isInRange ? '#dbeafe' : 'transparent'),
                                                        color: isSelected ? 'white' : (isInRange ? '#2563eb' : isPast ? '#d1d5db' : '#374151'),
                                                        fontWeight: (isSelected || isInRange) ? 600 : 400
                                                    }}
                                                >
                                                    {day}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time slots */}
                                <div>
                                    <label style={labelStyle}>{facilityType === 'Hall' ? 'Available Sessions' : 'Check Times'}</label>
                                    {facilityType === 'Hostel' ? (
                                        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                            <div style={{
                                                flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff',
                                                display: 'flex', flexDirection: 'column', gap: '4px'
                                            }}>
                                                <span style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Check-in</span>
                                                <span style={{ fontWeight: 600 }}>3:00 PM</span>
                                            </div>
                                            <div style={{
                                                flex: 1, padding: '12px', borderRadius: '8px', backgroundColor: '#f3f4f6', color: '#374151',
                                                display: 'flex', flexDirection: 'column', gap: '4px', border: '1px solid #e5e7eb'
                                            }}>
                                                <span style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.025em' }}>Check-out</span>
                                                <span style={{ fontWeight: 600 }}>12:00 PM</span>
                                            </div>
                                        </div>
                                    ) : loadingSlots ? (
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>Loading slots...</div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '300px', overflowY: 'auto', paddingRight: '4px' }}>
                                            {allTimes.map(time => {
                                                const isBooked = bookedTimeSlots.includes(time);
                                                const isSelected = selectedTime === time;
                                                return (
                                                    <button
                                                        key={time}
                                                        disabled={isBooked}
                                                        onClick={() => setSelectedTime(time)}
                                                        style={{
                                                            padding: '10px', borderRadius: '8px',
                                                            border: isSelected ? '2px solid #2563eb' : '1px solid #e5e7eb',
                                                            backgroundColor: isBooked ? '#f3f4f6' : isSelected ? '#2563eb' : 'white',
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
                                    <div style={{ marginTop: '20px' }}>
                                        <label style={labelStyle}>Assign Staff Member</label>
                                        <select value={staffMember} onChange={e => setStaffMember(e.target.value)} style={inputStyle}>
                                            <option>Any staff member</option>
                                            <option>Emily Odurwaa Asante</option>
                                            <option>Magdalene Xoese Quarshie</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Add-ons */}
                    {currentStep === 4 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={20} /> Optional Add-ons
                            </h3>
                            {selectedHallsData.length === 0 ? (
                                <p style={{ color: '#6b7280' }}>Please select a hall first.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {selectedHallsData.map(hall => (
                                        <div key={hall.id}>
                                            <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px', color: '#111827' }}>{hall.name} Add-ons</h4>
                                            {hall.addOns.length === 0 ? (
                                                <p style={{ color: '#9ca3af', fontSize: '13px' }}>No add-ons available for this facility</p>
                                            ) : (
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
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
                                                                    backgroundColor: isSelected ? '#f0fdf4' : '#f9fafb',
                                                                    border: isSelected ? '1px solid #10b981' : '1px solid #e5e7eb'
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                    <input type="checkbox" checked={isSelected} readOnly />
                                                                    <span style={{ fontSize: '14px' }}>{addon.name}</span>
                                                                </div>
                                                                <span style={{ fontWeight: 600, color: '#059669', fontSize: '13px' }}>
                                                                    GH₵{parsePrice(addon.price).toLocaleString()}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 5 && (
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <DollarSign size={20} /> Review Booking Summary
                            </h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Customer & Event</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Client</p>
                                            <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{firstName} {lastName}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Contact</p>
                                            <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>{email} • {phone}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Event</p>
                                            <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>{eventType.toUpperCase()} {eventName && `(${eventName})`}</p>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Schedule & Pricing</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Date & Time</p>
                                            <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>
                                                {selectedDate?.toLocaleDateString()} at {selectedTime} ({duration} hrs)
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Facilities</p>
                                            <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>{selectedHallsData.map(h => h.name).join(', ')}</p>
                                        </div>
                                        <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                <span style={{ fontWeight: 600, color: '#111827' }}>Total Amount</span>
                                                <span style={{ fontWeight: 700, fontSize: '18px', color: '#2563eb' }}>GH₵ {totalPrice.toLocaleString()}</span>
                                            </div>
                                            {isLateBooking && (
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#dc2626', fontSize: '13px' }}>
                                                    <span>Late Booking Penalty</span>
                                                    <span>+ GH₵ {LATE_PENALTY}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    padding: '20px 24px', borderTop: '1px solid #e5e7eb',
                    display: 'flex', justifyContent: 'space-between', backgroundColor: '#f9fafb'
                }}>
                    <button
                        onClick={currentStep === 1 ? onClose : prevStep}
                        style={{
                            padding: '10px 20px', borderRadius: '8px', border: '1px solid #e5e7eb',
                            backgroundColor: 'white', color: '#374151', fontSize: '14px',
                            fontWeight: 500, cursor: 'pointer'
                        }}
                    >
                        {currentStep === 1 ? 'Cancel' : 'Previous'}
                    </button>
                    <button
                        onClick={currentStep === 5 ? handleSubmit : nextStep}
                        disabled={isSubmitting || (currentStep === 1 && !isStep1Valid) || (currentStep === 2 && !isStep2Valid) || (currentStep === 3 && !isStep3Valid)}
                        style={{
                            padding: '10px 24px', borderRadius: '8px', border: 'none',
                            backgroundColor: currentStep === 5 ? '#111827' : '#2563eb',
                            color: 'white', fontSize: '14px', fontWeight: 500,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : currentStep === 5 ? 'Create Booking' : 'Next Step'}
                        {currentStep < 5 && !isSubmitting && <ArrowRight size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
