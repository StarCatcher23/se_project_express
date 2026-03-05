const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");

// GET /users/me
router.get("/me", getCurrentUser);

// PATCH /users/me
router.patch("/me", updateCurrentUser);

module.exports = router;
