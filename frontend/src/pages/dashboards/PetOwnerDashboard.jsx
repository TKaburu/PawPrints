import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api/api";
import TransferPetOwnership from '../petpages/TransferPetOwnership';
import DeletePetModal from '../petpages/DeletePetModal';
import '../../styles/petownerdashboard.css';

const PetOwnerDashboard = () => {
  const [username, setUsername] = useState('');
  const [pets, setPets] = useState([]);
  const [error, setError] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [vetClinics, setVetClinics] = useState({});
  const [clinicsLocation, setClinicsLocation] = useState({});
  const [isDeleteModalOpen, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [transferError, setTransferError] = useState('');
  const [emailFormatError, setEmailFormatError] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get('accounts/current-user-details/', {
          headers: {
            'Authorization': `Bearer ${token}`,
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
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get('accounts/vet-clinics/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const clinics = response.data.reduce((acc, clinic) => {
          acc[clinic.id] = clinic.username;
          return acc;
        }, {});
        setVetClinics(clinics);

        const clinicsLocation = response.data.reduce((acc, clinic) => {
          acc[clinic.id] = clinic.location;
          return acc;
        }, {});
        setClinicsLocation(clinicsLocation);
      } catch (error) {
        console.error('Failed to fetch vet clinics:', error);
      }
    };

    fetchVetClinics();
  }, []);

  const fetchPets = useCallback(async () => {
    if (!username) return; // Make sure username is available
    
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get(`accounts/dashboard/pet-owner/${username}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // Ensure pets is always an array
      setPets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError('Failed to fetch pets');
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      fetchPets();
    }
  }, [username, fetchPets]);

  const handleTransferClick = (pet) => {
    setSelectedPet(pet);
    setShowTransferModal(true);
  };

  const handleDeleteClick = (pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  };

  return (
    <section className="main-container">
      <section className="dashboard">
        <section className="pet-list">
          {error && <p>{error}</p>}
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {Array.isArray(pets) && pets.length === 0 ? (
            <section className="title">
              <h1>You have no pets. <span><Link to={`/register-pet`}>Register one</Link></span> today!</h1>
            </section>
          ) : (
            <>
              <section className="title">
                <h1>Here are your fur babies</h1>
              </section>
              <div className="pet-cards-grid">
                {pets?.map((pet) => (
                  <section key={pet.id} className="pet-card">
                    <h2>{pet.pet_name}</h2>
                    {pet.transfer_status === 'pending' && (
                      <p style={{ color: 'orange', fontWeight: 'bold', textAlign: 'center' }}>
                        Waiting for transfer approval
                      </p>
                    )}
                    <p>Type of pet: {pet.type_of_pet}</p>
                    <p>Breed: {pet.breed}</p>
                    <p>Age: {pet.age} {pet.age === 1 ? 'year' : 'years'} old</p>
                    <p>Vet Clinic: {vetClinics[pet.primary_vet]}</p>
                    <p>Clinics Contact: {pet.primary_vet_contact}</p>
                    <p>Clinic's Location: {clinicsLocation[pet.primary_vet]}</p>

                    <section className="double-buttons">
                      {pet.transfer_status !== 'pending' && (
                        <>
                          <Link to={`/edit-pet-info/${pet.slug}`}>
                            <button>Edit Pet</button>
                          </Link>
                          <button onClick={() => handleTransferClick(pet)}>
                            Transfer Ownership
                          </button>
                          <button onClick={() => handleDeleteClick(pet)}>Delete</button>
                        </>
                      )}
                    </section>
                  </section>
                ))}
              </div>
            </>
          )}
        </section>
      </section>

      {/* Transfer Modal */}
      {showTransferModal && (
        <TransferPetOwnership
          selectedPet={selectedPet}
          setShowTransferModal={setShowTransferModal}
          successMessage={successMessage}
          setSuccessMessage={setSuccessMessage}
          setPets={setPets}
          pets={pets}
          transferError={transferError}
          setTransferError={setTransferError}
          emailFormatError={emailFormatError}
          setEmailFormatError={setEmailFormatError}
          fetchPets={fetchPets}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && petToDelete && (
        <DeletePetModal
          pet={petToDelete}
          setPets={setPets}
          setShowDeleteModal={setShowDeleteModal}
          setError={setError}
          setSuccessMessage={setSuccessMessage}
        />
      )}
    </section>
  );
};

export default PetOwnerDashboard;
