import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Medicine from "./Pages/Medicine.jsx";
import Cart from "./Pages/Cart.jsx";
import Contact from "./Pages/Contact.jsx";
import AboutUs from "./Pages/AboutUs.jsx";
import AdminDashboard from "./Pages/AdminDashboard.jsx";
import SellerDashboard from "./Pages/SellerDashboard.jsx";

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">

      {!isAdminRoute && <Navbar />}

      {/* Main content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/medicine" element={<ProtectedRoute><Medicine /></ProtectedRoute>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/seller/dashboard" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Footer always at bottom */}
      {!isAdminRoute && <Footer />}

    </div>
  );
}
