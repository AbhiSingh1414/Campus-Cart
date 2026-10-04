import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard';
import '../styles/home.css'

const Home = () => {

  const[products,setProducts] = useState([]);
  const[loading,setLoading] = useState(true);

  useEffect(()=>{

    const fetchProducts = async () => {
      try{
        const res = await fetch('/products');
        const data = await res.json();
        setProducts(data.slice(0,3));
      }catch(error){
        console.error(error);
      }finally{
        setLoading(false);
      }
    };

  },[])

  return (
    <div className='home'>
      <div className='hero-banner'>
        <h1>Welcome to Campus Cart</h1>
        <p>Discover the best product at unbeatable price</p>
        {/* <Link to='/shop' className='bg-yellow-300'>Start Shopping</Link> */}
      </div>
      <h2>Featured Products</h2>
      {loading ? (
        <div>Loading...</div>
      ):(
        <div className="product-grid">
          {products.map((product)=>{
            <ProductCard key={product._id} product={product}></ProductCard>
          })}
        </div>
      )}
    </div>
    
  )
}

export default Home;

