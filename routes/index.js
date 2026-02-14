const router = require("express").Router();
const clothingItem = require("./clothingItems");
const users = require("./users");
const { NOT_FOUND_ERROR_CODE } = require("../utils/errors");

router.use("/items", clothingItem);
router.use("/users", users);

router.use((req, res) => {
  res
    .status(NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
