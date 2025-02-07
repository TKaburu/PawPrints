import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api/api";

const WelfareOrganizationDashboard = () => {
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
                    const response = await api.get(`accounts/dashboard/welfare-organization/${username}/`, {
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
                            <h1>There are no Pets registered. <span><Link to={`/register-pet`}>Register one</Link></span> today!</h1>
                        </section>
                    ) : (
                        <>
                            <section className="title">
                                <h1>Here are the furries under your clinic</h1>
                            </section>
                            <section className="pet-list">
                                {pets.map((pet, index) => (
                                    <section key={index} className="pet">
                                        <h2>{pet.name}</h2>
                                        <p>{pet.species}</p>
                                        <p>{pet.breed}</p>
                                        <p>{pet.age}</p>
                                        <p>{pet.pet_parent}</p>
                                        <p>{pet.primary_vet}</p>
                                        <p>{pet.primary_vet_contact}</p>
                                        <p>{pet.secondary_vet}</p>
                                        <p>{pet.secondary_vet_contact}</p>
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

export default WelfareOrganizationDashboard;