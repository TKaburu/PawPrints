import React, { useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Using the axios instance properly
      const response = await api.post("/accounts/forgot-password/", { email });

      // For debugging, you can log the response data to see what the backend sends:
      // console.log('Forgot password success response data:', response.data);

      // Use a success message from the backend if available, otherwise use a default one.
      // Common keys for messages are 'message' or 'detail'.
      const successMessage =
        response.data?.message ||
        response.data?.detail ||
        "A password reset link has been sent to your email.";
      setMessage(successMessage);
    } catch (error) {
      // Extract error message more robustly from the response
      const apiError = error.response?.data;
      const errorMessage =
        apiError?.error ||
        apiError?.message ||
        apiError?.detail ||
        "An error occurred. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='main-container'>
      <form className='auth-form' onSubmit={handleSubmit}>
        <section className='title'>
          <h1>Forgot Password</h1>
        </section>
        <p className='description'>
          Please enter your email address to receive a password reset link.
        </p>
        <input
          className='form-input'
          type='email'
          placeholder='Enter your email'
          value={email}
          onChange={handleEmailChange}
          required
        />
        <section className='double-buttons'>
          <button type='submit' disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          <button className='cancel-btn' type='button'>
            <Link to='/login'>Back to login</Link>
          </button>
        </section>
      </form>
      {message && <p className='message'>{message}</p>}
    </div>
  );
};

export default ForgotPassword;
