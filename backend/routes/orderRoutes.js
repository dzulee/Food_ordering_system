import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createOrder,
  getMyOrders,
  getOrdersForRestaurant,
  getOrderById,
  updateOrderStatus,
  payOrder
} from "../controllers/orderControllers.js";

const router = express.Router();

// Create order
router.post("/", protect, createOrder);

// ✅ Restaurant fetches its orders
router.get("/restaurant/:restaurantId", protect, getOrdersForRestaurant);

// ✅ Customer fetches their own orders
router.get("/myorders", protect, getMyOrders);

// ✅ Restaurant updates status
router.put("/:id/status", protect, updateOrderStatus);

// ✅ Customer pays order
router.put("/:id/pay", protect, payOrder);

// ✅ Get single order
router.get("/:id", protect, getOrderById);

export default router;
