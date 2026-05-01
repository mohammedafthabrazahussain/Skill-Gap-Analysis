import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
    BookOpen, 
    ExternalLink, 
    Clock, 
    Play, 
    FileText, 
    Award, 
    CheckCircle, 
    Circle,
    ArrowLeft,
    Monitor,
    Zap
} from 'lucide-react';

const LearningPath = () => {
    const { skillId } = useParams();
    const [resources, setResources] = useState([]);
    const [skill, setSkill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completedResources, setCompletedResources] = useState(new Set());
    const [syncing, setSyncing] = useState(null);

    useEffect(() => {
        const fetchPath = async () => {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`http://localhost:5000/api/v1/analysis/learning-path/${skillId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResources(res.data.data);
                
                const skillsRes = await axios.get('http://localhost:5000/api/v1/skills');
                const skillData = skillsRes.data.data.find(s => s._id === skillId);
                setSkill(skillData);

                // Initialize completed resources from backend data
                const completed = new Set(res.data.data.filter(r => r.completed).map(r => r._id));
                setCompletedResources(completed);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPath();
    }, [skillId]);

    const toggleResource = async (id) => {
        const idStr = id.toString();
        setSyncing(idStr);
        const url = `http://localhost:5000/api/v1/analysis/toggle-resource?t=${Date.now()}`;
        console.log('Sending toggle request to:', url);
        console.log('Resource ID:', idStr);
        const token = localStorage.getItem('token');
        try {
            const res = await axios.post(url, 
                { resourceId: idStr },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            const newSet = new Set(completedResources);
            if (newSet.has(idStr)) newSet.delete(idStr);
            else newSet.add(idStr);
            
            setCompletedResources(newSet);
        } catch (err) {
            console.error('Failed to toggle resource:', err.response?.data || err.message);
            if (err.response?.status === 404) {
                alert('Your data is out of sync with the server. Please refresh the page and try again.');
            } else {
                alert('Failed to save progress: ' + (err.response?.data?.message || err.message));
            }
        } finally {
            setSyncing(null);
        }
    };

    if (loading) return <Layout>Loading...</Layout>;

    const levels = ['Beginner', 'Intermediate', 'Advanced', 'Project'];
    const totalResources = resources.length;
    const completedCount = completedResources.size;
    const progressPercent = totalResources > 0 ? Math.round((completedCount / totalResources) * 100) : 0;

    return (
        <Layout 
            title="Skill Acceleration Path" 
            subtitle={`A scientifically curated sequence to master ${skill?.name || 'this capability'}. Follow the stages to achieve industry-standard proficiency.`}
        >
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <Link to="/learning" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', marginBottom: '48px', fontSize: '0.9rem', fontWeight: '800', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em' }} className="hover-primary">
                    <ArrowLeft size={16} strokeWidth={3} /> Back to Curriculum
                </Link>

                <div className="card-premium" style={{ marginBottom: '64px' }}>
                    <div className="card-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                    <Zap size={32} strokeWidth={2.5} />
                                </div>
                                <h2 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>{skill?.name}</h2>
                            </div>
                            <p className="subtitle" style={{ maxWidth: '500px' }}>
                                Master the core principles and advanced techniques of {skill?.name} through high-impact modules.
                            </p>
                        </div>
                        <div style={{ textAlign: 'center', minWidth: '280px', padding: '32px', background: 'var(--bg-app)', borderRadius: '24px' }}>
                            <p style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)', margin: 0, letterSpacing: '-0.04em', lineHeight: 1 }}>{progressPercent}%</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginTop: '12px', letterSpacing: '0.05em' }}>Path Completion</p>
                            <div style={{ width: '100%', height: '8px', background: 'white', borderRadius: '10px', marginTop: '24px', overflow: 'hidden' }}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--primary)' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative', paddingLeft: '32px' }}>
                    <div style={{ 
                        position: 'absolute', 
                        left: '52px', 
                        top: '0', 
                        bottom: '0', 
                        width: '2px', 
                        background: 'var(--border-subtle)',
                        zIndex: 0
                    }}></div>

                    {levels.map((level, index) => {
                        const levelResources = resources.filter(r => r.level === level);
                        if (levelResources.length === 0) return null;

                        return (
                            <div key={level} style={{ marginBottom: '80px', position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px' }}>
                                    <div style={{ 
                                        width: '44px', 
                                        height: '44px', 
                                        borderRadius: '50%', 
                                        background: 'var(--primary)', 
                                        color: 'white', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center',
                                        fontWeight: '900',
                                        fontSize: '1.2rem',
                                        boxShadow: '0 0 0 8px white'
                                    }}>
                                        {index + 1}
                                    </div>
                                    <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{level} Proficiency</h3>
                                </div>

                                <div style={{ marginLeft: '76px', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                                    {levelResources.map((res) => (
                                        <motion.div 
                                            key={res._id}
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="card-premium"
                                        >
                                            <div className="card-inner" style={{ display: 'flex', alignItems: 'center', gap: '32px', borderLeft: completedResources.has(res._id.toString()) ? '6px solid var(--success)' : '6px solid transparent' }}>
                                                <div style={{ width: '56px', height: '56px', background: 'var(--bg-app)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                                    {res.type === 'Video' ? <Play size={28} strokeWidth={2.5}/> : res.type === 'Article' ? <FileText size={28} strokeWidth={2.5}/> : <Monitor size={28} strokeWidth={2.5}/>}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0 }}>{res.title}</h4>
                                                        <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>{res.type}</span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600' }}>
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} strokeWidth={2.5}/> {res.duration}</span>
                                                        <a href={res.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }} className="hover-lift">
                                                            Module Content <ExternalLink size={18} strokeWidth={2.5}/>
                                                        </a>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => toggleResource(res._id)}
                                                    disabled={syncing === res._id.toString()}
                                                    className={completedResources.has(res._id.toString()) ? "btn-success" : "btn-secondary"}
                                                    style={{ minWidth: '160px', justifyContent: 'center' }}
                                                >
                                                    {syncing === res._id.toString() ? <Clock size={18} className="spin" /> : (completedResources.has(res._id.toString()) ? <CheckCircle size={18} strokeWidth={2.5}/> : <Circle size={18} strokeWidth={2}/>)}
                                                    {syncing === res._id.toString() ? 'Syncing...' : (completedResources.has(res._id.toString()) ? 'Mastered' : 'Mark Done')}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', position: 'relative', zIndex: 1, paddingBottom: '48px' }}>
                        <div style={{ 
                            width: '44px', 
                            height: '44px', 
                            borderRadius: '50%', 
                            background: progressPercent === 100 ? 'var(--success)' : 'white', 
                            color: progressPercent === 100 ? 'white' : 'var(--text-muted)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            boxShadow: '0 0 0 8px white',
                            border: progressPercent === 100 ? 'none' : '2px solid var(--border-subtle)'
                        }}>
                            <Award size={24} strokeWidth={2.5} />
                        </div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '800', color: progressPercent === 100 ? 'var(--success)' : 'var(--text-muted)' }}>
                            {progressPercent === 100 ? 'Skill Path Mastered!' : 'Ultimate Mastery Goal'}
                        </h3>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LearningPath;
