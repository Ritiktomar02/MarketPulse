import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="border-b border-slate-800 bg-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link
          to="/coins"
          className="text-2xl font-bold text-emerald-400"
        >
          MarketPulse
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/coins"
            className="text-slate-300 transition hover:text-emerald-400"
          >
            Market
          </Link>

          <Link
            to="/weather"
            className="text-slate-300 transition hover:text-emerald-400"
          >
            Weather
          </Link>

          <Link
            to="/profile"
            className="text-slate-300 transition hover:text-emerald-400"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;