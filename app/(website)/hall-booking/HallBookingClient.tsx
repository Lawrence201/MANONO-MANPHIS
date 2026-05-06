'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaPenToSquare, FaChevronDown, FaCreditCard, FaBuildingColumns, FaMobileScreen, FaCircleCheck } from 'react-icons/fa6';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from './HallBooking.module.css';
import PaymentModal from '@/components/payments/PaymentModal';
import { generatePendingRequestPDF, formatReceiptDate } from '@/lib/receiptGenerator';

const parsePrice = (price: string | number | null | undefined): number => {
    if (!price) return 0;
    const stringPrice = String(price);
    // Remove all non-numeric characters except dot
    const cleanPrice = stringPrice.replace(/[^\d.]/g, '');
    const value = parseFloat(cleanPrice);
    return isNaN(value) ? 0 : value;
};

interface HallAddOn {
    id: number;
    name: string;
    price: string;
    unit: string;
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

const HallBookingPageContent = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const preSelectedHallId = searchParams.get('hallId');

    // Calendar & Step State (Moved up to avoid ReferenceError)
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [currentStep, setCurrentStep] = React.useState(1);

    const [halls, setHalls] = React.useState<Hall[]>([]);
    const [selectedHallIds, setSelectedHallIds] = React.useState<string[]>(preSelectedHallId ? [preSelectedHallId] : []);
    const [eventType, setEventType] = React.useState('');
    const [eventName, setEventName] = React.useState('');
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
    const [showAllTimes, setShowAllTimes] = React.useState(false);
    const [paymentMethod, setPaymentMethod] = React.useState('paystack');
    const [duration, setDuration] = React.useState('');
    const [bookingMode, setBookingMode] = React.useState<'single' | 'multiple'>('single');

    // Submission State
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [bookingReferences, setBookingReferences] = React.useState<string[]>([]);


    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [organization, setOrganization] = React.useState('');

    const [message, setMessage] = React.useState('');
    const [otherEventType, setOtherEventType] = React.useState('');
    const [staffMember, setStaffMember] = React.useState('Any staff member');

    // Booked Time Slots State
    const [bookedTimeSlots, setBookedTimeSlots] = React.useState<string[]>([]);
    const [loadingTimeSlots, setLoadingTimeSlots] = React.useState(false);
    const [serverTime, setServerTime] = React.useState<Date | null>(null);

