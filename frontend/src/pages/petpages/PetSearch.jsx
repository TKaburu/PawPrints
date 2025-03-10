import React, { useState, useEffect } from "react";
import { searchPetByMicrochip } from "../../api/apiService";
import api from "../../api/api";
import "../../styles/petSearch.css";

const PetSearch = () => {
  const [microchipNo, setMicrochipNo] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); // New state to track if search has been performed
  const [vetClinics, setVetClinics] = useState({}); // Store vet clinic data
  const [clinicsLocation, setClinicsLocation] = useState({}); // Store clinic locations

  // Fetch vet clinic data
  useEffect(() => {
    const fetchVetClinics = async () => {
        try {
            const response = await api.get('accounts/vet-clinics/');
            const clinics = {};
            const locations = {};

            // Check if response.data.results exists and is an array
            if (response.data && Array.isArray(response.data.results)) {
                response.data.results.forEach(clinic => {
                    clinics[clinic.id] = clinic.username;
                    locations[clinic.id] = clinic.location || "Location not available";
                });
            }

            setVetClinics(clinics);
            setClinicsLocation(locations);
        } catch (error) {
            console.error('Failed to fetch vet clinics:', error);
            setError('Failed to fetch vet clinics');
        }
    };

    fetchVetClinics();
  }, []);

  // Handle search by microchip number
  const handleSearch = async () => {
    setSearched(true); // Set searched to true when search is performed

    if (!microchipNo) {
      setError('Please enter a valid microchip number.');
      return;
    }

    // Check if vet clinics data has been loaded
    if (Object.keys(vetClinics).length === 0 || Object.keys(clinicsLocation).length === 0) {
      setError('Vet clinics data is still loading, please try again later.');
      return;
    }

    try {
      const data = await searchPetByMicrochip(microchipNo);
      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setResult(data);
        setError(null);
      }
    } catch (err) {
      setError("An error occurred while searching.");
      setResult(null);
    }
  };

  return (
    <section className="main-container">
      <section className="search-container">
        <div className="title">
          <h1>Search Pet By Microchip</h1>
        </div>
        <section className="description">
          <p>Enter a microchip number below to find the pet owner</p>
        </section>
        <section className="search-bar">
          <input
            type="text"
            value={microchipNo}
            onChange={(e) => setMicrochipNo(e.target.value)}
            placeholder="Enter microchip number"
          />
        </section>
        <div className="search-btn">
          <button onClick={handleSearch}>Search</button>
        </div>

        <section className={`search-results ${searched ? "show-results" : ""}`}>
          {error && <p>{error}</p>}

          {result && (
            <div className="pet-results">
              <p className="description">
                <b>Please contact the Vet Clinic to reunite the pet with the owner!</b>
              </p>
              <div className="title">
                <h2>Pet Details</h2>
              </div>
              <section className="pet-result-details">
                {result.map((pet, slug) => (
                  <div key={slug}>
                    <section className="pet-details">
                      <p>Name of the pet: <b>{pet.pet_name}</b></p>
                      <p>
                        {pet.pet_name}'s Vet Clinic: <b>{vetClinics[pet.primary_vet] || "Unknown Clinic"}</b>
                      </p>
                      <p>Clinics Contact: <b>{pet.primary_vet_contact || "Unknown"}</b></p>
                      <p>
                        Clinic's Location: <b>{clinicsLocation[pet.primary_vet] || "Location not available"}</b>
                      </p>
                    </section>
                  </div>
                ))}
              </section>
            </div>
          )}
        </section>
      </section>
    </section>
  );
};

export default PetSearch;
