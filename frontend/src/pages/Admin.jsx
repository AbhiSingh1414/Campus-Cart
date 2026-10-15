import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import '../styles/admin.css';

const authHeaders = (token) => ({ Authorization: `Bearer ${token}` });
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Admin = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><p className="admin-eyebrow">Campus Cart</p><h1>Admin workspace</h1></div>
        <span className="admin-account">{user.username || user.email} <b>Admin</b></span>
      </header>
      <nav className="admin-nav" aria-label="Admin sections">
        <NavLink end to="/admin">Overview</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
      </nav>
      <Outlet />
    </main>
  );
};

export const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/analytics', { headers: authHeaders(user.token), signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Could not load dashboard stats.');
        setStats(data);
      })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message); });
    return () => controller.abort();
  }, [user.token]);

  return <section className="admin-content">
    <div className="admin-section-heading"><div><p className="admin-eyebrow">Overview</p><h2>Store performance</h2></div></div>
    {error && <p className="admin-alert" role="alert">{error}</p>}
    <div className="admin-stat-grid">
      <Stat label="Products" value={stats?.totalProducts ?? '—'} />
      <Stat label="Orders" value={stats?.totalOrders ?? '—'} />
      <Stat label="Customers" value={stats?.totalUsers ?? '—'} />
      <Stat label="Revenue" value={stats ? money(stats.totalRevenue) : '—'} />
    </div>
    <div className="admin-quick-links">
      <Link to="/admin/orders"><span>Manage fulfillment</span><strong>Review and update customer orders →</strong></Link>
      <Link to="/admin/products"><span>Store catalog</span><strong>Update inventory and product details →</strong></Link>
      <Link to="/admin/products/new"><span>Add to the store</span><strong>Create a new product listing →</strong></Link>
    </div>
  </section>;
};

const Stat = ({ label, value }) => <article className="admin-stat"><span>{label}</span><strong>{value}</strong></article>;

