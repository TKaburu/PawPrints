import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTimes, FaBars, FaUser } from 'react-icons/fa';
import api from '../../api/api';
import { ACCESS_TOKEN } from '../../constants';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      setIsLoggedIn(true);
      fetchUserDetails();
    } else {
      setIsLoggedIn(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await api.get('http://127.0.0.1:8000/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        }
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <section className="logo">
        PawPrints
      </section>
      <section className={`links ${isMenuOpen ? 'open' : ''}`}>
        <a href="/">Home</a>
        <a href="/register-pet">Register a Pet</a>
        <a href="/about">Change Ownership</a>
        <a href="/contact">Contact</a>
      </section>
      <section className={`links ${isMenuOpen ? 'open' : ''}`}>
        {isLoggedIn ? (
          <div className="auth">
            <div className="welcome-msg">
              Welcome, {username}
            </div>
            <div className="user-icon-container">
              <FaUser className="user-icon" />
              <div className="logout-menu">
                <Link to={`/${username}`}>Dashboard</Link>
                <button onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="auth">
            <Link to="/login">Login</Link>
            <button><Link to="/register">Register</Link></button>
          </div>
        )}
      </section>
      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
