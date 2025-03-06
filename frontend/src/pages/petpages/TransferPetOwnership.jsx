import React, { useState } from 'react';
import { ACCESS_TOKEN } from '../../constants';
import api from '../../api/api';

const TransferPetOwnership = ({
  selectedPet,
  setShowTransferModal,
  successMessage,
  setSuccessMessage,
  setPets,
  pets,
  transferError,
  setTransferError,
  emailFormatError,
  setEmailFormatError,
  fetchPets // Receive fetchPets as a prop
}) => {
  const [newOwnerEmail, setNewOwnerEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newOwnerEmail) {
      setEmailFormatError('New owner email is required.');
      return;
    }

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await api.post(`/api/pet/${selectedPet.id}/transfer-request/`, { new_owner_email: newOwnerEmail }, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      setSuccessMessage('Transfer request has been submitted and is awaiting approval.');

      // Re-fetch pets to get the updated status
      const updatedPets = await fetchPets();
      setPets(updatedPets);  // Set updated pets here

      // Close the modal after the data is updated
      setShowTransferModal(false); 
    } catch (error) {
      setTransferError('Failed to submit transfer request.');
    }
  };

  return (
    <div className="modal-overlay">
      <section className="modal-content">
        <h2>Transfer Ownership for {selectedPet.pet_name}</h2>
        <p className="description">The new pet owner needs to be registered for the transfer of ownership.</p>
        {transferError && <p style={{ color: 'red', marginTop: '10px' }}>{transferError}</p>}
        {emailFormatError && <p style={{ color: 'red', marginTop: '10px' }}>{emailFormatError}</p>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="newOwnerEmail">New Owner's Email:</label>
          <input
            className="form-input"
            placeholder="New Owner's Email"
            type="email"
            id="newOwnerEmail"
            name="newOwnerEmail"
            value={newOwnerEmail}
            onChange={(e) => setNewOwnerEmail(e.target.value)}
            required
          />
          {emailFormatError && <p style={{ color: 'red' }}>{emailFormatError}</p>}
          <button type="submit">Submit Transfer Request</button>
        </form>
      </section>
    </div>
  );
};

export default TransferPetOwnership;
