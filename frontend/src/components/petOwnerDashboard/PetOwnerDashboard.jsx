import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { ACCESS_TOKEN } from '../../constants';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PetOwnerDashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { username } = useParams();

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`http://127.0.0.1:8000/auth/pet-owner-dashboard/${username}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          }
        });
        setPets(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
        setError('Failed to fetch pets. Please try again later.');
        setLoading(false);
      }
    };

    if (username) {
      fetchPets();
    }
  }, [username]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className='main-content'>
      <section className="title">
        <h1>Here are your registered fur babies</h1>
      </section>
      <section className="pet-list">  
        {pets.map(Pet => (
          <div className="pet-card" key={Pet.id}>
            {/* <img src={Pet.image} alt={Pet.name} /> */}
            <Link to={`/transfer-pet-ownership/${Pet.slug}`}><h2>{Pet.name}</h2></Link>
            <p>Microchip Number: {Pet.microchip_number}</p>
            <p>Type of Pet: {Pet.type_of_pet}</p>
            <p>Breed: {Pet.breed}</p>
            
          </div>
        ))}
    </section>
    </div>
  );
};

export default PetOwnerDashboard;
