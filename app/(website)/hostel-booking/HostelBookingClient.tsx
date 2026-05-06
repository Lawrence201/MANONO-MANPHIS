'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaCreditCard, FaBuildingColumns, FaMobileScreen, FaCircleCheck, FaUserTie } from 'react-icons/fa6';
import styles from './HostelBooking.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { generatePendingRequestPDF, formatReceiptDate } from '@/lib/receiptGenerator';

// Helper to parse price strings
const parsePrice = (price: string | number | null | undefined): number => {
    if (typeof price === 'number') return price;
    if (!price) return 0;
    const parsed = parseFloat(price.toString().replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
};

const HostelBookingPageContent = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedHostelId = searchParams.get('hostelId');

    const [currentStep, setCurrentStep] = React.useState(1);
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [currentMonth, setCurrentMonth] = React.useState(new Date());
    const [selectedTime, setSelectedTime] = React.useState<string>('3:00 pm'); // Standard check-in time

    // Dynamic Data
    const [hostels, setHostels] = React.useState<any[]>([]);
    const [selectedHostelId, setSelectedHostelId] = React.useState('');
    const [selectedHostelData, setSelectedHostelData] = React.useState<any>(null);
    const [numberOfRooms, setNumberOfRooms] = React.useState<number>(1);
    const [availableRooms, setAvailableRooms] = React.useState<number>(0);

    const [duration, setDuration] = React.useState('');
    const [numberOfDays, setNumberOfDays] = React.useState<number>(1);
    const [paymentMethod, setPaymentMethod] = React.useState('paystack');
    const [staffMember, setStaffMember] = React.useState('Any staff member');
    const [guests, setGuests] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [institution, setInstitution] = React.useState('');
    const [specialRequests, setSpecialRequests] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [generatedReference, setGeneratedReference] = React.useState('');
    const [selectedAddOns, setSelectedAddOns] = React.useState<any[]>([]);
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
            
            // Parse selectedTime (e.g., '3:00 pm')
            const [timeStr, period] = selectedTime.trim().split(' ');
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


    React.useEffect(() => {
        const fetchHostels = async () => {
            try {
                const res = await fetch('/api/hostels', {
                    cache: 'no-store',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!res.ok) {
                    const text = await res.text();
                    console.error('Fetch hostels failed:', res.status, text);
                    throw new Error(`Failed to fetch hostels: ${res.status} ${res.statusText}`);
                }

                const contentType = res.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await res.text();
                    console.error('Non-JSON response from /api/hostels:', text);
                    throw new Error('Server returned non-JSON response for hostels');
                }

                const data = await res.json();

                if (Array.isArray(data)) {
                    setHostels(data);
                } else {
                    console.error("Fetched data is not an array:", data);
                }
            } catch (error) {
                console.error("Failed to fetch hostels:", error);
            }
        };
        fetchHostels();
    }, []);

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

    const handleHostelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedHostelId(id);
        const hostel = hostels.find(h => h.id.toString() === id);
        setSelectedHostelData(hostel);
        if (hostel?.duration) setDuration(hostel.duration);
        if (hostel?.capacity) setGuests(hostel.capacity.toString());
        if (hostel?.roomQuantity !== undefined) setAvailableRooms(hostel.roomQuantity);
        setNumberOfRooms(1);
        setSelectedAddOns([]);
    };

    // Handle pre-selection from URL
    React.useEffect(() => {
        if (preSelectedHostelId && hostels.length > 0) {
            setSelectedHostelId(preSelectedHostelId);
            const hostel = hostels.find(h => h.id.toString() === preSelectedHostelId);
            if (hostel) {
                setSelectedHostelData(hostel);
                if (hostel.duration) setDuration(hostel.duration);
                if (hostel.capacity) setGuests(hostel.capacity.toString());
                if (hostel.roomQuantity !== undefined) setAvailableRooms(hostel.roomQuantity);
            }
        }
    }, [preSelectedHostelId, hostels]);

    const [availabilityLoading, setAvailabilityLoading] = React.useState(false);

    // Fetch dynamic availability
    React.useEffect(() => {
        const fetchAvailability = async () => {
            if (!selectedHostelId || !selectedDate) return;

            setAvailabilityLoading(true);
            try {
                const checkInDateStr = selectedDate.toISOString().split('T')[0];
                const res = await fetch(
                    `/api/hostels/availability?hostelId=${selectedHostelId}&checkInDate=${checkInDateStr}&numberOfDays=${numberOfDays}`,
                    { cache: 'no-store' }
                );

                if (res.ok) {
                    const contentType = res.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await res.json();
                        setAvailableRooms(data.availableRooms);
                        if (numberOfRooms > data.availableRooms && data.availableRooms > 0) {
                            setNumberOfRooms(data.availableRooms);
                        } else if (data.availableRooms === 0) {
                            setNumberOfRooms(0);
                        }
                    } else {
                        console.error('Non-JSON response from availability API');
                    }
                } else {
                    const text = await res.text();
                    console.error('Availability check failed:', res.status, text);
                }
            } catch (error) {
                console.error('Failed to fetch availability:', error);
            } finally {
                setAvailabilityLoading(false);
            }
        };

        fetchAvailability();
    }, [selectedHostelId, selectedDate, numberOfDays, numberOfRooms]);

    const handleAddOnToggle = (addon: any) => {
        setSelectedAddOns(prev => {
            const exists = prev.find(a => a.name === addon.name);
            if (exists) {
                return prev.filter(a => a.name !== addon.name);
            } else {
                return [...prev, addon];
            }
        });
    };

    // Calculate total price
    const totalPrice = React.useMemo(() => {
        const basePrice = parsePrice(selectedHostelData?.price);
        const addonsTotal = selectedAddOns.reduce((sum, addon) => sum + parsePrice(addon.price), 0);
        
        const baseTotal = (basePrice * numberOfDays * numberOfRooms) + addonsTotal;
        return isLateBooking ? baseTotal + LATE_PENALTY : baseTotal;
    }, [selectedHostelData, numberOfRooms, numberOfDays, selectedAddOns, isLateBooking]);


    const handleConfirmBooking = async () => {
        if (isSubmitting) return;

        const trimmedEmail = email.trim().toLowerCase().replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
            alert("Please enter a valid email address.");
            return;
        }

        setIsSubmitting(true);

        const requestData = {
            hostelId: selectedHostelId,
            checkInDate: selectedDate,
            checkInTime: selectedTime,
            duration: `${numberOfDays} Day${numberOfDays > 1 ? 's' : ''}`,
            numberOfDays,
            guests: parseInt(guests.toString().replace(/\D/g, '')) || 1,
            numberOfRooms,
            firstName,
            lastName,
            email: trimmedEmail,
            phone,
            paymentMethod: 'invoice',
            paymentStatus: 'pending',
            institution,
            specialRequests,
            addOns: selectedAddOns.map(a => a.id),
            staffMember,
            penalty: isLateBooking ? LATE_PENALTY : 0,
            totalAmount: totalPrice
        };

        try {

            const res = await fetch('/api/bookings/hostel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData)
            });

            const contentType = res.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await res.json();
            } else {
                const text = await res.text();
                console.error('Non-JSON response from booking API:', text);
                throw new Error(`Server returned non-JSON response (${res.status}). Please check console for details.`);
            }

            if (res.ok) {
                const reference = data.reference;
                setGeneratedReference(reference);

                // Generate Pending Request PDF for client download
                const pdfData = {
                    reference: reference,
                    customerName: `${firstName} ${lastName}`,
                    email: trimmedEmail,
                    phone: phone,
                    organization: institution || undefined,
                    eventType: 'Accommodation',
                    eventName: selectedHostelData?.name || 'Lodge Booking',
                    eventDate: formatReceiptDate(selectedDate!),
                    startTime: selectedTime || '3:00 pm',
                    duration: `${numberOfDays} Day${numberOfDays > 1 ? 's' : ''}`,
                    facilities: selectedHostelData ? [{
                        name: `${selectedHostelData.name} (${numberOfRooms} room${numberOfRooms > 1 ? 's' : ''} × ${numberOfDays} day${numberOfDays > 1 ? 's' : ''})`,
                        price: parsePrice(selectedHostelData.price) * numberOfRooms * numberOfDays
                    }] : [],
                    addOns: selectedAddOns.length > 0 ? selectedAddOns.map(a => ({
                        name: a.name,
                        price: parsePrice(a.price)
                    })) : undefined,
                    requestDate: formatReceiptDate(new Date()),
                    facilityType: 'Lodge' as const,
                    penalty: requestData.penalty,
                    totalAmount: totalPrice
                };

                generatePendingRequestPDF(pdfData).catch(err =>
                    console.error('Client PDF generation failed:', err)
                );

                setCurrentStep(4);
                window.scrollTo(0, 0);
            } else {
                alert(data.error || 'Request failed');
            }
        } catch (error) {
            console.error('Request Error', error);
            alert('An error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        if (currentStep === 1) {
            if (!selectedHostelId || !selectedDate) {
                alert("Please select a lodge and date.");
                return;
            }
        }
        if (currentStep === 2) {
            const trimmedEmail = email.trim().toLowerCase().replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');
            // Standardized email validation regex
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

            if (!firstName || !lastName || !trimmedEmail || !phone) {
                alert("Please fill in all required fields.");
                return;
            }
            if (!emailRegex.test(trimmedEmail)) {
                alert("Please enter a valid email address.");
                return;
            }
        }
        if (currentStep === 3) {
            handleConfirmBooking();
            return;
        }
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    const handleDateClick = (day: number) => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));

    const isDateInRange = (date: Date): boolean => {
        if (!selectedDate || numberOfDays <= 1) return false;
        const startTime = selectedDate.getTime();
        const endTime = startTime + (numberOfDays - 1) * 24 * 60 * 60 * 1000;
        const dateTime = date.getTime();
        return dateTime > startTime && dateTime <= endTime;
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
            const isInRange = isDateInRange(date);
            days.push(
                <div
                    key={day}
                    className={`${styles.dateNum} ${isSelected ? styles.selected : ''} ${isInRange ? styles.inRange : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </div>
            );
        }
        return days;
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.hero}>
                <Image
                    src={selectedHostelData?.mainImagePath || '/images/hostels/hostel-bg.jpg'}
                    alt={selectedHostelData?.name || 'Lodge Booking'}
                    fill
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>{selectedHostelData?.name || 'Lodge Booking'}</h1>
                    <div className={styles.heroBreadcrumbs}>
                        <Link href="/">Home</Link>
                        <span>/</span>
                        <Link href="/services/hostels">Lodges</Link>
                        <span>/</span>
                        <span>{selectedHostelData?.name || 'Book Now'}</span>
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

            <div className={styles.stepperContainer}>
                <div className={styles.stepper}>
                    {[1, 2, 3, 4].map(step => (
                        <div key={step} className={`${styles.stepItem} ${currentStep === step ? styles.active : ''}`}>
                            <div className={styles.stepCircle}>{step}</div>
                            <span className={styles.stepLabel}>
                                {step === 1 ? 'Select Lodge' : step === 2 ? 'Your Details' : step === 3 ? 'Review & Request' : 'Requested'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.bookingContent}>
                {currentStep === 1 && (
                    <div className={styles.bookingGrid}>
                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Select Accommodation</h2>
                                <p className={styles.cardSubtitle}>Choose your preferred room type</p>
                            </div>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>Lodge / Dorm *</label>
                                <select className={styles.select} value={selectedHostelId} onChange={handleHostelChange}>
                                    <option value="" disabled>Select accommodation</option>
                                    {hostels.map(hostel => <option key={hostel.id} value={hostel.id}>{hostel.name} - GHS {parsePrice(hostel.price).toLocaleString()}</option>)}
                                </select>
                                {selectedHostelData && (
                                    <div style={{
                                        marginTop: '12px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e5e7eb',
                                        backgroundColor: availabilityLoading ? '#f3f4f6' : (availableRooms > 0 ? '#ecfdf5' : '#fef2f2'),
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}>
                                        <span style={{ fontSize: '14px', fontWeight: '600' }}>Available Rooms:</span>
                                        <span style={{ fontSize: '14px', fontWeight: '700', color: availableRooms > 0 ? '#059669' : '#DC2626' }}>
                                            {availabilityLoading ? 'Checking...' : (!selectedDate ? 'Select a date' : (availableRooms > 0 ? availableRooms : '0 (Full)'))}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {selectedHostelData && availableRooms > 0 && (
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Number of Rooms *</label>
                                    <select className={styles.select} value={numberOfRooms} onChange={(e) => setNumberOfRooms(parseInt(e.target.value))}>
                                        {Array.from({ length: availableRooms }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className={styles.inputGroup}>
                                <input type="number" className={styles.input} value={numberOfDays} onChange={(e) => setNumberOfDays(Math.min(30, Math.max(1, parseInt(e.target.value) || 1)))} />
                                
                                {selectedHostelData && numberOfRooms > 0 && numberOfDays > 0 && (
                                    <div style={{
                                        marginTop: '12px',
                                        padding: '10px 14px',
                                        backgroundColor: '#f0fdf4',
                                        border: '1px solid #bbf7d0',
                                        borderRadius: '8px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ color: '#166534', fontSize: '14px', fontWeight: '500' }}>
                                            {numberOfRooms} Room{numberOfRooms !== 1 ? 's' : ''} x {numberOfDays} Day{numberOfDays !== 1 ? 's' : ''} booking
                                        </span>
                                        <span style={{ color: '#166534', fontSize: '16px', fontWeight: '700' }}>
                                            ₵{(parsePrice(selectedHostelData.price) * numberOfRooms * numberOfDays).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Check-in Date</h2>
                                <p className={styles.cardSubtitle}>When will you arrive?</p>
                            </div>
                            <div className={styles.calendarContainer}>
                                <div className={styles.calendarHeader}>
                                    <button className={styles.navButton} onClick={handlePrevMonth}><FaChevronLeft size={12} /></button>
                                    <span className={styles.monthTitle}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                    <button className={styles.navButton} onClick={handleNextMonth}><FaChevronRight size={12} /></button>
                                </div>
                                <div className={styles.calendarGrid}>
                                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d} className={styles.dayLabel}>{d}</div>)}
                                    {renderCalendarDays()}
                                </div>
                            </div>
                            {selectedDate && (
                                <div style={{ 
                                    marginTop: '15px', 
                                    padding: '12px', 
                                    backgroundColor: '#f8fafc', 
                                    borderRadius: '8px', 
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    <FaCalendarDay style={{ color: '#3b82f6' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                                        {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                            )}
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
                                        This check-in is less than 72 hours away. A penalty of <strong>₵{LATE_PENALTY.toLocaleString()}</strong> will be added to your total.
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.card}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Check Times</h2>
                                <p className={styles.cardSubtitle}>Standard times</p>
                            </div>
                            <div className={styles.timeSection}>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <div className={styles.timeSlot} style={{ flex: 1, backgroundColor: '#1a1a1a', color: '#fff' }}>
                                        <span style={{ fontSize: '11px', opacity: 0.8 }}>Check-in</span>
                                        <span style={{ fontWeight: 600 }}>3:00 PM</span>
                                    </div>
                                    <div className={styles.timeSlot} style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
                                        <span style={{ fontSize: '11px', opacity: 0.8 }}>Check-out</span>
                                        <span style={{ fontWeight: 600 }}>12:00 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className={styles.stepTwoGrid}>
                        <div className={`${styles.card} ${styles.detailsCard}`}>
                            <div className={styles.cardHeader}>
                                <h2 className={styles.cardTitle}>Resident Details</h2>
                                <p className={styles.cardSubtitle}>Who will be staying?</p>
                            </div>
                            <div className={styles.formGrid}>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>First Name *</label>
                                    <input type="text" className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Last Name *</label>
                                    <input type="text" className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Email Address *</label>
                                    <input type="email" className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Phone Number *</label>
                                    <PhoneInput country={'gh'} value={phone} onChange={setPhone} inputStyle={{ width: '100%', height: '45px' }} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Preferred Staff Member</label>
                                    <div style={{ position: 'relative' }}>
                                        <FaUserTie style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                        <select className={styles.select} style={{ paddingLeft: '40px' }} value={staffMember} onChange={(e) => setStaffMember(e.target.value)}>
                                            <option value="Any staff member">Any staff member</option>
                                            <option value="Emily Oduruwaa Asante">Emily Oduruwaa Asante</option>
                                            <option value="Magdalene Quarshie">Magdalene Quarshie</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.stepTwoRightColumn}>
                            <div className={`${styles.card} ${styles.addonsCard}`}>
                                <div className={styles.addonHeader}>
                                    <h3 className={styles.hallSummaryTitle}>Add-ons</h3>
                                </div>
                                <div className={styles.addonList}>
                                    {selectedHostelData?.addOns?.map((addon: any, i: number) => (
                                        <div key={i} className={styles.addonItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <input type="checkbox" checked={selectedAddOns.some(a => a.name === addon.name)} onChange={() => handleAddOnToggle(addon)} /> 
                                                <span>{addon.name}</span>
                                            </label>
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#475569' }}>GHS {parsePrice(addon.price).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 3 && (
                    <div className={styles.stepThreeGrid}>
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

                        <div className={`${styles.card} ${styles.summaryCard}`}>
                            <div className={styles.cardHeader}><h2 className={styles.cardTitle}>Summary</h2></div>
                            <div className={styles.summarySection}>
                                <div className={styles.summaryRow} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#64748b' }}>Lodge</span>
                                    <span style={{ fontWeight: '600', textAlign: 'right' }}>
                                        {selectedHostelData?.name}
                                        <div style={{ fontSize: '12px', fontWeight: '400', color: '#94a3b8' }}>
                                            GHS {parsePrice(selectedHostelData?.price || 0).toLocaleString()} per room/night
                                        </div>
                                    </span>
                                </div>
                                <div className={styles.summaryRow} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#64748b' }}>Rooms</span>
                                    <span style={{ fontWeight: '600' }}>{numberOfRooms}</span>
                                </div>
                                <div className={styles.summaryRow} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ color: '#64748b' }}>Duration</span>
                                    <span style={{ fontWeight: '600' }}>{numberOfDays} night(s)</span>
                                </div>
                                {isLateBooking && (
                                    <div className={styles.summaryRow} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#dc2626' }}>
                                        <span style={{ color: '#dc2626' }}>Late Booking Penalty</span>
                                        <span style={{ fontWeight: '700' }}>₵{LATE_PENALTY.toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedAddOns.length > 0 && (
                                    <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #e2e8f0' }}>
                                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', marginBottom: '10px' }}>Add-ons</h4>
                                        {selectedAddOns.map((addon, i) => (
                                            <div key={i} className={styles.summaryRow} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '14px' }}>
                                                <span style={{ color: '#64748b' }}>{addon.name}</span>
                                                <span style={{ fontWeight: '500' }}>GHS {parsePrice(addon.price).toLocaleString()}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff7ed', borderRadius: '8px', border: '1px solid #ffedd5', fontSize: '13px', color: '#9a3412' }}>
                                    <strong>Note:</strong> Total amount will be calculated and provided in your final invoice after review.
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className={`${styles.card} ${styles.confirmationContainer}`} style={{ textAlign: 'center', padding: '40px' }}>
                        <FaCircleCheck className={styles.successIcon} style={{ fontSize: '48px', color: '#3b82f6', marginBottom: '20px' }} />
                        <h2 className={styles.congratsTitle}>Booking Requested!</h2>
                        <p className={styles.congratsMessage} style={{ marginBottom: '20px', color: '#64748b' }}>
                            Thank you! Your request has been successfully submitted. Our team will review your selection and send the final invoice to your email address shortly.
                        </p>
                        <div className={styles.refBox} style={{ margin: '20px 0', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                            <span className={styles.refLabel}>Booking Reference:</span>
                            <span className={styles.refNumber} style={{ fontWeight: '700', marginLeft: '10px', color: '#1e293b' }}>{generatedReference}</span>
                        </div>
                        <Link href="/" className={styles.homeButton}>Return Home</Link>
                    </div>
                )}

                {currentStep < 4 && (
                    <div className={styles.actionBar}>
                        <button className={styles.backButton} onClick={handleBack} disabled={isSubmitting}>{currentStep === 1 ? 'Back' : 'Previous'}</button>
                        {currentStep === 3 ? (
                            <button className={styles.continueButton} onClick={handleConfirmBooking} disabled={isSubmitting} style={{ backgroundColor: '#2563eb' }}>
                                {isSubmitting ? 'Requesting...' : 'Request Booking'} <FaCircleCheck />
                            </button>
                        ) : (
                            <button className={styles.continueButton} onClick={handleNext} disabled={isSubmitting}>
                                {currentStep === 3 ? 'Confirm & Pay' : 'Next Step'} <FaChevronRight />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const HostelBookingPage = () => (
    <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <HostelBookingPageContent />
    </Suspense>
);

export default HostelBookingPage;
