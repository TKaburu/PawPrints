// PetOwnerRegisterForm.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

const PetOwnerRegisterForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
        user_type: 'pet_owner',
        first_name: firstName,
        last_name: lastName,
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
      <section>
      <form onSubmit={handleSubmit}>
            <section className="title">
                <h1>Register as Pet Owner</h1>
            </section>
            <div>
                <label>First Name:</label>
                <input 
                  className='form-input'
                  type="text"
                  value={firstName} onChange={(e) => setFirstName(e.target.value)} 
                  required 
                />
            </div>

            <div>
                <label>Last Name:</label>
                <input 
                  className='form-input'
                  type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} 
                  required 
                />
            </div>

            <div>
                <label>Email:</label>
                <input 
                    className='form-input'
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
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

export default PetOwnerRegisterForm;
