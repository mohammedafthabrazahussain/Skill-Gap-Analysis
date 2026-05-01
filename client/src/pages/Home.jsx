import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rocket, Target, BarChart, BookOpen, ShieldCheck } from 'lucide-react';

const Home = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
            <nav style={{ padding: '24px 0', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.75rem', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px', letterSpacing: '-0.04em' }}>
                        <div style={{ padding: '8px', background: 'var(--primary)', color: 'white', borderRadius: '10px', display: 'flex' }}>
                            <Rocket size={24} strokeWidth={2.5} />
                        </div>
                        SkillGap<span style={{ color: 'var(--primary)' }}>.AI</span>
                    </div>
                    <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                        <Link to="/login" style={{ fontWeight: '800', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.95rem' }} className="hover-primary">Access Portal</Link>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px' }}>Start Transformation</Link>
                    </div>
                </div>
            </nav>

            <main style={{ flex: 1 }}>
                <section style={{ padding: '160px 0 120px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, var(--primary-soft) 0%, transparent 70%)', opacity: 0.5, zIndex: 0 }}></div>
                    <div className="container-fluid" style={{ position: 'relative', zIndex: 1 }}>
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ fontSize: '5.5rem', fontWeight: '900', marginBottom: '32px', lineHeight: '1.0', letterSpacing: '-0.05em' }}
                        >
                            Architect Your <br />
                            <span style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #818cf8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Professional Future</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', maxWidth: '800px', margin: '0 auto 56px', fontWeight: '500', lineHeight: '1.6' }}
                        >
                            Harness the power of AI to identify strategic skill gaps, curate specialized learning trajectories, and dominate your target industry roles.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}
                        >
                            <Link to="/register" className="btn btn-primary" style={{ padding: '18px 48px', fontSize: '1.1rem' }}>Initiate Skill Analysis</Link>
                            <Link to="/login" className="btn btn-secondary" style={{ padding: '18px 48px', fontSize: '1.1rem' }}>Enter Infrastructure</Link>
                        </motion.div>
                    </div>
                </section>

                <section style={{ padding: '120px 0', background: 'white' }}>
                    <div className="container-fluid">
                        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                            <span className="badge badge-primary" style={{ marginBottom: '16px' }}>Core Capabilities</span>
                            <h2 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Engineered for Advancement</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
                            {[
                                { icon: <Target />, title: "Precision Mapping", desc: "Identify the exact cryptographic signatures of success for any corporate role." },
                                { icon: <BarChart />, title: "Velocity Tracking", desc: "Monitor your acceleration through interactive telemetry and readiness metrics." },
                                { icon: <BookOpen />, title: "Curated Knowledge", desc: "Access a synchronized sequence of high-impact resources for rapid mastery." },
                                { icon: <ShieldCheck />, title: "Market Validation", desc: "Confirm your readiness for high-stakes interviews with data-backed confidence." }
                            ].map((feature, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="card-premium"
                                >
                                    <div className="card-inner" style={{ padding: '48px', textAlign: 'center' }}>
                                        <div style={{ color: 'var(--primary)', marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                                            {React.cloneElement(feature.icon, { size: 48, strokeWidth: 2.5 })}
                                        </div>
                                        <h3 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: '800' }}>{feature.title}</h3>
                                        <p className="text-small" style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontWeight: '600' }}>{feature.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer style={{ padding: '80px 0', background: 'var(--bg-app)', borderTop: '1px solid var(--border-subtle)' }}>
                <div className="container-fluid" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '10px', letterSpacing: '-0.03em' }}>
                        SkillGap<span style={{ color: 'var(--primary)' }}>.AI</span>
                    </div>
                    <p className="text-small" style={{ color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        &copy; 2024 Strategic Career Infrastructure. Powered by Intelligence.
                    </p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <Link to="#" className="text-small hover-primary" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>System Status</Link>
                        <Link to="#" className="text-small hover-primary" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Protocol</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
