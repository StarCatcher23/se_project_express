const express = require("express");
const mongoose = require("mongoose");
const { NOT_FOUND_ERROR_CODE } = require("./utils/errors");

const { PORT = 3001 } = process.env;
const app = express();

// --- Connect to MongoDB ---
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

// --- Global Middleware ---
app.use(express.json());

// Temporary authorization middleware (must be BEFORE routes)
app.use((req, res, next) => {
  req.user = {
    _id: "65a3e768f53ad18c6d118846", // valid 24-char ObjectId
  };
  next();
});

// --- Routes ---
const routes = require("./routes/index");
app.use(routes);
app.get("/hello", (req, res) => {
  res.send("Hello, World!");
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
