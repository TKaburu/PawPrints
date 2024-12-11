import React from 'react'
import PetSearch from '../petpages/PetSearch'
import HomeLogin from '../../components/HomeLogin'
import AboutPawPrints from '../../components/AboutPawPrints'
import KpcaHero from '../../components/KpcaHero'
import ReunificationStories from '../../components/ReunificationStories'
import WhyPawPrints from '../../components/WhyPawPrints'
import '../../styles/home.css'


const Home = () => {
  return (
    <>
    <section className='home-container'>
      <section className="about-pawprints">
        <AboutPawPrints />
      </section>
      <section className="double-col">
        <div className='search-pet'>
          <PetSearch />
        </div>
        <div className="login-section">
          <HomeLogin />
        </div>
      </section>
      
      <WhyPawPrints />
      <ReunificationStories />
      <KpcaHero />
    </section>
    
    </>
  );
};

export default Home;