import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import Home from "./pages/Home.jsx";
import Jobs from "./pages/Jobs.jsx";
import Login from "./pages/Login.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import NotFound from "./pages/NotFound.jsx";
import Payment from "./pages/Payment.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import Products from "./pages/Products.jsx";
import Register from "./pages/Register.jsx";
import SellerDashboard from "./pages/SellerDashboard.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <div className={`app-shell${isAdmin ? " admin-app-shell" : ""}`}>
      {!isAdmin && <Navbar />}
      <main className="page-main">
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/:section" element={<AdminDashboard />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProtectedRoute role="buyer"><Products /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute role="buyer"><ProductDetails /></ProtectedRoute>} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<ProtectedRoute role="buyer"><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute role="buyer"><Checkout /></ProtectedRoute>} />
          <Route path="/payment/:id" element={<ProtectedRoute role="buyer"><Payment /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute role="buyer"><MyOrders /></ProtectedRoute>} />
          <Route
            path="/customer"
            element={
              <ProtectedRoute role="buyer">
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller"
            element={
              <ProtectedRoute role="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
