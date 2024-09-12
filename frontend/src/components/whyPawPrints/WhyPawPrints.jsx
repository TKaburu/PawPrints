import React from 'react';
import { MdOutlineSecurity } from "react-icons/md";
import { SiHuggingface } from "react-icons/si";
import './whyPawPrints.css';

const WhyPawPrints = () => {
  const reasons = [
    {
      title: "Peace of Mind",
      description: "Ensure your pet's safety with our reliable microchip registration and reunification services.",
      icon: <MdOutlineSecurity /> 
    },
    {
      title: "Easy Registration",
      description: "Quick and simple process to register your pet’s microchip and keep your information up-to-date.",
      icon: "✍️" 
    },

    {
      title: "Community Support",
      description: "Join a community of pet lovers and receive tips, updates, and support from fellow pet owners.",
      icon: "🤝"
    },
    {
      title: "Reunification Stories",
      description: "Read real stories of pets reunited with their families and share your own success story.",
      icon: <SiHuggingface />
    },
  ];

  return (
    <section className="why-signup">
      <div className="title">
        <h2>Why Sign Up with PawPrints</h2>
      </div>
      <div className="reasons">
        {reasons.map((reason, index) => (
          <div key={index} className="reason">
            <div className="icon">{reason.icon}</div>
            <div className="reason-content">
              <h3>{reason.title}</h3>
              <p>{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyPawPrints;
