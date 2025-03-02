import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api/api";
import TransferPetOwnership from '../petpages/TransferPetOwnership';
import '../../styles/petownerdashboard.css';

const PetOwnerDashboard = () => {
    const [username, setUsername] = useState('');
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');
    const [selectedPet, setSelectedPet] = useState(null);
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [transferError, setTransferError] = useState('');
    const [emailFormatError, setEmailFormatError] = useState('');
    const [vetClinics, setVetClinics] = useState({});

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await api.get('accounts/current-user-details/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
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
        const fetchVetClinics = async () => {
            try {
                const response = await api.get('accounts/vet-clinics/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                    },
                });
                const clinics = response.data.reduce((acc, clinic) => {
                    acc[clinic.id] = clinic.username;
                    return acc;
                }, {});
                setVetClinics(clinics);
            } catch (error) {
                console.error('Failed to fetch vet clinics:', error);
            }
        };

        fetchVetClinics();
    }, []);

    useEffect(() => {
        if (username) {
            const fetchPets = async () => {
                try {
                    const response = await api.get(`accounts/dashboard/pet-owner/${username}/`, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                        },
                    });
                    setPets(response.data);
                } catch (error) {
                    setError('Failed to fetch pets');
                }
            };

            fetchPets();
        }
    }, [username]);

    const handleTransferClick = (pet) => {
        setSelectedPet(pet);
        setShowTransferModal(true);
    };

    return (
        <section className="main-container">
            <section className="dashboard">
                <section className="pet-list">
                    {error && <p>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                    {pets.length === 0 ? (
                        <section className="title">
                            <h1>You have no pets. <span><Link to={`/register-pet`}>Register one</Link></span> today!</h1>
                        </section>
                    ) : (
                        <>
                            <section className="title">
                                <h1>Here are your fur babies</h1>
                            </section>
                            <div className="pet-cards-grid">
                                {pets.map((pet) => (
                                    <section key={pet.id} className="pet-card">
                                        <h2>{pet.pet_name}</h2>
                                        <p>Type of pet: {pet.type_of_pet}</p>
                                        <p>Breed: {pet.breed}</p>
                                        <p>Age: {pet.age} years old</p>
                                        {/* Display username of the vet clinic */}
                                        <p>Vet Clinic: {vetClinics[pet.primary_vet] || 'Loading...'}</p>
                                        <p>Clinics Contact: {pet.primary_vet_contact}</p>
                                        <button onClick={() => handleTransferClick(pet)}>Transfer Ownership</button>
                                    </section>
                                ))}
                            </div>
                        </>
                    )}
                </section>
            </section>

            {/* Pass transferError and emailFormatError props to TransferPetOwnership */}
            {showTransferModal && (
                <TransferPetOwnership
                    selectedPet={selectedPet}
                    setShowTransferModal={setShowTransferModal}
                    transferError={transferError}
                    setTransferError={setTransferError}
                    emailFormatError={emailFormatError}
                    setEmailFormatError={setEmailFormatError}
                    setSuccessMessage={setSuccessMessage}
                    setPets={setPets}
                    pets={pets}
                />
            )}
        </section>
    );
};

export default PetOwnerDashboard;
