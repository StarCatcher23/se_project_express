const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/validation");

// POST - User login
router.post("/signin", validateLogin, login);

// POST - User registration
router.post("/signup", validateCreateUser, createUser);

module.exports = router;
