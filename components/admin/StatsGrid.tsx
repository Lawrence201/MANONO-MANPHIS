'use client';
import { Building2, Hotel, Package, DollarSign } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StatCardProps {
    title: string;
    value: string;
    subtext: string;
    subtextClass?: string;
    icon: any;
    iconColor: string;
    iconBg: string; // The solid colored square
}

function StatCard({ title, value, subtext, subtextClass, icon: Icon, iconColor, iconBg }: StatCardProps) {
    return (
        <div style={{
            backgroundColor: 'white',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
        }}>
            <div>
                <h3 style={{ fontSize: '14px', color: '#6B7280', marginBottom: '8px' }}>{title}</h3>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>{value}</p>
                <p style={{ fontSize: '12px', fontWeight: '500' }} className={subtextClass}>{subtext}</p>
            </div>
            <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: iconBg,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Icon color="white" size={24} />
            </div>
        </div>
    );
}

export default function StatsGrid() {
    const [statsData, setStatsData] = useState({
        occupancyRate: 0,
        totalHalls: 0,
        totalHostels: 0,
        hostelRevenue: 0,
        totalPackages: 0,
        specialPackagesCount: 0,
        totalRevenue: 0,
        loading: true
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch('/api/admin/stats');
                const data = await res.json();
                if (res.ok) {
                    setStatsData({ ...data, loading: false });
                }
            } catch (err) {
                console.error("Failed to fetch stats", err);
            }
        }
        fetchStats();
    }, []);

    const formatCurrency = (val: number) => `GH₵ ${val.toLocaleString()}`;

    const stats = [
        {
            title: 'Total Halls',
            value: statsData.loading ? '...' : statsData.totalHalls.toString(),
            subtext: 'Available for booking',
            subtextClass: 'text-green-500',
            icon: Building2,
            iconBg: '#F59E0B' // Orange
        },
        {
            title: 'Total Lodges',
            value: statsData.loading ? '...' : statsData.totalHostels.toString(),
            subtext: 'Available for booking',
            subtextClass: 'text-green-500',
            icon: Hotel,
            iconBg: '#10B981' // Green
        },
        {
            title: 'Total Packages',
            value: statsData.loading ? '...' : statsData.totalPackages.toString(),
            subtext: 'Available',
            subtextClass: 'text-gray-500',
            icon: Package,
            iconBg: '#0EA5E9' // Blue
        },
        {
            title: 'Special Packages',
            value: statsData.loading ? '...' : statsData.specialPackagesCount.toString(),
            subtext: 'Available for booking',
            subtextClass: 'text-green-500',
            icon: Package,
            iconBg: '#8B5CF6' // Purple for Special
        }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} iconColor="white" />
            ))}
        </div>
    );
}
