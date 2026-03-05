const express = require("express"); // Importing the Express framework to create the server and handle routing
const mongoose = require("mongoose"); // Importing Mongoose to connect to MongoDB and define schemas/models
const { NOT_FOUND_ERROR_CODE } = require("./utils/errors"); // Importing a specific error code from a utility file to standardize error responses for not found resources
//app.js
const cors = require("cors"); // Importing the CORS middleware to enable Cross-Origin Resource Sharing, allowing the server to handle requests from different origins

const { PORT = 3001 } = process.env;
const app = express();

// Controllers for auth// Importing the login and createUser functions from the users controller to handle authentication-related routes
const { login, createUser } = require("./controllers/users");

// Auth middleware// Importing the auth middleware to protect routes that require authentication, ensuring that only authenticated users can access certain endpoints
const auth = require("./middlewares/auth");

// --- Global Middleware ---// Applying middleware to parse JSON request bodies and enable CORS for all routes
app.use(express.json()); // Middleware to parse incoming JSON request bodies, making the data available on req.body for route handlers
app.use(cors());

// --- Public Routes (no auth required) ---
app.post("/signin", login); // Route for user login, allowing users to authenticate and receive a JWT token for subsequent requests
app.post("/signup", createUser); // Route for user registration, allowing new users to create an account by providing necessary details such as name, avatar, email, and password

// Public GET /items
app.get("/items", (req, res) => {
  // A public route to fetch all clothing items without requiring authentication, allowing anyone to view the items in the collection
  res.send([{ name: "Example item" }]); // Sending a simple response with an example item, this can be replaced with actual database fetching logic in the future
});

// --- Protected Routes (everything below requires JWT) ---
app.use(auth); // Applying the auth middleware to all routes defined below this line, ensuring that any route defined after this point will require a valid JWT token for access

const routes = require("./routes/index");
app.use("/", routes); // Using the imported routes from the index file, which will include all the defined routes for clothing items and user-related actions, and mounting them at the root path ("/") so that they can be accessed directly through their respective endpoints

// Test route (protected)
app.get("/hello", (req, res) => {
  // A test route to verify that the authentication middleware is working correctly, this route will only be accessible if a valid JWT token is provided in the request headers
  res.send("Hello, World!");
});

// --- Connect to MongoDB ---
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB connection error:", err));

// --- Start Server ---
app.listen(PORT, () => {
  // Starting the Express server and listening on the specified port, logging a message to the console to indicate that the server is running and ready to handle requests
  console.log(`Server is running on port ${PORT}`);
});

app.use(cors());
