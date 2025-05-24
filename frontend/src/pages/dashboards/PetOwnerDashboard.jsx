import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api/api";
import TransferPetOwnership from "../petpages/TransferPetOwnership";
import DeletePetModal from "../petpages/DeletePetModal";
import Pagination from "../../components/Pagination"; // Import the Pagination component
import "../../styles/petOwnerDashboard.css";

const PetOwnerDashboard = () => {
  const [username, setUsername] = useState("");
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");
  const [selectedPet, setSelectedPet] = useState(null);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [vetClinics, setVetClinics] = useState({});
  const [clinicsLocation, setClinicsLocation] = useState({});
  const [isDeleteModalOpen, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [transferError, setTransferError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");
  // Pagination state
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);
  const [vetClinicsUrl, setVetClinicsUrl] = useState("accounts/vet-clinics/");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const token = localStorage.getItem(ACCESS_TOKEN);
        const response = await api.get("accounts/current-user-details/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsername(response.data.username);
      } catch (error) {
        setError("Failed to fetch user details");
      }
    };

    fetchUsername();
  }, []);

  const fetchVetClinics = useCallback(async (url = "accounts/vet-clinics/") => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Vet clinics response:", response.data);

      // Handle paginated response
      const clinicsArray = response.data.results || [];

      // Set pagination links
      setNextPage(response.data.next);
      setPreviousPage(response.data.previous);

      // Process clinic data
      const clinics = clinicsArray.reduce((acc, clinic) => {
        acc[clinic.id] = clinic.username;
        return acc;
      }, {});

      const locations = clinicsArray.reduce((acc, clinic) => {
        acc[clinic.id] = clinic.location;
        return acc;
      }, {});

      // Update state with new data (merging with existing data)
      setVetClinics((prevClinics) => ({ ...prevClinics, ...clinics }));
      setClinicsLocation((prevLocations) => ({
        ...prevLocations,
        ...locations,
      }));
    } catch (error) {
      console.error("Failed to fetch vet clinics:", error);
    }
  }, []);

  // useEffect to fetch vet clinics when vetClinicsUrl changes or on initial load
  useEffect(() => {
    if (vetClinicsUrl) {
      // Ensure URL is present before fetching
      fetchVetClinics(vetClinicsUrl);
    }
  }, [vetClinicsUrl, fetchVetClinics]); // Depends on vetClinicsUrl and the memoized fetchVetClinics

  const handlePageChange = useCallback(
    (url) => {
      if (url) {
        // Extract the path from the full URL
        const urlObj = new URL(url);
        const path = urlObj.pathname + urlObj.search;

        // Remove the base URL to get just the endpoint
        const endpoint = path.replace(/^\/api\//, "");

        setVetClinicsUrl(endpoint); // Update the URL, which will trigger the useEffect above
      }
    },
    [] // setVetClinicsUrl is stable and doesn't need to be in dependencies. fetchVetClinics is no longer called here.
  );

  const fetchPets = useCallback(async () => {
    if (!username) return; // Make sure username is available

    try {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const response = await api.get(
        `accounts/dashboard/pet-owner/${username}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Ensure pets is always an array
      setPets(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError("Failed to fetch pets");
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
    <section className='main-container'>
      <section className='dashboard'>
        <section className='pet-list'>
          {error && <p>{error}</p>}
          {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
          {Array.isArray(pets) && pets.length === 0 ? (
            <section className='title'>
              <h1>
                You have no pets.{" "}
                <span>
                  <Link to={`/register-pet`}>Register one</Link>
                </span>{" "}
                today!
              </h1>
            </section>
          ) : (
            <>
              <section className='title'>
                <h1>Here are your fur babies</h1>
              </section>
              <div className='pet-cards-grid'>
                {pets?.map((pet) => (
                  <section key={pet.id} className='pet-card'>
                    <h2>{pet.pet_name}</h2>
                    {pet.transfer_status === "pending" && (
                      <p
                        style={{
                          color: "orange",
                          fontWeight: "bold",
                          textAlign: "center",
                        }}>
                        Waiting for transfer approval
                      </p>
                    )}
                    <p>Type of pet: {pet.type_of_pet}</p>
                    <p>Breed: {pet.breed}</p>
                    <p>
                      Age: {pet.age} {pet.age === 1 ? "year" : "years"} old
                    </p>
                    <p>Vet Clinic: {vetClinics[pet.primary_vet]}</p>
                    <p>Clinics Contact: {pet.primary_vet_contact}</p>
                    <p>Clinic's Location: {clinicsLocation[pet.primary_vet]}</p>

                    <section className='double-buttons'>
                      {pet.transfer_status !== "pending" && (
                        <>
                          <Link to={`/edit-pet-info/${pet.slug}`}>
                            <button>Edit Pet</button>
                          </Link>
                          <button onClick={() => handleTransferClick(pet)}>
                            Transfer Ownership
                          </button>
                          <button onClick={() => handleDeleteClick(pet)}>
                            Delete
                          </button>
                        </>
                      )}
                    </section>
                  </section>
                ))}
              </div>
            </>
          )}
        </section>

        {/* Pagination control for vet clinics */}
        <div className='vet-clinics-pagination'>
          <Pagination
            next={nextPage}
            previous={previousPage}
            onPageChange={handlePageChange}
          />
        </div>
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
