import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

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
    <div className="app-container wide-page">
      <div className="dashboard-header">
        <h1>Advocate Chambers: {user?.name}</h1>
        <p className="card-subtitle">Elite Counsel Management & Case Scheduling Dashboard</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card premium-card">
          <div className="stat-icon">👥</div>
          <h3>Total Clients</h3>
          <p className="stat-number">{dashboardData?.totalConsultations || 0}</p>
        </div>
        <div className="stat-card premium-card">
          <div className="stat-icon">📅</div>
          <h3>Upcoming</h3>
          <p className="stat-number" style={{color: 'var(--primary)'}}>{dashboardData?.upcomingConsultations || 0}</p>
        </div>
        <div className="stat-card premium-card">
          <div className="stat-icon">💰</div>
          <h3>Revenue</h3>
          <p className="stat-number" style={{color: '#86efac'}}>₹{dashboardData?.totalEarnings || 0}</p>
        </div>
        <div className="stat-card premium-card">
          <div className="stat-icon">🕗</div>
          <h3>Active Slots</h3>
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
          <h2>Advocate Actions</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" style={{ width: 'auto' }} onClick={() => alert("Auto-slot generation triggered!")}>
              Sync Available Slots
            </button>
            <Link to="/lawyer-settlements" className="btn" style={{ width: 'auto', background: 'rgba(168,85,247,0.2)', border: '1px solid #c084fc', color: '#c084fc' }}>
              ⚖️ View My Settlements
            </Link>
          </div>
      </div>

      <style>{`
        .premium-card {
           position: relative;
           overflow: hidden;
           border-top: 3px solid var(--primary);
        }
        .stat-icon {
           font-size: 1.5rem;
           margin-bottom: 0.5rem;
           opacity: 0.8;
        }
        .section h2 {
           margin-bottom: 2rem;
           border-left: 4px solid var(--primary);
           padding-left: 1rem;
        }
      `}</style>
    </div>
  );
};

export default LawyerDashboard;
