import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaBars, FaUser } from "react-icons/fa";
import api from "../api/api";
import { ACCESS_TOKEN } from "../constants";
import "../styles/navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();

  const fetchUserDetails = useCallback(async () => {
    // Fetch user details (username and user_type)
    try {
      const response = await api.get("accounts/current-user-details/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });
      setUsername(response.data.username);
      setUserType(response.data.user_type);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  }, []); // No dependencies from component scope that change its definition

  const checkLoginStatus = useCallback(async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      setIsLoggedIn(true);
      fetchUserDetails(); // Fetch user details if logged in
    } else {
      setIsLoggedIn(false);
    }
  }, [fetchUserDetails]); // Depends on the memoized fetchUserDetails

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN); // Remove the token on logout
    setIsLoggedIn(false); // User is logged out
    setUsername(""); // reset username after logout
    setUserType(""); // Reset user type
    navigate("/login");
  };

  return (
    <nav className='navbar'>
      <section className='logo'>PawPrints</section>
      <section className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <a href='/'>Home</a>
        <a href='/register-pet'>Register a Pet</a>
        <a href='/contact'>Contact</a>
      </section>
      <section className={`links ${isMenuOpen ? "open" : ""}`}>
        {isLoggedIn ? (
          <div className='auth'>
            <div className='welcome-msg'>Welcome {username}</div>
            <div className='user-icon-container'>
              <FaUser className='user-icon' />
              <div className='logout-menu'>
                {/* redirecting user according to the type of user */}
                {userType === "pet_owner" && (
                  <Link to={`/dashboard/pet-owner/${username}`}>Dashboard</Link>
                )}
                {userType === "vet_clinic" && (
                  <Link to={`/dashboard/vet-clinic/${username}`}>
                    Dashboard
                  </Link>
                )}
                {userType === "welfare" && (
                  <Link to={`/dashboard/welfare-organization/${username}`}>
                    Dashboard
                  </Link>
                )}
                <Link to={`/user-profile/${username}`}>Profile</Link>
                <Link to='/logout' onClick={handleLogout}>
                  Logout
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className='auth'>
            <button>
              <Link to='/login'>Login</Link>
            </button>
          </div>
        )}
      </section>
      <div className='menu-icon' onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;
