'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    Wind,
    Projector,
    Speaker,
    Wifi,
    Mic,
    Lightbulb,
    MoreHorizontal,
    Building2,
    Tv,
    Search,
    Filter,
    LayoutDashboard,
    Eye,
    Edit,
    Trash2,
    Image as ImageIcon,
    Clock,
    X
} from 'lucide-react';

export interface Facility {
    id: string;
    name: string;
    description?: string | null;
    status: 'Occupied' | 'Available' | 'Cleaning' | 'Maintenance';
    capacity: number | string;
    dailyRate: number;
    duration: string;
    hourlyRate?: number;
    mainImage?: string | null;
    amenities: { icon: string; label: string }[];
    suitability?: string[];
    galleryImages?: string[];
    videos?: string[];
    addOns?: { name: string; price: string; unit?: string }[];
}

interface HallGridProps {
    facilities: Facility[];
}

// ---------------------------
// 🧩 Helper: Icon Renderer
// ---------------------------
const renderIcon = (iconName: string, size = 14) => {
    switch (iconName) {
        case 'wind': return <Wind size={size} />;
        case 'projector': return <Projector size={size} />;
        case 'speaker': return <Speaker size={size} />;
        case 'wifi': return <Wifi size={size} />;
        case 'mic': return <Mic size={size} />;
        case 'lightbulb': return <Lightbulb size={size} />;
        case 'tv': return <Tv size={size} />;
        default: return <Wind size={size} />;
    }
};

