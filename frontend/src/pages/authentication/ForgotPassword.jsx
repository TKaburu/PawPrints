import React, { useState } from 'react';
import api from '../../api/api';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Using the axios instance properly
      const response = await api.post('/accounts/forgot-password/', { email });

    //   console.log(response.data);
      
      // Axios already parses JSON responses
      setMessage('A password reset link has been sent to your email.');
    } catch (error) {
      // Get error message from the response if available
      const errorMessage = error.response?.data?.error || 'An error occurred. Please try again.';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-container'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <section className="title"><h1>Forgot Password</h1></section>
        <p className="description">
            Please enter your email address to receive a password reset link.
        </p>
        <input
          className='form-input'
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <section className="double-buttons">
          <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
          <button className='cancel-btn' type="button">
            <Link to="/login">Back to login</Link>
          </button>
        </section>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default ForgotPassword;