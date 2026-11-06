import { Navigate, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

// Only hides the page in the UI. Anyone can still read the JS bundle,
// so this is not security (see README).
export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // remember where the user wanted to go so Login can send them back
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
