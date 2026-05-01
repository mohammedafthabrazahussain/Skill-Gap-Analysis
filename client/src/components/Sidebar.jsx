import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
    LayoutDashboard, 
    Compass, 
    BookOpen, 
    User, 
    LogOut, 
    Rocket,
    Shield,
    CheckSquare
} from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const navItemStyle = (isActive) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        borderRadius: '8px',
        color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
        backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
        fontWeight: isActive ? '600' : '500',
        marginBottom: '4px',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        fontSize: '0.95rem'
    });

    return (
        <aside style={{ 
            width: '280px', 
            height: '100vh', 
            background: 'var(--bg-sidebar)', 
            borderRight: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 100,
            padding: '40px 24px'
        }}>
            {/* Logo Section */}
            <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                <div style={{ 
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary)',
                    borderRadius: '10px',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)'
                }}>
                    <Rocket size={20} strokeWidth={2.5} />
                </div>
                <span style={{ 
                    fontWeight: '800', 
                    fontSize: '1.4rem', 
                    color: 'var(--text-main)',
                    letterSpacing: '-0.04em'
                }}>
                    SkillGap<span style={{ color: 'var(--primary)' }}>.AI</span>
                </span>
            </div>

            {/* Navigation Section */}
            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                        { to: '/dashboard', icon: LayoutDashboard, label: 'Analytics' },
                        { to: '/wizard', icon: Compass, label: 'Roadmap' },
                        { to: '/learning', icon: BookOpen, label: 'Knowledge' },
                        { to: '/tasks', icon: CheckSquare, label: 'Milestones' }
                    ].map((item) => (
                        <li key={item.to}>
                            <NavLink to={item.to} style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease',
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary-soft)' : 'transparent'
                            })}>
                                <item.icon size={20} strokeWidth={2} /> {item.label}
                            </NavLink>
                        </li>
                    ))}
                    
                    {user?.role === 'admin' && (
                        <li style={{ marginTop: '32px' }}>
                            <div style={{ padding: '0 16px 12px', fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                Admin Control
                            </div>
                            <NavLink to="/admin" style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '10px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                fontSize: '0.95rem',
                                transition: 'all 0.2s ease',
                                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--primary-soft)' : 'transparent'
                            })}>
                                <Shield size={20} strokeWidth={2} /> Infrastructure
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>

            {/* User Profile Section */}
            <div style={{ paddingTop: '24px', borderTop: '1px solid var(--border-subtle)' }}>
                <div 
                    onClick={() => navigate('/profile')}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        marginBottom: '16px',
                        cursor: 'pointer',
                        padding: '12px',
                        borderRadius: '12px',
                        transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'var(--bg-app)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                    }}
                >
                    <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '10px', 
                        background: 'var(--primary)', 
                        color: 'white', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: '700',
                        fontSize: '16px',
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.2)'
                    }}>
                        {user?.name ? user.name[0].toUpperCase() : <User size={20} />}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>{user?.email}</div>
                    </div>
                </div>
                
                <button 
                    onClick={handleLogout}
                    style={{ 
                        width: '100%', 
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '12px',
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--danger)',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#fff1f2';
                        e.currentTarget.style.borderColor = '#fda4af';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                >
                    <LogOut size={18} strokeWidth={2.5} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
