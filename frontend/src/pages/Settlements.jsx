import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const statusColor = {
  RAISED: { bg: 'rgba(234,179,8,0.15)', color: '#facc15', border: '#facc15' },
  LAWYER_ASSIGNED: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '#60a5fa' },
  NOTICE_SENT: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', border: '#c084fc' },
  UNDER_NEGOTIATION: { bg: 'rgba(251,146,60,0.15)', color: '#fb923c', border: '#fb923c' },
  RESOLVED: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '#4ade80' },
  CLOSED: { bg: 'rgba(100,116,139,0.15)', color: '#94a3b8', border: '#94a3b8' },
};

export default function Settlements() {
  const [settlements, setSettlements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', oppositionName: '', oppositionContact: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchSettlements(); }, []);

  const fetchSettlements = async () => {
    try {
      const res = await API.get('/api/settlements/my');
      setSettlements(res.data.data || []);
    } catch { setMsg('Failed to load settlements.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg('');
    try {
      await API.post('/api/settlements', form);
      setMsg('✅ Settlement raised! A lawyer has been auto-assigned.');
      setShowForm(false);
      setForm({ title: '', description: '', oppositionName: '', oppositionContact: '' });
      fetchSettlements();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to raise settlement.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page-container wide-page" style={{ maxWidth: 800, margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>⚖️ Secure Settlements</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Raise a dispute. A lawyer is auto-assigned and sends a formal notice.</p>
        </div>
        <button className="btn" style={{ width: 'auto', padding: '0.65rem 1.5rem' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Raise Dispute'}
        </button>
      </div>

      {msg && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 8, marginBottom: '1.5rem',
          background: msg.startsWith('✅') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${msg.startsWith('✅') ? '#4ade80' : '#f87171'}`,
          color: msg.startsWith('✅') ? '#4ade80' : '#f87171' }}>
          {msg}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: 12, padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>New Settlement</h2>
          <div className="form-group">
            <label>Dispute Title</label>
            <input required placeholder="e.g. Property Boundary Dispute" value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={4} required placeholder="Describe the dispute in detail..." value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--text-main)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '0.75rem', width: '100%' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Opposition Name</label>
              <input required placeholder="Full name of the opposing party" value={form.oppositionName}
                onChange={e => setForm({ ...form, oppositionName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Opposition Contact</label>
              <input required placeholder="Phone or email" value={form.oppositionContact}
                onChange={e => setForm({ ...form, oppositionContact: e.target.value })} />
            </div>
          </div>
          <button className="btn" type="submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? 'Submitting...' : '🚀 Submit & Auto-Assign Lawyer'}
          </button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {settlements.length === 0 ? (
          <div className="empty-state">
            <p style={{ fontSize: '2rem' }}>⚖️</p>
            <p style={{ marginTop: '0.5rem' }}>No settlements yet. Raise your first dispute above.</p>
          </div>
        ) : settlements.map(s => {
          const sc = statusColor[s.status] || statusColor.RAISED;
          return (
            <div key={s.id} className="consultation-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <h3 style={{ color: 'var(--primary)', margin: 0, fontSize: '1rem' }}>{s.title}</h3>
                <span style={{ padding: '0.2rem 0.75rem', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                  background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                  {s.status.replace('_', ' ')}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: 0 }}>{s.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span>👤 <strong>Opposition:</strong> {s.oppositionName} ({s.oppositionContact})</span>
                <span>⚖️ <strong>Lawyer:</strong> {s.assignedLawyerName || 'Pending assignment'}</span>
              </div>
              {s.noticeMessage && (
                <div style={{ padding: '0.75rem', background: 'rgba(168,85,247,0.08)', borderRadius: 8, borderLeft: '3px solid #c084fc', width: '100%' }}>
                  <p style={{ fontSize: '0.8rem', color: '#c084fc', margin: 0, fontWeight: 600 }}>📄 Legal Notice:</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-main)', margin: '0.25rem 0 0 0' }}>{s.noticeMessage}</p>
                </div>
              )}
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Filed: {new Date(s.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                {s.resolvedAt && ` · Resolved: ${new Date(s.resolvedAt).toLocaleDateString('en-IN')}`}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
