'use client';
import { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';

interface BookingTrend {
    name: string;
    total: number;
    confirmed: number;
    halls: number;
    hostels: number;
    packages: number;
}

interface FacilityData {
    name: string;
    value: number;
    count: number;
    color: string;
    [key: string]: string | number;
}

interface ChartData {
    bookingTrends: BookingTrend[];
    facilityDistribution: FacilityData[];
    summary: {
        totalBookings: number;
        hallBookings: number;
        hostelBookings: number;
        packageBookings: number;
    };
}

// Custom tooltip for the line chart
const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                border: 'none',
                minWidth: '160px'
            }}>
                <p style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#111827',
                    marginBottom: '12px',
                    borderBottom: '1px solid #E5E7EB',
                    paddingBottom: '8px'
                }}>
                    {label}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: index < payload.length - 1 ? '8px' : 0
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                                width: '10px',
                                height: '10px',
                                borderRadius: '50%',
                                backgroundColor: entry.color
                            }} />
                            <span style={{ fontSize: '13px', color: '#6B7280' }}>
                                {entry.name}
                            </span>
                        </div>
                        <span style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#111827'
                        }}>
                            {entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

// Custom tooltip for the pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div style={{
                backgroundColor: 'white',
                padding: '12px 16px',
                borderRadius: '10px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
                border: 'none'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: data.payload.color
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>
                        {data.name}
                    </span>
                </div>
                <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: '700', color: '#111827' }}>
                        {data.payload.count}
                    </span>
                    <span style={{ fontSize: '13px', color: '#6B7280', marginLeft: '4px' }}>
                        bookings ({data.value}%)
                    </span>
                </div>
            </div>
        );
    }
    return null;
};

export default function AnalyticsCharts() {
    const [chartData, setChartData] = useState<ChartData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchChartData = async () => {
            try {
                const response = await fetch('/api/admin/chart-data');
                if (!response.ok) {
                    throw new Error('Failed to fetch chart data');
                }
                const data = await response.json();

                // Add count to facilityDistribution for tooltip and rename 'Hostels' to 'Lodges'
                if (data.facilityDistribution && data.summary) {
                    data.facilityDistribution = data.facilityDistribution.map((item: any) => {
                        const newName = item.name === 'Hostels' ? 'Lodges' : item.name;
                        let countValue;
                        if (newName === 'Halls') {
                            countValue = data.summary.hallBookings;
                        } else if (newName === 'Lodges') {
                            countValue = data.summary.hostelBookings;
                        } else {
                            countValue = data.summary.packageBookings;
                        }
                        return {
                            ...item,
                            name: newName,
                            count: countValue
                        };
                    });
                }

                setChartData(data);
            } catch (err) {
                console.error('Chart data fetch error:', err);
                setError('Unable to load chart data');
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, []);

    // Custom Tick formatting for Y-axis
    const formatYAxis = (tick: number) => {
        if (tick === 0) return '0';
        if (tick >= 1000) return `${tick / 1000}k`;
        return tick.toString();
    };

    // Loading skeleton component
    const ChartSkeleton = () => (
        <div style={{
            height: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F9FAFB',
            borderRadius: '12px'
        }}>
            <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid #E5E7EB',
                    borderTopColor: '#D97706',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    margin: '0 auto 12px'
                }} />
                <p style={{ fontSize: '13px' }}>Loading chart data...</p>
            </div>
            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );

    const bookingTrends = chartData?.bookingTrends || [];
    const facilityDistribution = chartData?.facilityDistribution || [];
    const summary = chartData?.summary;

    // Colors for the charts
    const COLORS = {
        halls: '#0EA5E9',    // Sky blue
        hostels: '#A855F7',  // Purple
        packages: '#F59E0B'  // Amber
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>

            {/* 1. Booking Trends by Facility Type */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                            Booking Trends by Facility
                        </h3>
                        <p style={{ fontSize: '13px', color: '#6B7280' }}>
                            Monthly bookings for Halls, Lodges & Packages
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '20px',
                    padding: '12px 16px',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '10px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '12px',
                            height: '3px',
                            borderRadius: '2px',
                            backgroundColor: COLORS.halls
                        }} />
                        <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: '500' }}>Halls</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '12px',
                            height: '3px',
                            borderRadius: '2px',
                            backgroundColor: COLORS.hostels
                        }} />
                        <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: '500' }}>Lodges</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                            width: '12px',
                            height: '3px',
                            borderRadius: '2px',
                            backgroundColor: COLORS.packages
                        }} />
                        <span style={{ fontSize: '12px', color: '#4B5563', fontWeight: '500' }}>Packages</span>
                    </div>
                </div>

                <div style={{ height: '280px', width: '100%' }}>
                    {loading ? (
                        <ChartSkeleton />
                    ) : error ? (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#EF4444',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={bookingTrends} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid
                                    vertical={false}
                                    strokeDasharray="3 3"
                                    stroke="#E5E7EB"
                                />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 11, fill: '#9CA3AF' }}
                                    tickFormatter={formatYAxis}
                                    allowDecimals={false}
                                />
                                <Tooltip content={<CustomLineTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="halls"
                                    name="Halls"
                                    stroke={COLORS.halls}
                                    strokeWidth={2.5}
                                    dot={{ fill: COLORS.halls, strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6, fill: COLORS.halls, strokeWidth: 2, stroke: 'white' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="hostels"
                                    name="Lodges"
                                    stroke={COLORS.hostels}
                                    strokeWidth={2.5}
                                    dot={{ fill: COLORS.hostels, strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6, fill: COLORS.hostels, strokeWidth: 2, stroke: 'white' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="packages"
                                    name="Packages"
                                    stroke={COLORS.packages}
                                    strokeWidth={2.5}
                                    dot={{ fill: COLORS.packages, strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6, fill: COLORS.packages, strokeWidth: 2, stroke: 'white' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* 2. Facility Distribution - Improved Pie Chart */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>
                        Facility Distribution
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>
                        Total bookings breakdown by type
                    </p>
                </div>

                <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {loading ? (
                        <ChartSkeleton />
                    ) : error ? (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#EF4444',
                            fontSize: '14px'
                        }}>
                            {error}
                        </div>
                    ) : (
                        <>
                            <div style={{ position: 'relative', width: '100%', height: '200px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={facilityDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={85}
                                            paddingAngle={4}
                                            dataKey="value"
                                            cornerRadius={4}
                                        >
                                            {facilityDistribution.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                    strokeWidth={0}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomPieTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>

                                {/* Center text showing total */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    textAlign: 'center'
                                }}>
                                    <div style={{ fontSize: '24px', fontWeight: '700', color: '#111827' }}>
                                        {summary?.totalBookings || 0}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Total
                                    </div>
                                </div>
                            </div>

                            {/* Stats cards below pie chart */}
                            <div style={{
                                marginTop: '20px',
                                width: '100%',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: '12px'
                            }}>
                                {facilityDistribution.map((item, index) => (
                                    <div key={index} style={{
                                        padding: '16px 12px',
                                        backgroundColor: `${item.color}10`,
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        border: `1px solid ${item.color}30`
                                    }}>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#6B7280',
                                            marginBottom: '6px',
                                            fontWeight: '500',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {item.name}
                                        </div>
                                        <div style={{
                                            fontSize: '22px',
                                            fontWeight: '700',
                                            color: item.color
                                        }}>
                                            {item.count || 0}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#9CA3AF',
                                            marginTop: '2px'
                                        }}>
                                            {item.value}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
