import React, { useState } from 'react';
import api from '../../api/api';

const TransferPetOwnership = ({ 
    selectedPet, 
    setShowTransferModal, 
    transferError, 
    setTransferError,
    emailFormatError, 
    setEmailFormatError, 
    setSuccessMessage, 
    setPets, 
    pets 
}) => {
    const [transferEmail, setTransferEmail] = useState('');

    const validateEmailFormat = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    const handleTransferOwnership = async () => {
        if (!transferEmail) {
            setTransferError("Please enter the new owner's email and try again");
            return; // Prevent the API request if the email is empty
        }
        
        if (!validateEmailFormat(transferEmail)) {
            setEmailFormatError("Please enter a valid email address.");
            return;
        }
    
        try {
            // Fetch current user's details to get their email
            const token = localStorage.getItem('ACCESS_TOKEN');
            const currentUserResponse = await api.get('accounts/current-user-details/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            const currentUserEmail = currentUserResponse.data.email; // Get logged-in user's email
    
            // Prevent transfer to self
            if (transferEmail === currentUserEmail) {
                setTransferError("You cannot transfer the pet ownership to yourself.");
                return;
            }
    
            // Check if the email belongs to a registered pet owner
            const userCheckResponse = await api.get(
                'accounts/users/check-pet-owner/', // Endpoint to check if the user is a pet owner
                { 
                    headers: { 
                        'Authorization': `Bearer ${token}` 
                    },
                    params: { email: transferEmail } // Pass the email as a query param
                }
            );
    
            if (!userCheckResponse.data.isPetOwner) {
                setTransferError("The email address you have entered is not associated with a pet owner.");
                return; // Prevent the transfer if the user is not a pet owner
            }
    
            // Proceed with transferring the pet ownership
            const response = await api.post(
                `api/pet/${selectedPet.id}/transfer-ownership/`,
                { new_owner_email: transferEmail },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
    
            setSuccessMessage('Ownership transferred successfully!');
            setTransferError('');
            setEmailFormatError('');
            setShowTransferModal(false);
            setPets(pets.filter(pet => pet.id !== selectedPet.id));
    
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setTransferError("The email address you have entered is not registered. Please check and try again.");
            } else {
                setTransferError('Failed to transfer ownership. Please try again.');
            }
            setSuccessMessage('');
        }
    };
    
    

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Transfer Ownership of {selectedPet.pet_name}</h3>
                <p className="description">The new pet owner needs to be registered for the transfer of ownership</p>
                {transferError && <p style={{ color: 'red', marginTop: '10px' }}>{transferError}</p>}
                {emailFormatError && <p style={{ color: 'red', marginTop: '10px' }}>{emailFormatError}</p>}
                
                <input
                    className="form-input"
                    type="email"
                    placeholder="New Owner's Email"
                    value={transferEmail}
                    onChange={(e) => setTransferEmail(e.target.value)}
                    onFocus={() => {
                        setTransferError('');
                        setEmailFormatError('');
                    }}
                />
                <section className="double-buttons">
                    <button className="save-btn" onClick={handleTransferOwnership}>Transfer Ownership</button>
                    <button className="cancel-btn" onClick={() => setShowTransferModal(false)}>Cancel</button>
                </section>
            </div>
        </div>
    );
};

export default TransferPetOwnership;
