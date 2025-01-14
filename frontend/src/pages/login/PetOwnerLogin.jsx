import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
const PetOwnerLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/accounts/token/", formData);
      const { access, refresh, username } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem('USER_NAME', username); // Store username in localStorage
  
      if (response.status === 200) {
        setMessage("You have logged in successfully!");
        // Now use the stored USER_NAME in the redirect
        const loggedInUsername = localStorage.getItem('USER_NAME');
        navigate(`/pet-owner-dashboard/${loggedInUsername}`);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('User does not exist.');
      } else {
        setError('An error occurred during login. Please try again.');
      }
      console.error("Login failed:", error.response?.data || error);
    }
  };
  
  return (
    <div className="main-container">
      <section className="form-container">
        <div className="title">
          <h1>Pet Owner Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="form-input"
              placeholder="Email"
              type="text"
              name="email"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              className="form-input"
              placeholder="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
          <p>
            Don't have an account? <a href="/register/pet-owner">Register</a>
          </p>
        </form>
        {message && <p>{message}</p>}
      </section>
    </div>
  );
};
export default PetOwnerLogin;