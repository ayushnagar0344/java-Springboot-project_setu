import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/auth/signup', formData);
      alert("Registration successful! Please login.");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Signup failed");
    }
  };

  return (
    <div className="page-container auth-container">
      <div className="auth-header">
        <img src="/nyay_setu_seal.png" alt="Seal" className="auth-seal" />
        <h1>Join NyaySetu</h1>
        <p className="card-subtitle">Connect with Elite Legal Professionals</p>
      </div>
      <p className="text-center mb-6">Create your account to start your legal journey</p>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="name"
            value={formData.name} 
            onChange={handleChange} 
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="text" 
            name="phoneNumber"
            value={formData.phoneNumber} 
            onChange={handleChange} 
            placeholder="Enter phone number"
            required
            minLength={10}
            maxLength={15}
          />
        </div>
        <div className="form-group">
          <label>Email (Optional)</label>
          <input 
            type="email" 
            name="email"
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Enter email address"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password"
            value={formData.password} 
            onChange={handleChange} 
            placeholder="Enter password (min 6 chars)"
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="btn mt-4">Create Account</button>
        <p className="text-center mt-6 card-subtitle">
          Already have an account? <Link to="/" className="gold-link">Login here</Link>
        </p>
      </form>
      <style>{`
        .auth-container {
          max-width: 500px;
          margin-top: 5rem;
          border-top: 3px solid var(--primary);
        }
        .auth-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .auth-seal {
          width: 80px;
          height: 80px;
          margin: 0 auto 1.5rem;
          display: block;
          filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.4));
        }
        .mb-6 { margin-bottom: 2rem; }
        .mt-6 { margin-top: 1.5rem; }
        .gold-link {
          color: var(--primary);
          font-weight: 600;
          text-decoration: none;
          transition: border-bottom 0.2s;
          border-bottom: 1px solid transparent;
        }
        .gold-link:hover {
          border-bottom: 1px solid var(--primary);
        }
      `}</style>
    </div>
  );
};

export default Signup;
