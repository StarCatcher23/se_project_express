const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const NotFoundError = require("./errors/not-found-err");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001 } = process.env;
const app = express();

// --- Global Middleware ---
app.use(express.json());
app.use(cors());

// --- Routes ---
const routes = require("./routes");
app.use(routes);

// --- 404 Handler ---
app.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

// --- Celebrate Error Handler ---
app.use(errors());

// --- Centralized Error Handler ---
app.use(errorHandler);

// --- Connect to MongoDB ---
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.warn("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

// --- Start Server ---
app.listen(PORT, () => {
  console.warn(`Server is running on port ${PORT}`);
});
