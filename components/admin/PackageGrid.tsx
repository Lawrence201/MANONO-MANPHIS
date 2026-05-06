'use client';
import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    Users,
    Wind,
    Projector,
    Speaker,
    Wifi,
    Mic,
    Lightbulb,
    MoreHorizontal,
    Package,
    Tv,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Image as ImageIcon,
    Clock,
    X,
    Camera,
    Music,
    ShieldCheck,
    Utensils,
    MonitorPlay
} from 'lucide-react';

export interface PackageData {
    id: string;
    name: string;
    description?: string | null;
    capacity: string; // Keep as string "Up to X"
    price: string;
    duration: string;
    mainImagePath?: string | null;
    features: { icon: string; label: string }[];
    suitability?: string[];
    galleryImages?: string[];
    videos?: string[];
    addOns?: { name: string; price: string; unit: string }[];
}

interface PackageGridProps {
    packages: PackageData[];
}

// ---------------------------
// 🧩 Helper: Icon Renderer
// ---------------------------
const renderIcon = (iconName: string, size = 14) => {
    const lower = iconName.toLowerCase();
    if (lower.includes('photo') || lower.includes('camera')) return <Camera size={size} />;
    if (lower.includes('music') || lower.includes('dj') || lower.includes('sound')) return <Music size={size} />;
    if (lower.includes('projector')) return <Projector size={size} />;
    if (lower.includes('mic')) return <Mic size={size} />;
    if (lower.includes('food') || lower.includes('buffet') || lower.includes('catering')) return <Utensils size={size} />;
    if (lower.includes('security')) return <ShieldCheck size={size} />;
    if (lower.includes('stream') || lower.includes('video')) return <MonitorPlay size={size} />;
    if (lower.includes('wifi')) return <Wifi size={size} />;
    if (lower.includes('light')) return <Lightbulb size={size} />;
    if (lower.includes('ac') || lower.includes('air')) return <Wind size={size} />;
    if (lower.includes('speaker')) return <Speaker size={size} />;

    return <Package size={size} />;
};

const getFeatureColor = (iconName: string) => {
    const lower = iconName.toLowerCase();
    if (lower.includes('photo')) return { bg: '#EFF6FF', text: '#3B82F6' };
    if (lower.includes('music')) return { bg: '#FDF2F8', text: '#DB2777' };
    if (lower.includes('food')) return { bg: '#FFFBEB', text: '#D97706' };
    if (lower.includes('security')) return { bg: '#FFF1F2', text: '#E11D48' };
    if (lower.includes('stream')) return { bg: '#F5F3FF', text: '#7C3AED' };

    return { bg: '#F9FAFB', text: '#4B5563' };
};

