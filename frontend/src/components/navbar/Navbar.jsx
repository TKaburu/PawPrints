import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes, FaBars } from 'react-icons/fa';
import api from '../../api/api';
import { ACCESS_TOKEN } from '../../constants';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      setIsLoggedIn(true);
      fetchUserDetails();
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await api.get('http://127.0.0.1:8000/auth/get-user/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        }
      });
      setUsername(response.data.username);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
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
            <span>Welcome, {username}!</span>
            <button><Link to="/logout" className='accent'>Logout</Link></button>
          </div>
        ) : (
          <div className="auth">
            <Link to="/login">Login</Link>
            <button><Link to="/register" className='accent'>Register</Link></button>
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
