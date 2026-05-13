const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT = 3001 } = process.env;
const app = express();

// --- Global Middleware ---
app.use(express.json());
app.use(cors());

// --- Routes ---
const routes = require("./routes");
app.use(routes);

// --- Error Handler (must be BEFORE listen) ---
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500 ? "An error occurred on the server" : message,
  });
});

// --- Connect to MongoDB ---
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.warn("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

// --- Start Server ---
app.listen(PORT, () => {
  console.warn(`Server is running on port ${PORT}`);
});
