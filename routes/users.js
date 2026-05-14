const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { validateUpdateUser } = require("../middlewares/validation");

// GET /users/me
router.get("/me", getCurrentUser);

// PATCH /users/me
router.patch("/me", validateUpdateUser, updateCurrentUser);

module.exports = router;
