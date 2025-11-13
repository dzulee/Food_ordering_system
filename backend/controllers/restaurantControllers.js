import Restaurant from "../models/Restaurant.js";

// @desc Create restaurant (only for restaurants)
// @route POST /api/restaurants
// @access Private
export const createRestaurant = async (req, res) => {
  try {
    if (req.user.role !== "restaurant") {
      return res.status(403).json({ message: "Only restaurant owners can create restaurant" });
    }

     const { name, cuisineType, location, owner } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const restaurant = await Restaurant.create({
      name,
      cuisineType,
      location,
      owner,
      image,
    });

    res.status(201).json(restaurant);
  } catch (error) {
    console.error("Create restaurant error:", error.message);
    res.status(500).json({ message: "Server error while creating restaurant" });
  }
};

// @desc Get all restaurants
// @route GET /api/restaurants
// @access Public
export const getRestaurants = async (req, res) => {
  try {
    const { cuisine, location, name } = req.query;
    const filter = {};

    if (cuisine) filter.cuisineType = new RegExp(cuisine, "i");
    if (location) filter.location = new RegExp(location, "i");
    if (name) filter.name = new RegExp(name, "i");

    const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });

    res.json(restaurants);
  } catch (error) {
    console.error("Fetch restaurants error:", error.message);
    res.status(500).json({ message: "Server error while fetching restaurants" });
  }
};

// @desc Get restaurant by ID
// @route GET /api/restaurants/:id
// @access Public
export const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Restaurant not found" });

    res.json(restaurant);
  } catch (error) {
    console.error("Get restaurant error:", error.message);
    res.status(500).json({ message: "Server error while fetching restaurant" });
  }
};

// @desc Update restaurant
// @route PUT /api/restaurants/:id
// @access Private
export const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const { name, description, location, cuisineType } = req.body;

    restaurant.name = name || restaurant.name;
    restaurant.description = description || restaurant.description;
    restaurant.location = location || restaurant.location;
    restaurant.cuisineType = cuisineType || restaurant.cuisineType;
    if (req.file) restaurant.image = `/uploads/${req.file.filename}`;

    const updated = await restaurant.save();
    res.json(updated);
  } catch (error) {
    console.error("Update restaurant error:", error.message);
    res.status(500).json({ message: "Server error while updating" });
  }
};

// @desc Delete restaurant
// @route DELETE /api/restaurants/:id
// @access Private
export const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: "Not found" });

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await restaurant.deleteOne();
    res.json({ message: "Restaurant deleted" });
  } catch (error) {
    console.error("Delete error:", error.message);
    res.status(500).json({ message: "Server error while deleting" });
  }
};
