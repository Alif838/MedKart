import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/medical-healthcare-pharmacy-logo-vector.jpg";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 py-5 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      
      {/* Logo */}
      <Link to="/" className="relative flex items-center">
        <img
          src={logo}
          alt="MedKart Logo"
          className="w-16 h-16 rounded-lg object-contain -mt-2"
        />
        <span className="text-2xl font-bold text-gray-900 tracking-wide leading-tight">MedKart</span>
      </Link>

      {/* Links */}
      <div className="hidden md:flex items-center space-x-8 font-semibold text-gray-600">
        <Link to="/" className="hover:text-purple-600 transition">Home</Link>
        <Link to="/medicine" className="hover:text-purple-600 transition">Medicine</Link>
        {user?.role === 'user' && (
          <Link to="/cart" className="hover:text-purple-600 transition">Cart</Link>
        )}
        <Link to="/about" className="hover:text-purple-600 transition">About Us</Link>
        {user?.role === 'seller' && (
          <Link to="/seller/dashboard" className="hover:text-purple-600 transition">Seller</Link>
        )}
        {user?.role === 'admin' && (
          <Link to="/admin/dashboard" className="hover:text-purple-600 transition">Admin</Link>
        )}
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-gray-700 font-medium hidden md:block">{user.name}</span>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="bg-linear-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-2xl font-semibold shadow-md hover:shadow-lg transition duration-300 hover:-translate-y-0.5"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-linear-to-r from-blue-600 to-cyan-500 text-white px-7 py-2.5 rounded-2xl font-semibold shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-0.5"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
