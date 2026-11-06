import { Outlet } from "react-router";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="app">
      <NavBar />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Mini Shop - CMP309 Web Programming, Assignment 7</p>
      </footer>
    </div>
  );
}
