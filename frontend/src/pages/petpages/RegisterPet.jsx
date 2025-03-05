import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

const RegisterPet = () => {
  const [petName, setPetName] = useState('');
  const [microchipNo, setMicrochipNo] = useState('');
  const [typeOfPet, setTypeOfPet] = useState('Dog');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [petParentContact, setPetParentContact] = useState('');
  const [vetClinics, setVetClinics] = useState([]);
  const [primaryVet, setPrimaryVet] = useState('');
  const [primaryVetContact, setPrimaryVetContact] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user info to autofill the pet parent contact
    const fetchUserDetails = async () => {
      try {
        const response = await api.get('/accounts/current-user-details/');
        const userContact = response.data.phone_number;
        setPetParentContact(userContact);  // Set pet parent contact field
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };

    const fetchVetClinics = async () => {
      try {
        const response = await api.get('/accounts/vet-clinics/');
        setVetClinics(response.data);
      } catch (err) {
        console.error("Error fetching vet clinics:", err);
      }
    };

    fetchUserDetails();
    fetchVetClinics();
  }, []);

  const handleVetChange = (e) => {
    const vetId = e.target.value;
    setPrimaryVet(vetId); // Update the selected vet id

    // Find the clinic by id and set its contact number in the vet contact field
    const selectedVet = vetClinics.find(
      (clinic) => clinic.id === vetId
    );

    if (selectedVet) {
      setPrimaryVetContact(selectedVet.phone_number); // Update the vet contact number
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the pet object with all the necessary fields
    const petData = {
      pet_name: petName,
      microchip_no: microchipNo,
      type_of_pet: typeOfPet,
      breed: breed || '',
      age: age,
      pet_parent: localStorage.getItem('user_id'), // user ID is stored in localStorage
      pet_parent_contact: petParentContact,
      primary_vet: primaryVet,
      primary_vet_contact: primaryVetContact,
    };

    try {
      const response = await api.post('/api/register-a-pet/', petData);
      setSuccessMessage('Pet registered successfully');
      setError('');
      navigate('/dashboard/pet-owner/:username');
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
      } else {
        console.error('Error', error.message);
      }
    }
  };

  return (
    <div className="main-container">
      <form onSubmit={handleSubmit}>
        <section className="title">
          <h1>Register a pet</h1>
        </section>

        <label>Pet Name:</label>
        <input
          className="form-input"
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          required
        />

        <label>Microchip No:</label>
        <input
          className="form-input"
          type="text"
          value={microchipNo}
          onChange={(e) => setMicrochipNo(e.target.value)}
          required
        />

        <label>Type of Pet:</label>
        <select
          className="form-input"
          value={typeOfPet}
          onChange={(e) => setTypeOfPet(e.target.value)}
        >
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
          className="form-input"
          type="text"
          value={breed}
          onChange={(e) => setBreed(e.target.value)}
        />

        <label>Age:</label>
        <input
          className="form-input"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />

        <label>Pet Parent Contact:</label>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>
          Confirm your number below
        </p>
        <input
          className="form-input"
          type="text"
          value={petParentContact}
          onChange={(e) => setPetParentContact(e.target.value)}
          required
        />

        <label>Vet Clinic:</label>
        <select
          className="form-input"
          value={primaryVet}
          onChange={handleVetChange}
          required
        >
          <option value="" disabled>
            Select a Vet Clinic
          </option>
          {vetClinics.map((clinic) => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.username}
            </option>
          ))}
        </select>

        <label>Vet Contact:</label>
        <input
          className="form-input"
          type="text"
          value={primaryVetContact}
          onChange={(e) => setPrimaryVetContact(e.target.value)}
          required
        />

        <button type="submit">Register Pet</button>
      </form>
    </div>
  );
};

export default RegisterPet;
