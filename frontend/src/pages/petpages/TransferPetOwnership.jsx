import React, { useState } from 'react';
import { ACCESS_TOKEN } from '../../constants';
import api from '../../api/api';
import useNotification from '../../hooks/useNotification';

const TransferPetOwnership = ({
  selectedPet,
  setShowTransferModal,
  setPets,
  fetchPets
}) => {
  const [newOwnerEmail, setNewOwnerEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages
  const { showNotification } = useNotification(); // We'll keep this for the success notification

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the user is trying to transfer a pet to themselves
    const userEmail = localStorage.getItem('userEmail');
    if (newOwnerEmail === userEmail) {
      setErrorMessage('You cannot transfer a pet to yourself.');
      return; // Stop further execution if the email is the same
    }

    if (!newOwnerEmail) {
      setErrorMessage('New owner email is required.');
      return;
    }

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      await api.post(
        `/api/pet/${selectedPet.id}/transfer-request/`,
        { new_owner_email: newOwnerEmail },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      // Success notification
      showNotification(
        "Your request has been made. Please wait as the review is being done.",
        'success'
      );

      // Re-fetch pets to get the updated status
      const updatedPets = await fetchPets();
      setPets(updatedPets);

      // Close the modal after the data is updated
      setShowTransferModal(false);
    } catch (error) {
      // This will only be called if the API call fails
      setErrorMessage('Failed to submit transfer request. Please try again later.');
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <section className="modal-content">
          <h2>Transfer Ownership for {selectedPet.pet_name}</h2>
          <p className="description">
            The new pet owner needs to be registered to transfer ownership to them.
          </p>

          {/* Render the error message below the description if there's an error */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={handleSubmit}>
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
            <section className="double-buttons">
              <button type="submit">Submit Request</button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowTransferModal(false)}
              >
                Cancel
              </button>
            </section>
          </form>
        </section>
      </div>
    </>
  );
};

export default TransferPetOwnership;
