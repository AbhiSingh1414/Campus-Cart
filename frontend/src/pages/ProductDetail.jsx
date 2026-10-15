import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import '../styles/product-detail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      setProduct(null);

      try {
        const response = await fetch(`/products/${id}`, { signal: controller.signal });
        const data = await response.json();

        if (!response.ok || data.message === 'Product not found') {
          throw new Error(data.message || 'Could not load this product.');
        }

        setProduct(data);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Could not load this product.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchProduct();
    return () => controller.abort();
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  if (loading) {
    return <main className="product-detail-state" role="status">Loading product…</main>;
  }

  if (error || !product) {
    return (
      <main className="product-detail-state" role="alert">
        <h1>Product unavailable</h1>
        <p>{error || 'This product could not be found.'}</p>
        <button className="product-detail-back" onClick={() => navigate(-1)}>Go back</button>
        <Link to="/">Return to home</Link>
      </main>
    );
  }

  const price = Number(product.price) || 0;
  const discount = Math.min(Math.max(Number(product.discount) || 0, 0), 100);
  const discountedPrice = price * (1 - discount / 100);
  const inStock = Number(product.stock) > 0;

  return (
    <main className="product-detail">
      <Link className="product-detail-back-link" to="/">← Back to shopping</Link>
      <section className="product-detail-content">
        <div className="product-detail-image-wrap">
          <img
            className="product-detail-image"
            src={product.imageUrl || '/placeholder-product.png'}
            alt={product.productname}
          />
        </div>

        <div className="product-detail-info">
          {product.category && <p className="product-detail-category">{product.category}</p>}
          <h1>{product.productname}</h1>

          <div className="product-detail-rating" aria-label={`Rated ${Number(product.rating) || 0} out of 5`}>
            <span aria-hidden="true">★</span> {Number(product.rating) ? Number(product.rating).toFixed(1) : 'No ratings yet'}
            {Number(product.numReviews) > 0 && <span> ({product.numReviews} reviews)</span>}
          </div>

          <div className="product-detail-price">
            <strong>₹{discountedPrice.toFixed(2)}</strong>
            {discount > 0 && <><del>₹{price.toFixed(2)}</del><span className="product-detail-discount">{discount}% off</span></>}
          </div>

          <p className="product-detail-description">{product.description}</p>
          <p className={inStock ? 'product-detail-stock' : 'product-detail-stock is-out'}>
            {inStock ? `${product.stock} available` : 'Out of stock'}
          </p>

          <button className="product-detail-add" onClick={handleAddToCart} disabled={!inStock}>
            {inStock ? (added ? 'Added to cart ✓' : 'Add to cart') : 'Out of stock'}
          </button>
          {added && <p className="product-detail-confirmation" role="status">Added to your cart.</p>}
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
