import { Link } from "react-router";

export default function Home() {
  return (
    <section>
      <h1>Welcome to Mini Shop</h1>
      <p>
        Browse the catalogue, filter it by name or category and add what you
        like to your cart. You need to sign in to see your cart.
      </p>
      <Link to="/products" className="button">
        Browse products
      </Link>
    </section>
  );
}
