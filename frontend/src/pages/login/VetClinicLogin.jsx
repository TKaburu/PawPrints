import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode"; // Correct import

const VetClinicLogin = () => {
  const [formData, setFormData] = useState(
    { email: "", password: "" }
  );
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/accounts/token/", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.access) {
        // Decode the token to get user information
        const decodedToken = jwtDecode(response.data.access);
        const clinicSlug = decodedToken.clinic_slug;

        // Save tokens and user information
        localStorage.setItem('ACCESS_TOKEN', response.data.access);
        localStorage.setItem('REFRESH_TOKEN', response.data.refresh);
        // localStorage.setItem('USER_NAME', decodedToken.username);
        localStorage.setItem('CLINIC_SLUG', clinicSlug);

        // Redirect to the vet clinic dashboard
        navigate(`/vet-clinic-dashboard/${clinicSlug}`);
        setMessage('You have logged in successfully!');	
      } else {
        setMessage('Login failed. Please check your credentials.');
      }
    } catch (error) {
      setMessage('An error occurred during login. Please try again.');
    }
  };

  const styles = {
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '500px',
      marginTop: '50px',
    },
  };

  return (
    <div className="main-container">
      <section style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className="title">
            <h1>Vet Clinic Login</h1>
          </div>
          <div>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
          {message && <p className="error">{message}</p>}
        </form>
      </section>
    </div>
  );
};

export default VetClinicLogin;