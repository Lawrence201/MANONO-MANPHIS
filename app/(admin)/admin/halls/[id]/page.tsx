import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
    MapPin,
    Users,
    Clock,
    DollarSign,
    Check,
    Calendar,
    ArrowLeft,
    Edit,
    Trash2,
    Share2,
    Utensils,
    Wifi,
    Music,
    Monitor
} from 'lucide-react';
import { revalidatePath } from 'next/cache';

// Helper for Amenity Icons
const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return <Wifi size={18} />;
    if (lower.includes('sound')) return <Music size={18} />;
    if (lower.includes('projector') || lower.includes('screen')) return <Monitor size={18} />;
    if (lower.includes('kitchen') || lower.includes('catering')) return <Utensils size={18} />;
    return <Check size={18} />;
};

export default async function HallDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if (!id) return notFound();

    const hall = await prisma.hall.findUnique({
        where: { id: parseInt(id) },
        include: {
            amenities: true,
            suitability: true,
            galleryImages: true,
            videos: true
        }
    });

    if (!hall) return notFound();

    // Format Price
    const formattedPrice = new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 0
    }).format(parseFloat(hall.price.replace(/,/g, '')));

    return (
        <div style={{ padding: '24px 32px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>

            {/* Header / Nav */}
            <div style={{ marginBottom: '24px' }}>
                <Link href="/halls" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#6B7280', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>
                    <ArrowLeft size={16} />
                    Back to Halls
                </Link>
            </div>

            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '400px',
                borderRadius: '24px',
                overflow: 'hidden',
                marginBottom: '32px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
                <img
                    src={hall.mainImagePath || '/placeholder-hall.jpg'}
                    alt={hall.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '40px'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <div>
                            <h1 style={{ color: 'white', fontSize: '42px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-0.02em' }}>{hall.name}</h1>
                            <div style={{ display: 'flex', gap: '24px', color: 'rgba(255,255,255,0.9)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ padding: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}><Users size={16} color="white" /></div>
                                    <span style={{ fontWeight: 600 }}>{hall.capacity} Guests</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ padding: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}><Clock size={16} color="white" /></div>
                                    <span style={{ fontWeight: 600 }}>{hall.duration}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ padding: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}><DollarSign size={16} color="white" /></div>
                                    <span style={{ fontWeight: 600 }}>{formattedPrice}</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <a href={`/edit-hall/${hall.id}`} style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 20px', backgroundColor: 'white', color: '#111827',
                                borderRadius: '12px', fontWeight: 600, textDecoration: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                <Edit size={18} />
                                Edit Hall
                            </a>
                            {/* Delete could be handled here or kept to the grid for safety, adding here requires client interaction or a form submission */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>

                {/* Left Column */}
                <div>
                    {/* Description */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            About this Hall
                        </h2>
                        <p style={{ fontSize: '16px', lineHeight: '1.7', color: '#4B5563' }}>
                            {hall.description || "No description provided."}
                        </p>
                    </div>

                    {/* Amenities */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
                            Features & Amenities
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                            {hall.amenities.map(amenity => (
                                <div key={amenity.id} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '16px', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px solid #F3F4F6'
                                }}>
                                    <div style={{ color: '#3B82F6' }}>
                                        {getAmenityIcon(amenity.amenityName)}
                                    </div>
                                    <span style={{ color: '#374151', fontWeight: 500 }}>{amenity.amenityName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Suitability */}
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '20px' }}>
                            Perfect For
                        </h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {hall.suitability.map(event => (
                                <span key={event.id} style={{
                                    padding: '10px 20px', backgroundColor: '#ECFDF5', color: '#059669',
                                    borderRadius: '100px', fontWeight: 600, fontSize: '14px', border: '1px solid #D1FAE5'
                                }}>
                                    {event.eventType}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Media */}
                <div>
                    {/* Gallery Preview */}
                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Photo Gallery</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {hall.galleryImages.map((img, index) => (
                                <div key={img.id} style={{
                                    position: 'relative', aspectRatio: '1/1', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                                    border: '1px solid #E5E7EB'
                                }}>
                                    <img
                                        src={img.imagePath}
                                        alt={`Gallery ${index}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                                    />
                                </div>
                            ))}
                            {hall.galleryImages.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No additional photos.</p>}
                        </div>
                    </div>

                    {/* Videos */}
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>Video Tours</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {hall.videos.map((vid, index) => (
                                <div key={vid.id} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E7EB', backgroundColor: 'black' }}>
                                    <video
                                        src={vid.videoPath}
                                        controls
                                        style={{ width: '100%', display: 'block' }}
                                    />
                                </div>
                            ))}
                            {hall.videos.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '14px' }}>No videos available.</p>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
