'use client';

import Header from '@/components/admin/Header';
import StatsGrid from '@/components/admin/StatsGrid';
import LiveOccupancy from '@/components/admin/LiveOccupancy';
import Widgets from '@/components/admin/Widgets';
import UpcomingEvents from '@/components/admin/UpcomingEvents';
import RecentBookings from '@/components/admin/RecentBookings';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';

export default function Home() {
  return (
    <>
      <Header />

      <div style={{ padding: '0 32px 32px 32px' }}>
        <StatsGrid />

        <div style={{ marginBottom: '24px' }}>
          <LiveOccupancy />
        </div>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <RecentBookings />
            <UpcomingEvents />
          </div>
          <div style={{ flex: 1 }}>
            <Widgets />
          </div>
        </div>

        {/* Analytics Graphs - Full Width Section */}
        <AnalyticsCharts />
      </div>
    </>
  );
}
