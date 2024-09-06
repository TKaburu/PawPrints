import React, { useState } from 'react';
import api from '../../api/api';
import { ACCESS_TOKEN } from '../../constants';
import './registerPet.css';

const RegisterPet = () => {
    const [name, setName] = useState('');
    const [microchipNo, setMicrochipNo] = useState('');
    const [typeOfPet, setTypeOfPet] = useState('');
    const [breed, setBreed] = useState('');
    const [age, setAge] = useState('');
    const [primaryVet, setPrimaryVet] = useState('');
    const [primaryVetContact, setPrimaryVetContact] = useState('');
    const [secondaryVet, setSecondaryVet] = useState('');
    const [secondaryVetContact, setSecondaryVetContact] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/pets/', {
                name,
                microchip_no: microchipNo,
                type_of_pet: typeOfPet,
                breed,
                age,
                primary_vet: primaryVet,
                primary_vet_contact: primaryVetContact,
                secondary_vet: secondaryVet,
                secondary_vet_contact: secondaryVetContact
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                    'Content-Type': 'application/json'
                }
            });
            setSuccess('Pet registered successfully!');
            setError('');
        } catch (err) {
            setError('An error occurred while registering the pet.');
            setSuccess('');
        }
    };

    return (
        <section className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="title">
                    <h1>Register a New Pet</h1>
                </div>
                <div>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Pet Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Microchip Number"
                        value={microchipNo}
                        onChange={(e) => setMicrochipNo(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Type of Pet"
                        value={typeOfPet}
                        onChange={(e) => setTypeOfPet(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Breed"
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="form-input"
                        type="number"
                        placeholder="Age"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Primary Vet"
                        value={primaryVet}
                        onChange={(e) => setPrimaryVet(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Primary Vet Contact"
                        value={primaryVetContact}
                        onChange={(e) => setPrimaryVetContact(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Secondary Vet (optional)"
                        value={secondaryVet}
                        onChange={(e) => setSecondaryVet(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        className="form-input"
                        type="text"
                        placeholder="Secondary Vet Contact (optional)"
                        value={secondaryVetContact}
                        onChange={(e) => setSecondaryVetContact(e.target.value)}
                    />
                </div>
                <button type="submit">Register Pet</button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </section>
    );
};

export default RegisterPet;
