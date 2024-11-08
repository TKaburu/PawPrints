import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
const VetClinicLogin = () => {
  const [formData, setFormData] = useState({
    email: "", 
    password: "" 
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
      const response = await api.post("/accounts/token/", {
        email: formData.email,
        password: formData.password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      if (response.status === 200) {
        setMessage("You have logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to login:", error);
      setMessage("Invalid email or password. Please try again.");
    }
  };
  return (
    <section className="main-container">
      <div className="form-contain">
        <form onSubmit={handleSubmit}>
          <section className="title">
            <h1>Vet Clinic Login</h1>
          </section>
          <div>
            <input
              className="form-input"
              placeholder="Email"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              className="form-input"
              placeholder="Password"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          {message && <p className="error">{message}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </section>
  );
};
export default VetClinicLogin;