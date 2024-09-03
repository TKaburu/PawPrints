import React from 'react'
import './navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
        <section className="logo">
            PawPrints
        </section>
        <section className="links">
            <a href="/">Home</a>
            <a href="/about">Change Ownership</a>
            <a href="/contact">Contact</a>
        </section>
        <section className='auth'>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
        </section>
    </nav>
  )
}

export default Navbar