export const AdminOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState('');

  const loadOrders = useCallback(async (signal) => {
    setLoading(true);
    try {
      const response = await fetch('/orders', { headers: authHeaders(user.token), signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load orders.');
      setOrders(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) { if (err.name !== 'AbortError') setError(err.message); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, [user.token]);

  useEffect(() => {
    const controller = new AbortController();
    loadOrders(controller.signal);
    return () => controller.abort();
  }, [loadOrders]);

  const updateStatus = async (orderId, status) => {
    setSavingId(orderId);
    try {
      const response = await fetch(`/orders/${orderId}/status`, {
        method: 'PUT', headers: { ...authHeaders(user.token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not update order status.');
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status } : order));
      setError('');
    } catch (err) { setError(err.message); }
    finally { setSavingId(''); }
  };

  return <section className="admin-content">
    <div className="admin-section-heading"><div><p className="admin-eyebrow">Fulfillment</p><h2>Orders <span className="admin-count">{orders.length}</span></h2></div><button className="admin-button admin-button-quiet" onClick={() => loadOrders()}>Refresh</button></div>
    {error && <p className="admin-alert" role="alert">{error}</p>}
    {loading ? <p className="admin-state">Loading orders…</p> : orders.length === 0 ? <p className="admin-state">No orders have been placed yet.</p> :
      <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr></thead><tbody>
        {orders.map((order) => <tr key={order._id}>
          <td><strong>#{String(order._id).slice(-8).toUpperCase()}</strong><small>{(order.items || []).length} line items</small></td>
          <td>{order.user?.username || order.user?.email || 'Customer'}<small>{order.address?.[0]?.city || order.address?.city || ''}</small></td>
          <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
          <td>{money(order.totalAmount)}</td>
          <td><select aria-label={`Status for order ${order._id}`} value={order.status || 'pending'} disabled={savingId === order._id} onChange={(event) => updateStatus(order._id, event.target.value)}><option value="pending">Pending</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option></select></td>
        </tr>)}
      </tbody></table></div>}
  </section>;
};

export const AdminProducts = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async (signal) => {
    setLoading(true);
    try {
      const response = await fetch('/products', { signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load products.');
      setProducts(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) { if (err.name !== 'AbortError') setError(err.message); }
    finally { if (!signal?.aborted) setLoading(false); }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProducts(controller.signal);
    return () => controller.abort();
  }, [loadProducts]);

  const removeProduct = async (product) => {
    if (!window.confirm(`Delete “${product.productname}”?`)) return;
    try {
      const response = await fetch(`/products/${product._id}`, { method: 'DELETE', headers: authHeaders(user.token) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'Could not delete product.');
      setProducts((current) => current.filter((item) => item._id !== product._id));
    } catch (err) { setError(err.message); }
  };

  return <section className="admin-content">
    <div className="admin-section-heading"><div><p className="admin-eyebrow">Catalog</p><h2>Products <span className="admin-count">{products.length}</span></h2></div><Link className="admin-button" to="/admin/products/new">＋ Add product</Link></div>
    {error && <p className="admin-alert" role="alert">{error}</p>}
    {loading ? <p className="admin-state">Loading products…</p> : products.length === 0 ? <p className="admin-state">No products yet. Add your first product to the store.</p> :
      <div className="admin-product-grid">{products.map((product) => <article className="admin-product-card" key={product._id}>
        <img src={product.imageUrl || '/placeholder-product.svg'} alt={product.productname} />
        <div className="admin-product-info"><span className={`admin-stock ${Number(product.stock) > 0 ? '' : 'is-out'}`}>{Number(product.stock) > 0 ? `${product.stock} in stock` : 'Out of stock'}</span><h3>{product.productname}</h3><p>{product.category}</p><strong>{money(product.price)}</strong></div>
        <div className="admin-product-actions"><Link to={`/admin/products/${product._id}/edit`}>Edit</Link><button onClick={() => removeProduct(product)}>Delete</button></div>
      </article>)}</div>}
  </section>;
};

const emptyProduct = { productname: '', price: '', discount: '0', description: '', category: '', stock: '', imageUrl: '' };

export const AdminProductForm = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return undefined;
    const controller = new AbortController();
    fetch(`/products/${id}`, { signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load product.');
      setForm({ ...emptyProduct, ...data });
      setImagePreview(data.imageUrl || '');
    }).catch((err) => { if (err.name !== 'AbortError') setError(err.message); });
    return () => controller.abort();
  }, [id]);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const selectImage = (event) => {
    const file = event.target.files?.[0] || null;
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : (form.imageUrl || ''));
  };
  const submit = async (event) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const body = new FormData();
      ['productname', 'price', 'discount', 'description', 'category', 'stock'].forEach((field) => body.append(field, form[field]));
      if (imageFile) body.append('image', imageFile);
      const response = await fetch(id ? `/products/${id}` : '/products', {
        method: id ? 'PUT' : 'POST',
        headers: authHeaders(user.token),
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not save product.');
      navigate('/admin/products');
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  return <section className="admin-content admin-form-page">
    <div className="admin-section-heading"><div><p className="admin-eyebrow">Catalog</p><h2>{id ? 'Edit product' : 'Create product'}</h2></div><Link className="admin-button admin-button-quiet" to="/admin/products">Back to products</Link></div>
    <form className="admin-product-form" onSubmit={submit}>
      {error && <p className="admin-alert" role="alert">{error}</p>}
      <label>Product name<input name="productname" value={form.productname} onChange={updateField} required /></label>
      <div className="admin-form-row"><label>Price (₹)<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={updateField} required /></label><label>Discount (%)<input name="discount" type="number" min="0" max="100" value={form.discount} onChange={updateField} /></label><label>Stock quantity<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={updateField} required /></label></div>
      <label>Category<input name="category" value={form.category} onChange={updateField} required /></label>
      <label>Product image<input name="image" type="file" accept="image/*" onChange={selectImage} required={!id && !imageFile} /></label>
      {imagePreview && <img className="admin-image-preview" src={imagePreview} alt="Product preview" />}
      <label>Description<textarea name="description" rows="5" value={form.description} onChange={updateField} required /></label>
      <button className="admin-button" disabled={saving}>{saving ? 'Saving…' : id ? 'Save changes' : 'Create product'}</button>
    </form>
  </section>;
};

export default Admin;
