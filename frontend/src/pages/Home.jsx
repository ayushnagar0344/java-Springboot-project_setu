import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-root">
            {/* Hero Section */}
            <header className="hero-section">
                <div className="hero-overlay"></div>
                <div className="hero-content">
                    <img src="/nyay_setu_seal.png" alt="NyaySetu Seal" className="hero-seal" />
                    <h1 className="hero-title">Justice Unleashed. <br/><span>Digitally Integrated.</span></h1>
                    <p className="hero-tagline">
                        Experience the first professional-grade judicial marketplace. 
                        Connecting citizens with verified legal experts, real-time case tracking, and secure digital settlements.
                    </p>
                    <div className="hero-cta">
                        <Link to="/lawyers" className="btn btn-primary-gold">Find a Lawyer</Link>
                        <Link to="/onboard" className="btn btn-outline">Join the Registry</Link>
                    </div>
                </div>
            </header>

            {/* Impact Section */}
            <section className="impact-section">
                <div className="impact-grid">
                    <div className="impact-card">
                        <h3>5,000+</h3>
                        <p>Successful Consultations</p>
                    </div>
                    <div className="impact-card">
                        <h3>450+</h3>
                        <p>Verified Advocates</p>
                    </div>
                    <div className="impact-card">
                        <h3>12M</h3>
                        <p>Settle Volume</p>
                    </div>
                </div>
            </section>

            {/* Services Overview */}
            <section className="services-overview">
                <h2 className="section-title">The Judicial Ecosystem</h2>
                <div className="services-grid">
                    <div className="service-feature-card">
                        <div className="feature-icon">⚖️</div>
                        <h4>Expert Marketplace</h4>
                        <p>Browse a curated directory of specialized lawyers across Criminal, Corporate, and Family law.</p>
                    </div>
                    <div className="service-feature-card">
                        <div className="feature-icon">⏳</div>
                        <h4>Case Timeline</h4>
                        <p>Track your litigation progress in real-time with our proprietary Judicial Progress Line.</p>
                    </div>
                    <div className="service-feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h4>Secure Settlements</h4>
                        <p>Integrated payment protocols ensuring transparency and accountability for every booking.</p>
                    </div>
                </div>
            </section>

            {/* Footer / CTA */}
            <footer className="home-footer">
                <div className="footer-content">
                    <p>&copy; 2026 NyaySetu • The Integrated Judicial Marketplace • All Rights Reserved</p>
                    <div className="footer-links">
                        <a href="#">Privacy Protocol</a>
                        <a href="#">Terms of Justice</a>
                        <a href="#">Contact Registry</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
