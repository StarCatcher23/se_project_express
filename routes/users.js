const router = require("express").Router();
const { getUsers, createrUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", () => console.log("GET users by ID"));
router.post("/", () => createrUser);

module.exports = router;
