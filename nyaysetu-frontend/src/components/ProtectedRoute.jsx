import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // If user doesn't have required role, redirect to appropriate home
    return <Navigate to={user.role === 'LAWYER' ? '/lawyer-dashboard' : '/lawyers'} replace />;
  }

  return children;
};

export default ProtectedRoute;
