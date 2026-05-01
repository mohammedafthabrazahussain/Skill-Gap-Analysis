import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { BookOpen, Target, ChevronRight, Star, Clock, Trophy } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const MyLearning = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserRoles = async () => {
            const token = localStorage.getItem('token');
            try {
                // Fetch the full user object with populated targetRoles
                const userRes = await axios.get('http://localhost:5000/api/v1/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userData = userRes.data.data;
                let roleDetails = (userData.targetRoles || []).filter(r => r !== null);

                // Recovery: If user has a targetRole but targetRoles is empty, add it
                if (roleDetails.length === 0 && userData.targetRole) {
                    roleDetails = [userData.targetRole];
                }

                console.log('Roles to display:', roleDetails.length);

                // For each role, fetch its current readiness score and gaps
                const enrichedRoles = await Promise.all(roleDetails.map(async (role) => {
                    try {
                        const analysisRes = await axios.post('http://localhost:5000/api/v1/analysis/gap',
                            { roleId: role._id },
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        return {
                            ...role,
                            readiness: analysisRes.data.data.readinessScore,
                            gapsCount: analysisRes.data.data.missingSkillsCount,
                            completedCount: analysisRes.data.data.completedSkillsCount
                        };
                    } catch (err) {
                        return { ...role, readiness: 0, gapsCount: 0, completedCount: 0 };
                    }
                }));

                setRoles(enrichedRoles);
            } catch (err) {
                console.error('Error fetching learning paths:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRoles();
    }, []);

    const handleSwitchRole = async (roleId) => {
        const token = localStorage.getItem('token');
        try {
            // Set this role as active by running gap analysis
            await axios.post('http://localhost:5000/api/v1/analysis/gap',
                { roleId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/dashboard');
        } catch (err) {
            console.error('Error switching role:', err);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'var(--primary-color)' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                    <BookOpen size={48} />
                </motion.div>
            </div>
        );
    }

    return (
        <Layout 
            title="Learning Architecture" 
            subtitle="Manage and track your progression across multiple AI-architected career paths. Your journey to industry mastery starts here."
        >
            {roles.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-premium"
                >
                    <div className="card-inner" style={{ padding: '80px', textAlign: 'center' }}>
                        <div style={{ background: 'var(--primary-soft)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', color: 'var(--primary)' }}>
                            <Target size={48} strokeWidth={2.5} />
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '12px' }}>No active learning paths</h2>
                        <p className="subtitle" style={{ marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px' }}>Use the Roadmap Wizard to discover and architect your first professional career journey.</p>
                        <button
                            onClick={() => navigate('/wizard')}
                            className="btn-primary"
                            style={{ padding: '16px 48px', fontSize: '1.1rem' }}
                        >
                            Start Architecting <ChevronRight size={20} style={{ marginLeft: '8px' }} />
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-md)' }}>
                    {roles.map((role, index) => (
                        <motion.div
                            key={role._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="card-premium"
                        >
                            <div className="card-inner" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <Trophy size={28} strokeWidth={2.5} />
                                    </div>
                                    <div className={role.readiness >= 80 ? 'badge badge-success' : 'badge badge-primary'} style={{ border: 'none' }}>
                                        {role.readiness}% Readiness
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '12px' }}>{role.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px', lineHeight: '1.6', flex: 1 }}>
                                    {role.description}
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                                    <div style={{ background: 'var(--bg-app)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: '900', color: 'var(--success)' }}>{role.completedCount}</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Mastered</p>
                                    </div>
                                    <div style={{ background: 'var(--bg-app)', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: '900', color: 'var(--primary)' }}>{role.gapsCount}</p>
                                        <p style={{ margin: '4px 0 0', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>To Go</p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>Mastery Progress</span>
                                        <span style={{ color: 'var(--primary)' }}>{role.readiness}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-app)', borderRadius: '10px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${role.readiness}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            style={{ height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleSwitchRole(role._id)}
                                    className={role._id === user?.targetRole?._id ? "btn-secondary" : "btn-primary"}
                                    style={{ width: '100%', py: '14px' }}
                                >
                                    {role._id === user?.targetRole?._id ? 'Current Active Path' : 'Switch to Path'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default MyLearning;
