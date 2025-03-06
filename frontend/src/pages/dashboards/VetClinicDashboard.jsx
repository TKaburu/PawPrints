import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api/api";
import '../../styles/vetclinicdashboard.css';

const VetClinicDashboard = () => {
    const [username, setUsername] = useState("");
    const [pets, setPets] = useState([]);
    const [error, setError] = useState("");

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
        if (username) {
            const fetchPets = async () => {
                try {
                    const response = await api.get(`accounts/dashboard/vet-clinic/${username}/`, {
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

    return (
        <section className="main-container">
            <section className="dashboard">
                <section className="pet-list">
                    {error && <p>{error}</p>}
                    {pets.length === 0 ? (
                        <section className="title">
                            <h1>You have no pets registered under your clinic. <span><Link to={`/register-pet`}>Register one</Link></span> today!</h1>
                        </section>
                    ) : (
                        <>
                            <section className="title">
                                <h1>Here are the furries under your clinic</h1>
                            </section>
                            <section className="pet-cards-grid">
                                {pets.map((pet) => (
                                    <section key={pet.id} className="pet-card">
                                        <h2>{pet.pet_name}</h2>
                                        <p>Type of pet: {pet.type_of_pet}</p>
                                        <p>Breed: {pet.breed}</p>
                                        <p>Age: {pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
                                        <p>Owner: {pet.pet_parent_first_name} {pet.pet_parent_last_name}</p>
                                        <p>Owner's Contact: {pet.pet_parent_contact}</p>
                                    </section>
                                ))}
                            </section>
                        </>
                    )}
                </section>
            </section>
        </section>
    );
};

export default VetClinicDashboard;
