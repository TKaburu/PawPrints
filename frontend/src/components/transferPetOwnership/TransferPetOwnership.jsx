import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import './transferPetOwnership.css';

const TransferPetOwnership = () => {
  const { slug } = useParams();
  const [pet, setPet] = useState(null);
  const [newOwnerUsername, setNewOwnerUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userExists, setUserExists] = useState(null);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        if (slug) {
          const response = await api.get(`/api/pets/${slug}/`);
          setPet(response.data);
        }
      } catch (error) {
        setError('Failed to fetch pet details.');
      }
    };

    fetchPet();
  }, [slug]);

  useEffect(() => {
    const checkUserExists = async () => {
      if (newOwnerUsername) {
        try {
          const response = await api.get('/auth/check-user/', {
            params: { username: newOwnerUsername },
          });
          if (response.status === 200) {
            setUserExists(true);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            setUserExists(false);
          } else {
            setError('An error occurred while checking the user.');
          }
        }
      } else {
        setUserExists(null);
      }
    };

    checkUserExists();
  }, [newOwnerUsername]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/auth/get-user/');
        setCurrentUser(response.data.username);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!userExists) {
      setError('The new owner is not registered.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post(`/api/transfer-pet-ownership/${slug}/`, {
        new_owner_username: newOwnerUsername,
      });

      if (response.status === 200) {
        alert('Ownership transferred successfully');
        if (currentUser) {
          navigate(`/${currentUser}`);
        } else {
          console.error('Current user is null, cannot redirect');
          setError('Unable to redirect to dashboard. Please try logging in again.');
        }
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setError('Failed to transfer ownership. Please try again.');
    }

    setLoading(false);
  };

  if (!pet) {
    return <p>Loading pet details...</p>;
  }

  return (
    <section className="main-content">
      <div className="transfer-ownership">
        <section className="title">
          <h2>Transfer Ownership of {pet.name}</h2>
        </section>
        <form onSubmit={handleTransfer}>
          <div>
            <label htmlFor="newOwnerUsername">New Owner Username:</label>
            <input
              type="text"
              id="newOwnerUsername"
              value={newOwnerUsername}
              onChange={(e) => setNewOwnerUsername(e.target.value)}
              required
            />
            {userExists === false && (
              <p className="error">This user is not registered.</p>
            )}
          </div>
          <button type="submit" disabled={loading || userExists === false}>
            {loading ? 'Transferring...' : 'Transfer Ownership'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default TransferPetOwnership;
