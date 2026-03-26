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
    <div className="page-container">
      <h1 className="text-center">NyaySetu</h1>
      <p className="text-center card-subtitle">Create an account</p>
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
        <button type="submit" className="btn mt-4">Sign Up</button>
        <p className="text-center mt-4 card-subtitle">
          Already have an account? <Link to="/" style={{color: 'var(--primary)', fontWeight: 600}}>Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
