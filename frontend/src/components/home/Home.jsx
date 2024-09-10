import React from 'react'
import PetSearch from '../petSearch/PetSearch'
import AboutPawPrints from '../aboutPawPrints/AboutPawPrints'
import KpcaHero from '../kpcaHero/KpcaHero'


const Home = () => {
  return (
    <>
    <section className="main-content">
      <section className="about-pawprints">
        <AboutPawPrints />
      </section>
      <div className='search-pet'>
        <PetSearch />
      </div>
      <KpcaHero />
    </section>
    
    </>
  );
};

export default Home;