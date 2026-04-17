import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/api/auth/login', { phoneNumber, password });
      // res is already the data because of the interceptor
      const { token, role, name } = res.data;
      login(token, role, phoneNumber, name);
      
      if (role === 'LAWYER') {
        navigate('/lawyer-dashboard');
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/lawyers');
      }
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Login failed");
    }
  };

  return (
    <div className="page-container auth-container">
      <div className="auth-header">
        <img src="/nyay_setu_seal.png" alt="Seal" className="auth-seal" />
        <h1>NyaySetu</h1>
        <p className="card-subtitle">Elite Legal Consultation Marketplace</p>
      </div>
      <p className="text-center mb-6">Secure login to your professional dashboard</p>
      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="text" 
            value={phoneNumber} 
            onChange={(e) => setPhoneNumber(e.target.value)} 
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter password"
            required
          />
        </div>
        <button type="submit" className="btn mt-4">Login</button>
      </form>
      <p className="text-center mt-6 card-subtitle">
        Don't have an account? <Link to="/signup" className="gold-link">Create one now</Link>
      </p>
      <style>{`
        .auth-container {
          max-width: 450px;
          margin-top: 8rem;
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

export default Login;
