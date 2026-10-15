import React from 'react';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Return from './pages/Return';
import Privacy from './pages/Privacy';
import Disclaimer from './pages/Disclaimer';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import Shop from './pages/Shop';
import Profile from './pages/Profile';
import './Styles/global.css';
import OrderSuccess from './pages/OrderSuccess';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Admin, { AdminDashboard, AdminOrders, AdminProducts, AdminProductForm } from './pages/Admin';

const App = () => {
  return (
    <Router>
      <Navbar/>
        <Routes>
          <Route path ="/" element = {<Home/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/return" element={<Return />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path='/login'element={<Login/>}/>
          <Route path='/register'element={<Register/>}/>
          <Route path='/product/:id'element={<ProductDetail/>}/>
          <Route path='/shop' element={<Shop/>}/>
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/checkout' element={<Checkout/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/order-success' element={<OrderSuccess/>}/>
          <Route path='/admin' element={<Admin/>}>
            <Route index element={<AdminDashboard/>}/>
            <Route path='orders' element={<AdminOrders/>}/>
            <Route path='products' element={<AdminProducts/>}/>
            <Route path='products/new' element={<AdminProductForm/>}/>
            <Route path='products/:id/edit' element={<AdminProductForm/>}/>
          </Route>

        </Routes>
      <Footer/>
    </Router>
  )
}

export default App
