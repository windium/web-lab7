import { NavLink } from "react-router";
import { useAuth } from "../context/AuthContext";

function linkClass({ isActive }) {
  return isActive ? "nav-link active" : "nav-link";
}

export default function NavBar() {
  const { user, logout } = useAuth();

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
          Cart
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
