'use client';
import { useState, useEffect, useMemo } from 'react';
import {
    Send,
    Mail,
    Users,
    Search,
    Check,
    CheckCheck,
    AlertCircle,
    X,
    FileText,
    MessageSquare,
    Clock,
    Sparkles,
    Phone,
    Building2,
    Filter,
    RefreshCw
} from 'lucide-react';

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    source: string;
    lastBooking: string;
}

interface Template {
    id: string;
    name: string;
    subject: string;
    description: string;
    icon: any;
}

const templates: Template[] = [
    { id: 'welcome', name: 'Welcome Message', subject: 'Welcome to Camp Elim Africa! 🏕️', description: 'Greet new clients', icon: Sparkles },
    { id: 'reminder', name: 'Event Reminder', subject: 'Reminder: Your Upcoming Event', description: 'Remind about bookings', icon: Clock },
    { id: 'promotion', name: 'Special Offer', subject: '🌟 Special Offer Just for You', description: 'Promotional messages', icon: Mail },
    { id: 'thankyou', name: 'Thank You', subject: 'Thank You for Choosing Us! 🙏', description: 'Post-event appreciation', icon: MessageSquare },
];

export default function CommunicationCenter() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);

    // Compose state
    const [activeTab, setActiveTab] = useState<'compose' | 'templates'>('compose');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/communication/clients');
            if (response.ok) {
                const data = await response.json();
                setClients(data.clients || []);
            }
        } catch (error) {
            console.error('Failed to fetch clients:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtered clients
    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.phone.includes(searchTerm)
        );
    }, [clients, searchTerm]);

    // Handle select all
    useEffect(() => {
        if (selectAll) {
            setSelectedClients(new Set(filteredClients.map(c => c.email)));
        } else if (selectedClients.size === filteredClients.length && filteredClients.length > 0) {
            // Only clear if it was a manual toggle
        }
    }, [selectAll, filteredClients]);

    const toggleClient = (email: string) => {
        const newSelected = new Set(selectedClients);
        if (newSelected.has(email)) {
            newSelected.delete(email);
        } else {
            newSelected.add(email);
        }
        setSelectedClients(newSelected);
        setSelectAll(newSelected.size === filteredClients.length);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedClients(new Set());
            setSelectAll(false);
        } else {
            setSelectedClients(new Set(filteredClients.map(c => c.email)));
            setSelectAll(true);
        }
    };

    const handleTemplateSelect = (templateId: string) => {
        const template = templates.find(t => t.id === templateId);
        if (template) {
            setSelectedTemplate(templateId);
            setSubject(template.subject);
            // Clear custom message when using template
            setMessage('');
        }
    };

    const handleSend = async () => {
        if (selectedClients.size === 0) {
            setSendResult({ type: 'error', message: 'Please select at least one recipient' });
            return;
        }

        if (!selectedTemplate && (!subject || !message)) {
            setSendResult({ type: 'error', message: 'Please enter subject and message, or select a template' });
            return;
        }

        setSending(true);
        setSendResult(null);

        try {
            const recipients = clients
                .filter(c => selectedClients.has(c.email))
                .map(c => ({ name: c.name, email: c.email }));

            const response = await fetch('/api/communication/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipients,
                    subject,
                    message,
                    template: selectedTemplate
                })
            });

            const data = await response.json();

            if (response.ok) {
                setSendResult({ type: 'success', message: data.message });
                // Clear form
                setSelectedClients(new Set());
                setSelectAll(false);
                setSubject('');
                setMessage('');
                setSelectedTemplate(null);
            } else {
                setSendResult({ type: 'error', message: data.error || 'Failed to send emails' });
            }
        } catch (error) {
            setSendResult({ type: 'error', message: 'Failed to send emails. Please try again.' });
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #e5e7eb', borderTopColor: '#F59E0B', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }}></div>
                    <p style={{ color: '#6B7280' }}>Loading clients...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: '24px' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>Communication Center</h1>
                <p style={{ color: '#6B7280', fontSize: '14px' }}>Send emails to clients from your booking database</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '24px' }}>
                {[
                    { label: 'Total Clients', value: clients.length, icon: Users, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
                    { label: 'Selected', value: selectedClients.size, icon: CheckCheck, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
                    { label: 'Templates', value: templates.length, icon: FileText, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)' }
                ].map((stat, i) => (
                    <div key={i} style={{
                        backgroundColor: 'white', borderRadius: '16px', padding: '20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ padding: '12px', backgroundColor: stat.bg, borderRadius: '12px' }}>
                                <stat.icon size={24} color={stat.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '12px', color: '#6B7280', textTransform: 'uppercase' }}>{stat.label}</p>
                                <p style={{ fontSize: '28px', fontWeight: '700', color: '#111827' }}>{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' }}>
                {/* Left: Client List */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#111827' }}>Recipients</h3>
                            <button
                                onClick={fetchClients}
                                style={{ padding: '6px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '6px' }}
                                title="Refresh"
                            >
                                <RefreshCw size={16} color="#6B7280" />
                            </button>
                        </div>

                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            <input
                                type="text"
                                placeholder="Search clients..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%', padding: '10px 10px 10px 36px',
                                    border: '1px solid #e5e7eb', borderRadius: '8px',
                                    fontSize: '13px', outline: 'none'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ padding: '12px 16px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={selectAll}
                                onChange={handleSelectAll}
                                style={{ width: '16px', height: '16px', accentColor: '#F59E0B' }}
                            />
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>
                                Select All ({filteredClients.length})
                            </span>
                        </label>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {filteredClients.length > 0 ? filteredClients.map((client) => (
                            <label
                                key={client.email}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f3f4f6',
                                    backgroundColor: selectedClients.has(client.email) ? 'rgba(245, 158, 11, 0.05)' : 'transparent'
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedClients.has(client.email)}
                                    onChange={() => toggleClient(client.email)}
                                    style={{ width: '16px', height: '16px', accentColor: '#F59E0B' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{client.name}</p>
                                    <p style={{ fontSize: '12px', color: '#6B7280' }}>{client.email}</p>
                                </div>
                                <span style={{
                                    padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '500',
                                    backgroundColor: client.source === 'Hall' ? 'rgba(59, 130, 246, 0.1)' :
                                        client.source === 'Hostel' ? 'rgba(139, 92, 246, 0.1)' : 'rgba(22, 163, 74, 0.1)',
                                    color: client.source === 'Hall' ? '#3B82F6' :
                                        client.source === 'Hostel' ? '#8B5CF6' : '#16A34A'
                                }}>
                                {client.source === 'Hostel' ? 'Lodge' : client.source}
                                </span>
                            </label>
                        )) : (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                                <Users size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
                                <p>No clients found</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Compose */}
                <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                        {[
                            { id: 'compose', label: 'Compose', icon: Mail },
                            { id: 'templates', label: 'Templates', icon: FileText }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    padding: '16px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                                    fontSize: '14px', fontWeight: activeTab === tab.id ? '600' : '400',
                                    color: activeTab === tab.id ? '#F59E0B' : '#6B7280',
                                    borderBottom: activeTab === tab.id ? '2px solid #F59E0B' : '2px solid transparent'
                                }}
                            >
                                <tab.icon size={16} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ padding: '20px' }}>
                        {activeTab === 'compose' ? (
                            <>
                                {/* Selected Template Badge */}
                                {selectedTemplate && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '12px', backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                        borderRadius: '8px', marginBottom: '16px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Sparkles size={16} color="#F59E0B" />
                                            <span style={{ fontSize: '13px', color: '#92400E' }}>
                                                Using template: <strong>{templates.find(t => t.id === selectedTemplate)?.name}</strong>
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => { setSelectedTemplate(null); setSubject(''); }}
                                            style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                                        >
                                            <X size={14} color="#92400E" />
                                        </button>
                                    </div>
                                )}

                                {/* Subject */}
                                <div style={{ marginBottom: '16px' }}>
                                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Email subject line..."
                                        disabled={!!selectedTemplate}
                                        style={{
                                            width: '100%', padding: '12px', border: '1px solid #e5e7eb',
                                            borderRadius: '10px', fontSize: '14px', outline: 'none',
                                            backgroundColor: selectedTemplate ? '#f9fafb' : 'white'
                                        }}
                                    />
                                </div>

                                {/* Message */}
                                {!selectedTemplate && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                                            Message *
                                        </label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Write your message here... Use {{name}} for personalization."
                                            rows={8}
                                            style={{
                                                width: '100%', padding: '12px', border: '1px solid #e5e7eb',
                                                borderRadius: '10px', fontSize: '14px', outline: 'none', resize: 'vertical'
                                            }}
                                        />
                                        <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px' }}>
                                            Tip: Use {'{{name}}'} to personalize with recipient's name
                                        </p>
                                    </div>
                                )}

                                {/* Send Result */}
                                {sendResult && (
                                    <div style={{
                                        padding: '12px 16px', borderRadius: '8px', marginBottom: '16px',
                                        backgroundColor: sendResult.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                        color: sendResult.type === 'success' ? '#065F46' : '#991B1B',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}>
                                        {sendResult.type === 'success' ? <CheckCheck size={18} /> : <AlertCircle size={18} />}
                                        {sendResult.message}
                                    </div>
                                )}

                                {/* Send Button */}
                                <button
                                    onClick={handleSend}
                                    disabled={sending || selectedClients.size === 0}
                                    style={{
                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        padding: '14px', backgroundColor: sending || selectedClients.size === 0 ? '#d1d5db' : '#F59E0B',
                                        color: 'white', border: 'none', borderRadius: '10px',
                                        fontSize: '14px', fontWeight: '600', cursor: sending || selectedClients.size === 0 ? 'not-allowed' : 'pointer',
                                        boxShadow: sending || selectedClients.size === 0 ? 'none' : '0 4px 6px rgba(245, 158, 11, 0.3)'
                                    }}
                                >
                                    {sending ? (
                                        <>
                                            <div style={{ width: '16px', height: '16px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send to {selectedClients.size} recipient{selectedClients.size !== 1 ? 's' : ''}
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            /* Templates Tab */
                            <div style={{ display: 'grid', gap: '12px' }}>
                                {templates.map((template) => (
                                    <button
                                        key={template.id}
                                        onClick={() => { handleTemplateSelect(template.id); setActiveTab('compose'); }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '16px',
                                            padding: '16px', backgroundColor: selectedTemplate === template.id ? 'rgba(245, 158, 11, 0.1)' : '#f9fafb',
                                            border: selectedTemplate === template.id ? '2px solid #F59E0B' : '1px solid #e5e7eb',
                                            borderRadius: '12px', cursor: 'pointer', textAlign: 'left', width: '100%'
                                        }}
                                    >
                                        <div style={{
                                            padding: '12px', backgroundColor: 'white', borderRadius: '10px',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                                        }}>
                                            <template.icon size={20} color="#F59E0B" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '2px' }}>
                                                {template.name}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#6B7280' }}>{template.description}</p>
                                            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>
                                                Subject: {template.subject}
                                            </p>
                                        </div>
                                        {selectedTemplate === template.id && (
                                            <Check size={20} color="#F59E0B" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
