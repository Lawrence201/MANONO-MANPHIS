'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaPenToSquare, FaChevronDown, FaCreditCard, FaBuildingColumns, FaMobileScreen, FaCircleCheck } from 'react-icons/fa6';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from './PackageBooking.module.css';
import { generatePendingRequestPDF, formatReceiptDate } from '@/lib/receiptGenerator';

// Utility to parse price from various formats
const parsePrice = (price: string | number | null | undefined): number => {
    if (!price) return 0;
    const stringPrice = String(price);
    const cleanPrice = stringPrice.replace(/[^\d.]/g, '');
    const value = parseFloat(cleanPrice);
    return isNaN(value) ? 0 : value;
};

interface PackageAddOn {
    id: number;
    name: string;
    price: string;
    unit: string;
}

interface Package {
    id: number;
    name: string;
    price: string;
    description: string;
    capacity: string;
    duration: string;
    mainImagePath: string | null;
    addOns: PackageAddOn[];
}

const PackageBookingPageContent = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const preSelectedPackageId = searchParams.get('packageId');

    const [packages, setPackages] = React.useState<Package[]>([]);
    const [selectedPackageId, setSelectedPackageId] = React.useState<string>(preSelectedPackageId || '');
    const [eventType, setEventType] = React.useState('');
    const [eventName, setEventName] = React.useState('');
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
    const [showAllTimes, setShowAllTimes] = React.useState(false);
    const [paymentMethod, setPaymentMethod] = React.useState('paystack');
    const [duration, setDuration] = React.useState('');
    const [guests, setGuests] = React.useState('');

    // Submission State
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [bookingReference, setBookingReference] = React.useState<string>('');

    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [organization, setOrganization] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [otherEventType, setOtherEventType] = React.useState('');
    const [staffMember, setStaffMember] = React.useState('Any staff member');

    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [currentStep, setCurrentStep] = React.useState(1);

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

    // Derived state for the currently selected package
    const selectedPackageData = React.useMemo(() =>
        packages.find(p => p.id.toString() === selectedPackageId),
        [packages, selectedPackageId]);

    const [selectedAddonIds, setSelectedAddonIds] = React.useState<number[]>([]);

    const handleToggleAddon = (addonId: number) => {
        setSelectedAddonIds(prev =>
            prev.includes(addonId)
                ? prev.filter(id => id !== addonId)
                : [...prev, addonId]
        );
    };

    const totalPrice = React.useMemo(() => {
        if (!selectedPackageData) return 0;

        // Calculate package price based on duration (similar to hall booking)
        const basePrice = parsePrice(selectedPackageData.price);
        const baseDuration = parseInt(selectedPackageData.duration) || 4;
        const hourlyRate = basePrice / baseDuration;
        const enteredDuration = parseFloat(duration) || 0;

        // If duration is entered, calculate based on hourly rate
        let packagePrice = 0;
        if (enteredDuration > 0) {
            packagePrice = Math.round(hourlyRate * enteredDuration);
        }

        const addonsPrice = selectedAddonIds.reduce((acc, id) => {
            const addon = selectedPackageData.addOns.find(a => a.id === id);
            if (addon) {
                return acc + parsePrice(addon.price);
            }
            return acc;
        }, 0);

        const baseTotal = packagePrice + addonsPrice;
        return isLateBooking ? baseTotal + LATE_PENALTY : baseTotal;
    }, [selectedPackageData, selectedAddonIds, duration, isLateBooking]);

    // Calculate hourly rate and price info for live calculator display
    const durationPriceInfo = React.useMemo(() => {
        if (!selectedPackageData) return null;

        const basePrice = parsePrice(selectedPackageData.price);
        const baseDuration = parseInt(selectedPackageData.duration) || 4;
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
    }, [selectedPackageData, duration]);

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
        if (!selectedPackageId || !selectedDate || !selectedTime) {
            alert('Please complete all required fields (Select a Package, Date, Time).');
            return;
        }

        const trimmedEmail = email.trim().toLowerCase().replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');
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
        const minDuration = selectedPackageData
            ? parseInt(selectedPackageData.duration) || 1
            : 1;
        const enteredDuration = parseInt(duration) || 0;

        if (enteredDuration < minDuration) {
            alert(`Minimum booking duration is ${minDuration} hour${minDuration !== 1 ? 's' : ''} for this package.`);
            return;
        }

        setIsSubmitting(true);

        const requestData = {
            packageId: selectedPackageId,
            eventType: eventType === 'other' ? otherEventType : eventType,
            eventName,
            eventDate: selectedDate.toISOString(),
            startTime: selectedTime,
            duration: duration || (selectedPackageData?.duration || 'Standard'),
            guests: parseInt(guests) || 1,
            firstName,
            lastName,
            email: trimmedEmail,
            phone,
            organization,
            message,
            addOns: selectedAddonIds,
            paymentMethod: 'invoice',
            staffMember,
            penalty: isLateBooking ? LATE_PENALTY : 0,
            totalPrice: totalPrice
        };

        try {

            const response = await fetch('/api/package-bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            // Robust JSON parsing
            let result: any = {};
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                console.error('Non-JSON response from /api/package-bookings:', text.substring(0, 200));
                throw new Error(`Server returned non-JSON response (${response.status})`);
            }

            if (response.ok) {
                const reference = result.reference;
                setBookingReference(reference);

                // Generate Pending Request PDF for client download
                const pdfData = {
                    reference: reference,
                    customerName: `${firstName} ${lastName}`,
                    email: trimmedEmail,
                    phone: phone,
                    organization: organization || undefined,
                    eventType: eventType === 'other' ? otherEventType : eventType,
                    eventName: eventName || undefined,
                    eventDate: formatReceiptDate(selectedDate!),
                    startTime: selectedTime || '',
                    duration: duration || (selectedPackageData?.duration || 'Standard'),
                    facilities: selectedPackageData ? [{
                        name: selectedPackageData.name,
                        price: parsePrice(selectedPackageData.price)
                    }] : [],
                    addOns: selectedAddonIds.length > 0 && selectedPackageData
                        ? selectedPackageData.addOns?.filter(a => selectedAddonIds.includes(a.id)).map(a => ({
                            name: a.name,
                            price: parsePrice(a.price)
                        }))
                        : undefined,
                    requestDate: formatReceiptDate(new Date()),
                    facilityType: 'Package' as const,
                    penalty: isLateBooking ? LATE_PENALTY : 0,
                    totalAmount: totalPrice
                };

                generatePendingRequestPDF(pdfData).catch(err =>
                    console.error('Client PDF generation failed:', err)
                );

                setCurrentStep(4);
                window.scrollTo(0, 0);
            } else {
                alert(result.message || 'Request failed');
            }
        } catch (error) {
            console.error('Request Error', error);
            alert('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset add-ons when package changes
    React.useEffect(() => {
        setSelectedAddonIds([]);
    }, [selectedPackageId]);

    React.useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch('/api/packages');
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        setPackages(data.packages || []);
                    } else {
                        console.error('Non-JSON response from /api/packages');
                    }
                } else {
                    console.error('Failed to fetch packages:', response.status);
                }
            } catch (error) {
                console.error('Error fetching packages:', error);
            }
        };

        fetchPackages();
    }, []);

    React.useEffect(() => {
        if (preSelectedPackageId) {
            setSelectedPackageId(preSelectedPackageId);
        }
    }, [preSelectedPackageId]);

    // Auto-fill user details from session
    React.useEffect(() => {
        if (session?.user) {
            const fullName = session.user.name || '';
            const parts = fullName.split(' ');
            if (parts.length > 0) setFirstName(parts[0]);
            if (parts.length > 1) setLastName(parts.slice(1).join(' '));
            if (session.user.email) setEmail(session.user.email);
        }
    }, [session]);

    const allTimes = [
        '6:00 am', '6:30 am', '7:00 am', '7:30 am', '8:00 am', '8:30 am',
        '9:00 am', '9:30 am', '10:00 am', '10:30 am', '11:00 am', '11:30 am',
        '12:00 pm', '12:30 pm', '1:00 pm', '1:30 pm', '2:00 pm', '2:30 pm',
        '3:00 pm', '3:30 pm', '4:00 pm', '4:30 pm', '5:00 pm', '5:30 pm',
        '6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm'
    ];
    const visibleTimes = showAllTimes ? allTimes : allTimes.slice(0, 10);

    // Calendar Logic

    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    // Fetch bookings for availability
    const fetchBookingsForDate = React.useCallback(async () => {
        if (!selectedPackageId || !selectedDate) {
            setBookedTimeSlots([]);
            return;
        }

        setLoadingTimeSlots(true);
        try {
            const response = await fetch(`/api/package-bookings?packageId=${selectedPackageId}`);
            if (!response.ok) {
                console.warn(`Failed to fetch bookings for package ${selectedPackageId}`);
                setBookedTimeSlots([]);
                return;
            }
            
            const contentType = response.headers.get('content-type');
            let bookings = [];
            if (contentType && contentType.includes('application/json')) {
                bookings = await response.json();
            } else {
                console.error('Non-JSON response from package bookings API');
            }

            const selectedDateStr = selectedDate.toDateString();
            const dateBookings = bookings.filter((booking: any) => {
                const bookingDate = new Date(booking.eventDate);
                return bookingDate.toDateString() === selectedDateStr;
            });

            const occupiedSlots = new Set<string>();
            dateBookings.forEach((booking: any) => {
                const startMinutes = timeToMinutes(booking.startTime);
                const durationHours = parseInt(booking.duration) || 1;
                // Add 1-hour prep buffer: if someone books 4 hours, block 5 hours total
                const prepBufferHours = 1;
                const totalBlockedHours = durationHours + prepBufferHours;
                const endMinutes = startMinutes + (totalBlockedHours * 60);

                // Mark all 1-hour slots as booked (matching hall booking's approach)
                for (let minutes = startMinutes; minutes < endMinutes; minutes += 60) {
                    const timeSlot = minutesToTime(minutes);
                    occupiedSlots.add(timeSlot);
                }
            });

            setBookedTimeSlots(Array.from(occupiedSlots));
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setBookedTimeSlots([]);
        } finally {
            setLoadingTimeSlots(false);
        }
    }, [selectedPackageId, selectedDate]);

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

        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className={`${styles.dateNum} ${styles.empty}`} />);
        }

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

    return (<div className={styles.pageContainer}>
        {/* Hero Section - Dynamic based on selected package */}
        <div className={styles.hero}>
            <Image
                src={selectedPackageData?.mainImagePath || '/images/halls/hero_2.jpg'}
                alt={selectedPackageData?.name || 'Event Package Booking'}
                fill
                className={styles.heroImage}
                priority
            />
            <div className={styles.heroOverlay} />
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                    {selectedPackageData ? ` ${selectedPackageData.name}` : 'Event Package Booking'}
                </h1>
                <div className={styles.heroBreadcrumbs}>
                    <Link href="/">Home</Link>
                    <span>/</span>
                    <Link href="/services/packages">Packages</Link>
                    <span>/</span>
                    <span>{selectedPackageData?.name || 'Book Now'}</span>
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
                    <span className={styles.stepLabel}>Select Package</span>
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

                    {/* Left Column: Package Selection */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2 className={styles.cardTitle}>Select Package</h2>
                            <p className={styles.cardSubtitle}>Choose the perfect event package for your occasion</p>
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Event Package *</label>
                            <select
                                className={styles.select}
                                value={selectedPackageId}
                                onChange={(e) => setSelectedPackageId(e.target.value)}
                            >
                                <option value="" disabled>Choose a package...</option>
                                {packages.map(pkg => (
                                    <option key={pkg.id} value={pkg.id}>
                                        {pkg.name} ({pkg.capacity}) - GHS {Number(pkg.price).toLocaleString()}
                                    </option>
                                ))}
                            </select>
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
                                <option value="retreat">Retreat</option>
                                <option value="birthday">Birthday Party</option>
                                <option value="corporate">Corporate Event</option>
                                <option value="church">Church Service</option>
                                <option value="other">Other</option>
                            </select>
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
                            <label className={styles.label}>Expected Guests</label>
                            <input
                                type="text"
                                className={styles.input}
                                placeholder="Number of attendees"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                suppressHydrationWarning
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Duration (Hours) *</label>
                            {(() => {
                                // Calculate minimum duration from selected package
                                const minDuration = selectedPackageData
                                    ? parseInt(selectedPackageData.duration) || 1
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
                                            placeholder={selectedPackageData ? `Minimum: ${minDuration} hours` : 'Select a package first'}
                                            value={duration}
                                            onChange={(e) => {
                                                // Only allow whole numbers
                                                const value = e.target.value.replace(/[^0-9]/g, '');
                                                setDuration(value);
                                            }}
                                            disabled={!selectedPackageId}
                                            style={{
                                                backgroundColor: !selectedPackageId ? '#f3f4f6' : 'white',
                                                borderColor: isBelowMinimum ? '#ef4444' : undefined
                                            }}
                                            suppressHydrationWarning
                                        />

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
                                                Minimum booking is {minDuration} hour{minDuration !== 1 ? 's' : ''} for this package
                                            </div>
                                        )}

                                        {/* Live Price Calculator Display - only show if valid duration */}
                                        {selectedPackageData && durationPriceInfo && durationPriceInfo.isValid && !isBelowMinimum && (
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

                            {(!selectedDate || !selectedPackageId) ? (
                                <div style={{
                                    padding: '40px 20px',
                                    textAlign: 'center',
                                    color: '#6B7280',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '8px',
                                    border: '1px dashed #E5E7EB',
                                    fontSize: '14px'
                                }}>
                                    Please select a package and a date to view available times
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

                                                return (
                                                    <div key={time} style={{ position: 'relative' }}>
                                                        <button
                                                            className={`${styles.timeSlot} ${isSelected ? styles.selected : ''} ${isBooked ? styles.booked : ''}`}
                                                            onClick={() => !isBooked && setSelectedTime(time)}
                                                            disabled={isBooked}
                                                            style={isBooked ? {
                                                                backgroundColor: '#F3F4F6',
                                                                color: '#9CA3AF',
                                                                cursor: 'not-allowed',
                                                                opacity: 0.8,
                                                            } : {}}
                                                        >
                                                            <span style={isBooked ? { textDecoration: 'line-through' } : {}}>{time}</span>
                                                            {isBooked && (
                                                                <span style={{
                                                                    display: 'block',
                                                                    fontSize: '9px',
                                                                    color: '#DC2626',
                                                                    fontWeight: '700',
                                                                    textTransform: 'uppercase',
                                                                    letterSpacing: '0.5px',
                                                                    marginTop: '2px',
                                                                }}>
                                                                    Booked
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

                                {selectedPackageData ? (
                                    <div className={styles.addonList}>
                                        {selectedPackageData.addOns && selectedPackageData.addOns.length > 0 ? (
                                            selectedPackageData.addOns.map((addon) => {
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
                                                                {addon.unit && <span className={styles.addonSubtext}>{addon.unit}</span>}
                                                            </div>
                                                        </label>
                                                        <span className={styles.addonPrice}>GHS {Number(addon.price).toLocaleString()}</span>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <p style={{ color: '#94a3b8', fontStyle: 'italic', padding: '5px' }}>No add-ons available.</p>
                                        )}
                                    </div>
                                ) : (
                                    <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>Please select a package to view add-ons.</p>
                                )}
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
                                    <option>Emily Odurowaa Asante</option>
                                    <option>Magdalene Xoese Quarshie</option>
                                </select>
                            </div>

                            <div className={styles.prefSection}>
                                <h4 className={styles.prefHeader} style={{ fontSize: '16px', border: 'none', marginBottom: '10px' }}>Package Details</h4>
                                <div className={styles.prefDetailsRow}>
                                    <span className={styles.prefHallName}>
                                        {selectedPackageData ? (
                                            <>
                                                {selectedPackageData.name} ({selectedPackageData.capacity})
                                            </>
                                        ) : 'Select a package'}
                                    </span>
                                </div>
                                <button className={styles.moreDetailsBtn}>
                                    More details <FaChevronDown />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {currentStep === 3 && (
                <div className={styles.stepThreeGrid}>
                    {/* Left Column: Payment Methods */}                    <div className={styles.paymentColumn}>
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
                            <h4 className={styles.summaryTitle}>Package</h4>
                            <div className={styles.summaryRow} style={{ display: 'block' }}>
                                <div className={styles.summaryLabel} style={{ marginBottom: '8px' }}>Selected</div>
                                <div className={styles.summaryValue} style={{ textAlign: 'right', width: '100%' }}>
                                    {selectedPackageData ? (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                                            <span>{selectedPackageData.name} {(parseInt(duration) || 0) > 0 && <small style={{ color: '#6b7280' }}>({duration}hrs)</small>}</span>
                                            <span>GHS {Number(selectedPackageData.price).toLocaleString()}</span>
                                        </div>
                                    ) : 'Not selected'}
                                </div>
                            </div>
                            <div className={styles.summaryRow} style={{ marginTop: '10px', borderTop: '1px dashed #e5e7eb', paddingTop: '10px' }}>
                                <span className={styles.summaryLabel}>Type</span>
                                <span className={styles.summaryValue}>{eventType ? eventType.charAt(0).toUpperCase() + eventType.slice(1) : 'Not selected'}</span>
                            </div>
                        </div>

                        <div className={styles.summarySection}>
                            <h4 className={styles.summaryTitle}>Add-ons</h4>
                            {selectedAddonIds.length > 0 && selectedPackageData ? (
                                selectedPackageData.addOns.filter(addon => selectedAddonIds.includes(addon.id)).map(addon => (
                                    <div key={addon.id} className={styles.summaryRow}>
                                        <span className={styles.summaryLabel}>{addon.name}</span>
                                        <span className={styles.summaryValue}>GHS {Number(addon.price).toLocaleString()}</span>
                                    </div>
                                ))
                            ) : <div style={{ fontSize: '14px', color: '#64748b' }}>No add-ons selected</div>}

                            {isLateBooking && (
                                <div className={styles.summaryRow} style={{ marginTop: '10px', color: '#dc2626' }}>
                                    <span className={styles.summaryLabel} style={{ color: '#dc2626' }}>Late Booking Penalty</span>
                                    <span className={styles.summaryValue} style={{ fontWeight: '700' }}>₵{LATE_PENALTY.toLocaleString()}</span>
                                </div>
                            )}

                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5', fontSize: '13px', color: '#9a3412' }}>
                                <strong>Note:</strong> Total amount will be calculated and provided in your final invoice after review.
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (                <div className={`${styles.card} ${styles.confirmationContainer}`} style={{ textAlign: 'center', padding: '40px' }}>
                    <FaCircleCheck className={styles.successIcon} style={{ fontSize: '48px', color: '#3b82f6', marginBottom: '20px' }} />
                    <h2 className={styles.congratsTitle}>Booking Requested!</h2>
                    <p className={styles.congratsMessage} style={{ marginBottom: '20px', color: '#64748b' }}>
                        Thank you! Your request has been successfully submitted. Our team will review your selection and send the final invoice to your email address shortly.
                    </p>
                    <div className={styles.refBox} style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                        <span className={styles.refLabel}>Booking Reference:</span>
                        <span className={styles.refNumber} style={{ fontWeight: '700', marginLeft: '10px', color: '#1e293b' }}>{bookingReference}</span>
                    </div>
                    <Link href="/" className={styles.homeButton}>Return Home</Link>
                </div>
            )}

            {/* Bottom Actions - Hidden on Final Step */}
            {currentStep < 4 && (
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
            )}
        </div>
    </div>
);
};


const PackageBookingPage = () => {
    return (
        <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading booking...</div>}>
            <PackageBookingPageContent />
        </Suspense>
    );
};

export default PackageBookingPage;
