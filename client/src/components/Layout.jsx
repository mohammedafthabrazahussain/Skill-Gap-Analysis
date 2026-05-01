import React from 'react';
import Sidebar from './Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const Layout = ({ children, title, subtitle }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
            <Sidebar />
            
            <main style={{ 
                flex: 1, 
                marginLeft: '280px', 
                minHeight: '100vh',
                position: 'relative'
            }}>
                <div className="container-fluid" style={{ paddingTop: '64px', paddingBottom: '64px' }}>
                    {(title || subtitle) && (
                        <header className="section-gap" style={{ maxWidth: '800px' }}>
                            {title && (
                                <motion.h1 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {title}
                                </motion.h1>
                            )}
                            {subtitle && (
                                <motion.p 
                                    className="subtitle"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    style={{ marginTop: '12px' }}
                                >
                                    {subtitle}
                                </motion.p>
                            )}
                        </header>
                    )}
                    
                    <div className="fade-up">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
