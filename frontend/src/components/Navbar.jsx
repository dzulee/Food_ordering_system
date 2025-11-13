import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../assets/css/navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  // Calculate total items in cart
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm py-2 px-3 sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <Link
          to="/"
          className="navbar-brand fw-bold text-danger"
          style={{ fontSize: "1.5rem" }}
        >
          FoodExpress
        </Link>

        {/* Toggle button for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMenu"
          aria-controls="navbarMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarMenu">
          <ul className="navbar-nav ms-auto align-items-center gap-2">
            {/* Manage Restaurant (for restaurant owners only) */}
            {user && user.role === "restaurant" && (
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link">
                  Manage Restaurant
                </Link>
              </li>
            )}

            {/* Cart Icon */}
            <li className="nav-item position-relative">
              <NavLink to="/cart" className="nav-link">
                <i className="bi bi-cart3 fs-5"></i>
                {totalItems > 0 && (
                  <span
                    className="badge bg-danger rounded-circle position-absolute"
                    style={{
                      top: "0",
                      right: "0",
                      fontSize: "0.7rem",
                      minWidth: "18px",
                      height: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #fff",
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </NavLink>
            </li>

            {/* Conditional Auth Buttons */}
            {user ? (
              <>
                <li className="nav-item">
                  <span className="nav-link fw-semibold">
                    👋 {user.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
              <li className="nav-item me-2">
                <Link
                  to="/login"
                  className="btn btn-outline-danger btn-sm"
                  style={{ borderColor: "#E23744" }}
                >
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  to="/register"
                  className="btn btn-danger btn-sm"
                  style={{ backgroundColor: "#E23744", border: "none" }}
                >
                  Create Account
                </Link>
              </li>


              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
