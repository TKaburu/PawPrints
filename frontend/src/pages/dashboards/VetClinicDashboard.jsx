import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useParams } from "react-router-dom";

const VetClinicDashboard = () => {
  const { slug } = useParams();
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await api.get(`/vet-clinic-dashboard/${slug}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ACCESS_TOKEN")}`,
          },
        });

        if (response.status === 200) {
          setPets(response.data);
        } else {
          setError("Failed to fetch pets. Please try again.");
        }
      } catch (error) {
        setError("Failed to fetch pets. Please try again.");
        console.error(
          "Failed to fetch pets:",
          error.response?.data || error.message
        );
      }
    };

    fetchPets();
  }, [slug]);

  return (
    <div className='main-container'>
      <section className='title'>
        <h1>Vet Clinic Dashboard</h1>
      </section>
      <section className='content'>
        <h2>Pets</h2>
        <ul>
          {pets.map((pet) => (
            <li key={pet.id}>{pet.name}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default VetClinicDashboard;
