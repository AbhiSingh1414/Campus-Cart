import { useState } from 'react';
import '../styles/info-pages.css';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  return (
    <main className="info-page contact-page">
      <header className="info-hero">
        <span className="info-eyebrow">We’re happy to help</span>
        <h1>Contact us</h1>
        <p>Send a message about a product, order, or anything else you need a hand with.</p>
      </header>
      <section className="info-card contact-card">
        {submitted ? <p className="form-success" role="status">Thanks for reaching out. Your message has been prepared.</p> : null}
        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" autoComplete="name" required />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="contact-subject">What can we help with?</label>
          <select id="contact-subject" name="subject" defaultValue="order">
            <option value="order">An order</option><option value="product">A product</option><option value="other">Something else</option>
          </select>
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows="5" required />
          <button className="info-button" type="submit">Send message</button>
        </form>
        <p className="contact-note">This form is a front-end placeholder and does not send messages yet.</p>
      </section>
    </main>
  );
}
