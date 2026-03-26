import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const res = await API.get('/api/lawyers');
        setLawyers(res.data);
      } catch (err) {
        console.error("Failed to fetch lawyers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  const filteredLawyers = lawyers.filter(lawyer => 
    lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lawyer.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="page-container">Loading Lawyers...</div>;

  return (
    <div className="app-container wide-page">
      <div className="flex justify-between" style={{marginBottom: '2rem'}}>
        <h1>Legal Experts</h1>
        <div className="search-pill">
            <input 
              type="text" 
              placeholder="Search by name, city or specialty..." 
              style={{maxWidth: '300px'}} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="list-container">
        {filteredLawyers.map((lawyer) => (
          <div key={lawyer.id} className="card lawyer-card">
            <div className="online-indicator">
                <span className={`dot ${lawyer.isOnline ? 'online' : 'offline'}`}></span>
                {lawyer.isOnline ? 'Available Now' : 'Away'}
            </div>
            <h3 className="card-title">{lawyer.name}</h3>
            <p className="specialization-tag">{lawyer.specialization}</p>
            
            <div className="lawyer-meta mt-4">
                <div className="meta-item">
                    <span className="icon">📍</span> {lawyer.city}
                </div>
                <div className="meta-item">
                    <span className="icon">💼</span> {lawyer.experienceYears} Years Exp.
                </div>
                <div className="meta-item">
                    <span className="icon">⭐</span> {lawyer.rating} / 5.0
                </div>
            </div>

            <button 
              className="btn mt-4" 
              onClick={() => navigate(`/slots/${lawyer.id}`)}
              disabled={!lawyer.isOnline}
              style={{opacity: lawyer.isOnline ? 1 : 0.6}}
            >
              Consult Now
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .lawyer-card {
            position: relative;
            text-align: left;
            border-top: 4px solid var(--primary);
        }
        .online-indicator {
            font-size: 0.75rem;
            color: var(--text-muted);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
        }
        .dot.online { background: #27ae60; box-shadow: 0 0 8px #27ae60; }
        .dot.offline { background: #95a5a6; }
        .specialization-tag {
            background: #f0f7ff;
            color: #007bff;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.85rem;
            display: inline-block;
        }
        .lawyer-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.75rem;
            font-size: 0.9rem;
            color: var(--text-muted);
        }
        .meta-item { display: flex; align-items: center; gap: 0.4rem; }
      `}</style>
    </div>
  );
};

export default Lawyers;
