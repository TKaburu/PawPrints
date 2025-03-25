import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';  // Import useParams
import api from '../../api/api';
import { ACCESS_TOKEN } from '../../constants';

const EditPetForm = () => {
    const { slug } = useParams();  // Get slug from URL params
    const [petData, setPetData] = useState({
        pet_name: '',
        microchip_no: '',
        type_of_pet: 'Dog',
        breed: '',
        age: '',
        pet_parent_contact: '',
        primary_vet: '',
        primary_vet_contact: '',
    });
    const [vetClinics, setVetClinics] = useState([]);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the vet clinics to populate the dropdown
        const fetchVetClinics = async () => {
            try {
                const response = await api.get('/accounts/vet-clinics/', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                    },
                });

                // Ensure we're setting an array
                const clinicsData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.results || [];
                
                setVetClinics(clinicsData);
            } catch (err) {
                console.error('Failed to fetch vet clinics:', err);
                setError('Failed to fetch vet clinics');
                setVetClinics([]); // Reset the vet clinics to an empty array
            }
        };
        
        const fetchPetDetails = async () => {
            try {
                const response = await api.get(`/api/pets/${slug}/`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                    },
                });
                setPetData(response.data);
            } catch (err) {
                setError('Failed to fetch pet details');
            }
        };

        if (slug) {
            fetchVetClinics();
            fetchPetDetails();
        }
    }, [slug]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.put(`/api/pets/${slug}/update/`, petData, {
                headers: {
                    'Authorization': `Bearer ${ACCESS_TOKEN}`,
                },
            });
            setSuccessMessage('Pet updated successfully!');
            setError('');
            navigate(`/dashboard/pet-owner/${username}`);
        } catch (err) {
            setError('Failed to update pet information');
        }
    };

    return (
        <div className="main-container">
            <section className="form">
                <form onSubmit={handleSubmit}>
                    <section className="title">
                    <h1>{petData.pet_name ? `You are editing  ${petData.pet_name} details` : "you're pets "}</h1>
                    </section>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

                    <label>Pet Name:</label>
                    <input
                        className='form-input'
                        type="text"
                        name="pet_name"
                        value={petData.pet_name}
                        onChange={handleChange}
                        required
                    />

                    <label>Microchip No:</label>
                    <input
                        className='form-input'
                        type="text"
                        name="microchip_no"
                        value={petData.microchip_no}
                        onChange={handleChange}
                        required
                    />

                    <label>Type of Pet:</label>
                    <select
                        className='form-input'
                        name="type_of_pet"
                        value={petData.type_of_pet}
                        onChange={handleChange}
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
                        className='form-input'
                        type="text"
                        name="breed"
                        value={petData.breed}
                        onChange={handleChange}
                    />

                    <label>Age:</label>
                    <input
                        className='form-input'
                        type="number"
                        name="age"
                        value={petData.age}
                        onChange={handleChange}
                        required
                    />

                    <label>Pet Parent Contact:</label>
                    <input
                        className='form-input'
                        type="text"
                        name="pet_parent_contact"
                        value={petData.pet_parent_contact}
                        onChange={handleChange}
                        required
                    />

                    <label>Vet Clinic:</label>
                    <select
                        className='form-input'
                        name="primary_vet"
                        value={petData.primary_vet}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a Vet Clinic</option>
                        {Array.isArray(vetClinics) && vetClinics.map((clinic) => (
                            <option key={clinic.id} value={clinic.id}>
                                {clinic.username}
                            </option>
                        ))}
                    </select>

                    <label>Vet Clinic Contact:</label>
                    <input
                        className='form-input'
                        type="text"
                        name="primary_vet_contact"
                        value={petData.primary_vet_contact}
                        onChange={handleChange}
                    />

                    <div className="double-buttons">
                        <button type="submit" className="save-btn">Save Changes</button>
                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={() => navigate(-1)}  // This will navigate back to the previous page
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default EditPetForm;
