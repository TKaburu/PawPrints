import React, { useEffect, useState } from 'react';
import api from '../../api/api';
import { ACCESS_TOKEN } from '../../constants';
import '../../styles/profile.css';

const UserProfile = () => {
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get('accounts/current-user-details/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile.');
      }
    };

    fetchProfile();
  }, [username]);

  if (error) return <p>{error}</p>;
  if (!profile) return <p>Loading...</p>;

  return (
        <div className="profile-container">
            <h1>{profile.first_name} {profile.last_name}</h1>
            <p><strong>Username:</strong> {profile.username}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Phone:</strong> {profile.phone_number}</p>
        </div>
    
  );
};

export default UserProfile;
