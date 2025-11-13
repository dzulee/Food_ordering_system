// controllers/menuController.js
import MenuItem from "../models/MenuItem.js";
import Restaurant from "../models/Restaurant.js";

// ✅ Create a menu item (auto-link to logged-in restaurant)
export const createMenuItem = async (req, res) => {
  try {
    // Find the restaurant owned by the logged-in user
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const { name, price, description, available, image } = req.body;

    const menuItem = await MenuItem.create({
      restaurant: restaurant._id,
      name,
      price,
      description,
      available: available !== undefined ? available : true,
      image: image || null,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Server error while creating menu item" });
  }
};

// ✅ Get all menu items by restaurant
export const getMenuByRestaurant = async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.restaurantId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menus/item/:id
// @access  Private (restaurant owner)
export const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    const { name, description, price, category, image } = req.body;

    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.category = category || menuItem.category;
    menuItem.image = image || menuItem.image;

    const updated = await menuItem.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menus/item/:id
// @access  Private (restaurant owner)
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) return res.status(404).json({ message: "Item not found" });

    const restaurant = await Restaurant.findById(menuItem.restaurant);
    if (restaurant.owner.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized" });

    await menuItem.deleteOne();
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
