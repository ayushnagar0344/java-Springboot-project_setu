import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const OnboardLawyer = () => {
    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        email: '',
        specialization: '',
        city: '',
        experienceYears: '',
        barCouncilId: '',
        shortBio: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await API.post('/api/onboarding/apply', formData);
            setSuccess(true);
            setTimeout(() => navigate('/'), 5000);
        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit application. Please check details.");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="page-container text-center">
                <div className="success-icon" style={{fontSize: '4rem', marginBottom: '1rem'}}>📋⚖️</div>
                <h1>Application Received</h1>
                <p>Your credentials have been submitted for judicial review. Our administrative board will verify your Bar Council ID and experience.</p>
                <p className="mt-4" style={{color: 'var(--primary)'}}>You will be redirected to the home page shortly.</p>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="page-container wide-page">
                <div className="text-center mb-8">
                    <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem'}}>Join the Judicial Registry</h1>
                    <p className="card-subtitle">Register your practice on NyaySetu - The Integrated Legal Marketplace</p>
                </div>

                <form onSubmit={handleSubmit} className="premium-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Legal Name</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="Adv. Your Name"
                            />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number (For Registry Login)</label>
                            <input 
                                type="tel" 
                                required 
                                value={formData.phoneNumber}
                                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                placeholder="10 Digits"
                            />
                        </div>
                        <div className="form-group">
                            <label>Primary Specialization</label>
                            <select 
                                required
                                value={formData.specialization}
                                onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                            >
                                <option value="">Select Domain</option>
                                <option value="Criminal Law">Criminal Law</option>
                                <option value="Corporate Law">Corporate Law</option>
                                <option value="Family Law">Family & Divorce</option>
                                <option value="Civil Litigation">Civil Litigation</option>
                                <option value="Constitutional Law">Constitutional Law</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Experience (Years)</label>
                            <input 
                                type="number" 
                                required 
                                value={formData.experienceYears}
                                onChange={(e) => setFormData({...formData, experienceYears: e.target.value})}
                            />
                        </div>
                        <div className="form-group">
                            <label>Bar Council Enrollment ID (Secure/Encrypted)</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.barCouncilId}
                                onChange={(e) => setFormData({...formData, barCouncilId: e.target.value})}
                                placeholder="BCI/XXXX/2026"
                            />
                        </div>
                        <div className="form-group">
                            <label>Practice City</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.city}
                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-group mt-4">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div className="form-group mt-4">
                        <label>Professional Bio / Profile Introduction</label>
                        <textarea 
                            rows="4"
                            value={formData.shortBio}
                            onChange={(e) => setFormData({...formData, shortBio: e.target.value})}
                            placeholder="Tell users about your legal expertise..."
                        ></textarea>
                    </div>

                    <button type="submit" className="btn mt-6" disabled={submitting}>
                        {submitting ? 'Authenticating & Submitting...' : 'Submit to Judicial Board'}
                    </button>
                </form>
            </div>
            
            <style>{`
                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.5rem;
                }
                .mb-8 { margin-bottom: 2rem; }
                .mt-6 { margin-top: 1.5rem; }
                @media (max-width: 768px) {
                    .form-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default OnboardLawyer;
