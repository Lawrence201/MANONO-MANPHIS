'use client';

import React from 'react';
import Header from '@/components/admin/Header';
import PackageForm from '@/components/admin/PackageForm';

export default function AddPackagePage() {
    return (
        <div style={{ paddingBottom: '40px' }}>
            <Header />
            <div style={{ padding: '0 32px' }}>
                <div style={{ marginTop: '32px' }}>
                    <PackageForm />
                </div>
            </div>
        </div>
    );
}
