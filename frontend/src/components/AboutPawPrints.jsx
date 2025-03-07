import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/aboutPawPrints.css";
import pawPrintsAbout from "../assets/images/pawprints-about.jpg";

const AboutPawPrints = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    setIsDropdownOpen(true);
  };
  return (
    <section className="about-pawprints">
      <section className="about-details">
        <section className="content">
          <h2>What is PawPrints?</h2>
          <p>
            PawPrints is a streamlined platform for registering pets using their
            microchip numbers to enhance safety and facilitate quick reunions.
          </p>
          <section className="auth">
            <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              Register
            </button>
            {isDropdownOpen && (
              <div className="dropdown-menu" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                <Link to="/register/pet-owner" onClick={handleMouseLeave}>
                  Register as Pet Owner
                </Link>
                <Link to="/register/vet-clinic" onClick={handleMouseLeave}>
                  Register as Vet Clinic
                </Link>
                <Link to="/register/welfare-organization" onClick={handleMouseLeave}>
                  Register as Welfare Organization
                </Link>
              </div>
            )}
          </section>
        </section>
        <section className="about-image">
          <img src={pawPrintsAbout} alt="PawPrints About" />
        </section>
      </section>
    </section>
  );
};

export default AboutPawPrints;