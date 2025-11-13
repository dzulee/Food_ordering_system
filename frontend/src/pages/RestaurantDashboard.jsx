import { useEffect, useState } from "react";
import API from "../api/api";
import "../assets/css/restaurant.css";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
const RestaurantDashboard = () => {
  const { user } = useAuth();
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", description: "" });

  // ✅ Fetch menu and orders on load
  useEffect(() => {
    if (user && user.role === "restaurant") {
      fetchMenu();
      fetchOrders();
    }
  }, [user]);

const fetchMenu = async () => {
  try {
    const restaurantId = user.restaurantId;
    const { data } = await API.get(`/menus/${restaurantId}`);
    setMenu(data);
  } catch (error) {
    console.error("Error fetching menu:", error);
  }
};

const fetchOrders = async () => {
  try {
    const restaurantId = user?.restaurantId;
    if (!restaurantId) return console.error("Missing restaurantId");

    const { data } = await API.get(`/orders/restaurant/${restaurantId}`);
    setOrders(data);
  } catch (error) {
    console.error("Error fetching orders:", error.response?.data || error);
  }
};

const handleAddItem = async (e) => {
  e.preventDefault();
  try {
    const { data } = await API.post("/menus", newItem, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    setMenu([...menu, data]);
    setNewItem({ name: "", price: "", description: "" });
    toast.success("Menu item added!");
  } catch (error) {
    console.error("Menu add error:", error);
    toast.error("Failed to add menu item");
  }
};


  return (
    <div className="container mt-4">
      <h2 className="fw-bold" style={{ color: "#E23744" }}>
       {user?.name}'s Dashboard
      </h2>

      {/* Add Menu Item Form */}
      <div className="card p-3 shadow-sm mt-3">
        <h5>Add New Menu Item</h5>
        <form onSubmit={handleAddItem} className="row g-2">
          <div className="col-md-4">
            <input
              type="text"
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="form-control"
            />
          </div>
          <div className="col-md-1">
            <button className="btn btn-danger w-100" style={{ backgroundColor: "#E23744" }}>
              Add
            </button>
          </div>
        </form>
      </div>
      {/* Dashboard Summary */}
      <div className="row g-3 mt-4">
          <div className="col-md-3">
             <div className="card shadow-sm text-center p-3">
                <h6 className="text-muted">Total Menu Items</h6>
                <h4 className="fw-bold" style={{ color: "#E23744" }}>{menu.length}</h4>
             </div>
          </div>
          <div className="col-md-3">
              <div className="card shadow-sm text-center p-3">
                  <h6 className="text-muted">Total Orders</h6>
                  <h4 className="fw-bold" style={{ color: "#E23744" }}>{orders.length}</h4>
             </div>
          </div>
          <div className="col-md-3">
              <div className="card shadow-sm text-center p-3">
                  <h6 className="text-muted">Delivered Orders</h6>
                  <h4 className="fw-bold text-success">
                  {orders.filter((o) => o.status === "Delivered").length}
                 </h4>
            </div>
          </div>
          <div className="col-md-3">
              <div className="card shadow-sm text-center p-3">
                  <h6 className="text-muted">Total Revenue (KES)</h6>
                   <h4 className="fw-bold text-dark">
                 {orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)}
                    </h4>
              </div>
         </div>
        </div>

      {/* Menu Table */}
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Your Menu Items</h5>
          {menu.length === 0 ? (
            <p className="text-muted">No menu items yet.</p>
          ) : (
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Price (KES)</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Orders Section */}
      <div className="card mt-4 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Recent Orders</h5>
          {orders.length === 0 ? (
            <p className="text-muted">No orders yet.</p>
          ) : (
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.customer?.name}</td>
                    <td>KES {order.totalAmount}</td>
                    <td>
                      <span
                        className={`badge ${
                          order.status === "Delivered"
                            ? "bg-success"
                            : order.status === "Preparing"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
</div>
  );
};

export default RestaurantDashboard;
