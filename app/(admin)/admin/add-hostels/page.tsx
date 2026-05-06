import Header from '@/components/admin/Header';
import HostelForm from '@/components/admin/HostelForm';

export default function AddHostelPage() {
    return (
        <>
            <Header />
            <div style={{ padding: '32px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Add New Lodge</h1>
                <HostelForm />
            </div>
        </>
    );
}
