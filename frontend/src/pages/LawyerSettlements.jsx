import React, { useState, useEffect } from 'react';
import API from '../services/api';

const statusColor = {
  RAISED: '#facc15', LAWYER_ASSIGNED: '#60a5fa', NOTICE_SENT: '#c084fc',
  UNDER_NEGOTIATION: '#fb923c', RESOLVED: '#4ade80', CLOSED: '#94a3b8',
};

export default function LawyerSettlements() {
  const [settlements, setSettlements] = useState([]);
  const [noticeMsgs, setNoticeMsgs] = useState({});
  const [activeNotice, setActiveNotice] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => { fetchSettlements(); }, []);

  const fetchSettlements = async () => {
    try {
      const res = await API.get('/api/settlements/lawyer');
      setSettlements(res.data.data || []);
    } catch { setMsg('Failed to load settlements.'); }
  };

  const sendNotice = async (id) => {
    const message = noticeMsgs[id];
    if (!message) return setMsg('Please enter a notice message.');
    try {
      await API.put(`/api/settlements/${id}/notice`, { message });
      setMsg('✅ Notice sent successfully!');
      setActiveNotice(null);
      fetchSettlements();
    } catch (err) { setMsg(err.response?.data?.message || 'Failed to send notice.'); }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/settlements/${id}/status`, { status });
      setMsg(`✅ Status updated to ${status.replace('_', ' ')}`);
      fetchSettlements();
    } catch (err) { setMsg(err.response?.data?.message || 'Failed to update status.'); }
  };

  return (
    <div className="page-container wide-page" style={{ maxWidth: 900, margin: '2rem auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1>⚖️ My Assigned Settlements</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Review disputes assigned to you. Send formal notices and manage resolutions.</p>
      </div>

      {msg && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.5rem',
          background: msg.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${msg.startsWith('✅') ? '#4ade80' : '#f87171'}`,
          color: msg.startsWith('✅') ? '#4ade80' : '#f87171' }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {settlements.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '2rem' }}>📋</p>
            <p style={{ marginTop: '0.5rem' }}>No settlements assigned to you yet.</p>
          </div>
        ) : settlements.map(s => (
          <div key={s.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: 'var(--primary)', margin: '0 0 0.25rem' }}>{s.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>Filed by: {s.raisedByPhone}</p>
              </div>
              <span style={{ padding: '0.2rem 0.75rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                background: `${statusColor[s.status]}22`, color: statusColor[s.status], border: `1px solid ${statusColor[s.status]}` }}>
                {s.status.replace(/_/g, ' ')}
              </span>
            </div>

            <p style={{ color: 'var(--text-main)', fontSize: '0.875rem', marginBottom: '1rem', lineHeight: 1.6 }}>{s.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              <span>👤 <strong>Opposition:</strong> {s.oppositionName}</span>
              <span>📞 <strong>Contact:</strong> {s.oppositionContact}</span>
            </div>

            {s.noticeMessage && (
              <div style={{ padding: '0.75rem', background: 'rgba(168,85,247,0.08)', borderRadius: 8, borderLeft: '3px solid #c084fc', marginBottom: '1rem' }}>
                <p style={{ fontSize: '0.8rem', color: '#c084fc', margin: '0 0 0.25rem', fontWeight: 600 }}>📄 Notice Sent:</p>
                <p style={{ fontSize: '0.85rem', margin: 0 }}>{s.noticeMessage}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {!['NOTICE_SENT','RESOLVED','CLOSED'].includes(s.status) && (
                <button className="btn-small" onClick={() => setActiveNotice(activeNotice === s.id ? null : s.id)}>
                  📄 {activeNotice === s.id ? 'Cancel Notice' : 'Send Notice'}
                </button>
              )}
              {['NOTICE_SENT','LAWYER_ASSIGNED'].includes(s.status) && (
                <button className="btn-small" style={{ background: '#f59e0b' }} onClick={() => updateStatus(s.id, 'UNDER_NEGOTIATION')}>🤝 Start Negotiation</button>
              )}
              {s.status === 'UNDER_NEGOTIATION' && (
                <>
                  <button className="btn-small btn-success" onClick={() => updateStatus(s.id, 'RESOLVED')}>✅ Mark Resolved</button>
                  <button className="btn-small" style={{ background: '#6b7280' }} onClick={() => updateStatus(s.id, 'CLOSED')}>🔒 Close</button>
                </>
              )}
            </div>

            {activeNotice === s.id && (
              <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '1rem', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Formal Notice Message</label>
                <textarea rows={4} placeholder="Write the formal legal notice to send to the opposition..."
                  value={noticeMsgs[s.id] || ''} onChange={e => setNoticeMsgs({ ...noticeMsgs, [s.id]: e.target.value })}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.75rem', marginBottom: '0.75rem' }} />
                <button className="btn-small btn-success" onClick={() => sendNotice(s.id)}>📨 Send Notice</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
