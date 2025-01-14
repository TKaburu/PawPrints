import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import api from '../../api/api';

const PetOwnerRegistration = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedFormData = localStorage.getItem('petOwnerFormData');
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
    localStorage.setItem('petOwnerFormData', JSON.stringify(updatedFormData));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/accounts/register/pet-owner/', formData);
      console.log('Registration successful:', response.data);
      navigate('/login/pet-owner');
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      console.log('Registration failed:', error.response.data);
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
    <div className='main-container'>
      <section style={styles.formContainer}>
            <form onSubmit={handleSubmit}>
                <section className="title">
                    <h1>Pet Owner Registration</h1>
                </section>
                <div>
                <input
                    className='form-input'
                    type="text"
                    name="first_name"
                    placeholder='First Name'
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <input
                    className='form-input'
                    type="text"
                    name="last_name"
                    placeholder='Last Name'
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <input
                    className='form-input'
                    type="text"
                    name="username"
                    placeholder='Username'
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <input
                    className='form-input'
                    type="email"
                    name="email"
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <input
                    className='form-input'
                    type="password"
                    name="password"
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                </div>
                <div>
                <input
                    className='form-input'
                    type="password"
                    name="confirm_password"
                    placeholder='Confirm Password'
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                />
                </div>
                <button type="submit">Register</button>
            </form>
      </section>
    </div>
  );
};

export default PetOwnerRegistration;