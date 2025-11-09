import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";

export default function Navbar() {
  const authContext = useAuth() || {};
  const { user, logout } = authContext;
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = async () => {
    if (logout) {
      await logout();
      navigate("/");
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <nav className="navbar bg-base-200 px-4 py-2 flex justify-between items-center shadow">
      <div className="flex items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/1041/1041916.png"
          alt="FinEase Logo"
          className="h-8 w-8"
        />
        <span className="font-bold text-xl">FinEase</span>
      </div>
      <div className="flex gap-2 items-center flex-wrap">
        <Link to="/" className="btn btn-ghost">
          Home
        </Link>
        {user && (
          <>
            <Link to="/add-transaction" className="btn btn-ghost">
              Add Transaction
            </Link>
            <Link to="/my-transactions" className="btn btn-ghost">
              My Transactions
            </Link>
            <Link to="/reports" className="btn btn-ghost">
              Reports
            </Link>
            <Link to="/profile" className="btn btn-ghost">
              My Profile
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline">
              Signup
            </Link>
          </>
        )}
        {user && (
          <div className="flex items-center gap-2 relative">
            <Link to="/profile" className="flex flex-col items-center group">
              <img
                src={
                  user.photoURL ||
                  "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border border-base-300 aspect-square"
                style={{ borderRadius: "50%" }}
              />
              <span className="text-xs font-semibold mt-1 text-gray-800 group-hover:underline">
                {user.displayName || user.email}
              </span>
            </Link>
            <button className="btn btn-outline ml-2" onClick={handleLogout}>
              Log out
            </button>
          </div>
        )}
        <button
          className="btn btn-outline"
          onClick={toggleTheme}
          aria-label="Toggle light/dark mode"
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
    </nav>
  );
}
