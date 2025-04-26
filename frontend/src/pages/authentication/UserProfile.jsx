import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { ACCESS_TOKEN } from '../../constants';
import '../../styles/profile.css';
import useNotification from '../../hooks/useNotification'; // Notification hook
import Notification from '../../components/Notification'; // Import the Notification component

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [formData, setFormData] = useState({});
  const { showNotification, notification } = useNotification(); // Notification hook
  const navigate = useNavigate(); // Navigation hook

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

  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await api.delete(`accounts/user-profile/${username}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Show notification
      showNotification('Your profile has been deleted successfully.', 'success', 3000);
      setIsModalOpen(false);
      // Redirect to the login page
      navigate('/login');
    } catch (err) {
      setError('Failed to delete profile.');
      // Show error notification
      showNotification('Failed to delete profile. Please try again.', 'error', 3000);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle form submit (update profile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.put(
        `accounts/user-profile/${username}/`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProfile(response.data);
      setIsEditing(false);
      showNotification('Profile updated successfully!', 'success', 3000);
    } catch (err) {
      setError('Failed to update profile.');
      showNotification('Failed to update profile. Please try again.', 'error', 3000);
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
              <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
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
              <button onClick={() => setIsEditing(true)} className="save-btn">
                Edit Profile
              </button>
              <button onClick={() => setIsModalOpen(true)} className="delete-btn">
                Delete Profile
              </button>
            </section>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Are you sure you want to delete your profile?</h2>
            <p>This will also delete all your registered pets!</p>
            <div className="double-buttons">
              <button onClick={handleDeleteProfile} className="save-btn">Delete</button>
              <button onClick={() => setIsModalOpen(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Render the Notification component */}
      <Notification notification={notification} setNotification={showNotification} />
    </div>
  );
};

export default UserProfile;
