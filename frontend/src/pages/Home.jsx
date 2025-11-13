import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import API from "../api/api";
import "../assets/css/home.css";
import placeholder from "../assets/images/placeholder.jpg";

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ location: "", cuisine: "" });
  const { cart } = useCart();

  const fetchRestaurants = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await API.get("/restaurants", {
        params: {
          location: filters.location || undefined,
          cuisine: filters.cuisine || undefined,
        },
      });
      setRestaurants(Array.isArray(data) ? data : (data.restaurants || []));
    } catch (err) {
      console.error("Error fetching restaurants:", err);
      setError("Failed to load restaurants.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = () => {
    fetchRestaurants();
  };

  return (
    <div className="bg-light">

      {/* Hero Section */}
      <header className="hero-section text-center d-flex flex-column justify-content-center align-items-center">
        <h1 className="fw-bold text-danger display-4 mb-2">FoodExpress</h1>
        <p className="text-muted mb-4">Discover the best food & drinks near you</p>

        <div className="search-bar d-flex flex-wrap justify-content-center gap-2">
          <select
            name="location"
            className="form-select border-0 bg-light shadow-sm"
            style={{ width: "200px" }}
            value={filters.location}
            onChange={handleChange}
          >
            <option value="">Select City</option>
            <option value="Nairobi">Nairobi</option>
            <option value="Mombasa">Mombasa</option>
            <option value="Kisumu">Kisumu</option>
            <option value="Nakuru">Nakuru</option>
          </select>

          <input
            type="text"
            name="cuisine"
            value={filters.cuisine}
            onChange={handleChange}
            placeholder="Search for restaurant or cuisine"
            className="form-control border-0 shadow-sm"
            style={{ width: "300px" }}
          />

          <button
            onClick={handleSearch}
            className="btn btn-danger rounded-pill px-4"
            style={{ backgroundColor: "#E23744", border: "none" }}
          >
            Search
          </button>
        </div>
      </header>

      {/* Suggested Restaurants */}
      <main className="container mt-5 mb-5">
        <h3 className="fw-bold mb-3 text-danger">Suggested Restaurants</h3>

        {loading ? (
          <p>Loading restaurants...</p>
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : restaurants.length > 0 ? (
          <div className="row">
            {restaurants.map((restaurant) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={restaurant._id}>
                <div className="card restaurant-card shadow-sm border-0 h-100">
                  <img
                      src={
                        restaurant.image
                          ? `http://localhost:5000${restaurant.image}`
                          : placeholder
                      }
                      alt={restaurant.name}
                      className="card-img-top"
                      style={{ height: "180px", objectFit: "cover" }}
                    />

                  <div className="card-body">
                    <h5 className="fw-bold text-dark">{restaurant.name}</h5>
                    <p className="text-muted mb-1">{restaurant.cuisineType}</p>
                    <p className="small mb-1">📍 {restaurant.location}</p>
                    <p className="small mb-2">⭐ {restaurant.rating}</p>
                    <Link
                      to={`/restaurant/${restaurant._id}`}
                      className="btn btn-outline-danger w-100"
                    >
                      View Menu
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted mt-5">
            <p>No restaurants found.</p>
          </div>
        )}
      </main>

      <footer className="footer py-3 text-center bg-white border-top">
        <p className="mb-0 text-muted">&copy; 2025 FoodExpress | All Rights Reserved</p>
      </footer>
    </div>
  );
};

export default Home;
