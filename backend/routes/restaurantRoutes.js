import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} from "../controllers/restaurantControllers.js";

import { protect, restaurantOnly } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", upload.single("image"), createRestaurant);
router.route("/")
  .get(getRestaurants)
  .post(protect, restaurantOnly, upload.single("image"), createRestaurant);

router.route("/:id")
  .get(getRestaurantById)
  .put(protect, restaurantOnly, upload.single("image"), updateRestaurant)
  .delete(protect, restaurantOnly, deleteRestaurant);

export default router;
