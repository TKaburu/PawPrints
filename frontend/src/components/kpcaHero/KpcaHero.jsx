import React from "react";
import kpcaLogo from "../../assets/images/kpca-logo.png";
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
            >
              <span> KSPCA </span>
            </a>
            Kenya
          </h3>
        </div>
        <section className="kpca-description">
          <p>
            The Kenya Society for the Protection & Care of Animals (KSPCA) is an
            animal welfare charity organization in Kenya that deals for the most
            part with domestic animals. It is the only animal welfare
            organization that runs an animal shelter in Kenya. The society has
            branches in Nairobi, Mombasa, Naivasha and Nanyuki.
          </p>
        </section>
      </section>
      <a
        href="https://www.kspca.or.ke/donate-2-2/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <button className="donate-btn">Donate to KPCA</button>
      </a>
    </section>
  );
};

export default KpcaHero;
