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
import './Styles/global.css';

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
        </Routes>
      <Footer/>
    </Router>
  )
}

export default App
