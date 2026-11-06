import { Outlet } from "react-router";
import { useLocalStorage } from "../hooks/useLocalStorage";
import NavBar from "./NavBar";

export default function Layout() {
  const [theme, setTheme] = useLocalStorage("mini-shop-theme", "light");

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return (
    <div className={`app theme-${theme}`}>
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Mini Shop - CMP309 Web Programming, Assignment 7</p>
      </footer>
    </div>
  );
}
