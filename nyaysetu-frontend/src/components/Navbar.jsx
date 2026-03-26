import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">NyaySetu</Link>
      </div>
      <div className="navbar-links">
        {user.role === 'ADMIN' && (
          <Link to="/admin-dashboard" className="admin-pill">Admin Panel</Link>
        )}
        
        {/* Lawyer Links */}
        {user.role === 'LAWYER' && (
          <>
            <Link to="/lawyer-dashboard">Dashboard</Link>
            <Link to="/my-consultations">Consultations</Link>
          </>
        )}

        {/* User/Admin Links (Admin gets to see everything) */}
        {(user.role === 'USER' || user.role === 'ADMIN') && (
          <>
            <Link to="/lawyers">Find Lawyers</Link>
            <Link to="/my-consultations">My Bookings</Link>
          </>
        )}
        
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
