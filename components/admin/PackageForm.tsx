'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    Package,
    Upload,
    X,
    Check,
    Users,
    Clock,
    DollarSign,
    Image as ImageIcon,
    Plus,
    Trash2,
    Video,
    Link as LinkIcon,
    Youtube
} from 'lucide-react';

interface PackageFormProps {
    initialData?: any;
    packageType?: 'event' | 'special' | 'group_retreat';
}

export default function PackageForm({ initialData, packageType = 'event' }: PackageFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Initial State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: '',
        price: '',
        duration: '',
        mainImage: null as File | null,
        gallery: [] as File[],
        videos: [] as File[],
        features: [] as string[],
        suitability: [] as string[],
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        contactImage: null as File | null,
        addOns: [] as { name: string, price: string, unit: string }[]
    });

    // Existing Media State (for Edit Mode)
    const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
    const [existingContactImage, setExistingContactImage] = useState<string | null>(null);
    const [existingGallery, setExistingGallery] = useState<{ id: number, imagePath: string }[]>([]);
    const [existingVideos, setExistingVideos] = useState<{ id: number, videoPath: string }[]>([]);

    // Media to Delete (Ids)
    const [deletedGalleryIds, setDeletedGalleryIds] = useState<number[]>([]);
    const [deletedVideoIds, setDeletedVideoIds] = useState<number[]>([]);

    // Custom Input State
    const [newFeature, setNewFeature] = useState('');
    const [newSuitability, setNewSuitability] = useState('');

    // Video Input Mode (YouTube or File Upload)
    const [videoInputMode, setVideoInputMode] = useState<'youtube' | 'file'>('youtube');
    const [youtubeLinks, setYoutubeLinks] = useState<string[]>([]);
    const [newYoutubeLink, setNewYoutubeLink] = useState('');

    // Populate form if initialData provided
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                name: initialData.name || '',
                description: initialData.description || '',
                capacity: initialData.capacity || '',
                price: initialData.price || '',
                duration: initialData.duration || '',
                features: initialData.features?.map((a: any) => a.featureName) || [],
                suitability: initialData.suitability?.map((s: any) => s.eventType) || [],
                contactName: initialData.contactName || '',
                contactEmail: initialData.contactEmail || '',
                contactPhone: initialData.contactPhone || '',
                addOns: initialData.addOns ? initialData.addOns.map((a: any) => ({
                    name: a.name,
                    price: a.price,
                    unit: a.unit || 'Per Booking'
                })) : []
            }));

            setExistingMainImage(initialData.mainImagePath);
            setExistingContactImage(initialData.contactImage);
            setExistingGallery(initialData.galleryImages || []);
            setExistingVideos(initialData.videos || []);
        }
    }, [initialData]);

    const featureOptions = [
        'Buffet Service', 'Decoration', 'Photography', 'MC',
        'Sound System', 'Security', 'Live Streaming', 'Ushering',
        'Projector', 'Air Conditioning', 'Chairs & Tables', 'Cleanup'
    ];

    const suitabilityOptions = [
        'Wedding', 'Conference', 'Birthday',
        'Concert', 'Religious Service', 'Corporate Event', 'Graduation'
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery' | 'videos' | 'contact') => {
        if (e.target.files) {
            if (type === 'main') {
                setFormData(prev => ({ ...prev, mainImage: e.target.files![0] }));
            } else if (type === 'gallery') {
                setFormData(prev => ({ ...prev, gallery: [...prev.gallery, ...Array.from(e.target.files!)] }));
            } else if (type === 'videos') {
                setFormData(prev => ({ ...prev, videos: [...prev.videos, ...Array.from(e.target.files!)] }));
            } else if (type === 'contact') {
                setFormData(prev => ({ ...prev, contactImage: e.target.files![0] }));
            }
        }
    };

    const toggleSelection = (item: string, field: 'features' | 'suitability') => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(item)) {
                return { ...prev, [field]: list.filter(i => i !== item) };
            } else {
                return { ...prev, [field]: [...list, item] };
            }
        });
    };

    const handleAddCustom = (type: 'feature' | 'suitability') => {
        if (type === 'feature' && newFeature.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...prev.features, newFeature.trim()]
            }));
            setNewFeature('');
        } else if (type === 'suitability' && newSuitability.trim()) {
            setFormData(prev => ({
                ...prev,
                suitability: [...prev.suitability, newSuitability.trim()]
            }));
            setNewSuitability('');
        }
    };

    // Add-on Handlers
    const handleAddAddOn = () => {
        setFormData(prev => ({
            ...prev,
            addOns: [...prev.addOns, { name: '', price: '', unit: 'Per Booking' }]
        }));
    };

    const handleRemoveAddOn = (index: number) => {
        setFormData(prev => ({
            ...prev,
            addOns: prev.addOns.filter((_, i) => i !== index)
        }));
    };

    const handleAddOnChange = (index: number, field: 'name' | 'price' | 'unit', value: string) => {
        setFormData(prev => {
            const newAddOns = [...prev.addOns];
            newAddOns[index] = { ...newAddOns[index], [field]: value };
            return { ...prev, addOns: newAddOns };
        });
    };

    // YouTube Link Handlers
    const handleAddYoutubeLink = () => {
        if (newYoutubeLink.trim() && (newYoutubeLink.includes('youtube.com') || newYoutubeLink.includes('youtu.be'))) {
            setYoutubeLinks(prev => [...prev, newYoutubeLink.trim()]);
            setNewYoutubeLink('');
        } else if (newYoutubeLink.trim()) {
            alert('Please enter a valid YouTube URL');
        }
    };

    const handleRemoveYoutubeLink = (index: number) => {
        setYoutubeLinks(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSend = new FormData();

        // Basic Fields
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('capacity', formData.capacity);
        formDataToSend.append('price', formData.price);
        formDataToSend.append('duration', formData.duration);

        // Arrays
        formDataToSend.append('features', JSON.stringify(formData.features));
        formDataToSend.append('suitability', JSON.stringify(formData.suitability));
        formDataToSend.append('addOns', JSON.stringify(formData.addOns));
        formDataToSend.append('packageType', packageType); // Add package type

        // New Files
        if (formData.mainImage) formDataToSend.append('mainImage', formData.mainImage);
        if (formData.contactImage) formDataToSend.append('contactImage', formData.contactImage);

        // Contact Details
        formDataToSend.append('contactName', formData.contactName);
        formDataToSend.append('contactEmail', formData.contactEmail);
        formDataToSend.append('contactPhone', formData.contactPhone);

        formData.gallery.forEach(file => {
            formDataToSend.append('gallery', file);
        });

        formData.videos.forEach(file => {
            formDataToSend.append('videos', file);
        });

        // YouTube Links
        formDataToSend.append('youtubeLinks', JSON.stringify(youtubeLinks));

        // Edit Mode Specifics
        if (initialData) {
            formDataToSend.append('deletedGalleryIds', JSON.stringify(deletedGalleryIds));
            formDataToSend.append('deletedVideoIds', JSON.stringify(deletedVideoIds));
        }

        try {
            // Update endpoint to packages
            const url = initialData ? `/api/packages/${initialData.id}` : '/api/packages';
            const method = initialData ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save package');
            }

            alert('Package saved successfully!');

            if (initialData) {
                router.push('/admin/packages');
                router.refresh();
            } else {
                setFormData({
                    name: '',
                    description: '',
                    capacity: '',
                    price: '',
                    duration: '',
                    mainImage: null,
                    gallery: [],
                    videos: [],
                    features: [],
                    suitability: [],
                    contactName: '',
                    contactEmail: '',
                    contactPhone: '',
                    contactImage: null,
                    addOns: []
                });
                setNewFeature('');
                setNewSuitability('');
                setExistingMainImage(null);
                setExistingContactImage(null);
                setExistingGallery([]);
                setExistingVideos([]);

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error saving package:', error);
            alert('Failed to save package. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ margin: '0 auto', padding: '24px' }}>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gap: '32px',
                        maxWidth: '100%',
                        margin: '0 auto'
                    }}>

                        {/* Left Column - Main Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* 1. Basic Info */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Package size={20} className="text-gray-500" />
                                    Basic Information
                                </h2>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Package Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Gold Wedding Package"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Description</label>
                                        <textarea
                                            name="description"
                                            rows={6}
                                            placeholder="Describe what is included in the package..."
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB', resize: 'vertical' }}
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Capacity & Pricing */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Users size={20} className="text-gray-500" />
                                    Capacity & Pricing
                                </h2>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Capacity (Approx)</label>
                                        <div style={{ position: 'relative' }}>
                                            <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                            <input
                                                type="text"
                                                name="capacity"
                                                placeholder="e.g. Up to 200 Guests"
                                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                value={formData.capacity}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Amount</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontWeight: 'bold' }}>₵</span>
                                            <input
                                                type="text"
                                                name="price"
                                                placeholder="e.g. 5000.00"
                                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                value={formData.price}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Duration</label>
                                        <div style={{ position: 'relative' }}>
                                            <Clock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                            <input
                                                type="text"
                                                name="duration"
                                                placeholder="e.g. Per Event"
                                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Features & Suitability */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Check size={20} className="text-gray-500" />
                                    Features & Inclusion
                                </h2>

                                {/* Features */}
                                <div className="mb-6">
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Standard Features</label>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                        {[...featureOptions, ...formData.features.filter(a => !featureOptions.includes(a))].map(option => (
                                            <label key={option} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: formData.features.includes(option) ? '1px solid #3B82F6' : '1px solid #E5E7EB',
                                                backgroundColor: formData.features.includes(option) ? '#EFF6FF' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.features.includes(option)}
                                                    onChange={() => toggleSelection(option, 'features')}
                                                    style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
                                                />
                                                <span style={{ fontSize: '14px', color: '#374151' }}>{option}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Add Custom Feature Input */}
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '12px' }}>
                                        <input
                                            type="text"
                                            placeholder="Add custom feature..."
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom('feature'); } }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddCustom('feature')}
                                            style={{ padding: '8px 16px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Suitability */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Suitable For</label>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                        {[...suitabilityOptions, ...formData.suitability.filter(s => !suitabilityOptions.includes(s))].map(option => (
                                            <label key={option} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: formData.suitability.includes(option) ? '1px solid #10B981' : '1px solid #E5E7EB',
                                                backgroundColor: formData.suitability.includes(option) ? '#ECFDF5' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.suitability.includes(option)}
                                                    onChange={() => toggleSelection(option, 'suitability')}
                                                    style={{ width: '16px', height: '16px', accentColor: '#059669' }}
                                                />
                                                <span style={{ fontSize: '14px', color: '#374151' }}>{option}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Add Custom Suitability Input */}
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '12px' }}>
                                        <input
                                            type="text"
                                            placeholder="Add custom event type..."
                                            value={newSuitability}
                                            onChange={(e) => setNewSuitability(e.target.value)}
                                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom('suitability'); } }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddCustom('suitability')}
                                            style={{ padding: '8px 16px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* 3.5 Add-ons (Optional) */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Plus size={20} className="text-gray-500" />
                                    Add-ons (Optional)
                                </h2>

                                <div style={{ display: 'grid', gap: '12px' }}>
                                    {formData.addOns.map((addon, index) => (
                                        <div key={index} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                                            <input
                                                type="text"
                                                placeholder="Item Name (e.g. Extra Bed)"
                                                value={addon.name}
                                                onChange={(e) => handleAddOnChange(index, 'name', e.target.value)}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                            />
                                            <div style={{ position: 'relative' }}>
                                                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>₵</span>
                                                <input
                                                    type="text"
                                                    placeholder="Price"
                                                    value={addon.price}
                                                    onChange={(e) => handleAddOnChange(index, 'price', e.target.value)}
                                                    style={{ width: '100%', padding: '10px 10px 10px 25px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                />
                                            </div>
                                            <select
                                                value={addon.unit}
                                                onChange={(e) => handleAddOnChange(index, 'unit', e.target.value)}
                                                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                            >
                                                <option value="Per Booking">Per Booking</option>
                                                <option value="Per Hour">Per Hour</option>
                                                <option value="Per Day">Per Day</option>
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAddOn(index)}
                                                style={{ padding: '8px', color: '#EF4444', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleAddAddOn}
                                        style={{
                                            padding: '10px',
                                            border: '1px dashed #3B82F6',
                                            borderRadius: '8px',
                                            color: '#3B82F6',
                                            background: '#EFF6FF',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            marginTop: '8px'
                                        }}
                                    >
                                        + Add Item
                                    </button>
                                </div>
                            </div>

                            {/* 4. Coordinator Details */}
                            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Users size={20} style={{ color: '#6b7280' }} />
                                    Coordinator Details
                                </h2>
                                <div style={{ display: 'grid', gap: '20px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Contact Person Name</label>
                                        <input
                                            type="text"
                                            name="contactName"
                                            placeholder="e.g. Events Manager"
                                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                            value={formData.contactName || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Contact Email</label>
                                            <input
                                                type="email"
                                                name="contactEmail"
                                                placeholder="e.g. events@church.com"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                value={formData.contactEmail || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Contact Phone</label>
                                            <input
                                                type="text"
                                                name="contactPhone"
                                                placeholder="e.g. +233 55 123 4567"
                                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                value={formData.contactPhone || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Coordinator Image Upload */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Coordinator Image</label>
                                        <div style={{
                                            border: '2px dashed #D1D5DB',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            textAlign: 'center',
                                            backgroundColor: '#F9FAFB',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '16px'
                                        }}
                                            onClick={() => document.getElementById('contactImageInput')?.click()}
                                        >
                                            {(formData.contactImage || existingContactImage) ? (
                                                <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                                                    <img
                                                        src={formData.contactImage ? URL.createObjectURL(formData.contactImage) : existingContactImage || ''}
                                                        alt="Coordinator"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                                    />
                                                    {formData.contactImage && (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setFormData(prev => ({ ...prev, contactImage: null }));
                                                            }}
                                                            style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px', border: 'none' }}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <Upload size={20} style={{ color: '#9ca3af' }} />
                                                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Upload Picture (Max 5MB)</span>
                                                </div>
                                            )}
                                            <input
                                                id="contactImageInput"
                                                type="file"
                                                accept="image/*"
                                                hidden
                                                onChange={(e) => handleFileChange(e, 'contact')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        {/* Right Column - Media Uploads & Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                            {/* Main Image Upload */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ImageIcon size={18} className="text-gray-500" />
                                    Main Cover Image
                                </h2>

                                <div style={{
                                    border: '2px dashed #D1D5DB',
                                    borderRadius: '12px',
                                    padding: '32px 20px',
                                    textAlign: 'center',
                                    backgroundColor: '#F9FAFB',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                                    onClick={() => document.getElementById('mainImageInput')?.click()}
                                >
                                    {(formData.mainImage || existingMainImage) ? (
                                        <div style={{ position: 'relative' }}>
                                            <img
                                                src={formData.mainImage ? URL.createObjectURL(formData.mainImage) : existingMainImage || ''}
                                                alt="Preview"
                                                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                                            />
                                            {formData.mainImage && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setFormData(prev => ({ ...prev, mainImage: null }));
                                                    }}
                                                    style={{ position: 'absolute', top: '-10px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', padding: '4px' }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <Upload size={32} className="text-blue-500 mx-auto mb-3" style={{ margin: '0 auto 12px', color: '#3B82F6' }} />
                                            <p style={{ fontSize: '14px', color: '#4B5563', fontWeight: '500' }}>Click to upload main image</p>
                                            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>PNG, JPG up to 5MB</p>
                                        </>
                                    )}
                                    <input
                                        id="mainImageInput"
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => handleFileChange(e, 'main')}
                                    />
                                </div>
                            </div>

                            {/* Video Upload */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Video size={18} className="text-gray-500" />
                                    Package Videos
                                </h2>

                                {/* Tab Selector */}
                                <div style={{ display: 'flex', gap: '0', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E5E7EB' }}>
                                    <button
                                        type="button"
                                        onClick={() => setVideoInputMode('youtube')}
                                        style={{
                                            flex: 1,
                                            padding: '10px 16px',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            backgroundColor: videoInputMode === 'youtube' ? '#EF4444' : '#F9FAFB',
                                            color: videoInputMode === 'youtube' ? 'white' : '#4B5563',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Youtube size={16} />
                                        YouTube Link
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setVideoInputMode('file')}
                                        style={{
                                            flex: 1,
                                            padding: '10px 16px',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            backgroundColor: videoInputMode === 'file' ? '#3B82F6' : '#F9FAFB',
                                            color: videoInputMode === 'file' ? 'white' : '#4B5563',
                                            border: 'none',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Upload size={16} />
                                        Upload File
                                    </button>
                                </div>

                                {/* YouTube Link Input */}
                                {videoInputMode === 'youtube' && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <div style={{ flex: 1, position: 'relative' }}>
                                                <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                                <input
                                                    type="text"
                                                    placeholder="Paste YouTube URL here..."
                                                    value={newYoutubeLink}
                                                    onChange={(e) => setNewYoutubeLink(e.target.value)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddYoutubeLink(); } }}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px 10px 38px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #D1D5DB',
                                                        fontSize: '14px'
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleAddYoutubeLink}
                                                style={{
                                                    padding: '10px 16px',
                                                    backgroundColor: '#EF4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <Plus size={16} /> Add
                                            </button>
                                        </div>

                                        {/* YouTube Links List */}
                                        {youtubeLinks.length > 0 && (
                                            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                {youtubeLinks.map((link, index) => (
                                                    <div key={index} style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '8px',
                                                        padding: '8px 12px',
                                                        backgroundColor: '#FEE2E2',
                                                        borderRadius: '6px',
                                                        border: '1px solid #FECACA'
                                                    }}>
                                                        <Youtube size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
                                                        <span style={{ flex: 1, fontSize: '13px', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {link}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveYoutubeLink(index)}
                                                            style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '2px' }}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* File Upload */}
                                {videoInputMode === 'file' && (
                                    <div style={{
                                        border: '2px dashed #D1D5DB',
                                        borderRadius: '12px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        backgroundColor: '#F9FAFB',
                                        cursor: 'pointer',
                                        marginBottom: '16px'
                                    }}
                                        onClick={() => document.getElementById('videoInput')?.click()}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#4B5563' }}>
                                            <Upload size={18} />
                                            <span style={{ fontSize: '14px' }}>Click to upload video files</span>
                                        </div>
                                        <input
                                            id="videoInput"
                                            type="file"
                                            accept="video/*"
                                            multiple
                                            hidden
                                            onChange={(e) => handleFileChange(e, 'videos')}
                                        />
                                    </div>
                                )}

                                {/* Video Previews */}
                                {(existingVideos.length > 0 || formData.videos.length > 0) && (
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                                        {/* Existing Videos */}
                                        {existingVideos.map((vid) => (
                                            !deletedVideoIds.includes(vid.id) && (
                                                <div key={`existing-vid-${vid.id}`} style={{ position: 'relative', height: '100px', backgroundColor: '#000', borderRadius: '6px', overflow: 'hidden' }}>
                                                    <video
                                                        src={vid.videoPath}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        controls={false}
                                                        muted
                                                    />
                                                    <button type="button"
                                                        onClick={() => setDeletedVideoIds(prev => [...prev, vid.id])}
                                                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer', zIndex: 10 }}
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px' }}>
                                                        Saved Video
                                                    </div>
                                                </div>
                                            )
                                        ))}
                                        {/* New Videos */}
                                        {formData.videos.map((file, index) => (
                                            <div key={index} style={{ position: 'relative', height: '100px', backgroundColor: '#000', borderRadius: '6px', overflow: 'hidden' }}>
                                                <video
                                                    src={URL.createObjectURL(file)}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    controls={false}
                                                    muted
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) }))}
                                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer', zIndex: 10 }}
                                                >
                                                    <X size={14} />
                                                </button>
                                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(16, 185, 129, 0.8)', color: 'white', fontSize: '10px' }}>
                                                    New
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Add More Gallery Section */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100" style={{ borderColor: '#10B981', borderWidth: '1px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ImageIcon size={18} style={{ color: '#10B981' }} />
                                    Add More Gallery
                                    {(existingGallery.filter(img => !deletedGalleryIds.includes(img.id)).length + formData.gallery.length) > 0 && (
                                        <span style={{
                                            backgroundColor: '#10B981',
                                            color: 'white',
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            marginLeft: '6px'
                                        }}>
                                            {existingGallery.filter(img => !deletedGalleryIds.includes(img.id)).length + formData.gallery.length}
                                        </span>
                                    )}
                                </h2>

                                <div style={{
                                    border: '2px dashed #10B981',
                                    borderRadius: '12px',
                                    padding: '20px',
                                    textAlign: 'center',
                                    backgroundColor: '#ECFDF5',
                                    cursor: 'pointer',
                                    marginBottom: '16px',
                                    transition: 'all 0.2s'
                                }}
                                    onClick={() => document.getElementById('galleryInputMore')?.click()}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#059669' }}>
                                        <Plus size={18} />
                                        <span style={{ fontSize: '14px', fontWeight: '500' }}>Add Photos</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>Add more photos to the package gallery</p>
                                    <input
                                        id="galleryInputMore"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={(e) => handleFileChange(e, 'gallery')}
                                    />
                                </div>

                                {/* Gallery Preview Grid */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                                    {/* Existing Gallery Images */}
                                    {existingGallery.map((img) => (
                                        !deletedGalleryIds.includes(img.id) && (
                                            <div key={`existing-${img.id}`} style={{ position: 'relative', height: '80px', border: '2px solid #9CA3AF', borderRadius: '6px', overflow: 'hidden' }}>
                                                <img src={img.imagePath} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                <button type="button"
                                                    onClick={() => setDeletedGalleryIds(prev => [...prev, img.id])}
                                                    style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', borderRadius: '50%', padding: '2px', border: 'none', cursor: 'pointer' }}
                                                >
                                                    <X size={12} />
                                                </button>
                                                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2px 6px', background: 'rgba(107, 114, 128, 0.8)', color: 'white', fontSize: '9px', textAlign: 'center' }}>
                                                    Saved
                                                </div>
                                            </div>
                                        )
                                    ))}
                                    {/* New Gallery Preview */}
                                    {formData.gallery.map((file, index) => (
                                        <div key={index} style={{ position: 'relative', height: '80px', border: '2px solid #10B981', borderRadius: '6px', overflow: 'hidden' }}>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Gallery ${index}`}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))}
                                                style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', borderRadius: '50%', padding: '2px', border: 'none', cursor: 'pointer' }}
                                            >
                                                <X size={12} />
                                            </button>
                                            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '2px 6px', background: 'rgba(16, 185, 129, 0.8)', color: 'white', fontSize: '9px', textAlign: 'center' }}>
                                                New
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit Actions */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#111827',
                                        color: 'white',
                                        padding: '16px',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        border: 'none',
                                        cursor: isLoading ? 'not-allowed' : 'pointer',
                                        opacity: isLoading ? 0.8 : 1,
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {isLoading ? 'Processing...' : (
                                        <>
                                            <Package size={20} />
                                            {initialData ? 'Update Package' : 'Save & Publish Package'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'white',
                                        color: '#374151',
                                        padding: '14px',
                                        borderRadius: '12px',
                                        fontWeight: '600',
                                        fontSize: '15px',
                                        border: '1px solid #D1D5DB',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
