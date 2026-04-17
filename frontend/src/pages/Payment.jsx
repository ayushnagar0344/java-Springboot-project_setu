import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const Payment = () => {
  const { id } = useParams(); // id is consultationId
  const navigate = useNavigate();
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Fetch the existing PENDING payment created during booking
      const paymentRes = await API.get(`/api/payments/consultation/${id}`);
      const paymentId = paymentRes.data.paymentId;

      // Step 2: Mark payment as SUCCESS — backend also sets consultation to BOOKED
      await API.post(`/api/payments/success/${paymentId}`);

      setPaymentDone(true);
    } catch (err) {
      alert(err.response?.data?.message || err.message || "Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container text-center">
      <h1>Payment</h1>
      {paymentDone ? (
        <div className="success-message">
          <h2 style={{color: '#10b981'}}>✔ Payment Successful!</h2>
          <p>Your consultation is confirmed. You can join the meeting from your dashboard.</p>
          <button className="btn mt-4" onClick={() => navigate('/my-consultations')}>
            View My Bookings
          </button>
        </div>
      ) : (
        <div>
          <p className="card-subtitle mb-4">You are booking a consultation for ₹500.</p>
          <button 
            className="btn mt-4" 
            onClick={handlePayment} 
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay ₹500"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Payment;
