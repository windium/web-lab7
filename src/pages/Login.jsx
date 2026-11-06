import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ProtectedRoute puts the original location into state.from
  const from = location.state?.from;
  const redirectTo = from ? from.pathname + from.search : "/";

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(username, password);
      // replace so the back button does not come back to the login form
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <section className="login">
      <h1>Sign in</h1>
      {from && <p className="muted">Please sign in to continue.</p>}

      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </section>
  );
}
