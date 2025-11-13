import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import API from "../api/api";
import "../assets/css/home.css";

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Billing form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Calculate total
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handlePayment = async (e) => {
    e.preventDefault();

    if (cart.length === 0) return setError("Your cart is empty.");
    if (!formData.name || !formData.address) return setError("Please fill all required fields.");

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // 1️⃣ Create an order first
      const orderPayload = {
        customer: user._id,
        restaurant: cart[0]?.restaurant, // assuming all items are from one restaurant
        items: cart.map((item) => ({
          menuItem: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: totalPrice,
        address: formData.address,
        paymentMethod,
      };

      const { data: createdOrder } = await API.post("/orders", orderPayload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // 2️⃣ Choose correct payment route
      let payRes;
      if (paymentMethod === "mpesa") {
  payRes = await API.post(
    "/payments/mpesa",
    {
      orderId: createdOrder._id,
      phone: formData.phone,
    },
    {
      headers: { Authorization: `Bearer ${user.token}` },
    }
  );
}

       else if (paymentMethod === "paypal") {
        payRes = await API.post(
          "/payments/paypal",
          { orderId: createdOrder._id, email: formData.email },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
          // Automatically redirect to PayPal approval page
  const approvalUrl = payRes.data.approvalUrl;
  if (approvalUrl) {
    window.location.href = approvalUrl; // 🚀 Redirect user to PayPal
    return; // stop further code execution
  }
      } else {
        payRes = await API.post(
          "/payments/cod",
          { orderId: createdOrder._id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
      }

      // 3️⃣ Success handling
      setSuccess(payRes.data.message || "Payment completed!");
      clearCart();
      setTimeout(() => navigate(`/my-orders`), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <h3 className="fw-bold mb-4 text-danger">Checkout</h3>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="row g-4">
        {/* Billing Form */}
        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3 text-danger">Billing Details</h5>
            <form onSubmit={handlePayment}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone (for M-Pesa)</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              {/* Payment Options */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Select Payment Method</label>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={paymentMethod === "mpesa"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label">M-Pesa</label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label">PayPal</label>
                </div>

                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label className="form-check-label">Cash on Delivery</label>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-danger px-4"
                disabled={loading}
                style={{ backgroundColor: "#E23744", border: "none" }}
              >
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3 text-danger">Order Summary</h5>
            {cart.length === 0 ? (
              <p className="text-muted">No items in your cart.</p>
            ) : (
              <ul className="list-group mb-3">
                {cart.map((item) => (
                  <li
                    key={item._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      {item.name} <small>x{item.quantity}</small>
                    </div>
                    <span>KES {item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
            )}
            <h5 className="text-end">Total: KES {totalPrice}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
