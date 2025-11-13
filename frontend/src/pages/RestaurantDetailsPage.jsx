// /src/pages/RestaurantDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import placeholder from "../assets/images/placeholder.jpg";

const RestaurantDetails = () => {
  const { id } = useParams(); // restaurant ID from URL
  const { addToCart } = useCart();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [activeTab, setActiveTab] = useState("menu");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/restaurants/${id}`);
        setRestaurant(data);

        // fetch menu items
        const menuRes = await API.get(`/menus/${id}`);
        setMenu(menuRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!restaurant)
    return <div className="text-center mt-5">Restaurant not found.</div>;

  return (
    <div className="container mt-4">
      {/* Header Section */}
      <div
        className="card mb-4 border-0 shadow-sm"
        style={{ backgroundColor: "#fff" }}
      >
        <img
          src={restaurant.image || placeholder}
          alt={restaurant.name}
          className="card-img-top"
          style={{
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "10px 10px 0 0",
          }}
        />
        <div className="card-body">
          <h2 className="fw-bold" style={{ color: "#E23744" }}>
            {restaurant.name}
          </h2>
          <p className="text-muted mb-1">{restaurant.cuisineType}</p>
          <p className="mb-1">📍 {restaurant.location}</p>
          <p className="mb-1">⭐ Rating: {restaurant.rating}/5</p>
          <p className="mb-0">📞 Contact: +254 700 123 456</p>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "menu" ? "active" : ""}`}
            style={{ color: activeTab === "menu" ? "#E23744" : "#000" }}
            onClick={() => setActiveTab("menu")}
          >
            Menu
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "gallery" ? "active" : ""}`}
            style={{ color: activeTab === "gallery" ? "#E23744" : "#000" }}
            onClick={() => setActiveTab("gallery")}
          >
            Gallery
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "contact" ? "active" : ""}`}
            style={{ color: activeTab === "contact" ? "#E23744" : "#000" }}
            onClick={() => setActiveTab("contact")}
          >
            Contact
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div>
        {activeTab === "menu" && (
          <div className="row">
            {menu.length > 0 ? (
              menu.map((item) => (
                <div className="col-md-4 mb-4" key={item._id}>
                  <div className="card h-100 border-0 shadow-sm">
                    <img
                      src={item.image || placeholder}
                      alt={item.name}
                      className="card-img-top"
                       style={{ height: "150px", objectFit: "cover" }}
                    />
                    
                    <div className="card-body">
                      <h5 className="fw-bold">{item.name}</h5>
                      <p className="text-muted small">{item.description}</p>
                      <p className="fw-semibold">KES {item.price}</p>
                         <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => {
                              console.log("Adding:", item);
                              addToCart({
                                _id: item._id,
                                name: item.name,
                                price: item.price,
                                image: item.image || placeholder,
                                restaurant: item.restaurant,
                              });
                            }}   
                        >
                          Add to Cart
                        </button>
                   </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted">No menu items available.</p>
            )}
          </div>
        )}

                {activeTab === "gallery" && (
              <div className="text-center">
                <img
                  src={restaurant.image || placeholder}
                  alt={restaurant.name}
                  className="img-fluid rounded shadow-sm"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              </div>
            )}


        {activeTab === "contact" && (
          <div className="p-3 border rounded">
            <h5 style={{ color: "#E23744" }}>Contact Information</h5>
            <p>📞 +254 700 123 456</p>
            <p>📧 support@foodexpress.com</p>
            <p>📍 {restaurant.location}</p>
          </div>
        )}
      </div>

      {/* Back to Cart */}
      <div className="text-center mt-4">
       <Link to="/cart" className="btn btn-outline-danger">
  Go to Cart
</Link>
      </div>
    </div>
  );
};

export default RestaurantDetails;
