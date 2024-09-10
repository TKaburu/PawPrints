import React from "react";
import "./aboutPawPrints.css";
import pawPrintsAbout from "../../assets/images/pawprints-about.jpg";

const AboutPawPrints = () => {
  return (
    <section className="about-pawprints">
      <section className="about-details">
        <section className="content">
          <h2>What is PawPrints?</h2>
          <p>
            PawPrints is a streamlined platform for registering pets using their
            microchip numbers to enhance safety and facilitate quick reunions.
          </p>
          <button>Get Started</button>
        </section>
        <section className="about-image">
          <img src={pawPrintsAbout} alt="PawPrints About" />
        </section>
      </section>
    </section>
  );
};

export default AboutPawPrints;
