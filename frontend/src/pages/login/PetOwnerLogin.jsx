import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
const PetOwnerLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
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
      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      if (response.status === 200) {
        setMessage("You have logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.response.data);
      setMessage("Login failed, please try again.");
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
              placeholder="Username"
              type="text"
              name="username"
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
        </form>
        {message && <p>{message}</p>}
      </section>
    </div>
  );
};
export default PetOwnerLogin;