import { Link, useLocation } from 'react-router-dom';
import '../Styles/order-success.css';

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order?.order || location.state?.order || null;
  const placedAt = order?.createdAt ? new Date(order.createdAt).toLocaleString() : null;

  return (
    <main className="order-success-page">
      <section className="order-success-card">
        <div className="order-success-icon" aria-hidden="true">✓</div>
        <p className="order-success-eyebrow">Campus Cart</p>
        <h1>Thank you for your order!</h1>
        <p className="order-success-copy">
          {order ? 'Your order has been placed successfully.' : 'Your order confirmation will appear here after checkout.'}
        </p>

        {order && (
          <dl className="order-success-details">
            {order._id && <div><dt>Order number</dt><dd>{order._id}</dd></div>}
            {placedAt && <div><dt>Placed</dt><dd>{placedAt}</dd></div>}
            {order.status && <div><dt>Status</dt><dd className="order-success-status">{order.status}</dd></div>}
            {order.totalAmount != null && <div><dt>Total</dt><dd>₹{Number(order.totalAmount).toFixed(2)}</dd></div>}
          </dl>
        )}

        <div className="order-success-actions">
          <Link className="order-success-primary" to="/shop">Continue shopping</Link>
          <Link className="order-success-secondary" to="/profile">View my orders</Link>
        </div>
      </section>
    </main>
  );
};

export default OrderSuccess;
