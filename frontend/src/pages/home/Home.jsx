import React from 'react'
import PetSearch from '../petpages/PetSearch'
import AboutPawPrints from '../../components/AboutPawPrints'
import KpcaHero from '../../components/KpcaHero'
import ReunificationStories from '../../components/ReunificationStories'
import WhyPawPrints from '../../components/WhyPawPrints'


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