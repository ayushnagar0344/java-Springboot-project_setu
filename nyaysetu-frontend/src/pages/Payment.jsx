import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../services/api';

const Payment = () => {
  const { id } = useParams(); // id is consultationId
  const [paymentDone, setPaymentDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Step 1: Create payment
      const createRes = await API.post("/api/payments/create", {
        consultationId: id,
        amount: 500
      });
      const paymentId = createRes.data.paymentId;

      // Step 2: Mark success
      await API.post(`/api/payments/success/${paymentId}`);
      
      setPaymentDone(true);
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
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
          <p>Your consultation is confirmed.</p>
          <button className="btn mt-4" onClick={() => window.location.href='/lawyers'}>Back to Lawyers</button>
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
