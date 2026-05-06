'use client';
import Header from '@/components/admin/Header';
import BookingList from '@/components/admin/BookingList';

export default function BookingsPage() {
    return (
        <>
            <Header />
            <div style={{ padding: '32px' }}>
                <BookingList />
            </div>
        </>
    );
}
