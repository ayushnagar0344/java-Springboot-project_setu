import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState([]);

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

    const fetchCases = async () => {
        try {
            const res = await API.get('/api/cases/my');
            setCases(res.data || []);
        } catch (err) {
            console.error("Failed to fetch user cases", err);
        }
    };

    fetchDashboard();
    fetchCases();
  }, []);

  const CaseTimeline = ({ currentStatus, hearings }) => {
    const stages = [
        { id: 'INITIATED', label: 'Initiated' },
        { id: 'INVESTIGATION', label: 'Investigation' },
        { id: 'HEARING', label: 'In Hearing' },
        { id: 'FINAL_JUDGEMENT', label: 'Judgement' }
    ];

    const currentIdx = stages.findIndex(s => s.id === currentStatus);
    
    return (
        <div className="timeline-wrapper">
            <div className="timeline-line">
                <div 
                    className="timeline-progress" 
                    style={{ width: `${(currentIdx / (stages.length - 1)) * 100}%` }}
                ></div>
            </div>
            <div className="timeline-nodes">
                {stages.map((stage, idx) => (
                    <div key={stage.id} className={`timeline-node ${idx <= currentIdx ? 'active' : ''}`}>
                        <div className="node-dot">
                            {idx === currentIdx && <div className="node-pulse"></div>}
                        </div>
                        <span className="node-label">{stage.label}</span>
                        
                        {/* Tooltip for Hearing details */}
                        {stage.id === 'HEARING' && hearings && hearings.length > 0 && (
                            <div className="node-tooltip">
                                <strong>Upcoming Hearing</strong>
                                <p>🗓️ {new Date(hearings[0].hearingDate).toLocaleString()}</p>
                                <p>📍 {hearings[0].location}</p>
                                <p className="tooltip-details">{hearings[0].details}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
  };

  if (loading) return <div className="page-container">Loading...</div>;

  return (
    <div className="app-container wide-page">
      <div className="dashboard-header">
        <h1>Justice Portal: {user?.name || 'User'}</h1>
        <p className="card-subtitle">Manage your legal consultations and case proceedings.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card premium-card">
          <div className="stat-icon">⚖️</div>
          <h3>Consultations</h3>
          <p className="stat-number">{dashboardData?.totalConsultations || 0}</p>
        </div>
        <div className="stat-card premium-card">
          <div className="stat-icon">💳</div>
          <h3>To Settle</h3>
          <p className="stat-number" style={{color: 'var(--primary)'}}>{dashboardData?.pendingPayments || 0}</p>
        </div>
        <div className="stat-card premium-card">
          <div className="stat-icon">📂</div>
          <h3>Active Cases</h3>
          <p className="stat-number" style={{color: '#60a5fa'}}>{cases.length}</p>
        </div>
        <Link to="/settlements" style={{ textDecoration: 'none' }}>
          <div className="stat-card premium-card" style={{ borderTop: '3px solid #c084fc', cursor: 'pointer' }}>
            <div className="stat-icon">⚖️</div>
            <h3 style={{ color: '#c084fc' }}>Settlements</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Raise a dispute →</p>
          </div>
        </Link>
      </div>

      {/* New Case Tracking Section */}
      <div className="section">
        <h2>Active Litigation Progress</h2>
        {cases.length > 0 ? (
            <div className="litigation-list">
                {cases.map(item => (
                    <div key={item.id} className="card glass-card mb-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="case-title">{item.title}</h3>
                                <p className="case-number">{item.caseNumber} • {item.currentLocation}</p>
                            </div>
                            <span className="status-badge info">{item.status}</span>
                        </div>
                        <CaseTimeline currentStatus={item.status} hearings={item.hearings} />
                    </div>
                ))}
            </div>
        ) : (
            <div className="card glass-card empty-state">No active legal proceedings in system.</div>
        )}
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

        /* Timeline Styles */
        .timeline-wrapper {
            position: relative;
            padding: 2rem 1rem;
            margin-top: 1rem;
        }
        .timeline-line {
            position: absolute;
            top: 2rem;
            left: 2rem;
            right: 2rem;
            height: 4px;
            background: rgba(255,255,255,0.1);
            border-radius: 2px;
            z-index: 1;
        }
        .timeline-progress {
            height: 100%;
            background: linear-gradient(90deg, var(--primary), #fbbf24);
            box-shadow: 0 0 10px rgba(212, 175, 55, 0.4);
            transition: width 0.8s ease-in-out;
            border-radius: 2px;
        }
        .timeline-nodes {
            position: relative;
            display: flex;
            justify-content: space-between;
            z-index: 2;
        }
        .timeline-node {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 80px;
        }
        .node-dot {
            width: 14px;
            height: 14px;
            background: #1e1e1e;
            border: 2px solid rgba(255,255,255,0.2);
            border-radius: 50%;
            margin-bottom: 0.75rem;
            position: relative;
            transition: all 0.3s ease;
        }
        .timeline-node.active .node-dot {
            background: var(--primary);
            border-color: var(--primary);
            box-shadow: 0 0 8px var(--primary);
        }
        .node-label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--text-muted);
            white-space: nowrap;
        }
        .timeline-node.active .node-label {
            color: var(--text-main);
            font-weight: 700;
        }
        .node-pulse {
            position: absolute;
            top: -4px;
            left: -4px;
            right: -4px;
            bottom: -4px;
            border: 2px solid var(--primary);
            border-radius: 50%;
            animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(0.8); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }

        /* Tooltip Styles */
        .node-tooltip {
            position: absolute;
            bottom: 120%;
            left: 50%;
            transform: translateX(-50%) translateY(10px);
            width: 220px;
            background: var(--glass-bg);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 1rem;
            border-radius: 8px;
            font-size: 0.8rem;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 100;
            box-shadow: var(--premium-shadow);
        }
        .timeline-node:hover .node-tooltip {
            opacity: 1;
            visibility: visible;
            transform: translateX(-50%) translateY(0);
        }
        .node-tooltip strong { color: var(--primary); display: block; margin-bottom: 0.4rem; }
        .tooltip-details { font-style: italic; opacity: 0.8; margin-top: 0.4rem; }

        .case-title { font-family: 'Playfair Display', serif; color: var(--primary); font-size: 1.25rem; }
        .case-number { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }
      `}</style>
    </div>
  );
};

export default UserDashboard;
