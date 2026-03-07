const router = require("express").Router();
const { login, createUser } = require("../controllers/users");

// POST - User login
router.post("/signin", login);

// POST - User registration
router.post("/signup", createUser);

module.exports = router;
