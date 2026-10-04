import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css'

const Footer = () => {
  return (
    <footer className='footer bg-gray-900 text-white'>
      <div className='footer-content'>
        <p>&copy; 2026 CampusCart. All rights reserved.</p>
        <ul className='footer-links'>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/privacy">Privacy Policy</Link></li>          
        </ul>
      </div>
    </footer>
  )
}

export default Footer;
