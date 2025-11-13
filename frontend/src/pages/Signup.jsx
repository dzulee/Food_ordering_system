// /src/pages/Signup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [role, setRole] = useState("customer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    location: "",
    managerName: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

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
    setError("");
    setLoading(true);

    try {
      const dataToSend = new FormData();
      
      dataToSend.append("role", role);
      dataToSend.append("email", formData.email);
      dataToSend.append("password", formData.password);
      dataToSend.append("phone", formData.phone);
      dataToSend.append("address", formData.address);

      if (role === "customer") {
        dataToSend.append("name", formData.name);
      }

      if (role === "restaurant") {
        dataToSend.append("name", formData.managerName);
        dataToSend.append("restaurantName", formData.name);
        dataToSend.append("location", formData.location);
        dataToSend.append("managerName", formData.managerName);

        if (formData.image) {
          dataToSend.append("image", formData.image);
        }
      }

      const { data } = await API.post("/users/register", dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      login(data);

      navigate(role === "restaurant" ? "/dashboard" : "/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed.");
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
              Create Account
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* Role selector */}
            <div className="mb-4 text-center">
              <label className="form-label fw-semibold me-3">
                Register as:
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select text-center"
                style={{ width: "60%", margin: "0 auto" }}
              >
                <option value="customer">Customer</option>
                <option value="restaurant">Restaurant Owner</option>
              </select>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="mb-3">
                <label className="form-label">
                  {role === "restaurant" ? "Restaurant Name" : "Full Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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

              {role === "restaurant" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Manager Name</label>
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
                    <label className="form-label">Restaurant Image</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      className="form-control"
                      accept="image/*"
                    />
                  </div>
                </>
              )}

              <div className="mb-3">
                <label className="form-label">Password</label>
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
                  {loading ? "Creating..." : "Create Account"}
                </button>
              </div>
            </form>

            <p className="text-center mt-3 mb-0">
              Already have an account?{" "}
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

export default Signup;
