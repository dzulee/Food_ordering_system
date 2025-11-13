import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes (requires valid token)
const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and attach to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Restrict access to restaurant accounts only
const restaurantOnly = (req, res, next) => {
  if (req.user && req.user.role === "restaurant") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Restaurant owners only." });
  }
};

// Restrict access to admin accounts only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

export { protect, restaurantOnly, adminOnly };
