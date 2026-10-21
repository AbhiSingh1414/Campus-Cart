import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  setCartItemQuantity,
} from '../redux/cartSlice';
import '../Styles/cart.css';

const Cart = () => {
  const items = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const [productsById, setProductsById] = useState({});
  useEffect(() => {
    let active = true;
    Promise.all(items.map(async (item) => {
      const id = item._id ?? item.id ?? item.productId?._id ?? item.productId;
      if (!id) return null;
      try {
        const response = await fetch(`/products/${id}`);
        if (!response.ok) return null;
        const product = await response.json();
        return product?._id ? [String(product._id), product] : null;
      } catch {
        return null;
      }
    })).then((products) => {
      if (active) setProductsById(Object.fromEntries(products.filter(Boolean)));
    });
    return () => { active = false; };
  }, [items]);
  const itemCount = items.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  const discountedPrice = (item) => {
    const id = item._id ?? item.id ?? item.productId?._id ?? item.productId;
    const product = productsById[String(id)] ?? item;
    const price = Number(product.price) || 0;
    const discount = Math.min(Math.max(Number(product.discount) || 0, 0), 100);
    return price * (1 - discount / 100);
  };
  const subtotal = items.reduce(
    (total, item) => total + discountedPrice(item) * (Number(item.quantity) || 1),
    0,
  );
  const currency = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);

  if (items.length === 0) {
    return (
      <main className="cart-page cart-empty">
        <div className="cart-empty-icon" aria-hidden="true">🛒</div>
        <h1>Your cart is empty</h1>
        <p>Browse the shop and add something you need.</p>
        <Link className="cart-button cart-button-primary" to="/shop">Browse products</Link>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <header className="cart-heading">
        <p className="cart-eyebrow">Campus Cart</p>
        <h1>Your cart</h1>
        <p>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
      </header>

      <div className="cart-layout">
        <section className="cart-list" aria-label="Items in your cart">
          {items.map((item) => {
            const productId = item._id ?? item.id ?? item.productId?._id ?? item.productId;
            const quantity = Number(item.quantity) || 1;
            const product = productsById[String(productId)] ?? item;
            const price = Number(product.price) || 0;
            const salePrice = discountedPrice(item);
            const hasDiscount = salePrice < price;
            const stock = Number(product.stock);

            return (
              <article className="cart-item" key={productId}>
                <Link className="cart-item-image" to={`/product/${productId}`}>
                  <img
                    src={product.imageUrl?.trim() || '/placeholder-product.svg'}
                    alt={product.productname || 'Product'}
                    onError={(event) => { event.currentTarget.src = '/placeholder-product.svg'; }}
                  />
                </Link>

                <div className="cart-item-details">
                  <Link className="cart-item-name" to={`/product/${productId}`}>
                    {product.productname || 'Product'}
                  </Link>
                  <p className="cart-item-unit-price">
                    {hasDiscount && <del>{currency(price)}</del>}{' '}
                    <strong>{currency(salePrice)}</strong> each
                    {hasDiscount && <span className="cart-item-discount"> {Number(product.discount)}% off</span>}
                  </p>
                  <div className="cart-item-controls">
                    <label>
                      <span>Quantity</span>
                      <input
                        type="number"
                        min="1"
                        max={Number.isFinite(stock) && stock > 0 ? stock : undefined}
                        value={quantity}
                        onChange={(event) => {
                          const nextQuantity = Number(event.target.value);
                          if (!Number.isInteger(nextQuantity) || nextQuantity < 1) return;
                          const safeQuantity = Number.isFinite(stock) && stock > 0
                            ? Math.min(nextQuantity, stock)
                            : nextQuantity;
                          dispatch(setCartItemQuantity({ productId, quantity: safeQuantity }));
                        }}
                      />
                    </label>
                    <button type="button" onClick={() => dispatch(removeFromCart(productId))}>
                      Remove
                    </button>
                  </div>
                </div>
                <strong className="cart-item-line-total">
                  {hasDiscount && <del>{currency(price * quantity)}</del>}{' '}
                  {currency(salePrice * quantity)}
                </strong>
              </article>
            );
          })}

          <Link className="cart-continue-link" to="/shop">← Continue shopping</Link>
        </section>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <p className="cart-subtotal"><span>Subtotal</span><strong>{currency(subtotal)}</strong></p>
          <p className="cart-summary-note">Shipping and any applicable charges are confirmed at checkout.</p>
          <Link className="cart-button cart-button-primary" to="/checkout">Proceed to checkout</Link>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