// ---------------------------
// 🕵️ Component: PackageDetailsModal
// ---------------------------
const PackageDetailsModal = ({ pkg, onClose }: { pkg: PackageData | null; onClose: () => void }) => {
    const modalRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (pkg) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [pkg, onClose]);

    if (!pkg) return null;

    const displayPrice = pkg.price ? `GHS ${pkg.price}` : 'N/A';

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
                        src={pkg.mainImagePath || '/placeholder-package.jpg'}
                        alt={pkg.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                        display: 'flex', alignItems: 'flex-end', padding: '32px'
                    }}>
                        <div>
                            <h2 style={{ color: 'white', fontSize: '32px', fontWeight: 800, margin: 0 }}>{pkg.name}</h2>
                            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', color: 'rgba(255,255,255,0.9)' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                    <Users size={16} /> {pkg.capacity}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                    <Clock size={16} /> {pkg.duration}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                                    {displayPrice}
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
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Description</h3>
                            <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#4B5563' }}>
                                {pkg.description || "No description provided."}
                            </p>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Features & Inclusions</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {pkg.features.map((f, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        padding: '10px 16px', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px solid #E5E7EB',
                                        fontSize: '14px', fontWeight: 500, color: '#374151'
                                    }}>
                                        {renderIcon(f.label)} {f.label}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {pkg.suitability && pkg.suitability.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Suitable For</h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {pkg.suitability.map((s, i) => (
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

                        {pkg.addOns && pkg.addOns.length > 0 && (
                            <div style={{ marginTop: '32px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Available Add-ons</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                                    {pkg.addOns.map((addon, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '12px 16px', backgroundColor: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0'
                                        }}>
                                            <span style={{ fontWeight: 600, color: '#334155' }}>{addon.name}</span>
                                            <span style={{ fontSize: '13px', color: '#64748b' }}>
                                                ₵{parseFloat(addon.price).toLocaleString()} <span style={{ fontSize: '11px', opacity: 0.8 }}>/ {addon.unit || 'Item'}</span>
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
                                onClick={() => router.push(`/admin/edit-package/${pkg.id}`)}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '10px',
                                    backgroundColor: '#111827', color: 'white', border: 'none',
                                    fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}>
                                <Edit size={16} /> Edit Package
                            </button>
                        </div>

                        {/* Gallery */}
                        <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Gallery</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {pkg.galleryImages?.slice(0, 4).map((img, i) => (
                                    <div key={i} style={{ aspectRatio: '1/1', borderRadius: '8px', overflow: 'hidden' }}>
                                        <img src={img} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Videos */}
                        {pkg.videos && pkg.videos.length > 0 && (
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>Video Preview</h3>
                                <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB', background: 'black' }}>
                                    <video src={pkg.videos[0]} controls style={{ width: '100%', display: 'block', maxHeight: '200px' }} />
                                </div>
                                {pkg.videos.length > 1 && <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>+ {pkg.videos.length - 1} more video(s)</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ---------------------------
// 🃏 Component: PackageCard
// ---------------------------
function PackageCard({ pkg, onView }: { pkg: PackageData; onView: () => void }) {
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
        if (!confirm('Are you sure you want to delete this package?')) return;
        setIsMenuOpen(false);
        setIsDeleting(true);

        try {
            const res = await fetch(`/api/packages/${pkg.id}`, { method: 'DELETE' });
            if (res.ok || res.status === 404) {
                router.refresh();
            } else {
                alert('Failed to delete package.');
                setIsDeleting(false);
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting package');
            setIsDeleting(false);
        }
    };

    if (isDeleting) return null;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            transition: 'all 0.3s ease',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative'
        }}>

            {/* 🖼️ Main Image Area */}
            <div style={{
                height: '220px',
                backgroundColor: '#F3F4F6',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                overflow: 'hidden'
            }}>
                {pkg.mainImagePath && !imageError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={pkg.mainImagePath.startsWith('http') || pkg.mainImagePath.startsWith('/') ? pkg.mainImagePath : `/${pkg.mainImagePath}`}
                        alt={pkg.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div style={{ color: '#9CA3AF', textAlign: 'center' }}>
                        <ImageIcon size={48} style={{ opacity: 0.5 }} />
                        <p style={{ fontSize: '12px', marginTop: '8px' }}>No Image</p>
                    </div>
                )}
            </div>

            {/* Card Content */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

                {/* Header with Menu */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', position: 'relative' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0, lineHeight: '1.4' }}>{pkg.name}</h3>

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
                                zIndex: 100,
                                minWidth: '140px',
                            }}>
                                <button
                                    onClick={onView}
                                    style={{ width: '100%', textAlign: 'left', padding: '10px 16px', fontSize: '14px', color: '#374151', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Eye size={14} /> View
                                </button>
                                <button
                                    onClick={() => router.push(`/admin/edit-package/${pkg.id}`)}
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
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px',
                    marginBottom: '20px'
                }}>
                    {/* Capacity */}
                    <div style={{ padding: '8px', borderRadius: '8px', background: '#F0F9FF', border: '1px solid #E0F2FE' }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 4px 0', fontWeight: 600 }}>Guests</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#0369A1', fontSize: '13px' }}>
                            <Users size={14} /> {pkg.capacity}
                        </div>
                    </div>
                    {/* Amount */}
                    <div style={{ padding: '8px', borderRadius: '8px', background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 4px 0', fontWeight: 600 }}>Price</p>
                        <div style={{ fontWeight: 700, color: '#059669', fontSize: '13px' }}>
                            {pkg.price ? `GHS ${pkg.price}` : 'N/A'}
                        </div>
                    </div>
                    {/* Duration */}
                    <div style={{ padding: '8px', borderRadius: '8px', background: '#FFF7ED', border: '1px solid #FFEDD5' }}>
                        <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#64748B', margin: '0 0 4px 0', fontWeight: 600 }}>Duration</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#C2410C', fontSize: '13px' }}>
                            <Clock size={14} /> {pkg.duration}
                        </div>
                    </div>
                </div>

                {/* Features Chips */}
                <div style={{ marginBottom: '20px', flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {pkg.features.slice(0, 4).map((item, i) => {
                            const style = getFeatureColor(item.label);
                            return (
                                <div key={i} style={{
                                    backgroundColor: style.bg,
                                    border: '1px solid',
                                    borderColor: 'transparent',
                                    color: style.text,
                                    padding: '6px 10px',
                                    borderRadius: '20px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}>
                                    {renderIcon(item.label, 14)}
                                    {item.label}
                                </div>
                            );
                        })}
                        {pkg.features.length > 4 && (
                            <span style={{ fontSize: '11px', color: '#94A3B8', alignSelf: 'center', fontWeight: 500 }}>+{pkg.features.length - 4} more</span>
                        )}
                    </div>
                </div>

                {/* Footer View Link */}
                <div style={{ paddingTop: '16px', marginTop: 'auto' }}>
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
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------
// 📄 Component: PackageGrid (Main)
// ---------------------------
export default function PackageGrid({ packages }: PackageGridProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);

    // Filter Logic
    const filteredPackages = useMemo(() => {
        return packages.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesSearch;
        });
    }, [packages, searchQuery]);

    // Stats Logic
    const stats = useMemo(() => {
        return {
            totalPackages: packages.length,
        };
    }, [packages]);

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
                        <div style={{ padding: '8px', borderRadius: '8px', background: '#EFF6FF', color: '#3B82F6' }}><Package size={20} /></div>
                        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>Total Packages</span>
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>{stats.totalPackages}</div>
                </div>
            </div>

            {/* 🔍 Controls Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input
                            type="text"
                            placeholder="Search packages..."
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
                </div>
            </div>

            {/* Empty State */}
            {filteredPackages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '64px 0', color: '#6B7280' }}>
                    <div style={{ background: '#F3F4F6', borderRadius: '50%', width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Search size={32} color="#9CA3AF" />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#111827' }}>No packages found</h3>
                    <p>Try adjusting your search terms.</p>
                </div>
            )}

            {/* 🏗️ Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '24px'
            }}>
                {filteredPackages.map((pkg) => (
                    <PackageCard key={pkg.id} pkg={pkg} onView={() => setSelectedPackage(pkg)} />
                ))}
            </div>

            {/* Modal */}
            <PackageDetailsModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
        </div>
    );
}
