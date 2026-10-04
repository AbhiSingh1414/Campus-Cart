import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/product.css'

const ProductCard = ({product}) => {
  return (
    <div className='product-card'>
      <img src={product.imageUrl} alt={product.name} className='product-image'/>
      <div className='product-info'>
        <p>{product.price.toFixed(2)}</p>
        <h3 className='product-name'>{product.name}</h3>
        <Link to={`/product/${product._id}`} className ="product-link">View Details</Link>
      </div>
    </div>
  )
}

export default ProductCard;
