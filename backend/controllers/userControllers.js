import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// REGISTER
export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    address,
    restaurantName,
    managerName,
    location,
  } = req.body;

  const normalizedEmail = email.trim().toLowerCase();
  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = new User({
    name,
    email: normalizedEmail,
    password,
    role,
    phone,
    address,
  });

  await user.save(); // ensures pre-save hash runs

  let restaurantId = null;
  if (role === "restaurant") {
    const restaurant = await Restaurant.create({
      name: restaurantName || name,
      managerName,
      location,
      owner: user._id,
      email: normalizedEmail,
      phone,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      cuisineType: "General",
      rating: 0,
    });
    restaurantId = restaurant._id;
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    restaurantId,
    token: generateToken(user._id, user.role),
  });
});

// LOGIN
export const loginUser = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const password = req.body.password;

  console.log("Attempt login for:", email);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("No user found for", email);
    return res.status(401).json({ message: "Invalid credentials" });
  }

  console.log("User found:", user.email);

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);

  if (!isMatch) {
    console.log("Password incorrect");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  let restaurantId = null;
  if (user.role === "restaurant") {
    const restaurant = await Restaurant.findOne({ owner: user._id });
    if (restaurant) restaurantId = restaurant._id;
  }

  console.log("Login successful for", user.email);

  return res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    restaurantId,
    token: generateToken(user._id, user.role),
  });
});

// PROFILE
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});
