import React, { useState } from 'react';
import axios from 'axios';
import { Upload, FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ResumeUpload = ({ onSkillsDetected }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState('');
    const { token } = useAuth();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setStatus('');
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setStatus('Analyzing your resume...');

        const formData = new FormData();
        formData.append('resume', file);
        try {
            console.log('Uploading resume with token:', token || 'fallback needed');
            const res = await axios.post('http://localhost:5000/api/v1/resume/upload', formData, {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token || localStorage.getItem('token')}`
                }
            });
            setStatus(`Analysis Complete! Detected ${res.data.count} matching skills.`);
            onSkillsDetected(res.data.data);
        } catch (err) {
            console.error('Resume Analysis Frontend Error:', err);
            setStatus('Failed to analyze resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="card-premium" style={{ padding: '40px', marginBottom: '48px', border: '2px dashed var(--border-subtle)', background: 'var(--bg-canvas)', textAlign: 'center' }}>
            <div>
                <div style={{ color: 'var(--primary)', marginBottom: '20px' }}>
                    <Upload size={48} style={{ margin: '0 auto' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px' }}>Auto-fill with Resume</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px', fontWeight: '500' }}>
                    Upload your PDF resume to automatically detect skills you already have with AI analysis.
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                    <input 
                        type="file" 
                        accept=".pdf" 
                        onChange={handleFileChange} 
                        id="resume-upload" 
                        style={{ display: 'none' }} 
                    />
                    <label 
                        htmlFor="resume-upload" 
                        style={{ 
                            padding: '12px 24px', 
                            background: 'white', 
                            border: '1px solid var(--border-subtle)', 
                            borderRadius: '12px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontWeight: '700',
                            color: 'var(--text-main)',
                            transition: 'all 0.2s',
                            boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                    >
                        {file ? <FileText size={20} color="var(--primary)" /> : <Upload size={20} color="var(--text-muted)" />}
                        {file ? file.name : 'Choose PDF File'}
                    </label>

                    {file && !uploading && (
                        <button 
                            onClick={handleUpload}
                            className="btn-primary"
                            style={{ padding: '12px 32px' }}
                        >
                            Analyze Resume Now
                        </button>
                    )}

                    {uploading && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: '700' }}>
                            <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={24} />
                            <span>Processing Resume...</span>
                        </div>
                    )}

                    {status && (
                        <div style={{ 
                            marginTop: '16px', 
                            fontSize: '0.95rem', 
                            color: status.includes('Complete') ? 'var(--success)' : status.includes('Failed') ? 'var(--danger)' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            justifyContent: 'center',
                            fontWeight: '700',
                            padding: '12px 24px',
                            background: status.includes('Complete') ? 'var(--success-light)' : status.includes('Failed') ? 'var(--danger-light)' : 'var(--primary-light)',
                            borderRadius: '12px'
                        }}>
                            {status.includes('Complete') && <CheckCircle size={20} />}
                            {status.includes('Failed') && <AlertCircle size={20} />}
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeUpload;
