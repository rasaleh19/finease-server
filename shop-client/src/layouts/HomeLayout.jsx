import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HomeLayout() {
  const location = useLocation();
  const is404 =
    location.pathname === "/404" ||
    location.pathname === "/error" ||
    location.pathname === "/not-found" ||
    location.pathname === "/Error404" ||
    location.pathname === "/Error404" ||
    location.pathname === "/error404" ||
    location.pathname === "/Error404";
  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      {!is404 && <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!is404 && <Footer />}
    </div>
  );
}
