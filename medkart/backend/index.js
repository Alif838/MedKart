const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const CartItem = require("./models/CartItem");
const User = require("./models/User");
const Medicine = require("./models/Medicine");
const Settings = require("./models/Settings");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

// Validate environment variables
if (!process.env.JWT_SECRET) {
  console.error("ERROR: JWT_SECRET is not set in .env file");
  process.exit(1);
}

const app = express();

// Load initial medicines from correct path
let initialMedicines = [];
try {
  initialMedicines = require(path.join(__dirname, "data/drugs.json"));
} catch (err) {
  console.warn("Warning: Could not load drugs.json. Medicine seeding may fail.", err.message);
}

// MongoDB Atlas connect
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/medkart")
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://med-kart-wine.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "10mb" })); // Prevent large payload attacks

// ===== Auth =====

// Email validation regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - minimum 6 chars, at least 1 uppercase, 1 number
const isValidPassword = (password) => {
  return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields required" });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Validate name length
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ msg: "Name must be 2-50 characters" });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({ msg: "Password must be at least 6 characters with 1 uppercase letter and 1 number" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Create new user (password hashing happens in User model pre-save)
    const user = new User({ name, email: email.toLowerCase(), password, role: "user" });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      msg: "Registration successful",
      user: { name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ msg: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token - 24h expiration
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Login failed" });
  }
});

// ===== Medicine =====
app.get("/api/medicines", async (req, res) => {
  try {
    let medicines = await Medicine.find().lean();
    if (!medicines.length) {
      await Medicine.insertMany(initialMedicines);
      medicines = await Medicine.find().lean();
    }
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching medicines" });
  }
});

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

const requireSeller = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "seller") {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Missing token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid token" });
  }
};

app.get("/api/seller/medicines", requireSeller, async (req, res) => {
  try {
    const medicines = await Medicine.find({ sellerId: req.user.id }).lean();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ msg: "Failed to load seller medicines" });
  }
});

app.post("/api/seller/medicines", requireSeller, async (req, res) => {
  try {
    const { name, category, usage, price, image } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ msg: "Name, category, and price are required" });
    }

    // Validate price - must be positive number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ msg: "Price must be a positive number" });
    }

    // Validate name and category length
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ msg: "Medicine name must be 2-100 characters" });
    }
    if (category.length < 2 || category.length > 50) {
      return res.status(400).json({ msg: "Category must be 2-50 characters" });
    }

    const lastMedicine = await Medicine.findOne().sort({ id: -1 }).lean();
    const nextId = lastMedicine ? lastMedicine.id + 1 : 1;
    const newMedicine = new Medicine({
      id: nextId,
      name: name.trim(),
      category: category.trim(),
      usage: usage ? usage.trim() : "",
      price: priceNum,
      image: image || "",
      sellerName: req.user.name,
      sellerId: req.user.id,
    });
    await newMedicine.save();
    res.status(201).json(newMedicine);
  } catch (error) {
    console.error("Add medicine error:", error);
    res.status(500).json({ msg: "Failed to add medicine" });
  }
});

app.put("/api/seller/medicines/:id", requireAuth, async (req, res) => {
  try {
    const { name, category, usage, price, image } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({ msg: "Name, category, and price are required" });
    }

    // Validate price - must be positive number
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ msg: "Price must be a positive number" });
    }

    // Validate name and category length
    if (name.length < 2 || name.length > 100) {
      return res.status(400).json({ msg: "Medicine name must be 2-100 characters" });
    }
    if (category.length < 2 || category.length > 50) {
      return res.status(400).json({ msg: "Category must be 2-50 characters" });
    }

    let updated;
    if (req.user.role === "admin") {
      // Admin can update any product
      updated = await Medicine.findOneAndUpdate(
        { _id: req.params.id },
        { name: name.trim(), category: category.trim(), usage: usage ? usage.trim() : "", price: priceNum, image },
        { new: true }
      ).lean();
    } else {
      // Seller can only update their own product
      updated = await Medicine.findOneAndUpdate(
        { _id: req.params.id, sellerId: req.user.id },
        { name: name.trim(), category: category.trim(), usage: usage ? usage.trim() : "", price: priceNum, image },
        { new: true }
      ).lean();
    }

    if (!updated) {
      return res.status(404).json({ msg: "Product not found or not owned by you" });
    }
    res.json(updated);
  } catch (error) {
    console.error("Update medicine error:", error);
    res.status(500).json({ msg: "Failed to update product" });
  }
});

