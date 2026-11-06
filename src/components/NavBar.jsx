import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";
import { selectItemCount, useCartStore } from "../store/cartStore";

function linkClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function NavBar() {
  const { user, logout } = useAuth();
  // the selector returns a number, so the nav bar only re-renders
  // when the count changes (not when a price or title changes)
  const itemCount = useCartStore(selectItemCount);

  return (
    <header className="navbar">
      <span className="brand">Mini Shop</span>
      <nav className="nav-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/cart" className={linkClass}>
          Cart ({itemCount})
        </NavLink>
      </nav>

      <div className="nav-user">
        {user ? (
          <>
            <span className="username">{user.username}</span>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        )}
      </div>
    </header>
  );
}
