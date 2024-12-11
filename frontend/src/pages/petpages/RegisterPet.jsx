import React, { useState } from 'react';
import api from '../../api/api';

const RegisterPet = () => {
  const [name, setName] = useState('');
  const [microchipNo, setMicrochipNo] = useState('');
  const [typeOfPet, setTypeOfPet] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petparentcontact, setPetparentcontact] = useState('');
  const [primaryVet, setPrimaryVet] = useState('');
  const [primaryVetContact, setPrimaryVetContact] = useState('');
  const [secondaryVet, setSecondaryVet] = useState('');
  const [secondaryVetContact, setSecondaryVetContact] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const petData = {
      name,
      microchipNo,
      typeOfPet,
      breed,
      age,
      petparentcontact,
      primaryVet,
      primaryVetContact,
      secondaryVet,
      secondaryVetContact,
    };

    try {
      const response = await api.post('/pets/register/', petData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setSuccess('Pet registered successfully!');
        setError('');
      } else {
        setError('Failed to register pet.');
        setSuccess('');
      }
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
      setSuccess('');
    }
  };

  const petTypes = [
    'Dog', 'Cat', 'Bird', 'Horse', 'Cow', 'Fish', 'Goat', 'Sheep', 'Snake', 'Rabbit', 'Other'
  ];

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
    <section className='main-container'>
      <section style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className="title">
            <h1>Register a New Pet</h1>
          </div>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder="Pet Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder="Microchip Number"
              value={microchipNo}
              onChange={(e) => setMicrochipNo(e.target.value)}
            />
          </div>
          <div>
          <select
              className='form-input'
              value={typeOfPet}
              onChange={(e) => setTypeOfPet(e.target.value)}
            >
              <option value="" disabled>Select Type of Pet</option>
              {petTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {/* <input
              className='form-input'
              type="text"
              placeholder="Type of Pet"
              value={typeOfPet}
              onChange={(e) => setTypeOfPet(e.target.value)}
            /> */}
          </div>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder="Breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />
          </div>
          <div>
            <input
              className='form-input'
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder="Pet Parent Contact"
              value={petparentcontact}
              onChange={(e) => setPetparentcontact(e.target.value)}
            />
          </div>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder="Primary Vet"
              value={primaryVet}
              onChange={(e) => setPrimaryVet(e.target.value)}
            />
          </div>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder="Primary Vet Contact"
              value={primaryVetContact}
              onChange={(e) => setPrimaryVetContact(e.target.value)}
            />
          </div>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder="Secondary Vet (optional)"
              value={secondaryVet}
              onChange={(e) => setSecondaryVet(e.target.value)}
            />
          </div>
          <div>
            <input
              className='form-input'
              type="text"
              placeholder="Secondary Vet Contact (optional)"
              value={secondaryVetContact}
              onChange={(e) => setSecondaryVetContact(e.target.value)}
            />
          </div>
          <button type="submit">Register Pet</button>
          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}
        </form>
      </section>
    </section>
  );
};

export default RegisterPet;
