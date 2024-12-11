import React, { useState } from "react";
import { searchPetByMicrochip } from "../../api/apiService";
import "../../styles/petSearch.css";

const PetSearch = () => {
  const [microchipNo, setMicrochipNo] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false); // New state to track if search has been performed

  const handleSearch = async () => {
    setSearched(true); // Set searched to true when search is performed
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
    <section className="search-container">
      <div className="title"> 
        <h1>Search Pet By Microchip</h1>
      </div>
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
            <div className="title">
              <h2>Pet Details</h2>
            </div>
            <section className="pet-result-details">
              {result.map((pet, slug) => (
                <div key={slug}>
                  <section className="pet-details">
                    <p>Name: {pet.name}</p>
                    <p>Owner: {pet.pet_parent_name.first_name}</p>
                    <p>Primary Vet: {pet.primary_vet.first_name} {pet.primary_vet.last_name}</p>
                    <p>Contact: {pet.primary_vet_contact}</p>

                    {pet.secondary_vet && (
                      <>
                        <p>Secondary Vet: {pet.secondary_vet.first_name} {pet.secondary_vet.last_name}</p>
                        <p>Contact: {pet.secondary_vet_contact}</p>
                      </>
                    )}
                  </section>
                  
                </div>
              ))}
            </section>
          </div>
        )}
      </section>
    </section>   
  );
};

export default PetSearch;