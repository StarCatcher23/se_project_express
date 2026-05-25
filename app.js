const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const NotFoundError = require("./errors/not-found-err");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

// --- Logger Middleware ---
app.use(requestLogger);

// --- Global Middleware ---
app.use(express.json());
app.use(cors());

// --- Routes ---
const routes = require("./routes");
app.use(routes);

app.use(errorLogger);

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

module.exports = app;
