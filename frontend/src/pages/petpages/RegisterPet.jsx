import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import '../../styles/registerpet.css';

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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

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

    const checkMicrochipExistence = async (microchipNo) => {
      try {
        const response = await api.get(`/api/check-microchip/${microchipNo}/`);
        return response.data.exists;
      } catch (error) {
        console.error("Error checking microchip number:", error);
        return false;
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      // Check if the microchip number already exists in the database
    const microchipExists = await checkMicrochipExistence(microchipNo);
    
    if (microchipExists) {
      setErrorMessage('The microchip number you have entered matches one in the database. Please check the number and try again.');
      return;
    }

    // Clear the error message if no error
    setErrorMessage('');
    
      // Create the pet object with all the necessary fields
      const petData = {
        pet_name: petName,
        microchip_no: microchipNo,
        type_of_pet: typeOfPet,
        breed: breed,
        age: age,
        pet_parent: {
          id: localStorage.getItem('user_id'), // Include user ID in the pet_parent object
        },
        pet_parent_contact: petParentContact,
        primary_vet: primaryVet,
        primary_vet_contact: primaryVetContact,
        secondary_vet: secondaryVet,
      };
    
      try {
        const response = await api.post('/api/register-a-pet/', petData);
        setSuccessMessage('Pet registered successfully! Redirecting to your dashboard...');

        setTimeout(() => {
          navigate('/dashboard/pet-owner/:username'); // Redirect to the dashboard route
        }, 2000);
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
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
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