const getStatusStyles = (status: string) => {
    switch (status) {
        case 'Occupied': return { bg: '#FEE2E2', text: '#EF4444' };
        case 'Available': return { bg: '#DCFCE7', text: '#10B981' };
        case 'Cleaning': return { bg: '#FEF3C7', text: '#F59E0B' };
        case 'Maintenance': return { bg: '#F3E8FF', text: '#A855F7' };
        default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
};

const getAmenityColor = (iconName: string) => {
    switch (iconName) {
        case 'wifi': return { bg: '#EFF6FF', text: '#3B82F6' }; // Blue
        case 'wind': return { bg: '#F0FDFA', text: '#0D9488' }; // Teal
        case 'projector': return { bg: '#F5F3FF', text: '#7C3AED' }; // Violet
        case 'speaker': return { bg: '#FFF1F2', text: '#E11D48' }; // Rose
        case 'mic': return { bg: '#FEF2F2', text: '#DC2626' }; // Red
        case 'lightbulb': return { bg: '#FFFBEB', text: '#D97706' }; // Amber
        case 'tv': return { bg: '#ECFEFF', text: '#0891B2' }; // Cyan
        default: return { bg: '#F9FAFB', text: '#4B5563' }; // Gray
    }
};

// ---------------------------
// 🕵️ Component: HallDetailsModal
// ---------------------------
const HallDetailsModal = ({ facility, onClose }: { facility: Facility | null; onClose: () => void }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (facility) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [facility, onClose]);

    if (!facility) return null;

    const formattedPrice = new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', minimumFractionDigits: 0 }).format(facility.dailyRate);

    // Helper for icons mapping (reused logic or simply map based on label)
    const getAmenityIconLocal = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('wifi')) return <Wifi size={16} />;
        if (lower.includes('sound')) return <Speaker size={16} />;
        if (lower.includes('projector')) return <Projector size={16} />;
        if (lower.includes('mic')) return <Mic size={16} />;
        if (lower.includes('light')) return <Lightbulb size={16} />;
        return <Wind size={16} />;
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px'
        }}>
            <div ref={modalRef} style={{
                backgroundColor: 'white',
                borderRadius: '24px',
                width: '100%', maxWidth: '1000px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                position: 'relative',
                display: 'flex', flexDirection: 'column'
            }}>
                {/* Close Button */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '16px', right: '16px', zIndex: 10,
                    background: 'white', borderRadius: '50%', padding: '8px',
                    border: '1px solid #E5E7EB', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <X size={20} color="#374151" />
                </button>

                {/* Hero Image */}
                <div style={{ height: '300px', minHeight: '300px', width: '100%', position: 'relative' }}>
                    <img
                        src={facility.mainImage || '/placeholder-hall.jpg'}
                        alt={facility.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                        display: 'flex', alignItems: 'flex-end', padding: '32px'
                    }}>
                        <div>
                            <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 800, margin: 0 }}>{facility.name}</h2>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', color: 'rgba(255,255,255,0.9)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                    <Users size={16} /> {facility.capacity} Guests
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                    <Clock size={16} /> {facility.duration}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                    GHS {facility.dailyRate.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                    {/* Left Col */}
                    <div>
                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>About this Hall</h3>
                            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4B5563' }}>
                                {facility.description || "No description provided."}
                            </p>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Features</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {facility.amenities.map((a, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '10px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB',
                                        fontSize: '14px', fontWeight: 500, color: '#374151'
                                    }}>
                                        {getAmenityIconLocal(a.label)} {a.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {facility.suitability && facility.suitability.length > 0 && (
                            <div style={{ marginBottom: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Suitable For</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {facility.suitability.map((s, i) => (
                                        <span key={i} style={{
                                            padding: '6px 14px', backgroundColor: '#ECFDF5', color: '#059669',
                                            borderRadius: '20px', fontSize: '13px', fontWeight: 600
                                        }}>
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {facility.addOns && facility.addOns.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Available Add-ons</h3>
                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {facility.addOns.map((addon, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB'
                                        }}>
                                            <div>
                                                <span style={{ fontWeight: 600, color: '#374151', display: 'block' }}>{addon.name}</span>
                                                {addon.unit && <span style={{ fontSize: '12px', color: '#6B7280' }}>{addon.unit}</span>}
                                            </div>
                                            <span style={{ fontWeight: 600, color: '#059669' }}>
                                                GHS {Number(addon.price).toLocaleString()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Col - Media */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Actions */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => router.push(`/admin/edit-hall/${facility.id}`)}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '10px',
                                    backgroundColor: '#111827', color: 'white', border: 'none',
                                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}>
                                <Edit size={16} /> Edit Hall
                            </button>
                        </div>

                        {/* Gallery */}
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Gallery</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {facility.galleryImages?.slice(0, 4).map((img, i) => (
                                    <div key={i} style={{ aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Videos */}
                        {facility.videos && facility.videos.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Video Tour</h3>
                                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', background: 'black' }}>
                                    <video src={facility.videos[0]} controls style={{ width: '100%', display: 'block', maxHeight: '200px' }} />
                                </div>
                                {facility.videos.length > 1 && <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>+ {facility.videos.length - 1} more video(s)</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ---------------------------
// 🃏 Component: FacilityCard
// ---------------------------
function HallCard({ facility, onView }: { facility: Facility; onView: () => void }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const statusStyle = getStatusStyles(facility.status);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this hall?')) return;
        setIsMenuOpen(false);
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/halls/${facility.id}`, { method: 'DELETE' });
            if (res.ok || res.status === 404) {
                router.refresh(); // Refresh server components to update list
                // If it was 404, it means it's already gone, so refreshing will remove it.
            } else {
                alert('Failed to delete hall.');
                setIsDeleting(false);
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting hall');
            setIsDeleting(false);
        }
    };

    if (isDeleting) return null; // Optimistic hide

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative' // For absolute positioning context
        }}>

            {/* 🖼️ Main Image Area */}
            <div style={{
                height: '220px',
                backgroundColor: '#F3F4F6',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: '16px', // Manually rounded
                borderTopRightRadius: '16px', // Manually rounded
                overflow: 'hidden' // Clip image content
            }}>
                {facility.mainImage && !imageError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={facility.mainImage.startsWith('http') || facility.mainImage.startsWith('/') ? facility.mainImage : `/${facility.mainImage}`}
                        alt={facility.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div style={{ color: '#9CA3AF', textAlign: 'center' }}>
                        <ImageIcon size={48} style={{ opacity: 0.5 }} />
                        <p style={{ fontSize: '12px', marginTop: '8px' }}>No Image</p>
                    </div>
                )}

                {/* Status Badge */}
                <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: statusStyle.text,
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusStyle.text }}></span>
                    {facility.status}
                </span>
            </div>

            {/* Card Content */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Header with Menu */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', position: 'relative' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, lineHeight: '1.4' }}>{facility.name}</h3>

                    {/* Action Menu Button */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={toggleMenu}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280', padding: '4px', borderRadius: '6px' }}
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {isMenuOpen && (
                            <div ref={menuRef} style={{
                                position: 'absolute',
                                top: '100%',
                                right: '0',
                                marginTop: '4px',
                                backgroundColor: 'white',
                                borderRadius: '8px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                border: '1px solid #E5E7EB',
                                zIndex: 100, // High z-index
                                minWidth: '140px',
                            }}>
                                <button
                                    onClick={() => router.push(`/hall_details/${facility.id}`)}
                                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '14px', color: '#374151', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={14} /> View
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/edit-hall/${facility.id}`)}
                                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '14px', color: '#374151', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Edit size={14} /> Edit
                                </button>
                                <div style={{ height: '1px', background: '#F3F4F6' }}></div>
                                <button onClick={handleDelete} style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '14px', color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Key Metrics */}
                {/* Key Metrics */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px',
                    marginBottom: '20px'
                }}>
                    {/* Capacity */}
                    <div style={{ padding: '8px', borderRadius: '8px', background: '#F0F9FF', border: '1px solid #E0F2FE' }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 4px 0', fontWeight: 600 }}>Capacity</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#0369A1', fontSize: '13px' }}>
                            <Users size={14} /> {facility.capacity}
                        </div>
                    </div>
                    {/* Amount */}
                    <div style={{ padding: '8px', borderRadius: '8px', background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 4px 0', fontWeight: 600 }}>Amount</p>
                        <div style={{ fontWeight: 700, color: '#059669', fontSize: '13px' }}>
                            GHS {facility.dailyRate.toLocaleString()}
                        </div>
                    </div>
                    {/* Duration */}
                    <div style={{ padding: '8px', borderRadius: '8px', background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 4px 0', fontWeight: 600 }}>Duration</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#C2410C', fontSize: '13px' }}>
                            <Clock size={14} /> {facility.duration}
                        </div>
                    </div>
                </div>

                {/* Amenities Chips */}
                <div style={{ marginBottom: '20px', flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {facility.amenities.slice(0, 4).map((item, i) => {
                            const style = getAmenityColor(item.icon);
                            return (
                                <div key={i} style={{
                                    backgroundColor: style.bg,
                                    border: '1px solid',
                                    borderColor: 'transparent',
                                    color: style.text,
                                    padding: '6px 10px',
                                    borderRadius: '20px', // Pill shape
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    {renderIcon(item.icon, 14)}
                                    {item.label}
                                </div>
                            );
                        })}
                        {facility.amenities.length > 4 && (
                            <span style={{ fontSize: '11px', color: '#94A3B8', alignSelf: 'center', fontWeight: 500 }}>+{facility.amenities.length - 4} more</span>
                        )}
                    </div>
                </div>

                {/* Footer Link */}
                <div style={{ paddingTop: '16px', marginTop: 'auto', display: 'flex', justifyContent: 'center' }}>
                    <button style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: 600,
                        color: '#374151',
                        backgroundColor: '#F3F4F6',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                    }}
                        onClick={onView}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#E5E7EB'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#F3F4F6'}
                    >
                        View Full Details
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------
// 📄 Component: FacilityGrid (Main)
// ---------------------------
export default function HallGrid({ facilities }: HallGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [selectedHall, setSelectedHall] = useState<Facility | null>(null);

    // Filter Logic
    const filteredFacilities = useMemo(() => {
        return facilities.filter(f => {
            const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [facilities, searchQuery, statusFilter]);

    // Stats Logic
    const stats = useMemo(() => {
        const totalCapacity = facilities.reduce((acc, curr) => {
            const cap = typeof curr.capacity === 'number' ? curr.capacity : parseInt(curr.capacity.toString()) || 0;
            return acc + cap;
        }, 0);
        const avgRate = facilities.length > 0
            ? facilities.reduce((acc, curr) => acc + curr.dailyRate, 0) / facilities.length
            : 0;

        return {
            totalHalls: facilities.length,
            totalCapacity,
            avgRate
        };
    }, [facilities]);

    return (
        <div style={{ fontFamily: 'Inter, sans-serif' }}>

            {/* 📊 Stats Overview */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
            }}>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: '#EFF6FF', color: '#3B82F6' }}><Building2 size={20} /></div>
                        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Total Halls</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{stats.totalHalls}</div>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: '#ECFDF5', color: '#10B981' }}><Users size={20} /></div>
                        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Total Capacity</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{stats.totalCapacity.toLocaleString()} <span style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 400 }}>seats</span></div>
                </div>
                <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', background: '#FFF7ED', color: '#F97316' }}><LayoutDashboard size={20} /></div>
                        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Avg Amount</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>GHS {Math.round(stats.avgRate).toLocaleString()}</div>
                </div>
            </div>

            {/* 🔍 Controls Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Search halls..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '10px 10px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid #D1D5DB',
                                fontSize: '14px',
                                width: '280px',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                padding: '10px 32px 10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #D1D5DB',
                                fontSize: '14px',
                                outline: 'none',
                                cursor: 'pointer',
                                backgroundColor: 'white',
                                appearance: 'none'
                            }}
                        >
                            <option value="All">All Status</option>
                            <option value="Available">Available</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                        <Filter size={16} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#6B7280', pointerEvents: 'none' }} />
                    </div>
                </div>


            </div>

            {/* Empty State */}
            {filteredFacilities.length === 0 && (
                <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B7280' }}>
                    <div style={{ background: '#F3F4F6', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Search size={32} color="#9CA3AF" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>No halls found</h3>
                    <p>Try adjusting your search terms or filters.</p>
                </div>
            )}

            {/* 🏗️ Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '24px'
            }}>
                {filteredFacilities.map((facility) => (
                    <HallCard key={facility.id} facility={facility} onView={() => setSelectedHall(facility)} />
                ))}
            </div>

            {/* Modal */}
            <HallDetailsModal facility={selectedHall} onClose={() => setSelectedHall(null)} />
        </div>
    );
}
