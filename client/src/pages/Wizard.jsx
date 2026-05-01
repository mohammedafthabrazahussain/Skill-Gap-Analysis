import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ChevronRight, Clock, AlertTriangle, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ResumeUpload from '../components/ResumeUpload';

const Wizard = () => {
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const rolesRes = await axios.get('http://localhost:5000/api/v1/roles');
                setRoles(rolesRes.data.data);
                
                const meRes = await axios.get('http://localhost:5000/api/v1/auth/me');
                if (meRes.data.data.targetRole) {
                    const roleId = typeof meRes.data.data.targetRole === 'string' ? meRes.data.data.targetRole : meRes.data.data.targetRole._id;
                    const role = rolesRes.data.data.find(r => r._id.toString() === roleId.toString());
                    if (role) handleRoleSelect(role);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleRoleSelect = async (role) => {
        console.log('Role Selected:', role.title, 'Skills count:', role.requiredSkills?.length);
        setSelectedRole(role);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Your session has expired. Please log in again.');
            return;
        }
        try {
            const res = await axios.get('http://localhost:5000/api/v1/skills/user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const userSkills = res.data.data;
            // Create a map of user skills for quick lookup, handle potential ID variations
            const userSkillsMap = new Map();
            userSkills.forEach(us => {
                if (us.skill) {
                    const skillId = typeof us.skill === 'string' ? us.skill : us.skill._id;
                    userSkillsMap.set(skillId.toString(), us);
                }
            });

            if (!role.requiredSkills || role.requiredSkills.length === 0) {
                console.warn('Selected role has no required skills defined.');
                setSkills([]);
                return;
            }

            const combinedSkills = role.requiredSkills.map(rs => {
                if (!rs.skill) return null;
                
                const skillId = typeof rs.skill === 'string' ? rs.skill : rs.skill._id;
                const us = userSkillsMap.get(skillId.toString());
                
                // Ensure we have the skill object details
                const skillData = typeof rs.skill === 'object' ? rs.skill : { _id: rs.skill, name: 'Loading...' };
                
                return {
                    ...skillData,
                    proficiency: us ? us.proficiency : 0,
                    status: us ? us.status : 'To Learn',
                    levelRequired: rs.levelRequired || 70
                };
            }).filter(s => s !== null);

            console.log('Mapped Skills:', combinedSkills.length);
            setSkills(combinedSkills);
        } catch (err) {
            console.error('Error loading role skills:', err);
        }
    };

    const handleProficiencyChange = (skillId, level) => {
        setSkills(skills.map(s => 
            s._id.toString() === skillId.toString() ? { ...s, proficiency: level, status: level >= 70 ? 'Mastered' : level > 0 ? 'Learning' : 'To Learn' } : s
        ));
    };

    const handleSkillsDetected = (detectedSkills) => {
        const detectedIds = new Set(detectedSkills.map(s => s._id));
        setSkills(skills.map(s => 
            detectedIds.has(s._id) ? { ...s, proficiency: 80, status: 'Mastered' } : s
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            // Save skills sequentially to be safe
            for (const skill of skills) {
                await axios.put('http://localhost:5000/api/v1/skills/user', {
                    skillId: skill._id.toString(),
                    proficiency: skill.proficiency,
                    status: skill.status
                }, { headers: { Authorization: `Bearer ${token}` } });
            }
            

            
            // Perform analysis and set target role
            const analysisRes = await axios.post('http://localhost:5000/api/v1/analysis/gap', 
                { roleId: selectedRole._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            console.log('Analysis result:', analysisRes.data);
            navigate('/learning');
        } catch (err) {
            console.error('Save Roadmap Error:', err);
            const msg = err.response?.data?.message || err.message || 'Failed to save roadmap. Please check your connection.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Layout>Loading...</Layout>;

    return (
        <Layout 
            title="Roadmap Architect" 
            subtitle="Design your professional future. Select a target role and assess your current competency to generate an AI-powered career path."
        >
            {!selectedRole ? (
                <div className="fade-up">
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-md)' }}>
                        {roles.map(role => (
                            <motion.div 
                                key={role._id}
                                className="card-premium"
                                onClick={() => handleRoleSelect(role)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="card-inner">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
                                        <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{role.title}</h3>
                                        <span className="badge badge-primary">
                                            {role.industryImpact?.demand} Demand
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px', minHeight: '60px' }}>{role.description}</p>
                                    
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px', padding: '24px', background: 'var(--bg-app)', borderRadius: '16px' }}>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Avg. Salary</p>
                                            <p style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>{role.industryImpact?.avgSalary || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>Relevance</p>
                                            <p style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)', margin: 0 }}>{role.industryImpact?.relevanceScore}%</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--primary)', fontWeight: '700', fontSize: '0.95rem', gap: '8px' }}>
                                        Architect This Path <ChevronRight size={18} strokeWidth={2.5} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="fade-up" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="card-premium" style={{ marginBottom: 'var(--space-lg)' }}>
                        <div className="card-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <button 
                                    onClick={() => setSelectedRole(null)} 
                                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '700' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                >
                                    ← Change Target Role
                                </button>
                                <h2 style={{ fontSize: '2.25rem', fontWeight: '900', letterSpacing: '-0.04em' }}>{selectedRole.title}</h2>
                                <p className="subtitle" style={{ marginTop: '4px' }}>Complete the self-assessment to identify your learning gaps.</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Industry Alignment</p>
                                <p style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)', margin: 0, letterSpacing: '-0.04em' }}>{selectedRole.industryImpact?.relevanceScore}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/100</span></p>
                            </div>
                        </div>
                    </div>

                    <div className="section-gap">
                        <ResumeUpload onSkillsDetected={handleSkillsDetected} />
                    </div>

                    {error && (
                        <div className="section-gap" style={{ padding: '20px', background: '#fff1f2', color: 'var(--danger)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '16px', fontWeight: '700', border: '1px solid #fda4af' }}>
                            <AlertTriangle size={24} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="section-gap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Competency Checklist</h3>
                        <div className="badge badge-primary">
                            {skills.filter(s => s.proficiency >= 70).length} / {skills.length} Mastered
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                        {skills.map(skill => (
                            <motion.div 
                                key={skill._id}
                                layout
                                className="card-premium"
                            >
                                <div className="card-inner" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                    <div 
                                        onClick={() => handleProficiencyChange(skill._id, skill.proficiency >= 70 ? 0 : 100)}
                                        style={{ color: skill.proficiency >= 70 ? 'var(--success)' : 'var(--border-subtle)', cursor: 'pointer', transition: 'all 0.2s' }}
                                    >
                                        {skill.proficiency >= 70 ? <CheckCircle size={36} strokeWidth={2.5} /> : <Circle size={36} strokeWidth={2} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
                                            <h4 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>{skill.name}</h4>
                                            <span className={skill.importance === 'High' ? 'badge badge-warning' : 'badge badge-primary'} style={{ fontSize: '0.65rem' }}>
                                                {skill.importance} Priority
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} strokeWidth={2.5}/> {skill.estimatedHours}h</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18} strokeWidth={2.5}/> {skill.difficulty}</span>
                                        </div>
                                    </div>
                                    <div style={{ width: '280px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '12px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            <span>Proficiency</span>
                                            <span style={{ color: 'var(--primary)' }}>{skill.proficiency}%</span>
                                        </div>
                                        <div style={{ position: 'relative', height: '8px', background: 'var(--bg-app)', borderRadius: '10px' }}>
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.proficiency}%` }}
                                                style={{ position: 'absolute', height: '100%', background: 'var(--primary)', borderRadius: '10px' }}
                                            />
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="100" 
                                                value={skill.proficiency}
                                                onChange={(e) => handleProficiencyChange(skill._id, parseInt(e.target.value))}
                                                style={{ 
                                                    position: 'absolute', 
                                                    width: '100%', 
                                                    height: '100%', 
                                                    opacity: 0, 
                                                    cursor: 'pointer',
                                                    top: 0,
                                                    left: 0
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div style={{ marginTop: '64px', textAlign: 'center' }}>
                        <button 
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary"
                            style={{ padding: '20px 80px', fontSize: '1.1rem', borderRadius: '16px' }}
                        >
                            {saving ? 'Architecting Roadmap...' : 'Construct My Learning Path'} <Rocket size={20} style={{ marginLeft: '12px' }} />
                        </button>
                        <p style={{ marginTop: '24px', color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: '500' }}>AI will generate a personalized roadmap based on your current expertise.</p>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Wizard;
