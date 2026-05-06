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

interface HallFormProps {
    initialData?: any; // We can refine this type later if needed
}

export default function HallForm({ initialData }: HallFormProps) {
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
        youtubeLinks: [] as string[],
        amenities: [] as string[],
        suitableFor: [] as string[],
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        contactImage: null as File | null,
        addOns: [] as { name: string, price: string, unit: string }[],
        plans: [] as { name: string, description: string, price: string, validity: string, features: string[] }[]
    });

    // Existing Media State (for Edit Mode)
    const [existingMainImage, setExistingMainImage] = useState<string | null>(null);
    const [existingContactImage, setExistingContactImage] = useState<string | null>(null);
    const [existingGallery, setExistingGallery] = useState<{ id: number, imagePath: string }[]>([]);
    const [existingVideos, setExistingVideos] = useState<{ id: number, videoPath: string, videoType?: string }[]>([]);

    // Media to Delete (Ids)
    const [deletedGalleryIds, setDeletedGalleryIds] = useState<number[]>([]);
    const [deletedVideoIds, setDeletedVideoIds] = useState<number[]>([]);

    // Custom Input State
    const [newAmenity, setNewAmenity] = useState('');
    const [newSuitability, setNewSuitability] = useState('');

    // Video Input State
    const [videoInputMode, setVideoInputMode] = useState<'upload' | 'youtube'>('youtube');
    const [newYoutubeUrl, setNewYoutubeUrl] = useState('');

    // Populate form if initialData provided
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                name: initialData.name || '',
                description: initialData.description || '',
                capacity: initialData.capacity || '',
                price: initialData.price || '', // Note: DB field might be 'price' or 'dailyRate', check backend mapping
                duration: initialData.duration || '',
                amenities: initialData.amenities?.map((a: any) => a.amenityName) || [],
                suitableFor: initialData.suitability?.map((s: any) => s.eventType) || [],
                contactName: initialData.contactName || '',
                contactEmail: initialData.contactEmail || '',
                contactPhone: initialData.contactPhone || '',
                addOns: initialData.addOns ? initialData.addOns.map((a: any) => ({
                    name: a.name,
                    price: a.price,
                    unit: a.unit || 'Per Booking'
                })) : [],
                plans: initialData.plans ? initialData.plans.map((p: any) => ({
                    name: p.name,
                    description: p.description || '',
                    price: p.price,
                    validity: p.validity || '',
                    features: p.features ? p.features.map((f: any) => f.featureText) : []
                })) : []
            }));

            setExistingMainImage(initialData.mainImagePath);
            setExistingContactImage(initialData.contactImage);
            setExistingGallery(initialData.galleryImages || []);
            setExistingVideos(initialData.videos || []);
        }
    }, [initialData]);

    const amenitiesOptions = [
        'Air Conditioning', 'WiFi', 'Projector', 'Sound System',
        'Whiteboard', 'Microphone', 'Stage', 'Podium',
        'Kitchenette', 'Restrooms', 'Parking', 'Wheelchair Access'
    ];

    const suitabilityOptions = [
        'Wedding Receptions', 'Corporate Conferences', 'Church Services',
        'Birthday Parties', 'Workshops', 'Concerts',
        'Youth Programs', 'Executive Meetings'
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

    const toggleSelection = (item: string, field: 'amenities' | 'suitableFor') => {
        setFormData(prev => {
            const list = prev[field];
            if (list.includes(item)) {
                return { ...prev, [field]: list.filter(i => i !== item) };
            } else {
                return { ...prev, [field]: [...list, item] };
            }
        });
    };

    const handleAddCustom = (type: 'amenity' | 'suitability') => {
        if (type === 'amenity' && newAmenity.trim()) {
            setFormData(prev => ({
                ...prev,
                amenities: [...prev.amenities, newAmenity.trim()]
            }));
            setNewAmenity('');
        } else if (type === 'suitability' && newSuitability.trim()) {
            setFormData(prev => ({
                ...prev,
                suitableFor: [...prev.suitableFor, newSuitability.trim()]
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

    // Plan Handlers
    const handleAddPlan = () => {
        setFormData(prev => ({
            ...prev,
            plans: [...prev.plans, { name: '', description: '', price: '', validity: '', features: [] }]
        }));
    };

    const handleRemovePlan = (index: number) => {
        setFormData(prev => ({
            ...prev,
            plans: prev.plans.filter((_, i) => i !== index)
        }));
    };

    const handlePlanChange = (index: number, field: 'name' | 'description' | 'price' | 'validity', value: string) => {
        setFormData(prev => {
            const newPlans = [...prev.plans];
            newPlans[index] = { ...newPlans[index], [field]: value };
            return { ...prev, plans: newPlans };
        });
    };

    const handleAddPlanFeature = (planIndex: number, feature: string) => {
        if (!feature.trim()) return;
        setFormData(prev => {
            const newPlans = [...prev.plans];
            newPlans[planIndex] = {
                ...newPlans[planIndex],
                features: [...newPlans[planIndex].features, feature.trim()]
            };
            return { ...prev, plans: newPlans };
        });
    };

    const handleRemovePlanFeature = (planIndex: number, featureIndex: number) => {
        setFormData(prev => {
            const newPlans = [...prev.plans];
            newPlans[planIndex] = {
                ...newPlans[planIndex],
                features: newPlans[planIndex].features.filter((_, i) => i !== featureIndex)
            };
            return { ...prev, plans: newPlans };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const formDataToSend = new FormData();

        // Basic Fields
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('capacity', formData.capacity);
        formDataToSend.append('price', formData.price); // Maps to 'amount' in backend currently based on previous edits
        formDataToSend.append('duration', formData.duration);

        // Arrays
        formDataToSend.append('amenities', JSON.stringify(formData.amenities));
        formDataToSend.append('suitableFor', JSON.stringify(formData.suitableFor));
        formDataToSend.append('addOns', JSON.stringify(formData.addOns));
        formDataToSend.append('plans', JSON.stringify(formData.plans));


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
        formDataToSend.append('youtubeLinks', JSON.stringify(formData.youtubeLinks));

        // Edit Mode Specifics
        if (initialData) {
            formDataToSend.append('deletedGalleryIds', JSON.stringify(deletedGalleryIds));
            formDataToSend.append('deletedVideoIds', JSON.stringify(deletedVideoIds));
        }

        try {
            const url = initialData ? `/api/halls/${initialData.id}` : '/api/halls';
            const method = initialData ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                // Content-Type header MUST be undefined so browser sets boundary for multipart/form-data
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to save hall');
            }

            alert('Hall saved successfully!');

            if (initialData) {
                // Edit Mode: Redirect
                router.push('/admin/halls');
                router.refresh();
            } else {
                // Add Mode: Clear form
                setFormData({
                    name: '',
                    description: '',
                    capacity: '',
                    price: '',
                    duration: '',
                    mainImage: null,
                    gallery: [],
                    videos: [],
                    youtubeLinks: [],
                    amenities: [],
                    suitableFor: [],
                    contactName: '',
                    contactEmail: '',
                    contactPhone: '',

                    contactImage: null,
                    addOns: [],
                    plans: []
                });
                setNewAmenity('');
                setNewSuitability('');
                setNewYoutubeUrl('');
                setExistingMainImage(null);
                setExistingContactImage(null);
                setExistingGallery([]);
                setExistingVideos([]);

                // Optional: Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error saving hall:', error);
            alert('Failed to save hall. Please try again.');
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
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Hall Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="e.g. Grand Conference Hall"
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
                                            placeholder="Describe the hall features and atmosphere..."
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
                                        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>Capacity (Guests)</label>
                                        <div style={{ position: 'relative' }}>
                                            <Users size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                            <input
                                                type="text"
                                                name="capacity"
                                                placeholder="e.g. 400 Guests"
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
                                                placeholder="e.g. 8,000"
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
                                                placeholder="e.g. 8 Hours"
                                                style={{ width: '100%', padding: '12px 12px 12px 40px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 3. Amenities & Features (Includes Suitability) */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Check size={20} className="text-gray-500" />
                                    Amenities & Features
                                </h2>

                                {/* Amenities */}
                                <div className="mb-6">
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Standard Amenities</label>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                        {[...amenitiesOptions, ...formData.amenities.filter(a => !amenitiesOptions.includes(a))].map(option => (
                                            <label key={option} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: formData.amenities.includes(option) ? '1px solid #3B82F6' : '1px solid #E5E7EB',
                                                backgroundColor: formData.amenities.includes(option) ? '#EFF6FF' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.amenities.includes(option)}
                                                    onChange={() => toggleSelection(option, 'amenities')}
                                                    style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
                                                />
                                                <span style={{ fontSize: '14px', color: '#374151' }}>{option}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* Add Custom Amenity Input */}
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px', marginBottom: '12px' }}>
                                        <input
                                            type="text"
                                            placeholder="Add custom amenity..."
                                            value={newAmenity}
                                            onChange={(e) => setNewAmenity(e.target.value)}
                                            style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom('amenity'); } }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleAddCustom('amenity')}
                                            style={{ padding: '8px 16px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Suitability */}
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px' }}>Suitable For</label>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                        {[...suitabilityOptions, ...formData.suitableFor.filter(s => !suitabilityOptions.includes(s))].map(option => (
                                            <label key={option} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px',
                                                borderRadius: '8px',
                                                border: formData.suitableFor.includes(option) ? '1px solid #10B981' : '1px solid #E5E7EB',
                                                backgroundColor: formData.suitableFor.includes(option) ? '#ECFDF5' : 'white',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s'
                                            }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.suitableFor.includes(option)}
                                                    onChange={() => toggleSelection(option, 'suitableFor')}
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
                                                placeholder="Item Name (e.g. Drum Set)"
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

                            {/* 3.6 Explore Plans (NEW) */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Package size={20} className="text-gray-500" />
                                    Explore Plans (Pricing Tiers)
                                </h2>

                                <div style={{ display: 'grid', gap: '20px' }}>
                                    {formData.plans.map((plan, planIndex) => (
                                        <div key={planIndex} style={{
                                            border: '1px solid #E5E7EB',
                                            borderRadius: '12px',
                                            padding: '20px',
                                            position: 'relative',
                                            backgroundColor: '#FAFAFA'
                                        }}>
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePlan(planIndex)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    padding: '4px',
                                                    color: '#EF4444',
                                                    background: 'white',
                                                    border: '1px solid #FCA5A5',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Plan Name*</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Smart, Value, Partner"
                                                        value={plan.name}
                                                        onChange={(e) => handlePlanChange(planIndex, 'name', e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Price*</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. GHS 28,800"
                                                        value={plan.price}
                                                        onChange={(e) => handlePlanChange(planIndex, 'price', e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Description</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Entry level package for essential events"
                                                        value={plan.description}
                                                        onChange={(e) => handlePlanChange(planIndex, 'description', e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Validity</label>
                                                    <input
                                                        type="text"
                                                        placeholder="e.g. Valid for 3 months"
                                                        value={plan.validity}
                                                        onChange={(e) => handlePlanChange(planIndex, 'validity', e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #D1D5DB' }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Plan Features */}
                                            <div>
                                                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Features</label>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                                                    {plan.features.map((feature, featureIndex) => (
                                                        <div key={featureIndex} style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            padding: '6px 10px',
                                                            backgroundColor: '#EFF6FF',
                                                            border: '1px solid #BFDBFE',
                                                            borderRadius: '20px',
                                                            fontSize: '13px',
                                                            color: '#1E40AF'
                                                        }}>
                                                            <span>{feature}</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemovePlanFeature(planIndex, featureIndex)}
                                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: '#3B82F6' }}
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <input
                                                        type="text"
                                                        placeholder="Add a feature..."
                                                        id={`plan-feature-${planIndex}`}
                                                        style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                const input = e.target as HTMLInputElement;
                                                                handleAddPlanFeature(planIndex, input.value);
                                                                input.value = '';
                                                            }
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const input = document.getElementById(`plan-feature-${planIndex}`) as HTMLInputElement;
                                                            if (input) {
                                                                handleAddPlanFeature(planIndex, input.value);
                                                                input.value = '';
                                                            }
                                                        }}
                                                        style={{
                                                            padding: '8px 12px',
                                                            backgroundColor: '#3B82F6',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '13px'
                                                        }}
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={handleAddPlan}
                                        style={{
                                            padding: '12px',
                                            border: '1px dashed #10B981',
                                            borderRadius: '8px',
                                            color: '#10B981',
                                            background: '#ECFDF5',
                                            cursor: 'pointer',
                                            fontWeight: '500',
                                            marginTop: '8px'
                                        }}
                                    >
                                        + Add Pricing Plan
                                    </button>
                                </div>
                            </div>

                            {/* 4. Coordinator Details (New Section) */}
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
                                            placeholder="e.g. John Doe"
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
                                                placeholder="e.g. coordinator@church.com"
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
                                                placeholder="e.g. +233 53 482 9203"
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
                                    Hall Videos
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
                                            border: 'none',
                                            cursor: 'pointer',
                                            backgroundColor: videoInputMode === 'youtube' ? '#EF4444' : '#F9FAFB',
                                            color: videoInputMode === 'youtube' ? 'white' : '#6B7280',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Youtube size={16} />
                                        YouTube Link
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setVideoInputMode('upload')}
                                        style={{
                                            flex: 1,
                                            padding: '10px 16px',
                                            fontSize: '13px',
                                            fontWeight: '500',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            border: 'none',
                                            borderLeft: '1px solid #E5E7EB',
                                            cursor: 'pointer',
                                            backgroundColor: videoInputMode === 'upload' ? '#3B82F6' : '#F9FAFB',
                                            color: videoInputMode === 'upload' ? 'white' : '#6B7280',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <Upload size={16} />
                                        Upload Video
                                    </button>
                                </div>

                                {/* YouTube Link Input */}
                                {videoInputMode === 'youtube' && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            marginBottom: '8px'
                                        }}>
                                            <div style={{ position: 'relative', flex: 1 }}>
                                                <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                                <input
                                                    type="url"
                                                    placeholder="Paste YouTube video URL (e.g., https://youtube.com/watch?v=...)"
                                                    value={newYoutubeUrl}
                                                    onChange={(e) => setNewYoutubeUrl(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px 12px 12px 38px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #D1D5DB',
                                                        fontSize: '14px'
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            if (newYoutubeUrl.trim() && (newYoutubeUrl.includes('youtube.com') || newYoutubeUrl.includes('youtu.be'))) {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    youtubeLinks: [...prev.youtubeLinks, newYoutubeUrl.trim()]
                                                                }));
                                                                setNewYoutubeUrl('');
                                                            }
                                                        }
                                                    }}
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (newYoutubeUrl.trim() && (newYoutubeUrl.includes('youtube.com') || newYoutubeUrl.includes('youtu.be'))) {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            youtubeLinks: [...prev.youtubeLinks, newYoutubeUrl.trim()]
                                                        }));
                                                        setNewYoutubeUrl('');
                                                    } else {
                                                        alert('Please enter a valid YouTube URL');
                                                    }
                                                }}
                                                style={{
                                                    padding: '12px 20px',
                                                    backgroundColor: '#EF4444',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontWeight: '500',
                                                    fontSize: '14px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px'
                                                }}
                                            >
                                                <Plus size={16} />
                                                Add
                                            </button>
                                        </div>
                                        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
                                            Supports youtube.com and youtu.be links. Videos will be embedded directly.
                                        </p>
                                    </div>
                                )}

                                {/* File Upload Input */}
                                {videoInputMode === 'upload' && (
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
                                        <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>MP4, MOV, WebM (Max 50MB)</p>
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

                                {/* YouTube Links Preview */}
                                {formData.youtubeLinks.length > 0 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                            YouTube Videos ({formData.youtubeLinks.length})
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                                            {formData.youtubeLinks.map((url, index) => {
                                                // Extract YouTube video ID
                                                const videoId = url.includes('youtu.be')
                                                    ? url.split('youtu.be/')[1]?.split('?')[0]
                                                    : url.split('v=')[1]?.split('&')[0];

                                                return (
                                                    <div key={index} style={{
                                                        position: 'relative',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        border: '1px solid #E5E7EB',
                                                        backgroundColor: '#000'
                                                    }}>
                                                        {videoId && (
                                                            <img
                                                                src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                                                                alt="YouTube thumbnail"
                                                                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
                                                            />
                                                        )}
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({
                                                                ...prev,
                                                                youtubeLinks: prev.youtubeLinks.filter((_, i) => i !== index)
                                                            }))}
                                                            style={{
                                                                position: 'absolute',
                                                                top: '4px',
                                                                right: '4px',
                                                                background: 'rgba(239, 68, 68, 0.9)',
                                                                color: 'white',
                                                                borderRadius: '50%',
                                                                padding: '4px',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                zIndex: 10
                                                            }}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: 0,
                                                            left: 0,
                                                            right: 0,
                                                            padding: '6px 8px',
                                                            background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                                            color: 'white',
                                                            fontSize: '11px',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '4px'
                                                        }}>
                                                            <Youtube size={12} />
                                                            YouTube
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Existing & Uploaded Videos Display */}
                                {(existingVideos.length > 0 || formData.videos.length > 0) && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                            Uploaded Videos ({existingVideos.filter(v => !deletedVideoIds.includes(v.id)).length + formData.videos.length})
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
                                            {/* Existing Videos */}
                                            {existingVideos.map((vid) => (
                                                !deletedVideoIds.includes(vid.id) && (
                                                    <div key={`existing-vid-${vid.id}`} style={{ position: 'relative', height: '100px', backgroundColor: '#000', borderRadius: '6px', overflow: 'hidden' }}>
                                                        {vid.videoType === 'youtube' ? (
                                                            <img
                                                                src={`https://img.youtube.com/vi/${vid.videoPath.includes('youtu.be') ? vid.videoPath.split('youtu.be/')[1]?.split('?')[0] : vid.videoPath.split('v=')[1]?.split('&')[0]}/mqdefault.jpg`}
                                                                alt="YouTube thumbnail"
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        ) : (
                                                            <video
                                                                src={vid.videoPath}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                                controls={false}
                                                                muted
                                                            />
                                                        )}
                                                        <button type="button"
                                                            onClick={() => setDeletedVideoIds(prev => [...prev, vid.id])}
                                                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer', zIndex: 10 }}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            {vid.videoType === 'youtube' ? <Youtube size={10} /> : <Video size={10} />}
                                                            {vid.videoType === 'youtube' ? 'YouTube' : 'Video'}
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                            {/* New Uploaded Videos */}
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
                                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {file.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Add More Gallery Section - After Hall Videos */}
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <ImageIcon size={18} style={{ color: '#10B981' }} />
                                    Add More Gallery
                                    {(existingGallery.filter(img => !deletedGalleryIds.includes(img.id)).length + formData.gallery.length) > 0 && (
                                        <span style={{
                                            fontSize: '12px',
                                            fontWeight: '500',
                                            backgroundColor: '#ECFDF5',
                                            color: '#059669',
                                            padding: '2px 8px',
                                            borderRadius: '12px',
                                            marginLeft: '4px'
                                        }}>
                                            {existingGallery.filter(img => !deletedGalleryIds.includes(img.id)).length + formData.gallery.length} images
                                        </span>
                                    )}
                                </h2>
                                <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '16px' }}>
                                    Upload additional photos to showcase this hall from different angles
                                </p>

                                <div style={{
                                    border: '2px dashed #10B981',
                                    borderRadius: '12px',
                                    padding: '24px 20px',
                                    textAlign: 'center',
                                    backgroundColor: '#F0FDF4',
                                    cursor: 'pointer',
                                    marginBottom: '16px',
                                    transition: 'all 0.2s'
                                }}
                                    onClick={() => document.getElementById('galleryInput')?.click()}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#DCFCE7';
                                        e.currentTarget.style.borderColor = '#059669';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#F0FDF4';
                                        e.currentTarget.style.borderColor = '#10B981';
                                    }}
                                >
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '50%',
                                            backgroundColor: '#10B981',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Plus size={24} color="white" />
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#059669' }}>Click to Add More Photos</span>
                                        <span style={{ fontSize: '12px', color: '#6B7280' }}>PNG, JPG up to 5MB each</span>
                                    </div>
                                    <input
                                        id="galleryInput"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        hidden
                                        onChange={(e) => handleFileChange(e, 'gallery')}
                                    />
                                </div>

                                {/* Gallery Preview Grid */}
                                {(existingGallery.filter(img => !deletedGalleryIds.includes(img.id)).length > 0 || formData.gallery.length > 0) && (
                                    <div>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                                            Gallery Preview
                                        </label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                            {/* Existing Gallery Images */}
                                            {existingGallery.map((img) => (
                                                !deletedGalleryIds.includes(img.id) && (
                                                    <div key={`existing-${img.id}`} style={{ position: 'relative', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #E5E7EB' }}>
                                                        <img src={img.imagePath} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%)' }} />
                                                        <button type="button"
                                                            onClick={() => setDeletedGalleryIds(prev => [...prev, img.id])}
                                                            style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer', zIndex: 10 }}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                        <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '4px 8px', background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '10px' }}>
                                                            Saved
                                                        </div>
                                                    </div>
                                                )
                                            ))}
                                            {/* New Gallery Preview */}
                                            {formData.gallery.map((file, index) => (
                                                <div key={`new-${index}`} style={{ position: 'relative', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #10B981' }}>
                                                    <img
                                                        src={URL.createObjectURL(file)}
                                                        alt={`Gallery ${index}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                    <div style={{ position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%)' }} />
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, i) => i !== index) }))}
                                                        style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer', zIndex: 10 }}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                    <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.8)', color: 'white', fontSize: '10px' }}>
                                                        New
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                                            {initialData ? 'Update Hall' : 'Save & Publish Hall'}
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
            </div >
        </div >
    );
}