app.delete("/api/seller/medicines/:id", requireAuth, async (req, res) => {
  try {
    let deleted;
    if (req.user.role === "admin") {
      // Admin can delete any product
      deleted = await Medicine.findOneAndDelete({ _id: req.params.id }).lean();
    } else {
      // Seller can only delete their own product
      deleted = await Medicine.findOneAndDelete({ _id: req.params.id, sellerId: req.user.id }).lean();
    }

    if (!deleted) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json({ msg: "Product deleted", name: deleted.name, id: deleted._id });
  } catch (error) {
    console.error("Delete medicine error:", error);
    res.status(500).json({ msg: "Failed to delete product" });
  }
});

// ===== Cart =====
app.post("/api/cart", requireAuth, async (req, res) => {
  try {
    const item = req.body;

    if (!item || !item.id) {
      return res.status(400).json({ msg: "Invalid item" });
    }

    let existing = await CartItem.findOne({
      id: item.id,
      userId: req.user.id,
    });

    if (existing) {
      existing.quantity += 1;
      await existing.save();
    } else {
      const newItem = new CartItem({
        id: item.id,
        name: item.name,
        price: item.price,
        category: item.category,
        usage: item.usage,
        image: item.image,
        quantity: 1,
        userId: req.user.id,
      });

      await newItem.save();
    }

    const cart = await CartItem.find({
      userId: req.user.id,
    });

    res.json(cart);

  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({
      msg: "Failed to add item to cart",
    });
  }
});

app.delete("/api/cart/:id", requireAuth, async (req, res) => {
  try {
    await CartItem.deleteMany({ id: Number(req.params.id), userId: req.user.id });
    const cart = await CartItem.find({ userId: req.user.id });
    res.json(cart);
  } catch (error) {
    console.error("Delete from cart error:", error);
    res.status(500).json({ msg: "Failed to remove item from cart" });
  }
});

// ===== Admin Routes =====
app.get("/api/admin/stats", requireAuth, requireAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const medicinesCount = 50; // Placeholder, would count from medicines collection
    const ordersCount = await CartItem.countDocuments();
    res.json({ users: usersCount, medicines: medicinesCount, orders: ordersCount });
  } catch {
    res.status(500).json({ msg: "Error fetching stats" });
  }
});

app.get("/api/admin/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching users" });
  }
});

app.get("/api/admin/orders", requireAuth, requireAdmin, async (req, res) => {
  try {
    const orders = await CartItem.find(); // Cart items are global in this simple implementation
    res.json(orders);
  } catch {
    res.status(500).json({ msg: "Error fetching orders" });
  }
});

// ===== Admin User Management =====

// Delete user
app.delete("/api/admin/users/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent deleting self
    if (id === req.user.id) {
      return res.status(400).json({ msg: "Cannot delete yourself" });
    }
    
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    // Also delete their cart items
    await CartItem.deleteMany({ userId: id });
    
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ msg: "Failed to delete user" });
  }
});

// Update user
app.put("/api/admin/users/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    
    // Validate input
    if (!name || !email) {
      return res.status(400).json({ msg: "Name and email are required" });
    }
    
    if (name.length < 2 || name.length > 50) {
      return res.status(400).json({ msg: "Name must be 2-50 characters" });
    }
    
    // Check if email is already used by another user
    const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: id } });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already in use" });
    }
    
    const user = await User.findByIdAndUpdate(
      id,
      { name, email: email.toLowerCase() },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    
    res.json({ msg: "User updated successfully", user });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ msg: "Failed to update user" });
  }
});

// ===== Settings Management =====

// Get settings
app.get("/api/admin/settings", requireAuth, requireAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ msg: "Failed to fetch settings" });
  }
});

// Update settings
app.put("/api/admin/settings", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { pharmacyName, contactEmail, phoneNumber } = req.body;
    
    // Validate input
    if (!pharmacyName || !contactEmail || !phoneNumber) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }
    
    // Validate phone format (basic check for digits and common formats)
    const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ msg: "Invalid phone number format" });
    }
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ pharmacyName, contactEmail, phoneNumber });
    } else {
      settings = await Settings.findByIdAndUpdate(
        settings._id,
        { pharmacyName, contactEmail, phoneNumber },
        { new: true }
      );
    }
    
    res.json({ msg: "Settings saved successfully", settings });
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ msg: "Failed to save settings" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
