import { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard';
import '../Styles/home.css'

const Home = () => {

  const[products,setProducts] = useState([]);
  const[loading,setLoading] = useState(true);
  const[loadError,setLoadError] = useState(false);

  useEffect(()=>{

    const fetchProducts = async () => {
      try{
        const res = await fetch('/products');
        if (!res.ok) {
          throw new Error(`Products request failed (${res.status})`);
        }

        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products ?? [];
        setProducts(productList.slice(0,));
      }catch(error){
        console.error(error);
        setLoadError(true);
      }finally{
        setLoading(false);
      }
    };

    fetchProducts();
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
      ):loadError ? (
        <div>Could not load products. Check that both servers are running.</div>
      ):products.length === 0 ? (
        <div>No products are available yet.</div>
      ):(
        <div className="product-grid">
          {products.map((product)=>(
            <ProductCard key={product._id} product={product}></ProductCard>
          ))}
        </div>
      )}
    </div>
    
  )
}

export default Home;

