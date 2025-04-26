import React from 'react';
import api from "../../api/api";
import { ACCESS_TOKEN } from "../../constants";

const DeletePetModal = ({
    pet,
    setPets,
    setShowDeleteModal,
    setError,
    setSuccessMessage
}) => {

    const deletePet = async (slug) => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const response = await api.delete(`api/pets/${slug}/delete/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                // Remove the deleted pet from the pets list
                setPets((prevPets) => prevPets.filter((pet) => pet.slug !== slug));
                setSuccessMessage('Pet deleted successfully!');
                setShowDeleteModal(false); // Close the modal after deletion
            }
        } catch (error) {
            setError('Failed to delete pet');
        }
    };

    const handleDeleteClick = () => {
        deletePet(pet.slug);
    };

    const handleCancelClick = () => {
        setShowDeleteModal(false); // Close the modal if cancelled
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <section className="title">
                    <h1>Are you sure you want to delete {pet.pet_name}?</h1>
                </section>
                <p>Once you delete this pet, you will not be able to recover it.</p>
                
                <section className="double-buttons">
                    <button className="save-btn" onClick={handleDeleteClick}>Delete</button>
                    <button className="cancel-btn" onClick={handleCancelClick}>Cancel</button>
                </section>
            </div>
        </div>
    );
};

export default DeletePetModal;
