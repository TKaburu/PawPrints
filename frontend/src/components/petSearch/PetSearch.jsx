import React, { useState } from "react";
import { searchPetByMicrochip } from "../../api/apiService";
import "./petSearch.css";

const PetSearch = () => {
  const [microchipNo, setMicrochipNo] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
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
      <section className="search-results">
        {error && <p>{error}</p>}
        {result && (
          <div className="pet-results">
            <div className="title">
              <h2>Pet Details</h2>
            </div>
            <section className="pet-details">
              {result.map((pet, index) => (
                <div key={index}>
                  <p>Name: {pet.name}</p>
                  <p>Pet Type: {pet.type_of_pet}</p>
                  <p>Breed: {pet.breed}</p>
                  <p>
                    Age: {pet.age} {pet.age === 1 ? "Year" : "Years"}
                  </p>
                  <p>
                    Owner: {pet.pet_parent_name.first_name}{" "}
                    {pet.pet_parent_name.last_name}
                  </p>
                  <p>Primary Vet: {pet.primary_vet}</p>
                  <p>Primary Vet Contact: {pet.primary_vet_contact}</p>
                  {pet.secondary_vet && (
                    <p>Secondary Vet: {pet.secondary_vet}</p>
                  )}
                  {pet.secondary_vet_contact && (
                    <p>Secondary Vet Contact: {pet.secondary_vet_contact}</p>
                  )}
                </div>
              ))}
              ;
            </section>
          </div>
        )}
      </section>
    </section>
  );
};

export default PetSearch;
