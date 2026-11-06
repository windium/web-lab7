import { useSearchParams } from "react-router";
import { fetchProducts } from "../api/productsApi";
import { useFetch } from "../hooks/useFetch";
import ProductCard from "../components/ProductCard";

export default function ProductList() {
  const { loading, error, data: products } = useFetch(
    (signal) => fetchProducts(signal),
    []
  );
  const [searchParams, setSearchParams] = useSearchParams();

  // the URL is the single source of truth for the filters
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  // copy the current params and change only one key, so changing the
  // category keeps the search text and the other way around
  function updateParam(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(key, value);
        } else {
          next.delete(key);
        }
        return next;
      },
      { replace: true }
    );
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="error">Could not load products: {error.message}</p>;
  }

  // everything below is derived during render, nothing is copied into state
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const search = query.trim().toLowerCase();
  const visibleProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search) &&
      (category === "" || p.category === category)
  );

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => updateParam("q", e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {visibleProducts.length === 0 ? (
        <p>No products match your filters.</p>
      ) : (
        <>
          <p className="muted">{visibleProducts.length} products</p>
          <div className="grid">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
