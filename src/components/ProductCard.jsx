import { Link } from "react-router";
import { selectAddItem, useCartStore } from "../store/cartStore";

export default function ProductCard({ product }) {
  // only the action is needed here, so only the action is selected
  const addItem = useCartStore(selectAddItem);

  return (
    <article className="card">
      <Link to={`/products/${product.id}`} className="card-link">
        <img src={product.thumbnail} alt={product.title} loading="lazy" />
        <h3>{product.title}</h3>
      </Link>
      <p className="muted">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <button type="button" onClick={() => addItem(product)}>
        Add to cart
      </button>
    </article>
  );
}
