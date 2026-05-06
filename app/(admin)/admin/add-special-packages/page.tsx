'use client';

import React from 'react';
import Header from '@/components/admin/Header';
import PackageForm from '@/components/admin/PackageForm';

export default function AddSpecialPackagePage() {
    return (
        <div style={{ paddingBottom: '40px' }}>
            <Header />
            <div style={{ padding: '0 32px' }}>
                <div style={{ marginTop: '32px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Add New Special Package</h1>
                    <PackageForm packageType="special" />
                </div>
            </div>
        </div>
    );
}
