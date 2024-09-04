import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
    <nav className="navbar">
      <section className="logo">
        PawPrints
      </section>
      <section className={`links ${isMenuOpen ? 'open' : ''}`}>
        <a href="/">Home</a>
        <a href="/about">Change Ownership</a>
        <a href="/contact">Contact</a>
      </section>
      <section className= {`links ${isMenuOpen ? 'open' : ''}`}>
        <div className="auth">
          <Link to="/login">Login</Link>
          <button><Link to="/register" className='accent'>Register</Link></button>
        </div>
      </section>
      
      <div className="menu-icon" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
    </>
  );
};

export default Navbar;
