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
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [lawyers, setLawyers] = useState([]);
  const [cases, setCases] = useState([]);
  const [applications, setApplications] = useState([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);
  const [logFilter, setLogFilter] = useState('');

  useEffect(() => {
    fetchStats();
    fetchLawyers();
    fetchCases();
    fetchApplications();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get('/api/admin/stats');
      setStats({
        totalUsers: res.data.totalUsers || 0,
        totalLawyers: res.data.totalLawyers || 0,
        totalConsultations: res.data.totalConsultations || 0,
        totalRevenue: res.data.totalRevenue || 0
      });
    } catch (err) {
      console.error("Failed to fetch admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLawyers = async () => {
    try {
        const res = await API.get('/api/lawyers');
        setLawyers(res.data || []);
    } catch (err) {
        console.error("Failed to fetch lawyers list", err);
    }
  };

  const fetchCases = async () => {
    try {
        const res = await API.get('/api/cases/all');
        const data = res.data?.data || res.data; // Handle different wrapper formats
        setCases(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error("Failed to fetch cases list", err);
    }
  };

  const fetchApplications = async () => {
    try {
        const res = await API.get('/api/onboarding/pending');
        setApplications(res.data?.data || res.data || []);
    } catch (err) {
        console.error("Failed to fetch pending applications", err);
    }
  };

  const handleApprove = async (id) => {
    if(window.confirm("Verify and Approve this lawyer for active practice?")) {
        try {
            await API.post(`/api/onboarding/${id}/approve`);
            fetchApplications();
            fetchLawyers();
            fetchStats();
            alert("Lawyer approved and account generated successfully.");
        } catch (err) {
            alert("Approval failed: " + err.message);
        }
    }
  };

  const handleReject = async (id) => {
    if(window.confirm("Reject this application?")) {
        await API.post(`/api/onboarding/${id}/reject`);
        fetchApplications();
        fetchStats();
    }
  };

  const handleViewLogs = () => {
    setShowLogs(true);
    fetchLogs();
  };

  const fetchLogs = async () => {
    setFetchingLogs(true);
    try {
      const res = await API.get('/api/admin/logs');
      // Defensive check: handle both array and string (legacy)
      setLogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setFetchingLogs(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    (log.message?.toLowerCase().includes(logFilter.toLowerCase()) || false) ||
    (log.source?.toLowerCase().includes(logFilter.toLowerCase()) || false) ||
    (log.level?.toLowerCase().includes(logFilter.toLowerCase()) || false)
  );

  if (loading) return <div className="page-container">Loading Systems Command...</div>;

  return (
    <div className="app-container wide-page">
      <div className="dashboard-header">
        <h1>Admin Control Center</h1>
        <p className="card-subtitle">Global oversight and secure log management</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-number">{stats.totalUsers}</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-label">Verified Lawyers</div>
          <div className="stat-number">{stats.totalLawyers}</div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon">📅</div>
          <div className="stat-label">Total Bookings</div>
          <div className="stat-number">{stats.totalConsultations}</div>
        </div>
        <div className="stat-card glass-card accent-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Settled Revenue</div>
          <div className="stat-number">₹{stats.totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      <div className="section">
        <div className="flex justify-between items-center mb-4">
            <h2>Judicial Verification Desk (Pending Lawyers)</h2>
            <p className="card-subtitle">Review credentials and Bar Council enrollment</p>
        </div>
        <div className="card glass-card" style={{padding: 0, overflow: 'hidden'}}>
            <table className="logs-table">
                <thead>
                    <tr>
                        <th>Identity</th>
                        <th>Domain</th>
                        <th>BCI Enrollment</th>
                        <th>Experience</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map(app => (
                        <tr key={app.id} className="log-row">
                            <td>
                                <div style={{fontWeight: 700}}>{app.name}</div>
                                <div style={{fontSize: '0.75rem', opacity: 0.7}}>{app.phoneNumber}</div>
                            </td>
                            <td>{app.specialization}</td>
                            <td>
                                <code style={{color: 'var(--primary)', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px'}}>
                                    {app.barCouncilId}
                                </code>
                            </td>
                            <td>{app.experienceYears} Years</td>
                            <td>
                                <div className="flex gap-2">
                                    <button className="btn-small" style={{background: '#10b981', margin: 0}} onClick={() => handleApprove(app.id)}>Approve</button>
                                    <button className="btn-small" style={{background: '#ef4444', margin: 0}} onClick={() => handleReject(app.id)}>Reject</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {applications.length === 0 && (
                        <tr><td colSpan="5" className="text-center">No pending lawyer applications.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <div className="section">
        <div className="flex justify-between items-center mb-4">
            <h2>Judicial Case Registry</h2>
            <p className="card-subtitle">Global tracking of active litigation progress</p>
        </div>
        <div className="card glass-card" style={{padding: 0, overflow: 'hidden'}}>
            <table className="logs-table">
                <thead>
                    <tr>
                        <th>Case #</th>
                        <th>Title</th>
                        <th>Status</th>
                        <th>Location</th>
                        <th>Associated Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {cases.map(item => (
                        <tr key={item.id} className="log-row">
                            <td style={{color: 'var(--primary)', fontWeight: 700}}>{item.caseNumber}</td>
                            <td>{item.title}</td>
                            <td>
                                <span className={`log-level-badge info`}>
                                    {item.status}
                                </span>
                            </td>
                            <td>{item.currentLocation}</td>
                            <td>{item.userPhoneNumber}</td>
                        </tr>
                    ))}
                    {cases.length === 0 && (
                        <tr><td colSpan="5" className="text-center">No active litigations found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <div className="section">
        <div className="flex justify-between items-center mb-4">
            <h2>Merchant Registry (Lawyers)</h2>
            <button className="btn-small" style={{width: 'auto', background: 'var(--primary-hover)'}} onClick={async () => {
                if(window.confirm("Force sync database with sample legal experts?")) {
                    await API.get('/api/admin/seed');
                    fetchLawyers();
                    fetchStats();
                    alert("System records synced successfully.");
                }
            }}>Sync Records ⚖️</button>
        </div>
        <div className="card glass-card" style={{padding: 0, overflow: 'hidden'}}>
            <table className="logs-table">
                <thead>
                    <tr>
                        <th>Identity</th>
                        <th>specialization</th>
                        <th>City</th>
                        <th>Rating</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {lawyers.map(lawyer => (
                        <tr key={lawyer.id} className="log-row">
                            <td style={{color: 'var(--primary)', fontWeight: 600}}>{lawyer.name}</td>
                            <td>{lawyer.specialization}</td>
                            <td>{lawyer.city}</td>
                            <td>⭐ {lawyer.rating}</td>
                            <td>
                                <span className={`log-level-badge ${lawyer.online || lawyer.isOnline ? 'info' : 'debug'}`}>
                                    {lawyer.online || lawyer.isOnline ? 'ONLINE' : 'OFFLINE'}
                                </span>
                            </td>
                        </tr>
                    ))}
                    {lawyers.length === 0 && (
                        <tr><td colSpan="5" className="text-center">No lawyers registered in system.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      <div className="section">
        <h2>System Monitoring</h2>
        <div className="card glass-card flex justify-between">
          <div>
            <div className="flex">
                <span className="dot online"></span>
                <strong>API Node:</strong> Justice-Region-1 (Operational)
            </div>
            <p className="card-subtitle mt-4">Security protocols active. Real-time logging enabled.</p>
          </div>
          <button className="btn btn-secondary" style={{width: 'auto'}} onClick={handleViewLogs}>Explore Logs</button>
        </div>
      </div>

      {showLogs && (
        <div className="logs-modal-overlay">
          <div className="logs-modal">
            <div className="flex justify-between items-center mb-4">
               <div>
                 <h2 style={{margin: 0}}>Advanced Log Dashboard</h2>
                 <p className="card-subtitle" style={{margin: 0}}>Tracing events from JusticeBot and System Modules</p>
               </div>
               <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="Search by source or level..." 
                    className="log-search"
                    value={logFilter}
                    onChange={(e) => setLogFilter(e.target.value)}
                 />
                 <button className="btn-small" onClick={fetchLogs} disabled={fetchingLogs}>
                   {fetchingLogs ? 'Syncing...' : '🔄 Sync'}
                 </button>
                 <button className="btn-small" style={{background: '#e74c3c'}} onClick={() => setShowLogs(false)}>Close</button>
               </div>
            </div>
            
            <div className="logs-explorer">
              <table className="logs-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>Source (Where Coming)</th>
                    <th>Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((entry, idx) => (
                    <tr key={idx} className={`log-row level-${entry.level?.toLowerCase()}`}>
                       <td>{entry.timestamp}</td>
                       <td><span className={`log-level-badge ${entry.level?.toLowerCase()}`}>{entry.level}</span></td>
                       <td className="log-source">{entry.source}</td>
                       <td className="log-msg">{entry.message}</td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr><td colSpan="4" className="text-center">No matching system logs found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .glass-card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--border-color);
        }
        .stat-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
            opacity: 0.7;
        }
        .stat-label {
            font-weight: 600;
            color: var(--text-muted);
            font-size: 0.8rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .accent-card {
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(18, 18, 20, 0.8) 100%);
            border: 1px solid var(--primary);
        }

        .logs-modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.85);
            display: flex; align-items: center; justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(8px);
        }
        .logs-modal {
            background: #141418;
            width: 95%; max-width: 1200px;
            height: 85vh;
            border-radius: var(--radius);
            border: 1px solid var(--border-color);
            padding: 2rem;
            display: flex; flex-direction: column;
        }
        .log-search {
            width: 250px;
            padding: 0.4rem 0.8rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border-color);
            border-radius: 6px;
            color: white;
            font-size: 0.85rem;
        }
        .logs-explorer {
            flex: 1;
            margin-top: 1rem;
            overflow-y: auto;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            background: rgba(0,0,0,0.3);
        }
        .logs-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.85rem;
            color: #ccc;
        }
        .logs-table th {
            text-align: left;
            padding: 1rem;
            background: #1e1e24;
            color: var(--primary);
            position: sticky;
            top: 0;
            z-index: 2;
        }
        .logs-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            vertical-align: top;
        }
        .log-row:hover { background: rgba(255,255,255,0.05); }
        
        .log-level-badge {
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-weight: bold;
            font-size: 0.7rem;
            text-transform: uppercase;
        }
        .log-level-badge.error { background: #fee2e2; color: #991b1b; }
        .log-level-badge.warn { background: #ffedd5; color: #9a3412; }
        .log-level-badge.info { background: #dcfce7; color: #166534; }
        .log-level-badge.debug { background: #f1f5f9; color: #475569; }

        .log-source { color: var(--primary); font-family: monospace; }
        .log-msg { font-family: 'Inter', sans-serif; white-space: pre-wrap; word-break: break-all; }
        
        .gap-2 { gap: 0.5rem; }
        .items-center { align-items: center; }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
