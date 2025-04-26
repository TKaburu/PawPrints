import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { ACCESS_TOKEN } from '../../constants';
import '../../styles/profile.css';

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get('accounts/current-user-details/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(response.data.username);
      } catch (error) {
        setError('Failed to fetch user details');
      }
    };

    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) return;
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get(`accounts/user-profile/${username}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
        setFormData(response.data); // Initialize formData with profile data
      } catch (err) {
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [username]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.put(
        `accounts/user-profile/${username}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
    }
  };

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
    <div className="main-container">
      <div className="form-container">
        <h1 className="title">
          {isEditing ? 'Edit Profile' : `${profile.first_name} ${profile.last_name}`}
        </h1>
  
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <label>First Name:</label>
            <input
              className="form-input"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
            />
  
            <label>Last Name:</label>
            <input
              className="form-input"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
            />
  
            <label>Phone:</label>
            <input
              className="form-input"
              name="phone_number"
              value={formData.phone_number || ''}
              onChange={handleChange}
            />
  
            <section className="double-buttons">
              <button type="submit" className="save-btn">Save</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </section>
          </form>
        ) : (
          <>
            <div className="profile-info">
                <p><strong>Username:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Phone:</strong> {profile.phone_number}</p>
            </div>

            <section className="double-buttons">
                <button
                onClick={() => setIsEditing(true)}
                className="save-btn"
                >
                Edit Profile
                </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
  
};

export default UserProfile;
