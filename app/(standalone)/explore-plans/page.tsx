'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Check, CheckCircle2, Crown, Zap, Star, Package } from 'lucide-react';
import styles from './ExplorePlans.module.css';

// Loading fallback component
function ExplorePlansLoading() {
    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                    <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                    <p style={{ fontSize: '18px' }}>Loading plans...</p>
                </div>
            </div>
        </div>
    );
}

interface PlanFeature {
    id: number;
    featureText: string;
}

interface HallPlan {
    id: number;
    name: string;
    description: string | null;
    price: string;
    validity: string | null;
    features: PlanFeature[];
}

interface HallData {
    id: number;
    name: string;
}

// Icon map for plan types
const getIconForPlan = (name: string, index: number) => {
    const normalizedName = name.toLowerCase();
    if (normalizedName.includes('partner') || normalizedName.includes('premium') || normalizedName.includes('vip')) {
        return <Crown className={styles.icon} strokeWidth={1.5} />;
    }
    if (normalizedName.includes('value') || normalizedName.includes('pro') || normalizedName.includes('standard')) {
        return <Star className={styles.icon} strokeWidth={1.5} />;
    }
    if (normalizedName.includes('smart') || normalizedName.includes('basic') || normalizedName.includes('starter')) {
        return <Zap className={styles.icon} strokeWidth={1.5} />;
    }
    // Fallback based on index
    const icons = [Zap, Star, Crown];
    const Icon = icons[index % icons.length];
    return <Icon className={styles.icon} strokeWidth={1.5} />;
};

function ExplorePlansContent() {
    const searchParams = useSearchParams();
    const hallId = searchParams.get('hallId');
    const hallNameParam = searchParams.get('hallName');

    const [plans, setPlans] = useState<HallPlan[]>([]);
    const [hallName, setHallName] = useState<string>(hallNameParam ? decodeURIComponent(hallNameParam) : 'this venue');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!hallId) {
            setLoading(false);
            setError('No hall specified. Please select a hall first.');
            return;
        }

        const fetchPlans = async () => {
            try {
                const response = await fetch(`/api/halls/${hallId}/plans`);
                if (!response.ok) {
                    throw new Error('Failed to fetch plans');
                }
                const data = await response.json();
                setPlans(data.plans || []);
                if (data.hall) {
                    setHallName(data.hall.name);
                }
            } catch (err) {
                console.error('Error fetching plans:', err);
                setError('Failed to load plans. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, [hallId]);

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div style={{ textAlign: 'center', color: '#fff' }}>
                        <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ fontSize: '18px' }}>Loading plans...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div style={{ textAlign: 'center', color: '#fff' }}>
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>{error}</p>
                        <Link href="/" style={{ color: '#3b82f6' }}>← Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (plans.length === 0) {
        return (
            <div className={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div style={{ textAlign: 'center', color: '#fff' }}>
                        <Package size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p style={{ fontSize: '18px', marginBottom: '16px' }}>No pricing plans available for this venue yet.</p>
                        <Link href={`/hall_details/${hallId}`} style={{ color: '#3b82f6' }}>← Back to Venue Details</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Choose your pricing plan</h1>
                <p className={styles.subtitle}>
                    You'll be able to use it to book "{hallName}"
                </p>
            </header>

            <div className={styles.grid}>
                {plans.map((plan, index) => (
                    <div key={plan.id} className={styles.card}>
                        {getIconForPlan(plan.name, index)}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 className={styles.planName}>{plan.name}</h2>
                            {index === 1 && plans.length > 1 && (
                                <span className={styles.savingBadge}>Most Popular</span>
                            )}
                        </div>
                        <p className={styles.planDesc}>{plan.description || ''}</p>

                        <div className={styles.priceContainer}>
                            <span className={styles.price}>{plan.price}</span>
                        </div>

                        <Link href={`/hall-booking?hallId=${hallId}&planId=${plan.id}`} style={{ width: '100%' }}>
                            <button className={`${styles.ctaButton} ${index === 0 ? styles.ctaButtonSecondary : styles.ctaButtonPrimary}`}>
                                Get {plan.name} plan
                            </button>
                        </Link>

                        {plan.features && plan.features.length > 0 && (
                            <ul className={styles.featuresList}>
                                {plan.features.map((feature) => (
                                    <li key={feature.id} className={styles.featureItem}>
                                        <Check className={styles.checkIcon} size={16} />
                                        <span>{feature.featureText}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {plan.validity && (
                            <p style={{ marginTop: '12px', fontSize: '13px', color: '#888' }}>
                                {plan.validity}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            <p style={{ marginTop: '40px', fontSize: '13px', color: '#666' }}>
                Prices shown do not include applicable tax. Contact us for custom packages.
            </p>
        </div>
    );
}

// Default export with Suspense wrapper
export default function ExplorePlansPage() {
    return (
        <Suspense fallback={<ExplorePlansLoading />}>
            <ExplorePlansContent />
        </Suspense>
    );
}
