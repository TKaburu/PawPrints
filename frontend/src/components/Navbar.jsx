import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaBars, FaUser } from 'react-icons/fa';
import api from '../api/api';
import { ACCESS_TOKEN } from '../constants';
import '../styles/navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();  

  const fetchUserName = async () => {
    // to fetch username of the user from backend for the message
    try {
      const response = await api.get('accounts/current-user-details/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        }
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const checkLoginStatus = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {

      setIsLoggedIn(true);
      fetchUserName();
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN); // Remove the token on logout
    setIsLoggedIn(false); // user is loged out
    setUsername(''); // username removed/set to empty string after logout
    navigate('/login');

  };

  return (
    <nav className="navbar">
      <section className="logo">
        PawPrints
      </section>
      <section className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
        <a href="/">Home</a>
        <a href="/register-pet">Register a Pet</a>
        <a href="/about">Change Ownership</a>
        <a href="/contact">Contact</a>
      </section>
      <section className={`links ${isMenuOpen ? 'open' : ''}`}>
        {isLoggedIn ? (
          <div className="auth">
            <div className="welcome-msg">
              Welcome {username}
            </div>
            <div className="user-icon-container">
              <FaUser className="user-icon" />
              <div className="logout-menu">
                <Link to={`/dashboard/${username}`}>Dashboard</Link>
                <Link to="/logout" onClick={handleLogout}>Logout</Link>
              </div>              
            </div>
          </div>
        ) : (
          <div className="auth">
            <button><Link to="/login">Login</Link></button>
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
