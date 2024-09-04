import React from "react";
import kpcaLogo from "../../assets/kpca-logo.png";
import "./kpcaHero.css";

const KpcaHero = () => {
  return (
    <section className="kpca-hero">
      <section className="kpca-details">
      <section className="kpca-hero-image">
        <a
          href="https://www.kspca.or.ke/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={kpcaLogo} alt="KPCA Logo" />
        </a>
      </section>
        <div className="title">
          <h3>
            A Proud Supporter of
            <a
              href="https://www.kspca.or.ke/"
              target="_blank"
              rel="noopener noreferrer"
            ><span> KPCA Kenya</span></a>
            
          </h3>
        </div>
        <section className="kpca-description">
          <p>
            The Kentucky Pet Care Association (KPCA) is a non-profit
            organization that promotes the health and well-being of pets in
            Kentucky. KPCA provides resources and support to pet owners, pet
            care professionals, and animal shelters in the state. We are proud
            to support KPCA in their mission to improve the lives of pets and
            pet owners in Kentucky.
          </p>
        </section>
      </section>
      <a href="https://www.kspca.or.ke/donate-2-2/" target="_blank" rel="noopener noreferrer"><button className="donate-btn">Donate to KPCA</button></a>
    </section>
  );
};

export default KpcaHero;
