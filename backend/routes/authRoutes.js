// routes/authRoutes.js
import express from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Register (with optional image upload)
router.post("/register", upload.single("image"), registerUser);

// Login
router.post("/login", loginUser);

// Get profile (protected)
router.get("/profile", protect, getUserProfile);

export default router;
