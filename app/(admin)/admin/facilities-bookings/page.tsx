'use client';

import Header from '@/components/admin/Header';
import BookingCalendar from '@/components/admin/BookingCalendar';
import HallList from '@/components/admin/HallList';

export default function FacilitiesBookings() {
    return (
        <>
            <Header />

            <div style={{ padding: '32px' }}>
                <BookingCalendar />
                <HallList />
            </div>
        </>
    );
}
