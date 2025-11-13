import express from "express";
import {
  createMenuItem,
  getMenuByRestaurant,
  updateMenuItem,
  deleteMenuItem,
} from "../controllers/menuControllers.js";
import { protect, restaurantOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create new menu item (restaurant auto-detected)
router.post("/", protect, restaurantOnly, createMenuItem);

// ✅ Get menu by restaurant ID
router.get("/:restaurantId", getMenuByRestaurant);

// ✅ Update or delete menu item
router.put("/item/:id", protect, restaurantOnly, updateMenuItem);
router.delete("/item/:id", protect, restaurantOnly, deleteMenuItem);

export default router;
