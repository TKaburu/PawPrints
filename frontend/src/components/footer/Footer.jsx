import React from 'react'
import { Link } from 'react-router-dom';
import './footer.css'

const Footer = () => {
  return (
    <section className='footer'>
        <section className='footer-content'>
            <div className='contact'>
                <h3>Contact</h3>
                <p>123-456-7890</p>
                <p> Email: email adreess </p>
            </div>
            <div className='quick-links'>
                <h3>Quick Links</h3>
                <a href="/about">Change Ownership</a>
                <a href="/search">Microchip Search</a>
                <a href="/contact">Contact</a>
            </div>
            

        </section>        
    </section>
  )
}

export default Footer