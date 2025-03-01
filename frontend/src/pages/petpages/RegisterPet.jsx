import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const RegisterPet = () => {
  // Define state variables for each form field
  const [petName, setPetName] = useState('');
  const [microchipNo, setMicrochipNo] = useState('');
  const [typeOfPet, setTypeOfPet] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petParentContact, setPetParentContact] = useState('');
  const [vetClinics, setVetClinics] = useState([]);
  const [primaryVet, setPrimaryVet] = useState('');
  const [primaryVetContact, setPrimaryVetContact] = useState('');
  const [secondaryVet, setSecondaryVet] = useState('');

  useEffect(() => {
    const fetchVetClinics = async () => {
      try {
        const response = await api.get('/accounts/vet-clinics/');
        setVetClinics(response.data);
      } catch (err) {
        console.error("Error fetching vet clinics:", err);
      }
    };

    fetchVetClinics();
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the pet object with all the necessary fields
    const petData = {
      pet_name: petName,
      microchip_no: microchipNo,
      type_of_pet: typeOfPet,
      breed: breed,
      age: age,
      pet_parent: localStorage.getItem('user_id'), //  user ID is stored in localStorage
      pet_parent_contact: petParentContact,
      primary_vet: primaryVet,
      primary_vet_contact: primaryVetContact,
      secondary_vet: secondaryVet,
    };

    try {
      const response = await api.post('/api/register-a-pet/', petData);
      console.log('Pet registered successfully:', response.data);
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else {
        console.error('Error', error.message);
      }
    }
  };

  return (
    <div className='main-container'>
      <form onSubmit={handleSubmit}>
        <section className="title">
            <h1>Register a pet</h1>
        </section>
        <label>Pet Name:</label>
        <input 
            className='form-input'
            type="text"
            value={petName} onChange={(e) => setPetName(e.target.value)} 
            required 
        />

        <label>Microchip No:</label>
        <input
            className='form-input'
            type="text"
            value={microchipNo} onChange={(e) => setMicrochipNo(e.target.value)}
            required
        />

        <label>Type of Pet:</label>
        <select 
            className='form-input'
            value={typeOfPet} onChange={(e) => setTypeOfPet(e.target.value)}>
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
            <option value="Horse">Horse</option>
            <option value="Cow">Cow</option>
            <option value="Fish">Fish</option>
            <option value="Goat">Goat</option>
            <option value="Sheep">Sheep</option>
            <option value="Snake">Snake</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
        </select>

        <label>Breed:</label>
        <input
            className='form-input'
            type="text"
            value={breed} onChange={(e) => setBreed(e.target.value)} 
            required
        />

        <label>Age:</label>
        <input
            className='form-input'
            type="number" value={age} onChange={(e) => setAge(e.target.value)}
            required 
        />

        <label>Pet Parent Contact:</label>
        <input
            className='form-input'
            type="text" value={petParentContact} onChange={(e) => setPetParentContact(e.target.value)}
            required 
        />

        <label>Primary Vet Clinic:</label>
        <select
            className='form-input'
            value={primaryVet}
            onChange={(e) => setPrimaryVet(e.target.value)}
            required
        >
            <option value="" disabled>Select a Vet Clinic</option>
            {vetClinics.map((clinic) => (
            <option key={clinic.id} value={clinic.id}>
                {clinic.username}
            </option>
            ))}
        </select>
     

        <label>Primary Vet Contact:</label>
        <input
            className='form-input'
            type="text" value={primaryVetContact} onChange={(e) => setPrimaryVetContact(e.target.value)} 
            required 
        />

        <label>Secondary Vet Clinic:</label>
        <select
            className='form-input'
            value={secondaryVet}
            onChange={(e) => setSecondaryVet(e.target.value)}
            required
        >
            <option
                value="" disabled>Select a Secondary Vet Clinic</option>
            {vetClinics.map((clinic) => (
            <option key={clinic.id} value={clinic.id}>
                {clinic.name}
            </option>
            ))}
        </select>
        <button type="submit">Register Pet</button>
      </form>
    </div>
  );
};

export default RegisterPet;
