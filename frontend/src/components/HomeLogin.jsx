import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/homelogin.css'

const HomeLogin = () => {
  return (
    <section className="login-card">
        <div className="title">
            <h1>Login</h1>
        </div>
        <p className='description'>Are you a vet or a welfare organization? Log in bellow</p>
        <section className="double-btn">
          <Link><button className="btn">Vet Clinic</button></Link>
          <Link><button className="btn">Welfare</button></Link>
        </section>
    </section>
  )
}

export default HomeLogin;