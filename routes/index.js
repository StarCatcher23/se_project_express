const router = require("express").Router();
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/not-found-err");

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
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
