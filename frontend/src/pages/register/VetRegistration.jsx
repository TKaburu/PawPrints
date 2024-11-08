import React, { useState, useEffect } from "react";
import api from "../../api/api";
import { fetchVetClinics } from "../../api/apiService";

const VetRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
    vet_clinic: "",
  });
  const [vetClinics, setVetClinics] = useState([]);

  useEffect(() => {
    const loadVetClinics = async () => {
      try {
        const clinics = await fetchVetClinics();
        setVetClinics(clinics);
      } catch (error) {
        console.error("Error loading vet clinics:", error);
      }
    };

    loadVetClinics();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/accounts/register/vet/",formData);
      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error("Registration failed:", error.response.data);
    }
  };

  return (
    <section className="form-container">
      <form onSubmit={handleSubmit}>
      <div className='title'>
        <h1>Vet Registration</h1>
      </div>
      <input
          className='form-input'
          type="text"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="First Name"
        />
        <input
          className='form-input'
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
        />
        <input
          className='form-input'
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          className='form-input'
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          className="form-input"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          className="form-input"
          type="password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
        <select
          className="form-input"
          name="vet_clinic"
          value={formData.vet_clinic}
          onChange={handleChange}
        >
          <option value="">Select a Vet Clinic</option>
          {vetClinics.map((clinic) => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.name}
            </option>
          ))}
        </select>
        <button type="submit">Register</button>
      </form>
    </section>
    
  );
};

export default VetRegistration;