import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFromCart,
  selectCartSubtotal,
  setCartItemQuantity,
} from '../redux/cartSlice';
import '../Styles/cart.css';

const Cart = () => {
  const items = useSelector((state) => state.cart.cartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();
  const itemCount = items.reduce((total, item) => total + (Number(item.quantity) || 1), 0);

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
            const productId = item._id ?? item.id;
            const quantity = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;
            const stock = Number(item.stock);

            return (
              <article className="cart-item" key={productId}>
                <Link className="cart-item-image" to={`/product/${productId}`}>
                  <img
                    src={item.imageUrl?.trim() || '/placeholder-product.svg'}
                    alt={item.productname || 'Product'}
                    onError={(event) => { event.currentTarget.src = '/placeholder-product.svg'; }}
                  />
                </Link>

                <div className="cart-item-details">
                  <Link className="cart-item-name" to={`/product/${productId}`}>
                    {item.productname || 'Product'}
                  </Link>
                  <p className="cart-item-unit-price">₹{price.toFixed(2)} each</p>
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

                <strong className="cart-item-line-total">₹{(price * quantity).toFixed(2)}</strong>
              </article>
            );
          })}

          <Link className="cart-continue-link" to="/shop">← Continue shopping</Link>
        </section>

        <aside className="cart-summary">
          <h2>Order summary</h2>
          <p className="cart-subtotal"><span>Subtotal</span><strong>₹{subtotal.toFixed(2)}</strong></p>
          <p className="cart-summary-note">Shipping and any applicable charges are confirmed at checkout.</p>
          <Link className="cart-button cart-button-primary" to="/checkout">Proceed to checkout</Link>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
