import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Plus, Trash2, Edit, Search, ShieldCheck, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [roles, setRoles] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesRes = await axios.get('http://localhost:5000/api/v1/roles');
                const skillsRes = await axios.get('http://localhost:5000/api/v1/skills');
                setRoles(rolesRes.data.data);
                setSkills(skillsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
    };

    if (loading) return <Layout>Loading...</Layout>;

    return (
        <Layout 
            title="System Architecture" 
            subtitle="Configure and manage the core skill taxonomy and industry roles that power the SkillGap.AI engine."
        >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: 'var(--space-lg)' }}>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card-premium"
                >
                    <div className="card-inner">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <Cpu size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Skill Taxonomy</h3>
                                    <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Global competency mapping</p>
                                </div>
                            </div>
                            <button className="btn-primary"><Plus size={18}/> New Skill</button>
                        </div>

                        <div style={{ maxHeight: '650px', overflowY: 'auto', paddingRight: '8px' }}>
                            {skills.map((skill, index) => (
                                <motion.div 
                                    key={skill._id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.05 }}
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '16px 20px', 
                                        background: 'var(--bg-app)',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--bg-app)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{skill.name}</span>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn-secondary" style={{ padding: '10px', borderRadius: '10px' }}><Edit size={16}/></button>
                                        <button className="btn-secondary" style={{ padding: '10px', borderRadius: '10px', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', border: 'none' }}><Trash2 size={16}/></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card-premium"
                >
                    <div className="card-inner">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
                                    <ShieldCheck size={28} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Industry Roles</h3>
                                    <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Target career path definitions</p>
                                </div>
                            </div>
                            <button className="btn-primary"><Plus size={18}/> New Role</button>
                        </div>

                        <div style={{ maxHeight: '650px', overflowY: 'auto', paddingRight: '8px' }}>
                            {roles.map((role, index) => (
                                <motion.div 
                                    key={role._id} 
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: index * 0.05 }}
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        padding: '16px 20px', 
                                        background: 'var(--bg-app)',
                                        borderRadius: '12px',
                                        marginBottom: '12px',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'white';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'var(--bg-app)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{role.title}</span>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button className="btn-secondary" style={{ padding: '10px', borderRadius: '10px' }}><Edit size={16}/></button>
                                        <button className="btn-secondary" style={{ padding: '10px', borderRadius: '10px', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.05)', border: 'none' }}><Trash2 size={16}/></button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
