import { createContext, useCallback, useContext, useMemo, useReducer } from "react";
import { login as loginRequest } from "../api/authApi";

const AuthContext = createContext(null);

const initialState = { user: null };

function authReducer(state, action) {
  switch (action.type) {
    case "LOGGED_IN":
      return { ...state, user: action.payload };
    case "LOGGED_OUT":
      return { ...state, user: null };
    default:
      throw new Error(`Unknown auth action: ${action.type}`);
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // throws when the credentials are wrong, Login.jsx catches it
  const login = useCallback(async (username, password) => {
    const user = await loginRequest(username, password);
    dispatch({ type: "LOGGED_IN", payload: user });
    return user;
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGGED_OUT" });
  }, []);

  // memoized so consumers only re-render when the user actually changes
  const value = useMemo(
    () => ({ user: state.user, login, logout }),
    [state.user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used inside an <AuthProvider>.");
  }
  return context;
}
