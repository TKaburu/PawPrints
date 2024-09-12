import React from 'react'
import PetSearch from '../petSearch/PetSearch'
import AboutPawPrints from '../aboutPawPrints/AboutPawPrints'
import KpcaHero from '../kpcaHero/KpcaHero'
import ReunificationStories from '../reunificationStories/ReunificationStories'
import WhyPawPrints from '../whyPawPrints/WhyPawPrints'




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
      <WhyPawPrints />
      <ReunificationStories />
      <KpcaHero />
    </section>
    
    </>
  );
};

export default Home;