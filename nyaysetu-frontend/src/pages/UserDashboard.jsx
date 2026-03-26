import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await API.get('/api/dashboard/user');
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
        <h1>Welcome, {user?.name || 'User'}!</h1>
        <p className="card-subtitle">Here's an overview of your consultations.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Consultations</h3>
          <p className="stat-number">{dashboardData?.totalConsultations || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Payments</h3>
          <p className="stat-number" style={{color: '#e67e22'}}>{dashboardData?.pendingPayments || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Confirmed Sessions</h3>
          <p className="stat-number" style={{color: '#27ae60'}}>{dashboardData?.bookedConsultations || 0}</p>
        </div>
      </div>

      <div className="recent-activity section">
        <h2>Recent Consultations</h2>
        {dashboardData?.recentConsultations?.length > 0 ? (
          <div className="consultation-list">
            {dashboardData.recentConsultations.map(c => (
              <div key={c.id} className="consultation-card">
                <div className="consultation-info">
                  <strong>{c.lawyerName}</strong>
                  <span>{new Date(c.consultationTime).toLocaleString()}</span>
                </div>
                <div className="consultation-actions">
                  <span className={`status-badge ${c.status.toLowerCase()}`}>{c.status}</span>
                  {c.status === 'PENDING_PAYMENT' && (
                    <Link to={`/payment/${c.id}`} className="btn-small">Pay Now</Link>
                  )}
                  {c.status === 'BOOKED' && (
                    <button className="btn-small btn-success" onClick={() => window.open(c.meetingLink, '_blank')}>Join Meeting</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No consultations found. <Link to="/lawyers">Book one now!</Link></p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
