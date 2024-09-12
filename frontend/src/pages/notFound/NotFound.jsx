import React from 'react'
import { Link } from 'react-router-dom';
// import './NotFound.css';

const NotFound = () => {
  return (
    <div className="main-content">
      <h1>404</h1>
      <h2>Oops! Page Not Found</h2>
      <p>It looks like the page you're looking for doesn't exist.</p>
      <p>Maybe a cute pet picture will cheer you up!</p>
      <img src="https://placekitten.com/400/300" alt="Cute kitten" className="not-found-image" />
      <Link to="/" className="home-link">Go Back Home</Link>
    </div>
  );
};

export default NotFound