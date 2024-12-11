import React, { useState } from 'react';
import api from '../../api/api';
import '../../styles/contactpage.css';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contactData = { name, email, message };

    try {
      const response = await api.post('/auth/contact/', contactData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setStatus('Message sent successfully!');
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      setStatus('Error occurred while sending message.');
    }
  };

  return (
    <div className='main-container'>
      <section className="form">
        <form onSubmit={handleSubmit}>
          <section className="title">
            <h1>Contact Us</h1>
          </section>

          <section className="description">
            <p>
              Need to reach out to us? Send us a message and we will get back to you as soon as possible.
            </p>
          </section>
      
          <label>
            Name:
            <input
              className="form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            Email:
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Message:
            <textarea
              className="form-input"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <button type="submit">Send Message</button>
        </form>
      </section>
      
      {status && <p>{status}</p>}
    </div>
  );
};

export default ContactPage;

