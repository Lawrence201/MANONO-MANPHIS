'use client';

import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaPenToSquare, FaChevronDown, FaCreditCard, FaBuildingColumns, FaMobileScreen, FaCircleCheck } from 'react-icons/fa6';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styles from './BillboardBooking.module.css';
import { generatePendingRequestPDF, formatReceiptDate } from '@/lib/receiptGenerator';
import { getBillboards } from '@/lib/actions/billboard-actions';
import { createBillboardBooking } from '@/lib/actions/booking-actions';
import { addToCart } from '@/lib/actions/cart-actions';
import { toast } from 'sonner';
import { ProductsHero } from '@/components/website/products-hero';
import { TopBar } from '@/components/website/top-bar';
import { WebsiteHeader } from '@/components/website/header';
import { WebsiteFooter } from '@/components/website/footer';

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
    maxSlots?: number;
    bookings?: any[];
}

interface UserProfile {
    name?: string;
    email?: string;
    phoneNumber?: string;
}

const HallBookingPageContent = ({ userProfile }: { userProfile?: UserProfile }) => {
    // Bypassed NextAuth session hook for runtime safety
    const session = null;
    const searchParams = useSearchParams();
    const router = useRouter();
    const preSelectedHallId = searchParams.get('hallId');

    const [halls, setHalls] = React.useState<Hall[]>([]);
    const [selectedHallIds, setSelectedHallIds] = React.useState<string[]>(preSelectedHallId ? [preSelectedHallId] : []);

    // Billboard Specific Booking States
    const [fullName, setFullName] = React.useState(userProfile?.name || '');
    const [email, setEmail] = React.useState(userProfile?.email || '');
    const [phone, setPhone] = React.useState(userProfile?.phoneNumber || '');
    const [companyName, setCompanyName] = React.useState('');
    const [website, setWebsite] = React.useState('');
    const [clientType, setClientType] = React.useState('individual');
    const [customClientType, setCustomClientType] = React.useState('');

    const [campaignTitle, setCampaignTitle] = React.useState('');
    const [campaignType, setCampaignType] = React.useState('video');
    const [campaignDuration, setCampaignDuration] = React.useState(1); // In months
    const [slotsRequested, setSlotsRequested] = React.useState(1);
    const [description, setDescription] = React.useState('');
    const [advertFile, setAdvertFile] = React.useState<string | null>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [paymentMethod, setPaymentMethod] = React.useState('card');

    // Date Selection State (Corresponds to launch / startDate)
    const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = React.useState<string | null>('06:00 am');

    // Submission State
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [bookingReferences, setBookingReferences] = React.useState<string[]>([]);
    const [currentStep, setCurrentStep] = React.useState(1);

    // Derived state for selected billboard
    const selectedBillboard = React.useMemo(() =>
        halls.find(h => selectedHallIds.includes(h.id.toString())),
        [halls, selectedHallIds]);

    const selectedHallsData = React.useMemo(() =>
        selectedBillboard ? [selectedBillboard] : [],
        [selectedBillboard]);

    // Parse the minDuration field from the database to decide whether it's Weeks, Days, or Months
    const durationUnit = React.useMemo(() => {
        if (!selectedBillboard) return 'Months';
        const minDur = ((selectedBillboard as any).minDuration || '1m').toLowerCase();
        if (minDur.includes('w') || minDur.includes('week')) {
            return 'Weeks';
        }
        if (minDur.includes('d') || minDur.includes('day')) {
            return 'Days';
        }
        return 'Months';
    }, [selectedBillboard]);

    // Calculate End Date dynamically based on selected start date and campaign duration unit
    const calculatedEndDate = React.useMemo(() => {
        if (!selectedDate) return null;
        const end = new Date(selectedDate);
        if (durationUnit === 'Weeks') {
            end.setDate(end.getDate() + campaignDuration * 7);
        } else if (durationUnit === 'Days') {
            end.setDate(end.getDate() + campaignDuration);
        } else {
            end.setMonth(end.getMonth() + campaignDuration);
        }
        return end;
    }, [selectedDate, campaignDuration, durationUnit]);

    // Pricing Calculation
    const totalPrice = React.useMemo(() => {
        if (!selectedBillboard) return 0;
        const baseRate = parsePrice(selectedBillboard.price);
        const subtotal = baseRate * campaignDuration * slotsRequested;
        const taxRate = (selectedBillboard as any).taxRate || 10;
        const taxAmount = (subtotal * taxRate) / 100;
        return subtotal + taxAmount;
    }, [selectedBillboard, campaignDuration, slotsRequested]);

    const durationPriceInfo = React.useMemo(() => {
        if (!selectedBillboard) return null;
        const baseRate = parsePrice(selectedBillboard.price);
        const subtotal = baseRate * campaignDuration * slotsRequested;
        const taxRate = (selectedBillboard as any).taxRate || 10;
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount;
        return {
            baseRate,
            subtotal,
            taxRate,
            taxAmount,
            total,
            isValid: campaignDuration > 0
        };
    }, [selectedBillboard, campaignDuration, slotsRequested]);

    React.useEffect(() => {
        const fetchBillboards = async () => {
            try {
                const res = await getBillboards();
                if (res.success && res.data) {
                    const mappedHalls = res.data.map((b: any) => ({
                        id: b.id,
                        name: b.name,
                        price: b.weeklyRate.toString(),
                        description: b.description || '',
                        capacity: '1 Slot',
                        duration: '1',
                        mainImagePath: b.featureImage || b.galleryImages?.[0]?.imagePath || null,
                        addOns: [],
                        assetCode: b.assetCode,
                        format: b.aspectRatio,
                        dimensions: b.dimensions,
                        taxRate: b.taxRate,
                        latitude: b.latitude,
                        longitude: b.longitude,
                        screenType: b.screenType,
                        resolution: b.resolution,
                        brightness: b.brightness,
                        maxSlots: b.maxSlots || 12,
                        minDuration: b.minDuration || '1m',
                        city: b.city,
                        address: b.address,
                        bookings: b.bookings || []
                    }));
                    setHalls(mappedHalls);
                }
            } catch (error) {
                console.error('Error fetching billboards:', error);
            }
        };

        fetchBillboards();
    }, []);

    React.useEffect(() => {
        if (preSelectedHallId) {
            setSelectedHallIds([preSelectedHallId]);
        }
    }, [preSelectedHallId]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        setIsUploading(true);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);
            formDataUpload.append("folder", "campaigns");

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });
            const result = await response.json();

            if (result.success && result.url) {
                setAdvertFile(result.url);
            } else {
                alert(result.error || "File upload failed.");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("An error occurred during file upload.");
        } finally {
            setIsUploading(false);
            if (e.target) {
                e.target.value = '';
            }
        }
    };

    const handleConfirmBooking = async () => {
        if (selectedHallIds.length === 0 || !selectedDate) {
            alert('Please select a billboard and launch date.');
            return;
        }

        const trimmedEmail = email.trim().toLowerCase().replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, '');
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

        if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!fullName) {
            alert('Please enter your full name.');
            return;
        }

        if (clientType === 'other' && !customClientType.trim()) {
            alert('Please specify your custom client type.');
            return;
        }

        if (!campaignTitle) {
            alert('Please enter your campaign title.');
            return;
        }

        setIsSubmitting(true);

        try {
            // End Date calculation: Start Date + Duration (in months)
            const endDateObj = new Date(selectedDate);
            if (durationUnit === 'Weeks') {
                endDateObj.setDate(endDateObj.getDate() + campaignDuration * 7);
            } else if (durationUnit === 'Days') {
                endDateObj.setDate(endDateObj.getDate() + campaignDuration);
            } else {
                endDateObj.setMonth(endDateObj.getMonth() + campaignDuration);
            }

            const bookingPayload = {
                billboardId: parseInt(selectedHallIds[0]),
                fullName,
                email: trimmedEmail,
                phone: phone || undefined,
                companyName: companyName || undefined,
                clientType: clientType === 'other' ? customClientType.trim() : clientType,
                campaignTitle,
                campaignType,
                campaignDuration,
                startDate: selectedDate.toISOString(),
                endDate: endDateObj.toISOString(),
                slotsRequested,
                description: website ? `${description}\nClient Website: ${website}`.trim() : description || undefined,
                advertFile: advertFile || undefined,
                totalPrice,
                taxRate: selectedBillboard ? Number((selectedBillboard as any).taxRate) || 10 : 10,
                paymentMethod
            };

            const result = await createBillboardBooking(bookingPayload);

            if (result.success && result.data) {
                setBookingReferences([`BB-REF-${result.data.id}`]);
                setCurrentStep(5);
                window.scrollTo(0, 0);
            } else {
                alert(result.error || 'Failed to process booking.');
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };


    // Calendar Logic
    const [currentMonth, setCurrentMonth] = React.useState(new Date());

    const handleNext = () => {
        if (currentStep < 5) {
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

    const isDateAvailable = (date: Date) => {
        if (!selectedBillboard || !selectedBillboard.bookings) return true;

        const reqStart = date.getTime();
        const end = new Date(date);
        if (durationUnit === 'Weeks') end.setDate(end.getDate() + campaignDuration * 7);
        else if (durationUnit === 'Days') end.setDate(end.getDate() + campaignDuration);
        else end.setMonth(end.getMonth() + campaignDuration);
        const reqEnd = end.getTime();

        let baseSlots = 0;
        const events: { time: number, delta: number }[] = [];

        selectedBillboard.bookings.forEach((b: any) => {
            if (b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected') return;
            const bStart = new Date(b.startDate).getTime();
            const bEnd = new Date(b.endDate).getTime();

            if (bStart <= reqStart && bEnd >= reqStart) baseSlots += b.slotsRequested;
            if (bStart > reqStart && bStart <= reqEnd) events.push({ time: bStart, delta: b.slotsRequested });
            if (bEnd >= reqStart && bEnd < reqEnd) events.push({ time: bEnd, delta: -b.slotsRequested });
        });

        events.sort((a, b) => {
            if (a.time !== b.time) return a.time - b.time;
            return a.delta - b.delta;
        });

        let currentSlots = baseSlots;
        let maxConsumed = baseSlots;
        for (const e of events) {
            currentSlots += e.delta;
            if (currentSlots > maxConsumed) maxConsumed = currentSlots;
        }

        const maxSlots = selectedBillboard.maxSlots || 12;
        return maxConsumed + slotsRequested <= maxSlots;
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            date.setHours(0, 0, 0, 0);
            const isPast = date.getTime() < today.getTime();
            const isAvailable = isDateAvailable(date);
            const isDisabled = isPast || !isAvailable;
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            days.push(
                <div
                    key={day}
                    className={`${styles.dateNum} ${isSelected ? styles.selected : ''} ${isDisabled ? styles.disabled : ''}`}
                    onClick={() => {
                        if (!isDisabled) {
                            handleDateClick(day);
                        }
                    }}
                    title={!isAvailable && !isPast ? "Not enough slots for this duration" : undefined}
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

    return (
        <div className="min-h-screen bg-white">
            <TopBar />
            <WebsiteHeader />
            <div className={styles.pageContainer}>
                {/* Hero Section */}
                <ProductsHero
                    title={selectedBillboard ? selectedBillboard.name.split(' ').slice(0, 2).join(' ').toUpperCase() : "BILLBOARD"}
                    highlightTitle={selectedBillboard ? selectedBillboard.name.split(' ').slice(2).join(' ').toUpperCase() : "BOOKING"}
                    backgroundImage={heroImage}
                    breadcrumbTitle="Booking"
                    highlightColor="#b8b3b4"
                />

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
                        <style dangerouslySetInnerHTML={{
                            __html: `
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}} />
                        <h3 style={{ marginTop: '20px', color: '#1e293b', fontWeight: '600', fontSize: '1.25rem' }}>Processing Booking</h3>
                        <p style={{ marginTop: '10px', color: '#64748b', textAlign: 'center', maxWidth: '300px' }}>
                            Please wait while we finalize your booking and notify the administration...
                        </p>
                    </div>
                )}

                {/* Stepper */}
                <div className={styles.stepperContainer}>
                    <div className={styles.stepper}>
                        <div className={`${styles.stepItem} ${currentStep === 1 ? styles.active : ''}`}>
                            <div className={styles.stepCircle}>1</div>
                            <span className={styles.stepLabel}>Billboard Selected</span>
                        </div>
                        <div className={`${styles.stepItem} ${currentStep === 2 ? styles.active : ''}`}>
                            <div className={styles.stepCircle}>2</div>
                            <span className={styles.stepLabel}>Your Profile</span>
                        </div>
                        <div className={`${styles.stepItem} ${currentStep === 3 ? styles.active : ''}`}>
                            <div className={styles.stepCircle}>3</div>
                            <span className={styles.stepLabel}>Campaign Details</span>
                        </div>
                        <div className={`${styles.stepItem} ${currentStep === 4 ? styles.active : ''}`}>
                            <div className={styles.stepCircle}>4</div>
                            <span className={styles.stepLabel}>Review & Confirm</span>
                        </div>
                        <div className={`${styles.stepItem} ${currentStep === 5 ? styles.active : ''}`}>
                            <div className={styles.stepCircle}>5</div>
                            <span className={styles.stepLabel}>Confirmed</span>
                        </div>
                    </div>
                </div>

                {/* Booking Content */}
                <div className={styles.bookingContent}>
                    {currentStep === 1 && (
                        <div className={styles.bookingGrid} style={{ gridTemplateColumns: '1.15fr 0.85fr', maxWidth: '1350px', margin: '0 auto 40px', gap: '28px' }}>

                            {/* Left Column: Billboard Details Selection */}
                            <div className={styles.card} style={{ minHeight: '560px', padding: '35px', borderRadius: '12px' }}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>Billboard Detail</h2>
                                    <p className={styles.cardSubtitle}>Select the perfect digital asset for your brand campaign</p>
                                </div>

                                <div className={styles.formGrid} style={{ gap: '16px', marginBottom: '20px' }}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Bill board name *</label>
                                        <select
                                            className={styles.select}
                                            value={selectedHallIds[0] || ''}
                                            onChange={(e) => setSelectedHallIds(e.target.value ? [e.target.value] : [])}
                                            suppressHydrationWarning
                                        >
                                            <option value="" disabled>Choose a billboard...</option>
                                            {halls.map(hall => (
                                                <option key={hall.id} value={hall.id.toString()}>
                                                    {hall.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Bill Board code</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            readOnly
                                            placeholder="Billboard Code"
                                            value={(halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.assetCode || ''}
                                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGrid} style={{ gap: '16px', marginBottom: '20px' }}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Format</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            readOnly
                                            placeholder="Billboard Format"
                                            value={(halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.format || ''}
                                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', textTransform: 'capitalize' }}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Dimension</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            readOnly
                                            placeholder="Billboard Dimension"
                                            value={(halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.dimensions || ''}
                                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGrid} style={{ gap: '16px', marginBottom: '20px' }}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Display Type</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            readOnly
                                            placeholder="Display Type"
                                            value={((halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.screenType || '').toUpperCase()}
                                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed', textTransform: 'uppercase' }}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Resolution</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            readOnly
                                            placeholder="Display Resolution"
                                            value={((halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.resolution || '').toUpperCase()}
                                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>

                                <div className={styles.formGrid} style={{ gap: '16px', marginBottom: '10px' }}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Brightness</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            readOnly
                                            placeholder="Screen Brightness"
                                            value={(() => {
                                                const val = (halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.brightness;
                                                if (!val) return '';
                                                return String(val).toLowerCase().includes('nits') ? val : `${val} nits`;
                                            })()}
                                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Available Slots</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            readOnly
                                            placeholder="Available Slots"
                                            value={
                                                selectedHallIds[0]
                                                    ? `${(halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.availableSlots !== undefined
                                                        ? (halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.availableSlots
                                                        : ((halls.find(h => h.id.toString() === selectedHallIds[0]) as any)?.maxSlots || 12)} Slots`
                                                    : ''
                                            }
                                            style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                                            suppressHydrationWarning
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Billboard Map Location */}
                            <div className={styles.card} style={{ minHeight: '560px', display: 'flex', flexDirection: 'column', padding: '35px', borderRadius: '12px' }}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>BILLBOARD LOCATION</h2>
                                    <p className={styles.cardSubtitle}>Geographic position of the selected digital asset</p>
                                </div>

                                <div style={{ flex: 1, position: 'relative', minHeight: '420px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    <iframe
                                        src={selectedBillboard && (selectedBillboard as any).latitude && (selectedBillboard as any).longitude
                                            ? `https://maps.google.com/maps?q=${(selectedBillboard as any).latitude},${(selectedBillboard as any).longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`
                                            : `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127066.25365111166!2d-0.26330925!3d5.591244349999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9084b2b7a773%3A0xbed172fb570c03e!2sAccra%2C%20Ghana!5e0!3m2!1sen!2s!4v1714392600000!5m2!1sen!2s`
                                        }
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Billboard Location Map"
                                        suppressHydrationWarning
                                    ></iframe>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className={styles.stepTwoGrid} style={{ gridTemplateColumns: '1.4fr 1fr', maxWidth: '1350px', margin: '0 auto 50px', gap: '28px' }}>
                            {/* Details form */}
                            <div className={`${styles.card} ${styles.detailsCard}`} style={{ borderRadius: '12px', padding: '35px' }}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>Your Profile</h2>
                                    <p className={styles.cardSubtitle}>Tell us about yourself and your brand</p>
                                </div>

                                <div className={styles.formGrid}>
                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label}>Full Name *</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="e.g. Lawrence Antwi"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
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
                                                fontSize: '16px',
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
                                                width: '100%',
                                                height: '45px'
                                            }}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Company Name *</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="e.g. A+Softek"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            style={{ fontWeight: '500' }}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Client Type *</label>
                                        <select
                                            className={styles.select}
                                            value={clientType}
                                            onChange={(e) => {
                                                setClientType(e.target.value);
                                                if (e.target.value !== 'other') {
                                                    setCustomClientType('');
                                                }
                                            }}
                                            style={{ textTransform: 'capitalize' }}
                                        >
                                            <option value="individual">Individual</option>
                                            <option value="sme">Small or Medium Enterprise (SME)</option>
                                            <option value="corporate">Corporate Brand</option>
                                            <option value="agency">Advertising Agency</option>
                                            <option value="government">Government Entity / Ministry</option>
                                            <option value="ngo">NGO / Non-Profit Org</option>
                                            <option value="religious">Religious Organization</option>
                                            <option value="educational">Educational Institution</option>
                                            <option value="other">Other (Please specify)</option>
                                        </select>
                                    </div>
                                    {clientType === 'other' && (
                                        <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                            <label className={styles.label}>Specify Client Type *</label>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="e.g. Political Campaign, Charity Org"
                                                value={customClientType}
                                                onChange={(e) => setCustomClientType(e.target.value)}
                                                style={{ fontWeight: '500' }}
                                            />
                                        </div>
                                    )}
                                    <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                        <label className={styles.label}>Website (Optional)</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="e.g. https://yourcompany.com"
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            style={{ fontWeight: '500' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Date Selection */}
                            <div className={styles.stepTwoRightColumn} style={{ alignSelf: 'start', width: '100%' }}>
                                <div className={styles.card} style={{ borderRadius: '12px', padding: '35px', height: 'auto' }}>
                                    <div className={styles.cardHeader}>
                                        <h2 className={styles.cardTitle}>Launch Date</h2>
                                        <p className={styles.cardSubtitle}>Pick your preferred launch date from the calendar</p>
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
                                        <span style={{
                                            fontWeight: '600',
                                            color: selectedDate ? '#1e293b' : '#ef4444',
                                            fontSize: selectedDate ? '14px' : '13px'
                                        }}>
                                            {selectedDate
                                                ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                                : 'Pick your preferred launch date from the calendar'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className={styles.bookingGrid} style={{ gridTemplateColumns: '1.4fr 1fr', maxWidth: '1350px', margin: '0 auto 40px', gap: '28px' }}>
                            {/* Left Column: Campaign Details */}
                            <div className={styles.card} style={{ borderRadius: '12px', padding: '35px' }}>
                                <div className={styles.cardHeader}>
                                    <h2 className={styles.cardTitle}>Campaign Details</h2>
                                    <p className={styles.cardSubtitle}>Customize your advertisement scheduling and assets</p>
                                </div>

                                <div className={styles.formGrid} style={{ gap: '16px', marginBottom: '20px' }}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Campaign Title *</label>
                                        <input
                                            type="text"
                                            className={styles.input}
                                            placeholder="e.g. Summer Brand Launch"
                                            value={campaignTitle}
                                            onChange={(e) => setCampaignTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Campaign Type *</label>
                                        <select
                                            className={styles.select}
                                            value={campaignType}
                                            onChange={(e) => setCampaignType(e.target.value)}
                                        >
                                            <option value="video">Video Asset</option>
                                            <option value="image">Static Picture / Image</option>
                                            <option value="slides">Slides / Carousel</option>
                                        </select>
                                    </div>
                                </div>

                                <style>{`
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}</style>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }}
                                    accept={
                                        campaignType === 'video'
                                            ? 'video/*'
                                            : campaignType === 'image'
                                                ? 'image/*'
                                                : 'image/*,application/pdf'
                                    }
                                    onChange={handleFileUpload}
                                />

                                <div className={styles.inputGroup} style={{ marginBottom: '20px' }}>
                                    <label className={styles.label}>
                                        Upload Campaign {campaignType === 'video' ? 'Video (MP4)' : campaignType === 'image' ? 'Image (PNG/JPG)' : 'Slideshow Assets (PDF/Images)'} *
                                    </label>

                                    {isUploading ? (
                                        <div style={{
                                            border: '2px dashed #3b82f6',
                                            borderRadius: '8px',
                                            padding: '30px 20px',
                                            backgroundColor: '#eff6ff',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '12px',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            <div style={{
                                                width: '32px',
                                                height: '32px',
                                                border: '3px solid #dbeafe',
                                                borderTop: '3px solid #3b82f6',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite'
                                            }} />
                                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a', margin: 0 }}>
                                                Uploading your asset to GCB Storage...
                                            </p>
                                            <p style={{ fontSize: '11px', color: '#60a5fa', margin: 0 }}>
                                                Please do not close this page.
                                            </p>
                                        </div>
                                    ) : advertFile ? (
                                        <div style={{
                                            border: '2px dashed #cbd5e1',
                                            borderRadius: '8px',
                                            padding: '20px',
                                            backgroundColor: '#f8fafc',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '16px',
                                            position: 'relative'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                        Campaign Preview
                                                    </span>
                                                    <span style={{
                                                        fontSize: '9px',
                                                        fontWeight: '700',
                                                        color: '#262626',
                                                        backgroundColor: '#e5e7eb',
                                                        padding: '2px 8px',
                                                        borderRadius: '12px',
                                                        textTransform: 'uppercase'
                                                    }}>
                                                        Ready
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setAdvertFile(null)}
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#ef4444',
                                                        cursor: 'pointer',
                                                        padding: '4px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        borderRadius: '4px',
                                                        marginLeft: 'auto',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title="Remove File"
                                                >
                                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                </button>
                                            </div>

                                            <div style={{
                                                width: '100%',
                                                backgroundColor: '#f1f5f9',
                                                borderRadius: '6px',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                border: '1px solid #e2e8f0',
                                                padding: '8px'
                                            }}>
                                                {campaignType === 'video' ? (
                                                    <video
                                                        src={advertFile}
                                                        controls
                                                        style={{
                                                            width: '100%',
                                                            maxHeight: '220px',
                                                            borderRadius: '4px',
                                                            objectFit: 'contain',
                                                            backgroundColor: '#000000'
                                                        }}
                                                    />
                                                ) : campaignType === 'image' || (advertFile && !advertFile.toLowerCase().endsWith('.pdf')) ? (
                                                    <img
                                                        src={advertFile}
                                                        alt="Campaign Preview"
                                                        style={{
                                                            width: '100%',
                                                            maxHeight: '220px',
                                                            borderRadius: '4px',
                                                            objectFit: 'contain'
                                                        }}
                                                    />
                                                ) : (
                                                    <div style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '12px',
                                                        padding: '24px 16px',
                                                        width: '100%'
                                                    }}>
                                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#64748b' }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                                        <a
                                                            href={advertFile}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            style={{
                                                                fontSize: '13px',
                                                                color: '#3d3d3d',
                                                                fontWeight: '600',
                                                                textDecoration: 'underline',
                                                                textAlign: 'center',
                                                                wordBreak: 'break-all'
                                                            }}
                                                        >
                                                            Open PDF Document
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            style={{
                                                border: '2px dashed #cbd5e1',
                                                borderRadius: '8px',
                                                padding: '30px 20px',
                                                backgroundColor: '#f8fafc',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'center'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = '#94a3b8';
                                                e.currentTarget.style.backgroundColor = '#f1f5f9';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = '#cbd5e1';
                                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                            }}
                                        >
                                            <div style={{
                                                width: '48px',
                                                height: '48px',
                                                borderRadius: '10px',
                                                backgroundColor: '#f1f5f9',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#64748b',
                                                marginBottom: '12px'
                                            }}>
                                                {campaignType === 'video' ? (
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                ) : campaignType === 'image' ? (
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                                                ) : (
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2" /><rect x="2" y="14" width="20" height="8" rx="2" ry="2" /></svg>
                                                )}
                                            </div>
                                            <p style={{ fontSize: '14px', fontWeight: '700', color: '#334155', margin: '0 0 4px 0' }}>
                                                Upload Campaign {campaignType === 'video' ? 'Video' : campaignType === 'image' ? 'Image' : 'Slideshow'}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                                                Show the screen playing an ad. Click to browse.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.formGrid} style={{ gap: '16px', marginBottom: '20px' }}>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Campaign Duration ({durationUnit}) *</label>
                                        <input
                                            type="number"
                                            min={1}
                                            className={styles.input}
                                            placeholder={`Enter duration in ${durationUnit.toLowerCase()}`}
                                            value={campaignDuration}
                                            onChange={(e) => setCampaignDuration(Math.max(1, parseInt(e.target.value) || 1))}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label className={styles.label}>Slots Requested *</label>
                                        <select
                                            className={styles.select}
                                            value={slotsRequested}
                                            onChange={(e) => setSlotsRequested(parseInt(e.target.value) || 1)}
                                        >
                                            {[1, 2, 3, 4, 5, 6, 8, 10, 12].map(num => (
                                                <option key={num} value={num}>{num} Slot{num > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.inputGroup}>
                                    <label className={styles.label}>Campaign Description</label>
                                    <textarea
                                        className={styles.input}
                                        placeholder="Describe your advertising campaign or specific instructions..."
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Campaign Summary */}
                            <div className={styles.stepTwoRightColumn} style={{ alignSelf: 'start', width: '100%' }}>
                                <div className={`${styles.card} ${styles.addonsCard}`} style={{ borderRadius: '12px', padding: '35px', height: 'auto' }}>
                                    <div className={styles.addonHeader}>
                                        <h3 className={styles.hallSummaryTitle} style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '12px' }}>Campaign Summary</h3>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                                        <div className={styles.summaryItem}>
                                            <span style={{ color: '#64748b' }}>Selected Billboard:</span>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{selectedBillboard ? selectedBillboard.name : 'None'}</span>
                                        </div>
                                        <div className={styles.summaryItem}>
                                            <span style={{ color: '#64748b' }}>Campaign Type:</span>
                                            <span style={{ fontWeight: '600', color: '#1e293b', textTransform: 'capitalize' }}>{campaignType}</span>
                                        </div>
                                        <div className={styles.summaryItem}>
                                            <span style={{ color: '#64748b' }}>Duration:</span>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{campaignDuration} {durationUnit === 'Weeks' ? 'Week(s)' : durationUnit === 'Days' ? 'Day(s)' : 'Month(s)'}</span>
                                        </div>
                                        <div className={styles.summaryItem}>
                                            <span style={{ color: '#64748b' }}>Slots Booked:</span>
                                            <span style={{ fontWeight: '600', color: '#1e293b' }}>{slotsRequested} Slot{slotsRequested > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className={styles.summaryItem} style={{ alignItems: 'flex-start', gap: '10px' }}>
                                            <span style={{ color: '#64748b', whiteSpace: 'nowrap' }}>Launch Date:</span>
                                            <span style={{
                                                fontWeight: '600',
                                                color: selectedDate ? '#1e293b' : '#ef4444',
                                                textAlign: 'right',
                                                fontSize: selectedDate ? '14px' : '12px'
                                            }}>
                                                {selectedDate ? selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Pick your preferred launch date from the calendar'}
                                            </span>
                                        </div>
                                        {selectedDate && calculatedEndDate && (
                                            <div className={styles.summaryItem} style={{ alignItems: 'center' }}>
                                                <span style={{ color: '#64748b' }}>End Date:</span>
                                                <span style={{ fontWeight: '600', color: '#1e293b' }}>
                                                    {calculatedEndDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}                {currentStep === 4 && (
                        <div style={{
                            display: 'flex',
                            gap: '30px',
                            maxWidth: '1400px',
                            margin: '0 auto 40px',
                            width: '100%',
                            flexWrap: 'wrap',
                            alignItems: 'start'
                        }}>
                            {/* LEFT COLUMN: Your Cart */}
                            <div style={{ flex: '1.2 1 500px', minWidth: '320px' }}>
                                {(() => {
                                    // Mocks/Fallback parameters for pixel-perfect matches when cart is empty
                                    const activeBillboard = selectedBillboard || {
                                        name: "Accra - Legon Campus (Screen inside Volta Hall)",
                                        mainImagePath: "/uploads/billboards/update-1778918554789-612231548.jpg",
                                        address: "Legon Campus",
                                        city: "Accra",
                                        price: "763.63"
                                    };

                                    const activeBaseRate = activeBillboard ? parsePrice(activeBillboard.price) : 763.63;

                                    // Displays date range: May 25, 2026 - Jun 25, 2026 or selected period
                                    const startDateObj = selectedDate ? new Date(selectedDate) : new Date("2026-05-25");
                                    const endDateObj = new Date(startDateObj);
                                    if (durationUnit === 'Weeks') {
                                        endDateObj.setDate(endDateObj.getDate() + (campaignDuration || 1) * 7);
                                    } else if (durationUnit === 'Days') {
                                        endDateObj.setDate(endDateObj.getDate() + (campaignDuration || 1));
                                    } else {
                                        endDateObj.setMonth(endDateObj.getMonth() + (campaignDuration || 1));
                                    }

                                    const fmtDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                    const periodText = `${fmtDate(startDateObj)} - ${fmtDate(endDateObj)}`;
                                    const durationText = `${campaignDuration || 1} ${durationUnit === 'Weeks' ? 'Week' : durationUnit === 'Days' ? 'Day' : 'Month'}${(campaignDuration || 1) > 1 ? 's' : ''}`;

                                    const displaySubtotal = activeBaseRate * (campaignDuration || 1) * slotsRequested;

                                    return (
                                        <div style={{
                                            borderRadius: '12px',
                                            padding: '16px',
                                            backgroundColor: '#ffffff',
                                            color: '#1e293b',
                                            border: '1px solid #e2e8f0',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                            <div style={{
                                                borderRadius: '8px',
                                                padding: '16px',
                                                backgroundColor: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                display: 'flex',
                                                gap: '16px',
                                                alignItems: 'flex-start',
                                                flexWrap: 'wrap',
                                                position: 'relative'
                                            }}>
                                                {/* Thumbnail Image */}
                                                <div style={{
                                                    position: 'relative',
                                                    width: '120px',
                                                    height: '90px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    backgroundColor: '#f1f5f9',
                                                    flexShrink: 0,
                                                    border: '1px solid #e2e8f0'
                                                }}>
                                                    {activeBillboard.mainImagePath ? (
                                                        <img
                                                            src={activeBillboard.mainImagePath}
                                                            alt={activeBillboard.name}
                                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                const parent = (e.target as HTMLImageElement).parentElement;
                                                                if (parent && !parent.querySelector('.fallback-text')) {
                                                                    const div = document.createElement('div');
                                                                    div.className = 'fallback-text';
                                                                    div.style.cssText = "width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 12px;";
                                                                    div.innerText = "No Image";
                                                                    parent.appendChild(div);
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '12px' }}>
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Billboard Info & Details */}
                                                <div style={{ flex: '1', minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                                        <div>
                                                            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1e293b', margin: 0, lineHeight: '1.4' }}>
                                                                {activeBillboard.name}
                                                            </h3>
                                                            <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0 0' }}>
                                                                {(activeBillboard as any).address || 'Legon Campus'}, {(activeBillboard as any).city || 'Accra'}
                                                            </p>
                                                            <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '6px 0 0 0' }}>
                                                                GHS {activeBaseRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / month
                                                            </p>

                                                        </div>

                                                        {/* Edit & Delete buttons */}
                                                        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                                            <button
                                                                onClick={() => setCurrentStep(1)}
                                                                title="Edit details"
                                                                style={{
                                                                    width: '36px',
                                                                    height: '36px',
                                                                    borderRadius: '6px',
                                                                    border: '1px solid #cbd5e1',
                                                                    backgroundColor: '#ffffff',
                                                                    color: '#64748b',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                            >
                                                                <FaPenToSquare size={13} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to remove this billboard booking from your cart?')) {
                                                                        setSelectedHallIds([]);
                                                                        setCurrentStep(1);
                                                                    }
                                                                }}
                                                                title="Remove billboard"
                                                                style={{
                                                                    width: '36px',
                                                                    height: '36px',
                                                                    borderRadius: '6px',
                                                                    border: '1px solid #cbd5e1',
                                                                    backgroundColor: '#ffffff',
                                                                    color: '#ef4444',
                                                                    cursor: 'pointer',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    transition: 'all 0.2s'
                                                                }}
                                                            >
                                                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Period & Duration */}
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                                                        <div>
                                                            Period: <span style={{ color: '#334155', fontWeight: '400' }}>{periodText}</span>
                                                        </div>
                                                        <div>
                                                            Duration: <span style={{ color: '#d97706', fontWeight: '600' }}>{durationText}</span>
                                                        </div>
                                                    </div>

                                                    {/* Pricing Breakdowns */}
                                                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                                            <span>Slot price:</span>
                                                            <span style={{ fontWeight: '400', color: '#1e293b' }}>
                                                                GHS {activeBaseRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </span>
                                                        </div>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                                                            <span>Tax:</span>
                                                            <span style={{ fontWeight: '400', color: '#1e293b' }}>
                                                                {selectedBillboard ? (selectedBillboard as any).taxRate || 10 : 10}%
                                                            </span>
                                                        </div>
                                                    </div>


                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* RIGHT COLUMN: Pricing Details + Confirm Payment Details Stacked */}
                            <div style={{ flex: '1 1 450px', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

                                {/* Pricing Details Card */}
                                <div className={styles.card} style={{
                                    borderRadius: '12px',
                                    padding: '30px 35px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '18px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Original price</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                                            GHS {selectedBillboard && durationPriceInfo ? durationPriceInfo.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Savings</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#22c55e' }}>
                                            -GHS 0.00
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Slots Booked</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                                            {selectedBillboard ? `${slotsRequested} Slot${slotsRequested > 1 ? 's' : ''}` : '1 Slot'}
                                        </span>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '15px', color: '#64748b', fontWeight: '500' }}>Tax</span>
                                        <span style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
                                            GHS {selectedBillboard && durationPriceInfo ? durationPriceInfo.taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                        </span>
                                    </div>

                                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '18px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '17px', fontWeight: '800', color: '#eea000' }}>Total</span>
                                        <span style={{ fontSize: '19px', fontWeight: '800', color: '#eea000' }}>
                                            GHS {selectedBillboard && durationPriceInfo ? durationPriceInfo.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                                        </span>
                                    </div>
                                </div>

                                {/* Confirm Payment Details Card */}
                                <div className={styles.card} style={{
                                    borderRadius: '12px',
                                    padding: '35px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e2e8f0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px'
                                }}>
                                    <div>
                                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', marginBottom: '4px' }}>Confirm Payment Details</h3>
                                        <p style={{ fontSize: '13px', color: '#64748b' }}>Enter your payment credentials to securely schedule your campaign.</p>
                                    </div>

                                    {/* Choose Payment Method Tabs */}
                                    <div className={styles.formGrid} style={{ gap: '12px' }}>
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: paymentMethod === 'card' ? '2px solid #3d3d3d' : '1px solid #e2e8f0',
                                                backgroundColor: paymentMethod === 'card' ? '#f8fafc' : 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontWeight: '600',
                                                color: paymentMethod === 'card' ? '#111827' : '#475569',
                                                transition: 'all 0.2s',
                                                fontFamily: 'inherit',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <FaCreditCard /> Credit / Debit Card
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('bank_transfer')}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '8px',
                                                border: paymentMethod === 'bank_transfer' ? '2px solid #3d3d3d' : '1px solid #e2e8f0',
                                                backgroundColor: paymentMethod === 'bank_transfer' ? '#f8fafc' : 'white',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                gap: '8px',
                                                fontWeight: '600',
                                                color: paymentMethod === 'bank_transfer' ? '#111827' : '#475569',
                                                transition: 'all 0.2s',
                                                fontFamily: 'inherit',
                                                fontSize: '14px'
                                            }}
                                        >
                                            <FaBuildingColumns /> Bank Wire Transfer
                                        </button>
                                    </div>

                                    {paymentMethod === 'card' ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                                                    <label className={styles.label} style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                                        Full name (as displayed on card)*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        placeholder="Bonnie Green"
                                                        defaultValue={fullName || ""}
                                                        style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px' }}
                                                    />
                                                </div>
                                                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                                                    <label className={styles.label} style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
                                                        Card number*
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        placeholder="xxxx-xxxx-xxxx-xxxx"
                                                        style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px' }}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                                                    <label className={styles.label} style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        Card expiration*
                                                    </label>
                                                    <div style={{ position: 'relative' }}>
                                                        <input
                                                            type="text"
                                                            className={styles.input}
                                                            placeholder="MM/YY"
                                                            style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px 12px 12px 36px' }}
                                                        />
                                                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.inputGroup} style={{ marginBottom: 0 }}>
                                                    <label className={styles.label} style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                        CVV*
                                                        <span title="3-digit security code on the back of your card" style={{ color: '#9ca3af', cursor: 'help', display: 'inline-flex', alignItems: 'center' }}>
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                                                        </span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        placeholder="..."
                                                        maxLength={3}
                                                        style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '12px' }}
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                                <button
                                                    onClick={async () => {
                                                        if (!selectedHallsData.length) return;

                                                        setIsSubmitting(true);
                                                        try {
                                                            const b = selectedHallsData[0];
                                                            const res = await addToCart({
                                                                itemType: 'billboard',
                                                                referenceId: b.id,
                                                                name: `${campaignTitle || 'Billboard Campaign'} - ${b.name}`,
                                                                price: Number(totalPrice),
                                                                quantity: 1, // Campaign represents 1 order item
                                                                imagePath: advertFile || b.mainImagePath || '',
                                                                details: {
                                                                    slotsRequested,
                                                                    campaignType,
                                                                    campaignDuration,
                                                                    durationUnit,
                                                                    advertFile,
                                                                    fullName,
                                                                    email,
                                                                    phone,
                                                                    companyName,
                                                                    clientType,
                                                                    startDate: selectedDate ? selectedDate.toISOString() : null,
                                                                    endDate: calculatedEndDate ? calculatedEndDate.toISOString() : null
                                                                }
                                                            });

                                                            if (res.success) {
                                                                toast.success("Billboard added to cart!", {
                                                                    description: `${b.name} - GH₵ ${Number(totalPrice).toFixed(2)}`
                                                                });
                                                                window.dispatchEvent(new Event("cartUpdated"));
                                                                window.location.href = "/cart";
                                                            } else {
                                                                toast.error(res.message || "Failed to add to cart");
                                                                if (res.message?.includes("log in")) {
                                                                    window.location.href = "/login";
                                                                }
                                                            }
                                                        } catch (err) {
                                                            toast.error("Something went wrong");
                                                        } finally {
                                                            setIsSubmitting(false);
                                                        }
                                                    }}
                                                    disabled={isSubmitting}
                                                    style={{
                                                        flex: 1,
                                                        padding: '16px',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#ffffff',
                                                        color: '#3d3d3d',
                                                        border: '2px solid #e2e8f0',
                                                        fontWeight: '600',
                                                        fontSize: '16px',
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        if (!isSubmitting) e.currentTarget.style.backgroundColor = '#f8fafc';
                                                    }}
                                                    onMouseOut={(e) => {
                                                        if (!isSubmitting) e.currentTarget.style.backgroundColor = '#ffffff';
                                                    }}
                                                >
                                                    Add Cart
                                                </button>

                                                <button
                                                    onClick={handleConfirmBooking}
                                                    disabled={isSubmitting}
                                                    style={{
                                                        flex: 1,
                                                        padding: '16px',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#3d3d3d',
                                                        color: '#ffffff',
                                                        fontWeight: '600',
                                                        fontSize: '16px',
                                                        border: 'none',
                                                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '8px'
                                                    }}
                                                    onMouseOver={(e) => {
                                                        if (!isSubmitting) {
                                                            e.currentTarget.style.backgroundColor = '#535353';
                                                        }
                                                    }}
                                                    onMouseOut={(e) => {
                                                        if (!isSubmitting) {
                                                            e.currentTarget.style.backgroundColor = '#3d3d3d';
                                                        }
                                                    }}
                                                >
                                                    {isSubmitting ? 'Processing...' : 'Pay now'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>Bank Wire details:</div>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', fontSize: '13px' }}>
                                                    <span style={{ color: '#64748b' }}>Bank:</span>
                                                    <span style={{ fontWeight: '600', color: '#1e293b' }}>Glow-Financial Bank</span>
                                                    <span style={{ color: '#64748b' }}>Account Name:</span>
                                                    <span style={{ fontWeight: '600', color: '#1e293b' }}>Manono Manphis Platform</span>
                                                    <span style={{ color: '#64748b' }}>Account Number:</span>
                                                    <span style={{ fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>0029-4829-1029-338</span>
                                                    <span style={{ color: '#64748b' }}>Routing Code:</span>
                                                    <span style={{ fontWeight: '600', color: '#1e293b', fontFamily: 'monospace' }}>GLOWGHAC</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleConfirmBooking}
                                                disabled={isSubmitting}
                                                style={{
                                                    width: '100%',
                                                    padding: '16px',
                                                    borderRadius: '8px',
                                                    backgroundColor: '#3d3d3d',
                                                    color: '#ffffff',
                                                    fontWeight: '600',
                                                    fontSize: '16px',
                                                    border: 'none',
                                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s',
                                                    marginTop: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '8px'
                                                }}
                                                onMouseOver={(e) => {
                                                    if (!isSubmitting) {
                                                        e.currentTarget.style.backgroundColor = '#535353';
                                                    }
                                                }}
                                                onMouseOut={(e) => {
                                                    if (!isSubmitting) {
                                                        e.currentTarget.style.backgroundColor = '#3d3d3d';
                                                    }
                                                }}
                                            >
                                                {isSubmitting ? 'Booking...' : 'Confirm & Book Billboard'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Logos under the last card */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Guaranteed Safe And Secure Checkout</span>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                                        <Image src="/visa.png" alt="Visa" width={45} height={28} style={{ objectFit: 'contain' }} />
                                        <Image src="/master_card.png" alt="MasterCard" width={45} height={28} style={{ objectFit: 'contain' }} />
                                        <Image src="/mtn.webp" alt="MTN" width={45} height={28} style={{ objectFit: 'contain' }} />
                                        <Image src="/telecel.jpg" alt="Telecel" width={45} height={28} style={{ objectFit: 'contain' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 5 && (
                        <div className={`${styles.card} ${styles.confirmationContainer}`}>
                            <FaCircleCheck className={styles.successIcon} />
                            <h2 className={styles.congratsTitle}>Booking Confirmed!</h2>
                            <p className={styles.congratsMessage}>
                                Thank you for your booking. Your digital billboard slot has been successfully reserved.

                                A confirmation receipt and booking details have been sent to your email address.
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
                    )}

                    {currentStep < 5 && (
                        <div className={styles.actionBar}>
                            <button
                                className={styles.backButton}
                                onClick={handleBack}
                                disabled={isSubmitting}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {currentStep === 1 ? 'Back' : 'Previous'}
                            </button>

                            {currentStep === 4 ? null : (
                                <button
                                    className={styles.continueButton}
                                    onClick={handleNext}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '8px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    Next Step <FaChevronRight />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <WebsiteFooter />
        </div>
    );
};

const HallBookingPage = ({ userProfile }: { userProfile?: UserProfile }) => {
    return (
        <Suspense fallback={<div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading booking...</div>}>
            <HallBookingPageContent userProfile={userProfile} />
        </Suspense>
    );
};

export default HallBookingPage;


