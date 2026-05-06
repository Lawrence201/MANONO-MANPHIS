'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, X, Info, CheckCircle, User } from 'lucide-react';

interface AdminLogin {
    id: number;
    name: string;
    email: string;
    lastLoginAt: string | null;
    lastActiveAt: string | null;
    isOnline: boolean;
}

// Get initials from name
function getInitials(name: string): string {
    if (!name) return 'AD';
    const parts = name.split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

// Format time ago
function formatTimeAgo(dateString: string | null): string {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// Avatar colors based on name
const avatarColors = [
    { bg: '#DBEAFE', text: '#1D4ED8' },
    { bg: '#D1FAE5', text: '#059669' },
    { bg: '#FEF3C7', text: '#D97706' },
    { bg: '#FCE7F3', text: '#BE185D' },
    { bg: '#E0E7FF', text: '#4338CA' },
];

function getAvatarColor(name: string) {
    const index = name.charCodeAt(0) % avatarColors.length;
    return avatarColors[index];
}

interface Notification {
    id: string;
    reference: string;
    name: string;
    type: 'paid' | 'pending';
    category: string;
    amount: string | number;
    description: string;
    createdAt: string;
}

export default function Widgets() {
    const [admins, setAdmins] = useState<AdminLogin[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [notifLoading, setNotifLoading] = useState(true);

    // Fetch admins and send heartbeat
    useEffect(() => {
        async function fetchAdmins() {
            try {
                const res = await fetch('/api/admin/recent-logins');
                if (res.ok) {
                    const data = await res.json();
                    setAdmins(data);
                }
            } catch (error) {
                console.error('Failed to fetch admins:', error);
            } finally {
                setLoading(false);
            }
        }

        async function fetchNotifications() {
            try {
                const res = await fetch('/api/admin/notifications');
                if (res.ok) {
                    const data = await res.json();
                    // Combine pending and paid, pending first
                    const all = [...(data.pending || []), ...(data.paid || [])];
                    setNotifications(all);
                }
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setNotifLoading(false);
            }
        }

        // Send heartbeat to mark this admin as active
        async function sendHeartbeat() {
            try {
                await fetch('/api/admin/heartbeat', { method: 'POST' });
            } catch (error) {
                console.error('Heartbeat failed:', error);
            }
        }

        fetchAdmins();
        fetchNotifications();
        sendHeartbeat();

        const fetchInterval = setInterval(fetchAdmins, 30000);
        const notifInterval = setInterval(fetchNotifications, 60000);
        const heartbeatInterval = setInterval(sendHeartbeat, 120000);

        return () => {
            clearInterval(fetchInterval);
            clearInterval(notifInterval);
            clearInterval(heartbeatInterval);
        };
    }, []);

    const dismissNotification = (id: string) => {
        setDismissedIds(prev => new Set([...Array.from(prev), id]));
    };

    const activeNotifications = notifications.filter(n => !dismissedIds.has(n.id));
    const onlineCount = admins.filter(a => a.isOnline).length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>

            {/* Quick Alerts */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                minHeight: '200px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>Quick Alerts</h3>
                    <span style={{
                        fontSize: '12px',
                        backgroundColor: '#F3F4F6',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        color: '#6B7280'
                    }}>{activeNotifications.length} active</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {notifLoading ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>Loading...</div>
                    ) : activeNotifications.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9CA3AF' }}>
                            <CheckCircle size={32} color="#D1D5DB" style={{ marginBottom: '8px' }} />
                            <p style={{ fontSize: '14px' }}>All caught up! No new alerts.</p>
                        </div>
                    ) : (
                        activeNotifications.map((n) => (
                            <div key={n.id} style={{
                                backgroundColor: n.type === 'paid' ? '#F0FDF4' : '#FFF7ED',
                                borderRadius: '8px',
                                padding: '12px',
                                border: n.type === 'paid' ? '1px solid #BBF7D0' : '1px solid #FFEDD5',
                                position: 'relative',
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'flex-start'
                            }}>
                                <button
                                    onClick={() => dismissNotification(n.id)}
                                    style={{
                                        position: 'absolute', top: '8px', right: '8px',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        padding: '4px'
                                    }}
                                >
                                    <X size={14} color="#9CA3AF" />
                                </button>
                                
                                {n.type === 'paid' ? (
                                    <CheckCircle size={18} color="#22C55E" style={{ marginTop: '2px', flexShrink: 0 }} />
                                ) : (
                                    <AlertTriangle size={18} color="#F59E0B" style={{ marginTop: '2px', flexShrink: 0 }} />
                                )}

                                <div style={{ flex: 1, paddingRight: '20px' }}>
                                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937', marginBottom: '2px' }}>
                                        {n.type === 'paid' ? 'Payment Received' : 'New Booking Request'}
                                    </h4>
                                    <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: '1.4', marginBottom: '4px' }}>
                                        <strong>{n.name}</strong> - {n.category === 'Lodge' ? 'Lodge' : n.category} booking {n.type === 'pending' ? 'requested' : 'confirmed'}
                                        <br />
                                        <span style={{ color: '#6B7280' }}>Ref: {n.reference} • GH₵{Number(n.amount).toLocaleString()}</span>
                                    </p>
                                    <span style={{ fontSize: '11px', color: '#9CA3AF', fontWeight: '500' }}>
                                        {formatTimeAgo(n.createdAt)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Admin Activity - Online & Recent Logins */}
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>Admin Activity</h3>
                        <p style={{ fontSize: '13px', color: '#6B7280' }}>Online & recent logins</p>
                    </div>
                    <div style={{
                        padding: '6px 12px',
                        backgroundColor: onlineCount > 0 ? '#F0FDF4' : '#F3F4F6',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: onlineCount > 0 ? '#22C55E' : '#9CA3AF',
                            animation: onlineCount > 0 ? 'pulse 2s infinite' : 'none'
                        }}></div>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: onlineCount > 0 ? '#166534' : '#6B7280'
                        }}>
                            {onlineCount} Online
                        </span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>
                            Loading...
                        </div>
                    ) : admins.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#9CA3AF' }}>
                            <User size={32} color="#D1D5DB" style={{ marginBottom: '8px' }} />
                            <p style={{ fontSize: '14px' }}>No admin activity</p>
                        </div>
                    ) : (
                        admins.map((admin) => {
                            const colors = getAvatarColor(admin.name);
                            return (
                                <div
                                    key={admin.id}
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        alignItems: 'center',
                                        padding: '12px',
                                        borderRadius: '10px',
                                        backgroundColor: admin.isOnline ? '#F0FDF4' : '#F9FAFB',
                                        border: admin.isOnline ? '1px solid #BBF7D0' : '1px solid #F3F4F6',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {/* Avatar with initials and online indicator */}
                                    <div style={{ position: 'relative' }}>
                                        <div style={{
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            backgroundColor: colors.bg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '600',
                                            fontSize: '15px',
                                            color: colors.text
                                        }}>
                                            {getInitials(admin.name)}
                                        </div>
                                        {/* Online indicator dot */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '2px',
                                            right: '2px',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: admin.isOnline ? '#22C55E' : '#9CA3AF',
                                            border: '2px solid white'
                                        }}></div>
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#1F2937' }}>
                                                {admin.name}
                                            </p>
                                            {admin.isOnline && (
                                                <span style={{
                                                    fontSize: '10px',
                                                    fontWeight: '600',
                                                    color: '#059669',
                                                    backgroundColor: '#D1FAE5',
                                                    padding: '2px 8px',
                                                    borderRadius: '10px'
                                                }}>
                                                    ONLINE
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#6B7280' }}>{admin.email}</p>
                                    </div>

                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                            {admin.isOnline ? 'Active now' : formatTimeAgo(admin.lastActiveAt || admin.lastLoginAt)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            <style jsx>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}
