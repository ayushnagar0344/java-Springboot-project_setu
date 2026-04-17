import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Lawyers from './pages/Lawyers';
import Slots from './pages/Slots';
import Payment from './pages/Payment';
import UserDashboard from './pages/UserDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import OnboardLawyer from './pages/OnboardLawyer';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboard" element={<OnboardLawyer />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* User Specific Routes */}
            <Route 
              path="/lawyers" 
              element={
                <ProtectedRoute roles={['USER', 'ADMIN']}>
                  <Lawyers />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/slots/:lawyerId" 
              element={
                <ProtectedRoute roles={['USER', 'ADMIN']}>
                  <Slots />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment/:id" 
              element={
                <ProtectedRoute roles={['USER', 'ADMIN']}>
                  <Payment />
                </ProtectedRoute>
              } 
            />

            {/* Common / Shared Routes */}
            <Route 
              path="/my-consultations" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Lawyer Specific Routes */}
            <Route 
              path="/lawyer-dashboard" 
              element={
                <ProtectedRoute roles={['LAWYER', 'ADMIN']}>
                  <LawyerDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute roles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
