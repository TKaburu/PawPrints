import React from 'react';
import { Link } from 'react-router-dom';
import kitten404 from '../../assets/images/404-kitten.jpg';
import '../../styles/notfound.css'; // Import the CSS file

const NotFound = () => {
  return (
    <div className="main-container">
      <div className="not-found-title">
        <h1>404</h1>
      </div>
      <section className="not-found-container">
        <div className="text-container">
          <h2>Oops! Page Not Found</h2>
          <section className='description'>
            <p>It looks like the page you're looking for doesn't exist.</p>
            <p>Maybe a cute pet picture will cheer you up!</p>
          </section>
        </div>
        <div className="img-btn">
          <img src={kitten404} alt="Cute kitten" className='not-found-image'/>
          
        </div>
      </section>
      <Link to="/" className="home-link">
        <button>Go Back Home</button>
      </Link>
    </div>
  );
};

export default NotFound;