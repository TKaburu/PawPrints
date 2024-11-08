import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const WelfareOrgRegistration = () => {
  const [formData, setFormData] = useState({
    org_name: '',
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
    const storedFormData = localStorage.getItem('welfareOrgFormData');
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
    localStorage.setItem('welfareOrgFormData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/accounts/register/welfare-org/', formData);
      if (response.status === 201) {
        setMessage('Welfare organization registered successfully!');
        navigate('/login/welfare-orginization');
      } else {
        setMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.');
      console.error('Registration failed:', error.response.data);
    }
  };

  return (
    <div>
      <section className='form-container'>
        <form onSubmit={handleSubmit}>
          <div className='title'>
            <h1>Welfare Organization Registration</h1>
          </div>
          <div>
            <input
              className='form-input'
              placeholder='Organization Name'
              type='text'
              name='org_name'
              value={formData.org_name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              className='form-input'
              placeholder='Email'
              type='email'
              name='email'
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
      {message && <p>{message}</p>}
    </div>
  );
};

export default WelfareOrgRegistration;