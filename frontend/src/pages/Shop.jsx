import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const response = await fetch('/products', { signal: controller.signal });
        if (!response.ok) throw new Error(`Products request failed (${response.status}).`);
        const data = await response.json();
        setProducts(Array.isArray(data) ? data : data.products ?? []);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') setError(fetchError.message || 'Could not load products.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProducts();
    return () => controller.abort();
  }, []);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category).filter(Boolean))].sort(),
    [products],
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      const matchesSearch = `${product.productname ?? ''} ${product.description ?? ''} ${product.category ?? ''}`
        .toLowerCase().includes(query);
      return matchesSearch && (category === 'all' || product.category === category);
    });

    if (sort === 'price-low') filtered.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'price-high') filtered.sort((a, b) => Number(b.price) - Number(a.price));
    if (sort === 'name') filtered.sort((a, b) => (a.productname ?? '').localeCompare(b.productname ?? ''));
    return filtered;
  }, [products, search, category, sort]);

  return (
    <main className="shop-page">
      <header className="shop-heading">
        <p className="shop-eyebrow">Campus Cart</p>
        <h1>Shop all products</h1>
        <p>Find what you need for campus and everyday life.</p>
      </header>

      <section className="shop-controls" aria-label="Filter products">
        <label className="shop-search-label">
          <span>Search products</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or description"
          />
        </label>
        <label>
          <span>Category</span>
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Sort by</span>
          <select value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </section>

      {loading ? (
        <p className="shop-message" role="status">Loading products…</p>
      ) : error ? (
        <p className="shop-message shop-error" role="alert">{error} Check that the backend is running and try again.</p>
      ) : visibleProducts.length === 0 ? (
        <p className="shop-message">{products.length ? 'No products match your filters.' : 'No products are available yet.'}</p>
      ) : (
        <>
          <p className="shop-result-count">{visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}</p>
          <div className="shop-grid">
            {visibleProducts.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        </>
      )}
    </main>
  );
};

export default Shop;
