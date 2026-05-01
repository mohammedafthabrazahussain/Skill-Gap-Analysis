import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { 
    TrendingUp, 
    CheckCircle, 
    AlertCircle, 
    Clock, 
    ArrowRight,
    Trophy,
    Target,
    Rocket,
    BookOpen,
    Zap,
    Crown
} from 'lucide-react';
import { 
    Chart as ChartJS, 
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    RadialLinearScale,
    Filler
} from 'chart.js';
import { Doughnut, Radar } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

ChartJS.register(
    ArcElement, 
    Tooltip, 
    Legend, 
    CategoryScale, 
    LinearScale, 
    PointElement, 
    LineElement, 
    RadialLinearScale,
    Filler
);

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [role, setRole] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const token = localStorage.getItem('token');
                const userRes = await axios.get('http://localhost:5000/api/v1/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(userRes.data.data);
                const roleData = userRes.data.data.targetRole;
                setRole(roleData);
                const roleId = roleData?._id || roleData;
                
                if (roleId) {
                    const res = await axios.post('http://localhost:5000/api/v1/analysis/gap', 
                        { roleId },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setData(res.data.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, []);

    if (loading) return <Layout>Loading...</Layout>;
    if (!data) return (
        <Layout title="Dashboard">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel"
                style={{ textAlign: 'center', padding: '100px' }}
            >
                <div style={{ marginBottom: '20px', color: 'var(--text-muted)' }}><Zap size={64} /></div>
                <h2 style={{ marginBottom: '10px' }}>No Roadmap Found</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Please complete the Roadmap Wizard to generate your personalized career path.</p>
                <Link to="/wizard" className="btn-primary" style={{ display: 'inline-flex', padding: '12px 30px' }}>
                    Start Journey <ArrowRight size={20} />
                </Link>
            </motion.div>
        </Layout>
    );

    const doughnutData = {
        labels: ['Completed', 'Missing'],
        datasets: [{
            data: [data.readinessScore, 100 - data.readinessScore],
            backgroundColor: ['#6366f1', 'rgba(99, 102, 241, 0.05)'],
            borderWidth: 0,
            circumference: 180,
            rotation: 270,
        }]
    };

    const radarData = {
        labels: data.completed.slice(0, 5).concat(data.gaps.slice(0, 5)).map(s => s.skill.name),
        datasets: [{
            label: 'Proficiency Level',
            data: data.completed.slice(0, 5).concat(data.gaps.slice(0, 5)).map(s => s.userLevel || s.proficiency || 0),
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderColor: '#6366f1',
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#6366f1',
            borderWidth: 3,
            fill: true
        }]
    };

    const radarOptions = {
        scales: {
            r: {
                grid: { color: 'rgba(0, 0, 0, 0.03)' },
                angleLines: { color: 'rgba(0, 0, 0, 0.03)' },
                pointLabels: { color: 'var(--text-secondary)', font: { size: 12, family: 'Outfit', weight: '600' } },
                ticks: { display: false },
                suggestedMin: 0,
                suggestedMax: 5
            }
        },
        plugins: { legend: { display: false } },
        maintainAspectRatio: false
    };

    return (
        <Layout 
            title="Career Analytics" 
            subtitle="Understand your market readiness and close the skill gaps to accelerate your career growth."
        >
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                {[
                    { icon: Target, label: 'Readiness Score', value: `${data.readinessScore}%`, color: 'var(--primary)', bg: 'var(--primary-soft)' },
                    { icon: CheckCircle, label: 'Skills Mastered', value: data.completedSkillsCount, color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' },
                    { icon: AlertCircle, label: 'Active Gaps', value: data.missingSkillsCount, color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' },
                    { icon: Clock, label: 'Learning Time', value: `${data.gaps.reduce((acc, g) => acc + (g.skill.estimatedHours || 0), 0)}h`, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' }
                ].map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="card-premium"
                    >
                        <div className="card-inner" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <div style={{ width: '56px', height: '56px', background: stat.bg, color: stat.color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <stat.icon size={28} />
                            </div>
                            <div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '1.75rem', fontWeight: '800' }}>{stat.value}</h3>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.2fr', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                <div className="card-premium">
                    <div className="card-inner">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Skill Ecosystem</h3>
                                <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Visualizing your expertise vs requirements</p>
                            </div>
                            <div style={{ padding: '8px', background: 'var(--bg-app)', borderRadius: '8px', color: 'var(--primary)' }}><Zap size={18}/></div>
                        </div>
                        <div style={{ height: '340px' }}>
                            <Radar data={radarData} options={radarOptions} />
                        </div>
                    </div>
                </div>

                <div className="card-premium">
                    <div className="card-inner" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h3 style={{ marginBottom: '32px', fontSize: '1.25rem', fontWeight: '800' }}>Match Score</h3>
                        <div style={{ position: 'relative', width: '200px' }}>
                            <Doughnut data={doughnutData} options={{ cutout: '85%', plugins: { legend: { display: false } } }} />
                            <div style={{ position: 'absolute', top: '70%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <div style={{ fontSize: '2.75rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '-0.04em' }}>{data.readinessScore}%</div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase' }}>Ready</div>
                            </div>
                        </div>
                        <div style={{ marginTop: '32px' }} className="badge badge-success">
                            <TrendingUp size={14} style={{ marginRight: '4px' }} /> Market Competitive
                        </div>
                    </div>
                </div>

                <div className="card-premium">
                    <div className="card-inner">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Market Data</h3>
                            <Crown size={20} color="var(--primary)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { label: 'Role Demand', value: role?.industryImpact?.demand || 'Critical', color: 'var(--primary)', bg: 'var(--primary-soft)' },
                                { label: 'Base Salary', value: role?.industryImpact?.avgSalary || '$115k+', color: 'var(--success)', bg: 'rgba(16, 185, 129, 0.1)' },
                                { label: 'Growth Prob.', value: `${role?.industryImpact?.relevanceScore || 98}%`, color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' }
                            ].map((insight, i) => (
                                <div key={i} style={{ padding: '20px', background: insight.bg, borderRadius: '16px' }}>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{insight.label}</p>
                                    <h4 style={{ fontWeight: '800', fontSize: '1.35rem', color: insight.color, margin: 0 }}>{insight.value}</h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 'var(--space-md)' }}>
                <div className="card-premium">
                    <div className="card-inner">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Top Priorities</h3>
                                <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Skills with maximum career impact</p>
                            </div>
                            <Trophy size={20} color="var(--warning)" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {data.recommendations.map((rec, i) => (
                                <Link 
                                    key={i} 
                                    to={`/learning-path/${rec.skill._id}`} 
                                    className="card-premium"
                                    style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center', 
                                        padding: '16px 20px', 
                                        background: 'var(--bg-app)',
                                        textDecoration: 'none',
                                        boxShadow: 'none'
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
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', margin: 0 }}>{rec.skill.name}</p>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Priority: High Impact</p>
                                    </div>
                                    <ArrowRight size={18} color="var(--primary)" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card-premium">
                    <div className="card-inner">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Milestones</h3>
                                <p className="text-small" style={{ color: 'var(--text-secondary)' }}>Track your professional achievements</p>
                            </div>
                            <div className="badge badge-primary">
                                {Math.floor((data.completedSkillsCount / (data.completedSkillsCount + data.missingSkillsCount)) * 100)}% Mastered
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '32px' }}>
                            {[
                                { icon: <Rocket size={20}/>, name: "Starter", color: "var(--primary)", unlocked: true },
                                { icon: <Trophy size={20}/>, name: "Expert", color: "var(--warning)", unlocked: data.completedSkillsCount >= 5 },
                                { icon: <Target size={20}/>, name: "Striker", color: "var(--success)", unlocked: data.readinessScore >= 50 },
                                { icon: <BookOpen size={20}/>, name: "Scholar", color: "#ec4899", unlocked: true },
                                { icon: <Crown size={20}/>, name: "Elite", color: "var(--primary)", unlocked: data.readinessScore >= 90 },
                                { icon: <Zap size={20}/>, name: "Active", color: "#06b6d4", unlocked: true }
                            ].map((badge, i) => (
                                <div key={i} style={{ 
                                    textAlign: 'center', 
                                    padding: '20px 10px', 
                                    borderRadius: '16px', 
                                    background: badge.unlocked ? 'var(--bg-app)' : 'rgba(0,0,0,0.02)',
                                    opacity: badge.unlocked ? 1 : 0.4,
                                    transition: 'all 0.2s ease'
                                }}>
                                    <div style={{ color: badge.unlocked ? badge.color : 'var(--text-muted)', marginBottom: '8px', display: 'flex', justifyContent: 'center' }}>
                                        {badge.icon}
                                    </div>
                                    <p style={{ fontSize: '0.7rem', fontWeight: '800', color: badge.unlocked ? 'var(--text-main)' : 'var(--text-muted)', textTransform: 'uppercase', margin: 0 }}>{badge.name}</p>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>Learning Streak</span>
                                <span style={{ fontWeight: '800', color: 'var(--warning)' }}>{user?.streak?.current || 0} Days 🔥</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)', fontWeight: '600', fontSize: '0.95rem' }}>Next Achievement</span>
                                <span style={{ fontWeight: '800', color: 'var(--primary)' }}>Skill Master (2 left)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
