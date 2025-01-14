import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../constants";
import "../styles/navbar.css";

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(true);
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem(ACCESS_TOKEN);
  };

  const handleProtectedLinkClick = (e, path) => {
    if (!isAuthenticated()) {
      e.preventDefault();
      navigate("/login/pet-owner");
    } else {
      navigate(path);
    }
  };

  return (
    <section className="navbar">
      <section className="logo">
        <h1>PawPrints</h1>
      </section>
      <section className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/search-pet">Search a MicroChip</Link>
        <Link to="/register-pet" onClick={(e) => handleProtectedLinkClick(e, "/register-pet")}>Register a Pet</Link>
        <Link to="/transfer-pet-ownership" onClick={(e) => handleProtectedLinkClick(e, "/transfer-pet-ownership")}>Change Pet Ownership</Link>
        <Link to="/contact">Contact</Link>
      </section>
      <section className="auth">
        <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
          Login
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Link to="/login/pet-owner" onClick={handleMouseLeave}>
              Login as Pet Owner
            </Link>
            <Link to="/login/vet" onClick={handleMouseLeave}>
              Login as Vet
            </Link>
            <Link to="/login/vet-clinic" onClick={handleMouseLeave}>
              Login as Vet Clinic
            </Link>
            <Link to="/login/welfare" onClick={handleMouseLeave}>
              Login as Welfare
            </Link>
          </div>
        )}
      </section>
    </section>
  );
};

export default Navbar;