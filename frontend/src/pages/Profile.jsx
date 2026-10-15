import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../Styles/profile.css';

const currency = (amount) => `₹${Number(amount || 0).toFixed(2)}`;

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const token = user?.token;

  useEffect(() => {
    if (!token) return undefined;

    const controller = new AbortController();
    const loadOrders = async () => {
      setLoadingOrders(true);
      setOrdersError('');
      try {
        const response = await fetch('/orders/myOrders', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Could not load your orders.');
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== 'AbortError') setOrdersError(error.message || 'Could not load your orders.');
      } finally {
        if (!controller.signal.aborted) setLoadingOrders(false);
      }
    };

    loadOrders();
    return () => controller.abort();
  }, [token]);

  if (!user) {
    return (
      <main className="profile-page profile-empty">
        <h1>Your profile</h1>
        <p>Log in to see your account and order history.</p>
        <Link className="profile-primary-link" to="/login">Log in</Link>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <header className="profile-heading">
        <p className="profile-eyebrow">Your account</p>
        <h1>Hi, {user.username || user.name || 'there'}</h1>
        <p>Manage your account details and keep track of your orders.</p>
      </header>

      <section className="profile-card" aria-labelledby="profile-details-heading">
        <h2 id="profile-details-heading">Account details</h2>
        <dl className="profile-details">
          <div><dt>Name</dt><dd>{user.username || user.name || '—'}</dd></div>
          <div><dt>Email</dt><dd>{user.email || '—'}</dd></div>
          <div><dt>Account type</dt><dd>{user.role || 'user'}</dd></div>
        </dl>
      </section>

      <section className="profile-orders" aria-labelledby="profile-orders-heading">
        <div className="profile-section-heading">
          <h2 id="profile-orders-heading">Order history</h2>
          <Link to="/shop">Continue shopping</Link>
        </div>

        {loadingOrders ? <p role="status">Loading your orders…</p> : null}
        {!loadingOrders && ordersError ? <p className="profile-error" role="alert">{ordersError}</p> : null}
        {!loadingOrders && !ordersError && orders.length === 0 ? (
          <div className="profile-card profile-no-orders">
            <p>You haven’t placed an order yet.</p>
            <Link className="profile-primary-link" to="/shop">Browse products</Link>
          </div>
        ) : null}

        {!loadingOrders && !ordersError && orders.map((order) => (
          <article className="profile-card profile-order" key={order._id}>
            <div className="profile-order-topline">
              <div>
                <h3>Order {String(order._id).slice(-8).toUpperCase()}</h3>
                <p>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'Date unavailable'}</p>
              </div>
              <span className={`profile-order-status status-${order.status || 'pending'}`}>{order.status || 'pending'}</span>
            </div>
            <ul className="profile-order-items">
              {(order.items || []).map((item, index) => (
                <li key={item._id || `${order._id}-${index}`}>
                  <span>{item.productId?.productname || 'Product'} × {item.quantity}</span>
                  <span>{currency(Number(item.price) * Number(item.quantity || 1))}</span>
                </li>
              ))}
            </ul>
            <p className="profile-order-total">Total <strong>{currency(order.totalAmount)}</strong></p>
          </article>
        ))}
      </section>
    </main>
  );
};

export default Profile;
