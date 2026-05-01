import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, Rocket } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-app)', padding: '24px' }}>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card-premium fade-up" 
                style={{ width: '100%', maxWidth: '480px' }}
            >
                <div className="card-inner" style={{ padding: '56px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{ display: 'inline-flex', padding: '16px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '20px', marginBottom: '24px' }}>
                            <Rocket size={32} strokeWidth={2.5} />
                        </div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '12px' }}>SkillGap<span style={{ color: 'var(--primary)' }}>.AI</span></h2>
                        <p className="subtitle" style={{ fontSize: '1rem' }}>Enter your credentials to access your professional trajectory.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="badge badge-danger" 
                            style={{ width: '100%', padding: '16px', marginBottom: '32px', textAlign: 'center', fontSize: '0.85rem' }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div>
                            <label className="text-small" style={{ color: 'var(--text-main)', marginBottom: '10px', display: 'block', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Matrix ID (Email)</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-premium"
                                placeholder="name@organization.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-small" style={{ color: 'var(--text-main)', marginBottom: '10px', display: 'block', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Pass</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-premium"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.05rem', justifyContent: 'center', marginTop: '8px' }}>
                            Initialize Session
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <p className="text-small" style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                            New to the infrastructure? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }} className="hover-lift">Create Identity</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
