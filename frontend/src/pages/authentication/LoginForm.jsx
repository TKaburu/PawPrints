import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';
import '../../styles/login.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

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

      setSuccessMessage('Login successful! Redirecting to your dashboard...');

      // Fetch user details to determine user type
      const fetchUserDetails = await api.get('/accounts/current-user-details/', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userType = fetchUserDetails.data.user_type;
      const username = fetchUserDetails.data.username;

      // Redirect based on user type
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
      }, 2000);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
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
                <Link to="/register/welfare" onClick={handleMouseLeave}>
                  Register as Welfare
                </Link>
              </div>
            )}
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          <button type="submit">Login</button>
        </form>
      </section>
    </section>
  );
};

export default LoginForm;
