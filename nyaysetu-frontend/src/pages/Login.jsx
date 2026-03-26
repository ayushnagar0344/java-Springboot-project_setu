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
    <div className="page-container">
      <h1 className="text-center">NyaySetu</h1>
      <p className="text-center card-subtitle">Login to your account</p>
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
      <p className="text-center mt-4 card-subtitle">
        Don't have an account? <Link to="/signup" style={{color: 'var(--primary)', fontWeight: 600}}>Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
