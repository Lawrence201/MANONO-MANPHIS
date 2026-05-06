'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

// Professional SVG Icons
const DashboardIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

const CalendarIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <rect x="7" y="14" width="3" height="3" rx="0.5" fill={color} />
    <rect x="14" y="14" width="3" height="3" rx="0.5" fill={color} />
  </svg>
);

const BookingsIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 14l2 2 4-4" />
  </svg>
);

const EventsIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const StaffIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0113 0" />
    <circle cx="19" cy="11" r="2.5" />
    <path d="M22 21a4 4 0 00-6-3.5" />
    <circle cx="5" cy="11" r="2.5" />
    <path d="M2 21a4 4 0 016-3.5" />
  </svg>
);

const CommunicationIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z" />
    <line x1="8" y1="9" x2="16" y2="9" />
    <line x1="8" y1="13" x2="13" y2="13" />
  </svg>
);

const HallsIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6" />
    <rect x="9" y="9" width="2" height="2" />
    <rect x="13" y="9" width="2" height="2" />
  </svg>
);

const LodgesIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 012-2h16a2 2 0 012 2v8" />
    <path d="M4 10V6a2 2 0 012-2h12a2 2 0 012 2v4" />
    <line x1="2" y1="20" x2="22" y2="20" />
    <rect x="6" y="14" width="4" height="3" rx="0.5" />
    <rect x="14" y="14" width="4" height="3" rx="0.5" />
  </svg>
);

const EventPackagesIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v3" />
    <path d="M21 16v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3" />
    <rect x="1" y="8" width="22" height="8" rx="1" />
    <circle cx="12" cy="12" r="2" fill={color} />
  </svg>
);

const SpecialPackagesIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const GroupRetreatsIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const AddHallsIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V7l7-4 7 4v14" />
    <circle cx="17" cy="8" r="4" fill="none" />
    <line x1="17" y1="6" x2="17" y2="10" />
    <line x1="15" y1="8" x2="19" y2="8" />
  </svg>
);

const AddLodgesIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20v-8a2 2 0 012-2h12a2 2 0 012 2v8" />
    <line x1="2" y1="20" x2="18" y2="20" />
    <circle cx="19" cy="7" r="4" fill="none" />
    <line x1="19" y1="5" x2="19" y2="9" />
    <line x1="17" y1="7" x2="21" y2="7" />
  </svg>
);

const AddPackagesIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4l-9-5.19" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
    <circle cx="19" cy="5" r="3" fill="none" />
    <line x1="19" y1="4" x2="19" y2="6" />
    <line x1="18" y1="5" x2="20" y2="5" />
  </svg>
);

const AddSpecialPackagesIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 14.5 7.5 20 8.5 16 12.5 17 18 12 15.5 7 18 8 12.5 4 8.5 9.5 7.5 12 2" />
    <circle cx="19" cy="5" r="3" fill="none" />
    <line x1="19" y1="4" x2="19" y2="6" />
    <line x1="18" y1="5" x2="20" y2="5" />
  </svg>
);

const AddGroupRetreatsIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="7.5" cy="7" r="3.5" />
    <circle cx="19" cy="5" r="3" fill="none" />
    <line x1="19" y1="4" x2="19" y2="6" />
    <line x1="18" y1="5" x2="20" y2="5" />
    <path d="M20 21v-2a3 3 0 00-2-2.83" />
    <circle cx="14" cy="8" r="2" />
  </svg>
);

const ReportsIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
    <rect x="8" y="9" width="2" height="2" fill={color} />
  </svg>
);

const SettingsIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const HelpIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const LogoutIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ShieldIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const menuItems = [
  { name: 'Dashboard', icon: DashboardIcon, href: '/admin' },
  { name: 'Calendar', icon: CalendarIcon, href: '/admin/facilities-bookings' },
  { name: 'Bookings', icon: BookingsIcon, href: '/admin/guests' },
  { name: 'Events & Programs', icon: EventsIcon, href: '/admin/events' },
  { name: 'Staff & Volunteers', icon: StaffIcon, href: '/admin/staff' },
  { name: 'Communication', icon: CommunicationIcon, href: '/admin/communication' },
  { name: 'Halls', icon: HallsIcon, href: '/admin/halls' },
  { name: 'Lodges', icon: LodgesIcon, href: '/admin/hostels' },
  { name: 'Event Packages', icon: EventPackagesIcon, href: '/admin/packages' },
  { name: 'Special Packages', icon: SpecialPackagesIcon, href: '/admin/special-packages' },
  { name: 'Group Retreats', icon: GroupRetreatsIcon, href: '/admin/group-retreats' },
  { name: 'Add Halls', icon: AddHallsIcon, href: '/admin/add-halls' },
  { name: 'Add Lodges', icon: AddLodgesIcon, href: '/admin/add-hostels' },
  { name: 'Add Event Packages', icon: AddPackagesIcon, href: '/admin/add-packages' },
  { name: 'Add Special Packages', icon: AddSpecialPackagesIcon, href: '/admin/add-special-packages' },
  { name: 'Add Group Retreats', icon: AddGroupRetreatsIcon, href: '/admin/add-group-retreats' },
  { name: 'Reports', icon: ReportsIcon, href: '/admin/reports' },
  { name: 'Settings', icon: SettingsIcon, href: '/admin/settings' },
  { name: 'MFA Security', icon: ShieldIcon, href: '/admin/settings/mfa' },
  { name: 'Help & Support', icon: HelpIcon, href: '/admin/help' },
];


export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#111827',
      color: 'white',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1F2937',
      zIndex: 100
    }}>

      {/* Fixed Logo Area */}
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #353f4f', flexShrink: 0 }}>
        <Link href="/admin" style={{ position: 'relative', width: '40px', height: '40px', margin: '0 auto', display: 'block' }}>
          <img
            src="/camp_logo.png"
            alt="Camp Elim Logo"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              zIndex: 10,
            }}
          />
        </Link>
      </div>

      {/* Scrollable Navigation */}
      <nav style={{
        padding: '12px',
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                href={item.href}
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  marginBottom: '4px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(245, 158, 11, 0.1)' : 'transparent',
                  color: isActive ? '#eac14a' : '#9CA3AF',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <item.icon color={isActive ? '#eac14a' : '#9CA3AF'} />
                <span style={{ fontSize: '14px', fontWeight: isActive ? '600' : '400' }}>{item.name}</span>
              </Link>
            );
          })}

          <div style={{ height: '1px', backgroundColor: '#374151', margin: '8px 16px' }}></div>

          <div
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              marginBottom: '4px',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#EF4444', // Red color
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogoutIcon color="#EF4444" />
            <span style={{ fontSize: '14px', fontWeight: '500' }}>Logout</span>
          </div>
        </div>
      </nav>

      {/* Fixed User Footer */}
      <div style={{ padding: '20px', borderTop: '1px solid #1F2937', flexShrink: 0, backgroundColor: '#111827' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            backgroundColor: '#F59E0B',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white'
          }}>
            {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : 'A'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session?.user?.name || 'Administrator'}
            </p>
            <p style={{ fontSize: '11px', color: '#9CA3AF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {session?.user?.email || 'Loading...'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
