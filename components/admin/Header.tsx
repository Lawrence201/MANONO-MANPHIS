'use client';
import { Search, Bell, MessageSquare, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import NewBookingModal from './NewBookingModal';

export default function Header() {
  const pathname = usePathname();
  const [showNewBooking, setShowNewBooking] = useState(false);

  const getTitle = () => {
    if (pathname === '/admin/facilities-bookings') return 'Calendar';
    if (pathname === '/admin/guests') return 'Bookings';
    if (pathname === '/admin/halls') return 'Halls';
    if (pathname === '/admin/add-halls') return 'Add New Hall';
    return 'Dashboard';
  };

  const getSubtitle = () => {
    if (pathname === '/admin/facilities-bookings') return 'Manage facility availability and view calendar.';
    if (pathname === '/admin/guests') return 'Manage your bookings and guest information.';
    if (pathname === '/admin/halls') return 'Manage halls, rooms, and amenities.';
    if (pathname === '/admin/add-halls') return 'Create a new venue listing for the website.';
    return "Welcome back! Here's what's happening at Camp Elim today.";
  }

  return (
    <>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          padding: '32px 32px 24px 32px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: '#F3F4F6',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)', // subtle shadow for depth
          transition: 'background-color 0.3s ease',
          marginBottom: '25px', // small space below the header
        }}
      >
        {/* Title & subtitle */}
        <div style={{ marginBottom: '-8px' }}> {/* moves the whole block slightly upwards */}
          <h2 style={{ fontSize: '30px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
            {getTitle()}
          </h2>
          <p style={{ color: '#6B7280', fontSize: '14px' }}>
            {getSubtitle()}
          </p>
        </div>


        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={20}
              color="#9CA3AF"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            />
            <input
              type="text"
              placeholder="Search bookings, guests..."
              style={{
                width: '100%',
                padding: '12px 14px 12px 44px',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                outline: 'none',
                backgroundColor: '#ffffff',
                fontSize: '14px',
                color: '#374151',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                transition: 'all 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)')}
              onBlur={(e) => (e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)')}
            />
          </div>

          {/* Icons */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Bell size={20} color="#4B5563" />
              <span
                style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '0',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#EF4444',
                  borderRadius: '50%',
                  border: '1px solid white',
                }}
              ></span>
            </div>

            <div style={{ position: 'relative', cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              <MessageSquare size={20} color="#4B5563" />
              <span
                style={{
                  position: 'absolute',
                  top: '-6px',
                  right: '-4px',
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  padding: '0 4px',
                  borderRadius: '10px',
                  border: '1px solid white',
                }}
              >
                3
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            style={{
              backgroundColor: '#F59E0B',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '10px 20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(245,158,11,0.3)',
              transition: 'all 0.2s ease',
            }}
            onClick={() => {
              if (pathname === '/admin/halls') {
                window.location.href = '/admin/add-halls';
              } else {
                setShowNewBooking(true);
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D97706';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(217,119,6,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F59E0B';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(245,158,11,0.3)';
            }}
          >
            <Plus size={18} />
            {pathname === '/admin/halls' ? 'Add New Hall' : 'New Booking'}
          </button>
        </div>
      </header>

      {/* New Booking Modal */}
      {showNewBooking && <NewBookingModal onClose={() => setShowNewBooking(false)} onSuccess={() => setShowNewBooking(false)} />}
    </>
  );
}
