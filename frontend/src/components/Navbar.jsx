import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar flex justify-evenly bg-amber-500'>
        <div className='navbar-brand '>
            <Link to = "/">
            <img src="/logo.png" alt="CampusCart" className='navbar-logo'/>
            CampusCart
            </Link>
        </div>
        <ul className='navbar-links flex justify-evenly'>
            <li><Link to="/Shop">Shop</Link></li>
            <li><Link to="/About">About Us</Link></li>
            <li><Link to="/Cart">Cart</Link></li>
            <li><Link to="/Help">Help</Link></li>
            <li><Link to="/Profile">Profile</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar
