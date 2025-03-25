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
  const [errorMessage, setErrorMessage] = useState('');
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
        setErrorMessage("Failed to fetch user details.");
      }
    };

    const fetchVetClinics = async () => {
      try {
        const response = await api.get('/accounts/vet-clinics/');

        // Ensure we're setting an array
        const clinicsData = Array.isArray(response.data) 
          ? response.data 
          : response.data.results || [];
        
        setVetClinics(clinicsData);
      } catch (err) {
        console.error("Error fetching vet clinics:", err);
        setErrorMessage("Failed to fetch vet clinics.");
        setVetClinics([]); // Ensure it's an empty array
      }
    };

    fetchUserDetails();
    fetchVetClinics();
  }, []);

  const handleVetChange = (e) => {
    const vetId = e.target.value;
    setPrimaryVet(vetId); // Update the selected vet id
  
    // Ensure vet clinics are loaded before trying to find the selected vet
    if (vetClinics.length === 0) {
      return;
    }
  
    const selectedVet = vetClinics.find((clinic) => String(clinic.id) === String(vetId));
  
    if (selectedVet) {
      setPrimaryVetContact(selectedVet.phone_number); // Automatically update the vet contact number
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
      await api.post('/api/register-a-pet/', petData);
      setSuccessMessage('Pet registered successfully');
      setErrorMessage('');
      navigate('/dashboard/pet-owner/:username');
    } catch (error) {
      if (error.response) {
        console.error('Error response:', error.response.data);
        setErrorMessage(error.response.data.message || 'Failed to register pet');
      } else {
        console.error('Error', error.message);
        setErrorMessage('Failed to register pet. Please try again.');
      }
    }
  };

  return (
    <div className="main-container">
      <form className='auth-form' onSubmit={handleSubmit}>
        <section className="title">
          <h1>Register a pet</h1>
        </section>

        {errorMessage && (
          <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>
            {successMessage}
          </div>
        )}

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
          {Array.isArray(vetClinics) && vetClinics.map((clinic) => (
            <option key={clinic.id} value={clinic.id}>
              {clinic.username}
            </option>
          ))}
        </select>

        <label>Vet Contact:</label>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>
          Confirm your vet clinic's number below
        </p>
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