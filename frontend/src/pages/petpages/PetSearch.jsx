import React, { useState, useEffect } from "react";
import { searchPetByMicrochip } from "../../api/apiService";
import { ACCESS_TOKEN } from "../../constants";
import api from "../../api/api";
import "../../styles/petSearch.css";

const PetSearch = () => {
  const [microchipNo, setMicrochipNo] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); // New state to track if search has been performed
  const [vetClinics, setVetClinics] = useState({});

  useEffect(() => {
    const fetchVetClinics = async () => {
        try {
            const response = await api.get('accounts/vet-clinics/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
                },
            });
            const clinics = response.data.reduce((acc, clinic) => {
                acc[clinic.id] = clinic.username;
                return acc;
            }, {});
            setVetClinics(clinics);
        } catch (error) {
            console.error('Failed to fetch vet clinics:', error);
        }
    };

    fetchVetClinics();
  }, []);



  const handleSearch = async () => {
    setSearched(true); // Set searched to true when search is performed

    if (!microchipNo) {
      setError('Please enter a valid microchip number.');
      return;
    }

    try {
      const data = await searchPetByMicrochip(microchipNo);
      console.log("API Response:", data);
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
          <p>Enter a microchip number down bellow to find the petowner</p>
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
        <p className="description">
          <b>
            Please contact the Vet Clinic to reunit the pet with the owner!
          </b>
        </p>
        <section className={`search-results ${searched ? "show-results" : ""}`}>
          {error && <p>{error}</p>}
          
          {result && (
            <div className="pet-results">
              <div className="title">
                <h2>Pet Details</h2>
              </div>
              <section className="pet-result-details">
                {result.map((pet, slug) => (
                  <div key={slug}>
                    <section className="pet-details">
                      <p>Name of the pet: <b>{pet.pet_name}</b></p>
                      <p> {pet.pet_name}'s Vet Clinic: <b>{vetClinics[pet.primary_vet] }</b></p>
                      <p>Clinics Contact: <b>{pet.primary_vet_contact}</b></p>
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