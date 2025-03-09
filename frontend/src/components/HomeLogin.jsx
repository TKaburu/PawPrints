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
      <section className="double-buttons">
        <Link to='/login'><button className="save-btn">Vet Clinic</button></Link>
        <Link to='/login'><button className="cancel-btnn">Welfare</button></Link>
      </section>
    </section>
  )
}

export default HomeLogin;