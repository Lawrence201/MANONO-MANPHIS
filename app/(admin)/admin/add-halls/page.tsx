'use client';

import React from 'react';
import Header from '@/components/admin/Header';
import HallForm from '@/components/admin/HallForm';

export default function AddHallsPage() {
    return (
        <div style={{ paddingBottom: '40px' }}>
            <Header />
            <div style={{ padding: '0 32px' }}>
                <div style={{ marginTop: '32px' }}>
                    <HallForm />
                </div>
            </div>
        </div>
    );
}
