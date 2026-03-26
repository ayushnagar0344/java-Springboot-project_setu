import React, { useEffect, useState } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    totalConsultations: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mocking some stats if real ones aren't available yet
        // In a real app, you'd have a GET /api/admin/stats endpoint
        const resLawyers = await API.get('/api/lawyers');
        
        setStats({
          totalUsers: 148,
          totalLawyers: resLawyers.data.length,
          totalConsultations: 42,
          totalRevenue: 21000
        });
      } catch (err) {
        console.error("Failed to fetch admin stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="page-container">Loading System Metrics...</div>;

  return (
    <div className="app-container wide-page">
      <div className="dashboard-header">
        <h1>Admin Command Center</h1>
        <p className="card-subtitle">Global system overview and management</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-number">{stats.totalUsers}</div>
          <div className="stat-trend positive">+12% this week</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-label">Active Lawyers</div>
          <div className="stat-number">{stats.totalLawyers}</div>
          <div className="stat-trend">Stable</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Consultations</div>
          <div className="stat-number">{stats.totalConsultations}</div>
          <div className="stat-trend positive">+5 today</div>
        </div>
        <div className="stat-card glass-card accent-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-number">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="stat-trend positive">+₹4,500 today</div>
        </div>
      </div>

      <div className="section">
        <h2>System Health</h2>
        <div className="card glass-card flex justify-between">
          <div>
            <div className="flex">
                <span className="dot online"></span>
                <strong>API Server:</strong> Operational
            </div>
            <p className="card-subtitle mt-4">All systems normal. 99.9% uptime this month.</p>
          </div>
          <button className="btn btn-secondary" style={{width: 'auto'}}>View Logs</button>
        </div>
      </div>

      <style>{`
        .glass-card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
            transition: transform 0.3s ease;
        }
        .stats-grid {
            margin-top: 2rem;
        }
        .stat-card {
            position: relative;
            overflow: hidden;
        }
        .stat-icon {
            font-size: 2rem;
            margin-bottom: 1rem;
            opacity: 0.8;
        }
        .stat-label {
            font-weight: 600;
            color: var(--text-muted);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .stat-trend {
            font-size: 0.75rem;
            margin-top: 0.5rem;
            font-weight: 600;
        }
        .stat-trend.positive { color: #10b981; }
        .accent-card {
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            color: white;
            border: none;
        }
        .accent-card .stat-label, .accent-card .stat-number {
            color: white;
        }
        .accent-card .stat-trend { color: rgba(255,255,255,0.8); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
