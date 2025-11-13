import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";

const AddMenuItemPage = () => {
  const { id } = useParams(); // restaurant ID
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    available: true,
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/menus", {
        restaurant: id,
        ...formData,
      });
      navigate(`/restaurants/${id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to create menu item. Ensure you are logged in as a restaurant owner.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="fw-bold text-danger mb-4">Add New Menu Item</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
        <div className="mb-3">
          <label className="form-label">Item Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Price (KES)</label>
          <input
            type="number"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          <label className="form-check-label">Available</label>
        </div>

        <button
          type="submit"
          className="btn btn-danger px-4"
          style={{ backgroundColor: "#E23744", border: "none" }}
        >
          ADD Item
        </button>
      </form>
    </div>
  );
};

export default AddMenuItemPage;
