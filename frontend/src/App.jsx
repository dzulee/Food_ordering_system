import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import RestaurantDetails from "./pages/RestaurantDetailsPage";
import OrderSuccesPage from "./pages/OrderSuccessPage";
import AddMenuItemPage from "./pages/AddMenuItemPage";
import Navbar from "./components/Navbar";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import RestaurantRegister from "./pages/RestaurantRegister";
import Signup from "./pages/Signup";
import PaymentSuccess from "./pages/OrderSuccessPage";
import PaymentCancel from "./pages/PaymentCancel";





function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/my-orders" element={<OrderSuccesPage />} />
       <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/add-menu/:id" element={<AddMenuItemPage />} />
        <Route path="/dashboard" element={<RestaurantDashboard />} />
        <Route path="/register-restaurant" element={<RestaurantRegister />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />



      </Routes>
    </>
  );
}

export default App;
