import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';

const LawyerDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/api/dashboard/lawyer');
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Lawyer Portal: {user?.name}</h1>
        <p className="card-subtitle">Manage your schedule and consultations.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p className="stat-number">{dashboardData?.totalConsultations || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming</h3>
          <p className="stat-number" style={{color: '#3498db'}}>{dashboardData?.upcomingConsultations || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="stat-number" style={{color: '#27ae60'}}>₹{dashboardData?.totalEarnings || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Active Slots (Today)</h3>
          <p className="stat-number">{dashboardData?.availableSlotsToday || 0}</p>
        </div>
      </div>

      <div className="recent-activity section">
        <h2>Recent Appointments</h2>
        {dashboardData?.recentConsultations?.length > 0 ? (
          <div className="consultation-list">
            {dashboardData.recentConsultations.map(c => (
              <div key={c.id} className="consultation-card">
                <div className="consultation-info">
                  <strong>Client ID: {c.id}</strong>
                  <span>{new Date(c.consultationTime).toLocaleString()}</span>
                </div>
                <div className="consultation-actions">
                  <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                  {c.status === 'BOOKED' && (
                    <button className="btn-small btn-success" onClick={() => window.open(c.meetingLink, '_blank')}>Join Meeting</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No appointments found. Make sure your slots are generated!</p>
        )}
      </div>

      <div className="admin-actions mt-4 section">
          <h2>Actions</h2>
          <button className="btn" style={{background: '#3498db'}} onClick={() => alert("Auto-slot generation triggered!")}>
              Sync Available Slots
          </button>
      </div>
    </div>
  );
};

export default LawyerDashboard;
