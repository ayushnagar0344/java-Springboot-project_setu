import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Slots = () => {
  const { lawyerId } = useParams();
  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Generate next 3 days for the tabs
  const dates = [0, 1, 2].map(offset => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
  });

  useEffect(() => {
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/api/slots/${lawyerId}?date=${selectedDate}`);
        setSlots(res.data);
      } catch (err) {
        alert("Failed to fetch slots");
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [lawyerId, selectedDate]);

  const handleBook = async (slotId) => {
    try {
      const res = await API.post("/api/consultations/book", { slotId });
      const consultationId = res.data.id;
      navigate(`/payment/${consultationId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    }
  };

  const formatTime = (dateTimeStr) => {
      return new Date(dateTimeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app-container wide-page">
      <div className="booking-header">
          <h1>Select written appointment times</h1>
          <p className="card-subtitle">Consultation duration: 30 minutes</p>
      </div>

      <div className="date-tabs">
        {dates.map(date => (
          <button 
            key={date} 
            className={`date-tab ${selectedDate === date ? 'active' : ''}`}
            onClick={() => setSelectedDate(date)}
          >
            {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center section">Loading Slots...</div>
      ) : (
        <div className="time-grid section">
          {slots.length > 0 ? (
            slots.map((slot) => (
              <button 
                key={slot.id} 
                className={`time-slot ${slot.booked ? 'booked' : ''}`}
                onClick={() => !slot.booked && handleBook(slot.id)}
                disabled={slot.booked}
              >
                {formatTime(slot.startTime)}
                {slot.booked && <span className="booked-label">Booked</span>}
              </button>
            ))
          ) : (
            <div className="empty-state">
                <p>No slots available for this day. Please try another date.</p>
            </div>
          )}
        </div>
      )}

      <style>{`
        .date-tabs {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 1rem;
        }
        .date-tab {
            padding: 0.75rem 1.5rem;
            border: 1px solid var(--border-color);
            background: white;
            border-radius: 30px;
            cursor: pointer;
            font-weight: 600;
            color: var(--text-muted);
            transition: all 0.3s;
        }
        .date-tab.active {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
            box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
        }
        .time-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 1rem;
        }
        .time-slot {
            padding: 1rem;
            background: white;
            border: 2px solid #eef2f6;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .time-slot:hover:not(:disabled) {
            border-color: var(--primary);
            color: var(--primary);
            transform: scale(1.05);
        }
        .time-slot:disabled {
            background: #f8fafc;
            color: #cbd5e1;
            cursor: not-allowed;
            border-style: dashed;
        }
        .booked-label {
            font-size: 0.65rem;
            text-transform: uppercase;
            margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default Slots;
