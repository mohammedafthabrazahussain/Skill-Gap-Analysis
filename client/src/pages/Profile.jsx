import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
    User, 
    Mail, 
    Calendar, 
    Plus, 
    Trash, 
    Save,
    Check,
    Globe,
    Link,
    Briefcase,
    Phone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        dob: '',
        mobile: '',
        socials: { linkedin: '', github: '', portfolio: '', twitter: '' },
        skills: [],
        experience: [],
        projects: []
    });

    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/v1/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = res.data.data;
                setProfile({
                    ...data,
                    dob: data.dob ? new Date(data.dob).toISOString().split('T')[0] : '',
                    socials: data.socials || { linkedin: '', github: '', portfolio: '', twitter: '' },
                    skills: data.skills || [],
                    experience: data.experience || [],
                    projects: data.projects || []
                });
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put('http://localhost:5000/api/v1/auth/update-profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const addListItem = (field, item) => {
        setProfile({ ...profile, [field]: [...profile[field], item] });
    };

    const removeListItem = (field, index) => {
        const newList = [...profile[field]];
        newList.splice(index, 1);
        setProfile({ ...profile, [field]: newList });
    };

    const updateListItem = (field, index, key, value) => {
        const newList = [...profile[field]];
        newList[index] = { ...newList[index], [key]: value };
        setProfile({ ...profile, [field]: newList });
    };

    if (loading) return <Layout>Loading Profile...</Layout>;

    return (
        <Layout 
            title="Portfolio Architecture" 
            subtitle="Manage your professional identity, digital presence, and career trajectory. This data powers your AI-driven skill gap analysis."
        >
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                            <User size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', letterSpacing: '-0.02em' }}>User Settings</h2>
                            <p className="text-small" style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Active since {new Date(profile.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className={success ? "btn-success" : "btn-primary"}
                        style={{ minWidth: '200px', padding: '14px 28px' }}
                    >
                        {success ? <Check size={20} strokeWidth={2.5} /> : <Save size={20} strokeWidth={2.5} />}
                        {saving ? 'Syncing...' : success ? 'Portfolio Saved' : 'Update Portfolio'}
                    </button>
                </header>

                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    <Section title="Identity Core" icon={<User size={20} strokeWidth={2.5} />}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                            <Input label="Professional Name" icon={<User size={18} strokeWidth={2.5} />} value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                            <Input label="Account Email" icon={<Mail size={18} strokeWidth={2.5} />} value={profile.email} disabled />
                            <Input label="Birth Registry" icon={<Calendar size={18} strokeWidth={2.5} />} type="date" value={profile.dob} onChange={(e) => setProfile({...profile, dob: e.target.value})} />
                            <Input label="Contact Matrix" icon={<Phone size={18} strokeWidth={2.5} />} value={profile.mobile} onChange={(e) => setProfile({...profile, mobile: e.target.value})} />
                        </div>
                    </Section>

                    <Section title="Ecosystem Connections" icon={<Globe size={20} strokeWidth={2.5} />}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                            <Input label="LinkedIn Architecture" icon={<Link size={18} strokeWidth={2.5} />} value={profile.socials.linkedin} onChange={(e) => setProfile({...profile, socials: {...profile.socials, linkedin: e.target.value}})} />
                            <Input label="GitHub Repository" icon={<Link size={18} strokeWidth={2.5} />} value={profile.socials.github} onChange={(e) => setProfile({...profile, socials: {...profile.socials, github: e.target.value}})} />
                        </div>
                    </Section>

                    <Section 
                        title="Professional Trajectory" 
                        icon={<Briefcase size={20} strokeWidth={2.5} />}
                        onAdd={() => addListItem('experience', { company: '', role: '', duration: '', description: '' })}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                            {profile.experience.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '64px', background: 'var(--bg-app)', borderRadius: '20px', border: '2px dashed var(--border-subtle)' }}>
                                    <p style={{ color: 'var(--text-muted)', fontWeight: '600', margin: 0 }}>No historical records found. Document your journey to improve AI analysis.</p>
                                </div>
                            ) : (
                                profile.experience.map((exp, index) => (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={index} 
                                        style={{ 
                                            padding: '32px', 
                                            background: 'var(--bg-app)', 
                                            borderRadius: '20px', 
                                            position: 'relative',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                                    >
                                        <button 
                                            type="button" 
                                            onClick={() => removeListItem('experience', index)} 
                                            style={{ 
                                                position: 'absolute', 
                                                top: '20px', 
                                                right: '20px', 
                                                color: 'var(--text-muted)', 
                                                background: 'transparent', 
                                                border: 'none', 
                                                cursor: 'pointer',
                                                padding: '10px',
                                                borderRadius: '10px',
                                                transition: 'all 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.color = 'var(--danger)';
                                                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = 'var(--text-muted)';
                                                e.currentTarget.style.background = 'transparent';
                                            }}
                                        >
                                            <Trash size={20} />
                                        </button>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                                            <Input label="Enterprise Name" value={exp.company} onChange={(e) => updateListItem('experience', index, 'company', e.target.value)} />
                                            <Input label="Professional Role" value={exp.role} onChange={(e) => updateListItem('experience', index, 'role', e.target.value)} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <label className="text-small" style={{ fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Strategic Contributions</label>
                                            <textarea 
                                                placeholder="Detail your impact, core responsibilities, and technologies mastered..."
                                                value={exp.description}
                                                onChange={(e) => updateListItem('experience', index, 'description', e.target.value)}
                                                className="input-premium"
                                                style={{ minHeight: '120px' }}
                                            />
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </Section>
                </form>
            </div>
        </Layout>
    );
};

const Section = ({ title, icon, children, onAdd }) => (
    <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-premium" 
    >
        <div className="card-inner" style={{ padding: '40px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        {icon}
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em' }}>{title}</h3>
                </div>
                {onAdd && (
                    <button 
                        type="button" 
                        onClick={onAdd} 
                        className="btn-secondary"
                        style={{ padding: '10px 20px', fontSize: '0.85rem' }}
                    >
                        <Plus size={18} strokeWidth={2.5} /> Add Record
                    </button>
                )}
            </div>
            {children}
        </div>
    </motion.div>
);

const Input = ({ label, type = 'text', value, onChange, disabled, icon }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label className="text-small" style={{ fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</label>
        <div style={{ position: 'relative' }}>
            {icon && <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{icon}</div>}
            <input 
                type={type} 
                value={value} 
                onChange={onChange} 
                disabled={disabled}
                className="input-premium"
                style={{ 
                    paddingLeft: icon ? '52px' : '20px',
                    backgroundColor: disabled ? 'var(--bg-app)' : 'white',
                    color: disabled ? 'var(--text-muted)' : 'var(--text-main)'
                }}
            />
        </div>
    </div>
);

export default Profile;
