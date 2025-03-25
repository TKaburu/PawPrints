import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import '../../styles/login.css';
import Notification from './../../components/Notification'
import useNotification from '../../hooks/useNotification';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use our custom notification hook
  const { notification, setNotification, showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/accounts/token/', {
        email,
        password,
      });

      const accessToken = response.data.access;
      const refreshToken = response.data.refresh;

      // Save tokens to localStorage
      localStorage.setItem(ACCESS_TOKEN, accessToken);
      localStorage.setItem(REFRESH_TOKEN, refreshToken);

      showNotification('Login successful! Redirecting to your dashboard...', 'success');

      // Fetch user details to determine user type
      const fetchUserDetails = await api.get('/accounts/current-user-details/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userType = fetchUserDetails.data.user_type;
      const username = fetchUserDetails.data.username;

      // Redirect based on user type after 2 seconds
      setTimeout(() => {
        if (userType === 'pet_owner') {
          navigate(`/dashboard/pet-owner/${username}`);
        } else if (userType === 'vet_clinic') {
          navigate(`/dashboard/vet-clinic/${username}`);
        } else if (userType === 'welfare') {
          navigate(`/dashboard/welfare-organization/${username}`);
        } else if (userType === 'admin') {
          navigate('/admin-dashboard');
        }
      }, 1000);
    } catch (err) {
      showNotification('Invalid credentials. Please try again.', 'error');
    }
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* Add the Notification component */}
      <Notification 
        notification={notification} 
        setNotification={setNotification} 
      />
      
      <section className="main-container">
        <section className="auth-form">
          <form onSubmit={handleSubmit}>
            <section className="title">
              <h1>Login</h1>
            </section>
            <div>
              <label>Email:</label>
              <input
                className="form-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Register Dropdown */}
            <div
              className="register-container"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <p>Don't have an account?{' '}
                <span className="register-link">
                  Register
                </span>
              </p>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/register/pet-owner" onClick={handleMouseLeave}>
                    Register as Pet Owner
                  </Link>
                  <Link to="/register/vet-clinic" onClick={handleMouseLeave}>
                    Register as Vet Clinic
                  </Link>
                  <Link to="/register/welfare-organization" onClick={handleMouseLeave}>
                    Register as Welfare
                  </Link>
                </div>
              )}
            </div>
            <div className="forgot-password-container">
                <Link to="/forgot-password" className="forgot-password-link" >
                  Forgot Password?
                </Link>
              </div>
            
            <button type="submit">Login</button>
          </form>
        </section>
      </section>
    </>
  );
};

export default LoginForm;