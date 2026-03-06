const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

// Auth controllers
const { login, createUser } = require("./controllers/users");

// Auth middleware
const auth = require("./middlewares/auth");

// --- Global Middleware ---
app.use(express.json());
app.use(cors());

// --- Public Routes ---
app.post("/signin", login);
app.post("/signup", createUser);

// Public GET /items (must be before auth)
const clothingItemsRouter = require("./routes/clothingItems");
app.use("/items", clothingItemsRouter); // GET only

// --- Protected Routes ---
app.use(auth);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

// Protected item routes (POST, DELETE, LIKE, etc.)
const protectedItemRoutes = require("./routes/protectedItems");
app.use("/items", protectedItemRoutes);

// Test route (protected)
app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

// --- Connect to MongoDB ---
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
