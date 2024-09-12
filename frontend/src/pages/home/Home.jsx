import React from 'react'
import PetSearch from '../petSearch/PetSearch'
import AboutPawPrints from '../../components/aboutPawPrints/AboutPawPrints'
import KpcaHero from '../../components/kpcaHero/KpcaHero'
import ReunificationStories from '../../components/reunificationStories/ReunificationStories'
import WhyPawPrints from '../../components/whyPawPrints/WhyPawPrints'


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