const express = require("express");
const mongoose = require("mongoose");
const { NOT_FOUND_ERROR_CODE } = require("./utils/errors");

const { PORT = 3001 } = process.env;
const app = express();

// Controllers for auth
const { login, createUser } = require("./controllers/users");

// Auth middleware
const auth = require("./middlewares/auth");

// --- Global Middleware ---
app.use(express.json());

// --- Public Routes (no auth required) ---
app.post("/signin", login);
app.post("/signup", createUser);

// Public GET /items
app.get("/items", (req, res) => {
  res.send([{ name: "Example item" }]);
});

// --- Protected Routes (everything below requires JWT) ---
app.use(auth);

const routes = require("./routes/index");
app.use("/", routes);

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

//app.js
const cors = require("cors");

app.use(cors());
