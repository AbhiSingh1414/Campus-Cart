import React, { useContext } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {AuthContext} from '../context/AuthContext.jsx';
import logo from '../assets/logo.png'
import '../Styles/navbar.css';



const Navbar = () => {

  const {user,logout} = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className='navbar '>
        <div className='navbar-brand '>
            <Link to = "/">
              <img src={logo} alt="CampusCart" className='navbar-logo'/>
              CampusCart
            </Link>
        </div>
        <ul className='navbar-links '>
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/cart">Cart ({cartItems.length})</Link></li>
            {user ? (
              <>
              <li><Link to="/profile">Hi, {user.username || user.name}</Link></li>
              {user.role === 'admin' && <li><Link to='/admin'>Admin</Link></li>}
              <li><button onClick={handleLogout}className='handle-logout'>Logout</button></li>

              </>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}
        </ul>
    </nav>
  )
}

export default Navbar
