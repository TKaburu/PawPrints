import React from 'react'
import { Link } from 'react-router-dom';
import './footer.css'

const Footer = () => {
  return (
    <div className='main-content'>
      <section className='footer'>
          <section className='footer-content'>
              <div className='contact'>
                  <h3>Contact</h3>
                  <p>123-456-7890</p>
                  <p> Email: email adreess </p>
              </div>
              <div className='quick-links'>
                  <h3>Quick Links</h3>
                  <Link to="/register-pet">Register a Pet</Link>
                  <a href="/about">Change Ownership</a>
                  <a href="/search">Microchip Search</a>
                  <a href="/contact">Contact</a>
              </div>
              

          </section>        
      </section>
    </div>
  )
}

export default Footer