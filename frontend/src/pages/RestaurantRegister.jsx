// /src/pages/RestaurantRegister.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const RestaurantRegister = () => {
  const [formData, setFormData] = useState({
    restaurantName: "",
    email: "",
    phone: "",
    location: "",
    managerName: "",
    image: null,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const dataToSend = new FormData();
      dataToSend.append("name", formData.restaurantName);
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("location", formData.location);
      dataToSend.append("manager", formData.managerName);
      dataToSend.append("role", "restaurant");
      if (formData.image) dataToSend.append("image", formData.image);

      const { data } = await API.post("/users/register", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      login(data); // save to auth context
      navigate("/dashboard"); // redirect restaurant owner
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to register restaurant account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow p-4">
            <h3 className="text-center fw-bold mb-4 text-danger">
              Register Your Restaurant
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">Restaurant Name</label>
                <input
                  type="text"
                  name="restaurantName"
                  value={formData.restaurantName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="e.g. Nairobi, Kenya"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Hotel Manager Name</label>
                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Upload Restaurant Photo</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="form-control"
                  accept="image/*"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Create Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="d-grid mt-4">
                <button
                  type="submit"
                  className="btn btn-danger"
                  style={{ backgroundColor: "#E23744", border: "none" }}
                  disabled={loading}
                >
                  {loading ? "Registering..." : "Register Restaurant"}
                </button>
              </div>
            </form>

            <p className="text-center mt-3 mb-0">
              Already registered?{" "}
              <a href="/login" className="text-danger fw-semibold">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantRegister;
