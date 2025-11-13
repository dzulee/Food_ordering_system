import express from "express";
import {registerUser,loginUser,getUserProfile,} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.post("/register", upload.single("image"), registerUser);

router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

export default router;
