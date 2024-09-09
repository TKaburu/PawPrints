import React from 'react'
import PetSearch from '../petSearch/PetSearch'
import KpcaHero from '../kpcaHero/KpcaHero'

const Home = () => {
  return (
    <>
    <section className="main-content">
      <div className='search-pet'>
        <PetSearch />
      </div>
      <KpcaHero />
    </section>
    
    </>
  );
};

export default Home;