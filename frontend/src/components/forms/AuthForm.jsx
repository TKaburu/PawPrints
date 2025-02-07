import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/login') {
      setIsRegister(false);
    } else if (location.pathname === '/register') {
      setIsRegister(true);
    }
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    if (isRegister && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    const url = isRegister ? '/accounts/register/' : '/accounts/token/';
    const data = isRegister
      ? { email, username, password, confirm_password: confirmPassword, user_type: userType }
      : { email, password };
  
    try {
      const response = await api.post(url, data);
      if (isRegister) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Save tokens to localStorage
        localStorage.setItem(ACCESS_TOKEN, response.data.access);
        localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
  
        setSuccessMessage('Login successful! Redirecting to your dashboard...');
        
        // Fetch user details to determine the user type
        const fetchUserDetails = await api.get('/accounts/current-user-details/', {
          headers: { Authorization: `Bearer ${response.data.access}` }
        });
        
        const userType = fetchUserDetails.data.user_type;
  
        // Redirect based on user type
        setTimeout(() => {
          if (userType === 'pet_owner') {
            navigate('/dashboard/pet-owner/:username');
          } else if (userType === 'vet_clinic') {
            navigate('/dashboard/vet-clinic/:username');
          } else if (userType === 'welfare') {
            navigate('/dashboard/welfare-organization/:username');
          } else if (userType === 'admin') {
            navigate('/admin-dashboard');
          }
        }, 2000);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };
  

  return (
    <>
    <section className="main-container">
    <div>
      
      <form onSubmit={handleSubmit}>
        <section className="title">
          <h1>{isRegister ? 'Register' : 'Login'}</h1>
        </section>
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
        {isRegister && (
          <>
            <div>
              <label>Username:</label>
              <input
                className='form-input'
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label>I am a:</label>
              <select
                className='form-input'
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="" disabled>Select who you are</option>
                <option value="pet_owner">Pet Owner</option>
                <option value="vet_clinic">Vet Clinic</option>
                <option value="welfare">Welfare</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </>
        )}
        <div>
          <label>Password:</label>
          <input
            className='form-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {isRegister && (
          <div>
            <label>Confirm Password:</label>
            <input
              className='form-input'
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <p>
        {isRegister ? (
          <>
            Already have an account?{' '}
            <Link to="/login" onClick={() => setIsRegister(false)}>
              Login
            </Link>
          </>
        ) : (
          <>
            Don't have an account?{' '}
            <Link to="/register" onClick={() => setIsRegister(true)}>
              Register
            </Link>
          </>
        )}
        </p>
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>
      
    </div>
    </section>
    
    
    </>
    
  );
};

export default AuthForm;