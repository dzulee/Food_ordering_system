import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import "../assets/css/home.css";
import { useAuth } from "../context/AuthContext";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

 const { user } = useAuth(); 

const handleCheckout = () => {
  if (!user) {
    navigate("/login");
  } else {
    navigate("/checkout");
  }
};


  return (
    <div className="container mt-5">
      <h3 className="fw-bold mb-4 text-danger">Your Cart</h3>

      {cart.length === 0 ? (
        <div className="text-center mt-5">
          <p className="text-muted">Your cart is empty.</p>
          <Link to="/" className="btn btn-danger">
            Go Back to Restaurants
          </Link>
        </div>
      ) : (
        <>
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th style={{ width: "120px" }}>Quantity</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>KES {item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item._id, parseInt(e.target.value))
                      }
                      className="form-control text-center"
                    />
                  </td>
                  <td>KES {item.price * item.quantity}</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button onClick={clearCart} className="btn btn-outline-danger">
              Clear Cart
            </button>
            <h5>Total: KES {totalPrice}</h5>
          </div>

          <div className="text-end mt-3">
            <button
              onClick={handleCheckout}
              className="btn btn-danger px-4"
              style={{ backgroundColor: "#E23744", border: "none" }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
