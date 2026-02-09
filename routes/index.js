const router = require("express").Router();

const userrouter = require("./users");

router.use("/users", userrouter);

module.exports = router;
