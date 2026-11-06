import { Link } from "react-router";
import {
  selectClear,
  selectItems,
  selectRemoveItem,
  selectSetQuantity,
  selectTotalPrice,
  useCartStore,
} from "../store/cartStore";

export default function Cart() {
  const items = useCartStore(selectItems);
  const totalPrice = useCartStore(selectTotalPrice);
  const setQuantity = useCartStore(selectSetQuantity);
  const removeItem = useCartStore(selectRemoveItem);
  const clear = useCartStore(selectClear);

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">Go to the products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>

      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id} className="cart-item">
            <Link to={`/products/${item.id}`} className="cart-title">
              {item.title}
            </Link>
            <span>${item.price.toFixed(2)}</span>

            <div className="quantity">
              <button
                type="button"
                onClick={() => setQuantity(item.id, item.quantity - 1)}
                aria-label={`Decrease quantity of ${item.title}`}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(item.id, item.quantity + 1)}
                aria-label={`Increase quantity of ${item.title}`}
              >
                +
              </button>
            </div>

            <span>${(item.price * item.quantity).toFixed(2)}</span>
            <button type="button" onClick={() => removeItem(item.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="cart-footer">
        <p className="price">Total: ${totalPrice.toFixed(2)}</p>
        <button type="button" onClick={clear}>
          Clear cart
        </button>
      </div>
    </section>
  );
}
