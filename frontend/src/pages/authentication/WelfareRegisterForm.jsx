import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

const WelfareRegisterForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await api.post('/accounts/register/', {
        email,
        username,
        password,
        confirm_password: confirmPassword,
        user_type: 'welfare',
        location,
        phone_number: phoneNumber,
      });

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <section className="main-container">
        <section className="auth-form">
            <form onSubmit={handleSubmit}>
                <section className="title">
                    <h1>Register as Welfare Organization</h1>
                </section>

                <div>
                    <label>Email:</label>
                    <input 
                        className='form-input'
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Username:</label>
                    <input 
                        className='form-input'
                        type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Location:</label>
                    <input 
                        className='form-input'
                        type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                        required 
                    />
                </div>

                <div>
                    <label>Phone Number:</label>
                    <input 
                        className='form-input'
                        type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        className='form-input'
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <div>
                    <label>Confirm Password:</label>
                    <input 
                        className='form-input'
                        type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                    />
                </div>
                <p>Already have an account?{' '}
                                <Link to="/login">
                                  Login
                                </Link>
                              </p>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                <button type="submit">Register</button>
            </form>
        </section>
    </section>
  );
};

export default WelfareRegisterForm;