    // Fetch server time on mount
    React.useEffect(() => {
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

    const isLateBooking = React.useMemo(() => {
        if (!selectedDate || !serverTime) return false;
        
        try {
            // Create a date object for the event
            const eventDateTime = new Date(selectedDate);
            
            // Use selected time if available, otherwise assume earliest session (6:00 am) for checking
            const checkTime = selectedTime || '6:00 am';
            
            // Parse checkTime (e.g., '6:00 am')
            const startTimePart = checkTime.split(' - ')[0] || checkTime;
            const [timeStr, period] = startTimePart.trim().split(' ');
            let [hours, minutes] = timeStr.split(':').map(Number);
            if (isNaN(minutes)) minutes = 0;

            if (period?.toLowerCase() === 'pm' && hours !== 12) hours += 12;
            if (period?.toLowerCase() === 'am' && hours === 12) hours = 0;

            eventDateTime.setHours(hours, minutes, 0, 0);

            // 72 hours window check
            const diffMs = eventDateTime.getTime() - serverTime.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            
            return diffHours < 72;
        } catch (e) {
            console.error('Error calculating late booking:', e);
            return false;
        }
    }, [selectedDate, serverTime, selectedTime]);

    const LATE_PENALTY = 300;

    const [pendingBookingData, setPendingBookingData] = React.useState<Record<string, any> | null>(null);

    // Derived state for the currently selected halls details
    const selectedHallsData = React.useMemo(() =>
        halls.filter(h => selectedHallIds.includes(h.id.toString())),
        [halls, selectedHallIds]);

    const [selectedAddonIds, setSelectedAddonIds] = React.useState<number[]>([]);
    const [showAllAddons, setShowAllAddons] = React.useState(false);

    const handleToggleAddon = (addonId: number) => {
        setSelectedAddonIds(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const totalPrice = React.useMemo(() => {
        if (selectedHallsData.length === 0) return 0;

        // Calculate hall price based on duration
        const hallsTotal = selectedHallsData.reduce((sum, hall) => {
            const basePrice = parsePrice(hall.price);
            const baseDuration = parseInt(hall.duration) || 4;
            const hourlyRate = basePrice / baseDuration;
            const enteredDuration = parseFloat(duration) || 0;

            // If duration is entered, calculate based on hourly rate
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

        const baseTotal = hallsTotal + addonsPrice;
        return isLateBooking ? baseTotal + LATE_PENALTY : baseTotal;
    }, [selectedHallsData, selectedAddonIds, duration, isLateBooking]);

    // Calculate hourly rate and price info for live display
    const durationPriceInfo = React.useMemo(() => {
        if (selectedHallsData.length === 0) return null;

        const hall = selectedHallsData[0];
        const basePrice = parsePrice(hall.price);
        const baseDuration = parseInt(hall.duration) || 4;
        const hourlyRate = Math.round((basePrice / baseDuration) * 100) / 100;
        const enteredDuration = parseFloat(duration) || 0;
        const calculatedPrice = Math.round(hourlyRate * enteredDuration);

        return {
            basePrice,
            baseDuration,
            hourlyRate,
            enteredDuration,
            calculatedPrice,
            isValid: enteredDuration > 0
        };
    }, [selectedHallsData, duration]);

    // Helper function to convert time string to minutes from midnight
    const timeToMinutes = (timeStr: string): number => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'pm' && hours !== 12) hours += 12;
        if (period === 'am' && hours === 12) hours = 0;

        return hours * 60 + minutes;
    };

    // Helper function to convert minutes back to time string
    const minutesToTime = (minutes: number): string => {
        let hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const period = hours >= 12 ? 'pm' : 'am';

        if (hours > 12) hours -= 12;
        if (hours === 0) hours = 12;

        const minsStr = mins === 0 ? '00' : mins.toString();
        return `${hours}:${minsStr} ${period}`;
    };

    const handleConfirmBooking = async () => {
        if (selectedHallIds.length === 0 || !selectedDate || !selectedTime) {
            alert('Please complete all required fields (Select at least one Hall, Date, Time).');
            return;
        }

        const trimmedEmail = email.trim().toLowerCase().replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');
        // Standardized email validation regex
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!firstName || !lastName) {
            alert('Please enter your first and last name.');
            return;
        }

        // Validate minimum duration
        const minDuration = selectedHallsData.length > 0
            ? Math.max(...selectedHallsData.map(h => parseInt(h.duration) || 1))
            : 1;
        const enteredDuration = parseInt(duration) || 0;

        if (enteredDuration < minDuration) {
            alert(`Minimum booking duration is ${minDuration} hour${minDuration !== 1 ? 's' : ''} for the selected hall${selectedHallsData.length > 1 ? 's' : ''}.`);
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare booking data for request flow
            const bookingData = {
                hallIds: selectedHallIds,
                eventType: eventType === 'other' ? otherEventType : eventType,
                eventName,
                eventDate: selectedDate.toISOString(),
                startTime: selectedTime,
                duration: duration || (selectedHallsData[0]?.duration || 'Standard'),
                firstName,
                lastName,
                email: trimmedEmail,
                phone,
                organization,
                message,
                addOns: selectedAddonIds,
                paymentMethod: 'invoice', // Changed to invoice since they pay offline
                paymentStatus: 'pending',   // Always pending initially
                staffMember,
                penalty: isLateBooking ? LATE_PENALTY : 0
            };

            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            // Robust JSON parsing
            let result: any = {};
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response from /api/bookings:', text.substring(0, 200));
                throw new Error(`Server returned non-JSON response (${response.status})`);
            }

            if (response.ok) {
                const reference = result.reference || result.references?.[0];
                const bookingId = result.id || result.bookingId;
                setBookingReferences(result.references || [reference]);

                const requestData = {
                    reference: reference,
                    customerName: `${firstName} ${lastName}`,
                    email: trimmedEmail,
                    phone: phone,
                    organization: organization || undefined,
                    eventType: bookingData.eventType,
                    eventName: bookingData.eventName || undefined,
                    eventDate: formatReceiptDate(selectedDate!),
                    startTime: selectedTime || '',
                    duration: bookingData.duration,
                    facilities: selectedHallsData.map(h => ({ 
                        name: h.name, 
                        price: parsePrice(h.price) 
                    })),
                    addOns: selectedAddonIds.length > 0
                        ? selectedHallsData.flatMap(h =>
                            h.addOns?.filter(a => selectedAddonIds.includes(a.id)).map(a => ({
                                name: a.name,
                                price: parsePrice(a.price)
                            })) || []
                        )
                        : undefined,
                    requestDate: formatReceiptDate(new Date()),
                    facilityType: 'Hall' as const,
                    penalty: bookingData.penalty,
                    totalAmount: totalPrice
                };

                setCurrentStep(4);
                window.scrollTo(0, 0);

                generatePendingRequestPDF(requestData).catch(err =>
                    console.error('Client PDF generation failed:', err)
                );
            } else {
                throw new Error(result.message || 'Failed to submit booking request');
            }
        } catch (error: any) {
            console.error('Booking request error:', error);
            alert(error.message || 'Failed to submit booking request. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    // Reset add-ons when hall changes
    // Reset add-ons when halls change selection (optional, but safer to clear orphans)
    // Actually, distinct halls have distinct addon IDs, so keeping them might be fine?
    // But if I unselect a hall, I should probably remove its add-ons.
    React.useEffect(() => {
        setSelectedAddonIds(prev => {
            // Keep only addons that belong to currently selected halls
            const validAddonIds = new Set<number>();
            selectedHallsData.forEach(hall => {
                hall.addOns.forEach(addon => validAddonIds.add(addon.id));
            });
            return prev.filter(id => validAddonIds.has(id));
        });

        // Auto-populate and lock duration based on selected hall
        if (selectedHallsData.length > 0) {
            // Extract numbers from the duration string (e.g. "4 hours" -> "4")
            const hallDuration = selectedHallsData[0].duration;
            const numericDuration = hallDuration.replace(/[^0-9]/g, '');
            setDuration(numericDuration);
        } else {
            setDuration('');
        }
    }, [selectedHallIds, selectedHallsData]);

    React.useEffect(() => {
        const fetchHalls = async () => {
            try {
                const response = await fetch('/api/halls');
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        setHalls(data.halls || []);
                    } else {
                        console.error('Non-JSON response from /api/halls');
                    }
                } else {
                    console.error('Failed to fetch halls:', response.status);
                }
            } catch (error) {
                console.error('Error fetching halls:', error);
            }
        };

        fetchHalls();
    }, []);

    React.useEffect(() => {
        if (preSelectedHallId) {
            setSelectedHallIds([preSelectedHallId]);
        }
    }, [preSelectedHallId]);

    // Auto-fill user details from session
    React.useEffect(() => {
        if (session?.user) {
            setEmail(session.user.email || '');
            const fullName = session.user.name || '';
            const parts = fullName.split(' ');
            if (parts.length > 0) setFirstName(parts[0]);
            if (parts.length > 1) setLastName(parts.slice(1).join(' '));
        }
    }, [session]);


    const allTimes = [
        // Morning
        '6:00 am', '7:00 am', '8:00 am', '9:00 am', '10:00 am', '11:00 am',
        // Afternoon
        '12:00 pm', '1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm',
        // Evening
        '6:00 pm', '7:00 pm', '8:00 pm', '9:00 pm', '10:00 pm', '11:00 pm',
        // Night (for all-night programs)
        '12:00 am', '1:00 am', '2:00 am', '3:00 am', '4:00 am', '5:00 am'
    ];
    const visibleTimes = showAllTimes ? allTimes : allTimes.slice(0, 12); // Show up to 5pm by default

    // Calendar Logic

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Fetch bookings and calculate booked time slots
    const fetchBookingsForDate = React.useCallback(async () => {
        if (selectedHallIds.length === 0 || !selectedDate) {
            setBookedTimeSlots([]);
            return;
        }

        setLoadingTimeSlots(true);
        try {
            // We need to check availability for ALL selected halls.
            // If ANY hall is booked at a time, that time is unavailable for the group booking.
            const allOccupiedSlots = new Set<string>();

            // Run fetches in parallel for better performance
            const fetchPromises = selectedHallIds.map(async (id) => {
                const res = await fetch(`/api/bookings?hallId=${id}`);
                if (!res.ok) {
                    console.warn(`Failed to fetch bookings for hall ${id}`);
                    return [];
                }
                const contentType = res.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return res.json();
                }
                console.error(`Non-JSON response for hall ${id}`);
                return [];
            });
            const results = await Promise.all(fetchPromises);

            results.forEach((bookings: any[]) => {
                // Filter bookings for the selected date
                const selectedDateStr = selectedDate.toDateString();
                const dateBookings = bookings.filter((booking: any) => {
                    const bookingDate = new Date(booking.eventDate);
                    return bookingDate.toDateString() === selectedDateStr;
                });

                dateBookings.forEach((booking: any) => {
                    const startMinutes = timeToMinutes(booking.startTime);
                    const durationHours = parseInt(booking.duration) || 1;
                    // Add 1-hour prep buffer: if someone books 4 hours, block 5 hours total
                    const prepBufferHours = 1;
                    const totalBlockedHours = durationHours + prepBufferHours;
                    const endMinutes = startMinutes + (totalBlockedHours * 60);

                    // Mark all 1-hour slots as booked
                    for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
                        const timeSlot = minutesToTime(minutes);
                        allOccupiedSlots.add(timeSlot);
                    }
                });
            });

            setBookedTimeSlots(Array.from(allOccupiedSlots));
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookedTimeSlots([]);
        } finally {
            setLoadingTimeSlots(false);
        }
    }, [selectedHallIds, selectedDate]);

    // Fetch bookings when hall or date changes
    React.useEffect(() => {
        fetchBookingsForDate();
    }, [fetchBookingsForDate]);


    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleDateClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(newDate);
    };

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentMonth);
        const firstDay = getFirstDayOfMonth(currentMonth);
        const days = [];

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={`${styles.dateNum} ${styles.empty}`} />);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            days.push(
                <div
                    key={day}
                    className={`${styles.dateNum} ${isSelected ? styles.selected : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }
        return days;
    };

    // Get the hero image - use selected hall's image or default
    const heroImage = React.useMemo(() => {
        if (selectedHallsData.length > 0 && selectedHallsData[0].mainImagePath) {
            return selectedHallsData[0].mainImagePath;
        }
        return '/images/halls/hero_2.jpg';
    }, [selectedHallsData]);

    return (<div className={styles.pageContainer}>
        {/* Hero Section - Dynamic based on selected hall */}
        <div className={styles.hero}>
            <Image
                src={heroImage}
                alt={selectedHallsData.length > 0 ? selectedHallsData[0].name : 'Hall Booking'}
                fill
                className={styles.heroImage}
                priority
                key={heroImage}
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                    {selectedHallsData.length > 0 ? selectedHallsData[0].name : 'Hall Booking'}
                </h1>
                <div className={styles.heroBreadcrumbs}>
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <span>Booking</span>
                </div>
            </div>
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(8px)'
            }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #2563eb',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style dangerouslySetInnerHTML={{ __html: `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}} />
                <h3 style={{ marginTop: '20px', color: '#1e293b', fontWeight: '600', fontSize: '1.25rem' }}>Processing Request</h3>
                <p style={{ marginTop: '10px', color: '#64748b', textAlign: 'center', maxWidth: '300px' }}>
                    Please wait while we generate your invoice and notify the administration...
                </p>
            </div>
        )}

        {/* Stepper */}
        <div className={styles.stepperContainer}>
            <div className={styles.stepper}>
                <div className={`${styles.stepItem} ${currentStep === 1 ? styles.active : ''}`}>
                    <div className={styles.stepCircle}>1</div>
                    <span className={styles.stepLabel}>Select Facility</span>
                </div>
                <div className={`${styles.stepItem} ${currentStep === 2 ? styles.active : ''}`}>
                    <div className={styles.stepCircle}>2</div>
                    <span className={styles.stepLabel}>Your Details</span>
                </div>
                <div className={`${styles.stepItem} ${currentStep === 3 ? styles.active : ''}`}>
                    <div className={styles.stepCircle}>3</div>
                    <span className={styles.stepLabel}>Review & Request</span>
                </div>
                <div className={`${styles.stepItem} ${currentStep === 4 ? styles.active : ''}`}>
                    <div className={styles.stepCircle}>4</div>
                    <span className={styles.stepLabel}>Requested</span>
                </div>
            </div>
        </div>

        {/* Booking Content */}
        <div className={styles.bookingContent}>
            {currentStep === 1 && (
                <div className={`${styles.bookingGrid} ${showAllTimes ? styles.expandedGrid : ''}`}>

                    {/* Left Column: Facility Selection */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Select Facility</h2>
                            <p className={styles.cardSubtitle}>Choose the perfect space for your event</p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Facilities *</label>

                            {/* Selection Type Tabs */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                                <button
                                    onClick={() => {
                                        setBookingMode('single');
                                        if (selectedHallIds.length > 1) setSelectedHallIds([selectedHallIds[0]]);
                                    }}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        border: 'none',
                                        backgroundColor: bookingMode === 'single' ? '#2563eb' : '#f3f4f6',
                                        color: bookingMode === 'single' ? 'white' : '#4b5563',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Single Hall
                                </button>
                                <button
                                    onClick={() => setBookingMode('multiple')}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '20px',
                                        border: 'none',
                                        backgroundColor: bookingMode === 'multiple' ? '#2563eb' : '#f3f4f6',
                                        color: bookingMode === 'multiple' ? 'white' : '#4b5563',
                                        cursor: 'pointer',
                                        fontSize: '12px',
                                        fontWeight: '500',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    Multiple Facilities
                                </button>
                            </div>

                            {bookingMode === 'single' ? (
                                <select
                                    className={styles.input} // Using generic input style as select specific might not exist or be same
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }} // Inline fallback
                                    value={selectedHallIds[0] || ''}
                                    onChange={(e) => setSelectedHallIds(e.target.value ? [e.target.value] : [])}
                                >
                                    <option value="" disabled>Choose a hall...</option>
                                    {halls.map(hall => (
                                        <option key={hall.id} value={hall.id}>
                                            {hall.name} ({hall.capacity}) - GHS {parsePrice(hall.price).toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <>
                                    <div className={styles.hallList} style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '10px' }}>
                                        {halls.length === 0 ? (
                                            <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading facilities...</p>
                                        ) : (
                                            halls.map((hall) => {
                                                const isSelected = selectedHallIds.includes(hall.id.toString());
                                                return (
                                                    <div
                                                        key={hall.id}
                                                        className={`${styles.hallOption} ${isSelected ? styles.selected : ''}`}
                                                        onClick={() => {
                                                            const id = hall.id.toString();
                                                            setSelectedHallIds(prev =>
                                                                prev.includes(id)
                                                                    ? prev.filter(x => x !== id)
                                                                    : [...prev, id]
                                                            );
                                                        }}
                                                        style={{
                                                            display: 'flex',
                                                            justifyContent: 'space-between',
                                                            alignItems: 'center',
                                                            padding: '8px',
                                                            marginBottom: '4px',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            backgroundColor: isSelected ? '#eff6ff' : 'transparent',
                                                            border: isSelected ? '1px solid #3b82f6' : '1px solid transparent'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => { }} // Handled by div click
                                                                style={{ cursor: 'pointer' }}
                                                            />
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: '8px' }}>
                                                                <span style={{ fontWeight: isSelected ? '600' : '400', fontSize: '14px' }}>{hall.name}</span>
                                                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#4b5563' }}>GHS {parsePrice(hall.price).toLocaleString()}</span>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                                            {hall.capacity}
                                                        </span>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    {bookingMode === 'multiple' && (
                                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                            Select multiple halls for a combined booking.
                                        </p>
                                    )}
                                </>
                            )}

                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Event Type *</label>
                            <select
                                className={styles.select}
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                                suppressHydrationWarning
                            >
                                <option value="" disabled>Select event type</option>
                                <option value="wedding">Wedding</option>
                                <option value="conference">Conference</option>
                                <option value="church">Church Service</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Event Name</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="e.g. Daddy's Conference, Youth Summit 2026"
                                value={eventName}
                                onChange={(e) => setEventName(e.target.value)}
                                suppressHydrationWarning
                            />
                        </div>

                        {eventType === 'other' && (
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Specify Event Type *</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Please specify your event type"
                                    value={otherEventType}
                                    onChange={(e) => setOtherEventType(e.target.value)}
                                    suppressHydrationWarning
                                />
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Expected Group Size</label>
                            <input type="text" className={styles.input} placeholder="Number of attendees" suppressHydrationWarning />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Duration (Hours) *</label>
                            {(() => {
                                // Calculate minimum duration from selected halls (use the highest base duration)
                                const minDuration = selectedHallsData.length > 0
                                    ? Math.max(...selectedHallsData.map(h => parseInt(h.duration) || 1))
                                    : 1;
                                const enteredDuration = parseInt(duration) || 0;
                                const isBelowMinimum = enteredDuration > 0 && enteredDuration < minDuration;

                                return (
                                    <>
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className={styles.input}
                                            placeholder={selectedHallsData.length > 0 ? "" : "Select a hall first"}
                                            value={duration}
                                            onChange={(e) => {
                                                // Only allow whole numbers if not readOnly
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                setDuration(value);
                                            }}
                                            readOnly={selectedHallIds.length > 0}
                                            disabled={selectedHallIds.length === 0}
                                            style={{
                                                backgroundColor: selectedHallIds.length === 0 ? '#f3f4f6' : '#f9fafb',
                                                borderColor: isBelowMinimum ? '#ef4444' : '#e5e7eb',
                                                cursor: selectedHallIds.length > 0 ? 'not-allowed' : 'default',
                                                color: '#4b5563',
                                                fontWeight: '600'
                                            }}
                                            suppressHydrationWarning
                                        />
                                        {selectedHallIds.length > 0 && (
                                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                                Duration is fixed for this facility.
                                            </p>
                                        )}

                                        {/* Minimum duration warning */}
                                        {isBelowMinimum && (
                                            <div style={{
                                                marginTop: '6px',
                                                padding: '8px 12px',
                                                backgroundColor: '#fef2f2',
                                                border: '1px solid #fecaca',
                                                borderRadius: '6px',
                                                color: '#dc2626',
                                                fontSize: '13px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '6px'
                                            }}>
                                                Minimum booking is {minDuration} hour{minDuration !== 1 ? 's' : ''} for selected hall{selectedHallsData.length > 1 ? 's' : ''}
                                            </div>
                                        )}

                                        {/* Live Price Calculator Display - only show if valid duration */}
                                        {selectedHallIds.length > 0 && durationPriceInfo && durationPriceInfo.isValid && !isBelowMinimum && (
                                            <div style={{
                                                marginTop: '8px',
                                                padding: '10px 14px',
                                                backgroundColor: '#f0fdf4',
                                                border: '1px solid #bbf7d0',
                                                borderRadius: '8px',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <span style={{ color: '#166534', fontSize: '14px' }}>
                                                    {durationPriceInfo.enteredDuration} hour{durationPriceInfo.enteredDuration !== 1 ? 's' : ''} booking
                                                </span>
                                                <span style={{ color: '#166534', fontSize: '16px', fontWeight: '700' }}>
                                                    ₵{durationPriceInfo.calculatedPrice.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>

                    {/* Center Column: Date Selection */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Select Date</h2>
                            <p className={styles.cardSubtitle}>Pick your preferred date</p>
                        </div>

                        <div className={styles.calendarContainer}>
                            <div className={styles.calendarHeader}>
                                <button className={styles.navButton} onClick={handlePrevMonth}><FaChevronLeft size={12} /></button>
                                <span className={styles.monthTitle}>
                                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                </span>
                                <button className={styles.navButton} onClick={handleNextMonth}><FaChevronRight size={12} /></button>
                            </div>

                            <div className={styles.calendarGrid}>
                                <div className={styles.dayLabel}>Su</div>
                                <div className={styles.dayLabel}>Mo</div>
                                <div className={styles.dayLabel}>Tu</div>
                                <div className={styles.dayLabel}>We</div>
                                <div className={styles.dayLabel}>Th</div>
                                <div className={styles.dayLabel}>Fr</div>
                                <div className={styles.dayLabel}>Sa</div>

                                {renderCalendarDays()}


                            </div>
                        </div>
                        <div className={styles.selectedDateDisplay}>
                            <FaCalendarDay size={18} />
                            <span>
                                {selectedDate
                                    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                    : 'Select a date'}
                            </span>
                        </div>
                        {selectedDate && isLateBooking && (
                            <div style={{
                                marginTop: '12px',
                                padding: '10px 14px',
                                backgroundColor: '#fff7ed',
                                border: '1px solid #ffedd5',
                                borderRadius: '8px',
                                color: '#9a3412',
                                fontSize: '13px',
                                lineHeight: '1.5',
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'flex-start'
                            }}>
                                <span style={{ fontSize: '16px' }}>⚠️</span>
                                <div>
                                    <strong style={{ display: 'block', marginBottom: '2px' }}>Late Booking Penalty</strong>
                                    This event is less than 72 hours away. A penalty of <strong>₵{LATE_PENALTY.toLocaleString()}</strong> will be added to your total.
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Time Selection */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Select Time</h2>
                            <p className={styles.cardSubtitle}>Choose available session</p>
                        </div>

                        <div className={styles.timeSection}>
                            <p className={styles.timezoneText}>Greenwich Mean Time (GMT)</p>
                            <h4 className={styles.availabilityTitle}>
                                Availability for {selectedDate ? selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '...'}
                            </h4>

                            {(!selectedDate || selectedHallIds.length === 0) ? (
                                <div style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#6B7280',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '8px',
                                    border: '1px dashed #E5E7EB',
                                    fontSize: '14px'
                                }}>
                                    Please select a facility and a date from the calendar to view available times
                                </div>
                            ) : (
                                <>
                                    <div className={styles.timeGrid}>
                                        {loadingTimeSlots ? (
                                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px', color: '#6B7280' }}>
                                                Loading available times...
                                            </div>
                                        ) : (
                                            visibleTimes.map((time) => {
                                                const isBooked = bookedTimeSlots.includes(time);
                                                const isSelected = selectedTime === time;

                                                // Check if client's chosen duration would conflict with booked slots
                                                const clientDuration = parseInt(duration) || 0;
                                                const prepBuffer = 1; // 1-hour prep buffer
                                                let wouldConflict = false;

                                                if (clientDuration > 0 && !isBooked) {
                                                    const startMins = timeToMinutes(time);
                                                    const endMins = startMins + ((clientDuration + prepBuffer) * 60);

                                                    // Check if any hour slot in client's range is already booked
                                                    for (let mins = startMins + 60; mins < endMins; mins += 60) {
                                                        const checkTime = minutesToTime(mins);
                                                        if (bookedTimeSlots.includes(checkTime)) {
                                                            wouldConflict = true;
                                                            break;
                                                        }
                                                    }
                                                }

                                                const isUnavailable = isBooked || wouldConflict;

                                                return (
                                                    <div key={time} style={{ position: 'relative' }}>
                                                        <button
                                                            className={`${styles.timeSlot} ${isSelected ? styles.selected : ''} ${isUnavailable ? styles.booked : ''}`}
                                                            onClick={() => !isUnavailable && setSelectedTime(time)}
                                                            disabled={isUnavailable}
                                                            style={isUnavailable ? {
                                                                backgroundColor: '#F3F4F6',
                                                                color: '#9CA3AF',
                                                                cursor: 'not-allowed',
                                                                opacity: 0.8,
                                                                position: 'relative'
                                                            } : {}}
                                                        >
                                                            <span style={isUnavailable ? { textDecoration: 'line-through' } : {}}>{time}</span>
                                                            {isBooked && (
                                                                <span style={{
                                                                    display: 'block',
                                                                    fontSize: '9px',
                                                                    color: '#DC2626',
                                                                    fontWeight: '700',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.5px',
                                                                    marginTop: '2px',
                                                                    lineHeight: '1'
                                                                }}>
                                                                    Booked
                                                                </span>
                                                            )}
                                                            {wouldConflict && !isBooked && (
                                                                <span style={{
                                                                    display: 'block',
                                                                    fontSize: '8px',
                                                                    color: '#F59E0B',
                                                                    fontWeight: '600',
                                                                    marginTop: '2px',
                                                                    lineHeight: '1'
                                                                }}>
                                                                    Conflict
                                                                </span>
                                                            )}
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                    <button
                                        className={styles.showAllBtn}
                                        onClick={() => setShowAllTimes(!showAllTimes)}
                                    >
                                        {showAllTimes ? 'Show less sessions' : 'Show all sessions'}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 2 && (
                <div className={styles.stepTwoGrid}>
                    {/* Left Column: Your Details Form */}
                    <div className={`${styles.card} ${styles.detailsCard}`}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Your Details</h2>
                            <p className={styles.cardSubtitle}>Tell us about yourself and your organization</p>
                        </div>

                        <div className={styles.formGrid}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>First Name *</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Enter your first name"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    style={{ fontWeight: '500' }}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Last Name *</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Enter your last name"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    style={{ fontWeight: '500' }}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Email Address *</label>
                                <input
                                    type="email"
                                    className={styles.input}
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ fontWeight: '500' }}
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Phone Number *</label>
                                <PhoneInput
                                    country={'gh'}
                                    value={phone}
                                    onChange={(phone: string) => setPhone(phone)}
                                    inputStyle={{
                                        width: '100%',
                                        height: '45px',
                                        fontSize: '15px',
                                        paddingLeft: '48px',
                                        borderRadius: '8px',
                                        border: '1px solid #E5E7EB',
                                        backgroundColor: '#fff',
                                        fontFamily: 'inherit'
                                    }}
                                    buttonStyle={{
                                        border: '1px solid #E5E7EB',
                                        borderRight: 'none',
                                        borderRadius: '8px 0 0 8px',
                                        backgroundColor: '#F9FAFB'
                                    }}
                                    containerStyle={{
                                        width: '100%'
                                    }}
                                />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Organization or Group</label>
                                <input
                                    type="text"
                                    className={styles.input}
                                    placeholder="Group or Organization Name"
                                    value={organization}
                                    onChange={(e) => setOrganization(e.target.value)}
                                />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label className={styles.label}>Message</label>
                                <textarea
                                    className={`${styles.input} ${styles.textarea}`}
                                    placeholder="Add your message here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Stacked Cards */}
                    <div className={styles.stepTwoRightColumn}>
                        {/* Add-ons Card */}
                        <div className={`${styles.card} ${styles.addonsCard}`}>
                            <div className={styles.addonHeader}>
                                <h3 className={styles.hallSummaryTitle}>Add-ons Selection</h3>
                            </div>

                            <div className={styles.addonSection}>
                                <h4 className={styles.addonSectionTitle}>Select add-ons <span style={{ fontWeight: '400', fontSize: '14px', color: '#94a3b8' }}>(Optional)</span></h4>

                                {(() => {
                                    const ADDON_LIMIT = 5;
                                    // Collect all unique add-ons from all selected halls
                                    const allAddons: any[] = [];
                                    const seenAddonNames = new Set();

                                    selectedHallsData.forEach(hall => {
                                        if (hall.addOns) {
                                            hall.addOns.forEach(addon => {
                                                // If multiple halls have the same add-on, we'll show it once for now, 
                                                // or we could show it as "Addon (Hall Name)"
                                                const uniqueId = `${addon.name}-${addon.price}`;
                                                if (!seenAddonNames.has(uniqueId)) {
                                                    allAddons.push(addon);
                                                    seenAddonNames.add(uniqueId);
                                                }
                                            });
                                        }
                                    });

                                    const addonsToShow = showAllAddons ? allAddons : allAddons.slice(0, ADDON_LIMIT);

                                    return (
                                        <>
                                            <div className={styles.addonList}>
                                                {addonsToShow.map((addon) => {
                                                    const isSelected = selectedAddonIds.includes(addon.id);
                                                    return (
                                                        <div key={addon.id}
                                                            className={`${styles.addonItem} ${isSelected ? styles.selectedAddon : ''}`}
                                                            onClick={() => handleToggleAddon(addon.id)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <label className={styles.addonLabel} onClick={(e) => e.stopPropagation()}>
                                                                <input
                                                                    type="checkbox"
                                                                    className={styles.addonCheckbox}
                                                                    checked={isSelected}
                                                                    onChange={() => handleToggleAddon(addon.id)}
                                                                />
                                                                <div>
                                                                    <span className={styles.addonName}>{addon.name}</span>
                                                                    {addon.description && <span className={styles.addonSubtext}>{addon.description}</span>}
                                                                </div>
                                                            </label>
                                                            <span className={styles.addonPrice}>GHS {parsePrice(addon.price).toLocaleString()}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {allAddons.length > ADDON_LIMIT && (
                                                <button
                                                    className={styles.showAllBtn}
                                                    onClick={() => setShowAllAddons(!showAllAddons)}
                                                    style={{ width: '100%', marginTop: '8px' }}
                                                >
                                                    {showAllAddons ? 'Show less add-ons' : 'Show more add-ons'}
                                                </button>
                                            )}
                                        </>
                                    );
                                })()}

                                {selectedHallsData.length === 0 && (
                                    <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Please select a hall to view add-ons.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preferences Card */}
                    <div className={`${styles.card} ${styles.preferencesCard}`}>
                        <h3 className={styles.prefHeader}>Preferences</h3>

                        <div className={styles.prefSection}>
                            <label className={styles.prefLabel}>Staff Member *</label>
                            <select
                                className={styles.staffSelect}
                                value={staffMember}
                                onChange={(e) => setStaffMember(e.target.value)}
                            >
                                <option>Any staff member</option>
                                <option>Emily Odurwaa Asante</option>
                                <option>Magdalene Xoese Quarshie</option>
                            </select>
                        </div>

                        <div className={styles.prefSection}>
                            <h4 className={styles.prefHeader} style={{ fontSize: '16px', border: 'none', marginBottom: '10px' }}>Service Details</h4>
                            <div className={styles.prefDetailsRow}>
                                <span className={styles.prefHallName}>
                                    {selectedHallsData.length > 0 ? (
                                        <ul style={{ paddingLeft: '20px', margin: 0 }}>
                                            {selectedHallsData.map(h => (
                                                <li key={h.id}>{h.name} ({h.capacity})</li>
                                            ))}
                                        </ul>
                                    ) : 'Select a hall'}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {
                currentStep === 3 && (
                    <div className={styles.stepThreeGrid}>
                        {/* Left Column: Payment Methods */}
                        <div className={styles.paymentColumn}>
                            <div className={`${styles.card} ${styles.paymentCard}`}>
                                <div className={styles.paymentHeader}>
                                    <h2 className={styles.paymentTitle}>Booking Request Confirmation</h2>
                                    <p className={styles.paymentSubtitle}>Please review your selections before submitting your request.</p>
                                </div>

                                <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '20px' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', marginBottom: '12px' }}>What happens next?</h4>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                        <li style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#475569' }}>
                                            <div style={{ minWidth: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>1</div>
                                            <span>Your booking request will be sent to our team.</span>
                                        </li>
                                        <li style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#475569' }}>
                                            <div style={{ minWidth: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>2</div>
                                            <span>Our team will verify availability and prepare your final invoice with applicable taxes.</span>
                                        </li>
                                        <li style={{ display: 'flex', gap: '10px', fontSize: '14px', color: '#475569' }}>
                                            <div style={{ minWidth: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</div>
                                            <span>You will receive the final invoice via email with payment instructions.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Booking Summary */}
                        <div className={`${styles.card} ${styles.summaryCard}`}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle} style={{ fontSize: '20px' }}>Booking Summary</h2>
                            </div>

                            <div className={styles.summarySection}>
                                <h4 className={styles.summaryTitle}>Facilities</h4>
                                <div className={styles.summaryRow} style={{ display: 'block' }}>
                                    <div className={styles.summaryLabel} style={{ marginBottom: '8px' }}>Selected</div>
                                    <div className={styles.summaryValue} style={{ textAlign: 'right', width: '100%' }}>
                                        {selectedHallsData.length > 0 ? (
                                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                {selectedHallsData.map(h => {
                                                    const enteredDuration = parseInt(duration) || 0;
                                                    return (
                                                        <li key={h.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                                                            <span>{h.name} {enteredDuration > 0 && <small style={{ color: '#6b7280' }}>({enteredDuration}hrs)</small>}</span>
                                                            <span style={{ fontSize: '14px', fontWeight: '500' }}>GHS {parsePrice(h.price).toLocaleString()}</span>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : 'Not selected'}
                                    </div>
                                </div>
                                <div className={styles.summaryRow} style={{ marginTop: '10px', borderTop: '1px dashed #e5e7eb', paddingTop: '10px' }}>
                                    <span className={styles.summaryLabel}>Type</span>
                                    <span className={styles.summaryValue}>{eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) : 'Not selected'}</span>
                                </div>
                            </div>

                            <div className={styles.summarySection}>
                                <h4 className={styles.summaryTitle}>Date & Time</h4>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Date</span>
                                    <span className={styles.summaryValue}>{selectedDate ? selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not selected'}</span>
                                </div>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Time</span>
                                    <span className={styles.summaryValue}>{selectedTime || 'Not selected'}</span>
                                </div>

                                {isLateBooking && (
                                    <div className={styles.summaryRow} style={{ color: '#dc2626', marginTop: '8px' }}>
                                        <span className={styles.summaryLabel} style={{ color: '#dc2626' }}>Late Booking Penalty</span>
                                        <span className={styles.summaryValue} style={{ fontWeight: '700' }}>₵{LATE_PENALTY.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Duration</span>
                                    <span className={styles.summaryValue}>{duration ? `${duration} hour${parseInt(duration) !== 1 ? 's' : ''}` : 'Not selected'}</span>
                                </div>
                            </div>

                            {selectedAddonIds.length > 0 && (
                                <div className={styles.summarySection}>
                                    <h4 className={styles.summaryTitle}>Add-ons</h4>
                                    {selectedHallsData.flatMap(hall =>
                                        hall.addOns.filter(addon => selectedAddonIds.includes(addon.id))
                                            .map(addon => ({ ...addon, hallName: hall.name }))
                                    ).map(addon => (
                                        <div key={addon.id} className={styles.summaryRow}>
                                            <span className={styles.summaryLabel}>{addon.name} <small style={{ color: '#64748b' }}>({addon.hallName})</small></span>
                                            <span className={styles.summaryValue}>GHS {parsePrice(addon.price).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5', fontSize: '13px', color: '#9a3412' }}>
                                <strong>Note:</strong> Total amount will be calculated and provided in your final invoice after review.
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Step 4: Confirmation */}
            {
                currentStep === 4 && (
                    <div className={`${styles.card} ${styles.confirmationContainer}`}>
                        <FaCircleCheck className={styles.successIcon} />
                        <h2 className={styles.congratsTitle}>Booking Requested!</h2>
                        <p className={styles.congratsMessage}>
                            Thank you! Your request has been successfully submitted. Our team will review your selection and send the final invoice to your email address shortly.
                        </p>

                        <div className={styles.refBox}>
                            <span className={styles.refLabel}>Booking Reference</span>
                            <div className={styles.refNumber} style={{ fontSize: '18px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {bookingReferences.length > 0 ? (
                                    bookingReferences.map((ref, idx) => (
                                        <span key={idx} style={{ display: 'block' }}>{ref}</span>
                                    ))
                                ) : (
                                    <span>Pending...</span>
                                )}
                            </div>

                        </div>

                        <Link href="/" className={styles.homeButton}>
                            Return to Home
                        </Link>
                    </div>
                )
            }

            {/* Bottom Actions - Hidden on Final Step */}
            {
                currentStep < 4 && (
                    <div className={styles.actionBar}>
                        <button className={styles.backButton} onClick={handleBack} disabled={isSubmitting}>
                            {currentStep === 1 ? 'Back' : 'Previous'}
                        </button>

                        {currentStep === 3 ? (
                            <button className={styles.continueButton} onClick={handleConfirmBooking} disabled={isSubmitting} style={{ backgroundColor: '#2563eb' }}>
                                {isSubmitting ? 'Requesting...' : 'Request Booking'} <FaCircleCheck />
                            </button>
                        ) : (
                            <button className={styles.continueButton} onClick={handleNext}>
                                Next Step <FaChevronRight />
                            </button>
                        )}
                    </div>
                )
            }
        </div >
    </div >
    );
};


const HallBookingPage = () => {
    return (
        <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading booking...</div>}>
            <HallBookingPageContent />
        </Suspense>
    );
};

export default HallBookingPage;
