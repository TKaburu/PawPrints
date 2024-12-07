import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/homelogin.css'

const HomeLogin = () => {
  return (
    // <section className="main-container">
        <section className="login-card">
            <div className="title">
                <h1>Login</h1>
            </div>
            <p className='description'>Manage your pets by login in to your accout</p>
            <section className="double-btn">
              <Link><button className="btn">Vet Clinic</button></Link>
              <Link><button className="btn">Welfare</button></Link>
            </section>
        </section>

    // </section>
  )
}

export default HomeLogin;