const router = require("express").Router();
const auth = require("../middlewares/auth");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

// ===== PUBLIC ROUTES =====
// Auth routes (no authentication required)
const authRoutes = require("./auth");
router.use(authRoutes); // /signin, /signup

// Clothing items routes (public GET, protected POST/DELETE/PUT with inline auth)
const clothingItemsRouter = require("./clothingItems");
router.use("/items", clothingItemsRouter);

// ===== AUTHENTICATION MIDDLEWARE =====
// All routes after this require authentication
router.use(auth);

// ===== PROTECTED ROUTES =====
// User routes (authentication required)
const userRoutes = require("./users");
router.use("/users", userRoutes);

// ===== 404 HANDLER =====
router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
