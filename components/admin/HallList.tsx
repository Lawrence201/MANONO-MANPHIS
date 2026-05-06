'use client';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Facility {
    id: number;
    name: string;
    capacity: number | string;
    type: 'Hall' | 'Hostel';
    status: 'Available' | 'Occupied' | 'Maintenance';
}

export default function HallList() {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Halls, Hostels, and Bookings concurrently
                const [hallsRes, hostelsRes, bookingsRes, hostelBookingsRes] = await Promise.all([
                    fetch('/api/halls'),
                    fetch('/api/hostels'),
                    fetch('/api/bookings'),
                    fetch('/api/bookings/hostel')
                ]);

                const halls = hallsRes.ok ? await hallsRes.json() : { halls: [] };
                const hostels = hostelsRes.ok ? await hostelsRes.json() : [];
                const bookings = bookingsRes.ok ? await bookingsRes.json() : [];
                const hostelBookings = hostelBookingsRes.ok ? await hostelBookingsRes.json() : [];

                // Get today's date string (YYYY-MM-DD) for comparison
                const todayStr = new Date().toISOString().split('T')[0];

                // Process Halls
                const hallList = (halls.halls || []).map((h: any) => {
                    // Check if booked today or in future using bookedHalls array
                    const isBooked = bookings.some((b: any) => {
                        const bDate = b.eventDate ? b.eventDate.split('T')[0] : '';
                        // Check if this hall is in the booking's bookedHalls array
                        const hallInBooking = b.bookedHalls?.some((bh: any) => bh.hallId === h.id);
                        return hallInBooking && bDate >= todayStr && b.paymentStatus?.toLowerCase() === 'paid';
                    });

                    return {
                        id: h.id,
                        name: h.name,
                        capacity: h.capacity,
                        type: 'Hall',
                        status: isBooked ? 'Occupied' : 'Available'
                    };
                });

                // Process Hostels
                const hostelList = (Array.isArray(hostels) ? hostels : []).map((h: any) => {
                    const isBooked = hostelBookings.some((b: any) => {
                        const bDate = b.checkInDate ? b.checkInDate.split('T')[0] : '';
                        return (b.hostelId === h.id || (b.hostel && b.hostel.id === h.id)) && bDate >= todayStr && b.paymentStatus?.toLowerCase() === 'paid';
                    });

                    return {
                        id: h.id,
                        name: h.name,
                        capacity: h.capacity,
                        type: 'Hostel',
                        status: isBooked ? 'Occupied' : 'Available'
                    };
                });

                // Combine and filter for Occupied status only
                const allFacilities = [...hallList, ...hostelList];
                const bookedFacilities = allFacilities.filter(f => f.status === 'Occupied');

                setFacilities(bookedFacilities);
            } catch (error) {
                console.error("Failed to fetch facility data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Loading booked facilities...</div>;
    }

    if (facilities.length === 0) {
        return (
            <div style={{
                marginTop: '24px',
                padding: '32px',
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: '12px',
                color: '#6B7280',
                border: '1px dashed #E5E7EB'
            }}>
                No facilities booked for today.
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
            {facilities.map((fac, i) => (
                <div key={i} style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    border: '1px solid transparent',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                        e.currentTarget.style.borderColor = '#E5E7EB';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                        e.currentTarget.style.borderColor = 'transparent';
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '600', color: '#111827', margin: 0 }}>
                            {fac.name}
                        </h3>
                        <span style={{
                            fontSize: '10px', fontWeight: '500',
                            padding: '2px 6px', borderRadius: '4px',
                            backgroundColor: fac.type === 'Hall' ? '#FFFBEB' : '#EFF6FF',
                            color: fac.type === 'Hall' ? '#92400E' : '#1E40AF'
                        }}>
                            {fac.type}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#6B7280' }}>
                        <Users size={16} />
                        <span style={{ fontSize: '13px' }}>Capacity: {fac.capacity}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: '500',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            backgroundColor: fac.status === 'Available' ? '#DCFCE7' : '#FEE2E2',
                            color: fac.status === 'Available' ? '#166534' : '#991B1B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            {fac.status === 'Available' && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#166534' }}></div>}
                            {fac.status}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
}
