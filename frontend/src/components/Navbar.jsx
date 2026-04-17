import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
              <img src="/nyay_setu_seal.png" alt="NyaySetu Seal" className="navbar-logo" />
          </Link>
        </div>
        
        <div className="navbar-tabs">
          {!user ? (
            <>
              <NavLink to="/" end className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>Home</NavLink>
              <NavLink to="/onboard" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>Join</NavLink>
              <NavLink to="/login" className={({ isActive }) => `tab-link login-tab ${isActive ? 'active' : ''}`}>Log In</NavLink>
            </>
          ) : (
            <>
              {/* Common Links */}
              {(user.role === 'USER' || user.role === 'ADMIN') && (
                <>
                  <NavLink to="/lawyers" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>Registry</NavLink>
                  <NavLink to="/my-consultations" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>Bookings</NavLink>
                </>
              )}
              
              {/* Lawyer Links */}
              {user.role === 'LAWYER' && (
                <>
                  <NavLink to="/lawyer-dashboard" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>Dashboard</NavLink>
                  <NavLink to="/my-consultations" className={({ isActive }) => `tab-link ${isActive ? 'active' : ''}`}>Case Log</NavLink>
                </>
              )}

              {user.role === 'ADMIN' && (
                <NavLink to="/admin-dashboard" className={({ isActive }) => `tab-link admin-tab ${isActive ? 'active' : ''}`}>Admin</NavLink>
              )}
              
              <div className="user-profile-tab" onClick={handleLogout} title="Click to Logout">
                  <span className="user-initial">{user.name?.charAt(0) || 'U'}</span>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
