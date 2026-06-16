require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errors } = require("celebrate");
const NotFoundError = require("./errors/not-found-err");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const PORT = 3001;

// --- Logger Middleware ---
app.use(requestLogger);

// --- Global Middleware ---
app.use(express.json());
app.use(cors());

// --- Set User ID Middleware ---
app.use((req, res, next) => {
  req.user = { _id: "5d8b8592978f8bd833ca8133" };
  next();
});

// --- Crash Test Route (ADD THIS HERE) ---
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

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
  .then(() => {
    process.stdout.write("Connected to DB\n");
  })
  .catch((err) => {
    process.stderr.write(`DB connection error: ${err}\n`);
  });

app.listen(PORT, () => {
  process.stdout.write(`Server is running on port ${PORT}\n`);
});
