// /backend/controllers/orderController.js
import Order from "../models/Order.js";
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

// POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { items, address, paymentMethod } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    let total = 0;
    const orderItems = [];
    let restaurantId = null;

    for (const it of items) {
      const menu = await MenuItem.findById(it.menuItem).populate("restaurant");
      if (!menu) return res.status(404).json({ message: `Menu item ${it.menuItem} not found` });
      if (!menu.available) return res.status(400).json({ message: `Menu item ${menu.name} not available` });

      if (!restaurantId) restaurantId = menu.restaurant._id.toString();
      if (restaurantId !== menu.restaurant._id.toString()) {
        return res.status(400).json({ message: "All order items must be from the same restaurant" });
      }

      const qty = it.quantity && Number(it.quantity) > 0 ? Number(it.quantity) : 1;
      orderItems.push({
        menuItem: menu._id,
        name: menu.name,
        price: menu.price,
        quantity: qty,
      });
      total += menu.price * qty;
    }

    const order = await Order.create({
      customer: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount: total,
      address,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Get orders by user email
// @route   GET /api/orders/user/:email
// @access  Public (for now)
export const getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.email }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server error while fetching orders" });
  }
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email")
      .populate("restaurant", "name location");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isCustomer = order.customer._id.toString() === req.user._id.toString();
    const restaurant = await Restaurant.findById(order.restaurant);
    const isOwner = restaurant && restaurant.owner.toString() === req.user._id.toString();

    if (!isCustomer && !isOwner) return res.status(401).json({ message: "Not authorized" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("restaurant", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/orders/restaurant/:restaurantId
export const getOrdersForRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });
    if (restaurant.owner.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });

    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .sort({ createdAt: -1 })
      .populate("customer", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getOrdersByRestaurant = async (req, res) => {
  try {
    const orders = await Order.find({ restaurant: req.params.restaurantId })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch restaurant orders" });
  }
};

// PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only restaurant owner can update their orders
    if (order.restaurant.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating order status" });
  }
};


// PUT /api/orders/:id/pay
export const payOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.customer.toString() !== req.user._id.toString()) return res.status(401).json({ message: "Not authorized" });

    order.paymentResult = {
      id: req.body.id || `sim-${Date.now()}`,
      status: req.body.status || "COMPLETED",
      update_time: req.body.update_time || new Date().toISOString(),
      email_address: req.body.email_address || req.user.email,
    };

    if (order.paymentResult.status === "COMPLETED" || order.paymentResult.status === "SUCCESS") {
      order.status = "confirmed";
    }

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
