import React from "react";
import { Link } from "react-router-dom";
import "../styles/footer.css";

const Footer = () => {
  return (
    <section className="footer">
      <section className="footer-headers">
        <h3>Contact</h3>
        <h3>Quick Links</h3>
        <h3>Legal</h3>
      </section>
      <section className="footer-content">
        <div className="contact">
          <p>123-456-7890</p>
          <p>Email: email address</p>
        </div>
        <section className="quick-links">
          <Link to="/search">Microchip Search</Link>
          <Link to="/register-pet">Register a Pet</Link>
          <Link to="#">Change Ownership</Link>
          <Link to="/contact">Contact</Link>
        </section>
        <section className="legal">
          <Link to="#">Terms of Service</Link>
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Cookies Policy</Link>
        </section>
      </section>
    </section>
  );
};

export default Footer;
