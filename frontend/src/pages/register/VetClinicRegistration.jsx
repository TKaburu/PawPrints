import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const VetClinicRegistration = () => {
  const [formData, setFormData] = useState({
    clinic_name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirm_password: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Load form data from local storage on component mount
  useEffect(() => {
    const storedFormData = localStorage.getItem('vetClinicFormData');
    if (storedFormData) {
      setFormData(JSON.parse(storedFormData));
    }
  }, []);

  const handleChange = (e) => {
    const updatedFormData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    setFormData(updatedFormData);
    localStorage.setItem('vetClinicFormData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/accounts/register/vet-clinic/', formData);
      if (response.status === 201) {
        setMessage('Vet clinic registered successfully!');
        navigate('/login/vet-clinic');

      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error('Registration failed:', error.response?.data || error.message);
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
    <div>
      <div className="main-container">
        <section style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div className="title">
              <h1>Vet Clinic Registration</h1>
            </div>
            <div>
              <input
                className='form-input'
                placeholder='Clinic Name'
                type="text"
                name="clinic_name"
                value={formData.clinic_name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                className='form-input'
                placeholder='Email'
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                className='form-input'
                placeholder='Phone'
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                className='form-input'
                placeholder='Address'
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                className='form-input'
                placeholder='Password'
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                className='form-input'
                placeholder='Confirm Password'
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Register</button>
          </form>
        </section>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default VetClinicRegistration;
